'use client';

import { FaFacebookF, FaInstagram, FaYelp } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import {business} from './config/business';
import {trackPublicEvent} from './lib/public-analytics';

const profiles = [
  { name: 'Google Business Profile', href: business.social.google, icon: <FcGoogle aria-hidden="true" />, className: 'google' },
  { name: 'Facebook page', href: business.social.facebook, icon: <FaFacebookF aria-hidden="true" />, className: 'facebook' },
  { name: 'Yelp business profile', href: business.social.yelp, icon: <FaYelp aria-hidden="true" />, className: 'yelp' },
  { name: 'Instagram profile', href: business.social.instagram, icon: <FaInstagram aria-hidden="true" />, className: 'instagram' },
];

export default function SocialLinks({ compact = false }: { compact?: boolean }) {
  return <ul className={compact ? 'social-links social-links-compact' : 'social-links'} aria-label="Cuddle Crew Pet Care social profiles">
    {profiles.map((profile) => <li key={profile.name}><a className={`social-button ${profile.className}`} href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={`${profile.name} (opens in a new tab)`} onClick={()=>profile.className==='instagram'&&trackPublicEvent('instagram_clicked')}>
      <span className="social-icon">{profile.icon}</span>{!compact && <span>{profile.name}</span>}
    </a></li>)}
  </ul>;
}
