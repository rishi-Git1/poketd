// Original pixel scenery and palettes for each Story-based battlefield.
export const MAPS={
 alola:{name:'Ultra Wormhole',ground:'#211940',clearing:'#4e367b',path:'#a178bd',line:'#9a7aba',detail:'#fff1b5',stone:'#57407d',stoneLight:'#d4bff2',foliage:['#312349','#5c3d85','#a878bd','#ecd5ff'],tower:['#62517a','#c1a985','#f5e2a0'],flag:'#f7bc54',motif:'wormhole'},
 kanto:{name:'Indigo Plateau',ground:'#727ca5',clearing:'#8f99bf',path:'#e0d4aa',line:'#505d89',detail:'#b8c4de',stone:'#596786',stoneLight:'#a9b5d1',foliage:['#253f60','#365b79','#568a92','#8bb9b7'],tower:['#777a9b','#c2c1d5','#e4e0e9'],flag:'#e7ba52',motif:'plateau'},
 johto:{name:'Mt. Silver',ground:'#a5b7c7',clearing:'#d5e1e5',path:'#8c9eae',line:'#667c93',detail:'#f5fbfb',stone:'#607488',stoneLight:'#c8d7df',foliage:['#344c5b','#4d6873','#7f9ca4','#e0edf0'],tower:['#60788e','#a6bccb','#dfedf2'],flag:'#7199d1',motif:'snow'},
 hoenn:{name:'Sky Pillar',ground:'#478e96',clearing:'#94b6a5',path:'#d4d1a8',line:'#427f78',detail:'#b8d9bb',stone:'#5b8b86',stoneLight:'#cedbc1',foliage:['#285f65','#397c76','#70a68b','#b0cf9a'],tower:['#527f79','#a0bd9e','#d7dfb6'],flag:'#d8c369',motif:'sky'},
 sinnoh:{name:'Spear Pillar',ground:'#74748f',clearing:'#a3a1b8',path:'#d4d0dc',line:'#66617e',detail:'#e7cafa',stone:'#69667f',stoneLight:'#c5c2d5',foliage:['#423e60','#665d84','#8c80a3','#b8aed0'],tower:['#746e8f','#bdb6d0','#e6e1ed'],flag:'#db91bd',motif:'ruins'},
 unova:{name:'Dragonspiral Tower',ground:'#647d60',clearing:'#98a17b',path:'#bda777',line:'#596d4b',detail:'#c2ce8f',stone:'#75694e',stoneLight:'#c2b891',foliage:['#304b41','#46664c','#6d8d58','#a3b872'],tower:['#77654d','#b9a577','#e0d0a1'],flag:'#899ead',motif:'spiral'},
 kalos:{name:'Lumiose City',ground:'#a6a5ac',clearing:'#d5cab4',path:'#f0dfb7',line:'#777b89',detail:'#fff0c6',stone:'#6d7583',stoneLight:'#bfc6cd',foliage:['#344c53','#45695f','#70937a','#9eba8e'],tower:['#726f82','#b0adb8','#e5d8c2'],flag:'#e9b44c',motif:'city'},
 galar:{name:'Wild Area',ground:'#70a477',clearing:'#95bf83',path:'#c9b884',line:'#4c785c',detail:'#d6ddad',stone:'#677e78',stoneLight:'#a7b4a2',foliage:['#294e48','#3d6e55','#65956b','#a0bf81'],tower:['#627e75','#a8baa0','#d7dfbb'],flag:'#c95c76',motif:'wild'},
 paldea:{name:'Area Zero',ground:'#4c9c9a',clearing:'#97c6b5',path:'#c8e1d1',line:'#427e8f',detail:'#cffbf0',stone:'#626a9d',stoneLight:'#b7c8e7',foliage:['#285e69','#397f81','#67aea0','#b3e1c3'],tower:['#63749e','#accfd4','#e1f6e4'],flag:'#c88cd9',motif:'crystal'}
};
export const mapFor=region=>MAPS[region]||MAPS.kanto;
const oval=(ctx,x,y,rx,ry,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()};
let seed=21;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const tufts=Array.from({length:160},()=>({x:rand()*1000,y:rand()*690,s:rand()*3+2}));
const stones=Array.from({length:22},()=>({x:rand()*1000,y:rand()*690,r:rand()*5+3}));
const edgeSpots=[[25,70,1.6],[95,33,1.2],[950,80,1.8],[1010,150,1.7],[30,580,1.5],[0,650,1.7],[910,650,1.6],[987,590,1.7],[130,695,1.3],[800,-5,1.1]];
function tree(ctx,x,y,s,t){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(s,s);ctx.fillStyle=t.foliage[0];ctx.fillRect(-26,19,54,15);ctx.fillStyle=t.stone;ctx.fillRect(-7,0,14,31);ctx.fillStyle=t.foliage[0];ctx.fillRect(-30,-25,60,45);ctx.fillRect(-22,-40,44,20);ctx.fillStyle=t.foliage[1];ctx.fillRect(-26,-25,52,37);ctx.fillRect(-18,-40,36,20);ctx.fillStyle=t.foliage[2];ctx.fillRect(-18,-28,34,24);ctx.fillRect(-10,-39,20,15);ctx.fillStyle=t.foliage[3];ctx.fillRect(-13,-29,18,7);ctx.restore()}
function column(ctx,x,y,s,t,broken=false){ctx.save();ctx.translate(x,y);ctx.scale(s,s);oval(ctx,0,23,29,10,t.line+'60');ctx.fillStyle=t.stone;ctx.fillRect(-24,14,48,10);ctx.fillRect(-15,-52,30,68);ctx.fillStyle=t.stoneLight;ctx.fillRect(-12,-52,10,65);ctx.fillRect(-23,8,46,8);ctx.fillRect(-21,-61,42,12);ctx.strokeStyle=t.line;ctx.lineWidth=2;for(const dx of [-6,6]){ctx.beginPath();ctx.moveTo(dx,-47);ctx.lineTo(dx,7);ctx.stroke()}if(broken){ctx.fillStyle=t.ground;ctx.fillRect(1,-65,25,29);ctx.fillStyle=t.stone;ctx.fillRect(28,20,16,10)}ctx.restore()}
// Stellar shell-inspired blue lattice, rainbow hexagonal plates and glassy facets.
const stellarColors=['#ff779e','#ffae55','#f5e66b','#70df8b','#57d9ed','#739bff','#ba88ef','#f4a8e0'];
const crystalSpots=[[65,158,1.35,0],[184,83,.85,3],[760,76,.9,2],[890,155,1.4,1],[967,310,1.1,4],[54,398,.8,2],[65,548,1.35,3],[193,625,1.1,4],[808,605,1.25,0],[938,548,1.4,2],[681,651,.75,1]];
function facet(ctx,points,color,edge){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=color;ctx.fill();if(edge){ctx.strokeStyle=edge;ctx.lineWidth=1.3;ctx.stroke()}}
function shellGem(ctx,x,y,r,index){
 const color=stellarColors[index%stellarColors.length],hex=Array.from({length:6},(_,i)=>[x+Math.cos(i*Math.PI/3-Math.PI/2)*r,y+Math.sin(i*Math.PI/3-Math.PI/2)*r]);
 facet(ctx,hex,'#a1f5ff','#294f95');facet(ctx,hex.map(([px,py])=>[x+(px-x)*.73,y+(py-y)*.73]),color);
 facet(ctx,[hex[0],hex[1],[x,y],hex[5]],'#f4ffff88');facet(ctx,[hex[2],hex[3],hex[4],[x,y]],'#3551a63c');
 ctx.strokeStyle='#31539b';ctx.lineWidth=.9;ctx.beginPath();
 if(index%3===0){ctx.moveTo(x,y-r*.35);ctx.lineTo(x+r*.24,y);ctx.lineTo(x,y+r*.35);ctx.lineTo(x-r*.24,y);ctx.closePath()}
 else if(index%3===1){ctx.moveTo(x-r*.25,y-r*.2);ctx.lineTo(x+r*.22,y+r*.2);ctx.moveTo(x+r*.22,y-r*.2);ctx.lineTo(x-r*.25,y+r*.2)}
 else{ctx.moveTo(x+r*.2,y-r*.35);ctx.lineTo(x-r*.14,y);ctx.lineTo(x+r*.14,y);ctx.lineTo(x-r*.2,y+r*.35)}ctx.stroke();
}
function stellarShard(ctx,x,y,w,h,lean,index){
 ctx.save();ctx.translate(x,y);ctx.rotate(lean);
 facet(ctx,[[-w,8],[-w,-h*.65],[0,-h],[w,-h*.67],[w,8],[0,16]],'#9eeaf7','#345a9a');
 facet(ctx,[[0,-h],[-w,-h*.65],[0,-h*.52]],'#f0ffff');facet(ctx,[[0,-h],[w,-h*.67],[0,-h*.52]],'#c5c1ff');
 facet(ctx,[[-w,-h*.65],[0,-h*.52],[0,16],[-w,8]],'#62cce9');facet(ctx,[[0,-h*.52],[w,-h*.67],[w,8],[0,16]],'#8b9fe4');
 ctx.strokeStyle='#e5ffff';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,-h*.48);ctx.lineTo(0,9);ctx.stroke();
 shellGem(ctx,0,-h*.24,Math.min(w*.8,h*.17),index);ctx.restore();
}
function crystal(ctx,x,y,s,t,variant){
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);oval(ctx,0,20,variant===4?43:37,11,t.line+'60');
 if(variant===0||variant===4){
  // Low shell-like geodes, with a crown or a wide honeycomb of gem plates.
  facet(ctx,[[-43,11],[-34,-14],[0,-29],[34,-14],[43,11],[0,29]],'#436fb9','#294f95');
  facet(ctx,[[-34,-14],[0,-29],[34,-14],[0,2]],'#b2f4f7');facet(ctx,[[-43,11],[0,2],[0,29]],'#568fd0');facet(ctx,[[0,2],[43,11],[0,29]],'#3e72b0');
  if(variant===0){stellarShard(ctx,-19,-18,9,37,-.25,4);stellarShard(ctx,4,-24,11,52,.08,6);stellarShard(ctx,24,-15,8,32,.36,0)}
  const plates=variant===0?[[-28,5],[-10,13],[10,13],[28,5]]:[[-27,-3],[-9,-13],[10,-13],[28,-3],[-18,15],[2,10],[20,15]];
  plates.forEach(([gx,gy],i)=>shellGem(ctx,gx,gy,variant===0?10:11,i+variant));
 }else if(variant===1){
  stellarShard(ctx,-18,7,10,43,-.4,1);stellarShard(ctx,9,1,17,84,.13,3);stellarShard(ctx,29,13,8,37,.52,7);shellGem(ctx,-4,15,12,0);
 }else if(variant===2){
  // A fan of differently angled rainbow-faced blades.
  for(const [dx,dy,w,h,lean,i] of [[-23,10,8,39,-.65,0],[18,11,9,47,.6,6],[-12,4,10,58,-.3,2],[5,0,12,68,.16,4]])stellarShard(ctx,dx,dy,w,h,lean,i);
 }else{
  // A squat rosette exposes more of the multicolored shell mosaic.
  facet(ctx,[[-33,8],[-24,-18],[0,-31],[28,-15],[39,12],[0,30]],'#68a3d4','#345a9a');
  for(let i=0;i<6;i++){const a=i*Math.PI/3;shellGem(ctx,Math.cos(a)*22,Math.sin(a)*18-2,12,i+1)}shellGem(ctx,0,-2,13,0);stellarShard(ctx,6,-24,7,24,-.12,4);
 }
 // Fixed highlights keep the landscape steady between frames.
 ctx.fillStyle='#ecffff';ctx.fillRect(-35,-20,3,3);ctx.fillRect(34,-5,2,2);ctx.restore();
}
function lamp(ctx,x,y,s,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);oval(ctx,0,16,18,6,t.line+'80');ctx.fillStyle=t.line;ctx.fillRect(-3,-58,6,73);ctx.fillRect(-12,12,24,5);ctx.fillRect(-11,-65,22,26);ctx.fillStyle='#ffe4a0';ctx.fillRect(-7,-61,14,18);ctx.fillStyle=t.line;ctx.fillRect(-3,-69,6,31);ctx.fillRect(-14,-68,28,5);ctx.restore()}
export function drawMap(ctx,region,range=335){
 const t=mapFor(region);if(t.motif==='wormhole'){drawWormhole(ctx,range,t);return}ctx.save();ctx.fillStyle=t.ground;ctx.fillRect(0,0,1000,690);oval(ctx,500,350,372,244,t.clearing);
 if(['sky','ruins','city'].includes(t.motif)){ctx.strokeStyle=t.line+'45';ctx.lineWidth=1;for(let x=0;x<1000;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,690);ctx.stroke()}for(let y=0;y<690;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1000,y);ctx.stroke()}}
 ctx.strokeStyle=t.path;ctx.lineWidth=t.motif==='city'?53:35;ctx.beginPath();ctx.moveTo(0,390);ctx.bezierCurveTo(180,405,350,328,500,345);ctx.bezierCurveTo(680,350,810,500,1000,500);ctx.stroke();ctx.lineWidth=t.motif==='city'?44:26;ctx.beginPath();ctx.moveTo(515,0);ctx.bezierCurveTo(550,160,470,240,500,345);ctx.bezierCurveTo(520,470,430,580,385,690);ctx.stroke();
 if(t.motif==='spiral'){ctx.strokeStyle=t.stone;ctx.lineWidth=9;ctx.beginPath();for(let i=0;i<=160;i++){const a=i*.08,r=110+i*.8;const x=500+Math.cos(a)*r,y=345+Math.sin(a)*r*.68;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}
 if(t.motif==='city'||t.motif==='plateau'){ctx.strokeStyle=t.stoneLight;ctx.lineWidth=10;ctx.beginPath();ctx.ellipse(500,345,205,141,0,0,Math.PI*2);ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle=t.line;ctx.stroke()}
 if(t.motif==='sky'||t.motif==='ruins'){ctx.strokeStyle=t.detail;ctx.lineWidth=3;for(const r of [198,210]){ctx.beginPath();ctx.ellipse(500,345,r,r*.68,0,0,Math.PI*2);ctx.stroke()}for(let i=0;i<8;i++){const a=i*Math.PI/4,x=500+Math.cos(a)*200,y=345+Math.sin(a)*136;ctx.strokeRect(x-7,y-7,14,14)}}
 for(const q of tufts){if(Math.hypot(q.x-500,(q.y-345)*1.2)<112)continue;ctx.strokeStyle=t.detail+(t.motif==='snow'?'c0':'70');ctx.lineWidth=t.motif==='snow'?3:1.3;ctx.beginPath();ctx.moveTo(q.x-3,q.y);ctx.lineTo(q.x-4,q.y-q.s);ctx.moveTo(q.x,q.y+1);ctx.lineTo(q.x+1,q.y-q.s-2);ctx.stroke()}
 for(const q of stones){if(Math.hypot(q.x-500,q.y-345)<160)continue;oval(ctx,q.x,q.y,q.r,q.r*.5,t.stone);oval(ctx,q.x-1,q.y-2,q.r*.8,q.r*.4,t.stoneLight)}
 if(t.motif==='snow'){for(const [x,y] of [[100,180],[810,195],[140,540],[825,560]]){oval(ctx,x,y,75,22,'#e9f3f4');oval(ctx,x+21,y-6,39,13,'#f8fdfb')}}
 if(t.motif==='wild'){oval(ctx,850,165,88,43,'#4e8f9d');oval(ctx,850,161,72,32,'#77b7bd');ctx.strokeStyle='#bfd7c2';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(850,161,55,21,0,.2,2.8);ctx.stroke()}
 if(t.motif==='crystal')for(const [x,y,s,variant] of crystalSpots)crystal(ctx,x,y,s,t,variant);
 else for(const [x,y,s] of edgeSpots){if(t.motif==='sky'||t.motif==='ruins')column(ctx,x,y,s,t,t.motif==='ruins');else if(t.motif==='city'){lamp(ctx,x,y,s,t);ctx.fillStyle=t.stone;ctx.fillRect(x+25,y+9,33,18);ctx.fillStyle=t.foliage[2];ctx.fillRect(x+21,y-4,41,18)}else tree(ctx,x,y,s,t)}
 if(t.motif==='spiral'){column(ctx,175,178,1,t,true);column(ctx,850,560,1.2,t,true)}
 for(const [x,y] of [[170,240],[815,185],[730,580],[230,540],[150,640],[850,450]]){ctx.fillStyle=t.detail;ctx.fillRect(x,y,4,4);ctx.fillRect(x+8,y-5,3,3);ctx.fillStyle=t.path;ctx.fillRect(x+1,y+1,2,2)}
 ctx.strokeStyle=t.line+'70';ctx.lineWidth=1;ctx.setLineDash([5,8]);for(const r of [140,Math.min(range,480)]){ctx.beginPath();ctx.ellipse(500,345,r,r*.76,0,0,Math.PI*2);ctx.stroke()}ctx.setLineDash([]);ctx.restore();
}
export function drawBastion(ctx,region){
 const t=mapFor(region),[dark,mid,light]=t.tower;ctx.save();oval(ctx,500,363,82,36,t.line+'40');oval(ctx,500,348,81,34,mid);oval(ctx,500,343,73,30,light);ctx.fillStyle=dark;ctx.fillRect(472,286,56,62);ctx.fillStyle=mid;ctx.fillRect(478,286,43,59);ctx.fillStyle=dark;ctx.fillRect(500,286,21,59);ctx.fillStyle=light;ctx.fillRect(467,278,66,13);ctx.fillStyle=dark;ctx.fillRect(470,289,60,7);ctx.fillStyle=mid;for(let i=0;i<4;i++)ctx.fillRect(467+i*17,266,12,15);ctx.fillStyle=t.line;ctx.fillRect(493,304,13,19);ctx.fillStyle=light;ctx.fillRect(497,304,3,19);ctx.strokeStyle=dark;ctx.lineWidth=1;for(let y=315;y<346;y+=12){ctx.beginPath();ctx.moveTo(478,y);ctx.lineTo(521,y);ctx.stroke()}ctx.fillStyle=dark;ctx.fillRect(500,235,3,32);ctx.fillStyle=t.flag;ctx.beginPath();ctx.moveTo(503,235);ctx.lineTo(526,242);ctx.lineTo(503,250);ctx.fill();oval(ctx,500,351,18,7,dark);oval(ctx,500,348,18,7,light);ctx.restore();
}

