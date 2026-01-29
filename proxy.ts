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

export async function proxy(request: NextRequest) {
  const sessionCartId = request.cookies.get('sessionCartId')?.value;

  if (!sessionCartId) {
    const newSessionCartId = crypto.randomUUID();

    const response = NextResponse.next();

    response.cookies.set('sessionCartId', newSessionCartId, {
      path: '/',
      httpOnly: true,
      secure: true,
    });

    return response;
  }
  const isProtected = protectedRoutes.some((route) =>
    route.test(request.nextUrl.pathname),
  );

  if (isProtected && !(await isAuthenticated(request))) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}
