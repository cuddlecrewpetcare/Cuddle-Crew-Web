import SiteFooter from '../SiteFooter';
import SiteHeader from '../SiteHeader';
import {business} from '../config/business';
import {publicPageMetadata} from '../lib/metadata';

export const metadata=publicPageMetadata({
 title:'Website Accessibility | Cuddle Crew Pet Care',
 description:'Learn about Cuddle Crew Pet Care’s website accessibility practices and how to report a barrier or request information another way.',
 path:'/accessibility',
});

export default function Accessibility(){return <><SiteHeader/><main id="main-content" tabIndex={-1}><div className="shell detail-page">
 <section className="subhero detail-hero"><p className="eyebrow">Website accessibility</p><h1>A usable website is an ongoing commitment.</h1><p className="lede">Cuddle Crew Pet Care aims to make this website clear and usable for people with different devices, interaction methods, and access needs. Feedback helps guide continued improvement.</p></section>
 <section className="content-card"><h2>Practices built into the current site</h2><ul><li>Semantic page landmarks, heading structure, form labels, and descriptive image text.</li><li>Keyboard-operable navigation and forms, a skip link, and visible focus indicators.</li><li>Responsive layouts, touch-sized controls, and support for reduced-motion preferences.</li><li>Human-readable status, validation, failure, and retry messages for interactive tools.</li><li>Text explanations that do not require using the visual service-area map.</li></ul><p>Automated checks, keyboard review, and responsive testing support this work, but no single check covers every browser, device, or assistive-technology combination.</p></section>
 <section className="content-card"><h2>Report a barrier or request another format</h2><p>If something is difficult to find, read, navigate, or submit, tell Lauren which page or task caused the problem and the format or contact method that would help. You do not need to share disability or medical information.</p><div className="actions"><a className="button" href={`mailto:${business.email}?subject=Website%20accessibility`}>Email Lauren</a><a className="button secondary" href={business.phoneHref}>Call {business.phoneDisplay}</a><a className="text-link" href="/contact">Use the contact page →</a></div><p>Lauren can help provide website information another way when practical. Routine questions are answered {business.replyWindow}.</p></section>
 <section className="content-card"><h2>Continued improvement</h2><p>The site and its tools will continue to be reviewed as content, technology, and real user needs change. Reporting a barrier is the most direct way to help prioritize a practical fix.</p></section>
 </div></main><SiteFooter/></>}
