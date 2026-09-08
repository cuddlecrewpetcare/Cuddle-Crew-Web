export type GalleryCategory='lauren'|'client';

export type GalleryPhoto={
 src:string;
 folder:string;
 folderLabel:string;
 category:GalleryCategory;
 alt:string;
 objectPosition:string;
 width:number;
 height:number;
 homepageMain?:boolean;
};

export const galleryPhotos:readonly GalleryPhoto[]=[
 {src:"/photos/bambi - lauren's cat/lauren-cat-bambi-portrait.jpeg",folder:"bambi - lauren's cat",folderLabel:"Bambi — Lauren’s cat",category:'lauren',alt:'Bambi, a long-haired gray cat, resting indoors',objectPosition:'50% 52%',width:1350,height:1800},
 {src:"/photos/bambi - lauren's cat/lauren-cat-bambi-closeup.jpeg",folder:"bambi - lauren's cat",folderLabel:"Bambi — Lauren’s cat",category:'lauren',alt:'Close portrait of Bambi’s blue eyes and gray face',objectPosition:'50% 42%',width:1012,height:1800},
 {src:"/photos/ponyo - lauren's cat/lauren-cat-ponyo-couch.jpeg",folder:"ponyo - lauren's cat",folderLabel:"Ponyo — Lauren’s cat",category:'lauren',alt:'Ponyo, a gray-and-white cat, reclining on a sofa',objectPosition:'54% 48%',width:1350,height:1800},
 {src:"/photos/ponyo - lauren's cat/lauren-cat-ponyo-closeup.jpeg",folder:"ponyo - lauren's cat",folderLabel:"Ponyo — Lauren’s cat",category:'lauren',alt:'Close side portrait of Ponyo’s gray-and-white face',objectPosition:'54% 38%',width:1350,height:1800},
 {src:"/photos/ponyo and bambi - lauren's cats/lauren-cat-ponyo-and-bambi-window.jpeg",folder:"ponyo and bambi - lauren's cats",folderLabel:"Ponyo and Bambi — Lauren’s cats",category:'lauren',alt:'Ponyo and Bambi sitting together on a sunny windowsill',objectPosition:'52% 50%',width:1800,height:1350},
 {src:"/photos/ponyo and bambi - lauren's cats/lauren-cat-ponyo-and-bambi-kittens.jpg",folder:"ponyo and bambi - lauren's cats",folderLabel:"Ponyo and Bambi — Lauren’s cats",category:'lauren',alt:'Ponyo and Bambi as kittens sitting together indoors',objectPosition:'48% 48%',width:1800,height:1681},
 {src:'/photos/blu - client dog/client-dog-blu-first-page-photo.jpeg',folder:'blu - client dog',folderLabel:'Blu — client dog',category:'client',alt:'Blu, a blue merle Australian shepherd, sitting on green grass',objectPosition:'50% 48%',width:1350,height:1800,homepageMain:true},
 {src:'/photos/blu - client dog/client-dog-blu-inside-smile.jpeg',folder:'blu - client dog',folderLabel:'Blu — client dog',category:'client',alt:'Blu smiling while sitting indoors',objectPosition:'50% 43%',width:1350,height:1800},
 {src:'/photos/blu - client dog/client-dog-blu-walk.jpeg',folder:'blu - client dog',folderLabel:'Blu — client dog',category:'client',alt:'Blu outdoors with a bright green leash',objectPosition:'52% 46%',width:1350,height:1800},
 {src:'/photos/loki - client dog/client-dog-loki-portrait.jpeg',folder:'loki - client dog',folderLabel:'Loki — client dog',category:'client',alt:'Loki, a tan-and-white dog with upright ears, facing the camera outdoors',objectPosition:'48% 44%',width:1350,height:1800},
 {src:'/photos/loki - client dog/client-dog-loki-sun.JPEG',folder:'loki - client dog',folderLabel:'Loki — client dog',category:'client',alt:'Loki resting with eyes closed in the sunshine',objectPosition:'54% 54%',width:3024,height:4032},
 {src:'/photos/loki - client dog/client-dog-loki-walk.jpeg',folder:'loki - client dog',folderLabel:'Loki — client dog',category:'client',alt:'Loki looking toward the camera during an outdoor walk',objectPosition:'52% 46%',width:1350,height:1800},
 {src:'/photos/skylar - client dog/client-dog-skylar-smile.jpeg',folder:'skylar - client dog',folderLabel:'Skylar — client dog',category:'client',alt:'Skylar, a black-and-white dog, smiling outdoors',objectPosition:'50% 43%',width:1350,height:1800},
 {src:'/photos/skylar - client dog/client-dog-skylar-posing.jpeg',folder:'skylar - client dog',folderLabel:'Skylar — client dog',category:'client',alt:'Skylar sitting in profile on green grass',objectPosition:'60% 52%',width:1350,height:1800},
 {src:'/photos/skylar - client dog/client-dog-skylar-head-tilt.jpeg',folder:'skylar - client dog',folderLabel:'Skylar — client dog',category:'client',alt:'Skylar tilting her head while sitting outdoors',objectPosition:'50% 48%',width:1350,height:1800},
] as const;

export const homepageMainPhoto=galleryPhotos.find(photo=>photo.homepageMain)!;
