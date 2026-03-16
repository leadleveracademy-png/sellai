'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  onConcluir: () => void
}

const TIPOS = [
  { value: 'mentoria', label: 'Mentoria individual' },
  { value: 'grupo', label: 'Programa em grupo / turma' },
  { value: 'consultoria', label: 'Consultoria' },
  { value: 'curso', label: 'Curso online / infoproduto' },
  { value: 'produto', label: 'Produto físico' },
  { value: 'servico', label: 'Serviço (agência, freelancer)' },
  { value: 'outro', label: 'Outro' },
]

const PUBLICOS = [
  { value: 'empreendedores', label: 'Empreendedores / donos de negócio' },
  { value: 'profissionais', label: 'Profissionais liberais (coaches, consultores)' },
  { value: 'gestores', label: 'Gestores e executivos' },
  { value: 'estudantes', label: 'Estudantes e jovens adultos' },
  { value: 'geral', label: 'Público geral (B2C)' },
  { value: 'empresas', label: 'Empresas (B2B)' },
  { value: 'outro', label: 'Outro' },
]

const TICKETS = [
  { value: 'ate500', label: 'Até R$ 500' },
  { value: '500a2k', label: 'R$ 500 a R$ 2.000' },
  { value: '2ka5k', label: 'R$ 2.000 a R$ 5.000' },
  { value: '5ka15k', label: 'R$ 5.000 a R$ 15.000' },
  { value: 'acima15k', label: 'Acima de R$ 15.000' },
]

const TIPO_LABELS: Record<string, string> = {
  mentoria: 'Mentoria individual',
  grupo: 'Programa em grupo',
  consultoria: 'Consultoria',
  curso: 'Curso online / infoproduto',
  produto: 'Produto físico',
  servico: 'Serviço (agência/freelancer)',
}

const PUBLICO_LABELS: Record<string, string> = {
  empreendedores: 'Empreendedores e donos de negócio',
  profissionais: 'Profissionais liberais',
  gestores: 'Gestores e executivos',
  estudantes: 'Estudantes e jovens adultos',
  geral: 'Público geral (B2C)',
  empresas: 'Empresas (B2B)',
}

const TICKET_LABELS: Record<string, string> = {
  ate500: 'Até R$ 500',
  '500a2k': 'R$ 500 a R$ 2.000',
  '2ka5k': 'R$ 2.000 a R$ 5.000',
  '5ka15k': 'R$ 5.000 a R$ 15.000',
  acima15k: 'Acima de R$ 15.000',
}

