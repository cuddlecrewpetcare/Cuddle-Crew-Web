import SiteHeader from './SiteHeader';
import Link from 'next/link';

export default function NotFound(){return <><SiteHeader/><main><div className="shell"><section className="subhero"><p className="eyebrow">Page not found</p><h1>This page wandered off.</h1><p className="lede">The page you&apos;re looking for isn&apos;t here, but your next step is easy.</p><div className="actions"><Link className="button" href="/">Home</Link><Link className="button secondary" href="/#services">View Services</Link><Link className="text-link" href="/plan">Plan Care →</Link><Link className="text-link" href="/contact">Contact Lauren →</Link></div></section></div></main></>}
