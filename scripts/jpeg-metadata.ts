import {createHash} from 'node:crypto';
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {extname,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

type Segment={start:number;end:number;marker:number;payloadStart:number;isExif:boolean;isXmp:boolean;isPhotoshop:boolean;isIptc:boolean};
export type JpegInspection={width:number;height:number;orientation?:number;exifSegments:number;xmpSegments:number;photoshopSegments:number;iptcSegments:number;privacyMetadataSegments:number;imageStreamHash:string};

const exifSignature=Buffer.from([0x45,0x78,0x69,0x66,0,0]);
const xmpSignatures=[Buffer.from('http://ns.adobe.com/xap/1.0/\0','ascii'),Buffer.from('http://ns.adobe.com/xmp/extension/\0','ascii')];
const photoshopSignature=Buffer.from('Photoshop 3.0\0','ascii');
const sofMarkers=new Set([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf]);

const startsWith=(buffer:Buffer,start:number,end:number,signature:Buffer)=>start+signature.length<=end&&buffer.subarray(start,start+signature.length).equals(signature);
const containsIptc=(buffer:Buffer,start:number,end:number)=>{
 for(let offset=start;offset+1<end;offset++)if(buffer[offset]===0x1c&&buffer[offset+1]===0x02)return true;
 return false;
};

const photoshopHasIptcResource=(buffer:Buffer,start:number,end:number)=>{
 let position=start+photoshopSignature.length;
 while(position+12<=end){
  if(buffer.toString('ascii',position,position+4)!=='8BIM')return false;
  const resourceId=buffer.readUInt16BE(position+4);position+=6;
  const nameLength=buffer[position],nameFieldLength=1+nameLength;position+=nameFieldLength+(nameFieldLength%2);
  if(position+4>end)return false;
  const dataLength=buffer.readUInt32BE(position);position+=4;
  if(position+dataLength>end)return false;
  if(resourceId===0x0404)return true;
  position+=dataLength+(dataLength%2);
 }
 return false;
};

const parseSegments=(buffer:Buffer)=>{
 if(buffer.length<4||buffer[0]!==0xff||buffer[1]!==0xd8)throw new Error('Not a valid JPEG file.');
 const segments:Segment[]=[];let position=2,streamStart=-1,width=0,height=0;
 while(position<buffer.length){
  if(buffer[position]!==0xff)throw new Error('Invalid JPEG segment boundary.');
  const start=position;while(buffer[position]===0xff)position++;const marker=buffer[position++];
  if(marker===0xd9)break;
  if(marker===0xda){streamStart=start;break}
  if(marker===0x01||(marker>=0xd0&&marker<=0xd7))continue;
  if(position+2>buffer.length)throw new Error('Truncated JPEG segment.');
  const length=buffer.readUInt16BE(position),payloadStart=position+2,end=position+length;
  if(length<2||end>buffer.length)throw new Error('Invalid JPEG segment length.');
  const isExif=marker===0xe1&&startsWith(buffer,payloadStart,end,exifSignature);
  const isXmp=marker===0xe1&&xmpSignatures.some(signature=>startsWith(buffer,payloadStart,end,signature));
  const isPhotoshop=marker===0xed&&startsWith(buffer,payloadStart,end,photoshopSignature);
  const isIptc=marker===0xed&&(containsIptc(buffer,payloadStart,end)||(isPhotoshop&&photoshopHasIptcResource(buffer,payloadStart,end)));
  segments.push({start,end,marker,payloadStart,isExif,isXmp,isPhotoshop,isIptc});
  if(sofMarkers.has(marker)&&payloadStart+5<=end){height=buffer.readUInt16BE(payloadStart+1);width=buffer.readUInt16BE(payloadStart+3)}
  position=end;
 }
 if(streamStart<0||!width||!height)throw new Error('JPEG image data or dimensions are missing.');
 return{segments,streamStart,width,height};
};

const exifOrientation=(buffer:Buffer,segment:Segment)=>{
 const tiff=segment.payloadStart+6;if(tiff+8>segment.end)return undefined;
 const little=buffer.toString('ascii',tiff,tiff+2)==='II';
 if(!little&&buffer.toString('ascii',tiff,tiff+2)!=='MM')return undefined;
 const uint16=(offset:number)=>little?buffer.readUInt16LE(offset):buffer.readUInt16BE(offset);
 const uint32=(offset:number)=>little?buffer.readUInt32LE(offset):buffer.readUInt32BE(offset);
 const ifd=tiff+uint32(tiff+4);if(ifd+2>segment.end)return undefined;
 const count=uint16(ifd);
 for(let index=0;index<count;index++){
  const entry=ifd+2+(index*12);if(entry+12>segment.end)return undefined;
  if(uint16(entry)===0x0112&&uint16(entry+2)===3&&uint32(entry+4)===1)return uint16(entry+8);
 }
 return undefined;
};

export const inspectJpeg=(buffer:Buffer):JpegInspection=>{
 const parsed=parseSegments(buffer),exif=parsed.segments.filter(segment=>segment.isExif);
 const privacyMetadata=parsed.segments.filter(segment=>segment.isExif||segment.isXmp||segment.isPhotoshop||segment.isIptc);
 return{width:parsed.width,height:parsed.height,orientation:exif.map(segment=>exifOrientation(buffer,segment)).find(value=>value!==undefined),exifSegments:exif.length,xmpSegments:parsed.segments.filter(segment=>segment.isXmp).length,photoshopSegments:parsed.segments.filter(segment=>segment.isPhotoshop).length,iptcSegments:parsed.segments.filter(segment=>segment.isIptc).length,privacyMetadataSegments:privacyMetadata.length,imageStreamHash:createHash('sha256').update(buffer.subarray(parsed.streamStart)).digest('hex')};
};

export const stripPrivacyMetadata=(buffer:Buffer)=>{
 const parsed=parseSegments(buffer),removals=parsed.segments.filter(segment=>segment.isExif||segment.isXmp||segment.isPhotoshop||segment.isIptc);
 if(!removals.length)return buffer;
 const chunks:Buffer[]=[];let cursor=0;
 for(const segment of removals){chunks.push(buffer.subarray(cursor,segment.start));cursor=segment.end}
 chunks.push(buffer.subarray(cursor));return Buffer.concat(chunks);
};

const publicPhotoRoot=resolve('public/photos');
const safeTarget=(value:string)=>{const target=resolve(value);if(target!==publicPhotoRoot&&!target.startsWith(`${publicPhotoRoot}${sep}`))throw new Error('Target must stay within public/photos.');return target};
const jpegFiles=(target:string)=>readdirSync(target,{recursive:true,withFileTypes:true}).filter(entry=>entry.isFile()&&['.jpg','.jpeg'].includes(extname(entry.name).toLowerCase())).map(entry=>resolve(entry.parentPath,entry.name));

if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
 const [mode,value]=process.argv.slice(2);if(!mode||!value)throw new Error('Use --inspect, --check, or --strip with a public/photos path.');const target=safeTarget(value);
 if(mode==='--inspect'){const report=inspectJpeg(readFileSync(target));console.log(JSON.stringify(report))}
 else if(mode==='--check'){const files=jpegFiles(target),failures=files.filter(file=>inspectJpeg(readFileSync(file)).privacyMetadataSegments>0);if(failures.length)throw new Error(`${failures.length} public gallery JPEG file(s) still contain EXIF, XMP, or IPTC/Photoshop metadata.`);console.log(`Image privacy check passed: ${files.length} JPEG files contain no EXIF, XMP, or IPTC/Photoshop metadata.`)}
 else if(mode==='--strip'){
  const beforeBuffer=readFileSync(target),before=inspectJpeg(beforeBuffer);if(before.orientation!==undefined&&before.orientation!==1)throw new Error('Refusing to remove a non-default orientation without a lossless orientation transform.');
  const afterBuffer=stripPrivacyMetadata(beforeBuffer),after=inspectJpeg(afterBuffer);if(before.width!==after.width||before.height!==after.height||before.imageStreamHash!==after.imageStreamHash)throw new Error('Image data changed during metadata removal.');
  writeFileSync(target,afterBuffer);console.log(JSON.stringify({width:after.width,height:after.height,orientation:after.orientation??1,removedExifSegments:before.exifSegments-after.exifSegments,removedXmpSegments:before.xmpSegments-after.xmpSegments,removedPhotoshopSegments:before.photoshopSegments-after.photoshopSegments,removedIptcSegments:before.iptcSegments-after.iptcSegments,imageStreamPreserved:true}));
 }else throw new Error('Unknown mode.');
}
