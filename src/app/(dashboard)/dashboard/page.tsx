'use client'

import { useState } from 'react'
import UploadImagem from '@/components/dashboard/UploadImagem'
import ResultadoAnalise from '@/components/dashboard/ResultadoAnalise'
import type { AnaliseImagem } from '@/types'

export default function DashboardPage() {
  const [analise, setAnalise] = useState<AnaliseImagem | null>(null)

  function handleAnalise(resultado: AnaliseImagem) {
    setAnalise(resultado)
    // Scroll para o topo para ver os resultados
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {!analise ? (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Analisar conversa</h1>
            <p className="text-sm text-slate-500 mt-1">
              Envie um print e receba respostas estrategicas prontas para usar
            </p>
          </div>

          <UploadImagem onAnalise={handleAnalise} />

          {/* Instrucoes rapidas */}
          <div className="card">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Como usar
            </p>
            <div className="space-y-2.5">
              {[
                { num: '1', texto: 'Tire um print da conversa do WhatsApp ou Instagram' },
                { num: '2', texto: 'Envie a imagem acima' },
                { num: '3', texto: 'A IA analisa o contexto e gera 3 respostas estrategicas' },
                { num: '4', texto: 'Copie e envie a mensagem que mais se encaixa' },
              ].map(({ num, texto }) => (
                <div key={num} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-brand-700">{num}</span>
                  </div>
                  <p className="text-sm text-slate-600">{texto}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Respostas geradas</h1>
            <p className="text-sm text-slate-500 mt-1">
              Escolha a abordagem e copie a mensagem pronta
            </p>
          </div>
          <ResultadoAnalise
            analise={analise}
            onNovaAnalise={() => setAnalise(null)}
          />
        </div>
      )}
    </div>
  )
}
