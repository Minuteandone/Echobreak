// Persistent campaign progress for ECHO//BREAK. Saves checkpoints between operations.
const SAVE_KEY='echobreak-progress-v1';
const base=()=>({version:1,unlockedWorlds:['fracture-zero'],completedLevels:[],bestScores:{},bestCampaignScores:{},checkpoint:null});
function storage(){try{return globalThis.localStorage}catch{return null}}
function normalize(data){const d=Object.assign(base(),data||{});d.unlockedWorlds=Array.isArray(d.unlockedWorlds)?d.unlockedWorlds:['fracture-zero'];if(!d.unlockedWorlds.includes('fracture-zero'))d.unlockedWorlds.unshift('fracture-zero');d.completedLevels=Array.isArray(d.completedLevels)?d.completedLevels:[];d.bestScores=d.bestScores&&typeof d.bestScores==='object'?d.bestScores:{};d.bestCampaignScores=d.bestCampaignScores&&typeof d.bestCampaignScores==='object'?d.bestCampaignScores:{};return d}
export const progress=(()=>{try{const raw=storage()?.getItem(SAVE_KEY);return normalize(raw?JSON.parse(raw):null)}catch{return base()}})();
export function saveProgress(){try{storage()?.setItem(SAVE_KEY,JSON.stringify(progress))}catch{}return progress}
export function isWorldUnlocked(id){return progress.unlockedWorlds.includes(id)}
export function unlockWorld(id){if(!progress.unlockedWorlds.includes(id)){progress.unlockedWorlds.push(id);saveProgress();return true}return false}
export function setCheckpoint(worldId,levelId,campaignScore=0,difficulty='standard'){progress.checkpoint={worldId,levelId,campaignScore:Math.max(0,Math.floor(campaignScore||0)),difficulty};saveProgress();return progress.checkpoint}
export function clearCheckpoint(){progress.checkpoint=null;saveProgress()}
export function recordLevel(worldId,levelId,score,difficulty='standard'){if(!progress.completedLevels.includes(levelId))progress.completedLevels.push(levelId);const key=`${levelId}:${difficulty}`,n=Math.max(0,Math.floor(score||0));progress.bestScores[key]=Math.max(progress.bestScores[key]||0,n);saveProgress();return n}
export function recordWorld(worldId,score,difficulty='standard'){const key=`${worldId}:${difficulty}`,n=Math.max(0,Math.floor(score||0));progress.bestCampaignScores[key]=Math.max(progress.bestCampaignScores[key]||0,n);saveProgress();return n}
export function bestWorldScore(worldId){let best=0;for(const [k,v] of Object.entries(progress.bestCampaignScores))if(k.startsWith(worldId+':'))best=Math.max(best,Number(v)||0);return best}
export function resetProgress(){Object.assign(progress,base());saveProgress();return progress}
