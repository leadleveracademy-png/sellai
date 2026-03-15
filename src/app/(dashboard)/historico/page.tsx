'use client'

import { useState, useEffect } from 'react'
import { History, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import CartaoSugestao from '@/components/dashboard/CartaoSugestao'
import { formatarData } from '@/lib/utils'
import type { AnaliseImagem } from '@/types'

interface RespostaHistorico {
  analises: AnaliseImagem[]
  total: number
  pagina: number
  totalPaginas: number
}

export default function HistoricoPage() {
  const [dados, setDados] = useState<RespostaHistorico | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [expandido, setExpandido] = useState<string | null>(null)
  const [deletando, setDeletando] = useState<string | null>(null)

  async function carregarHistorico(pagina = 1) {
    setCarregando(true)
    try {
      const res = await fetch(`/api/historico?pagina=${pagina}`)
      const data = await res.json()
      setDados(data)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarHistorico()
  }, [])

  async function deletar(id: string) {
    setDeletando(id)
    try {
      await fetch('/api/historico', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setDados((prev) => prev ? {
        ...prev,
        analises: prev.analises.filter((a) => a.id !== id),
        total: prev.total - 1,
      } : null)
    } finally {
      setDeletando(null)
    }
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Historico</h1>
        <p className="text-sm text-slate-500 mt-1">
          {dados?.total || 0} analise{(dados?.total || 0) !== 1 ? 's' : ''} salva{(dados?.total || 0) !== 1 ? 's' : ''}
        </p>
      </div>

      {!dados?.analises.length ? (
        <div className="card text-center py-10">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <History className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm">Nenhuma analise ainda.</p>
          <p className="text-slate-400 text-xs mt-1">Suas analises aparecao aqui.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dados.analises.map((analise) => (
            <div key={analise.id} className="card">
              {/* Header do card */}
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => setExpandido(expandido === analise.id ? null : analise.id)}
                  className="flex-1 text-left"
                >
                  <p className="text-sm text-slate-400 mb-1">
                    {formatarData(analise.criado_em)}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">
                    {analise.contexto_detectado}
                  </p>
                  <span className="text-xs text-brand-600 font-medium mt-1 flex items-center gap-1">
                    {expandido === analise.id ? (
                      <><ChevronUp size={14} /> Ocultar respostas</>
                    ) : (
                      <><ChevronDown size={14} /> Ver {analise.sugestoes?.length || 3} respostas</>
                    )}
                  </span>
                </button>
                <button
                  onClick={() => deletar(analise.id)}
                  disabled={deletando === analise.id}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 flex-shrink-0"
                >
                  {deletando === analise.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>

              {/* Sugestoes expandidas */}
              {expandido === analise.id && analise.sugestoes && (
                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                  {analise.sugestoes.map((sugestao, idx) => (
                    <CartaoSugestao key={idx} sugestao={sugestao} index={idx} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
