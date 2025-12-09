import { NextResponse } from 'next/server';

export function proxy(request) {
    const { pathname } = request.nextUrl;
    
    const protectedRoutes = {
        '/adm': { types: ['administrador'], label: 'Administradores' },
        '/cozinha': { types: ['cozinha'], label: 'Cozinha' },
        '/garcom': { types: ['garcom', 'garçom'], label: 'Garçons' },
        '/caixa': { types: ['caixa'], label: 'Caixa' }
    };

    const isProtected = Object.keys(protectedRoutes).some(route => 
        pathname.startsWith(route)
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;
    const tipoUsuario = request.cookies.get('tipoUsuario')?.value;

    if (!token) {
        const url = new URL('/', request.url);
        url.searchParams.set('error', 'login_required');
        return NextResponse.redirect(url);
    }

    for (const [route, config] of Object.entries(protectedRoutes)) {
        if (pathname.startsWith(route)) {
            const userType = tipoUsuario?.toLowerCase();
            
            if (userType === 'administrador') {
                return NextResponse.next();
            }
            
            const hasPermission = config.types.some(type => 
                type.toLowerCase() === userType
            );

            if (!hasPermission) {
                const url = new URL('/', request.url);
                url.searchParams.set('error', 'unauthorized');
                return NextResponse.redirect(url);
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/adm/:path*', '/cozinha/:path*', '/garcom/:path*', '/caixa/:path*']
};
