// Signature moves are custom tower-defense adaptations, unlocked at the final form.
const finals={
 3:['Solar Beam','grass','beam',1.5,'#87e841'],
 6:['Flamethrower','fire','cone',1.3,'#ff702d'],
 9:['Hydro Pump','water','beam',1.45,'#48c8ff'],
 12:['Silver Wind','bug','vortex',1.2,'#bfe8ae'],
 15:['Pin Missile','bug','volley',1.2,'#e0df51'],
 18:['Hurricane','flying','vortex',1.3,'#d9f4ff'],
 20:['Hyper Fang','normal','slash',1.65,'#fff4bf'],
 26:['Thunderbolt','electric','chain',1.3,'#ffe73b'],
 28:['Earthquake','ground','quake',1.3,'#ce9b4b'],
 38:['Fire Blast','fire','blast',1.4,'#ff8235'],
 42:['Poison Fang','poison','slash',1.55,'#dc7bf0'],
 45:['Petal Blizzard','grass','vortex',1.25,'#ff95c9'],
 65:['Psychic','psychic','beam',1.45,'#fb80d5'],
 76:['Rock Slide','rock','quake',1.4,'#bda474'],
 94:['Shadow Ball','ghost','blast',1.45,'#ad68ee'],
 134:['Muddy Water','water','cone',1.3,'#60b6dc'],
 149:['Dragon Pulse','dragon','beam',1.6,'#a181ff']
};
const basics={grass:['Seed Shot','#74b93f'],fire:['Ember','#ff8b35'],water:['Water Pulse','#4bb5fc'],bug:['String Shot','#bfdc66'],normal:['Swift','#e7c778'],electric:['Spark','#ffe34c'],ground:['Mud Shot','#bc8c53'],psychic:['Confusion','#ef83d5'],rock:['Rock Throw','#b6a077'],ghost:['Shadow Spark','#a37ee7'],poison:['Poison Sting','#ca72dc'],dragon:['Dragon Breath','#a28aff']};
export function attackFor(p){const f=!p.next&&finals[p.id];if(f)return {name:f[0],type:f[1],shape:f[2],power:f[3],color:f[4],signature:true};const b=basics[p.types[0]]||['Quick Shot','#ffffff'];return {name:b[0],type:p.types[0],shape:'orb',power:1,color:b[1],signature:false}}
export function nextSpeed(speed){return speed===1?2:speed===2?5:1}
export function attackTargets(move,origin,target,enemies){
 const alive=enemies.filter(e=>e.hp>0),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 if(move.shape==='chain'){const hits=[target];while(hits.length<3){const prev=hits[hits.length-1];const next=alive.filter(e=>!hits.includes(e)&&dist(e,prev)<=140).sort((a,b)=>dist(a,prev)-dist(b,prev))[0];if(!next)break;hits.push(next)}return hits.map((enemy,i)=>({enemy,scale:Math.pow(.8,i)}))}
 if(move.shape==='volley'){return [target,...alive.filter(e=>e!==target&&dist(e,target)<120).sort((a,b)=>dist(a,target)-dist(b,target)).slice(0,2)].map((enemy,i)=>({enemy,scale:i?.65:1}))}
 if(move.shape==='blast'||move.shape==='vortex'||move.shape==='quake'){const radius=move.shape==='blast'?75:move.shape==='quake'?115:95;return alive.filter(e=>dist(e,target)<=radius).map(enemy=>({enemy,scale:enemy===target?1:.65}))}
 if(move.shape==='beam'||move.shape==='cone'){
  const length=dist(origin,target),ux=(target.x-origin.x)/(length||1),uy=(target.y-origin.y)/(length||1);
  return alive.filter(e=>{const dx=e.x-origin.x,dy=e.y-origin.y,along=dx*ux+dy*uy,side=Math.abs(dx*uy-dy*ux);return e===target||(along>=0&&along<=length+45&&side<=(move.shape==='cone'?12+along*.22:23))}).map(enemy=>({enemy,scale:enemy===target?1:.7}));
 }
 return [{enemy:target,scale:1}];
}
export function drawAttack(ctx,f){
 const progress=1-f.life/f.duration,alpha=Math.min(1,f.life*5),x=f.target.x,y=f.target.y,ox=f.origin.x,oy=f.origin.y,angle=Math.atan2(y-oy,x-ox),length=Math.hypot(x-ox,y-oy);
 ctx.save();ctx.globalAlpha=alpha;ctx.lineCap='square';ctx.lineJoin='miter';ctx.strokeStyle=f.move.color;ctx.fillStyle=f.move.color;
 const line=(points,width,color)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke()};
 if(f.move.shape==='beam'){line([[ox,oy],[x,y]],20,f.move.color+'70');line([[ox,oy],[x,y]],9,f.move.color);line([[ox,oy],[x,y]],3,'#fffde3');for(let i=0;i<7;i++){const t=(i/7+progress*.8)%1,px=ox+(x-ox)*t,py=oy+(y-oy)*t;ctx.strokeStyle='#fffde3';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(px,py,5,16,angle,0,Math.PI*2);ctx.stroke()}}
 else if(f.move.shape==='cone'){ctx.translate(ox,oy);ctx.rotate(angle);for(let i=0;i<15;i++){const t=(i/15+progress*.6)%1,spread=t*length*.22;ctx.fillStyle=i%3===0?'#fff4a0':i%2?f.move.color:'#ed442d';if(f.move.type==='water')ctx.fillStyle=i%2?'#c9f5ff':f.move.color;ctx.beginPath();ctx.moveTo(t*length-18,-spread);ctx.lineTo(t*length+28,Math.sin(i*7)*spread);ctx.lineTo(t*length-12,spread);ctx.closePath();ctx.fill()}}
 else if(f.move.shape==='chain'){let from=f.origin;for(let k=0;k<f.points.length;k++){const to=f.points[k],points=[[from.x,from.y]];for(let i=1;i<7;i++){const t=i/7;points.push([from.x+(to.x-from.x)*t+Math.sin(i*13+k+progress*14)*14,from.y+(to.y-from.y)*t+Math.cos(i*9+k+progress*14)*14])}points.push([to.x,to.y]);line(points,9,'#e7b22b70');line(points,4,f.move.color);line(points,1,'#fff');from=to}}
 else if(f.move.shape==='slash'){ctx.translate(x,y);ctx.rotate(-.65);for(let i=-1;i<=1;i++)line([[-33,i*14-18],[0,i*14+8],[32,i*14+19]],6,f.move.color);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(-30,-35,60,70);}
 else if(f.move.shape==='volley'){for(const end of f.points){const t=Math.min(1,progress*2),px=ox+(end.x-ox)*t,py=oy+(end.y-oy)*t;for(let i=-1;i<=1;i++)line([[px-14,py+i*10+5],[px+8,py+i*10]],3,f.move.color)}}
 else if(f.move.shape==='quake'){for(let i=0;i<3;i++){ctx.strokeStyle=i%2?f.move.color:'#f8de9b';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(x,y,25+progress*90+i*15,12+progress*45+i*8,0,0,Math.PI*2);ctx.stroke()}for(let i=0;i<9;i++){const a=i*2.4;const rx=x+Math.cos(a)*72,ry=y+Math.sin(a)*45-(1-progress)*45;ctx.fillStyle=i%2?'#806448':f.move.color;ctx.fillRect(rx,ry,9+i%3*4,10+i%2*5)}}
 else if(f.move.shape==='vortex'){for(let i=0;i<13;i++){const a=i*.9+progress*6,r=20+i*5;ctx.strokeStyle=i%2?'#f8ffef':f.move.color;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(x+Math.cos(a)*r,y+Math.sin(a)*r*.55-(1-progress)*20,16+i*2,5,0,a,a+2.5);ctx.stroke()}if(f.move.type==='grass')for(let i=0;i<10;i++){const a=i+progress*7;ctx.fillStyle=f.move.color;ctx.fillRect(x+Math.cos(a)*65,y+Math.sin(a)*40,8,5)}}
 else if(f.move.shape==='blast'){const r=20+Math.sin(progress*Math.PI)*55;ctx.fillStyle=f.move.color+'55';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();for(let i=0;i<8;i++){const a=i*Math.PI/4;line([[x+Math.cos(a)*15,y+Math.sin(a)*15],[x+Math.cos(a)*r,y+Math.sin(a)*r]],8,f.move.color)}if(f.move.type==='fire'){// The five-pronged Fire Blast silhouette.
 for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5;line([[x,y],[x+Math.cos(a)*r,y+Math.sin(a)*r]],12,'#ffb638');line([[x,y],[x+Math.cos(a)*r*.8,y+Math.sin(a)*r*.8]],4,'#fff4a0')}}else{ctx.fillStyle='#44265f';ctx.beginPath();ctx.arc(x,y,r*.45,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#e8c8ff';ctx.lineWidth=3;ctx.stroke()}}
 ctx.restore();
}
