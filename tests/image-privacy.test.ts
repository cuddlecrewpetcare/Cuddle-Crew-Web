import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';
import {galleryPhotos} from '../app/config/gallery.ts';
import {inspectJpeg,stripPrivacyMetadata} from '../scripts/jpeg-metadata.ts';

const segment=(marker:number,payload:Buffer)=>{const length=Buffer.alloc(2);length.writeUInt16BE(payload.length+2);return Buffer.concat([Buffer.from([0xff,marker]),length,payload])};
const syntheticJpeg=()=>{
 const exif=segment(0xe1,Buffer.from([0x45,0x78,0x69,0x66,0,0]));
 const xmp=segment(0xe1,Buffer.from('http://ns.adobe.com/xap/1.0/\0<x:xmpmeta/>','ascii'));
 const iptcResource=Buffer.concat([Buffer.from('Photoshop 3.0\0','ascii'),Buffer.from('8BIM','ascii'),Buffer.from([0x04,0x04,0,0,0,0,0,4,0x1c,0x02,0x05,0])]);
 const photoshop=segment(0xed,iptcResource),icc=segment(0xe2,Buffer.from('ICC_PROFILE\0public-color-profile','ascii'));
 const sof=segment(0xc0,Buffer.from([8,0,1,0,1,1,1,0x11,0])),sos=segment(0xda,Buffer.from([1,1,0,0,0x3f,0]));
 return Buffer.concat([Buffer.from([0xff,0xd8]),exif,xmp,photoshop,icc,sof,sos,Buffer.from([0x11,0x22,0xff,0xd9])]);
};

test('all approved gallery JPEGs remain present with their configured dimensions',()=>{
 assert.equal(galleryPhotos.length,15);
 for(const photo of galleryPhotos){const inspection=inspectJpeg(readFileSync(resolve('public',photo.src.slice(1))));assert.equal(inspection.width,photo.width,photo.src);assert.equal(inspection.height,photo.height,photo.src)}
});

test('public gallery JPEGs contain no privacy-sensitive metadata containers',()=>{
 for(const photo of galleryPhotos){const inspection=inspectJpeg(readFileSync(resolve('public',photo.src.slice(1))));assert.equal(inspection.exifSegments,0,photo.src);assert.equal(inspection.xmpSegments,0,photo.src);assert.equal(inspection.photoshopSegments,0,photo.src);assert.equal(inspection.iptcSegments,0,photo.src);assert.equal(inspection.privacyMetadataSegments,0,photo.src)}
});

test('metadata sanitation recognizes EXIF, XMP, and IPTC/Photoshop while preserving ICC and image data',()=>{
 const beforeBuffer=syntheticJpeg(),before=inspectJpeg(beforeBuffer);assert.equal(before.exifSegments,1);assert.equal(before.xmpSegments,1);assert.equal(before.photoshopSegments,1);assert.equal(before.iptcSegments,1);
 const afterBuffer=stripPrivacyMetadata(beforeBuffer),after=inspectJpeg(afterBuffer);assert.equal(after.privacyMetadataSegments,0);assert.equal(after.imageStreamHash,before.imageStreamHash);assert.equal(after.width,before.width);assert.equal(after.height,before.height);assert.ok(afterBuffer.includes(Buffer.from('ICC_PROFILE\0','ascii')))
});
