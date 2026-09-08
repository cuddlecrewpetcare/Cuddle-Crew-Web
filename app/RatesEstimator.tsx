'use client';
import dynamic from 'next/dynamic';

const QuoteEstimator=dynamic(()=>import('./QuoteEstimator'),{ssr:false,loading:()=> <section id="estimate" className="estimate-section"><div className="shell"><p role="status">Loading the planning estimator…</p></div></section>});

export default function RatesEstimator(){return <QuoteEstimator/>;}
