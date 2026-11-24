import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {f,debug_view,animation} from '../src/progress-digest.mjs';
const args=process.argv.slice(2);
const val=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const root=fileURLToPath(new URL('../',import.meta.url));
if(args.includes('--build')||args.includes('--check')) {
 for(const [file,data] of [['progress-digest.svg',animation()],['progress-digest-static.svg',f(0)]]) {
  const path=join(root,'assets',file);
  if(args.includes('--check')){if(readFileSync(path,'utf8')!==data)throw Error(`stale generated asset: ${file}`);}
  else writeFileSync(path,data);
 }
} else {
 const out=resolve(val('--out-dir','frames'));mkdirSync(out,{recursive:true});
 const times=args.includes('--sample')?[0,1.999,2,3.5,4.999,5,5.001,7.5,9.999,10,10.001,12,13.5,14.999,15]:[Number(val('--time','0'))];
 for(const width of args.includes('--sample')?[1280,390]:[Number(val('--width','1024'))])for(const time of times){
  const options={width,reducedMotion:args.includes('--reduced-motion')},name=`t-${time}-w-${width}`;
  writeFileSync(join(out,name+'.svg'),f(time,options));
  writeFileSync(join(out,name+'.json'),JSON.stringify(debug_view(time,options),null,2)+'\n');
 }
}
