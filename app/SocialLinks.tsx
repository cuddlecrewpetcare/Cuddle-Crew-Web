import { FaFacebookF, FaYelp } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

const profiles = [
  { name: 'Google Business Profile', href: 'https://share.google/O3aya8JQkApZ4prHu', icon: <FcGoogle aria-hidden="true" />, className: 'google' },
  { name: 'Facebook page', href: 'https://www.facebook.com/profile.php?id=61593543881861', icon: <FaFacebookF aria-hidden="true" />, className: 'facebook' },
  { name: 'Yelp business profile', href: 'https://www.yelp.com/biz/cuddle-crew-pet-care-carmichael-2', icon: <FaYelp aria-hidden="true" />, className: 'yelp' },
];

export default function SocialLinks({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? 'social-links social-links-compact' : 'social-links'} aria-label="Cuddle Crew Pet Care social profiles">
    {profiles.map((profile) => <a className={`social-button ${profile.className}`} href={profile.href} key={profile.name} target="_blank" rel="noopener noreferrer" aria-label={`${profile.name} (opens in a new tab)`}>
      <span className="social-icon">{profile.icon}</span>{!compact && <span>{profile.name}</span>}
    </a>)}
  </div>;
}
