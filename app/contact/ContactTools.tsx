'use client';
import { FormEvent, useState } from 'react';

const email = 'lauren@cuddlecrewpetcare.com';

export default function ContactTools(){
  const [copied,setCopied]=useState(false);
  const [name,setName]=useState('');
  const [replyTo,setReplyTo]=useState('');
  const [message,setMessage]=useState('');
  const copyEmail=async()=>{ await navigator.clipboard.writeText(email); setCopied(true); window.setTimeout(()=>setCopied(false),2500); };
  const prepare=(event:FormEvent)=>{ event.preventDefault(); const subject=encodeURIComponent('Pet care question'); const body=encodeURIComponent(`Name: ${name}\nReply-to email: ${replyTo}\n\n${message}`); window.location.href=`mailto:${email}?subject=${subject}&body=${body}`; };
  return <div className="contact-tools">
    <section className="contact-direct" aria-labelledby="direct-contact"><p className="eyebrow">Direct contact</p><h2 id="direct-contact">Reach Lauren your way.</h2><p>If your device does not open an email app, use the copy button and paste the address into Gmail, Outlook, or your preferred service.</p><div className="contact-buttons"><button type="button" className="button" onClick={copyEmail}>{copied?'Email copied!':'Copy email address'}</button><a className="text-link" href={`mailto:${email}?subject=Pet%20care%20question`}>Open email app →</a><a className="text-link" href="tel:+19162523550">Call 916-252-3550 →</a></div><p className="contact-address">{email}</p></section>
    <form className="inquiry-builder" onSubmit={prepare}><p className="eyebrow">Optional message helper</p><h2>Prepare an inquiry.</h2><p>This creates a draft in your email app. The website does not store or send the information itself.</p><label>Your name<input required value={name} onChange={e=>setName(e.target.value)}/></label><label>Your email<input required type="email" value={replyTo} onChange={e=>setReplyTo(e.target.value)}/></label><label>What would you like to ask?<textarea required rows={7} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Pet type, dates, ZIP code, care needs, and any questions…"/></label><button className="button" type="submit">Create email draft</button></form>
  </div>;
}
