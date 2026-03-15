import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatarData(dataString: string): string {
  const data = new Date(dataString)
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function converterParaBase64(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(arquivo)
    reader.onload = () => {
      const resultado = reader.result as string
      // Remove o prefixo "data:image/jpeg;base64,"
      const base64 = resultado.split(',')[1]
      resolve(base64)
    }
    reader.onerror = (erro) => reject(erro)
  })
}

export const LABELS_OBJETIVO = {
  fechar_venda: 'Fechar Venda',
  marcar_reuniao: 'Marcar Reuniao',
  nutrir_lead: 'Nutrir Lead',
} as const

export const CORES_OBJETIVO = {
  fechar_venda: 'bg-green-100 text-green-800 border-green-200',
  marcar_reuniao: 'bg-blue-100 text-blue-800 border-blue-200',
  nutrir_lead: 'bg-amber-100 text-amber-800 border-amber-200',
} as const
