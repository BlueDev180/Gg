import { clamp } from './engine.js';
export const TYPES = ['SK','AR','WR','DB'];
export const BAR_COLS = 6, BAR_SIZE = 12;
export function symbolFor(k){ return k==='SK'?'💀':k==='AR'?'🏹':k==='WR'?'👻':'☠️'; }
export function colorFor(k){ return k==='SK'?'#a55':k==='AR'?'#5a5':k==='WR'?'#7a67c7':'#b27b55'; }
export class BlockBar {
  constructor(root, rateLabel){
    this.root=root; this.rateLabel=rateLabel; this.blocks=[]; this.spawnFlags=[]; this.timer=0; this.rate=0.8; this.onCast=null; this.tempo=false;
  }
  setRate(r){ this.rate=Math.max(0.25,r); if(this.rateLabel) this.rateLabel.textContent='Block: '+this.rate.toFixed(2)+'s'; }
  addBlock(k){ if(this.blocks.length>=BAR_SIZE) return false; this.blocks.push(k); this.spawnFlags[this.blocks.length-1]=true; this.render(); return true; }
  refillInstantTo(n){ while(this.blocks.length<Math.min(n,BAR_SIZE)){ const k=TYPES[(Math.random()*TYPES.length)|0]; this.addBlock(k);} }
  update(dt){ this.timer-=dt; if(this.timer<=0 && this.blocks.length<BAR_SIZE){ const k=TYPES[(Math.random()*TYPES.length)|0]; this.addBlock(k); this.timer=this.rate; } }
  rowBounds(i){ const rowStart=Math.floor(i/BAR_COLS)*BAR_COLS; return {rowStart, rowEnd:rowStart+BAR_COLS-1}; }
  selectionFor(i){ const k=this.blocks[i]; if(!k) return null; const {rowStart,rowEnd}=this.rowBounds(i); let a=i,b=i; while(a-1>=rowStart&&this.blocks[a-1]===k)a--; while(b+1<=rowEnd&&this.blocks[b+1]===k)b++; const len=b-a+1, use=Math.min(3,len); let s=i; if(use===3)s=clamp(i-1,a,b-2); else if(use===2)s=clamp(i-1,a,b-1); return {k,use,s}; }
  clearPreview(){ this.root.querySelectorAll('.block.preview').forEach(e=>e.classList.remove('preview')); }
  handlePreview=(e)=>{ const el=e.currentTarget;if(!el.classList.contains('ready'))return; const i=+el.dataset.i; const sel=this.selectionFor(i); if(!sel)return; this.clearPreview(); for(let j=0;j<sel.use;j++){ const idx=sel.s+j; const el2=this.root.querySelector(`.block[data-i="${idx}"]`); if(el2) el2.classList.add('preview'); } }
  handleTap=(e)=>{ e.preventDefault?.(); const el=e.currentTarget;if(!el.classList.contains('ready'))return; const i=+el.dataset.i; const sel=this.selectionFor(i); if(!sel)return; this.blocks.splice(sel.s,sel.use); this.spawnFlags.splice(sel.s,sel.use); this.clearPreview(); this.render(); if(this.onCast) this.onCast(sel.k, sel.use); }
  render(){ const bar=this.root; bar.innerHTML=''; for(let i=0;i<this.blocks.length;i++){ const k=this.blocks[i]; const d=document.createElement('div'); d.className='block'; d.dataset.i=i; d.dataset.k=k; d.textContent=symbolFor(k); d.style.borderColor=colorFor(k); if(this.spawnFlags[i]){ d.classList.add('spawn'); requestAnimationFrame(()=>d.classList.add('ready')); this.spawnFlags[i]=false; } else d.classList.add('ready'); d.addEventListener('touchstart',this.handlePreview,{passive:true}); d.addEventListener('mousedown',this.handlePreview); d.addEventListener('touchend',this.handleTap,{passive:true}); d.addEventListener('mouseup',this.handleTap); d.addEventListener('mouseleave',()=>this.clearPreview()); d.addEventListener('touchcancel',()=>this.clearPreview()); bar.appendChild(d);} for(let i=this.blocks.length;i<BAR_SIZE;i++){ const ph=document.createElement('div'); ph.className='block'; ph.style.opacity=.15; ph.style.pointerEvents='none'; bar.appendChild(ph);} }
}
