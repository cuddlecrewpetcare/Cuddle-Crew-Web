import type {Metadata} from 'next';
import SiteFooter from '../SiteFooter';
import SiteHeader from '../SiteHeader';
import {galleryPhotos,type GalleryCategory} from '../config/gallery';
import GalleryLightbox from './GalleryLightbox';

export const metadata:Metadata={title:'Pet Photo Gallery | Cuddle Crew Pet Care',description:'Meet Lauren’s cats and client pets in the Cuddle Crew Pet Care photo gallery.',alternates:{canonical:'/gallery'},openGraph:{title:'Pet Photo Gallery | Cuddle Crew Pet Care',description:'Meet Lauren’s cats and client pets in the Cuddle Crew Pet Care photo gallery.',url:'/gallery',type:'website'}};

const sections:[GalleryCategory,string,string][]=[
 ['lauren','Lauren’s pets','Ponyo and Bambi are Lauren’s own cats.'],
 ['client','Client pets','Every client pet photo in this gallery is shared with written permission.'],
];

export default function GalleryPage(){return <><SiteHeader/><main id="main-content" tabIndex={-1} className="gallery-page"><div className="shell">
 <section className="subhero gallery-hero"><p className="eyebrow">Pet photo gallery</p><h1>Familiar faces, thoughtfully framed.</h1><p className="lede">Browse every approved animal photograph in the public Cuddle Crew collection. Select any photo for a larger, uncropped view.</p></section>
 <p className="gallery-consent"><strong>Photo privacy:</strong> All client pet photos shown on this site are shared with written permission from the client or pet owner. That permission applies only to the pet photos displayed here.</p>
 {sections.map(([category,title,intro])=>{
  const categoryPhotos=galleryPhotos.filter(photo=>photo.category===category);
  const folders=[...new Set(categoryPhotos.map(photo=>photo.folder))];
  return <section className={`gallery-category ${category}`} key={category} aria-labelledby={`${category}-pets-heading`}>
   <header className="gallery-category-heading"><p className="eyebrow">{category==='lauren'?'At home with Lauren':'Shared with written consent'}</p><h2 id={`${category}-pets-heading`}>{title}</h2><p>{intro}</p></header>
   {folders.map(folder=>{const folderPhotos=categoryPhotos.filter(photo=>photo.folder===folder),folderId=`${category}-${folder.replaceAll(/[^a-z0-9]+/gi,'-').replace(/-$/,'')}`;return <section className="gallery-folder" key={folder} aria-labelledby={folderId}>
    <h3 id={folderId}>{folderPhotos[0].folderLabel}</h3>
    <GalleryLightbox photos={folderPhotos} dialogId={folderId}/>
   </section>})}
  </section>})}
 </div></main><SiteFooter/></>}
