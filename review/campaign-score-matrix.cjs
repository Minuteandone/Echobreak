const fs=require('fs'),vm=require('vm'),assert=require('assert');
const game=process.argv[2]||'site/src/game.js';
const src=fs.readFileSync(game,'utf8');
function functionSource(name){
  const start=src.indexOf(`function ${name}(`);assert(start>=0,`missing ${name}`);
  let brace=src.indexOf('{',start),depth=0,end=brace;
  for(;end<src.length;end++){if(src[end]==='{')depth++;else if(src[end]==='}'&&!--depth){end++;break}}
  return src.slice(start,end);
}
function callbackBody(name){
  const marker=`${name}:()=>{`,start=src.indexOf(marker);assert(start>=0,`missing ${name} callback`);
  let brace=start+marker.length-1,depth=0,end=brace;
  for(;end<src.length;end++){if(src[end]==='{')depth++;else if(src[end]==='}'&&!--depth)break}
  return src.slice(brace+1,end);
}
assert.strictEqual((src.match(/let campaignScore=0;/g)||[]).length,1);
assert(!/score:campaignScore\+score/.test(src),'HUD must stay per-operation');
assert(!/function stats\([^)]*\)[^{]*\{[^}]*campaignScore/.test(src),'stats must stay per-operation');
const timers=[],events=[];
const c={
  Math,mode:'play',levelIndex:0,campaignScore:0,score:0,loop:1,echoes:[],shots:0,hits:0,
  LEVELS:[{name:'ONE',maxLoops:6},{name:'TWO',maxLoops:7},{name:'THREE',maxLoops:8}],level:null,
  audio:{play(){}},flash:0,
  ui:{
    showOperationComplete:o=>events.push(['debrief',{...o}]),
    showComplete:o=>events.push(['complete',{...o}]),showBrief:o=>events.push(['brief',{...o}]),
    showTitle:()=>events.push(['title']),startRun(){},setObjective(){}
  },
  setTimeout:f=>{timers.push(f);return timers.length},
};
c.level=c.LEVELS[0];
c.setupLevel=function(){c.level=c.LEVELS[c.levelIndex];c.score=0;c.loop=1;c.echoes=[];c.shots=0;c.hits=0};
c.begin=function(){c.mode='play'};
vm.createContext(c);
vm.runInContext(`${functionSource('stats')}\n${functionSource('winLevel')}\nfunction retry(){${callbackBody('retry')}}\nfunction next(){${callbackBody('next')}}\nfunction quit(){${callbackBody('quit')}}`,c);
const flush=()=>{while(timers.length)timers.shift()()};
const setAttempt=(score,loop,echoes,shots,hits)=>Object.assign(c,{score,loop,echoes:Array(echoes).fill({}),shots,hits,mode:'play'});
// Operation 1: commits once; intermediate debrief remains operation-local.
setAttempt(111,6,2,10,5);c.winLevel();
assert.strictEqual(c.campaignScore,111);assert.deepStrictEqual(events.at(-1),['debrief',{score:111,loops:6,echoes:2,accuracy:50,title:'ONE',nextTitle:'TWO'}]);
c.winLevel();assert.strictEqual(c.campaignScore,111,'duplicate win farmed score');assert.strictEqual(timers.length,1,'duplicate win queued transition');flush();
// Operation 2 failed attempt and retry: neither failure nor retry commits/farms.
Object.assign(c,{mode:'over',score:999,loop:7,echoes:Array(6).fill({}),shots:40,hits:20});c.retry();
assert.strictEqual(c.campaignScore,111,'failure/retry farmed score');assert.strictEqual(c.score,0,'retry did not clear failed attempt');assert.strictEqual(c.mode,'play');
setAttempt(222,7,3,8,2);c.winLevel();assert.strictEqual(c.campaignScore,333);assert.deepStrictEqual(events.at(-1),['debrief',{score:222,loops:7,echoes:3,accuracy:25,title:'TWO',nextTitle:'THREE'}]);
c.winLevel();assert.strictEqual(c.campaignScore,333);flush();
// Operation 3: final score is exact three-operation sum; other stats remain operation-local.
setAttempt(333,8,4,5,4);c.winLevel();assert.strictEqual(c.campaignScore,666);c.winLevel();assert.strictEqual(c.campaignScore,666);flush();
assert.deepStrictEqual(events.at(-1),['complete',{score:666,loops:8,echoes:4,accuracy:80}]);
// Replay/new timeline reset executes the actual source callback body.
c.next();assert.strictEqual(c.campaignScore,0);assert.strictEqual(c.levelIndex,0);assert.strictEqual(c.mode,'brief');
// Quit-to-title reset executes the actual source callback body.
vm.runInContext('campaignScore=444',c);c.quit();assert.strictEqual(c.campaignScore,0);assert.strictEqual(c.levelIndex,0);assert.strictEqual(c.mode,'title');assert.deepStrictEqual(events.at(-1),['title']);
console.log('CAMPAIGN_SCORE_MATRIX_PASS commits=3 final=666 retry=clean duplicate=guarded resets=2');
