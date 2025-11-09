import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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

  return NextResponse.next();
}
