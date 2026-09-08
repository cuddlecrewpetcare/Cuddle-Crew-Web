import Link from 'next/link';
import SocialLinks from './SocialLinks';
import {business} from './config/business';

export default function SiteFooter(){
 return <footer className="site-footer"><div className="shell footer-grid">
  <div className="footer-brand"><Link className="brand" href="/#top" aria-label="Cuddle Crew Pet Care home"><span className="brand-mark" aria-hidden="true">CC</span><span aria-hidden="true">Cuddle Crew<small>Pet Care</small></span></Link><p>Owner-operated professional in-home pet sitting and dog walking in the Sacramento area.</p><a className="text-link" href={business.portal.login}>Existing client login →</a></div>
  <nav aria-label="Explore Cuddle Crew"><h2>Explore</h2><div className="footer-link-list"><Link href="/start">Start Here</Link><Link href="/services">Services</Link><Link href="/rates">Rates & estimator</Link><Link href="/service-area">Service area</Link><Link href="/gallery">Gallery</Link><Link href="/plan">Plan care</Link><Link href="/contact">Contact</Link></div></nav>
  <nav aria-label="Trust and policies"><h2>Trust & policies</h2><div className="footer-link-list"><Link href="/safety">Safety</Link><Link href="/choosing-care">Choosing care</Link><Link href="/credentials">Credentials</Link><Link href="/faq">FAQ</Link><Link href="/holidays">Holidays</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></nav>
  <div className="footer-social"><h2>Find us</h2><SocialLinks compact/><p>Cuddle Crew Pet Care · Sacramento area, California</p></div>
 </div></footer>;
}
