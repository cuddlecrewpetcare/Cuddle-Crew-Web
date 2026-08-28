'use client';
import {useEffect,useRef} from 'react';

declare global {
  interface Window {
    turnstile?: {
      render:(element:HTMLElement,options:Record<string,unknown>)=>string;
      reset:(widgetId?:string)=>void;
      remove:(widgetId:string)=>void;
    };
  }
}

export default function TurnstileWidget({siteKey,onToken,resetKey}:{siteKey:string;onToken:(token:string)=>void;resetKey:number}){
  const host=useRef<HTMLDivElement>(null),widgetId=useRef<string|undefined>(undefined);
  useEffect(()=>{
    let cancelled=false;
    const render=()=>{if(cancelled||!host.current||!window.turnstile||widgetId.current)return;widgetId.current=window.turnstile.render(host.current,{sitekey:siteKey,callback:(token:string)=>onToken(token),'expired-callback':()=>onToken(''),'error-callback':()=>onToken(''),theme:'light'});};
    const existing=document.querySelector<HTMLScriptElement>('script[data-cuddle-turnstile]');
    if(existing){if(window.turnstile)render();else existing.addEventListener('load',render,{once:true});}
    else{const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.defer=true;script.dataset.cuddleTurnstile='true';script.addEventListener('load',render,{once:true});document.head.appendChild(script);}
    return()=>{cancelled=true;if(widgetId.current&&window.turnstile){window.turnstile.remove(widgetId.current);widgetId.current=undefined;}};
  },[siteKey,onToken]);
  useEffect(()=>{if(widgetId.current&&window.turnstile){window.turnstile.reset(widgetId.current);onToken('');}},[resetKey,onToken]);
  return <div className="turnstile-field"><div ref={host}/><p className="fine-print">Security verification helps protect this form from automated abuse.</p></div>;
}
