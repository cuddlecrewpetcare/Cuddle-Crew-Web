export default function SiteHeader(){
 return <header className="sticky-header"><nav className="nav shell" aria-label="Primary navigation">
  <a className="brand" href="/#top"><span className="brand-mark">CC</span><span>Cuddle Crew<small>Pet Care</small></span></a>
  <div className="nav-links"><div className="nav-menu"><a href="/#services">Services</a><div className="nav-dropdown"><a href="/#services">Drop-in visits</a><a href="/#services">Dog walks</a><a href="/#services">Overnight care</a><a href="/#estimate">Build a custom plan</a></div></div><a href="/#estimate">Estimate</a><a href="/#area">Service area</a><a href="/#photos">Photos</a><a href="/credentials">Peace of mind</a><a href="/faq">FAQ</a><a href="/contact">Contact</a></div>
  <a className="button small" href="https://cuddlecrewpetcare.petssl.com/account">Register</a>
 </nav></header>;
}
