import { W,H,ROWS,COLS,cellH,BASE_Y } from './engine.js';
import { SPRITES, drawSprite } from './sprites.js';
import { game } from './game.js';
export function draw(ctx, ui){
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle='#1e1e24';
  for(let r=1;r<ROWS;r++){ ctx.beginPath(); ctx.moveTo(0,r*cellH); ctx.lineTo(W,r*cellH); ctx.stroke(); }
  for(let c=1;c<COLS;c++){ ctx.beginPath(); ctx.moveTo(c*W/COLS,0); ctx.lineTo(c*W/COLS,H); ctx.stroke(); }
  ctx.fillStyle='#24242c'; ctx.fillRect(W*0.05, BASE_Y, W*0.9, 4);
  for(const u of game.units){
    const row = SPRITES.rows[u.code] ?? SPRITES.rows.EG;
    const frame = Math.floor(ui.time*6) % 4;
    const scale = (u.code==='BK'||u.code==='WE'||u.code==='EB'||u.code==='BO')?1.2:1.0;
    drawSprite(ctx, row, frame, u.x, u.y, scale*(1+u.hitT*0.2));
    if(u.swingT>0){ drawSprite(ctx, SPRITES.rows.FX, Math.floor((1-u.swingT)/0.18*3)%4, u.x, u.y, scale*1.0); }
    if(u.team==='ally'&&(u.code==='SK'||u.code==='AR'||u.code==='WR')){
      const s=u.code==='SK'?game.stars.SK:(u.code==='AR'?game.stars.AR:game.stars.WR);
      ctx.fillStyle='#ffd45a'; ctx.font='12px system-ui'; ctx.textAlign='center'; ctx.fillText('★'.repeat(s), u.x, u.y-24);
    }
    ctx.fillStyle='#2a2a2a'; ctx.fillRect(u.x-10,u.y+14,20,3.5);
    ctx.fillStyle='#7cf470'; ctx.fillRect(u.x-10,u.y+14,20*(u.hp/u.max),3.5);
  }
  ctx.globalCompositeOperation='lighter';
  for(const p of game.proj){ drawSprite(ctx, SPRITES.rows.PROJ, 1, p.x, p.y, 0.9); }
  ctx.globalCompositeOperation='source-over';
  for(const f of game.fx){
    f.t-=1/60;
    if(f.type==='hit'){ ctx.strokeStyle='#fff8'; ctx.strokeRect(f.x-10,f.y-10,20,20); }
    else if(f.type==='ring'){ ctx.strokeStyle='#7ecbff99'; ctx.beginPath(); ctx.arc(f.x,f.y, f.r*(1-f.t/0.4),0,Math.PI*2); ctx.stroke(); }
    else if(f.type==='text'){ f.y-=0.7; ctx.fillStyle='#ffd45a'; ctx.font='bold 16px system-ui'; ctx.textAlign='center'; ctx.fillText(f.txt,f.x,f.y); }
    else if(f.type==='num'){ f.y-=0.6; ctx.fillStyle=f.color; ctx.font='bold 14px system-ui'; ctx.textAlign='center'; ctx.fillText(f.txt,f.x,f.y); }
  }
  game.fx=game.fx.filter(f=>f.t>0);
  if(game.shakeT>0) game.shakeT=Math.max(0,game.shakeT-1/60);
}
export function renderSynergiesBar(root){
  root.innerHTML='';
  const chip=(label,val)=>{ const el=document.createElement('div'); el.className='sy'; el.innerHTML=`<span>${label}</span><level>${val}</level>`; root.appendChild(el); };
  chip('Legion', game.synergies.Legion);
  chip('Arrowstorm', game.synergies.Arrowstorm);
  chip('Wisp', game.synergies.Wisp);
  chip('Doom', game.synergies.Doom);
  const stars=document.createElement('div'); stars.className='sy';
  stars.innerHTML=`<span>★ SK:${game.stars.SK} AR:${game.stars.AR} WR:${game.stars.WR}</span>`;
  root.appendChild(stars);
}
export function openRelicModal(modalWrap, choices, onTake, onSkip, title){
  modalWrap.style.display='flex';
  modalWrap.querySelector('#modalTitle').textContent=title;
  const list=modalWrap.querySelector('#choiceList'); list.innerHTML='';
  choices.forEach(r=>{
    const row=document.createElement('div'); row.className='choice';
    row.innerHTML=`<div style="flex:1"><div class="title">${r.title}</div><div class="desc">${r.desc}</div></div>`;
    const btn=document.createElement('button'); btn.className='take'; btn.textContent='Take';
    btn.onclick=()=>onTake(r);
    row.appendChild(btn); list.appendChild(row);
  });
  modalWrap.querySelector('#btnSkip').onclick=onSkip;
  modalWrap.querySelector('#btnContinue').onclick=onSkip;
}
export function closeRelicModal(modalWrap){ modalWrap.style.display='none'; }
