/* ATLAS ELARION — Illustrated Map Viewer v3
   Image-backed cartography + accessible interactive hotspots. 
   Art is optional and never changes canon / authoritative coordinates.
   Fully offline after user selects a local image; stored in IndexedDB.
*/
(()=>{"use strict";
const $=id=>document.getElementById(id);
const scenes={
 asteria:{
  title:"Atlas Kerajaan Asteria",
  file:"./assets/asteria-illustrated.webp",
  aspect:1448/1086,
  note:"Ilustrasi atlas terdahulu. Informasi dalam panel canon mengatasi teks historis pada gambar.",
  points:[
   {x:53,y:22,name:"Nordheim",t:"realm",id:"nordheim"},
   {x:21,y:28,name:"Valemere",t:"realm",id:"valemere"},
   {x:51,y:29,name:"Asteria",t:"realm",id:"asteria"},
   {x:96,y:27,name:"Solarian",t:"realm",id:"solarian"},
   {x:52,y:73,name:"Rivermere",t:"realm",id:"rivermere"},
   {x:43,y:42,name:"Avelorn",t:"place",id:"avelorn"},
   {x:83,y:41,name:"Kawasan Perdagangan Timur",t:"place",id:"eastern-trade"},
   {x:68,y:62,name:"Ibu Kota Asteria",t:"place",id:"capital"}
  ]
 },
 avelorn:{
  title:"Kota Avelorn",
  file:"./assets/avelorn-illustrated.webp",
  aspect:1536/1024,
  note:"Ilustrasi kota bersifat artistik. Penempatan persis bangunan hanya mengacu pada canon tertulis.",
  points:[
   {x:35,y:32,name:"Guild Avelorn",t:"local",id:"guild"},
   {x:43,y:24,name:"Lapangan Latihan Guild",t:"local",id:"training"},
   {x:80,y:24,name:"Laboratorium Maelis Thorne",t:"local",id:"maelis"},
   {x:52,y:38,name:"Kantor Pemerintahan Avelorn",t:"local",id:"office"},
   {x:23,y:48,name:"Bengkel Garrick Valen",t:"local",id:"garrick"},
   {x:17,y:52,name:"Rumah Keluarga Valen",t:"local",id:"valen"},
   {x:75,y:32,name:"Distrik Sarjana",t:"local",id:"scholar"},
   {x:50,y:50,name:"Pasar Sentral Avelorn",t:"local",id:"market"},
   {x:58,y:56,name:"Taman Kota Avelorn",t:"local",id:"park"},
   {x:72,y:51,name:"Pusat Perawatan Nessa Briar",t:"local",id:"nessa"},
   {x:14,y:43,name:"Penginapan Rusa Putih",t:"local",id:"stag"},
   {x:80,y:43,name:"Rumah Kaela Thorn",t:"local",id:"kaela"},
   {x:85,y:46,name:"Rumah Oren Bell",t:"local",id:"oren"},
   {x:89,y:50,name:"Rumah Tarin Vale",t:"local",id:"tarin"},
   {x:74,y:65,name:"Starhaven Residence",t:"local",id:"starhaven"},
   {x:52,y:15,name:"Gudang Utara #7",t:"local",id:"warehouse7"}
  ]
 },
 "eastern-trade":{
  title:"Kawasan Perdagangan Timur",file:"./assets/trade-illustrated.webp",
  aspect:1.5,note:"Ilustrasi perdagangan bersifat artistik.",
  points:[
   {x:43,y:45,name:"Duskcrown Inn",t:"local",id:"duskcrown"},
   {x:68,y:49,name:"Emberforge",t:"local",id:"emberforge"},
   {x:35,y:68,name:"Bengkel Eamon",t:"local",id:"eamon"},
   {x:77,y:68,name:"Gudang #4",t:"local",id:"warehouse4"}
  ]
 },
 capital:{title:"Ibu Kota Asteria",file:"./assets/capital-illustrated.webp",aspect:1.5,note:"Tata letak ibu kota belum ditetapkan secara resmi.",points:[{x:50,y:56,name:"Grand Asteria Royal Plaza",t:"local",id:"royal-plaza"}]}
};
let current=null,enabled=true,imgUrl=null,pane=null,img=null,hotspots=null,note=null,toolbar=null,btnMode=null,btnUpload=null,status=null;
let dbPromise;
function db(){if(!("indexedDB" in window))return Promise.resolve(null);if(!dbPromise)dbPromise=new Promise(resolve=>{try{const request=indexedDB.open("elarion-custom-map-art",1);request.onupgradeneeded=()=>request.result.createObjectStore("images");request.onsuccess=()=>resolve(request.result);request.onerror=()=>resolve(null)}catch{resolve(null)}});return dbPromise}
async function stored(key){const d=await db();if(!d)return null;return new Promise(resolve=>{try{const t=d.transaction("images","readonly"),q=t.objectStore("images").get(key);q.onsuccess=()=>resolve(q.result||null);q.onerror=()=>resolve(null)}catch{resolve(null)}})}
async function save(key,blob){const d=await db();if(!d)return false;return new Promise(resolve=>{try{const t=d.transaction("images","readwrite");t.objectStore("images").put(blob,key);t.oncomplete=()=>resolve(true);t.onerror=()=>resolve(false)}catch{resolve(false)}})}
function identify(state){if(state?.mode==="world")return"asteria";if(state?.mode==="realm"&&state?.realm==="asteria")return"asteria";if(state?.mode==="city"&&scenes[state.place])return state.place;return null}
function currentScene(){const fragment=location.hash.slice(1);if(fragment==="world"||fragment==="asteria"||!fragment)return"asteria";if(scenes[fragment])return fragment;return null}
function removeImage(){if(imgUrl?.startsWith("blob:"))URL.revokeObjectURL(imgUrl);imgUrl=null;img.onload=null;img.onerror=null;img.removeAttribute("src");pane.hidden=true;$("mapStage").classList.remove("illustrated-active");$("mapSvg").style.opacity="";$("mapSvg").style.pointerEvents="";$("mapStage").style.removeProperty("--art-ratio");hotspots.replaceChildren();}
function mark(label){if(status)status.textContent=label}
function renderSpots(key,mode){hotspots.replaceChildren();
 const arr=scenes[key].points.filter(p=>(mode==="world"?p.t==="realm":mode==="realm"?p.t==="place":p.t==="local"));
 for(const loc of arr){const b=document.createElement("button");b.type="button";b.className="art-hotspot";b.style.left=loc.x+"%";b.style.top=loc.y+"%";b.dataset.id=loc.id;b.innerHTML='<span class="art-hotspot-orbit"><span class="art-hotspot-core">✦</span></span><span class="art-hotspot-tip">'+loc.name+'</span>';b.setAttribute("aria-label","Buka "+loc.name);b.title=loc.name;b.onclick=()=>openLocation(loc);hotspots.appendChild(b);}
}
function openLocation(loc){
 let nodes=[...document.querySelectorAll("#mapSvg .map-hit")];
 if(loc.t==="realm"){const direct=document.querySelector('.realm-item[data-realm="'+loc.id+'"]');if(direct){direct.click();return}}
 let hit=nodes.find(n=>n.getAttribute("aria-label")==="Buka "+loc.name);
 if(hit){hit.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}));return}
 if(loc.id==="royal-plaza"){let name="Grand Asteria Royal Plaza";hit=nodes.find(n=>n.getAttribute("aria-label")==="Buka "+name);if(hit){hit.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}));return}}
 // Clicking a pin is always a navigation attempt; never silently fake success.
 mark("Lokasi tidak tersedia pada lapisan interaktif ini.");
}
function showPhoto(url,key,mode,aspect){img.onload=()=>{if(current!==key||!enabled)return;const stage=$("mapStage");pane.hidden=false;stage.classList.add("illustrated-active");stage.style.setProperty("--art-ratio",aspect);$("mapSvg").style.opacity="0";$("mapSvg").style.pointerEvents="none";renderSpots(key,mode);mark("PETA ILUSTRASI AKTIF");};
img.onerror=()=>{if(current===key){removeImage();mark("Gambar tidak ditemukan. Pilih file peta untuk mengaktifkan ilustrasi.")}};
imgUrl=url;img.src=url;
}
async function load(key,mode,version){const row=scenes[key];if(!row)return;const thisVersion=version;
 const local=await stored(key);if(thisVersion!==loadVersion||current!==key||!enabled)return;
 if(local instanceof Blob){const url=URL.createObjectURL(local);showPhoto(url,key,mode,row.aspect);return}
 // Public GitHub assets automatically replace local uploads when local is absent.
 showPhoto(row.file+"?v=3",key,mode,row.aspect);
}
let loadVersion=0;
function sync(state){if(!pane)return;const key=identify(state);
 if(key===null){current=null;loadVersion++;removeImage();toolbar.hidden=true;return}
 const mode=state.mode;toolbar.hidden=false;
 const changed=key!==current;
 current=key;
 btnUpload.title="Unggah ilustrasi untuk "+scenes[key].title;
 if(!enabled){removeImage();btnMode.textContent="Aktifkan gambar";mark("Mode peta klasik");return}
 btnMode.textContent="Mode ilustrasi ✓";
 if(changed||pane.hidden){loadVersion++;const version=loadVersion;removeImage();mark("Memuat ilustrasi...");load(key,mode,version)}
 else renderSpots(key,mode);
 transform(state);
}
function transform(s){if(!pane||pane.hidden)return;const x=s.tx/1200*100,y=s.ty/760*100;const k=s.scale||1;const frame=pane.querySelector(".atlas-photo-frame");frame.style.transform="translate("+x+"%,"+y+"%) scale("+k+")";}
async function userFile(file){if(!file||!file.type.startsWith("image/")){mark("Pilih JPG, PNG, AVIF, atau WebP.");return}
 if(file.size>24000000){mark("Gambar terlalu besar (maksimal 24 MB).");return}
 if(!current)return;
 const key=current,ok=await save(key,file);if(!ok)mark("Gambar tersimpan sementara saja.");
 loadVersion++;removeImage();
 const url=URL.createObjectURL(file);showPhoto(url,key,document.getElementById("mapStage").dataset.mapMode,scenes[key].aspect);mark("Peta visual diubah"+(ok?" dan disimpan pada perangkat ini.":"."));
}
function init(){
 const stage=$("mapStage");if(!stage||$("atlasPhotoTools"))return;
 pane=document.createElement("div");pane.id="atlasPhotoPane";pane.className="atlas-photo-pane";pane.hidden=true;
 pane.innerHTML='<div class="atlas-photo-frame"><img class="atlas-photo-img" alt="Ilustrasi peta fantasi yang terhubung dengan lokasi interaktif"><div class="atlas-photo-spots"></div></div>';
 img=pane.querySelector("img");hotspots=pane.querySelector(".atlas-photo-spots");stage.insertBefore(pane,stage.firstChild);
 toolbar=document.createElement("div");toolbar.id="atlasPhotoTools";toolbar.className="atlas-photo-tools";
 toolbar.innerHTML='<div class="atlas-photo-top"><span class="atlas-photo-symbol">✦</span><strong>ILLUSTRATED ATLAS</strong><button class="atlas-photo-mode" type="button">Mode ilustrasi ✓</button><label class="atlas-photo-upload" title="Pilih gambar peta bergaya 3D">＋ Pilih gambar<input class="atlas-photo-input" type="file" accept="image/png,image/jpeg,image/webp,image/avif" hidden></label></div><small class="atlas-photo-status">Ilustrasi dekoratif · navigasi tetap interaktif</small>';
 stage.appendChild(toolbar);
 btnMode=toolbar.querySelector(".atlas-photo-mode");btnUpload=toolbar.querySelector(".atlas-photo-upload");status=toolbar.querySelector(".atlas-photo-status");
 btnMode.onclick=()=>{enabled=!enabled;sync(window.AtlasPhoto.currentState||{mode:"world"})};
 toolbar.querySelector("input").onchange=async e=>{await userFile(e.target.files?.[0]);e.target.value=""};
 stage.addEventListener("dragover",e=>{if(e.dataTransfer?.types?.includes("Files")){e.preventDefault();stage.classList.add("art-drag")}});stage.addEventListener("dragleave",()=>stage.classList.remove("art-drag"));
 stage.addEventListener("drop",e=>{stage.classList.remove("art-drag");if(e.dataTransfer?.files?.length){e.preventDefault();userFile(e.dataTransfer.files[0])}});
 const initial=location.hash.slice(1);
 const base={mode:initial==="world"||!initial?"world":initial==="asteria"?"realm":"city",realm:"asteria",place:initial};
 sync(base);
}
const api={sync(state){api.currentState=Object.assign({},state);sync(state)},transform,init,currentState:null};window.AtlasPhoto=api;
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();