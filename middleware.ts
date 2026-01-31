// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { isAuthenticated } from '@/lib/auth-check';

// const protectedRoutes = [
//   /\/shipping-address/,
//   /\/payment-method/,
//   /\/place-order/,
//   /\/profile/,
//   /\/user\/(.*)/,
//   /\/order\/(.*)/,
//   /\/admin/,
// ];

// export async function middleware(request: NextRequest) {
//   const sessionCartId = request.cookies.get('sessionCartId')?.value;

//   if (!sessionCartId) {
//     const newSessionCartId = crypto.randomUUID();

//     const response = NextResponse.next();

//     response.cookies.set('sessionCartId', newSessionCartId, {
//       path: '/',
//       httpOnly: true,
//       // secure: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//     });

//     return response;
//   }
//   const isProtected = protectedRoutes.some((route) =>
//     route.test(request.nextUrl.pathname),
//   );

//   if (isProtected && !(await isAuthenticated(request))) {
//     return NextResponse.redirect(new URL('/sign-in', request.url));
//   }

//   return NextResponse.next();
// }

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) return NextResponse.redirect(new URL('/sign-in', request.url));

  const response = NextResponse.next();

  if (!request.cookies.get('sessionCartId')) {
    response.cookies.set('sessionCartId', crypto.randomUUID(), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/shipping-address',
    '/payment-method',
    '/place-order',
    '/profile',
    '/user/:path*',
    '/order/:path*',
    '/admin/:path*',
  ],
};
