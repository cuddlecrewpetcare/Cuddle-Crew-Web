import Link from 'next/link';

export default function FAQ() {
  return <main className="shell">
    <Link className="brand back" href="/"><span className="brand-mark">CC</span><span>Cuddle Crew<small>Pet Care</small></span></Link>
    <section className="subhero"><p className="eyebrow">Policies & FAQ</p><h1>Kind, clear expectations.</h1><p className="lede">A little planning helps every pet receive calm, consistent care.</p></section>
    <section className="content-card"><h2>Do new clients need a meet-and-greet?</h2><p>Yes. A complimentary meet-and-greet is required for every new household before the first service. Registration is a request; exact dates and availability are confirmed after the household’s location and care needs are reviewed.</p></section>
    <section className="content-card"><h2>What if I need care at the last minute?</h2><p>Requests made under 24 hours may include a last-minute surcharge and depend on availability.</p></section>
    <section className="content-card"><h2>What is the cancellation policy?</h2><ul><li><strong>48+ hours ahead:</strong> full refund</li><li><strong>Under 48 hours:</strong> 50% charge</li><li><strong>Same day:</strong> charged in full</li></ul></section>
    <section className="content-card"><h2>Which dates are holidays?</h2><p>New Year’s Day, Easter, Mother’s Day, Independence Day, Thanksgiving, Christmas Eve, Christmas Day, and New Year’s Eve. Holiday daytime visits include an additional $15 per visit, and holiday overnight care includes an additional $30 per day.</p></section>
    <section className="content-card"><h2>Can you give medication?</h2><p>Medication routines can be discussed during the meet-and-greet and must be supported by clear, current written instructions. Care is confirmed based on the pet’s needs and what can be provided safely.</p></section>
    <section className="content-card"><h2>What happens during extreme weather?</h2><p>Safety comes first. Walk length, timing, and outdoor activity may be adjusted for extreme heat, smoke, storms, or unsafe conditions, with appropriate indoor enrichment and an update to the pet parent.</p></section>
    <section className="content-card"><h2>How are emergencies handled?</h2><p>Please provide current veterinary and emergency-contact information. If something concerning happens, I will try to reach you or your authorized contact promptly and follow the emergency care instructions in your client profile.</p></section>
    <section className="content-card"><h2>How is home access handled?</h2><p>Entry instructions, keys, codes, and household details are treated as confidential and used only to provide scheduled care. Access arrangements are reviewed during the meet-and-greet.</p></section>
    <section className="content-card"><h2>What about privacy and pet photos?</h2><p>Client and household information is used only to coordinate and provide requested services. Pet photos are shared publicly only with permission and are not presented as reviews or endorsements.</p></section>
    <section className="content-card"><h2>How do I get started?</h2><p>New clients can <a href="https://cuddlecrewpetcare.petssl.com/account">register and request availability online</a>. Existing clients can <a href="https://cuddlecrewpetcare.petssl.com/login">log in here</a>. Questions? Email <a href="mailto:lauren@cuddlecrewpetcare.com">lauren@cuddlecrewpetcare.com</a> or call <a href="tel:+19162523550">916-252-3550</a>.</p></section>
    <p><Link className="text-link" href="/">← Return home</Link></p>
  </main>;
}
