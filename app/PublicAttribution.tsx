'use client';
import {useEffect} from 'react';
import {referralFromSearch,persistReferral} from './lib/referral';
import {trackPublicEvent} from './lib/public-analytics';

export default function PublicAttribution(){useEffect(()=>{const source=referralFromSearch(window.location.search);if(source)persistReferral(window.sessionStorage,source);const clicked=(event:MouseEvent)=>{const anchor=(event.target as Element|null)?.closest('a');if(!anchor)return;const href=anchor.getAttribute('href')||'';if(href.startsWith('tel:'))trackPublicEvent('phone_clicked');else if(href.includes('/account'))trackPublicEvent('new_client_clicked');else if(href.includes('/login'))trackPublicEvent('existing_client_clicked')};document.addEventListener('click',clicked);if(window.location.pathname==='/choosing-care')trackPublicEvent('provider_comparison_viewed');return()=>document.removeEventListener('click',clicked)},[]);return null;}