function drawWormhole(ctx,range,t){
 ctx.save();ctx.fillStyle=t.ground;ctx.fillRect(0,0,1000,690);
 for(let i=8;i>=0;i--)oval(ctx,500,345,130+i*47,90+i*31,['#62478f','#3c2c64','#523977','#33254f'][i%4]);
 for(let arm=0;arm<6;arm++){ctx.beginPath();for(let j=0;j<=55;j++){const a=arm*Math.PI/3+j*.038,r=120+j*8,x=500+Math.cos(a)*r,y=345+Math.sin(a)*r*.68;j?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle=['#b2b6ee','#d192ca','#8263b3'][arm%3];ctx.lineWidth=arm%2?7:3;ctx.stroke()}
 for(const [i,q] of tufts.entries()){if(Math.hypot(q.x-500,(q.y-345)*1.4)<120)continue;ctx.fillStyle=i%3?'#ead9ff':'#ffe5a1';ctx.fillRect(q.x,q.y,i%5?2:4,2);if(i%5===0)ctx.fillRect(q.x+1,q.y-3,2,8)}
 oval(ctx,500,345,154,106,'#33214e');ctx.strokeStyle='#d2a6e3';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(500,345,160,110,0,0,Math.PI*2);ctx.stroke();
 ctx.strokeStyle=t.line+'80';ctx.setLineDash([5,8]);ctx.lineWidth=1;for(const r of [140,Math.min(range,480)]){ctx.beginPath();ctx.ellipse(500,345,r,r*.76,0,0,Math.PI*2);ctx.stroke()}ctx.setLineDash([]);ctx.restore();
}
