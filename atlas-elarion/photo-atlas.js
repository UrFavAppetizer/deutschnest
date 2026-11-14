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
  title:"Kawasan Perdagangan Timur",
  file:"./assets/trade-illustrated.webp",
  aspect:1536/1024,
  note:"Peta wilayah dari pemain. Catatan lokasi diambil dari ilustrasi; informasi lama yang berbeda dari canon harus dikonfirmasi sebelum ditetapkan.",
  points:[
   {x:31.3,y:43.5,name:"Duskcrown Inn",t:"local",id:"duskcrown"},
   {x:46.5,y:25,name:"Kantor Perdagangan Timur",t:"note",id:"trade-hall",detail:"Pusat administrasi dagang dalam peta wilayah."},
   {x:50.6,y:41,name:"Pasar Besar Timur",t:"note",id:"trade-market",detail:"Alun-alun dan pasar yang tergambar di jantung kawasan perdagangan."},
   {x:31.5,y:55.9,name:"Bengkel Eamon",t:"local",id:"eamon"},
   {x:68.6,y:37.5,name:"Emberforge",t:"local",id:"emberforge"},
   {x:69.6,y:49.7,name:"Gudang #4",t:"local",id:"warehouse4"},
   {x:63.6,y:55.9,name:"Distrik Pelabuhan",t:"note",id:"trade-harbor",detail:"Distrik perairan dan dermaga pada ilustrasi kawasan."},
   {x:31.9,y:30.2,name:"Distrik Riset & Akademik",t:"note",id:"trade-academy",detail:"Zona riset dan akademik pada peta yang dikirimkan pemain."},
   {x:74.2,y:54.6,name:"Klinik Nessa Briar (peta)",t:"note",id:"trade-nessa",detail:"Nama klinik tercantum pada peta ilustrasi. Jangan otomatis menyamakan dengan Pusat Perawatan Nessa Briar yang sudah canon di Avelorn."},
   {x:57.2,y:67,name:"Permukiman Selatan",t:"note",id:"trade-south",detail:"Permukiman selatan berdasarkan ilustrasi peta."},
   {x:42.8,y:17.4,name:"Permukiman Utara",t:"note",id:"trade-north",detail:"Permukiman utara berdasarkan ilustrasi peta."}
  ]
 },
 capital:{
  title:"Ibu Kota Kerajaan Asteria",
  file:"./assets/capital-illustrated.webp",
  aspect:1448/1086,
  note:"Peta ibu kota dari pemain. Nama kota tetap belum ditetapkan; detail ilustrasi tidak otomatis mengganti canon tertulis.",
  points:[
   {x:49.5,y:49.0,name:"Grand Asteria Royal Plaza",t:"local",id:"royal-plaza"},
   {x:49.7,y:21.2,name:"Istana Kerajaan Asteria",t:"note",id:"royal-palace",detail:"Istana dan pusat pemerintahan sebagaimana dilukiskan dalam gambar."},
   {x:49.5,y:31.0,name:"Aula Audiensi Kerajaan",t:"note",id:"royal-audience",detail:"Aula pertemuan dan audiensi dalam legenda peta."},
   {x:61.0,y:31.7,name:"Arsip Kerajaan",t:"note",id:"royal-archive",detail:"Lokasi penyimpanan catatan sejarah kerajaan pada ilustrasi."},
   {x:30.9,y:39.2,name:"Distrik Bangsawan",t:"note",id:"royal-noble",detail:"Area bangunan bangsawan yang tergambar di sisi barat kota."},
   {x:70.9,y:28.5,name:"Distrik Kuil",t:"note",id:"royal-temple",detail:"Kawasan kuil dan bangunan keagamaan pada peta yang diberikan."},
   {x:29.1,y:26.0,name:"Distrik Sarjana",t:"note",id:"royal-scholars",detail:"Fasilitas ilmu dan pendidikan pada ilustrasi ibu kota."},
   {x:49.8,y:57.0,name:"Distrik Pasar Besar",t:"note",id:"royal-market",detail:"Sentra pasar yang tergambar di selatan Royal Plaza."},
   {x:67.7,y:41.0,name:"Distrik Pengrajin",t:"note",id:"royal-crafts",detail:"Lingkungan bengkel dan kerajinan dalam peta."},
   {x:27.1,y:53.4,name:"Barak Garda Kerajaan",t:"note",id:"royal-guards",detail:"Fasilitas Garda Kerajaan berdasarkan penanda peta."},
   {x:35.0,y:61.0,name:"Taman Mahkota",t:"note",id:"royal-garden",detail:"Taman besar yang terlihat di dalam benteng kota."},
   {x:68.3,y:60.6,name:"Pelabuhan Kerajaan",t:"note",id:"royal-harbor",detail:"Dermaga dan pelabuhan yang terlihat pada gambar."},
   {x:28.5,y:47.3,name:"Perpustakaan Kerajaan",t:"note",id:"royal-library",detail:"Penanda perpustakaan dan arsip akademik dalam peta."}
  ]
 }

};
let current=null,enabled=true,imgUrl=null,pane=null,img=null,hotspots=null,info=null,note=null,toolbar=null,btnMode=null,btnUpload=null,status=null;
let dbPromise;
function db(){if(!("indexedDB" in window))return Promise.resolve(null);if(!dbPromise)dbPromise=new Promise(resolve=>{try{const request=indexedDB.open("elarion-custom-map-art",1);request.onupgradeneeded=()=>request.result.createObjectStore("images");request.onsuccess=()=>resolve(request.result);request.onerror=()=>resolve(null)}catch{resolve(null)}});return dbPromise}
async function stored(key){const d=await db();if(!d)return null;return new Promise(resolve=>{try{const t=d.transaction("images","readonly"),q=t.objectStore("images").get(key);q.onsuccess=()=>resolve(q.result||null);q.onerror=()=>resolve(null)}catch{resolve(null)}})}
async function save(key,blob){const d=await db();if(!d)return false;return new Promise(resolve=>{try{const t=d.transaction("images","readwrite");t.objectStore("images").put(blob,key);t.oncomplete=()=>resolve(true);t.onerror=()=>resolve(false)}catch{resolve(false)}})}
function identify(state){if(state?.mode==="world")return"asteria";if(state?.mode==="realm"&&state?.realm==="asteria")return"asteria";if(state?.mode==="city"&&scenes[state.place])return state.place;return null}
function currentScene(){const fragment=location.hash.slice(1);if(fragment==="world"||fragment==="asteria"||!fragment)return"asteria";if(scenes[fragment])return fragment;return null}
function removeImage(){if(imgUrl?.startsWith("blob:"))URL.revokeObjectURL(imgUrl);imgUrl=null;img.onload=null;img.onerror=null;img.removeAttribute("src");pane.hidden=true;$("mapStage").classList.remove("illustrated-active");$("mapSvg").style.opacity="";$("mapSvg").style.pointerEvents="";$("mapStage").style.removeProperty("--art-ratio");hotspots.replaceChildren();if(info)info.hidden=true;}
function mark(label){if(status)status.textContent=label}
function renderSpots(key,mode){hotspots.replaceChildren();if(info)info.hidden=true;
 const arr=scenes[key].points.filter(p=>(mode==="world"?p.t==="realm":mode==="realm"?p.t==="place":(p.t==="local"||p.t==="note")));
 for(const loc of arr){const b=document.createElement("button");b.type="button";b.className="art-hotspot"+(loc.t==="note"?" art-hotspot-note":"");b.style.left=loc.x+"%";b.style.top=loc.y+"%";b.dataset.id=loc.id;b.innerHTML='<span class="art-hotspot-orbit"><span class="art-hotspot-core">✦</span></span><span class="art-hotspot-tip">'+loc.name+'</span>';b.setAttribute("aria-label","Buka "+loc.name);b.title=loc.name;b.onclick=()=>openLocation(loc);hotspots.appendChild(b);}
}
function openLocation(loc){
 if(loc.t==="note"){showInfo(loc);return}
 let nodes=[...document.querySelectorAll("#mapSvg .map-hit")];
 if(loc.t==="realm"){const direct=document.querySelector('.realm-item[data-realm="'+loc.id+'"]');if(direct){direct.click();return}}
 let hit=nodes.find(n=>n.getAttribute("aria-label")==="Buka "+loc.name);
 if(hit){hit.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}));return}
 if(loc.id==="royal-plaza"){let name="Grand Asteria Royal Plaza";hit=nodes.find(n=>n.getAttribute("aria-label")==="Buka "+name);if(hit){hit.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}));return}}
 // Clicking a pin is always a navigation attempt; never silently fake success.
 mark("Lokasi tidak tersedia pada lapisan interaktif ini.");
}
function showInfo(loc){
 if(!info)return;
 info.hidden=false;
 info.innerHTML='<button class="art-info-close" type="button" aria-label="Tutup">✕</button><small>✧ PENANDA PADA PETA ILUSTRASI</small><strong></strong><p></p><span>Rincian dari gambar pemain · belum otomatis menjadi canon naratif.</span>';
 info.querySelector("strong").textContent=loc.name;
 info.querySelector("p").textContent=loc.detail||"Lokasi tercantum dalam peta ilustrasi kawasan ini.";
 info.querySelector("button").onclick=()=>info.hidden=true;
}
function showPhoto(url,key,mode,aspect){img.onload=()=>{if(current!==key||!enabled)return;const stage=$("mapStage");pane.hidden=false;stage.classList.add("illustrated-active");stage.style.setProperty("--art-ratio",aspect);$("mapSvg").style.opacity="0";$("mapSvg").style.pointerEvents="none";renderSpots(key,mode);mark("PETA ILUSTRASI AKTIF");};
img.onerror=()=>{if(current===key){removeImage();mark("Gambar tidak ditemukan. Pilih file peta untuk mengaktifkan ilustrasi.")}};
imgUrl=url;img.src=url;
}
async function load(key,mode,version){const row=scenes[key];if(!row)return;const thisVersion=version;
 const local=await stored(key);if(thisVersion!==loadVersion||current!==key||!enabled)return;
 if(local instanceof Blob){const url=URL.createObjectURL(local);showPhoto(url,key,mode,row.aspect);return}
 // Public GitHub assets automatically replace local uploads when local is absent.
 showPhoto(row.file+"?v=4",key,mode,row.aspect);
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
 pane.innerHTML='<div class="atlas-photo-frame"><img class="atlas-photo-img" alt="Ilustrasi peta fantasi yang terhubung dengan lokasi interaktif"><div class="atlas-photo-spots"></div></div><div class="art-location-info" hidden></div>';
 img=pane.querySelector("img");hotspots=pane.querySelector(".atlas-photo-spots");info=pane.querySelector(".art-location-info");stage.insertBefore(pane,stage.firstChild);
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