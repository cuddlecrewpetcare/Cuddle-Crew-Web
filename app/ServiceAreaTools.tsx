'use client';
import dynamic from 'next/dynamic';
import {useCallback,useState} from 'react';

const AddressChecker=dynamic(()=>import('./AddressChecker'),{ssr:false,loading:()=> <div className="address-checker"><p role="status">Loading the private address check…</p></div>});

export default function ServiceAreaTools(){
 const[zip,setZip]=useState('');
 const selectZip=useCallback((value:string)=>setZip(value),[]);
 return <div className="area-tools-stack"><AddressChecker onZip={selectZip}/><div className="checker"><p className="eyebrow">ZIP-only fallback</p><label htmlFor="zip">Service ZIP</label><div className="zip-actions"><input id="zip" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zip} onChange={event=>setZip(event.target.value.replace(/\D/g,''))} placeholder="95821"/><button type="button" disabled={zip.length!==5}>Check ZIP</button></div>{zip.length===5&&<div className="result" role="status"><b>Personalized travel review required</b><span>ZIP {zip} can identify the general request location, but it cannot determine an approved travel tier or availability by itself.</span></div>}</div></div>;
}
