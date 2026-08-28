import type { NextConfig } from 'next';

const securityHeaders=[
 {key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
 {key:'X-Frame-Options',value:'DENY'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
 {key:'Strict-Transport-Security',value:'max-age=31536000; includeSubDomains'},
 {key:'Content-Security-Policy',value:"default-src 'self'; img-src 'self' data: https://*.tile.openstreetmap.org; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://api.resend.com https://challenges.cloudflare.com; font-src 'self' data:; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"},
];
const nextConfig: NextConfig = {async headers(){return[{source:'/:path*',headers:securityHeaders}]}};

export default nextConfig;
