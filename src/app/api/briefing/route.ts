import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ erro: 'Nao autorizado' }, { status: 401 })

  const { data } = await supabase
    .from('perfis')
    .select('briefing')
    .eq('usuario_id', user.id)
    .single()

  return NextResponse.json({ briefing: data?.briefing ?? null })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ erro: 'Nao autorizado' }, { status: 401 })

  const { briefing } = await request.json()
  if (!briefing || typeof briefing !== 'string' || !briefing.trim()) {
    return NextResponse.json({ erro: 'Briefing invalido' }, { status: 400 })
  }

  const { error } = await supabase
    .from('perfis')
    .upsert({ usuario_id: user.id, briefing: briefing.trim() }, { onConflict: 'usuario_id' })

  if (error) return NextResponse.json({ erro: error.message }, { status: 500 })
  return NextResponse.json({ sucesso: true })
}

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ erro: 'Nao autorizado' }, { status: 401 })

  await supabase.from('perfis').delete().eq('usuario_id', user.id)
  return NextResponse.json({ sucesso: true })
}
