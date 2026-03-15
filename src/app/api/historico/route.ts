import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ erro: 'Nao autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const porPagina = 10
    const offset = (pagina - 1) * porPagina

    const { data: analises, error, count } = await supabase
      .from('analises')
      .select('*', { count: 'exact' })
      .eq('usuario_id', user.id)
      .order('criado_em', { ascending: false })
      .range(offset, offset + porPagina - 1)

    if (error) throw error

    return NextResponse.json({
      analises: analises || [],
      total: count || 0,
      pagina,
      totalPaginas: Math.ceil((count || 0) / porPagina),
    })
  } catch (erro) {
    console.error('Erro ao buscar historico:', erro)
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ erro: 'Nao autorizado' }, { status: 401 })
    }

    const { id } = await request.json()

    const { error } = await supabase
      .from('analises')
      .delete()
      .eq('id', id)
      .eq('usuario_id', user.id)

    if (error) throw error

    return NextResponse.json({ sucesso: true })
  } catch (erro) {
    console.error('Erro ao deletar analise:', erro)
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 })
  }
}
