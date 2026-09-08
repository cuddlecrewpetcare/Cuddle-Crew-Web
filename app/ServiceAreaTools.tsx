'use client';
import dynamic from 'next/dynamic';
import {useCallback,useEffect,useState} from 'react';
import {business,type TravelTierKey} from './config/business';
import {clearPlanningLocation,loadPlanningState,savePlanningLocation} from './lib/planning-state';

const AddressChecker=dynamic(()=>import('./AddressChecker'),{ssr:false,loading:()=> <div className="address-checker"><p role="status">Loading the private address check…</p></div>});

export default function ServiceAreaTools(){
 const[zip,setZip]=useState(''),[travelTier,setTravelTier]=useState<TravelTierKey>(),[confirmed,setConfirmed]=useState(false),[ready,setReady]=useState(false);
 useEffect(()=>{const saved=loadPlanningState(),frame=requestAnimationFrame(()=>{setZip(saved.zip||'');setTravelTier(saved.travelTier);setConfirmed(Boolean(saved.zip));setReady(true)});return()=>cancelAnimationFrame(frame)},[]);
 const remember=useCallback((location:{zip:string;travelTier?:TravelTierKey})=>{savePlanningLocation(location);setZip(location.zip);setTravelTier(location.travelTier);setConfirmed(true)},[]);
 const forget=useCallback(()=>{clearPlanningLocation();setZip('');setTravelTier(undefined);setConfirmed(false)},[]);
 const editZip=(value:string)=>{clearPlanningLocation();setZip(value.replace(/\D/g,'').slice(0,5));setTravelTier(undefined);setConfirmed(false)};
 const checkZip=()=>{if(/^\d{5}$/.test(zip))remember({zip})};
 return <div className="area-tools-stack" aria-busy={!ready}><AddressChecker onLocation={remember} onClear={forget}/><div className="checker"><p className="eyebrow">ZIP-only fallback</p><label htmlFor="zip">Service ZIP</label><div className="zip-actions"><input id="zip" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zip} onChange={event=>editZip(event.target.value)} placeholder="95821"/><button type="button" disabled={zip.length!==5} onClick={checkZip}>Check ZIP</button></div>{confirmed&&!travelTier&&<div className="result" role="status"><b>Personalized travel review required</b><span>ZIP {zip} can identify the general request location, but it cannot determine an approved travel tier or availability by itself.</span></div>}</div>{confirmed&&<section className="content-card area-handoff" aria-labelledby="area-handoff-title"><p className="eyebrow">Optional planning handoff</p><h3 id="area-handoff-title">Your general service location is ready.</h3><p>Only ZIP {zip}{travelTier?` and the public ${business.travel[travelTier].name} travel tier`:''} will carry to the estimator in this browser session. The street address is not saved or placed in the URL.</p><div className="actions"><a className="button" href="/rates#estimate">Continue to estimate</a><button type="button" className="text-link" onClick={forget}>Clear saved ZIP and travel tier</button></div></section>}</div>;
}
