import {partyProfile} from './party-details.js?v=27';
import {formatDamageTotal,damageMultiplier,cooldownFactor} from './engine.js?v=27';
import {attackCooldown} from './attacks.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const title=s=>s.replace(/(^|-)([a-z])/g,(_,dash,c)=>(dash?' ': '')+c.toUpperCase());
const upgradeRows=rows=>rows.map(c=>`<li><div><b>${esc(c.title)}</b><small>${esc(c.scope)} · ${esc(c.effect)}</small></div><span>×${c.count}${c.stacks>c.count&&['split','haste','chill','pierce','finish','siphon','ricochet','focus','execute','cadence','wounds','nova','shield','surge'].includes(c.kind)?`<small>${c.stacks} stacks</small>`:''}</span></li>`).join('');

export function createPartyInspector(get){
 let previous=null,key='',revision=0;
 return function render(ally,run,roster){
  const root=get('party-inspector');
  if(!ally){if(previous!==null||key!=='empty'){root.innerHTML='<div class="inspector-empty"><span class="inspector-emblem">◒</span><div><span class="eyebrow">PARTNER DOSSIER</span><h2>Your team, up close.</h2><p>Choose your starter, then select any party member to inspect its stats, battle contributions and upgrades.</p></div></div>';previous=null;key='empty'}return}
  const p=ally.pokemon,nextKey=JSON.stringify([p.id,p.stats,p.types,p.stage,p.personalPower,p.teraType,run.upgradeRevision,run.upgradeHistory.length,run.range,run.maxHp,run.armor]);
  if(previous!==ally||key!==nextKey){
   const profile=partyProfile(ally,run,roster),rows=profile.upgrades.active;previous=ally;key=nextKey;revision++;
   root.innerHTML=`<div class="inspector-heading"><span class="eyebrow">PARTNER DOSSIER</span><span>SELECT A PARTY MEMBER TO INSPECT</span></div>
    <div class="inspector-overview"><div class="inspector-identity"><img src="${esc(p.sprite)}" alt="${esc(p.name)}"><div><h2 id="inspector-name">${esc(title(p.name))}</h2><p>${esc(p.types.join(' / '))} · STAGE ${p.stage}</p><small>${esc(profile.form)} · ${esc(profile.evolution)}</small></div></div>
    <div><h3>BASE STATS <span>TOTAL ${profile.statTotal}</span></h3><dl class="inspector-stats">${profile.stats.map(s=>`<div><dt>${s.name}</dt><dd>${s.value}<span style="width:${Math.min(100,s.value/255*100)}%"></span></dd></div>`).join('')}</dl></div></div>
    <div class="inspector-move"><b>${esc(profile.move.name)}</b><span>${esc(profile.move.type)} · ${profile.attackClass} · ${esc(profile.move.shape)}</span><span>Move ×${profile.move.power.toFixed(2)}</span><span title="Single-target hit before enemy defense, split damage and conditional tactics">Neutral hit (0 Def): ${profile.neutralHit.toFixed(1)}</span><span id="inspector-cooldown"></span><span>${profile.targets} target${profile.targets===1?'':'s'} · ${profile.bounces} bounces · range ${profile.range}</span></div>
    <div class="inspector-contributions">${[['damage','TOTAL DAMAGE'],['share','RUN DAMAGE SHARE'],['defeats','DEFEATS'],['bosses','BOSS DEFEATS'],['hits','DAMAGING HITS'],['volleys','ATTACK VOLLEYS'],['strongest','STRONGEST HIT'],['healing','TOWER HP RESTORED']].map(([id,label])=>`<div><span>${label}</span><b id="inspector-${id}">0</b></div>`).join('')}</div>
    <div class="inspector-upgrade-heading"><h3>RELEVANT UPGRADES <span>${rows.reduce((n,c)=>n+c.count,0)} CARDS</span></h3><b id="inspector-multiplier"></b></div>
    <div class="inspector-factors">${profile.factors.map(f=>`<span>${esc(f.label)} <b>×${f.value.toFixed(3)}</b></span>`).join('')}</div>
    <ul class="inspector-upgrades">${upgradeRows(rows)||'<li>No matching upgrades yet. Clear waves to build this partner’s power.</li>'}</ul>
    ${profile.upgrades.support.length?`<details class="inspector-support"><summary>Shared tower support · ${profile.upgrades.support.reduce((n,c)=>n+c.count,0)} cards</summary><ul>${upgradeRows(profile.upgrades.support)}</ul></details>`:''}
    <p class="inspector-note">Stats are PokéAPI base stats; partners do not take damage. Contributions count actual HP removed and healing restored, including splash and bounces. Run share includes former partners. Enemy defenses and conditional tactics change damage in combat. All type matchups are neutral.</p>`;
   root.dataset.revision=String(revision);
  }
  const total=run.totalDamage??run.team.reduce((n,a)=>n+(a.totalDamage||0),0),values={damage:ally.totalDamage||0,share:total>0?(ally.totalDamage||0)/total*100:0,defeats:ally.defeats||0,bosses:ally.bossDefeats||0,hits:ally.damageHits||0,volleys:ally.volleys||0,strongest:ally.strongestHit||0,healing:ally.healing||0};
  for(const [id,value] of Object.entries(values)){const node=get('inspector-'+id),text=id==='share'?value.toFixed(1)+'%':formatDamageTotal(value);if(node.textContent!==text)node.textContent=text;node.title=id==='share'?'Share of all damage dealt during this run, including former partners':Math.round(value).toLocaleString('en-US')}
  get('inspector-cooldown').textContent=(attackCooldown(p)*cooldownFactor(run)).toFixed(2)+'s between volleys';
  get('inspector-multiplier').textContent='DAMAGE ×'+damageMultiplier(p,run).toFixed(3);
 };
}
