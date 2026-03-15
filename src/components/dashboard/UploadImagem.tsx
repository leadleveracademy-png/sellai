'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Upload, Camera, X, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnaliseImagem } from '@/types'

interface Props {
  onAnalise: (resultado: AnaliseImagem) => void
}

export default function UploadImagem({ onAnalise }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [arrastando, setArrastando] = useState(false)

  function selecionarArquivo(file: File) {
    setErro('')
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
    if (!tiposPermitidos.includes(file.type)) {
      setErro('Formato nao suportado. Use PNG, JPEG, WEBP ou GIF.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErro('Imagem muito grande. Maximo 10MB.')
      return
    }
    setArquivo(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) selecionarArquivo(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setArrastando(false)
    const file = e.dataTransfer.files?.[0]
    if (file) selecionarArquivo(file)
  }, [])

  function limpar() {
    setArquivo(null)
    setPreviewUrl(null)
    setErro('')
    if (inputRef.current) inputRef.current.value = ''
  }

  async function analisar() {
    if (!arquivo) return
    setErro('')
    setCarregando(true)

    try {
      const formData = new FormData()
      formData.append('imagem', arquivo)

      const response = await fetch('/api/analisar-imagem', {
        method: 'POST',
        body: formData,
      })

      const dados = await response.json()

      if (!response.ok) {
        setErro(dados.erro || 'Erro ao analisar. Tente novamente.')
        return
      }

      onAnalise(dados.analise)
      limpar()
    } catch {
      setErro('Erro de conexao. Verifique sua internet e tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="space-y-4">
      {!previewUrl ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setArrastando(true) }}
          onDragLeave={() => setArrastando(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer',
            arrastando
              ? 'border-brand-400 bg-brand-50'
              : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50 bg-white'
          )}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Enviar print de conversa</p>
              <p className="text-sm text-slate-500 mt-1">
                WhatsApp, Instagram DM, perfil ou qualquer conversa comercial
              </p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center mt-1">
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">PNG</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">JPEG</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">WEBP</span>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            capture="environment"
          />
        </div>
      ) : (
        <div className="relative bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <button
            onClick={limpar}
            className="absolute top-3 right-3 z-10 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="relative w-full" style={{ minHeight: '200px', maxHeight: '400px', overflow: 'hidden' }}>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
              style={{ maxHeight: '400px' }}
            />
          </div>
        </div>
      )}

      {/* Botao camera para mobile */}
      {!previewUrl && (
        <button
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.removeAttribute('capture')
              inputRef.current.setAttribute('capture', 'environment')
              inputRef.current.click()
            }
          }}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <Camera size={18} />
          Tirar foto agora
        </button>
      )}

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
          {erro}
        </div>
      )}

      {previewUrl && (
        <button
          onClick={analisar}
          disabled={carregando}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {carregando ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analisando com IA...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Analisar e gerar respostas
            </>
          )}
        </button>
      )}
    </div>
  )
}
