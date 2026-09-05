'use client';
import {FormEvent,useCallback,useEffect,useRef,useState} from 'react';
import TurnstileWidget from './TurnstileWidget';
import {trackPublicEvent} from '../lib/public-analytics';
import {approvedSmsDisclosure} from '../config/sms';

const email='lauren@cuddlecrewpetcare.com';
const emailHref=`mailto:${email}?subject=Pet%20care%20question`;

export default function ContactTools({turnstileSiteKey=''}:{turnstileSiteKey?:string}){
 const[copied,setCopied]=useState(false),[name,setName]=useState(''),[replyTo,setReplyTo]=useState(''),[phone,setPhone]=useState(''),[smsConsent,setSmsConsent]=useState(false),[zip,setZip]=useState(''),[message,setMessage]=useState(''),[topic,setTopic]=useState('Availability or scheduling'),[status,setStatus]=useState<'idle'|'sending'|'sent'|'error'>('idle'),[turnstileToken,setTurnstileToken]=useState(''),[turnstileReset,setTurnstileReset]=useState(0),[errorMessage,setErrorMessage]=useState('');
 const errorRef=useRef<HTMLDivElement>(null),submitController=useRef<AbortController|null>(null),siteKey=turnstileSiteKey;
 const receiveToken=useCallback((token:string)=>setTurnstileToken(token),[]);

 useEffect(()=>()=>submitController.current?.abort(),[]);
 useEffect(()=>{if(status==='error')errorRef.current?.focus()},[status]);

 const copyEmail=async()=>{try{await navigator.clipboard.writeText(email);setCopied(true);window.setTimeout(()=>setCopied(false),2500)}catch{setCopied(false)}};
 const submit=async(event:FormEvent<HTMLFormElement>)=>{
  event.preventDefault();
  if(siteKey&&!turnstileToken){setStatus('error');setErrorMessage('Please complete the security verification before sending.');return}
  setStatus('sending');setErrorMessage('');
  const data=new FormData(event.currentTarget),controller=new AbortController();submitController.current?.abort();submitController.current=controller;
  try{
   const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,replyTo,phone,smsConsent,zip,topic,message,website:data.get('website'),turnstileToken}),signal:controller.signal});
   const payload=(await response.json().catch(()=>({}))) as {error?:unknown};if(!response.ok)throw new Error(typeof payload.error==='string'?payload.error:'The message could not be sent right now.');
   if(controller.signal.aborted)return;
   trackPublicEvent('contact_submitted',{status:'success'});setStatus('sent');setName('');setReplyTo('');setPhone('');setSmsConsent(false);setZip('');setMessage('');setTurnstileReset(value=>value+1);
  }catch(error){
   if(controller.signal.aborted)return;
   setStatus('error');setErrorMessage(error instanceof Error?error.message:'The message could not be sent right now.');if(siteKey)setTurnstileReset(value=>value+1);
  }finally{if(submitController.current===controller)submitController.current=null}
 };

 return <div className="contact-tools">
  <section className="contact-direct" aria-labelledby="direct-contact"><p className="eyebrow">Direct contact</p><h2 id="direct-contact">Reach Lauren your way.</h2><p>You can send the form here, call, or contact Lauren from your own email account.</p><div className="contact-buttons"><button type="button" className="button" onClick={copyEmail}>{copied?'Email copied!':'Copy email address'}</button><a className="text-link" href={emailHref}>Open email app →</a><a className="text-link" href="tel:+19162523550">Call 916-252-3550 →</a></div><p className="contact-address">{email}</p></section>
  <form className="inquiry-builder" onSubmit={submit} aria-busy={status==='sending'}>
   <p className="eyebrow">Initial inquiry</p><h2>Ask Lauren a question.</h2><p>Share the basics below. This does not register you, create a reservation, or guarantee availability.</p><p className="required-note"><span aria-hidden="true">*</span> Required fields</p>
   <label htmlFor="contact-name">Your name <span aria-hidden="true">*</span><input id="contact-name" name="name" required maxLength={80} autoComplete="name" value={name} onChange={event=>setName(event.target.value)}/></label>
   <label htmlFor="contact-email">Your email <span aria-hidden="true">*</span><input id="contact-email" name="replyTo" required maxLength={254} autoComplete="email" type="email" value={replyTo} onChange={event=>setReplyTo(event.target.value)}/></label>
   <div className="inquiry-pair">
    <label htmlFor="contact-phone">Phone <small id="phone-help">Optional unless you choose SMS</small><input id="contact-phone" name="phone" maxLength={30} autoComplete="tel" type="tel" value={phone} onChange={event=>setPhone(event.target.value)} required={smsConsent} aria-describedby="phone-help sms-disclosure"/></label>
    <label htmlFor="contact-zip">Service ZIP <small>Optional</small><input id="contact-zip" name="zip" maxLength={10} inputMode="numeric" autoComplete="postal-code" value={zip} onChange={event=>setZip(event.target.value)}/></label>
   </div>
   <div className="sms-consent-field"><label htmlFor="sms-consent"><input id="sms-consent" name="smsConsent" type="checkbox" checked={smsConsent} onChange={event=>setSmsConsent(event.target.checked)} aria-describedby="sms-disclosure"/><span>Yes, I agree to service-related text messages.</span></label><p id="sms-disclosure" className="sms-disclosure">{approvedSmsDisclosure.beforePrivacyLink}<a href="/privacy">{approvedSmsDisclosure.privacyLinkLabel}</a>{approvedSmsDisclosure.afterPrivacyLink}</p></div>
   <label htmlFor="contact-topic">What is your question about?<select id="contact-topic" name="topic" value={topic} onChange={event=>setTopic(event.target.value)}><option>Availability or scheduling</option><option>Services and care options</option><option>Pricing or an estimate</option><option>Service area or travel fees</option><option>Meet-and-greet or registration</option><option>Medication or special care</option><option>Existing client question</option><option>Other</option></select></label>
   <label htmlFor="contact-message">What would you like to ask? <span aria-hidden="true">*</span><textarea id="contact-message" name="message" required minLength={10} maxLength={3000} rows={7} value={message} onChange={event=>setMessage(event.target.value)} placeholder="Pet type, dates, care needs, and any questions…"/></label>
   <label className="form-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
   <p className="form-privacy">Please don’t include door or alarm codes, payment details, veterinary records, or detailed medical information. Use the secure client portal for those details.</p>
   {siteKey&&<TurnstileWidget siteKey={siteKey} onToken={receiveToken} resetKey={turnstileReset}/>}<button className="button" type="submit" disabled={status==='sending'}>{status==='sending'?'Sending…':'Send inquiry'}</button>
   {status==='sent'&&<p className="form-status success" role="status">Thanks—your inquiry was accepted for delivery to Lauren. Routine questions are usually answered within one business day. If you need care within 48 hours, submit your request through the client portal and call 916-252-3550.</p>}
   {status==='error'&&<div ref={errorRef} className="form-status error" role="alert" tabIndex={-1}><p>{errorMessage}</p><a className="text-link" href={emailHref}>Open your email app instead →</a></div>}
  </form>
 </div>;
}
