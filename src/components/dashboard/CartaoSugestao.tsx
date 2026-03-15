'use client'

import { useState } from 'react'
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn, LABELS_OBJETIVO, CORES_OBJETIVO } from '@/lib/utils'
import type { SugestaoResposta } from '@/types'

interface Props {
  sugestao: SugestaoResposta
  index: number
}

export default function CartaoSugestao({ sugestao, index }: Props) {
  const [copiado, setCopiado] = useState(false)
  const [expandido, setExpandido] = useState(index === 0)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(sugestao.mensagem)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Fallback para dispositivos sem clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = sugestao.mensagem
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  return (
    <div className="card border border-slate-100">
      {/* Header */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full flex items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-brand-600">{index + 1}</span>
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">{sugestao.titulo}</p>
            <span className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full border inline-block mt-0.5',
              CORES_OBJETIVO[sugestao.objetivo]
            )}>
              {LABELS_OBJETIVO[sugestao.objetivo]}
            </span>
          </div>
        </div>
        {expandido ? <ChevronUp size={18} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />}
      </button>

      {/* Conteudo expandido */}
      {expandido && (
        <div className="mt-4 space-y-3">
          {/* Mensagem */}
          <div className="bg-slate-50 rounded-xl p-4 relative">
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap pr-8">
              {sugestao.mensagem}
            </p>
          </div>

          {/* Explicacao */}
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
            <p className="text-xs text-slate-500 leading-relaxed">{sugestao.explicacao}</p>
          </div>

          {/* Botao copiar */}
          <button
            onClick={copiar}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
              copiado
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98]'
            )}
          >
            {copiado ? (
              <>
                <Check size={16} />
                Copiado!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copiar mensagem
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
