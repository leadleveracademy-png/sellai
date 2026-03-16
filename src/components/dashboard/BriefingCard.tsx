'use client'

import { useState } from 'react'
import { Settings, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  briefing: string
  onEditar: () => void
  onReiniciar: () => void
}

export default function BriefingCard({ briefing, onEditar, onReiniciar }: Props) {
  const [expandido, setExpandido] = useState(false)
  const [confirmando, setConfirmando] = useState(false)

  async function reiniciar() {
    await fetch('/api/briefing', { method: 'DELETE' })
    onReiniciar()
  }

  // Extrai partes do briefing para exibição resumida
  const partes = briefing.split(' | ').slice(0, 3)

  return (
    <div className="card border-brand-100 bg-brand-50/50">
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-brand-700 uppercase tracking-wide">
            Seu perfil configurado
          </span>
        </div>
        {expandido ? (
          <ChevronUp size={14} className="text-brand-400" />
        ) : (
          <ChevronDown size={14} className="text-brand-400" />
        )}
      </button>

      {!expandido && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {partes.map((parte, i) => {
            const valor = parte.split(': ')[1]
            return valor ? (
              <span key={i} className="text-xs bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">
                {valor}
              </span>
            ) : null
          })}
        </div>
      )}

      {expandido && (
        <div className="mt-3">
          <p className="text-sm text-slate-700 leading-relaxed">{briefing}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={onEditar}
              className="flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-100 px-3 py-1.5 rounded-lg hover:bg-brand-200 transition-colors"
            >
              <Settings size={12} />
              Editar perfil
            </button>
            {!confirmando ? (
              <button
                onClick={() => setConfirmando(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <RotateCcw size={12} />
                Reiniciar
              </button>
            ) : (
              <div className="flex gap-1.5">
                <button
                  onClick={reiniciar}
                  className="text-xs font-medium text-red-700 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setConfirmando(false)}
                  className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
