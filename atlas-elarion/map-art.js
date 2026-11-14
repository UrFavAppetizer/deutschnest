/* Elarion Illustrated Cartography v2: decorative only, never authoritative footprints. */
(function(){
"use strict";
var ns="http://www.w3.org/2000/svg";
function add(p,t,a,v){var n=document.createElementNS(ns,t);Object.keys(a||{}).forEach(function(k){n.setAttribute(k,a[k])});if(v!==undefined)n.textContent=v;p.appendChild(n);return n}
function group(p,x,y,s){return add(p,"g",{transform:"translate("+x+" "+y+") scale("+(s||1)+")","pointer-events":"none"})}
function ink(p,d,fill,stroke,w){add(p,"path",{d:d,fill:fill||"none",stroke:stroke||"#41534a","stroke-width":w||1,"stroke-linejoin":"round","stroke-linecap":"round"})}
function stroke(p,d,color,w){ink(p,d,"none",color,w)}
function seed(z){return function(){z=(z*1664525+1013904223)>>>0;return z/4294967296}}
var roof=["#ae7356","#9a5b4b","#717f78","#71897b","#b08a62","#786358","#6f8285"];
function house(g,x,y,w,h,c,s){var a=group(g,x,y,s||1),v=w/2,ht=h/2;
ink(a,"M"+(-v)+" 0L0 "+(ht*.45)+"L0 "+h+"L"+(-v)+" "+(h*.5)+"Z","#b4ac8e","#404f43",1);
ink(a,"M0 "+(ht*.45)+"L"+v+" 0L"+v+" "+(h*.5)+"L0 "+h+"Z","#d2bc98","#404f43",1);
ink(a,"M"+(-v-3)+" 0L0 "+(-ht-7)+"L"+(v+3)+" 0L0 "+(ht*.45+1)+"Z",c||roof[0],"#4d4b40",1.6);
stroke(a,"M"+(-v)+" 0L0 "+(ht*.45)+"L"+v+" 0","#f4d3a5",.8);
add(a,"rect",{x:-v*.65,y:5,width:4,height:6,fill:"#43564d"});
add(a,"rect",{x:v*.42,y:5,width:4,height:6,fill:"#546454"});
return a}
function pine(g,x,y,s){var a=group(g,x,y,s||1);
add(a,"ellipse",{cx:0,cy:12,rx:14,ry:5,fill:"#1b3026",opacity:.4});
add(a,"rect",{x:-2,y:0,width:4,height:18,fill:"#68563f"});
ink(a,"M0 -43L-13 -21L-8 -21L-20 3L20 3L8 -21L13 -21Z","#476c53","#24473c",1);
stroke(a,"M0 -40L-8 -20M0 -25L-12 0","#a0af8b",1)}
function stone(g,x,y,s){var a=group(g,x,y,s||1);ink(a,"M-22 10L0 -19L23 9L7 17L-22 17Z","#b7b19b","#616d60",1);stroke(a,"M0 -19L2 11","#e4d4b2",1)}
function mountain(g,x,y,s){var a=group(g,x,y,s);for(var i=0;i<4;i++){var q=i*25;ink(a,"M"+(q-22)+" 29L"+q+" -28L"+(q+24)+" 29Z","#5e7569","#2d463f",2);ink(a,"M"+(q-9)+" -7L"+q+" -28L"+(q+10)+" -5L"+(q+1)+" -11Z","#ddd2b4","#8b8d76",.8);stroke(a,"M"+(q+8)+" -8L"+(q+24)+" 29","#354b41",1)}}
function tower(g,x,y,s,c){var a=group(g,x,y,s||1);
add(a,"ellipse",{cy:27,rx:25,ry:9,fill:"#1c3029",opacity:.4});
ink(a,"M-15 -34L15 -34L13 28L0 36L-14 28Z","#b5ad95","#555c54",2);
ink(a,"M-21 -35L0 -74L21 -35L0 -25Z",c||"#82655c","#433f43",2);
add(a,"rect",{x:-4,y:-23,width:8,height:13,rx:3,fill:"#55625c",stroke:"#e5d7ad","stroke-width":1});
add(a,"rect",{x:-4,y:2,width:8,height:12,rx:3,fill:"#55625c",stroke:"#e5d7ad","stroke-width":1});
stroke(a,"M0 -74L0 -88","#dac78c",2);
ink(a,"M0 -88L20 -82L0 -77Z","#c9ad77","#826c52",1)}
function fort(g,x,y,s){var a=group(g,x,y,s||1);
house(a,0,8,91,43,"#6a7e72",1);
tower(a,-34,-1,.55,"#9b7460");tower(a,39,-1,.55,"#9b7460");
ink(a,"M-9 -8L0 -27L9 -8L0 -2Z","#d5c099","#6a6758",1);
stroke(a,"M0 -26V-47","#efdcac",2);
ink(a,"M0 -47L15 -43L0 -37Z","#d5b575","#806d53",1)}
function guild(g,x,y){var a=group(g,x,y-12,1);house(a,0,6,91,45,"#617e76",1);
tower(a,-41,3,.46,"#935c56");tower(a,41,2,.46,"#935c56");
ink(a,"M-11 -10L0 -41L11 -10L0 0Z","#a7725b","#4f4e45",1);
add(a,"circle",{cx:0,cy:24,r:9,fill:"#49655e",stroke:"#e4cc96","stroke-width":2});
add(a,"text",{x:0,y:28,fill:"#efd79f","font-size":12,"text-anchor":"middle"},"✦");
}
function forge(g,x,y){var a=group(g,x,y-15,1);house(a,0,12,65,32,"#8a5948",1);
add(a,"rect",{x:20,y:-47,width:14,height:40,fill:"#877c67",stroke:"#4e4c42","stroke-width":2});
add(a,"rect",{x:18,y:-49,width:18,height:5,fill:"#d2bf96"});
stroke(a,"M27 -55Q46 -66 34 -79M33 -57Q19 -72 25 -85","#c6cfc4",4);
add(a,"circle",{cx:-31,cy:18,r:13,fill:"#cb8054",opacity:.3});}
function starhaven(g,x,y){var a=group(g,x,y-10,.9);
add(a,"ellipse",{cx:1,cy:22,rx:86,ry:54,fill:"#4a7961",stroke:"#d3bb89","stroke-width":3,opacity:.9});
house(a,-5,8,100,42,"#68857f",1);
house(a,56,31,44,25,"#a4775c",1);house(a,-53,28,41,23,"#987759",1);
stroke(a,"M-60 48Q0 38 54 50","#e3c88a",3);
pine(a,-60,-9,.49);pine(a,63,-13,.51);pine(a,72,29,.36);}
function hall(g,x,y){var a=group(g,x,y-14,1);house(a,0,10,84,40,"#7d8178",1);
ink(a,"M-10 -8L0 -32L10 -8L0 -4Z","#976452","#4a4943",1);
add(a,"circle",{cy:-6,r:5,fill:"#dec99d",stroke:"#526358","stroke-width":1});
for(var i=-1;i<=1;i++)add(a,"rect",{x:i*17-5,y:17,width:9,height:15,fill:"#55655c"})}
function stalls(g,x,y){var a=group(g,x,y,1);[[-34,-17,"#b77a64"],[8,-28,"#d2ae77"],[-4,17,"#739b86"],[37,5,"#c99165"]].forEach(function(t){ink(a,"M"+(t[0]-17)+" "+t[1]+"l17 -18l18 18l-18 9Z",t[2],"#5b574b",1)})}
function garden(g,x,y){var a=group(g,x,y,1);
add(a,"ellipse",{rx:37,ry:19,fill:"#56886b",stroke:"#d0c293","stroke-width":3});
add(a,"ellipse",{rx:17,ry:11,fill:"#a6c1af",stroke:"#e4d4a6","stroke-width":2});
add(a,"circle",{r:5,fill:"#f0d9ac"});
for(var i=0;i<9;i++){var q=i*6.283/9;add(a,"circle",{cx:Math.cos(q)*29,cy:Math.sin(q)*13,r:3,fill:i%2?"#eac8a6":"#b2cb97"})}}
function training(g,x,y){var a=group(g,x,y-7,.9);
add(a,"ellipse",{rx:44,ry:27,fill:"#d1b385",stroke:"#6c634b","stroke-width":3});
add(a,"ellipse",{rx:38,ry:22,fill:"#c1a279",stroke:"#e7d5a9","stroke-width":1,"stroke-dasharray":"5 4"});
stroke(a,"M-25 -17V15M25 -17V15","#776145",4)}
function wall(g,poly){var d=poly.map(function(p,i){return(i?"L":"M")+p[0]+" "+p[1]}).join("")+"Z";
stroke(g,d,"#273a35",14);stroke(g,d,"#c4b396",9);stroke(g,d,"#6a6f5b",4);
poly.forEach(function(p,i){if(i%2===0)tower(g,p[0],p[1],.37,"#a17157")})}
function gate(g,x,y,s){var a=group(g,x,y,s||1);tower(a,-19,0,.35,"#995f4e");tower(a,19,0,.35,"#995f4e");ink(a,"M-18 4Q0 -12 18 4L18 16Q0 1 -18 16Z","#b0a98d","#4e5548",1.5)}
function writing(g,x,y,t){add(g,"text",{x:x,y:y,fill:"#e8d0a2","font-family":"Marcellus, Georgia, serif","font-size":11,"text-anchor":"middle","letter-spacing":1.1,style:"paint-order:stroke;stroke:#243a35;stroke-width:2.8px"},t)}
function boat(g,x,y,s){var a=group(g,x,y,s||1);ink(a,"M-30 6Q0 29 30 6Z","#867c63","#b5ad8a",1.5);stroke(a,"M0 8V-37","#e1d2aa",2);ink(a,"M3 -34V3H28Z","#d8ceb0","#889a91",1);ink(a,"M-3 -31V2H-22Z","#a5bbae","#738b82",1)}
function pointInside(x,y,poly){var c=false;for(var i=0,j=poly.length-1;i<poly.length;j=i++){var xi=poly[i][0],yi=poly[i][1],xj=poly[j][0],yj=poly[j][1];if((yi>y)!=(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c}
var aPoly=[[240,215],[390,112],[680,118],[898,201],[952,364],[895,601],[719,674],[441,651],[214,511],[189,336]];
var tPoly=[[178,267],[355,200],[660,185],[986,298],[1021,561],[725,659],[396,635]];
function world(root){var g=group(root,0,0,1);mountain(g,461,109,.76);mountain(g,849,226,.55);
for(var i=0;i<9;i++)pine(g,405+i*22,363+(i%3)*16,.4);
fort(g,538,405,.58);fort(g,200,312,.34);fort(g,527,139,.37);fort(g,923,328,.35);fort(g,613,650,.35);
boat(g,1059,614,.75);boat(g,98,546,.55);writing(g,548,493,"✧ The First Star ✧")}
function realm(root){var g=group(root,0,0,1),r=seed(2571);
for(var i=0;i<28;i++)pine(g,231+(i%7)*22,304+Math.floor(i/7)*22,.38);
for(var j=0;j<16;j++)pine(g,760+(j%6)*20,230+Math.floor(j/6)*23,.31);
for(var k=0;k<8;k++){var px=370+k*30;stroke(g,"M"+px+" 530l22 6","#d4c293",1)}
for(var z=0;z<5;z++)house(g,441+(z%3)*22,316+Math.floor(z/3)*16,19,17,roof[z],.6);
fort(g,495,299,.47);fort(g,591,553,.6);house(g,804,329,75,31,"#98785f",.7);
for(var q=0;q<10;q++)house(g,544+(q%4)*25,584+Math.floor(q/4)*18,18,15,roof[q%roof.length],.51);
boat(g,970,625,.5)}
function cityBase(root,which){if(which!=="avelorn"&&which!=="eastern-trade")return;var g=group(root,0,0,1),r=seed(which==="avelorn"?7743:1325),ave=which==="avelorn",poly=ave?aPoly:tPoly,anchors=ave?window.ATLAS.avelorn:window.ATLAS.trade;
for(var y=ave?172:229;y<625;y+=27){for(var x=221;x<963;x+=29){
 var xx=x+(r()-.5)*14,yy=y+(r()-.5)*13;
 if(!pointInside(xx,yy,poly)||r()<.31||anchors.some(function(p){return Math.hypot(xx-p.x,yy-p.y)<42}))continue;
 if(ave&&(Math.abs(yy-405)<12||Math.abs(xx-590)<10||Math.abs(yy-518)<10))continue;
 if(!ave&&(Math.abs(yy-395)<12||Math.abs(xx-594)<11))continue;
 house(g,xx,yy,15+r()*9,12+r()*7,roof[Math.floor(r()*roof.length)],.73);
}}
for(var q=0;q<60;q++){var px=213+r()*760,py=160+r()*478;if(pointInside(px,py,poly)&&r()>.7)pine(g,px,py,.2+r()*.17)}}
function cityDetail(root,which){if(which!=="avelorn"&&which!=="eastern-trade")return;var g=group(root,0,0,1);
if(which==="avelorn"){
 guild(g,493,259);training(g,540,272);tower(g,701,235,.9,"#6b6388");
 hall(g,455,400);forge(g,322,442);house(g,300,468,49,33,"#a9795e",.98);
 house(g,744,315,62,29,"#637c79",1);stalls(g,527,471);garden(g,651,546);
 house(g,736,443,61,31,"#7e927e",1);house(g,241,358,59,33,"#aa6e52",1);
 house(g,798,349,38,24,"#a46e54",1);house(g,832,360,41,24,"#6f7473",1);house(g,844,422,40,24,"#926c52",1);
 starhaven(g,746,618);house(g,605,138,83,29,"#687772",1);
 wall(g,aPoly);gate(g,540,116,1);gate(g,922,384,1);gate(g,600,651,1);gate(g,205,418,1);
 writing(g,543,73,"GERBANG UTARA");writing(g,1075,398,"GERBANG TIMUR");writing(g,614,728,"GERBANG SELATAN");writing(g,112,438,"GERBANG BARAT");
}else{
 house(g,510,325,99,51,"#965b4b",1);forge(g,746,375);
 house(g,388,508,87,42,"#737c78",1);house(g,809,508,85,40,"#8a7562",1);
 for(var i=0;i<7;i++)house(g,328+i*77,249+(i%2)*12,24,21,roof[i%roof.length],.86);
 boat(g,1083,615,.57)
}}
function capital(root){var g=group(root,0,0,1),r=seed(434);for(var y=217;y<583;y+=34){for(var x=200;x<999;x+=32){var xx=x+r()*15,yy=y+r()*10;if(Math.hypot(xx-618,yy-436)<114||r()<.32)continue;house(g,xx,yy,21,17,roof[Math.floor(r()*roof.length)],.8)}}
fort(g,617,286,2.05);
add(g,"ellipse",{cx:618,cy:436,rx:89,ry:53,fill:"#c4b68e",stroke:"#e3d4b0","stroke-width":4});
for(var i=0;i<12;i++){var a=i*Math.PI/6;add(g,"circle",{cx:618+Math.cos(a)*70,cy:436+Math.sin(a)*39,r:4,fill:"#67856d"})}
writing(g,624,567,"VISUALISASI ARTISTIK · TATA KOTA BELUM CANON")}
window.ELARION_ART={world:world,realm:realm,cityBase:cityBase,cityDetail:cityDetail,capital:capital};
})();