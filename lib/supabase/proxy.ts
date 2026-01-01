import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
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

  // Protect /dashboard routes (requires auth)
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // <CHANGE> Protect /books and /my-borrows routes (requires auth)
  if (
    (request.nextUrl.pathname.startsWith('/books') ||
      request.nextUrl.pathname.startsWith('/my-borrows') ||
      request.nextUrl.pathname.startsWith('/profile')) &&
    !user
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // <CHANGE> Protect /admin routes (requires auth + ADMIN role)
  // if (request.nextUrl.pathname.startsWith('/admin')) {
  //   if (!user) {
  //     const url = request.nextUrl.clone()
  //     url.pathname = '/auth/login'
  //     return NextResponse.redirect(url)
  //   }

    // <CHANGE> Check role field instead of is_admin
  //   const { data: profile } = await supabase
  //     .from('profiles')
  //     .select('role')
  //     .eq('id', user.id)
  //     .single()

  //   if (profile?.role !== 'ADMIN') {
  //     const url = request.nextUrl.clone()
  //     url.pathname = '/unauthorized'
  //     return NextResponse.redirect(url)
  //   }
  // }

  // <CHANGE> Redirect authenticated users from auth pages to their dashboard
  if (request.nextUrl.pathname.startsWith('/auth/login') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const url = request.nextUrl.clone()
    url.pathname = profile?.role === 'ADMIN' ? '/admin' : '/books'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
