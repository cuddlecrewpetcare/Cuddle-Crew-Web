'use client';
/* eslint-disable @next/next/no-img-element */
import {useEffect,useRef,useState} from 'react';
import type {GalleryPhoto} from '../config/gallery';

export default function GalleryLightbox({photos,dialogId}:{photos:readonly GalleryPhoto[];dialogId:string}){
 const dialogRef=useRef<HTMLDialogElement>(null),closeRef=useRef<HTMLButtonElement>(null),returnFocusRef=useRef<HTMLButtonElement|null>(null);
 const dialogTitleId=`${dialogId}-dialog-title`;
 const [activeIndex,setActiveIndex]=useState<number|null>(null);
 const activePhoto=activeIndex===null?null:photos[activeIndex];

 useEffect(()=>{
  const dialog=dialogRef.current;
  if(activeIndex===null||!dialog)return;
  if(!dialog.open)dialog.showModal();
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  requestAnimationFrame(()=>closeRef.current?.focus());
  return()=>{document.body.style.overflow=previousOverflow};
 },[activeIndex]);

 const openPhoto=(index:number,trigger:HTMLButtonElement)=>{returnFocusRef.current=trigger;setActiveIndex(index)};
 const closePhoto=()=>dialogRef.current?.close();
 const handleClosed=()=>{setActiveIndex(null);requestAnimationFrame(()=>returnFocusRef.current?.focus())};

 return <>
  <div className="gallery-grid">
   {photos.map((photo,index)=><button className="gallery-card" type="button" key={photo.src} onClick={event=>openPhoto(index,event.currentTarget)} aria-label={`View larger: ${photo.alt}`}>
    <span className="gallery-frame"><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" style={{objectPosition:photo.objectPosition}}/></span>
    <span className="gallery-card-caption">View larger</span>
   </button>)}
  </div>
  <dialog ref={dialogRef} className="gallery-dialog" aria-labelledby={dialogTitleId} onClose={handleClosed} onKeyDown={event=>{if(event.key==='Tab'){event.preventDefault();closeRef.current?.focus()}}} onClick={event=>{if(event.target===event.currentTarget)closePhoto()}}>
   {activePhoto&&<div className="gallery-dialog-content">
    <button ref={closeRef} className="gallery-dialog-close" type="button" onClick={closePhoto} aria-label="Close enlarged photo">×</button>
    <h2 id={dialogTitleId} className="sr-only">Enlarged pet photo</h2>
    <img src={activePhoto.src} alt={activePhoto.alt} width={activePhoto.width} height={activePhoto.height}/>
    <p>{activePhoto.alt}</p>
   </div>}
  </dialog>
 </>;
}
