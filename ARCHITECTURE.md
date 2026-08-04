# ECHO//BREAK architecture
Static ES modules in `site/`; design coordinates 1600x900.

## Ownership (avoid cross-editing)
- Agent 1: `index.html`, `style.css`, `src/game.js` — runtime, input, loop, combat, integration.
- Agent 2: `src/presentation.js` — procedural visuals/VFX/audio.
- Agent 3: `src/content.js`, `src/ui.js` — level/enemy definitions, tutorial, HUD/menu.

## Presentation API
`createPresentation(canvas,ctx)` returns `{emit(type,x,y,opts),update(dt,state),render(ctx,state),audio}`.
Audio: `{unlock(),play(name,opts),setIntensity(v),setMuted(v)}`. Degrade silently.

## Content API
Export `LEVELS` array. Level: `{id,name,subtitle,duration,player:{x,y},walls:[{x,y,w,h}],spawns:[{t,type,x,y}],goal}`. Optional fields welcome. Enemy types expected: chaser, shooter, tank.

## UI API
`createUI(callbacks)` returns `{showTitle(),showBrief(level),showComplete(stats),showGameOver(stats),update(model),toast(text),setVisible(v)}`. callbacks: start/retry/next/toggleMute.
