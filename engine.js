export const W = 405, H = 720;
export const ROWS = 18, COLS = 9;
export const cellW = W/COLS, cellH = H/ROWS;
export const BASE_Y = H*0.94, BASE_HIT_Y = H*0.93;
export const TEAMS = {ALLY:'ally', ENEMY:'enemy'};
export const STATE = {PLAY:'play', REWARD:'reward', GAMEOVER:'gameover'};
export const saveKey = 'bc_meta_v60';
export function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
export function rand(arr){ return arr[(Math.random()*arr.length)|0]; }
export function makeNumFx(list,x,y,txt,color){ list.push({type:'num',x,y,t:0.9,txt,color}); }
export function makeTextFx(list,x,y,txt){ list.push({type:'text',x,y,t:1.0,txt,yo:0}); }
export function makeRingFx(list,x,y,r){ list.push({type:'ring',x,y,t:0.4,r}); }
export function makeHitFx(list,x,y){ list.push({type:'hit',x,y,t:0.15}); }
export function loadMeta(){ try{ return JSON.parse(localStorage.getItem(saveKey) || '{"best":0,"runs":0}'); } catch(e){ return {best:0,runs:0}; } }
export function saveMeta(meta){ localStorage.setItem(saveKey, JSON.stringify(meta)); }
