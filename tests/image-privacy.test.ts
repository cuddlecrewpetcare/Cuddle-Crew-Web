import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';
import {galleryPhotos} from '../app/config/gallery.ts';
import {inspectJpeg} from '../scripts/jpeg-metadata.ts';

test('all approved gallery JPEGs remain present with their configured dimensions',()=>{
 assert.equal(galleryPhotos.length,15);
 for(const photo of galleryPhotos){const inspection=inspectJpeg(readFileSync(resolve('public',photo.src.slice(1))));assert.equal(inspection.width,photo.width,photo.src);assert.equal(inspection.height,photo.height,photo.src)}
});

test('public gallery JPEGs contain no EXIF metadata',()=>{
 for(const photo of galleryPhotos){const inspection=inspectJpeg(readFileSync(resolve('public',photo.src.slice(1))));assert.equal(inspection.exifSegments,0,photo.src)}
});
