// Authored Z-Move silhouettes. No enemy typing is consulted by visuals or combat.
const TAU=Math.PI*2;
export function drawZAttack(ctx,f){
 if(!f.move.zMove)return false;
 const t=Math.max(0,Math.min(1,1-f.life/f.duration)),pulse=Math.sin(Math.PI*t),c=f.move.color,k=f.move.zCrystal;
 const x=f.target.x,y=f.target.y,ox=f.origin.x,oy=f.origin.y;
 ctx.save();
 try{
  ctx.globalAlpha=Math.min(1,f.life*5);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=c;ctx.fillStyle=c;
  const path=(points,width=4,color=c,fill=false)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.lineWidth=width;ctx.strokeStyle=color;if(fill){ctx.closePath();ctx.fillStyle=color;ctx.fill()}else ctx.stroke()};
  const ring=(a,b,r,width=3,color=c,ratio=1)=>{ctx.beginPath();ctx.ellipse(a,b,Math.max(.1,r),Math.max(.1,r*ratio),0,0,TAU);ctx.lineWidth=width;ctx.strokeStyle=color;ctx.stroke()};
  const orb=(a,b,r,color=c)=>{ctx.fillStyle=color;ctx.beginPath();ctx.arc(a,b,Math.max(.1,r),0,TAU);ctx.fill()};
  const star=(a,b,r,n=5,color=c,angle=-Math.PI/2)=>path(Array.from({length:n*2},(_,i)=>{const q=angle+i*Math.PI/n,d=i%2?r*.43:r;return [a+Math.cos(q)*d,b+Math.sin(q)*d]}),2,color,true);
  const rays=(n,r,width=5,color=c)=>{for(let i=0;i<n;i++){const a=i*TAU/n+t*.6;path([[x+Math.cos(a)*r*.35,y+Math.sin(a)*r*.35],[x+Math.cos(a)*r,y+Math.sin(a)*r]],width,color)}};
  const beam=(width,color=c)=>{path([[ox,oy],[x,y]],width,color+'66');path([[ox,oy],[x,y]],width*.45,color);path([[ox,oy],[x,y]],3,'#fffbe5')};
  const bolt=(a,b,d,e,w=5,color=c)=>{const dx=d-a,dy=e-b,l=Math.hypot(dx,dy)||1;path(Array.from({length:9},(_,i)=>{const q=i/8,s=i===0||i===8?0:Math.sin(i*13+t*19)*18;return [a+dx*q-dy/l*s,b+dy*q+dx/l*s]}),w,color)};
  const petal=(a,b,r,angle,color=c)=>{ctx.save();ctx.translate(a,b);ctx.rotate(angle);ctx.beginPath();ctx.ellipse(0,0,r,r*.32,0,0,TAU);ctx.fillStyle=color;ctx.fill();ctx.restore()};
  const shards=(n,r,color=c)=>{for(let i=0;i<n;i++){const a=i*TAU/n+t*1.5,d=r*(.5+(i%3)*.2);path([[x+Math.cos(a)*d,y+Math.sin(a)*d-24*(1-t)],[x+Math.cos(a+.15)*(d+22),y+Math.sin(a+.15)*(d+22)],[x+Math.cos(a-.1)*(d+10),y+Math.sin(a-.1)*(d+10)]],2,color,true)}};
  const fist=(a,b,s,color=c)=>{path([[a-s,b-s*.6],[a-s*.8,b-s],[a+s*.5,b-s],[a+s,b-s*.45],[a+s*.8,b+s*.6],[a-s*.45,b+s],[a-s,b+s*.2]],3,color,true);for(let i=0;i<3;i++)path([[a-s*.45+i*s*.4,b-s*.75],[a-s*.45+i*s*.4,b]],2,'#fff7dd')};
  const heart=(a,b,s,color=c)=>{ctx.beginPath();ctx.moveTo(a,b+s);ctx.bezierCurveTo(a-s*2,b,a-s,b-s*1.4,a,b-s*.45);ctx.bezierCurveTo(a+s,b-s*1.4,a+s*2,b,a,b+s);ctx.fillStyle=color;ctx.fill()};
  const r=52+pulse*55;
  // A shared launch seal makes Z attacks recognisable without covering the arena.
  ring(ox,oy,15+pulse*13,2,'#ffe9a4',.65);path([[ox-8,oy-8],[ox+8,oy-8],[ox-8,oy+8],[ox+8,oy+8]],3,'#fff4bd');
  switch(k){
   case 'normalium-z': beam(38);for(let i=0;i<7;i++){const q=(i/7+t)%1;path([[ox+(x-ox)*q-24,oy+(y-oy)*q-14],[ox+(x-ox)*q,oy+(y-oy)*q],[ox+(x-ox)*q-24,oy+(y-oy)*q+14]],4)}star(x,y,r,8);break;
   case 'fightinium-z': for(let i=0;i<10;i++){const a=i*2.4;fist(x+Math.cos(a)*r*.7,y+Math.sin(a)*r*.55,13+(i%3)*3,i%2?c:'#ffe1a1')}ring(x,y,r,5);break;
   case 'flyinium-z': for(let i=0;i<14;i++){const q=(i/14+t*.9)%1,a=Math.atan2(y-oy,x-ox);petal(ox+(x-ox)*q+Math.sin(i)*25,oy+(y-oy)*q+Math.cos(i)*25,18,a+.6)}path([[x-r,y-20],[x,y+30],[x+r,y-20],[x,y+r]],6);break;
   case 'poisonium-z': ring(x,y,r,7,c,.4);for(let i=0;i<13;i++){const a=i*2.4,px=x+Math.cos(a)*r*.8,py=y+Math.sin(a)*r*.35;path([[px,py-110*(1-t)-28],[px-6,py],[px+7,py]],2,i%2?c:'#edbbff',true);orb(px,py,7)}break;
   case 'groundium-z': for(let i=0;i<6;i++){const a=i*TAU/6;path(Array.from({length:7},(_,j)=>{const d=j*r/5;return [x+Math.cos(a)*d+Math.sin(j*5)*9,y+Math.sin(a)*d*.6]}),7,'#382d36');path([[x+Math.cos(a)*r,y+Math.sin(a)*r*.6],[x+Math.cos(a)*r,y+Math.sin(a)*r*.6-35*pulse]],8)}break;
   case 'rockium-z': {const h=70+pulse*55;path([[x-r*.5,y-h],[x+r*.35,y-h-20],[x+r*.65,y+30],[x-r*.6,y+30]],4,c,true);path([[x-r*.5,y-h],[x,y+5],[x+r*.35,y-h-20]],4,'#f7e1b5');shards(10,r+25);ring(x,y+25,r,4,c,.4);break}
   case 'buginium-z': for(let i=0;i<12;i++){const a=i*TAU/12;path([[ox,oy],[x+Math.cos(a)*r,y+Math.sin(a)*r*.6],[x,y]],2,'#ecffc0')}for(let i=0;i<7;i++)ring(x,y,r*(.3+i*.1),2,c,.55);break;
   case 'ghostium-z': orb(x,y,r,'#20182f');for(let i=0;i<7;i++){const a=i*TAU/7+t*.3,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;path([[x,y],[px,py]],11,c);for(let j=-1;j<=1;j++)path([[px,py],[px+Math.cos(a+j*.2)*25,py+Math.sin(a+j*.2)*25]],4,'#ddc1ff')}break;
   case 'steelium-z': beam(30);for(let i=0;i<12;i++){const q=(i/12+t)%1;ring(ox+(x-ox)*q,oy+(y-oy)*q,10+q*35,4,i%2?c:'#fff',.4)}shards(6,r);break;
   case 'firium-z': orb(x,y,r+12,'#ef442b55');orb(x,y,r*.75,'#ed572a');orb(x,y,r*.46,'#ffcf54');for(let i=0;i<11;i++){const a=i*TAU/11+t;path([[x+Math.cos(a)*r*.5,y+Math.sin(a)*r*.5],[x+Math.cos(a+.15)*r*1.3,y+Math.sin(a+.15)*r*1.3],[x+Math.cos(a-.13)*r*.7,y+Math.sin(a-.13)*r*.7]],2,i%2?c:'#ffea88',true)}break;
   case 'waterium-z': for(let i=0;i<13;i++){const a=i*.7+t*8,d=18+i*6;ctx.beginPath();ctx.ellipse(x,y-i*4,d,d*.32,a*.05,a,a+4.5);ctx.lineWidth=6;ctx.strokeStyle=i%3?c:'#dfffff';ctx.stroke()}for(let i=0;i<8;i++)orb(x+Math.cos(i+t*6)*r,y+Math.sin(i+t*6)*r*.4,5,'#deffff');break;
   case 'grassium-z': for(let i=0;i<9;i++){const a=i*2.4,px=x+Math.cos(a)*r*.8,py=y+Math.sin(a)*r*.55;path([[px,py+20],[px,py-10]],4,'#79ad3e');for(let j=0;j<5;j++)petal(px+Math.cos(j*TAU/5)*12,py-10+Math.sin(j*TAU/5)*12,12,j*TAU/5,i%2?'#fcaecb':'#fff3a2');orb(px,py-10,6,'#ffe955')}ring(x,y,r+12,3,c,.6);break;
   case 'electrium-z': for(let i=0;i<6;i++){const a=i*TAU/6;bolt(x+Math.cos(a)*r,y+Math.sin(a)*r-90,x,y,7)}orb(x,y,19,'#fffbd4');ring(x,y,r,4);break;
   case 'psychium-z': for(let i=0;i<9;i++){const a=i*TAU/9+t;path([[x,y],[x+Math.cos(a)*r,y+Math.sin(a)*r]],3,'#fff4ff');const px=x+Math.cos(a)*r*.75,py=y+Math.sin(a)*r*.75;path([[px-15,py-25],[px+22,py-12],[px+12,py+23],[px-20,py+10]],3,i%2?c:'#e9bfff',true)}ring(x,y,r+10,3);break;
   case 'icium-z': path([[x-r*.65,y-55],[x+r*.5,y-65],[x+r*.75,y+55],[x-r*.6,y+65]],4,'#d4faff',true);for(let i=0;i<3;i++)path([[x-r*.5+i*30,y-55],[x-20+i*30,y],[x-40+i*30,y+50]],4,c);shards(12,r+25,'#a1e6ff');break;
   case 'dragonium-z': {const pts=Array.from({length:16},(_,i)=>{const q=i/15;return [ox+(x-ox)*q,oy+(y-oy)*q+Math.sin(q*10-t*5)*30*q]});path(pts,24,c+'77');path(pts,10,c);path([[x-35,y-28],[x+38,y],[x-35,y+28],[x-18,y]],3,c,true);path([[x+5,y-10],[x+5,y+10]],4,'#fff');break}
   case 'darkinium-z': orb(x,y,r+14,'#2b184e99');for(let i=0;i<5;i++)ring(x,y,r*(.45+i*.17),4,i%2?'#9582d9':c,.65);orb(x,y,r*.53,'#0d101d');rays(10,r+20,2);break;
   case 'fairium-z': for(let i=0;i<9;i++){const a=i*2.4+t;star(x+Math.cos(a)*r,y+Math.sin(a)*r*.7,12+(i%3)*4,5,i%2?'#fff8ae':c)}heart(x,y,30+pulse*12);ring(x,y,r+12,3,'#fff6d2');break;
   case 'pikanium-z': beam(35,'#ffd54f');path([[x-22,y-38],[x-12,y-65],[x-2,y-37],[x+12,y-38],[x+22,y-65],[x+27,y-17],[x+15,y+22],[x-22,y+20]],3,'#ffe15a',true);bolt(x-r,y-r,x+r,y+r,6);star(x,y+10,35,6,'#fff9b6');break;
   case 'pikashunium-z': for(let i=0;i<7;i++){const a=i*TAU/7;bolt(ox,oy,x+Math.cos(a)*r,y+Math.sin(a)*r,5,['#ff765f','#ffe65e','#a5e969','#80dcff','#cfa0ff','#fff','#ffbd74'][i])}star(x,y,r*.6,7,'#fff4bd');path([[ox-15,oy-15],[ox+12,oy-15],[ox+22,oy-5],[ox-20,oy-5]],3,'#e76559',true);break;
   case 'aloraichium-z': {const q=Math.min(1,t*2),px=ox+(x-ox)*q,py=oy+(y-oy)*q;ctx.beginPath();ctx.ellipse(px,py+14,38,9,-.4,0,TAU);ctx.fillStyle='#f5c477';ctx.fill();for(let i=0;i<5;i++)bolt(px-80+i*12,py+30,px+i*12,py-25,3);ring(x,y,r,4,'#ffef99',.45);break}
   case 'eevium-z': {const palette=['#d5c196','#6bc5fb','#ffe164','#ff934c','#f5a7dd','#9d83d1','#a4da64','#8ae5ed','#ffbfe6'];for(let i=0;i<9;i++){const a=i*TAU/9+t*1.2,px=ox+Math.cos(a)*r*.7,py=oy+Math.sin(a)*r*.55;orb(px,py,13,palette[i]);star(px,py,8,4,'#fff')}for(let i=0;i<3;i++)ring(ox,oy,30+i*22+pulse*12,3,palette[i*3]);beam(18,'#fff4a0');break}
   case 'snorlium-z': {const h=75*(1-t);ctx.fillStyle='#49727e';ctx.beginPath();ctx.ellipse(x,y-h,64,43,0,0,TAU);ctx.fill();ctx.fillStyle='#fff0c7';ctx.beginPath();ctx.ellipse(x,y-h+7,39,28,0,0,TAU);ctx.fill();ring(x,y+36,r+10,7,c,.35);shards(9,r);break}
   case 'mewnium-z': orb(x,y,r,'#e684f355');star(x,y,r*.6,6,'#fff3fd');rays(15,r+30,4);for(let i=0;i<4;i++)ring(x,y,30+i*22+10*pulse,3,i%2?'#fff':c);break;
   case 'decidium-z': for(let i=0;i<15;i++){const a=i*TAU/15,q=(t+i*.05)%1,px=x+Math.cos(a)*r*(1-q),py=y+Math.sin(a)*r*(1-q);path([[px+Math.cos(a)*30,py+Math.sin(a)*30],[px,py]],3,i%2?c:'#a7f7b9');path([[px+Math.cos(a+.5)*13,py+Math.sin(a+.5)*13],[px,py],[px+Math.cos(a-.5)*13,py+Math.sin(a-.5)*13]],3)}ring(x,y,r,2,'#8f6be5');break;
   case 'incinium-z': for(let i=-1;i<=1;i++)path([[x-80,y+i*35],[x+80,y+i*35]],3,'#ff9758');path([[x-75,y-50],[x-75,y+50],[x+75,y+50],[x+75,y-50],[x-75,y-50]],5,c);star(x,y,r*.75,10,'#e15c4077');fist(x,y-50*(1-t),28,'#ffb168');break;
   case 'primarium-z': orb(x,y-20,r*.72,'#76d8ff77');ring(x,y-20,r*.72,5,'#cffaff');for(let i=0;i<9;i++){const a=i*TAU/9+t,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r*.65;orb(px,py,6,'#e0fbff');path([[px,py],[px,py-20],[px+10,py-23]],3,c)}ring(x,y+35,r,4,c,.35);break;
   case 'lycanium-z': for(let i=0;i<11;i++){const a=i*2.4,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r*.6;path([[px,py-65*pulse-15],[px-9,py+10],[px+12,py+10]],3,i%2?c:'#f1d3ac',true)}ring(x,y,r+15,4,c,.45);break;
   case 'mimikium-z': path([[x-50,y+45],[x-40,y-25],[x-35,y-70],[x-12,y-37],[x+12,y-35],[x+44,y-73],[x+37,y-18],[x+56,y+45]],4,'#f2d5a0',true);path([[x-28,y-8],[x-18,y+3],[x-30,y+5]],4,'#423c4a');path([[x+18,y-8],[x+28,y+3],[x+16,y+5]],4,'#423c4a');heart(x-r*.8,y-20,15);heart(x+r*.8,y-20,15);path([[x-48,y+15],[x,y+35],[x+48,y+15]],9,'#6b4b84');break;
   case 'kommonium-z': for(let i=0;i<12;i++){const a=i*TAU/12+t*.8,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r*.65;path([[px,py-15],[px+13,py],[px,py+15],[px-13,py]],2,i%2?'#e8d06b':c,true)}for(let i=0;i<4;i++)ring(ox,oy,25+i*25+pulse*8,4,i%2?'#ffe88e':c,.65);break;
   case 'tapunium-z': {const h=65+pulse*35;path([[x-30,y-h],[x+30,y-h],[x+42,y-15],[x+70,y+15],[x+48,y+30],[x+20,y+10],[x+20,y+55],[x-20,y+55],[x-20,y+10],[x-48,y+30],[x-70,y+15],[x-42,y-15]],3,'#f8cf53',true);path([[x-20,y-h+20],[x+20,y-h+20],[x,y-h+45],[x-20,y-h+20]],4,'#f9f7e7');ring(x,y+50,r,5,c,.4);break}
   case 'solganium-z': beam(47,'#ffc875');star(x,y,r,12,'#ffcb6377');for(let i=0;i<8;i++){const a=i*TAU/8;path([[x+Math.cos(a)*35,y+Math.sin(a)*35],[x+Math.cos(a)*r,y+Math.sin(a)*r]],8,'#fff0c7')}orb(x,y,25,'#fff');break;
   case 'lunalium-z': orb(x,y,r,'#41236f99');for(let i=0;i<5;i++){const a=i*TAU/5+t;ctx.beginPath();ctx.arc(x,y,35+i*14,a,a+Math.PI*1.3);ctx.lineWidth=8;ctx.strokeStyle=i%2?c:'#c3b8ff';ctx.stroke()}path([[x-r,y-25],[x,y+25],[x+r,y-25],[x+35,y+55],[x,y+38],[x-35,y+55]],4,'#cec5ff');beam(22,c);break;
   case 'ultranecrozium-z': for(let i=-2;i<=2;i++){const px=x+i*35;path([[px,y-180],[px,y+90]],18,'#fff9ae66');path([[px,y-180],[px,y+90]],5,'#fffbd8')}star(x,y,r+15,8,'#ffe798');star(x,y,r*.5,8,'#fff');for(let i=0;i<4;i++)ring(x,y,30+i*24,3,['#fff','#a5e9ff','#ffd1fc','#ffeda0'][i],.7);break;
   case 'marshadium-z': for(let i=0;i<7;i++){const a=i*TAU/7+t*.25,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r*.65;star(px,py,13,7,i%2?'#b0e8b0':c);path([[px,py],[x,y]],4,c)}fist(x,y,27,'#88c0ae');break;
  }
 }finally{ctx.restore()}
 return true;
}
