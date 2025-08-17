export const SPRITES = {
  sheet: null, tile:32, cols:8,
  rows: { SK:0, AR:1, WR:2, BK:3, EG:4, ES:5, EB:6, BO:7, PROJ:8, FX:9 }
};
export async function loadSprites(){
  return new Promise((res,rej)=>{
    const img = new Image();
    img.onload = ()=>{ SPRITES.sheet = img; res(); };
    img.onerror = rej;
    img.src = './assets/sprites.png';
  });
}
export function drawSprite(ctx, row, frame, x, y, scale=1){
  if(!SPRITES.sheet) return;
  const s=SPRITES.tile, cols=SPRITES.cols;
  const sx=(frame%cols)*s, sy=row*s;
  ctx.drawImage(SPRITES.sheet, sx,sy,s,s, x-(s*scale)/2, y-(s*scale)/2, s*scale, s*scale);
}
