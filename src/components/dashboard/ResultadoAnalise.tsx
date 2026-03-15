'use client'

import { ArrowLeft, Brain } from 'lucide-react'
import CartaoSugestao from './CartaoSugestao'
import type { AnaliseImagem } from '@/types'

interface Props {
  analise: AnaliseImagem
  onNovaAnalise: () => void
}

export default function ResultadoAnalise({ analise, onNovaAnalise }: Props) {
  return (
    <div className="space-y-5">
      {/* Contexto detectado */}
      <div className="card bg-brand-50 border-brand-100">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-brand-700" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide mb-1">
              Contexto identificado
            </p>
            <p className="text-sm text-brand-900 leading-relaxed">{analise.contexto_detectado}</p>
          </div>
        </div>
      </div>

      {/* Sugestoes */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          3 sugestoes estrategicas
        </p>
        <div className="space-y-3">
          {analise.sugestoes.map((sugestao, index) => (
            <CartaoSugestao key={index} sugestao={sugestao} index={index} />
          ))}
        </div>
      </div>

      {/* Botao nova analise */}
      <button
        onClick={onNovaAnalise}
        className="btn-secondary flex items-center justify-center gap-2"
      >
        <ArrowLeft size={16} />
        Analisar outro print
      </button>
    </div>
  )
}
