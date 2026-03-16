import { RespostaGemini } from '@/types'

const PROMPT_SOCIAL_SELLING = `Você é um especialista em vendas consultivas, social selling e fechamento de negócios no WhatsApp e Instagram.

Analise a imagem enviada — pode ser um print de conversa do WhatsApp, Instagram DM, perfil do Instagram, ou qualquer interação comercial.

Sua tarefa é:

1. IDENTIFICAR o contexto da conversa:
   - Qual é a situação atual? (lead frio, lead quente, objeção, interesse demonstrado, follow-up, etc.)
   - Qual parece ser o produto/serviço sendo vendido?
   - Qual é o estado emocional/comportamental do lead?

2. GERAR exatamente 3 sugestões de mensagens estratégicas, cada uma com um objetivo diferente:
   - Objetivo 1: Fechar a venda diretamente (abordagem direta ao fechamento)
   - Objetivo 2: Marcar uma reunião/call de vendas (mover para próxima etapa)
   - Objetivo 3: Nutrir o lead (gerar valor, manter relacionamento, criar urgência)

Para cada sugestão, forneça:
- Uma mensagem pronta para copiar e enviar (natural, sem parecer robótica)
- Uma explicação curta do porquê essa abordagem funciona nesse contexto

IMPORTANTE:
- As mensagens devem soar naturais e humanas, como um vendedor experiente escreveria
- Use o contexto visual da imagem (emojis se a conversa usa, tom informal ou formal, etc.)
- Adapte ao canal (WhatsApp vs Instagram tem estilos diferentes)
- Inclua gatilhos mentais sutis quando apropriado (escassez, prova social, reciprocidade)

Responda APENAS com um JSON válido no seguinte formato, sem markdown, sem texto antes ou depois:
{
  "contexto": "Descrição breve do que você identificou na imagem (2-3 frases)",
  "sugestoes": [
    {
      "objetivo": "fechar_venda",
      "titulo": "Fechar agora",
      "mensagem": "Mensagem pronta para enviar...",
      "explicacao": "Por que funciona nesse contexto..."
    },
    {
      "objetivo": "marcar_reuniao",
      "titulo": "Agendar call",
      "mensagem": "Mensagem pronta para enviar...",
      "explicacao": "Por que funciona nesse contexto..."
    },
    {
      "objetivo": "nutrir_lead",
      "titulo": "Nutrir relacionamento",
      "mensagem": "Mensagem pronta para enviar...",
      "explicacao": "Por que funciona nesse contexto..."
    }
  ]
}`

const MODELOS_VISION = [
  'nvidia/nemotron-nano-12b-v2-vl:free',
  'google/gemma-3-27b-it:free',
  'mistralai/mistral-small-3.1-24b-instruct:free',
]

async function chamarOpenRouter(model: string, imagemBase64: string, mimeType: string, briefing?: string) {
  const promptFinal = briefing
    ? `${PROMPT_SOCIAL_SELLING}\n\nCONTEXTO DO VENDEDOR (use para personalizar as mensagens):\n${briefing}`
    : PROMPT_SOCIAL_SELLING

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: promptFinal },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${imagemBase64}` },
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const erro = await response.text()
    throw new Error(`OpenRouter error: ${response.status} - ${erro}`)
  }

  const data = await response.json()
  if (data.error) throw new Error(`OpenRouter error: ${JSON.stringify(data.error)}`)

  const texto = data.choices?.[0]?.message?.content
  if (!texto) throw new Error('Resposta vazia da IA')

  return texto
}

export async function analisarImagemComGemini(
  imagemBase64: string,
  mimeType: string,
  briefing?: string
): Promise<RespostaGemini> {
  let ultimoErro: Error | null = null

  for (const model of MODELOS_VISION) {
    try {
      console.log(`Tentando modelo: ${model}`)
      const texto = await chamarOpenRouter(model, imagemBase64, mimeType, briefing)

      let jsonStr = texto
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()

      if (!jsonStr.startsWith('{')) {
        const match = jsonStr.match(/\{[\s\S]*\}/)
        if (match) jsonStr = match[0]
      }

      const dados = JSON.parse(jsonStr) as RespostaGemini
      console.log(`Sucesso com modelo: ${model}`)
      return dados
    } catch (err) {
      ultimoErro = err instanceof Error ? err : new Error(String(err))
      console.error(`Falha com ${model}:`, ultimoErro.message)
    }
  }

  throw ultimoErro ?? new Error('Todos os modelos falharam')
}