export default function BriefingSetup({ onConcluir }: Props) {
  const [passo, setPasso] = useState(1)
  const [tipo, setTipo] = useState('')
  const [tipoOutro, setTipoOutro] = useState('')
  const [publico, setPublico] = useState('')
  const [publicoOutro, setPublicoOutro] = useState('')
  const [ticket, setTicket] = useState('')
  const [detalhes, setDetalhes] = useState('')
  const [salvando, setSalvando] = useState(false)

  const podeAvancar = passo === 1
    ? tipo !== '' && (tipo !== 'outro' || tipoOutro.trim() !== '')
    : passo === 2
    ? publico !== '' && (publico !== 'outro' || publicoOutro.trim() !== '')
    : passo === 3
    ? ticket !== ''
    : true

  async function concluir() {
    setSalvando(true)
    const tipoFinal = tipo === 'outro' ? tipoOutro.trim() : (TIPO_LABELS[tipo] ?? tipo)
    const publicoFinal = publico === 'outro' ? publicoOutro.trim() : (PUBLICO_LABELS[publico] ?? publico)
    const ticketFinal = TICKET_LABELS[ticket] ?? ticket

    let briefing = `Tipo de oferta: ${tipoFinal} | Público-alvo: ${publicoFinal} | Ticket médio: ${ticketFinal}`
    if (detalhes.trim()) briefing += ` | Informações adicionais: ${detalhes.trim()}`

    try {
      await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefing }),
      })
    } catch {
      // continua mesmo se falhar — tabela pode nao existir ainda
    }
    setSalvando(false)
    onConcluir()
  }

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-8 max-w-2xl mx-auto w-full">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-brand-700" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Configure seu perfil</h1>
          <p className="text-sm text-slate-500 mt-1">
            A IA vai personalizar as respostas para o seu negócio
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                n <= passo ? 'bg-brand-600' : 'bg-slate-200'
              )}
            />
          ))}
        </div>

        {/* Passo 1 */}
        {passo === 1 && (
          <div>
            <p className="font-semibold text-slate-900 mb-4">O que você vende?</p>
            <div className="space-y-2">
              {TIPOS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTipo(opt.value)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                    tipo === opt.value
                      ? 'border-brand-500 bg-brand-50 text-brand-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300'
                  )}
                >
                  {opt.label}
                </button>
              ))}
              {tipo === 'outro' && (
                <input
                  type="text"
                  placeholder="Descreva o que você vende..."
                  value={tipoOutro}
                  onChange={(e) => setTipoOutro(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-300 text-sm outline-none focus:ring-2 focus:ring-brand-200 mt-1"
                  autoFocus
                />
              )}
            </div>
          </div>
        )}

        {/* Passo 2 */}
        {passo === 2 && (
          <div>
            <p className="font-semibold text-slate-900 mb-4">Quem é seu público-alvo?</p>
            <div className="space-y-2">
              {PUBLICOS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPublico(opt.value)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                    publico === opt.value
                      ? 'border-brand-500 bg-brand-50 text-brand-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300'
                  )}
                >
                  {opt.label}
                </button>
              ))}
              {publico === 'outro' && (
                <input
                  type="text"
                  placeholder="Descreva seu público..."
                  value={publicoOutro}
                  onChange={(e) => setPublicoOutro(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-300 text-sm outline-none focus:ring-2 focus:ring-brand-200 mt-1"
                  autoFocus
                />
              )}
            </div>
          </div>
        )}

        {/* Passo 3 */}
        {passo === 3 && (
          <div>
            <p className="font-semibold text-slate-900 mb-4">Qual o ticket médio do seu produto?</p>
            <div className="space-y-2">
              {TICKETS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTicket(opt.value)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                    ticket === opt.value
                      ? 'border-brand-500 bg-brand-50 text-brand-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Passo 4 */}
        {passo === 4 && (
          <div>
            <p className="font-semibold text-slate-900 mb-1">Informações adicionais</p>
            <p className="text-sm text-slate-500 mb-4">Opcional — quanto mais detalhar, melhores as respostas</p>
            <textarea
              rows={6}
              value={detalhes}
              onChange={(e) => setDetalhes(e.target.value)}
              placeholder={`Ex: Vendo o programa "Método X" que ajuda profissionais a conseguirem seus primeiros clientes em 30 dias. Meu principal diferencial é o acompanhamento semanal e a comunidade exclusiva.`}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand-200 resize-none bg-white"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Botoes */}
      <div className="px-4 pb-8 pt-4 max-w-2xl mx-auto w-full flex gap-3">
        {passo > 1 && (
          <button
            onClick={() => setPasso(passo - 1)}
            className="btn-secondary flex items-center gap-1.5 px-4"
          >
            <ChevronLeft size={16} />
            Voltar
          </button>
        )}
        {passo < 4 ? (
          <button
            onClick={() => setPasso(passo + 1)}
            disabled={!podeAvancar}
            className="btn-primary flex-1 flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            Próximo
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={concluir}
            disabled={salvando}
            className="btn-primary flex-1 flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {salvando ? 'Salvando...' : 'Começar a usar'}
            {!salvando && <Sparkles size={16} />}
          </button>
        )}
      </div>
    </div>
  )
}
