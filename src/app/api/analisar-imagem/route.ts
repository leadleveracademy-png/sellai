import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analisarImagemComGemini } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verifica autenticacao
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { erro: 'Nao autorizado' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const arquivo = formData.get('imagem') as File

    if (!arquivo) {
      return NextResponse.json(
        { erro: 'Nenhuma imagem enviada' },
        { status: 400 }
      )
    }

    // Valida tipo do arquivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
    if (!tiposPermitidos.includes(arquivo.type)) {
      return NextResponse.json(
        { erro: 'Formato nao suportado. Use PNG, JPEG, WEBP ou GIF.' },
        { status: 400 }
      )
    }

    // Valida tamanho (max 10MB)
    const maxTamanho = 10 * 1024 * 1024
    if (arquivo.size > maxTamanho) {
      return NextResponse.json(
        { erro: 'Imagem muito grande. Maximo 10MB.' },
        { status: 400 }
      )
    }

    // Converte para base64
    const arrayBuffer = await arquivo.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')

    // Faz upload para Supabase Storage
    const nomeArquivo = `${user.id}/${Date.now()}-${arquivo.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('imagens-analise')
      .upload(nomeArquivo, buffer, {
        contentType: arquivo.type,
        upsert: false,
      })

    let imagemUrl = ''
    if (!uploadError && uploadData) {
      const { data: urlData } = supabase.storage
        .from('imagens-analise')
        .getPublicUrl(uploadData.path)
      imagemUrl = urlData.publicUrl
    }

    // Chama Gemini
    const resultadoGemini = await analisarImagemComGemini(base64, arquivo.type)

    // Salva no banco de dados
    const { data: analise, error: dbError } = await supabase
      .from('analises')
      .insert({
        usuario_id: user.id,
        imagem_url: imagemUrl,
        contexto_detectado: resultadoGemini.contexto,
        sugestoes: resultadoGemini.sugestoes,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Erro ao salvar analise:', dbError)
      // Retorna o resultado mesmo se nao conseguiu salvar
    }

    return NextResponse.json({
      sucesso: true,
      analise: {
        id: analise?.id,
        contexto: resultadoGemini.contexto,
        sugestoes: resultadoGemini.sugestoes,
        imagem_url: imagemUrl,
        criado_em: analise?.criado_em,
      },
    })
  } catch (erro) {
    console.error('Erro na analise:', erro)

    if (erro instanceof SyntaxError) {
      return NextResponse.json(
        { erro: 'Erro ao processar resposta da IA. Tente novamente.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { erro: 'Erro interno. Tente novamente em alguns segundos.' },
      { status: 500 }
    )
  }
}
