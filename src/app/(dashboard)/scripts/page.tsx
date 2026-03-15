'use client'

import { useState } from 'react'
import { Copy, Check, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

// Biblioteca de scripts internos — adicione novos scripts aqui
const SCRIPTS = [
  {
    id: '1',
    categoria: 'Abertura',
    titulo: 'Primeiro contato — lead frio (Instagram)',
    tags: ['instagram', 'prospecao'],
    conteudo: `Oi [Nome]! Vi seu perfil e achei muito interessante o que voce faz com [assunto do perfil].

Trabalho ajudando [nicho] a [resultado especifico] e achei que poderia fazer sentido trocarmos uma ideia.

Posso te contar como funciona em 2 minutinhos?`,
  },
  {
    id: '2',
    categoria: 'Abertura',
    titulo: 'Resposta para "quanto custa?"',
    tags: ['objecao', 'preco'],
    conteudo: `O valor varia de acordo com a sua situacao especifica e o que faz mais sentido pra voce.

Mas antes de te passar um numero, quero entender melhor o que voce precisa pra garantir que o que eu ofeco vai realmente resolver o seu problema.

Tem 15 minutinhos essa semana pra gente conversar rapidinho?`,
  },
  {
    id: '3',
    categoria: 'Follow-up',
    titulo: 'Follow-up apos silencio (3-5 dias)',
    tags: ['follow-up', 'reativacao'],
    conteudo: `Oi [Nome], tudo bem?

Passei aqui so pra checar se voce teve chance de pensar no que conversamos.

Sem pressao — se nao for o momento certo, sem problema. So queria garantir que nao ficou nenhuma duvida em aberto.`,
  },
  {
    id: '4',
    categoria: 'Fechamento',
    titulo: 'Fechamento com urgencia real',
    tags: ['fechamento', 'urgencia'],
    conteudo: `[Nome], so pra te avisar: estou fechando as ultimas vagas dessa turma ate sexta-feira.

Depois disso, a proxima abertura so vai ser em [data].

Se voce tem interesse, esse e o melhor momento pra garantir sua vaga. O que precisa saber pra tomar essa decisao hoje?`,
  },
  {
    id: '5',
    categoria: 'Objecoes',
    titulo: 'Contornar "preciso pensar"',
    tags: ['objecao', 'fechamento'],
    conteudo: `Claro, e super importante voce ter certeza!

So me diz: o que especificamente voce precisa avaliar? Assim posso te ajudar com essa parte agora mesmo e voce ja tira qualquer duvida.`,
  },
  {
    id: '6',
    categoria: 'Reuniao',
    titulo: 'Convite para call de vendas',
    tags: ['reuniao', 'agendamento'],
    conteudo: `Que tal a gente marcar uma call de 20 minutinhos?

Assim eu entendo melhor a sua situacao e te mostro exatamente como funciona — sem enrolacao.

Tenho horario na [dia] as [hora] ou [dia] as [hora]. Qual funciona melhor pra voce?`,
  },
]

const CATEGORIAS = ['Todas', ...Array.from(new Set(SCRIPTS.map((s) => s.categoria)))]

export default function ScriptsPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas')
  const [copiados, setCopiados] = useState<Record<string, boolean>>({})

  const scriptsFiltrados = categoriaAtiva === 'Todas'
    ? SCRIPTS
    : SCRIPTS.filter((s) => s.categoria === categoriaAtiva)

  async function copiar(id: string, texto: string) {
    try {
      await navigator.clipboard.writeText(texto)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = texto
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopiados((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => setCopiados((prev) => ({ ...prev, [id]: false })), 2000)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Scripts</h1>
        <p className="text-sm text-slate-500 mt-1">
          Biblioteca de mensagens prontas da equipe
        </p>
      </div>

      {/* Filtros de categoria */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className={cn(
              'flex-shrink-0 text-sm font-medium px-4 py-2 rounded-full transition-colors',
              categoriaAtiva === cat
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lista de scripts */}
      <div className="space-y-3">
        {scriptsFiltrados.map((script) => (
          <div key={script.id} className="card">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  {script.categoria}
                </span>
                <p className="font-semibold text-slate-900 text-sm mt-2">{script.titulo}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-3">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {script.conteudo}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {script.tags.map((tag) => (
                  <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => copiar(script.id, script.conteudo)}
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all',
                  copiados[script.id]
                    ? 'bg-green-50 text-green-700'
                    : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                )}
              >
                {copiados[script.id] ? <Check size={14} /> : <Copy size={14} />}
                {copiados[script.id] ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
