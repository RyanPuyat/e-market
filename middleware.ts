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
import { isAuthenticated } from '@/lib/auth-check';

const protectedRoutes = [
  /\/shipping-address/,
  /\/payment-method/,
  /\/place-order/,
  /\/profile/,
  /\/user\/(.*)/,
  /\/order\/(.*)/,
  /\/admin/,
];

function isAuthRoute(pathname: string) {
  return (
    pathname.startsWith('/api/auth') ||
    pathname === '/sign-in' ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // safety: don't intercept auth or static routes
  if (isAuthRoute(pathname)) return NextResponse.next();

  // only run auth logic for protected routes
  const isProtected = protectedRoutes.some((r) => r.test(pathname));
  if (!isProtected) return NextResponse.next();

  // ensure sessionCartId exists and set it on the response we return
  const sessionCartId = request.cookies.get('sessionCartId')?.value;
  if (!sessionCartId) {
    const id = crypto.randomUUID();
    const res = NextResponse.next();
    res.cookies.set('sessionCartId', id, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    // debug header
    res.headers.set('x-debug-sessionCart', 'created');
    return res;
  }

  // check auth safely
  let auth = false;
  try {
    auth = await isAuthenticated(request);
  } catch (err) {
    console.error('isAuthenticated error', err);
    auth = false;
  }

  const res = NextResponse.next();
  res.headers.set('x-debug-auth', auth ? 'true' : 'false');

  if (!auth) {
    const redirectRes = NextResponse.redirect(new URL('/sign-in', request.url));
    // if you need to preserve sessionCartId on redirect, set it here too
    redirectRes.cookies.set('sessionCartId', sessionCartId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    redirectRes.headers.set('x-debug-redirect', 'true');
    return redirectRes;
  }

  return res;
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
