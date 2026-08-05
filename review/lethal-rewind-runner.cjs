'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),noop=()=>{};
if(process.argv.length!==4)throw new Error('usage: node review/lethal-rewind-runner.cjs <game.js> <case>');
const file=process.argv[2],name=process.argv[3],hookFile=path.join(__dirname,'lethal-rewind-hooks.js');
const source=fs.readFileSync(file,'utf8'),hooks=fs.readFileSync(hookFile,'utf8');
const imports=[
 "import {LEVELS,ENEMY_TYPES} from './content.js';",
 "import {createUI} from './ui.js';",
 "import {createPresentation} from './presentation.js';"
];
const lines=source.split('\n'),actualImports=lines.filter(x=>x.startsWith('import '));
if(JSON.stringify(actualImports)!==JSON.stringify(imports))throw new Error('fail closed: unexpected imports');
for(const marker of ['function resetLoop(){','function rewind(','function damagePlayer(','function fixed(){','function updateEnemies(','function updateBullets(','function updateObjective(','function frame(']){
 if(source.split(marker).length!==2)throw new Error('fail closed: marker not unique: '+marker);
}
if(source.includes('globalThis.__hooks'))throw new Error('fail closed: source already defines hooks');
if(hooks.split('globalThis.__hooks=').length!==2)throw new Error('fail closed: hook export marker not unique');
const stripped=lines.filter(x=>!x.startsWith('import ')).join('\n');
if(stripped===source||!stripped.startsWith("const canvas=document.querySelector('#game')"))throw new Error('fail closed: import extraction mismatch');
const script=stripped+'\n'+hooks;
const ctx=new Proxy({}, {get:(o,k)=>o[k]||(o[k]=k==='createRadialGradient'?()=>({addColorStop:noop}):noop),set:(o,k,v)=>(o[k]=v,true)}),canvas={getContext:()=>ctx,addEventListener:noop,classList:{toggle:noop,add:noop}};
const LEVELS=[{id:'test',name:'TEST',duration:12,maxLoops:6,player:{x:800,y:450},walls:[],spawns:[],switches:[],tutorials:[],objectives:['TEST'],goal:{type:'kills',count:999},palette:{}}];
const presentation=new Proxy({audio:{play:noop,unlock:noop,setMuted:noop,setVolume:noop},resize:noop},{get:(o,k)=>o[k]||noop});
const ui=new Proxy({raw:{settings:{volume:.8,muted:false,shake:true,motion:false}}},{get:(o,k)=>o[k]||(o[k]=(...a)=>{if(k==='update')globalThis.__lastUI=a[0]})});
Object.assign(globalThis,{LEVELS,ENEMY_TYPES:{},createUI:()=>ui,createPresentation:()=>presentation,document:{querySelector:()=>canvas},innerWidth:1600,innerHeight:900,devicePixelRatio:1,addEventListener:noop,requestAnimationFrame:noop,matchMedia:()=>({matches:false}),localStorage:{getItem:()=>null,setItem:noop},performance:{now:()=>0},setTimeout:noop});
vm.runInThisContext(script,{filename:file});
if(!globalThis.__hooks||typeof globalThis.__hooks[name]!=='function')throw new Error('unknown case '+name);
console.log(JSON.stringify(globalThis.__hooks[name]()));
