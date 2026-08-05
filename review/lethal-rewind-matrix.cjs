'use strict';
const {spawnSync}=require('child_process');
if(process.argv.length!==4)throw new Error('usage: node review/lethal-rewind-matrix.cjs <parent-game.js> <candidate-game.js>');
const runner=require('path').join(__dirname,'lethal-rewind-runner.cjs'),parent=process.argv[2],candidate=process.argv[3];
const cases=['bullet','contact','multiBullet','multiContact','crossSources','nonlethal','invulnerable','earlyBullet','earlyContact','manual','timer','gameOver'];
const intended=new Set(['bullet','contact','multiBullet','multiContact','crossSources']);
function run(file,c){const r=spawnSync(process.execPath,[runner,file,c],{encoding:'utf8'});if(r.status!==0)throw new Error(`${c} failed for ${file}: ${r.stderr||r.stdout}`);return JSON.parse(r.stdout)}
const changed=new Set();
for(const c of cases){const b=run(parent,c),n=run(candidate,c),different=JSON.stringify(b)!==JSON.stringify(n);if(different)changed.add(c);if(different!==intended.has(c))throw new Error(`${c}: unexpected ${different?'change':'equality'}`);if(intended.has(c)){const tuple=[n.tick,n.record,n.loop,n.hp,n.mode,n.echoes,n.bullets,n.enemies];if(JSON.stringify(tuple)!==JSON.stringify([0,0,2,100,'play',1,0,0]))throw new Error(`${c}: bad lethal reset ${JSON.stringify(n)}`);if(n.lastUI.timeLeft!==12||n.lastUI.health!==100||n.lastUI.loop!==2||n.lastUI.echoes!==1)throw new Error(`${c}: bad HUD ${JSON.stringify(n.lastUI)}`)}console.log(`${c}: ${different?'EXPECTED_CHANGE':'EXACT_CONTROL'}`)}
if(JSON.stringify([...changed])!==JSON.stringify([...intended]))throw new Error('changed-case set mismatch');
const a=run(candidate,'alignment');
if(JSON.stringify([a.sealed.tick,a.sealed.record,a.sealed.loop,a.sealed.hp,a.sealed.echoes,a.sealed.frames])!==JSON.stringify([0,0,2,100,1,31]))throw new Error('bad sealed alignment '+JSON.stringify(a));
if(JSON.stringify([a.next.tick,a.next.record,a.next.loop,a.next.echoes,a.framesAfter])!==JSON.stringify([1,1,2,1,31]))throw new Error('bad next-step alignment '+JSON.stringify(a));
console.log('MATRIX_ASSERTIONS_PASS');
