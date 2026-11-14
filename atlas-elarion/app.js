(()=>{'use strict';
const D=window.ATLAS,$=id=>document.getElementById(id),NS="http://www.w3.org/2000/svg";
let state={mode:"world",realm:"asteria",place:null,selected:null,scale:1,tx:0,ty:0,showTerrain:true,showRoads:true,showBuildings:true,showConcept:true,catalog:"all"};
const realm=id=>D.realms.find(r=>r.id===id), place=id=>D.places.find(p=>p.id===id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const svg=(tag,attrs={},text)=>{const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;return e};
const node=(parent,tag,attrs={},text)=>{const e=svg(tag,attrs,text);parent.appendChild(e);return e};
const statusText=s=>s==="canon"?"CANON RESMI":s==="concept"?"KONSEP · BELUM CANON":"DETAIL BELUM DITETAPKAN";
const activeMap=()=>["world","realm","city","place"].includes(state.mode);
function go(mode,id){state.mode=mode;state.selected=null;state.scale=1;state.tx=0;state.ty=0;
 if(mode==="world"){state.place=null}
 if(mode==="realm"){state.realm=id||"asteria";state.place=null}
 if(mode==="city"){state.place=id;state.realm=place(id)?.realm||"asteria"}
 if(mode==="place"){state.selected=id;state.place=state.place||"avelorn"}
 history.replaceState(null,"","#"+(mode==="world"?"world":mode==="realm"?state.realm:mode==="city"?state.place:state.place+"/"+id));
 render();closeMobile();
}
function regionName(){if(state.mode==="world")return"Elarion";if(state.mode==="realm")return realm(state.realm)?.name||"Asteria";if(state.mode==="city"||state.mode==="place")return place(state.place)?.name||"Avelorn";return""}
function drawDefs(root){const defs=node(root,"defs");
let grad=node(defs,"linearGradient",{id:"land",x1:"0",y1:"0",x2:".9",y2:"1"});node(grad,"stop",{offset:"0%","stop-color":"#60735b"});node(grad,"stop",{offset:"52%","stop-color":"#344e47"});node(grad,"stop",{offset:"100%","stop-color":"#263d3a"});
grad=node(defs,"linearGradient",{id:"landBright",x1:"0",x2:".85",y1:"0",y2:"1"});node(grad,"stop",{offset:"0%","stop-color":"#80916b"});node(grad,"stop",{offset:"100%","stop-color":"#35584e"});
grad=node(defs,"radialGradient",{id:"sea"});node(grad,"stop",{offset:"0%","stop-color":"#294c52"});node(grad,"stop",{offset:"100%","stop-color":"#16313d"});
grad=node(defs,"pattern",{id:"grid",width:48,height:48,patternUnits:"userSpaceOnUse"});node(grad,"path",{d:"M48 0H0V48",fill:"none",stroke:"#b8c8a3","stroke-opacity":".06","stroke-width":1});
let f=node(defs,"filter",{id:"shadow",x:"-30%",y:"-30%",width:"160%",height:"160%"});node(f,"feDropShadow",{dx:"0",dy:"8",stdDeviation:"12","flood-opacity":".35"});
const pat=node(defs,"pattern",{id:"lines",width:9,height:9,patternUnits:"userSpaceOnUse",patternTransform:"rotate(40)"});node(pat,"line",{x1:0,y1:0,x2:0,y2:9,stroke:"#b7a978","stroke-opacity":".08","stroke-width":2});
}
function basicMap(root){node(root,"rect",{width:1200,height:760,fill:"url(#sea)"});node(root,"rect",{width:1200,height:760,fill:"url(#grid)"});
for(let i=0;i<18;i++){let y=30+i*49;node(root,"path",{d:"M0 "+y+" Q300 "+(y-12)+" 600 "+y+" T1200 "+y,stroke:"#7d9b9b","stroke-opacity":".055",fill:"none"})}
for(let i=0;i<17;i++){const x=40+i*72;node(root,"path",{d:"M"+x+" 0Q"+(x-17)+" 390 "+x+" 760",stroke:"#7d9b9b","stroke-opacity":".045",fill:"none"})}}
function path(root,d,color="#a58d64",width=1,dash=""){node(root,"path",{d,fill:"none",stroke:color,"stroke-width":width,"stroke-opacity":".8","stroke-dasharray":dash})}
function terrain(root,x,y,count=5){for(let i=0;i<count;i++){const xx=x+i*39,yy=y+(i%2)*12;node(root,"path",{d:"M"+(xx-23)+" "+(yy+29)+" L"+xx+" "+(yy-19)+" L"+(xx+24)+" "+(yy+29)+" M"+(xx-8)+" "+(yy+2)+" L"+xx+" "+(yy-19)+" L"+(xx+10)+" "+(yy+3),fill:"none",stroke:"#233f39","stroke-width":3,"stroke-opacity":".65"});node(root,"path",{d:"M"+(xx-21)+" "+(yy+26)+" L"+xx+" "+(yy-17)+" L"+(xx+22)+" "+(yy+26),fill:"none",stroke:"#8ca082","stroke-opacity":".55"})}}
function trees(root,x,y,n=6){for(let i=0;i<n;i++){const xx=x+i*19,yy=y+(i%3)*26;node(root,"path",{d:"M"+xx+" "+(yy-10)+"l-12 22h24zM"+xx+" "+(yy-24)+"l-10 22h20z",stroke:"#213d33",fill:"#436a53","fill-opacity":".75","stroke-width":1.4})}}
function label(root,x,y,title,small=false){node(root,"text",{x,y,"text-anchor":"middle",class:small?"map-svg-small":"map-svg-label"},title)}
function marker(root,p,onClick,options={}){const g=node(root,"g",{class:"map-hit",tabindex:"0",role:"button","aria-label":"Buka "+p.name});const x=p.x,y=p.y;
node(g,"circle",{cx:x,cy:y,r:18,fill:"#d5b880","fill-opacity":".10",stroke:"#dfbd83","stroke-opacity":".65","stroke-width":1});
node(g,"circle",{cx:x,cy:y,r:8,fill:p.status==="concept"?"#af8970":"#1b3134",stroke:p.status==="concept"?"#e6ae94":"#f0d19b","stroke-width":2});
node(g,"circle",{cx:x,cy:y,r:3,class:"marker-core",fill:p.status==="concept"?"#edbd96":"#eed49a"});
if(!options.noLabel){node(g,"text",{x,y:y+33,class:options.small?"map-svg-small":"map-svg-label","text-anchor":"middle"},p.name)}
g.addEventListener("click",e=>{e.stopPropagation();onClick()});
g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onClick()}});
g.addEventListener("pointerenter",e=>showTip(e,p.name,p.type||"Lokasi"));g.addEventListener("pointerleave",hideTip);return g}
function showTip(e,title,sub){const box=$("mapStage").getBoundingClientRect(),tip=$("mapTooltip");tip.innerHTML="<strong>"+esc(title)+"</strong><small>"+esc(sub)+"</small>";tip.hidden=false;let r=e.currentTarget.getBoundingClientRect();tip.style.left=Math.max(5,Math.min(r.left-box.left+25,box.width-205))+"px";tip.style.top=Math.max(8,r.top-box.top-25)+"px"}
function hideTip(){$("mapTooltip").hidden=true}
function land(root,d,bright=false){node(root,"path",{d,fill:bright?"url(#landBright)":"url(#land)",stroke:"#afac83","stroke-width":3,filter:"url(#shadow)"});node(root,"path",{d,fill:"url(#lines)",stroke:"#c7b887","stroke-width":.7,"stroke-opacity":".4"})}
function drawWorld(root){const regions=[
{id:"valemere",d:"M58 233 Q109 166 230 151L346 171 395 238 366 323 333 425 248 476 106 434 55 344Z",x:194,y:308},
{id:"nordheim",d:"M340 65 Q462 19 582 64L660 83 714 197 660 277 561 285 483 233 389 256 347 175Z",x:524,y:151},
{id:"asteria",d:"M398 285 Q455 254 510 292L569 251 669 283 740 353 718 455 675 549 560 577 438 544 354 480 361 379Z",x:540,y:405},
{id:"solarian",d:"M735 197 Q880 165 1030 190L1165 300 1093 406 1008 497 840 470 736 377 704 280Z",x:914,y:323},
{id:"rivermere",d:"M455 551 Q522 574 611 588L683 549 775 592 838 667 767 720 614 732 462 687 394 616Z",x:614,y:644}
];
regions.forEach(r=>{land(root,r.d,r.id==="asteria");const g=node(root,"g",{class:"map-hit",role:"button",tabindex:"0","aria-label":"Masuk kerajaan "+realm(r.id).name});node(g,"path",{d:r.d,fill:"transparent",stroke:r.id==="asteria"?"#e2cb92":"#b8b08a","stroke-width":r.id==="asteria"?3:1.5,"stroke-dasharray":r.id==="asteria"?"":"7 4"});node(g,"text",{x:r.x,y:r.y,class:"map-svg-label","text-anchor":"middle"},realm(r.id).name.toUpperCase());node(g,"text",{x:r.x,y:r.y+23,class:"map-svg-small","text-anchor":"middle"},realm(r.id).capital);g.addEventListener("click",()=>go("realm",r.id));g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go("realm",r.id)}});g.addEventListener("pointerenter",e=>showTip(e,realm(r.id).name,"Kerajaan · Ibu kota: "+realm(r.id).capital));g.addEventListener("pointerleave",hideTip)});
if(state.showTerrain){terrain(root,420,98,6);terrain(root,840,225,4);trees(root,402,393,6);trees(root,145,311,4)}
if(state.showBuildings&&window.ELARION_ART)window.ELARION_ART.world(root);
node(root,"text",{x:66,y:660,class:"map-svg-water"},"THE WESTERN SEA");node(root,"text",{x:941,y:598,class:"map-svg-water"},"THE EASTERN SEA");
}
function drawAsteria(root){const d="M159 237 Q200 138 329 103L447 89 525 128 614 99 748 133 895 185 980 259 1053 342 1012 442 961 528 933 648 797 704 656 672 536 699 396 661 300 604 202 527 145 390Z";
land(root,d,true);
if(state.showTerrain){terrain(root,299,151,10);terrain(root,753,219,6);trees(root,235,317,7);trees(root,225,362,6);trees(root,378,612,5);node(root,"ellipse",{cx:197,cy:467,rx:65,ry:31,fill:"#366b70",stroke:"#83a99a","stroke-width":2});node(root,"path",{d:"M952 550Q892 566 897 689 1050 745 1165 610 1120 534 1005 527Z",fill:"#2c545b",stroke:"#9caf96","stroke-width":2});D.terrain.forEach(t=>node(root,"text",{x:t.x,y:t.y,class:t.name.includes("Teluk")||t.name.includes("Danau")?"map-svg-water":"map-svg-terrain","text-anchor":"middle"},t.name))}
if(state.showRoads){path(root,"M495 307Q625 285 811 339","#d7bb7d",4,"8 8");path(root,"M495 307Q540 452 588 560","#c7ac7b",3,"8 8");path(root,"M811 339Q739 480 588 560","#c7ac7b",3,"8 8")}
if(state.showBuildings&&window.ELARION_ART)window.ELARION_ART.realm(root);
D.places.filter(p=>p.realm==="asteria"&&(p.status!=="concept"||state.showConcept)).forEach(p=>marker(root,p,()=>{state.selected=p.id;state.mode="realm";state.realm="asteria";renderDossier();if(p.entry)go("city",p.id);else{state.selected=p.id;renderDossier()}}, {small:p.status==="concept"}));
}
function drawCity(root,which){const isAve=which==="avelorn",isTrade=which==="eastern-trade",isCapital=which==="capital";
if(isCapital){land(root,"M140 170 Q400 52 640 118T1060 205L1088 530Q840 682 552 653T142 550Z",true);terrain(root,200,171,4);trees(root,824,470,8);path(root,"M180 430Q490 445 990 407","#a1b49e",14);if(state.showBuildings&&window.ELARION_ART)window.ELARION_ART.capital(root);node(root,"text",{x:615,y:320,class:"map-svg-label","text-anchor":"middle"},"IBU KOTA ASTERIA");label(root,617,355,"Peta rinci belum ditetapkan",true);marker(root,{x:618,y:436,name:"Grand Asteria Royal Plaza",type:"Lokasi upacara"},()=>selectLocal({name:"Grand Asteria Royal Plaza",type:"Lokasi kerajaan",description:"Lokasi upacara penghargaan kerajaan Day 423. Gedung, tata jalan dan detail posisi belum memiliki peta canon."}),{small:true});return}
if(!isAve&&!isTrade){land(root,"M160 170Q480 80 670 145T1020 230L1000 602Q650 688 366 630T160 170Z");label(root,599,316,place(which)?.name||"Wilayah");label(root,599,350,"Belum ada peta lokal canon",true);return}
let boundary=isAve?"M240 215L390 112 680 118 898 201 952 364 895 601 719 674 441 651 214 511 189 336Z":"M178 267Q387 128 660 182T986 298L1021 561Q724 691 396 636T178 267Z";
land(root,boundary,true);
if(state.showBuildings&&window.ELARION_ART)window.ELARION_ART.cityBase(root,which);
if(isAve){node(root,"path",{d:"M110 690Q430 666 593 697T1095 675",fill:"none",stroke:"#4a8388","stroke-width":28,"stroke-opacity":".65"});node(root,"text",{x:440,y:718,class:"map-svg-water"},"Sungai Astra");trees(root,225,183,4);trees(root,723,576,5);
 if(state.showRoads){["M210 350Q555 420 934 351","M590 120Q570 389 606 654","M325 480Q524 323 744 235","M300 490Q590 520 855 435","M355 210Q472 265 538 279","M705 219Q780 373 749 596"].forEach(d=>path(root,d,"#b6a779",9))}
 const labels=[["GUDANG UTARA",565,99],["DISTRIK GUILD",450,190],["DISTRIK SARJANA",812,195],["PASAR & PUSAT",540,563],["HUNIAN BARAT",278,562],["HUNIAN TIMUR",867,304]];labels.forEach(t=>node(root,"text",{x:t[1],y:t[2],class:"map-svg-terrain","text-anchor":"middle"},t[0]));
 } else {if(state.showRoads){["M198 390Q650 385 983 399","M600 185Q574 410 600 644","M330 533Q617 270 897 540"].forEach(d=>path(root,d,"#b6a779",12))}trees(root,194,280,5)}
if(state.showBuildings&&window.ELARION_ART)window.ELARION_ART.cityDetail(root,which);
const locations=isAve?D.avelorn:D.trade;
locations.forEach(p=>marker(root,p,()=>selectLocal(p),{small:true,noLabel:false}));
}
function selectLocal(p){state.selected=p.id||p.name;state.local=p;renderDossier()}
function renderMap(){const el=$("mapSvg");el.replaceChildren();el.setAttribute("viewBox","0 0 1200 760");drawDefs(el);const g=node(el,"g",{id:"carto"});basicMap(g);
if(state.mode==="world")drawWorld(g);else if(state.mode==="realm"&&state.realm==="asteria")drawAsteria(g);else if(state.mode==="realm"){drawWorld(g)}else drawCity(g,state.place);
const current=$("carto");current.setAttribute("transform","translate("+state.tx+" "+state.ty+") scale("+state.scale+")");
$("zoomVal").textContent=Math.round(state.scale*100)+"%";
$("mapStage").dataset.mapMode=state.mode;
$("mapRegionLabel").textContent=state.mode==="world"?"CONTINENTAL CHART — ELARION":state.mode==="realm"?"REGIONAL CHART — "+regionName().toUpperCase():"CITY CHART — "+regionName().toUpperCase();
$("mapHint").textContent=state.mode==="world"?"Pilih sebuah kerajaan untuk menelusurinya":state.mode==="realm"?"Klik titik lokasi untuk membaca atau masuk ke kotanya":"Klik penanda untuk membuka keterangan lokasi";
if(window.AtlasPhoto)window.AtlasPhoto.sync(state);
}
function dossierData(){if(state.mode==="world")return {name:"Benua Elarion",type:"THE KNOWN WORLD",description:"Sebuah dunia yang dipisahkan oleh wilayah dan disatukan oleh legenda. Lima kerajaan kini tercatat dalam Atlas Elarion.",details:"Asteria adalah wilayah fokus cerita. Peta ini menggambarkan arah relatif antarkerajaan; batas dan jarak tidak merupakan data geodesi.",status:"canon",icon:"✧"};
if(state.mode==="realm"){return state.selected?place(state.selected)||realm(state.realm):realm(state.realm)}
if(state.mode==="city")return state.selected&&state.local?state.local:place(state.place);
return state.local||place(state.place)}
function renderDossier(){const d=dossierData(),panel=$("dossier");if(!d)return;
const isWorld=state.mode==="world",isRealm=state.mode==="realm"&&!state.selected,isLocal=!!state.local&&!!state.selected;
const type=d.type||d.region||"Kerajaan";const icon=d.icon||d.flag||(d.status==="concept"?"✧":isLocal?"⌖":"✦");
let html='<div class="dossier-cover"><span>'+esc(icon)+'</span></div><div class="dossier-body"><div class="dossier-category">✦ '+esc(type.toUpperCase())+'</div><h2>'+esc(d.name)+'</h2><div><span class="status-pill '+esc(d.status||"canon")+'">'+statusText(d.status||"canon")+'</span></div><p>'+esc(d.description||"")+'</p>';
if(d.details)html+='<p>'+esc(d.details)+'</p>';
html+='<div class="dossier-divider"></div><div class="dossier-subtitle">✧ ARSIP WILAYAH</div>';
if(isWorld){html+=stat("Wilayah","5 kerajaan") +stat("Fokus","Kerajaan Asteria") +stat("Sumber","Atlas canon v1.0");}
else if(isRealm){html+=stat("Ibu kota",d.capital)+stat("Letak",d.region)+stat("Status geografi","Canon resmi");}
else if(isLocal){html+=stat("Jenis",d.type)+stat("Lokasi",place(state.place)?.name||"Avelorn") +stat("Status","Canon lokasi");}
else{html+=stat("Jenis",d.type)+stat("Kerajaan",realm(d.realm)?.name||"Asteria")+stat("Status arsip",statusText(d.status));}
if((state.mode==="city"||state.mode==="realm")&&!state.selected&&d.id==="avelorn"){html+='<div class="dossier-meta"><b>16 titik penting</b> dapat dipilih pada peta kota. Guild dan Lapangan Brom terletak berdekatan.</div>'}
if(d.id==="asteria"){html+='<div class="dossier-location-list">'+D.places.filter(p=>p.realm==="asteria"&&p.status!=="concept").map(p=>'<button data-place="'+p.id+'">⌖ '+esc(p.name)+'</button>').join("")+'</div>'}
if(isWorld)html+='<button class="dossier-action" data-enter="asteria">JELAJAHI ASTERIA &nbsp; ↗</button>';
else if(isRealm&&d.id!=="asteria")html+='<button class="dossier-action" data-enter="asteria">KEMBALI KE ASTERIA &nbsp; ↗</button>';
else if(state.mode==="realm"&&state.selected){let p=place(state.selected);if(p?.entry)html+='<button class="dossier-action" data-enter="'+p.id+'">MASUK PETA LOKASI &nbsp; ↗</button>'}
else if(state.mode==="city"){html+='<button class="dossier-secondary" data-back="asteria">← Kembali ke Kerajaan Asteria</button>'}
if(!d.details&&!isWorld&&!isRealm){html+='<p class="dossier-meta">Keterangan lebih lanjut akan dibuka ketika canon tersedia.</p>'}
panel.innerHTML=html+"</div>";
panel.querySelectorAll("[data-enter]").forEach(b=>b.onclick=()=>{let id=b.dataset.enter;if(id==="asteria")go("realm",id);else go("city",id)});
panel.querySelectorAll("[data-back]").forEach(b=>b.onclick=()=>go("realm",b.dataset.back));
panel.querySelectorAll("[data-place]").forEach(b=>b.onclick=()=>{const p=place(b.dataset.place);if(p?.entry)go("city",p.id);else{state.selected=p.id;renderDossier()}});
}
const stat=(k,v)=>'<div class="dossier-stat"><span>'+esc(k)+'</span><strong>'+esc(v)+'</strong></div>';
function renderHeader(){let title,sub,code;if(state.mode==="world"){title='The World of <em>Elarion</em>';sub="Lima kerajaan. Ribuan kisah. Satu bintang yang akan mengubah segalanya.";code="ELARION · 001"}
else if(state.mode==="realm"){title='Kerajaan <em>'+esc(realm(state.realm).name)+'</em>';sub=state.realm==="asteria"?"Jelajahi kota, jalur perdagangan, dan tempat kelahiran sebuah legenda.":"Arsip kerajaan di luar Asteria masih menunggu penjelajahan.";code="REGIONAL · "+state.realm.toUpperCase()}
else{const p=place(state.place);title='Peta <em>'+esc(p?.name||"Lokasi")+'</em>';sub=p?.description||"";code="CITY RECORD · "+(p?.id||"").toUpperCase()}
$("mapTitle").innerHTML=title;$("mapSubtitle").textContent=sub;$("mapCode").textContent=code;
let crumb='<button data-crumb="world">ELARION</button>';
if(state.mode!=="world"){crumb+=' <span>›</span> <button data-crumb="realm">'+esc(realm(state.realm)?.name||"Asteria")+'</button>'}
if(state.mode==="city"){crumb+=' <span>›</span> <span>'+esc(place(state.place)?.name||"Kota")+'</span>'}
$("breadcrumbs").innerHTML=crumb;$("breadcrumbs").querySelectorAll("button").forEach(b=>b.onclick=()=>go(b.dataset.crumb,b.dataset.crumb==="realm"?state.realm:null));
}
function renderRealmList(){$("realmList").innerHTML=D.realms.map(r=>'<button class="realm-item '+(state.mode!=="world"&&state.realm===r.id?"active":"")+'" data-realm="'+r.id+'"><span class="realm-icon">'+esc(r.flag)+'</span><span><strong>'+esc(r.name)+'</strong><small>'+esc(r.region)+'</small></span><span class="arrow">›</span></button>').join("");$("realmList").querySelectorAll("button").forEach(b=>b.onclick=()=>go("realm",b.dataset.realm))}
function renderCatalog(){const f=["all","Kerajaan","Kota","Kawasan","Ibu kota","Konsep"],labels=["Semua lokasi","Kerajaan","Kota","Kawasan","Ibu kota","Konsep"]; $("catalogFilters").innerHTML=f.map((v,i)=>'<button class="'+(state.catalog===v?"active":"")+'" data-filter="'+v+'">'+labels[i]+'</button>').join("");$("catalogFilters").querySelectorAll("button").forEach(b=>b.onclick=()=>{state.catalog=b.dataset.filter;renderCatalog()});
const items=[...D.realms.map(r=>({...r,type:"Kerajaan",entryKey:"realm"})),...D.places.filter(p=>p.status!=="concept"||state.showConcept).map(p=>({...p,entryKey:"place"}))];
const filtered=items.filter(p=>state.catalog==="all"||(state.catalog==="Konsep"?p.status==="concept":state.catalog==="Ibu kota"?p.type?.startsWith("Ibu kota"):state.catalog==="Kota"?p.type?.includes("Kota")||p.type==="Kota kecil":state.catalog==="Kawasan"?p.type?.includes("Kawasan"):p.type===state.catalog));
$("catalogGrid").innerHTML=filtered.map(p=>'<button class="catalog-card" data-id="'+esc(p.id)+'" data-kind="'+p.entryKey+'"><span class="card-icon">'+esc(p.flag||"✧")+'</span><h3>'+esc(p.name)+'</h3><p>'+esc((p.description||"").slice(0,118))+'…</p><span class="card-bottom">'+esc(statusText(p.status))+' &nbsp; ↗</span></button>').join("");
$("catalogGrid").querySelectorAll("button").forEach(b=>b.onclick=()=>{if(b.dataset.kind==="realm")go("realm",b.dataset.id);else{const p=place(b.dataset.id);if(p.entry)go("city",p.id);else{go("realm",p.realm);state.selected=p.id;renderDossier()}}});
}
function renderChronicle(){$("timeline").innerHTML=D.chronicle.map(c=>'<article class="timeline-item"><span class="eyebrow">'+esc(c.day)+'</span><h3>'+esc(c.title)+'</h3><p>'+esc(c.detail)+'</p></article>').join("")}
function topView(v){state.view=v;document.querySelectorAll(".nav-link").forEach(n=>n.classList.toggle("is-active",n.dataset.top===v));$("atlasView").hidden=v==="catalog"||v==="chronicle";$("catalogView").hidden=v!=="catalog";$("chronicleView").hidden=v!=="chronicle";$("mapTitle").parentElement.parentElement.hidden=v==="catalog"||v==="chronicle";if(v==="world"){state.mode="world";state.place=null;state.selected=null}if(v==="asteria"){state.mode="realm";state.realm="asteria";state.place=null;state.selected=null}if(v==="catalog")renderCatalog();if(v==="chronicle")renderChronicle();if(activeMap()&&v!=="catalog"&&v!=="chronicle"){renderHeader();renderMap();renderDossier();renderRealmList()}closeMobile();window.scrollTo({top:0,behavior:"instant"})}
function render(){state.view="map";$("atlasView").hidden=false;$("catalogView").hidden=true;$("chronicleView").hidden=true;$("mapTitle").parentElement.parentElement.hidden=false;document.querySelectorAll(".nav-link").forEach(n=>n.classList.toggle("is-active",n.dataset.top===(state.mode==="world"?"world":"asteria")));renderHeader();renderRealmList();renderMap();renderDossier()}
function search(){let q=$("searchInput").value.trim().toLowerCase(),box=$("searchResults");if(!q){box.hidden=true;return}let rows=[...D.realms.map(r=>({...r,kind:"realm"})),...D.places.filter(p=>p.status!=="concept"||state.showConcept).map(p=>({...p,kind:"place"})),...D.avelorn.map(p=>({...p,kind:"avelorn"})),...D.trade.map(p=>({...p,kind:"trade"}))].filter(p=>(p.name+" "+p.description+" "+(p.type||"")).toLowerCase().includes(q)).slice(0,13);
box.hidden=false;box.innerHTML=rows.length?rows.map(p=>'<button data-kind="'+p.kind+'" data-id="'+esc(p.id)+'"><strong>'+esc(p.name)+'</strong><small>'+esc(p.type||p.region||"Kerajaan")+'</small></button>').join(""):'<div style="padding:14px;color:#a9b7ae">Tidak ditemukan dalam indeks arsip.</div>';
box.querySelectorAll("button").forEach(b=>b.onclick=()=>{const kind=b.dataset.kind,id=b.dataset.id;box.hidden=true;$("searchInput").value="";if(kind==="realm")go("realm",id);else if(kind==="place"){const p=place(id);if(p.entry)go("city",id);else{go("realm",p.realm);state.selected=id;renderDossier()}}else{go("city",kind==="avelorn"?"avelorn":"eastern-trade");selectLocal((kind==="avelorn"?D.avelorn:D.trade).find(p=>p.id===id))}})}
function closeMobile(){$("sidebar").classList.remove("open");$("mobileShade").classList.remove("open")}
function updateZoom(){state.scale=Math.max(1,Math.min(3.2,state.scale));const range=1200*(state.scale-1);const rangeY=760*(state.scale-1);state.tx=Math.max(-range,Math.min(0,state.tx));state.ty=Math.max(-rangeY,Math.min(0,state.ty));const g=$("carto");if(g)g.setAttribute("transform","translate("+state.tx+" "+state.ty+") scale("+state.scale+")");$("zoomVal").textContent=Math.round(state.scale*100)+"%";if(window.AtlasPhoto)window.AtlasPhoto.transform(state)}
function zoomTo(next){const old=state.scale;state.scale=next;state.tx=600-(600-state.tx)*state.scale/old;state.ty=380-(380-state.ty)*state.scale/old;updateZoom()}
$("zoomIn").onclick=()=>zoomTo(state.scale*1.3);$("zoomOut").onclick=()=>zoomTo(state.scale/1.3);$("zoomReset").onclick=()=>{state.scale=1;state.tx=state.ty=0;updateZoom()};
$("mapStage").addEventListener("wheel",e=>{e.preventDefault();zoomTo(state.scale*(e.deltaY<0?1.15:.87))},{passive:false});
let dragging=false,lastX=0,lastY=0;const stage=$("mapStage");stage.addEventListener("pointerdown",e=>{if(e.target.closest(".map-controls"))return;dragging=true;lastX=e.clientX;lastY=e.clientY;});stage.addEventListener("pointermove",e=>{if(!dragging||state.scale===1)return;const box=stage.getBoundingClientRect();state.tx+=(e.clientX-lastX)*1200/box.width;state.ty+=(e.clientY-lastY)*760/box.height;lastX=e.clientX;lastY=e.clientY;updateZoom()});stage.addEventListener("pointerup",()=>dragging=false);stage.addEventListener("pointerleave",()=>dragging=false);stage.addEventListener("pointercancel",()=>dragging=false);
$("buildingToggle").onchange=e=>{state.showBuildings=e.target.checked;if(activeMap())renderMap()};$("terrainToggle").onchange=e=>{state.showTerrain=e.target.checked;if(activeMap())renderMap()};$("roadToggle").onchange=e=>{state.showRoads=e.target.checked;if(activeMap())renderMap()};$("conceptToggle").onchange=e=>{state.showConcept=e.target.checked;if(activeMap())renderMap();renderCatalog()};
$("menuBtn").onclick=()=>{$("sidebar").classList.toggle("open");$("mobileShade").classList.toggle("open")};$("mobileShade").onclick=closeMobile;
document.querySelectorAll(".nav-link").forEach(b=>b.onclick=()=>topView(b.dataset.top));$("searchInput").oninput=search;$("searchShortcut").onclick=()=>{$("sidebar").classList.add("open");$("mobileShade").classList.add("open");$("searchInput").focus()};
window.addEventListener("keydown",e=>{if(e.key==="Escape"){closeMobile();$("infoModal").hidden=true;hideTip()}if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();$("sidebar").classList.add("open");$("mobileShade").classList.add("open");$("searchInput").focus()}});
$("canonInfo").onclick=()=>{ $("infoModal").hidden=false;$("modalContent").innerHTML='<p><strong>Canon terkunci.</strong> Nama negara, kota, hubungan geografis, dan tempat yang telah dimainkan mengikuti berkas <b>TSE-ATLAS-ELARION-001</b> serta perkembangan episode berikutnya.</p><p><strong>Konsep belum canon.</strong> Beberapa kota tambahan disediakan sebagai usulan, bukan perubahan lore resmi. Aktifkan pada panel lapisan peta jika ingin melihat rancangannya.</p><p><strong>Ilustrasi.</strong> Garis batas, posisi penanda, jalan kota, dan skala visual tidak menggantikan canon tertulis. Nama ibu kota Asteria masih belum ditetapkan, walaupun Ryujin telah berkunjung pada Day 420–423.</p><p><strong>Perkembangan kisah.</strong> Kota asal petualang lain belum diasumsikan sampai informasinya ditetapkan. Atlas dapat diperluas melalui berkas data.js.</p>'};
document.querySelectorAll("[data-close]").forEach(x=>x.onclick=()=>$("infoModal").hidden=true);
const hash=decodeURIComponent(location.hash.slice(1));if(hash==="world"||!hash)go("world");else if(D.realms.some(r=>r.id===hash))go("realm",hash);else if(D.places.some(p=>p.id===hash))go("city",hash);else go("world");
})();