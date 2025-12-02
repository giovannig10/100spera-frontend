import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    
    // Rotas que precisam de autenticação
    const protectedRoutes = {
        '/adm': { types: ['administrador', 'admin'], label: 'Administradores' },
        '/cozinha': { types: ['cozinha'], label: 'Cozinha' },
        '/garcom': { types: ['garcom', 'garçom'], label: 'Garçons' },
        '/caixa': { types: ['caixa'], label: 'Caixa' }
    };

    // Se não for rota protegida, permite
    const isProtected = Object.keys(protectedRoutes).some(route => 
        pathname.startsWith(route)
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    // Pega o token e tipo de usuário dos cookies
    const token = request.cookies.get('token')?.value;
    const tipoUsuario = request.cookies.get('tipoUsuario')?.value;

    // Se não tem token, redireciona para login com mensagem
    if (!token) {
        const url = new URL('/', request.url);
        url.searchParams.set('error', 'login_required');
        return NextResponse.redirect(url);
    }

    // Verifica se o usuário tem permissão para a rota
    for (const [route, config] of Object.entries(protectedRoutes)) {
        if (pathname.startsWith(route)) {
            const userType = tipoUsuario?.toLowerCase();
            const hasPermission = config.types.some(type => 
                type.toLowerCase() === userType
            );

            if (!hasPermission) {
                // Redireciona para login com mensagem de sem permissão
                const url = new URL('/', request.url);
                url.searchParams.set('error', 'unauthorized');
                return NextResponse.redirect(url);
            }
        }
    }

    return NextResponse.next();
}

// Configura quais rotas o middleware deve proteger
export const config = {
    matcher: ['/adm/:path*', '/cozinha/:path*', '/garcom/:path*', '/caixa/:path*']
};
