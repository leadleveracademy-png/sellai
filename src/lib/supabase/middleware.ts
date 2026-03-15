import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rotas protegidas — redireciona para login se nao autenticado
  const rotasProtegidas = ['/dashboard', '/historico', '/scripts']
  const rotaAtual = request.nextUrl.pathname
  const precisaAuth = rotasProtegidas.some((rota) => rotaAtual.startsWith(rota))

  if (precisaAuth && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Se ja autenticado e tentando acessar login/cadastro, redireciona ao dashboard
  const rotasPublicas = ['/login', '/cadastro']
  const eRotaPublica = rotasPublicas.some((rota) => rotaAtual.startsWith(rota))

  if (eRotaPublica && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
