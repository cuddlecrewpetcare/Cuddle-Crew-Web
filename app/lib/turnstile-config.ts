export type TurnstileMode='off'|'enabled'|'misconfigured';

export const turnstileMode=(siteKey?:string,secretKey?:string):TurnstileMode=>{
  const hasSiteKey=Boolean(siteKey?.trim());
  const hasSecretKey=Boolean(secretKey?.trim());
  if(hasSiteKey!==hasSecretKey)return'misconfigured';
  return hasSiteKey?'enabled':'off';
};
