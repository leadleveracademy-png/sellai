'use client'

import { useState } from 'react'
import { ArrowLeft, Brain, ChevronDown, ChevronUp, ImageIcon } from 'lucide-react'
import CartaoSugestao from './CartaoSugestao'
import type { AnaliseImagem } from '@/types'

interface Props {
  analise: AnaliseImagem
  imagemUrl: string
  onNovaAnalise: () => void
}

export default function ResultadoAnalise({ analise, imagemUrl, onNovaAnalise }: Props) {
  const [imagemExpandida, setImagemExpandida] = useState(false)

  return (
    <div className="space-y-4">
      {/* Imagem colapsavel */}
      {imagemUrl && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <button
            onClick={() => setImagemExpandida(!imagemExpandida)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ImageIcon size={16} className="text-slate-400" />
              Print enviado
            </div>
            {imagemExpandida ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>
          {imagemExpandida && (
            <div className="border-t border-slate-100">
              <img
                src={imagemUrl}
                alt="Print analisado"
                className="w-full object-contain max-h-96"
              />
            </div>
          )}
        </div>
      )}

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
