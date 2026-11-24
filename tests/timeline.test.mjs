import {test} from 'node:test';
import assert from 'node:assert/strict';
import {f,debug_view,animation} from '../src/progress-digest.mjs';
for(const width of [1280,390])for(const t of [0,1.999,2,3.5,4.999,5,5.001,7.5,9.999,10,10.001,12,13.5,14.999,15,30])test(`determinism/state ${t}s ${width}px`,()=>{
 const o={width},d=debug_view(t,o),svg=f(t,o);
 assert.equal(svg,f(t,o));assert.deepEqual(d,debug_view(t,o));
 assert.equal(d.scene,t%15<5?1:t%15<10?2:3);
 assert.equal(d.tasks.length,3);assert(d.tasks.includes('[x] Check page content'));
 const done=d.tasks.map(t=>t.startsWith('[x]'));assert.deepEqual(done,[...done].sort());
 assert(svg.includes(d.lead));assert(!/<script|foreignObject|href=|@import|url\(/i.test(svg));
 assert.equal((svg.match(/class="lead"/g)||[]).length,1);
 assert.equal(d.layout,width<=600?'chat-focus':'three-panel');
 assert.equal(d.camera.opacity,1);
});
for(const t of [-1,NaN,Infinity,-Infinity,'5',null])test(`reject invalid ${String(t)}`,()=>assert.throws(()=>f(t),RangeError));
for(const width of [0,-1,NaN,Infinity])test(`reject width ${String(width)}`,()=>assert.throws(()=>f(0,{width}),RangeError));
test('loop endpoints and camera interpolation',()=>{
 assert.equal(f(0),f(15));assert.equal(f(0),f(30));
 assert.equal(debug_view(3.5).camera.scale,1.11);
 assert.equal(debug_view(5).camera.scale,1.22);
 assert.equal(debug_view(13.5).camera.scale,1);
 assert.equal(debug_view(12).camera.scale,1.094286);
});
test('reduced motion freezes meaningful first frame',()=>{
 for(const t of [0,5,10,14])assert.equal(f(t,{reducedMotion:true}),f(0));
 assert(!f(10,{reducedMotion:true}).includes('@keyframes'));
});
test('animation derives scene boundaries and camera from source',()=>{
 const svg=animation();assert(svg.includes('steps(1,end)'));assert(svg.includes('prefers-reduced-motion:no-preference'));
 assert.equal((svg.match(/class="lead"/g)||[]).length,3);
 assert(svg.includes('33.33333333333333%'));assert(svg.includes('66.66666666666666%'));
 assert(!/<script|foreignObject|href=|@import|url\(/i.test(svg));
});
