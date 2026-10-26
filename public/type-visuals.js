// Type-specific canvas art. Target selection and damage remain in attacks.js.
export const TYPE_VISUALS={stellar:'Prismatic star paths and rainbow crystal bursts',water:'Pressure jets, droplets and splash crowns',grass:'Braided vines, pointed leaves and petals',normal:'Speed streaks, starbursts and comic impacts',poison:'Lobbed sludge, bubbles and puddles',bug:'Chitin blades, insect wings and needle swarms',flying:'Curling air currents, feathers and gust spirals',ground:'Branching earth fissures and rising dust',rock:'Falling angular boulders and rubble',psychic:'Concentric mind rings and orbiting sigils',ghost:'Spiraling wisps and a haunted shadow core',dragon:'Helical dragon energy and snapping jaws',ice:'Six-armed snowflakes and rising ice crystals',fighting:'Alternating fists and sharp impact flashes',fairy:'Crescent moon, four-point glints and stardust',steel:'Rotating metal plates and hot sparks',dark:'Eclipse ring, black crescents and inward shards',fire:'Flame tongues and five-pronged fire bursts',electric:'Forked lightning jumping between targets'};
export function drawTypeAttack(ctx,f){
 const type=f.move.type;if(type==='fire'||type==='electric'||!TYPE_VISUALS[type])return false;
 const p=Math.max(0,Math.min(1,1-f.life/f.duration)),{x,y}=f.target,ox=f.origin.x,oy=f.origin.y,L=Math.hypot(x-ox,y-oy),a=Math.atan2(y-oy,x-ox),c=f.move.color;
 const line=(pts,w=3,color=c)=>{ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=w;pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke()};
 const poly=(pts,color=c)=>{ctx.beginPath();ctx.fillStyle=color;pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill()};
 const ring=(x,y,r,w=3,color=c,ry=r)=>{ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=w;ctx.ellipse(x,y,r,ry,0,0,Math.PI*2);ctx.stroke()};
 const dot=(x,y,r,color=c)=>{ctx.beginPath();ctx.fillStyle=color;ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()};
 const leaf=(x,y,angle,size,color=c)=>{ctx.save();ctx.translate(x,y);ctx.rotate(angle);poly([[-size,0],[0,-size*.5],[size,0],[0,size*.5]],color);line([[-size*.7,0],[size*.7,0]],1,'#efffc5');ctx.restore()};
 const star=(x,y,r,color=c,n=4)=>{poly(Array.from({length:n*2},(_,i)=>{const a=i*Math.PI/n-Math.PI/2,R=i%2?r*.26:r;return [x+Math.cos(a)*R,y+Math.sin(a)*R]}),color)};
 const lane=fn=>{ctx.save();ctx.translate(ox,oy);ctx.rotate(a);fn();ctx.restore()};
 ctx.save();ctx.globalAlpha=Math.min(1,f.life*7);ctx.lineCap='round';ctx.lineJoin='round';
 if(type==='stellar'){
  const colors=['#ff8585','#ffdf70','#8ceba3','#79d9ff','#bda1ff','#ffc6e9'];lane(()=>{for(let i=0;i<6;i++)line(Array.from({length:18},(_,j)=>[j*L/17,Math.sin(j*.7+p*8+i)*9+(i-2.5)*4]),2,colors[i]);});for(let i=0;i<12;i++){const a=i*Math.PI/6+p*2;star(x+Math.cos(a)*(20+p*45),y+Math.sin(a)*(20+p*45),8,colors[i%6],4)}star(x,y,29,'#ffffff',6);
 }else if(type==='water'){
  lane(()=>{for(let k=-1;k<=1;k++){const pts=Array.from({length:25},(_,i)=>{const t=i/24;return [t*L,Math.sin(t*18-p*20+k)*4+k*(f.move.shape==='cone'?4+t*L*.15:6)]});line(pts,8,'#147fc6');line(pts,3,'#c6fbff')}for(let i=0;i<14;i++){const t=(i/14+p*1.5)%1;dot(L*t,Math.sin(i*9)*18,2+i%3,'#abf3ff')}});
  ring(x,y+14,20+p*45,3,'#d5fbff',(20+p*45)*.35);for(let i=0;i<9;i++){const a=i*Math.PI/8;line([[x+Math.cos(a)*8,y],[x+Math.cos(a)*(25+p*35),y-Math.sin(a)*(20+45*p)]],3,'#7ce5ff');dot(x+Math.cos(a)*(30+p*40),y-Math.sin(a)*(25+45*p),3,'#d4fcff')}
 }else if(type==='grass'){
  const petals=/Petal/i.test(f.move.name);
  lane(()=>{if(!petals)for(let k=-1;k<=1;k++)line(Array.from({length:25},(_,i)=>[L*i/24,Math.sin(i*.5-p*9+k)*11+k*5]),k?3:6,k?'#a5df46':'#397333');for(let i=0;i<16;i++){const t=(i/16+p*.65)%1;leaf(t*L,Math.sin(i*3+p*8)*22,i+p*9,8,petals?'#ff9aca':'#80ce3d')}});
  for(let i=0;i<9;i++){const t=i*.8+p*4;leaf(x+Math.cos(t)*48,y+Math.sin(t)*32,t,11,petals?'#ffc0df':'#b9ee57')}
 }else if(type==='normal'){
  lane(()=>{for(let i=0;i<9;i++){const t=(i/9+p)%1;line([[t*L-27,(i%3-1)*15],[t*L,(i%3-1)*15]],i%2?2:4,'#fff8df')}});
  star(x,y,35+Math.sin(p*Math.PI)*35,'#aa7850',11);star(x,y,27+Math.sin(p*Math.PI)*27,'#fff7d0',11);for(let i=0;i<5;i++)star(x+Math.cos(i*1.7+p)*70,y+Math.sin(i*1.7+p)*44,6,'#ffe499',5);
 }else if(type==='poison'){
  lane(()=>{for(let i=0;i<9;i++){const t=(i/9+p)%1;dot(t*L,-Math.sin(t*Math.PI)*65,5+i%4,i%2?'#cc6fea':'#763b93')}});
  for(let i=0;i<7;i++){const t=i*2.4;dot(x+Math.cos(t)*35,y+15+Math.sin(t)*12,15,'#8c3ba980');ring(x+Math.cos(t)*38,y-10-p*35+i%3*8,4+i%4,2,'#e7a6f4')}
 }else if(type==='bug'){
  if(f.move.shape==='slash'){for(const s of [-1,1]){poly([[x-38,y+s*36],[x+40,y-s*35],[x+5,y+s*5]],'#97be36');line([[x-30,y+s*30],[x+34,y-s*30]],3,'#edffad')}}
  else lane(()=>{for(let i=0;i<12;i++){const t=(i/12+p)%1,yy=Math.sin(i*8)*30;poly([[t*L-15,yy-3],[t*L+10,yy],[t*L-15,yy+3]],'#d4ee8a');if(f.move.shape==='vortex'){leaf(t*L,yy-7,.7,10,'#d9ffc390');leaf(t*L,yy+7,-.7,10,'#d9ffc390')}}});
 }else if(type==='flying'){
  lane(()=>{for(let k=-2;k<=2;k++){line(Array.from({length:20},(_,i)=>[i/19*L,k*13+Math.sin(i*.5-p*12)*8]),2,k%2?'#e7fbff':'#96bccc');leaf(((k+2)/5+p)%1*L,k*13,-.3,12,'#ffffff')}});
  for(let i=0;i<5;i++){ctx.beginPath();ctx.strokeStyle='#e1f8ff';ctx.lineWidth=3;ctx.ellipse(x,y-12+i*7,18+i*10,7+i*3,p*6,0,Math.PI*1.7);ctx.stroke()}
 }else if(type==='ground'){
  for(let i=0;i<7;i++){const a=i*Math.PI*2/7,pts=Array.from({length:6},(_,j)=>{const r=j*(10+p*13);return [x+Math.cos(a)*r+Math.sin(j*8+i)*8,y+Math.sin(a)*r*.65]});line(pts,7,'#6d452b');line(pts,2,'#edbc60');const end=pts.at(-1);dot(end[0],end[1]-p*14,5,'#c49a6370')}
 }else if(type==='rock'){
  for(let i=0;i<7;i++){const xx=x+Math.sin(i*8)*66,yy=y+Math.cos(i*8)*38-(1-p)*90,r=12+i%3*4;poly([[xx-r,yy],[xx-r*.6,yy-r],[xx+r*.4,yy-r*1.2],[xx+r,yy],[xx+r*.5,yy+r*.6],[xx-r*.7,yy+r*.5]],i%2?'#8a7359':'#c2aa7e');line([[xx-r*.6,yy-r],[xx+r*.1,yy],[xx+r*.5,yy+r*.6]],2,'#ead4aa');dot(xx+15,yy+22,3,'#8a7359')}
 }else if(type==='psychic'){
  for(let i=0;i<4;i++)ring(x,y,15+((p+i/4)%1)*65,3,i%2?'#fface9':'#b75be3');for(let i=0;i<6;i++){const a=i*Math.PI/3+p*3;const xx=x+Math.cos(a)*57,yy=y+Math.sin(a)*40;poly([[xx,yy-7],[xx+6,yy+4],[xx-6,yy+4]],'#ffc3f0')}
  lane(()=>{for(let i=0;i<5;i++)ring(((i/5+p)%1)*L,0,8,2,'#efa5ff',19)});
 }else if(type==='ghost'){
  dot(x,y,24+Math.sin(p*10)*3,'#312144');for(let i=0;i<10;i++){const a=i*.9-p*5,r=20+i*4;const xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r*.6;dot(xx,yy,9,'#9c6ada90');poly([[xx-7,yy],[xx+7,yy],[xx+Math.cos(a-1)*23,yy+Math.sin(a-1)*23]],'#b987f470')}
  poly([[x-13,y-5],[x-3,y-1],[x-10,y+3]],'#e6d4ff');poly([[x+13,y-5],[x+3,y-1],[x+10,y+3]],'#e6d4ff');
 }else if(type==='dragon'){
  lane(()=>{for(const k of [-1,1])line(Array.from({length:35},(_,i)=>[L*i/34,Math.sin(i*.45-p*12)*15*k]),7,k===1?'#a17aff':'#57d7d6');poly([[L-30,-26],[L+15,-14],[L-4,-2],[L+18,8],[L-30,25],[L-17,0]],'#d5a4ff');for(let i=0;i<4;i++)poly([[L-22+i*8,-15],[L-18+i*8,-3],[L-15+i*8,-13]],'#fff5ff')});
 }else if(type==='ice'){
  for(let i=0;i<8;i++){const a=i*2.4+p*.6,xx=x+Math.cos(a)*54,yy=y+Math.sin(a)*32;const h=20+(i%3)*10;poly([[xx-8,yy+18],[xx,yy-h*(.4+p*.6)],[xx+8,yy+18]],'#8edff8');line([[xx,yy-h*(.4+p*.6)],[xx+2,yy+15]],2,'#efffff')}
  for(let i=0;i<6;i++){const a=i*Math.PI/3+p*.6;line([[x,y],[x+Math.cos(a)*42,y+Math.sin(a)*42]],3,'#e0ffff');for(const s of [-1,1])line([[x+Math.cos(a)*25,y+Math.sin(a)*25],[x+Math.cos(a)*25+Math.cos(a+s*2.3)*12,y+Math.sin(a)*25+Math.sin(a+s*2.3)*12]],2,'#e0ffff')}
 }else if(type==='fighting'){
  for(let i=0;i<3;i++){const xx=x+(i-1)*29,yy=y+Math.sin(p*20+i*2)*18;ctx.save();ctx.translate(xx,yy);ctx.rotate(i%2?.45:-.45);star(0,0,28,'#fff0b4',7);poly([[-14,-7],[-10,-17],[9,-17],[17,-5],[12,13],[-9,13],[-17,3]],'#c26e43');for(let k=0;k<3;k++)line([[-7+k*7,-15],[-7+k*7,-5]],2,'#ffe0a0');ctx.restore()}
 }else if(type==='fairy'){
  dot(x,y,30,'#ffe2f6');dot(x+14,y-9,25,'#e69ed4');ring(x,y,47+p*18,2,'#ffd8f2',22);for(let i=0;i<11;i++){const a=i*2.4+p*2;star(x+Math.cos(a)*(25+i*4),y+Math.sin(a)*(20+i*3),5+i%3*2,i%2?'#fffbe0':'#ffb5e6')}
 }else if(type==='steel'){
  lane(()=>{line([[0,0],[L,0]],12,'#667c8a');line([[0,-3],[L,-3]],3,'#f2ffff');for(let i=0;i<5;i++){const t=(i/5+p)%1;ctx.save();ctx.translate(t*L,0);ctx.rotate(p*8+i);poly([[-8,-14],[8,-14],[14,0],[8,14],[-8,14],[-14,0]],'#a7becb');ring(0,0,5,2,'#e8fcff');ctx.restore()}});
  for(let i=0;i<9;i++){const a=i*2.4;line([[x+Math.cos(a)*20,y+Math.sin(a)*20],[x+Math.cos(a)*(35+p*35),y+Math.sin(a)*(35+p*35)]],2,'#fff3b2')}
 }else if(type==='dark'){
  dot(x,y,35,'#201b2e');ring(x,y,37,4,'#9565bd');for(let i=0;i<7;i++){const a=i*Math.PI*2/7-p*2,r=75-p*40;poly([[x+Math.cos(a)*r,y+Math.sin(a)*r],[x+Math.cos(a+.2)*(r+20),y+Math.sin(a+.2)*(r+20)],[x+Math.cos(a+.35)*r,y+Math.sin(a+.35)*r]],'#614480');ctx.beginPath();ctx.strokeStyle='#c38de2';ctx.lineWidth=4;ctx.arc(x,y,45+i%2*9,a,a+.45);ctx.stroke()}
 }
 ctx.restore();return true;
}
