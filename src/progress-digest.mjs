import {template} from './template.mjs';
export const duration = 15;
export const timeline = Object.freeze([
  {start:0, lead:'Content checked; mobile testing is next.', tasks:['[ ] Check mobile layout','[ ] Publish the page','[x] Check page content']},
  {start:5, lead:'Mobile checked; publishing is next.', tasks:['[ ] Publish the page','[x] Check mobile layout','[x] Check page content']},
  {start:10, lead:'Published; all three checks are recorded.', tasks:['[x] Publish the page','[x] Check mobile layout','[x] Check page content']}
].map(s=>Object.freeze({...s,tasks:Object.freeze(s.tasks)})));
export const cameraKeys = Object.freeze([[0,0],[2,0],[5,1],[10,1],[13.5,0],[15,0]].map(Object.freeze));
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const num = n => Number(n.toFixed(6));
function normalized(t, options={}) {
  if(typeof t!=='number'||!Number.isFinite(t)||t<0) throw new RangeError('time must be finite, nonnegative seconds');
  return options.reducedMotion ? 0 : t%duration;
}
function cameraAt(t) {
  const i = cameraKeys.findIndex((k,j)=>j>0&&t<=k[0]);
  const [a,b] = [cameraKeys[i-1],cameraKeys[i]];
  const q = a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0]);
  return {x:num(-108*q), y:num(-52*q), scale:num(1+.22*q), opacity:1};
}
export function debug_view(t, options={}) {
  const time=normalized(t,options), index=timeline.findLastIndex(s=>time>=s.start);
  const width=options.width??1024;
  if(!Number.isFinite(width)||width<=0)throw new RangeError('width must be positive and finite');
  const narrow=width<=600;
  return {inputSeconds:t,timeSeconds:time,durationSeconds:duration,loop:'t modulo 15; exact 15 resets to 0',scene:index+1,lead:timeline[index].lead,tasks:[...timeline[index].tasks],camera:narrow?{x:0,y:0,scale:1,opacity:1}:cameraAt(time),layout:narrow?'chat-focus':'three-panel',width,reducedMotion:!!options.reducedMotion,svgExport:'f(inputSeconds, {width, reducedMotion})',illustrative:true};
}
const baseStyle='text{font-family:Arial,sans-serif}.muted{fill:#737373}.task{font-family:monospace;font-size:23px;fill:#242424}.lead{font-size:23px;fill:#202020}';
function scene(s,i,visible) {
 return `<g class="scene scene-${i}" id="snapshot-${i+1}" opacity="${visible?1:0}"><g id="assistant-bubble-${i+1}"><rect x="191" y="158" width="586" height="235" rx="12" fill="#eee"/><text class="lead" x="212" y="200">${escape(s.lead)}</text>${s.tasks.map((t,j)=>`<text class="task" x="212" y="${255+j*54}">${escape(t)}</text>`).join('')}</g></g>`;
}
function shell(style,scenes,frame='',camera='') {
 return template.replace('__STYLE__',style).replace('__SCENES__',scenes).replace('__FRAME__',frame).replace('__CAMERA__',camera);
}
export function f(t,options={}) {
 const d=debug_view(t,options), c=d.camera;
 return shell(baseStyle+(d.layout==='chat-focus'?'#left-panel,#right-panel{display:none}':''),scene(timeline[d.scene-1],d.scene-1,true),d.layout==='chat-focus'?'transform="translate(-260 -100) scale(1.5)"':'',`transform="translate(${c.x} ${c.y}) scale(${c.scale})" opacity="${c.opacity}"`);
}
export function animation() {
 const sceneCss=timeline.map((s,i)=>{
  const start=s.start/duration*100,end=(timeline[i+1]?.start??duration)/duration*100;
  const points=new Map([[0,i===0?1:0],[start,1],[end,0],[100,i===0?1:0]]);
  return `@keyframes scene${i}{${[...points].sort((a,b)=>a[0]-b[0]).map(([p,v])=>`${p}%{opacity:${v}}`).join('')}}.scene-${i}{animation:scene${i} ${duration}s steps(1,end) infinite}`;
 }).join('');
 const cameraCss=`@keyframes camera{${cameraKeys.map(([t])=>{const c=cameraAt(t);return `${t/duration*100}%{transform:translate(${c.x}px,${c.y}px) scale(${c.scale})}`}).join('')}}.camera{animation:camera ${duration}s linear infinite}`;
 const responsive='@media (max-width:600px){#left-panel,#right-panel{display:none}#responsive-frame{transform:translate(-260px,-100px) scale(1.5)}.camera{animation:none!important}}';
 return shell(baseStyle+`@media (prefers-reduced-motion:no-preference){${sceneCss}${cameraCss}}`+responsive,timeline.map((s,i)=>scene(s,i,i===0)).join(''));
}
