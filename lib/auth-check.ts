// import { getToken } from 'next-auth/jwt';
// import { NextRequest } from 'next/server';

// export async function isAuthenticated(request: NextRequest) {
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });
//   return !!token;
// }

import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function isAuthenticated(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production',
    });
    return !!token;
  } catch (err) {
    console.error('isAuthenticated getToken error', err);
    return false;
  }
}
