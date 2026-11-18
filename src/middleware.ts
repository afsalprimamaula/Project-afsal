import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAnggotaRoute = pathname.startsWith('/anggota');
  const isPengurusRoute = pathname.startsWith('/pengurus');

  // Not authenticated — redirect to home with query param
  if (!user && (isAnggotaRoute || isPengurusRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('login', 'required');
    return NextResponse.redirect(url);
  }

  // Authenticated — check role for /pengurus
  if (user && isPengurusRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'pengurus') {
      const url = request.nextUrl.clone();
      url.pathname = '/anggota';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/anggota/:path*', '/pengurus/:path*'],
};
