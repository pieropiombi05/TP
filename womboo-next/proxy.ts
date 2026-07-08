import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_INDICIO_SESION } from './lib/supabase';

// Defensa en profundidad para /admin y /api/admin. OJO: esto NO es la
// seguridad real de los datos, solo un filtro temprano/UX:
// - Para /api/admin, el gate real es requireAdmin (lib/auth.js), que valida
//   el JWT contra Supabase en cada handler. Acá solo cortamos rápido si ni
//   siquiera vino un header Authorization, para no pegarle a Supabase en vano.
// - Para /admin, redirigimos si no hay ni un indicio de sesión (una cookie
//   liviana, sin datos sensibles, que las páginas setean/limpian junto a la
//   sesión real de Supabase que vive en localStorage y que este proxy no
//   puede leer). Evita el flash del panel; no reemplaza el guard de cliente
//   ni, mucho menos, la validación del servidor.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/admin')) {
    if (!request.headers.get('authorization')) {
      return NextResponse.json(
        { success: false, error: 'No autenticado.' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const tieneIndicioDeSesion = request.cookies.has(COOKIE_INDICIO_SESION);
    if (!tieneIndicioDeSesion) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
