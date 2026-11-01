import {activeWtz} from './wtz.js';
// Entire-map ambience only. No hitboxes, damage ticks, radial fields or circles.
let scenerySeed=0x3a51b8;
const sceneryRandom=()=>{scenerySeed=(Math.imul(scenerySeed,1664525)+1013904223)>>>0;return scenerySeed/4294967296};
const particles=Array.from({length:64},(_,i)=>({x:sceneryRandom()*1000,y:sceneryRandom()*690,n:i}));
export function drawWtz(ctx,run,time=0){
 const f=activeWtz(run);if(!f)return false;
 const ex=!!run.wtz.ex,t=Number.isFinite(time)?time:0,count=ex?52:34;
 ctx.save();
 try{
  ctx.fillStyle=f.shade;ctx.globalAlpha=ex?.3:.2;ctx.fillRect(0,0,1000,690);
  ctx.fillStyle=f.color;ctx.globalAlpha=ex?.14:.08;ctx.fillRect(0,0,1000,690);
  ctx.globalAlpha=ex?.62:.44;ctx.lineCap='square';ctx.lineJoin='miter';ctx.strokeStyle=f.color;ctx.fillStyle=f.color;
  const line=(points,width=2,color=f.color)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.lineWidth=width;ctx.strokeStyle=color;ctx.stroke()};
  const poly=(points,color=f.color)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=color;ctx.fill()};
  const diamond=(x,y,s,color=f.color)=>poly([[x,y-s],[x+s*.6,y],[x,y+s],[x-s*.6,y]],color);
  const star=(x,y,s,color=f.color)=>poly([[x,y-s],[x+2,y-2],[x+s,y],[x+2,y+2],[x,y+s],[x-2,y+2],[x-s,y],[x-2,y-2]],color);
  if(f.type==='fire'){
   ctx.globalAlpha=ex?.19:.12;
   for(let i=0;i<9;i++){const x=-180+i*185+Math.sin(t*.15)*50;poly([[x,-20],[x+70,-20],[x+440,690],[x+310,690]],'#ffe394')}
   ctx.globalAlpha=ex?.7:.45;
  }
  if(f.type==='water'){
   ctx.globalAlpha=ex?.18:.11;
   for(let i=0;i<4;i++)poly([[-20,i*170],[360,i*170+30],[720,i*170-10],[1020,i*170+30],[1020,i*170+62],[-20,i*170+24]],'#bfe9f4');
   ctx.globalAlpha=ex?.8:.58;
  }
  if(f.type==='steel'){
   ctx.globalAlpha=ex?.22:.14;
   for(let y=18;y<690;y+=104)for(let x=-40+(y%208?52:0);x<1000;x+=140){ctx.strokeStyle=f.color;ctx.lineWidth=2;ctx.strokeRect(x,y,126,90);ctx.fillStyle='#ecf9fa';ctx.fillRect(x+6,y+6,4,4);ctx.fillRect(x+115,y+79,4,4)}
   ctx.globalAlpha=ex?.65:.4;
  }
  if(f.type==='bug'){
   ctx.globalAlpha=ex?.18:.1;
   for(let y=30;y<690;y+=76)for(let x=(y%152?0:45);x<1000;x+=90)poly([[x-22,y-36],[x+22,y-36],[x+43,y],[x+22,y+36],[x-22,y+36],[x-43,y]],f.color);
   ctx.globalAlpha=ex?.6:.36;
  }
  if(f.type==='psychic'){
   ctx.globalAlpha=ex?.22:.13;
   for(let y=30;y<690;y+=92)for(let x=30;x<1000;x+=110)poly([[x,y-28],[x+45,y],[x,y+28],[x-45,y]],(x+y)%3?'#f2afd8':'#c3a3ee');
   ctx.globalAlpha=ex?.7:.45;
  }
  if(f.type==='dark'){
   ctx.globalAlpha=ex?.33:.24;
   for(let i=0;i<6;i++){const y=(i*140+t*9)%850-80;poly([[0,y],[1000,y-110],[1000,y-65],[0,y+65]],'#1c213d')}
   ctx.globalAlpha=ex?.5:.32;
  }
  for(const p of particles.slice(0,count)){
   const i=p.n,x=p.x,y=p.y,s=7+i%5;
   switch(f.type){
    case 'fire': {const fy=(y-t*(8+i%4)+690*100)%690;ctx.fillStyle=i%2?'#fff0ae':f.color;ctx.fillRect(x+Math.sin(t*.4+i)*8,fy,3+i%3,3+i%2);break}
    case 'water': {const fy=(y+t*(85+i%4*12))%770-40,fx=(x-t*24+100000)%1040;line([[fx,fy],[fx-11,fy+28]],ex?2.5:1.6,i%3?f.color:'#edfaff');if(i%4===0)line([[x-10,y+25],[x+15,y+25],[x+22,y+21]],1);break}
    case 'electric': {const glow=.5+.5*Math.sin(t*1.4+i);ctx.globalAlpha=(ex?.7:.46)*(.6+glow*.4);line([[x-27,y+18],[x-8,y-4],[x+2,y+2],[x+20,y-19]],3,i%3?'#f7e4a0':f.color);line([[x-8,y-4],[x-16,y-15]],1);break}
    case 'grass': {const fy=y+Math.sin(t*.7+i)*3;line([[x,fy+12],[x,fy-7]],2,'#547e46');poly([[x,fy],[x-14,fy-5],[x-17,fy-13],[x-4,fy-9]],i%2?'#c2e494':f.color);poly([[x,fy-4],[x+14,fy-13],[x+10,fy-1]],'#a9d66d');break}
    case 'psychic': {const fy=y+Math.sin(t*.6+i)*10;diamond(x,fy,s,i%2?'#f9d0e5':f.color);line([[x,fy-s-9],[x,fy-s-19]],1,'#fff1f9');break}
    case 'normal': {const fx=(x+t*5)%1000;star(fx,y+Math.sin(t*.5+i)*3,s*.7,'#fff6d7');if(i%3===0)line([[x-17,y+15],[x+18,y+15]],1,f.color);break}
    case 'fighting': {const fx=(x+t*9)%1100-50;poly([[fx-25,y+13],[fx+17,y-12],[fx+26,y-11],[fx-10,y+15]],i%2?'#ffcf9a':f.color);line([[fx-17,y+21],[fx+27,y-3]],1);break}
    case 'flying': {const fx=(x+t*(14+i%5))%1160-80,fy=y+Math.sin(t*.5+i)*6;ctx.beginPath();ctx.moveTo(fx-40,fy+6);ctx.bezierCurveTo(fx-7,fy-15,fx+18,fy+14,fx+48,fy-6);ctx.strokeStyle=i%2?'#e8fbf5':f.color;ctx.lineWidth=2;ctx.stroke();if(i%4===0)poly([[fx,fy-12],[fx+16,fy-18],[fx+6,fy-4]],'#edffff');break}
    case 'poison': {const fx=(x+t*6)%1070-35,fy=y+Math.sin(t*.45+i)*8;poly([[fx-25,fy+8],[fx-6,fy-8],[fx+4,fy-1],[fx+27,fy-13],[fx+20,fy+13],[fx-7,fy+16]],i%3?f.color:'#b2c781');if(i%3===0)diamond(fx+20,fy-22,3,'#e7c9f1');break}
    case 'ground': line([[x-30,y-12],[x-13,y-3],[x-19,y+5],[x+6,y+10],[x+13,y+24]],2,f.shade);line([[x-13,y-3],[x+2,y-16],[x+13,y-14]],1,'#f0d8a0');break;
    case 'rock': poly([[x-13,y+12],[x-10,y-9],[x+4,y-17],[x+17,y+3],[x+9,y+16]],i%2?f.color:'#d6c4aa');poly([[x-10,y-9],[x+4,y-17],[x+1,y+9]],'#e9dec8');line([[x+1,y+9],[x+17,y+3]],1,f.shade);break;
    case 'bug': {const fx=x+Math.sin(t*.5+i)*10,fy=y+Math.sin(t*.9+i)*5;poly([[fx,fy],[fx-11,fy-9],[fx-15,fy-1],[fx-3,fy+5]],'#e6e6a1');poly([[fx,fy],[fx+11,fy-9],[fx+15,fy-1],[fx+3,fy+5]],f.color);line([[fx,fy-3],[fx,fy+8]],2,f.shade);break}
    case 'ghost': {const fy=(y-t*12+69000)%690,fx=x+Math.sin(t*.5+i)*9;poly([[fx-9,fy+12],[fx-7,fy-2],[fx,fy-17],[fx+2,fy-5],[fx+10,fy-12],[fx+10,fy+8],[fx,fy+14]],i%3?f.color:'#d4c7f5');line([[fx-3,fy+2],[fx+1,fy+2]],2,f.shade);break}
    case 'steel': {const fx=(x+t*18)%1050-25;line([[fx-17,y+9],[fx+19,y-9]],2,i%3?f.color:'#f5ffff');line([[fx-3,y+10],[fx+19,y-1]],1);break}
    case 'ice': {const fx=x+Math.sin(t*.3+i)*3,fy=y+Math.sin(t*.4+i)*4;for(let j=0;j<3;j++){const a=j*Math.PI/3;line([[fx-Math.cos(a)*s,fy-Math.sin(a)*s],[fx+Math.cos(a)*s,fy+Math.sin(a)*s]],1.5,i%2?'#e6fdff':f.color)}if(i%4===0)diamond(fx+14,fy+15,5,'#fff');break}
    case 'dragon': {const fy=(y-t*5+69000)%690;line([[x-15,fy-10],[x-12,fy+6],[x,fy+17],[x+12,fy+6],[x+15,fy-10],[x+3,fy-2],[x,fy-13],[x-3,fy-2],[x-15,fy-10]],2,i%2?'#d3ccf7':f.color);break}
    case 'dark': {const fx=(x+t*7)%1100-50;line([[fx-18,y+8],[fx+22,y-10],[fx+14,y+3]],2,f.color);if(i%4===0)poly([[fx-16,y-14],[fx,y-7],[fx+16,y-14],[fx+8,y],[fx,y-4],[fx-8,y]],'#4e4b6e');break}
    case 'fairy': {const fy=y+Math.sin(t*.8+i)*7;star(x,fy,s,i%2?'#ffe1a5':'#ffddf0');if(i%4===0)poly([[x+16,fy+6],[x+25,fy+1],[x+25,fy+13],[x+16,fy+8],[x+9,fy+13],[x+9,fy+1]],f.color);break}
   }
  }
  if(ex){ctx.globalAlpha=.55;for(const p of particles.slice(54)){star(p.x,p.y+Math.sin(t+p.n)*4,4,'#fff1b3')}}
 }finally{ctx.restore()}
 return true;
}
