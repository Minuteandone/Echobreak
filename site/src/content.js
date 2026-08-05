/** Authored tactical content for ECHO//BREAK. Design space: 1600 x 900. */
export const ENEMY_TYPES={
 chaser:{name:'Pursuer',health:36,speed:145,radius:16,damage:14,color:'#ff3bd4',score:120,behavior:'seek',telegraph:.32},
 shooter:{name:'Lancer',health:48,speed:78,radius:18,damage:10,color:'#ffb347',score:220,behavior:'orbit',range:380,fireRate:1.45,projectileSpeed:310,telegraph:.58},
 tank:{name:'Warden',health:180,speed:42,radius:30,damage:24,color:'#ff385f',score:750,behavior:'charge',fireRate:2.6,telegraph:.85},
 splitter:{name:'Prism',health:65,speed:95,radius:21,damage:12,color:'#9b7cff',score:300,behavior:'split',splitsInto:2,telegraph:.45}
};
const wall=(x,y,w,h,kind='solid')=>({x,y,w,h,kind});
const spawn=(t,type,x,y,extra={})=>({t,type,x,y,...extra});
export const LEVELS=[
 {id:'glasshouse',name:'The Glasshouse',subtitle:'Learn to fight beside what you were.',codename:'OPERATION GLASSHOUSE',description:'A sealed memory vault is flooding with hostile signal. Record a clean combat path, then let your echo finish what you began.',duration:12,maxLoops:6,player:{x:800,y:700},palette:{floor:'#071525',accent:'#39f6ff',hazard:'#ff3bd4'},
  objectives:['Record your first combat echo','Break the three signal anchors','Enter the extraction field'],tutorials:[{at:0,id:'move',title:'Move / Aim',body:'Keep moving. The fracture remembers everything.',keys:['WASD','MOUSE']},{at:2.5,id:'fire',title:'Write the timeline',body:'Every shot returns with your echo next loop.',keys:['LMB']},{loop:2,id:'echo',title:'Fight beside yourself',body:'Your previous path now repeats in perfect synchrony.',keys:['R']}],
  walls:[wall(220,155,1160,28),wall(220,717,1160,28),wall(220,183,28,190),wall(220,525,28,192),wall(1352,183,28,190),wall(1352,525,28,192),wall(525,330,28,245),wall(1047,330,28,245),wall(670,435,260,28,'cover')],
  spawns:[spawn(.8,'chaser',350,275),spawn(3.2,'chaser',1250,275),spawn(6.1,'shooter',800,250),spawn(8.6,'chaser',350,625),spawn(9.4,'chaser',1250,625)],goal:{type:'kills',count:5,x:800,y:240,radius:65},parScore:4200},
 {id:'crossfire',name:'Parallax Junction',subtitle:'Be in two places at the same time.',codename:'OPERATION PARALLAX',description:'Twin resonance locks must remain charged together. Divide the work across timelines while Lancers turn every corridor into a crossfire.',duration:12,maxLoops:7,player:{x:800,y:760},palette:{floor:'#0a1022',accent:'#ff3bd4',hazard:'#ffb347'},
  objectives:['Charge the west resonance lock','Charge the east resonance lock','Collapse the central relay'],tutorials:[{at:0,id:'dash',title:'Phase dash',body:'Break through a firing lane without breaking your recording.',keys:['SPACE']},{loop:2,id:'locks',title:'Synchronized locks',body:'Stand on one plate. Your echo will hold it on the next loop.',keys:['WASD']}],
  walls:[wall(120,100,1360,25),wall(120,775,1360,25),wall(120,125,25,675),wall(1455,125,25,675),wall(430,125,30,240),wall(430,535,30,240),wall(1140,125,30,240),wall(1140,535,30,240),wall(655,295,290,30),wall(655,575,290,30),wall(785,325,30,250,'relay')],
  switches:[{id:'west',x:275,y:450,radius:62,color:'#39f6ff'},{id:'east',x:1325,y:450,radius:62,color:'#ff3bd4'}],spawns:[spawn(.5,'shooter',260,220),spawn(.5,'shooter',1340,220),spawn(2.5,'chaser',800,190),spawn(4.8,'chaser',260,675),spawn(4.8,'chaser',1340,675),spawn(7.2,'shooter',800,450),spawn(9.4,'tank',800,180,{relay:true})],goal:{type:'switches',ids:['west','east'],hold:1.6,thenKills:1},parScore:7200},
 {id:'zero-hour',name:'Zero Hour',subtitle:'Six timelines enter. One timeline leaves.',codename:'OPERATION ECHOBREAK',description:'The Warden has found the source thread. Build an army of selves, survive the collapse, and erase it from every possible history.',duration:12,maxLoops:8,player:{x:800,y:720},palette:{floor:'#10091d',accent:'#39f6ff',hazard:'#ff385f'},
  objectives:['Survive the convergence','Shatter the Warden shield','Deliver the final shot'],tutorials:[{at:0,id:'reset',title:'Command the fracture',body:'Reset early to preserve a perfect attack route.',keys:['R']},{loop:4,id:'army',title:'Echo convergence',body:'Cross your own firing lines. Overwhelm the Warden together.',keys:['LMB','SPACE']}],
  walls:[wall(170,90,1260,26),wall(170,784,1260,26),wall(170,116,26,694),wall(1404,116,26,694),wall(350,255,185,26),wall(350,620,185,26),wall(1065,255,185,26),wall(1065,620,185,26),wall(570,405,110,26,'cover'),wall(920,405,110,26,'cover'),wall(787,180,26,145),wall(787,555,26,145)],
  spawns:[spawn(.2,'tank',800,210,{boss:true,shield:6}),spawn(1.5,'chaser',250,200),spawn(1.5,'chaser',1350,200),spawn(3.8,'shooter',270,670),spawn(3.8,'shooter',1330,670),spawn(6.2,'splitter',800,450),spawn(8.4,'chaser',240,450),spawn(8.4,'chaser',1360,450),spawn(10,'shooter',800,740)],goal:{type:'boss',target:'tank',shieldRequiresEchoes:3},parScore:12500}
];
export function getLevel(id){return LEVELS.find(l=>l.id===id)||LEVELS[0]}
export function getEnemyType(id){return ENEMY_TYPES[id]||ENEMY_TYPES.chaser}
export default LEVELS;
