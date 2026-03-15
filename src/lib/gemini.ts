import { GoogleGenerativeAI } from '@google/generative-ai'
import { RespostaGemini, SugestaoResposta } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

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

export async function analisarImagemComGemini(
  imagemBase64: string,
  mimeType: string
): Promise<RespostaGemini> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const imagePart = {
    inlineData: {
      data: imagemBase64,
      mimeType: mimeType,
    },
  }

  const result = await model.generateContent([PROMPT_SOCIAL_SELLING, imagePart])
  const response = await result.response
  const texto = response.text()

  // Limpa possivel markdown ao redor do JSON
  const jsonLimpo = texto
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  const dados = JSON.parse(jsonLimpo) as RespostaGemini
  return dados
}
