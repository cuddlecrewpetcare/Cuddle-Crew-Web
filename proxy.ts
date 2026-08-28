import {NextResponse} from 'next/server';

const securityHeaders={
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'strict-origin-when-cross-origin',
  'X-Frame-Options':'DENY',
  'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security':'max-age=31536000; includeSubDomains',
  'Content-Security-Policy':"default-src 'self'; img-src 'self' data: https://*.tile.openstreetmap.org; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://api.resend.com https://challenges.cloudflare.com; font-src 'self' data:; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
};

export function proxy(){
  const response=NextResponse.next();
  Object.entries(securityHeaders).forEach(([key,value])=>response.headers.set(key,value));
  return response;
}

export const config={matcher:'/((?!_next/static|_next/image|favicon.ico).*)'};
