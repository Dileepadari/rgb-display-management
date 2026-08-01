import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // getUser() revalidates the session against the Supabase auth server,
  // unlike getSession() which only trusts the (spoofable) cookie value.
  const { data: { user } } = await supabase.auth.getUser()

  // Device-facing routes authenticate via their own per-device token, not a
  // Supabase user session (the ESP32 can't log in) — skip the session gate.
  // Cron routes authenticate via CRON_SECRET (checked in the route itself).
  const skipsSessionGate =
    request.nextUrl.pathname.startsWith('/api/device-feed/') ||
    request.nextUrl.pathname.startsWith('/api/cron/')

  // If API route and no authenticated user, return 401
  if (request.nextUrl.pathname.startsWith('/api/') && !skipsSessionGate && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return res
}

export const config = {
  matcher: [
    // Exclude static files and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Include all API routes
    "/api/:path*"
  ],
}
