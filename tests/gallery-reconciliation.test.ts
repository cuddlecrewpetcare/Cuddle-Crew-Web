import assert from 'node:assert/strict';
import {existsSync,readdirSync,readFileSync} from 'node:fs';
import {join,relative,resolve,sep} from 'node:path';
import test from 'node:test';
import {galleryPhotos,homepageMainPhoto} from '../app/config/gallery.ts';

const photoRoot=resolve('public/photos');
const collectPhotos=(directory:string):string[]=>readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
 const full=join(directory,entry.name);
 return entry.isDirectory()?collectPhotos(full):/\.(?:jpe?g|png|webp)$/i.test(entry.name)?[relative(photoRoot,full).split(sep).join('/')]:[];
});

test('gallery inventory exactly matches every approved public photo',()=>{
 const disk=collectPhotos(photoRoot).sort();
 const inventory=galleryPhotos.map(photo=>photo.src.slice('/photos/'.length)).sort();
 assert.deepEqual(inventory,disk);
 assert.equal(galleryPhotos.length,15);
 assert.equal(galleryPhotos.filter(photo=>photo.category==='lauren').length,6);
 assert.equal(galleryPhotos.filter(photo=>photo.category==='client').length,9);
 assert.deepEqual([...new Set(galleryPhotos.filter(photo=>photo.category==='lauren').map(photo=>photo.folder))].sort(),["bambi - lauren's cat","ponyo - lauren's cat","ponyo and bambi - lauren's cats"].sort());
 assert.deepEqual([...new Set(galleryPhotos.filter(photo=>photo.category==='client').map(photo=>photo.folder))].sort(),['blu - client dog','loki - client dog','skylar - client dog'].sort());
});

test('Blu portrait is the single homepage main photo and first client image',()=>{
 assert.equal(homepageMainPhoto.src,'/photos/blu - client dog/client-dog-blu-first-page-photo.jpeg');
 assert.equal(galleryPhotos.filter(photo=>photo.homepageMain).length,1);
 assert.equal(galleryPhotos.find(photo=>photo.category==='client'),homepageMainPhoto);
 assert.notEqual(homepageMainPhoto.src,'/photos/blu - client dog/client-dog-blu-walk.jpeg');
 assert.notEqual(homepageMainPhoto.src,'/photos/blu - client dog/client-dog-blu-inside-smile.jpeg');
 assert.equal(existsSync(resolve('public/photos/service-dog-walk.jpeg')),false);
 const home=readFileSync(resolve('app/page.tsx'),'utf8');
 assert.match(home,/src=\{homepageMainPhoto\.src\}/);
 assert.doesNotMatch(home,/service-dog-walk|client-dog-blu-walk|client-dog-blu-inside-smile/);
});

test('gallery presentation provides factual text, focal metadata, uniform frames, and an accessible dialog',()=>{
 const styles=readFileSync(resolve('app/phase-12e.css'),'utf8');
 const component=readFileSync(resolve('app/gallery/GalleryLightbox.tsx'),'utf8');
 const page=readFileSync(resolve('app/gallery/page.tsx'),'utf8');
 const alts=galleryPhotos.map(photo=>photo.alt.trim());
 assert.ok(alts.every(alt=>alt.length>=20));
 assert.equal(new Set(alts).size,galleryPhotos.length);
 assert.ok(galleryPhotos.every(photo=>/^\d+% \d+%$/.test(photo.objectPosition)));
 assert.match(styles,/\.gallery-frame\{[^}]*aspect-ratio:3\/4/);
 assert.match(styles,/\.gallery-frame img\{[^}]*width:100%;height:100%;object-fit:cover/);
 assert.match(component,/style=\{\{objectPosition:photo\.objectPosition\}\}/);
 assert.match(component,/loading="lazy"/);
 assert.match(component,/<dialog/);
 assert.match(component,/\.showModal\(\)/);
 assert.match(component,/event\.key|onClose=\{handleClosed\}/);
 assert.match(component,/returnFocusRef\.current\?\.focus\(\)/);
 assert.match(component,/aria-label="Close enlarged photo"/);
 assert.match(page,/Lauren’s pets/);
 assert.match(page,/Client pets/);
 assert.match(page,/All client pet photos shown on this site are shared with written permission from the client or pet owner/);
});

test('PSI certificate publication is preserved separately from prohibited resources',()=>{
 const reconciliation=readFileSync(resolve('docs/phase-12e-current-state-reconciliation.md'),'utf8');
 const ignores=readFileSync(resolve('.gitignore'),'utf8').split(/\r?\n/).filter(line=>line.startsWith('/public/handouts/')||line.startsWith('/public/infographics/'));
 assert.equal(existsSync(resolve('public/psi-membership-certificate.jpg')),true);
 assert.match(reconciliation,/publication permission is confirmed for the PSI logos/);
 assert.match(reconciliation,/psi-membership-certificate\.jpg/);
 assert.match(reconciliation,/does not establish current-status wording/);
 assert.equal(ignores.length,4);
 assert.ok(ignores.every(line=>!line.includes('*')));
 assert.equal(ignores.some(line=>line.includes('psi-membership-certificate')),false);
 for(const path of ['public/handouts/Client Handout - Preparing for Your Pet Sitter.pdf','public/handouts/Pet Sitter Interview Checklist.pdf','public/handouts/Summer Safety Tips for Pet Owners (Client Handout).pdf','public/infographics/Dog Travel Safety Infographic'])assert.equal(existsSync(resolve(path)),false,path);
});
