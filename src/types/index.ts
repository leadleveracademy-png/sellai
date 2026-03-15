export interface Usuario {
  id: string
  email: string
  nome?: string
  criado_em: string
}

export interface AnaliseImagem {
  id: string
  usuario_id: string
  imagem_url: string
  contexto_detectado: string
  sugestoes: SugestaoResposta[]
  criado_em: string
}

export interface SugestaoResposta {
  objetivo: 'fechar_venda' | 'marcar_reuniao' | 'nutrir_lead'
  titulo: string
  mensagem: string
  explicacao: string
}

export interface Script {
  id: string
  titulo: string
  categoria: string
  conteudo: string
  tags: string[]
}

export interface RespostaGemini {
  contexto: string
  sugestoes: SugestaoResposta[]
}
