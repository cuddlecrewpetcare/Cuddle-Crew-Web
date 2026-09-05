'use client';
import {useEffect,useId,useRef,useState} from 'react';

type Suggestion={id:string;label:string};
type Check={available:boolean;zip:string;city:string;travelTier?:{key:string;name:string;fee:number|null;reviewRequired:boolean};travelContext?:string};
const jsonObject=async(response:Response)=>await response.json() as Record<string,unknown>;

export default function AddressChecker({onZip}:{onZip:(zip:string)=>void}){
 const id=useId(),listId=`${id}-suggestions`,instructionId=`${id}-instructions`,statusId=`${id}-status`;
 const skipNextAutocomplete=useRef(false),checkController=useRef<AbortController|null>(null);
 const[address,setAddress]=useState(''),[suggestions,setSuggestions]=useState<Suggestion[]>([]),[activeIndex,setActiveIndex]=useState(-1),[suggestionStatus,setSuggestionStatus]=useState(''),[result,setResult]=useState<Check|null>(null),[status,setStatus]=useState<'idle'|'loading'|'unavailable'|'error'>('idle'),[message,setMessage]=useState('');

 useEffect(()=>{
  if(skipNextAutocomplete.current){skipNextAutocomplete.current=false;return}
  if(address.trim().length<4){const timer=setTimeout(()=>{setSuggestions([]);setActiveIndex(-1);setSuggestionStatus('')},0);return()=>clearTimeout(timer)}
  const controller=new AbortController(),timer=setTimeout(async()=>{
   try{
    const response=await fetch('/api/address/suggestions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input:address}),signal:controller.signal});
    const data=await jsonObject(response),next=Array.isArray(data.suggestions)?data.suggestions as Suggestion[]:[];
    setSuggestions(next);setActiveIndex(-1);setSuggestionStatus(next.length?`${next.length} address suggestion${next.length===1?'':'s'} available. Use the up and down arrow keys to review them.`:'No address suggestions available. You can still enter the address and check it.');
    if(data.available===false)setStatus('unavailable');
   }catch{if(!controller.signal.aborted){setSuggestions([]);setActiveIndex(-1);setSuggestionStatus('Address suggestions are unavailable. You can still enter the address and check it.');setStatus('unavailable')}}
  },350);
  return()=>{clearTimeout(timer);controller.abort()};
 },[address]);

 useEffect(()=>()=>checkController.current?.abort(),[]);

 const check=async(value=address)=>{
  checkController.current?.abort();const controller=new AbortController();checkController.current=controller;setStatus('loading');setMessage('');setSuggestions([]);setActiveIndex(-1);setSuggestionStatus('Checking the address.');
  try{
   const response=await fetch('/api/address/check',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({address:value}),signal:controller.signal});
   const data=await jsonObject(response);if(controller.signal.aborted)return;
   if(data.available===false){setStatus('unavailable');setSuggestionStatus('');return}
   if(!response.ok){setStatus('error');setMessage(typeof data.error==='string'?data.error:'Contact Lauren for a travel review.');setSuggestionStatus('');return}
   const checked=data as unknown as Check;setResult(checked);setStatus('idle');setSuggestionStatus('');onZip(checked.zip);
   if(checked.travelTier)window.dispatchEvent(new CustomEvent('cuddlecrew:travel-tier',{detail:{zip:checked.zip,tier:checked.travelTier.key}}));
  }catch{if(!controller.signal.aborted){setStatus('unavailable');setSuggestionStatus('')}}finally{if(checkController.current===controller)checkController.current=null}
 };

 const selectSuggestion=(item:Suggestion)=>{skipNextAutocomplete.current=true;setSuggestions([]);setActiveIndex(-1);setSuggestionStatus('Address selected. Checking the address.');setAddress(item.label);void check(item.label)};
 const editAddress=(value:string)=>{skipNextAutocomplete.current=false;setAddress(value);setSuggestions([]);setActiveIndex(-1);setSuggestionStatus('');setResult(null);setStatus('idle')};
 const onAddressKeyDown=(event:React.KeyboardEvent<HTMLInputElement>)=>{
  if(!suggestions.length)return;
  if(event.key==='ArrowDown'){event.preventDefault();setActiveIndex(index=>(index+1)%suggestions.length)}
  else if(event.key==='ArrowUp'){event.preventDefault();setActiveIndex(index=>index<=0?suggestions.length-1:index-1)}
  else if(event.key==='Enter'&&activeIndex>=0){event.preventDefault();selectSuggestion(suggestions[activeIndex])}
  else if(event.key==='Escape'){event.preventDefault();setSuggestions([]);setActiveIndex(-1);setSuggestionStatus('Address suggestions closed.')}
 };

 return <div className="address-checker"><p className="eyebrow">Optional address check</p><h3>Check typical travel.</h3><p id={instructionId}>Enter an address for a private server-side estimate of ordinary one-way travel. Temporary traffic is not used to change the travel tier, and Cuddle Crew does not save the address.</p><label htmlFor={id}>Street address</label><div className="address-actions"><input id={id} type="text" value={address} autoComplete="street-address" role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded={suggestions.length>0} aria-controls={listId} aria-activedescendant={activeIndex>=0?`${id}-option-${activeIndex}`:undefined} aria-describedby={`${instructionId} ${statusId}`} aria-invalid={status==='error'||undefined} aria-busy={status==='loading'||undefined} onKeyDown={onAddressKeyDown} onBlur={()=>window.setTimeout(()=>{setSuggestions([]);setActiveIndex(-1)},0)} onChange={event=>editAddress(event.target.value)} placeholder="Street address, city, CA"/><button type="button" onClick={()=>void check()} disabled={address.trim().length<6||status==='loading'}>{status==='loading'?'Checking…':'Check address'}</button></div>{suggestions.length>0&&<div className="address-suggestion-panel"><p>Suggested addresses</p><ul id={listId} role="listbox" className="address-suggestions" aria-label="Address suggestions">{suggestions.map((item,index)=><li role="none" key={item.id}><button id={`${id}-option-${index}`} role="option" aria-selected={activeIndex===index} tabIndex={-1} type="button" onMouseDown={event=>event.preventDefault()} onClick={()=>selectSuggestion(item)}>{item.label}</button></li>)}</ul><p className="google-attribution" translate="no">Google Maps</p></div>}<p id={statusId} className="sr-only" role="status">{suggestionStatus}</p>{result&&<div className="address-result result" role="status"><b>{result.city?`${result.city} · `:''}{result.zip}</b><span>{result.travelTier?`${result.travelTier.name}${result.travelTier.fee===null?' · personalized review required':result.travelTier.fee?` · $${result.travelTier.fee} per daytime visit`:' · no travel fee'}`:'Personalized travel review required'}</span>{result.travelContext&&<small>{result.travelContext}</small>}<p className="google-attribution" translate="no">Google Maps</p></div>}{status==='unavailable'&&<p className="address-fallback" role="status">The address service is unavailable right now. Your address was not saved; contact Lauren for a travel review.</p>}{status==='error'&&<p className="address-fallback" role="alert">{message}</p>}<small className="privacy-note">Do not enter apartment access codes, gate codes, or other private instructions. Address details are never added to the page URL, analytics, or a saved care plan.</small></div>;
}
