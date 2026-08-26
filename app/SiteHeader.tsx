import Link from 'next/link';

export default function SiteHeader(){
 return <nav className="nav shell" aria-label="Primary navigation">
  <Link className="brand" href="/#top"><span className="brand-mark">CC</span><span>Cuddle Crew<small>Pet Care</small></span></Link>
  <div className="nav-links"><Link href="/#services">Services</Link><Link href="/#care-guide">Pet care guide</Link><Link href="/#area">Service area</Link><Link href="/#photos">Photos</Link><Link href="/credentials">Peace of mind</Link><Link href="/faq">FAQ</Link></div>
  <a className="button small" href="https://cuddlecrewpetcare.petssl.com/account">Register</a>
 </nav>;
}
