import type {Metadata} from 'next';

const socialImage={
 url:'/og.png',
 width:1760,
 height:918,
 alt:'Cuddle Crew Pet Care — thoughtful pet sitting and dog walking in Sacramento',
};

export const publicPageMetadata=({title,description,path}:{title:string;description:string;path:string}):Metadata=>({
 title,
 description,
 alternates:{canonical:path},
 openGraph:{title,description,url:path,siteName:'Cuddle Crew Pet Care',images:[socialImage],type:'website'},
 twitter:{card:'summary_large_image',title,description,images:['/og.png']},
});
