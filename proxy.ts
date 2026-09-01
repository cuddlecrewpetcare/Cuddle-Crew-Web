import {NextResponse} from 'next/server';

const canonicalOrigin='https://www.cuddlecrewpetcare.com';
const legacyRoutes:Record<string,string>={
  '/services':'/#services',
  '/rates':'/#estimate',
  '/service-area':'/#area',
  '/about':'/credentials',
};

const securityHeaders={
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'strict-origin-when-cross-origin',
  'X-Frame-Options':'DENY',
  'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy':'same-origin-allow-popups',
  'Strict-Transport-Security':'max-age=31536000; includeSubDomains',
  'Content-Security-Policy':"default-src 'self'; img-src 'self' data: https://*.tile.openstreetmap.org; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; font-src 'self' data:; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
};

const withSecurityHeaders=(response:NextResponse)=>{
  Object.entries(securityHeaders).forEach(([key,value])=>response.headers.set(key,value));
  return response;
};

export function proxy(request:Request){
  const url=new URL(request.url);
  const legacyDestination=legacyRoutes[url.pathname];

  if(url.hostname==='cuddlecrewpetcare.com'||legacyDestination){
    const destination=new URL(legacyDestination||`${url.pathname}${url.search}`,canonicalOrigin);
    return withSecurityHeaders(NextResponse.redirect(destination,308));
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config={matcher:'/((?!_next/static|_next/image|favicon.ico).*)'};
