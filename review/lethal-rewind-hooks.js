function snap(){return {tick,record:record.length,loop,hp:player.hp,inv:player.inv,mode,echoes:echoes.length,bullets:bullets.length,enemies:enemies.length,particles:particles.length,floaters:floaters.length,spawned:spawned.size,lastUI:globalThis.__lastUI}}
function hostile(d=13){return {x:player.x,y:player.y,vx:0,vy:0,r:5,life:3,friendly:false,damage:d}}
function foe(d=14){return {x:player.x,y:player.y,vx:0,vy:0,type:'chaser',r:20,hp:10,maxHp:10,speed:0,damage:d,color:'#f00',score:1,fire:9,phase:0,boss:false,relay:false,dead:false,spawn:-1}}
function prep(t=30,hp=1){setupLevel();begin();tick=t;player.hp=hp;globalThis.__lastUI=undefined}
globalThis.__hooks={
 bullet(){prep();bullets.push(hostile());fixed();return snap()},
 contact(){prep();enemies.push(foe());fixed();return snap()},
 multiBullet(){prep();bullets.push(hostile(),hostile(60));fixed();return snap()},
 multiContact(){prep();enemies.push(foe(),foe(60));fixed();return snap()},
 crossSources(){prep();enemies.push(foe());bullets.push(hostile(60));fixed();return snap()},
 nonlethal(){prep(30,50);bullets.push(hostile());fixed();return snap()},
 invulnerable(){prep(30,50);player.inv=1;bullets.push(hostile());fixed();return snap()},
 earlyBullet(){prep(10);bullets.push(hostile(),hostile(60));fixed();return snap()},
 earlyContact(){prep(10);enemies.push(foe(),foe(60));fixed();return snap()},
 manual(){prep();rewind(true);return snap()},
 timer(){prep(loopTicks-1,100);fixed();return snap()},
 gameOver(){prep();loop=level.maxLoops;bullets.push(hostile());fixed();return snap()},
 alignment(){prep();record=Array.from({length:30},(_,i)=>({x:i,y:i,aim:0,shot:false}));bullets.push(hostile());fixed();const sealed={tick,record:record.length,loop,hp:player.hp,mode,echoes:echoes.length,frames:echoes[0]?.frames.length,lastFrame:echoes[0]?.frames.at(-1),lastUI:globalThis.__lastUI};fixed();return {sealed,next:snap(),framesAfter:echoes[0]?.frames.length}}
};
