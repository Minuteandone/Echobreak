import EchoUI,{UI_SAMPLE_LEVEL} from '../ui.js';
import {enhanceCampaignUI} from './campaign-ui.js';
/** Contract adapter; richer EchoUI methods remain available as `raw`. */
export function createUI(callbacks={}){
 const ui=enhanceCampaignUI(new EchoUI({onStart:callbacks.start,onContinue:callbacks.continue,onWorlds:callbacks.worlds,onSelectWorld:callbacks.selectWorld,onRestart:callbacks.retry,onNext:callbacks.next,onQuit:callbacks.quit,onResume:callbacks.resume,onPause:callbacks.pause,onSettings:s=>callbacks.settings?.(s),onMute:callbacks.toggleMute}));
 return {raw:ui,showTitle:data=>ui.showTitle(data),showWorldSelect:worlds=>ui.showWorldSelect(worlds),showBrief:level=>ui.showBriefing(level||UI_SAMPLE_LEVEL),showComplete:stats=>ui.showVictory(stats),showGameOver:stats=>ui.showGameOver(stats),update:model=>ui.update(model),toast:(text,type)=>ui.showToast(text,type),setVisible:v=>ui.host.style.display=v?'':'none',startRun:c=>ui.startRun(c),showTutorial:(...a)=>ui.showTutorial(...a),showLoopReset:d=>ui.showLoopReset(d),showOperationComplete:d=>ui.showOperationComplete(d),showPause:()=>ui.showPause(),hidePause:()=>ui.hidePause(),setObjective:(...a)=>ui.setObjective(...a)};
}
export {EchoUI,UI_SAMPLE_LEVEL};
