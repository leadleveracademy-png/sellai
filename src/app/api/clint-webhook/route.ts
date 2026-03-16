import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const payload = await req.json()

    const { error } = await supabase.from('clint_eventos').insert({
      evento: payload.event ?? payload.tipo ?? payload.type ?? 'desconhecido',
      deal_id: payload.deal?.id ?? payload.id ?? null,
      deal_nome: payload.deal?.name ?? payload.name ?? null,
      deal_etapa: payload.deal?.stage ?? payload.stage ?? null,
      deal_valor: payload.deal?.value ?? payload.value ?? null,
      contato_nome: payload.contact?.name ?? payload.contact_name ?? null,
      contato_email: payload.contact?.email ?? payload.contact_email ?? null,
      contato_telefone: payload.contact?.phone ?? payload.contact_phone ?? null,
      responsavel: payload.user?.name ?? payload.owner ?? payload.assigned_to ?? null,
      payload: payload,
    })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
