const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./local-BUCdRf0W.js","./monaco-D7SiFys1.js","./monaco-GL-q52Lm.css","./github-DDn50CN_.js","./react-Bt4lNSbZ.js"])))=>i.map(i=>d[i]);
import{r as v,j as i,c as Aa}from"./react-Bt4lNSbZ.js";import{_ as Y,W as _a,a as Ca,b as Ta,c as Na,d as La,e as tt,K as Pa,f as $a}from"./monaco-D7SiFys1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=a(r);fetch(r.href,s)}})();const Da={ts:"typescript",tsx:"typescript",mts:"typescript",cts:"typescript",js:"javascript",jsx:"javascript",mjs:"javascript",cjs:"javascript",json:"json",jsonc:"json",html:"html",htm:"html",css:"css",scss:"scss",less:"less",md:"markdown",markdown:"markdown",py:"python",rb:"ruby",go:"go",rs:"rust",java:"java",kt:"kotlin",swift:"swift",c:"c",h:"c",cpp:"cpp",cc:"cpp",hpp:"cpp",cs:"csharp",php:"php",sql:"sql",sh:"shell",bash:"shell",zsh:"shell",ps1:"powershell",bat:"bat",cmd:"bat",yml:"yaml",yaml:"yaml",toml:"ini",ini:"ini",xml:"xml",svg:"xml",vue:"html",dockerfile:"dockerfile"},vt={dockerfile:"dockerfile",makefile:"makefile",".gitignore":"ini",".env":"ini"};function Ma(e){const a=(e.split(/[\\/]/).pop()??"").toLowerCase();if(vt[a])return vt[a];const n=a.includes(".")?a.slice(a.lastIndexOf(".")+1):"";return Da[n]??"plaintext"}const Ia=new Set(["png","jpg","jpeg","gif","webp","ico","bmp","avif","mp3","wav","ogg","mp4","mov","webm","avi","zip","gz","tar","rar","7z","pdf","exe","dll","so","dylib","woff","woff2","ttf","otf","eot","class","jar","pyc","wasm"]);function Te(e){const t=e.toLowerCase().split(".").pop()??"";return Ia.has(t)}function We(e){const t=e/255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4}function wt(e){const t=e.replace("#",""),a=t.length===3?t.split("").map(o=>o+o).join(""):t,n=parseInt(a.slice(0,2),16),r=parseInt(a.slice(2,4),16),s=parseInt(a.slice(4,6),16);return .2126*We(n)+.7152*We(r)+.0722*We(s)}function Ra(e,t){const a=wt(e),n=wt(t);return(Math.max(a,n)+.05)/(Math.min(a,n)+.05)}const T=(e,t,a,n,r,s)=>({id:e,name:t,mood:a,scheme:n,colors:r,notes:s,fonts:{display:"",body:"",mono:"",scale:1.25},radius:"",shadow:"",motion:""}),Be=[T("midnight-ink","Midnight Ink","minimal","dark",{bg:"#0d1117",surface:"#161b22",surfaceAlt:"#1c2430",ink:"#e6edf3",inkDim:"#9aa7b4",line:"#263041",accent:"#4cc2ff",accentInk:"#04202e",accent2:"#ffb86b",good:"#3fb950",bad:"#f85149"},"Deep blue-black with one cold accent. Quiet, technical, gets out of the way."),T("paper-press","Paper Press","editorial","light",{bg:"#f7f4ec",surface:"#ffffff",surfaceAlt:"#efe9dc",ink:"#1a1714",inkDim:"#5d564c",line:"#ded5c4",accent:"#a8321f",accentInk:"#fff6f2",accent2:"#2f5d50",good:"#2f6b3a",bad:"#a8321f"},"Warm paper, printer's red, ink black. Reads like something that was set rather than typed."),T("neon-grid","Neon Grid","neon","dark",{bg:"#07060f",surface:"#120e26",surfaceAlt:"#1b1440",ink:"#f2eaff",inkDim:"#a99cd0",line:"#2f2560",accent:"#ff2e88",accentInk:"#14000a",accent2:"#22e7ff",good:"#3ce6a2",bad:"#ff4d4d"},"Hot pink on near-black with a cyan second. Arcade cabinet at 2am."),T("forest-floor","Forest Floor","nature","light",{bg:"#f4f6f0",surface:"#ffffff",surfaceAlt:"#e7ece0",ink:"#16211a",inkDim:"#4d5a4f",line:"#d2dbc9",accent:"#2f6f4e",accentInk:"#f2fbf6",accent2:"#b4671f",good:"#2f6f4e",bad:"#a33a2a"},"Moss and bark on a pale green ground. Calm without being cold."),T("terminal-green","Terminal","retro","dark",{bg:"#06110a",surface:"#0b1a10",surfaceAlt:"#102417",ink:"#c9f5d5",inkDim:"#7bbd90",line:"#1c3a28",accent:"#38e07b",accentInk:"#04170c",accent2:"#f0d264",good:"#38e07b",bad:"#ff6b5e"},"Phosphor green on black. Monospaced everything."),T("sunset-club","Sunset Club","playful","dark",{bg:"#1a0f1e",surface:"#26152c",surfaceAlt:"#331c3a",ink:"#ffeef7",inkDim:"#c4a3bb",line:"#442a4c",accent:"#ff7a4d",accentInk:"#2a0c02",accent2:"#ffd166",good:"#59d999",bad:"#ff5470"},"Aubergine night, coral and gold. Warm and a bit loud."),T("bone-black","Bone & Black","brutal","light",{bg:"#f2f0eb",surface:"#ffffff",surfaceAlt:"#e4e1d8",ink:"#101010",inkDim:"#4a4a48",line:"#1a1a1a",accent:"#ff3b00",accentInk:"#1a0500",accent2:"#0026ff",good:"#00794f",bad:"#d10000"},"Hard black rules, bone paper, one screaming orange. Everything square."),T("cobalt-corp","Cobalt","corporate","light",{bg:"#f6f8fb",surface:"#ffffff",surfaceAlt:"#e9eef6",ink:"#101828",inkDim:"#4a5568",line:"#d5dde9",accent:"#1f4fd8",accentInk:"#f2f6ff",accent2:"#0a8f7a",good:"#12805c",bad:"#c0392b"},"Trustworthy blue on cool white. The one that looks like a company."),T("deep-sea","Deep Sea","space","dark",{bg:"#04121c",surface:"#0a1d2b",surfaceAlt:"#10293a",ink:"#e2f1f8",inkDim:"#93b0c0",line:"#1d3a4d",accent:"#37c9c2",accentInk:"#032120",accent2:"#f2a65a",good:"#3fd0a0",bad:"#f4695f"},"Submarine blue with a teal glow. Deep, wide, quiet."),T("rose-ink","Rose Ink","elegant","light",{bg:"#fdf7f7",surface:"#ffffff",surfaceAlt:"#f6e9ea",ink:"#21161a",inkDim:"#5d4a50",line:"#e6d2d4",accent:"#9c2b4e",accentInk:"#fff2f5",accent2:"#3f5d75",good:"#2e7a5b",bad:"#a52a2a"},"Claret on blush. Serif, generous margins, nothing hurried."),T("amber-cabin","Amber Cabin","warm","dark",{bg:"#17120d",surface:"#221a12",surfaceAlt:"#2e2318",ink:"#f6ecdd",inkDim:"#bda88c",line:"#3c2f21",accent:"#e0912f",accentInk:"#1e1204",accent2:"#7fa96b",good:"#7fa96b",bad:"#d1583f"},"Lamplight and old wood. Dark, but not cold."),T("slate-mono","Slate","minimal","light",{bg:"#ffffff",surface:"#fafafa",surfaceAlt:"#f0f0f0",ink:"#111111",inkDim:"#565656",line:"#e2e2e2",accent:"#111111",accentInk:"#ffffff",accent2:"#767676",good:"#17734a",bad:"#b3261e"},"No colour at all. Everything carried by type, weight and space."),T("violet-lab","Violet Lab","space","dark",{bg:"#0f0b1a",surface:"#191330",surfaceAlt:"#221a3f",ink:"#ece7ff",inkDim:"#a79cc9",line:"#2e2452",accent:"#9d7bff",accentInk:"#100626",accent2:"#52e0c4",good:"#4ad9a5",bad:"#ff6188"},"Ultraviolet with a mint second. Modern, slightly clinical."),T("citrus-pop","Citrus Pop","playful","light",{bg:"#fffaf0",surface:"#ffffff",surfaceAlt:"#fdf0d5",ink:"#201a12",inkDim:"#5b5041",line:"#efe0c4",accent:"#e2571f",accentInk:"#2a0d02",accent2:"#1f7a8c",good:"#2b7a3f",bad:"#c1272d"},"Cream, blood orange, a teal counterweight. Cheerful without being childish."),T("ice-blue","Ice","minimal","light",{bg:"#f4f8fa",surface:"#ffffff",surfaceAlt:"#e6eef3",ink:"#0e1a20",inkDim:"#4a5b64",line:"#d3e0e7",accent:"#0f6fa8",accentInk:"#f0f8ff",accent2:"#c2571a",good:"#16794f",bad:"#b62d2d"},"Cold and clear, one steel blue. Reads as precise."),T("crt-amber","CRT Amber","retro","dark",{bg:"#100b04",surface:"#1a1208",surfaceAlt:"#241a0d",ink:"#ffcf7a",inkDim:"#c29a52",line:"#33260f",accent:"#ffb000",accentInk:"#1a1000",accent2:"#7fd6ff",good:"#8fd672",bad:"#ff6a4d"},"Amber monitor. Scan lines optional, glow mandatory."),T("plum-velvet","Plum Velvet","elegant","dark",{bg:"#14101a",surface:"#1f1829",surfaceAlt:"#2b2138",ink:"#f0e9f5",inkDim:"#b3a4bf",line:"#392c48",accent:"#c9a227",accentInk:"#1a1400",accent2:"#7c6bd6",good:"#56c08a",bad:"#e0576f"},"Dark plum and old gold. Expensive-looking, restrained."),T("paper-blue","Paper Blue","editorial","light",{bg:"#fbfaf7",surface:"#ffffff",surfaceAlt:"#f0eee7",ink:"#17181a",inkDim:"#55585e",line:"#e0ded6",accent:"#1d4ed8",accentInk:"#f5f8ff",accent2:"#b45309",good:"#15803d",bad:"#b91c1c"},"Off-white stock, link blue, a rusty second. Made for reading."),T("jungle-night","Jungle Night","nature","dark",{bg:"#0a1410",surface:"#112019",surfaceAlt:"#182c22",ink:"#e4f2e8",inkDim:"#9ab5a5",line:"#234135",accent:"#5fd08c",accentInk:"#04170d",accent2:"#e8b84b",good:"#5fd08c",bad:"#ef6b5b"},"Dense green dark with a leaf accent. Alive rather than sterile."),T("sand-stone","Sandstone","warm","light",{bg:"#f8f4ee",surface:"#ffffff",surfaceAlt:"#eee7dc",ink:"#1d1a15",inkDim:"#57503f",line:"#ddd4c3",accent:"#875a31",accentInk:"#fff8f0",accent2:"#3a6157",good:"#3f7a52",bad:"#a3402f"},"Desert stone and clay. Soft, tactile, unhurried."),T("magenta-noir","Magenta Noir","brutal","dark",{bg:"#0b0b0d",surface:"#141418",surfaceAlt:"#1d1d22",ink:"#f5f5f7",inkDim:"#a0a0a8",line:"#2b2b33",accent:"#ff0059",accentInk:"#1a0009",accent2:"#00e0b8",good:"#00c281",bad:"#ff4747"},"Neutral black, one violent magenta. Heavy type, hard edges."),T("arcade-blue","Arcade Blue","retro","dark",{bg:"#081028",surface:"#0e1a3d",surfaceAlt:"#142450",ink:"#eaf1ff",inkDim:"#a2b3d6",line:"#22346b",accent:"#ffd400",accentInk:"#191400",accent2:"#ff5c8a",good:"#4ade80",bad:"#ff5c5c"},"Cabinet blue and coin-slot yellow. Loud on purpose.")],Oe=[{id:"grotesque",display:'"Helvetica Neue", Helvetica, Arial, sans-serif',body:'"Helvetica Neue", Helvetica, Arial, sans-serif',mono:'ui-monospace, "SF Mono", Menlo, Consolas, monospace',moods:["minimal","corporate","brutal"],note:"One neutral grotesque throughout, separated by weight and size only."},{id:"oldstyle",display:'Georgia, "Iowan Old Style", "Times New Roman", serif',body:'Georgia, "Iowan Old Style", "Times New Roman", serif',mono:"ui-monospace, Menlo, Consolas, monospace",moods:["editorial","elegant","warm"],note:"Old-style serif for everything — the most readable thing available without a download."},{id:"serif-sans",display:'Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif',body:'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',mono:"ui-monospace, Menlo, Consolas, monospace",moods:["elegant","editorial","nature"],note:"Serif headings over a system sans body — classic magazine pairing."},{id:"geometric",display:'Futura, "Century Gothic", "Trebuchet MS", sans-serif',body:'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',mono:"ui-monospace, Menlo, Consolas, monospace",moods:["playful","minimal","space"],note:"Geometric display, plain body. Friendly without being soft."},{id:"monospace",display:'ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace',body:'ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace',mono:"ui-monospace, Menlo, Consolas, monospace",moods:["retro","neon","brutal"],note:"Monospaced throughout. Everything lines up; it reads as a machine."},{id:"impact",display:'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',body:'"Helvetica Neue", Helvetica, Arial, sans-serif',mono:"ui-monospace, Menlo, Consolas, monospace",moods:["brutal","retro","playful"],note:"Condensed poster display against a plain body. Very loud headings."},{id:"humanist",display:'Optima, Candara, "Gill Sans", "Gill Sans MT", sans-serif',body:'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',mono:"ui-monospace, Menlo, Consolas, monospace",moods:["nature","warm","elegant"],note:"Humanist display with calligraphic bones. Warm without being twee."},{id:"slab",display:'Rockwell, "Roboto Slab", Georgia, serif',body:'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',mono:"ui-monospace, Menlo, Consolas, monospace",moods:["warm","corporate","playful"],note:"Slab headings, plain body. Solid and a bit mechanical."},{id:"system",display:'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',body:'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',mono:"ui-monospace, Menlo, Consolas, monospace",moods:["minimal","corporate","space"],note:"The native interface face. Invisible, fast, correct on every device."}];function za(e){let t=2166136261;for(let a=0;a<e.length;a++)t^=e.charCodeAt(a),t=Math.imul(t,16777619)>>>0;return t>>>0}const xt=["0px","2px","4px","8px","14px","20px"],He=["none","0 1px 2px rgba(0,0,0,.14)","0 2px 8px rgba(0,0,0,.18)","0 8px 30px rgba(0,0,0,.24)","4px 4px 0 var(--line)"];function Wa(e){const t=za(`${e.raw}|${e.archetype}`),a=e.mood[0]??Ba(e);let n=Be.filter(u=>u.mood===a);if(e.constraints.scheme){const u=n.filter(d=>d.scheme===e.constraints.scheme);u.length&&(n=u)}n.length||(n=e.constraints.scheme?Be.filter(u=>u.scheme===e.constraints.scheme):Be.slice());const r=n[t%n.length],s=Oe.filter(u=>u.moods.includes(r.mood)),o=(s.length?s:Oe)[(t>>>8)%(s.length||Oe.length)],c=r.mood==="brutal"||r.mood==="retro"?xt[(t>>>16)%2]:xt[2+(t>>>16)%4],l=r.mood==="brutal"?He[4]:r.mood==="minimal"?He[(t>>>20)%2]:He[1+(t>>>20)%3];return{...r,fonts:{display:o.display,body:o.body,mono:o.mono,scale:r.mood==="editorial"?1.333:1.25},radius:c,shadow:l,motion:"cubic-bezier(.2,.8,.2,1)",notes:`${r.notes} ${o.note}`}}function Ba(e){return e.kind==="game"?e.archetype==="rhythm"||e.archetype==="shooter"?"neon":"retro":e.kind==="viz"?"corporate":e.kind==="site"?"editorial":"minimal"}function $t(e){const t=e.colors;return`:root {
  --bg: ${t.bg};
  --surface: ${t.surface};
  --surface-alt: ${t.surfaceAlt};
  --ink: ${t.ink};
  --ink-dim: ${t.inkDim};
  --line: ${t.line};
  --accent: ${t.accent};
  --accent-ink: ${t.accentInk};
  --accent-2: ${t.accent2};
  --good: ${t.good};
  --bad: ${t.bad};

  --font-display: ${e.fonts.display};
  --font-body: ${e.fonts.body};
  --font-mono: ${e.fonts.mono};

  --step-0: 1rem;
  --step-1: ${(e.fonts.scale**1).toFixed(3)}rem;
  --step-2: ${(e.fonts.scale**2).toFixed(3)}rem;
  --step-3: ${(e.fonts.scale**3).toFixed(3)}rem;
  --step-4: ${(e.fonts.scale**4).toFixed(3)}rem;

  --space: 8px;
  --radius: ${e.radius};
  --shadow: ${e.shadow};
  --motion: 180ms ${e.motion};
}`}function Oa(e){return`${$t(e)}

*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }

html { -webkit-text-size-adjust: 100%; }

body {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

h1, h2, h3, h4 { font-family: var(--font-display); line-height: 1.15; font-weight: 700; }
h1 { font-size: var(--step-4); letter-spacing: -0.02em; }
h2 { font-size: var(--step-3); letter-spacing: -0.01em; }
h3 { font-size: var(--step-2); }
p { max-width: 68ch; }

a { color: var(--accent); text-underline-offset: 3px; }

:where(button, [role="button"], a, input, select, textarea, [tabindex]):focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
  touch-action: manipulation;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 20px;
  border-radius: var(--radius);
  background: var(--accent);
  color: var(--accent-ink);
  font-weight: 700;
  box-shadow: var(--shadow);
  transition: transform var(--motion), filter var(--motion);
}
.btn:hover { filter: brightness(1.08); }
.btn:active { transform: translateY(1px); }
.btn--ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--line);
  box-shadow: none;
}

.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: calc(var(--space) * 3);
  box-shadow: var(--shadow);
}

.stack > * + * { margin-top: calc(var(--space) * 2); }
.wrap { width: min(100% - 32px, 1120px); margin-inline: auto; }
.muted { color: var(--ink-dim); }
.visually-hidden {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}`}const Ha=["The project must actually run when opened. No missing files, no references to scripts or stylesheets that do not exist, no half-written functions.",'Real content everywhere. No lorem ipsum, no "TODO", no "coming soon" standing in for a feature that was asked for.',"It must work on a phone: a viewport meta tag, a layout that reflows below 420 px, and touch input wherever there is mouse or keyboard input.","Text must be legible — body text at least 16 px, and at least 4.5:1 contrast against its background.","Never put user-supplied text into innerHTML. Use textContent, or escape it.","Keyboard focus must be visible on anything interactive."],Ga=["Silent failure: an exception in an event handler kills everything after it and the page just sits there. Guard anything that can be absent, and check the console before declaring victory.","Layout collapse on a narrow screen: fixed pixel widths, a grid that never becomes one column, a canvas wider than the viewport.",'The "generic AI look": Inter on white, a purple-to-blue gradient, three rounded cards with emoji. Choose a real palette and a real typeface with a reason behind them.'],Dt=[{id:"snake",label:"Snake",kind:"game",family:"arcade",triggers:["snake game","snake","nokia game","worm game"],summary:"A grid game where a growing line must eat without hitting itself or the walls.",mustHave:["A fixed grid, drawn to a square canvas that scales with the viewport.","A movement tick independent of the render frame, so speed is the same on a 60 Hz and a 144 Hz screen.","Food that never appears underneath the snake.","Growth by appending a segment, not by teleporting the tail.","Score, a persisted high score, a game-over screen and a restart that fully resets state.","Swipe controls as well as arrow keys and WASD."],pitfalls:[{id:"reverse-into-self",symptom:"Pressing left then up in one tick kills you instantly for no visible reason.",fix:"Queue direction changes and validate each against the direction actually applied last tick, not against the queued one. Reject only the exact opposite."},{id:"speed-by-frame",symptom:"The snake is unplayably fast on a good monitor.",fix:"Accumulate elapsed milliseconds and step the simulation when the accumulator passes the tick interval. Never move one cell per animation frame."},{id:"food-under-snake",symptom:"Food appears somewhere unreachable or invisible.",fix:"Build the list of free cells and pick from it, rather than picking at random and re-rolling."}],tuning:["Grid 22×22. Cell size = canvas size / 22, canvas square and sized to min(viewport width - 32, 560).","Tick 130 ms at the start, minus 4 ms per food eaten, floor 65 ms. That is roughly twice the starting speed at 16 apples — noticeable but survivable.","Start length 4, in the middle, moving right, with the first food at least 5 cells away.","Swipe threshold 24 px so a tap is not read as a swipe."],checks:["game.loop","game.delta-time","game.touch-input","game.lose-state","game.restart","game.score","game.key-scroll"]},{id:"breakout",label:"Brick breaker",kind:"game",family:"arcade",triggers:["breakout","brick breaker","brick game","arkanoid","block breaker","paddle and ball"],summary:"A paddle bounces a ball into a wall of bricks until they are gone.",mustHave:["Paddle control by mouse, touch drag and arrow keys, all three.","Bricks in rows with distinct colours and a per-row score value.","Lives, a win state when the last brick falls, and a loss when the last life is gone.","Ball speed that rises slowly, with a hard cap."],pitfalls:[{id:"flat-bounce",symptom:"The ball ends up bouncing straight up and down forever and the game plays itself.",fix:"Reflect off the paddle by contact point: the horizontal component comes from where on the paddle it hit, not from negating velocity. Clamp the resulting angle away from vertical and horizontal."},{id:"tunnelling",symptom:"At speed the ball passes through bricks and walls.",fix:"Step the ball in sub-steps no larger than half the ball radius per iteration, and resolve collisions each sub-step."},{id:"stuck-in-brick",symptom:"The ball jitters inside a brick, destroying a column instantly.",fix:"On a hit, push the ball out along the axis of least penetration before reversing that axis only."}],tuning:["Field 640×480 logical units, scaled to fit. Paddle 110×14, so about 17% of the width — wide enough to be fair.","Ball radius 7, launch speed 300 px/s at a random angle between 35° and 55° from horizontal, alternating left and right.","Speed × 1.03 per row fully cleared, capped at 520 px/s.","Bounce angle from paddle: offset = (ballX - paddleCentre) / (paddleWidth / 2), clamped to ±1, then angle = offset × 60°.","5 rows × 9 bricks, top row worth 50 down to 10 for the bottom."],checks:["game.loop","game.delta-time","game.touch-input","game.lose-state","game.restart","game.score","game.collision"]},{id:"pong",label:"Pong",kind:"game",family:"arcade",triggers:["pong","table tennis game","ping pong game","two paddle game"],summary:"Two paddles, one ball, first to a target score.",mustHave:["A computer opponent that can be beaten, and an optional two-player mode on one keyboard.","Serve from the centre towards whoever last conceded, after a short pause.","Score display and a match end at 7 points."],pitfalls:[{id:"unbeatable-ai",symptom:"The computer paddle tracks the ball perfectly and the game is pointless.",fix:"Cap the AI paddle speed below the ball's maximum vertical speed and only let it track once the ball is travelling towards it. Add a small aim error that grows with rally length."},{id:"no-english",symptom:"Every rally is identical because the ball always leaves at the same angle.",fix:"Vary the exit angle by contact point on the paddle, exactly as in brick breaker."}],tuning:["Field 720×440. Paddles 12×86, ball 9 square. Ball 340 px/s at serve, +4% per paddle hit, cap 620.","AI paddle max speed 380 px/s with ±18 px of aim error, so a fast angled shot beats it.","Serve delay 700 ms with a visible countdown."],checks:["game.loop","game.delta-time","game.touch-input","game.restart","game.score","game.collision"]},{id:"flappy",label:"Tap-to-fly",kind:"game",family:"arcade",triggers:["flappy","flappy bird","tap to fly","helicopter game","jetpack game"],summary:"One-button flight through gaps in an endless scrolling wall.",mustHave:["One input — tap, click and space all do the same thing.",'A "ready" state before the first pipe so the player is not killed while reading the screen.',"Score on passing a gap, persisted best, instant restart."],pitfalls:[{id:"instant-death",symptom:"The first obstacle arrives before the player has understood the controls.",fix:"Do not start scrolling until the first input, and place the first gap at x = width + 200."},{id:"impossible-gap",symptom:"Consecutive gaps are at opposite extremes, so no flight path connects them.",fix:"Clamp each gap centre to within 140 px of the previous one."}],tuning:["Field 400×600. Gap 155 px tall — that is 26% of the height, forgiving but not trivial.","Gravity 1500 px/s², flap impulse -430 px/s, terminal fall 700 px/s.","Scroll 150 px/s, pipes every 230 px of distance, so roughly 1.5 s between them.","Player hit box 70% of the drawn sprite, so near misses read as misses."],checks:["game.loop","game.delta-time","game.touch-input","game.lose-state","game.restart","game.score","game.spawn-offscreen"]},{id:"runner",label:"Endless runner",kind:"game",family:"arcade",triggers:["endless runner","runner game","dino game","jumping game","obstacle game","dodge game"],summary:"Automatic forward movement, obstacles to jump or duck, distance as score.",mustHave:["Jump with a variable height by hold length, and a duck.","Ground, parallax background, and a run cycle or at least a squash on landing.","Distance score, speed that climbs, high score kept."],pitfalls:[{id:"unjumpable-gap",symptom:"Two obstacles so close together that no jump clears both.",fix:"Compute the jump arc length from the physics constants and enforce a minimum spacing of 1.6× that. Do not pick spacing by feel."},{id:"spawn-on-player",symptom:"Obstacles appear already next to the player.",fix:"Spawn at x = width + 40 only. Never inside the visible field."},{id:"floaty-jump",symptom:"The jump feels like the moon.",fix:"Use a higher gravity on the way down than the way up (about 1.7×). It is not physical and it feels far better."}],tuning:["Ground at 78% of height. Gravity 2200 px/s² rising, 3700 falling. Jump impulse -760 px/s → about 0.62 s airborne, 165 px of clearance.","Start speed 300 px/s, +6 px/s per second, cap 720. At 300 px/s an obstacle spawned off the right edge of an 800 px field is visible for 2.8 s.","Minimum obstacle spacing = speed × 0.75 s, never less than 190 px."],checks:["game.loop","game.delta-time","game.touch-input","game.lose-state","game.restart","game.score","game.spawn-offscreen","game.difficulty"]},{id:"shooter",label:"Space shooter",kind:"game",family:"arcade",triggers:["space invaders","shooter","shoot em up","spaceship game","asteroids","galaga","alien game"],summary:"Move, shoot, survive waves coming from the far edge.",mustHave:["Movement by keyboard and by dragging a finger, with firing automatic on touch.","Enemy waves that get harder, an explosion effect, lives or shields.","Bullet pooling rather than unbounded array growth."],pitfalls:[{id:"spawn-inside-view",symptom:"Enemies appear in the middle of the screen already on top of the player.",fix:"Spawn above y = -60 and let them travel in. The player must see them coming for at least two seconds."},{id:"bullet-hose",symptom:"Holding fire fills the screen and removes all difficulty.",fix:"Cooldown between shots and a cap on simultaneous player bullets."},{id:"unfair-hitbox",symptom:"Deaths that look like near misses.",fix:"Player collision radius at 55–65% of the drawn ship; enemy radius at 100%. Generous to the player, honest to the enemy."}],tuning:["Field 480×720. Player 34 px wide, hit radius 11. Bullets 620 px/s, cooldown 170 ms, max 6 alive.","Enemies enter at y = -50 at 90 px/s: 8 s to cross a 720 px field. Wave size 4 + wave, speed +8% per wave, cap 260 px/s.","Three lives, 1.2 s of invulnerability after a hit with the ship flashing."],checks:["game.loop","game.delta-time","game.touch-input","game.lose-state","game.restart","game.score","game.spawn-offscreen","game.difficulty"]},{id:"rhythm",label:"Rhythm game",kind:"game",family:"arcade",triggers:["rhythm game","dance game","ddr","guitar hero","beat game","music game","tap to the beat","dance revolution"],summary:"Notes fall towards a fixed hit line and are struck in time with the music.",mustHave:["Notes that spawn OFF SCREEN and travel to the hit line, giving the player time to react.","Timing windows with named judgements, a combo counter and an accuracy percentage.","Lane keys, and a tappable lane target for touch.","A chart — an actual list of note times — not random spawning."],pitfalls:[{id:"spawn-at-hitline",symptom:"Notes appear already on the hit line, so the game is pure luck. This is the single most common way a rhythm game is broken.",fix:"A note is scheduled by the time it must be HIT. Spawn it travelTime seconds earlier at the top of the field: spawnTime = hitTime - travelTime. Its y position is derived from (now - spawnTime), so it arrives exactly on the beat. Never create a note at the hit line under any circumstance."},{id:"audio-drift",symptom:"The notes and the music separate after twenty seconds.",fix:"Drive the whole thing from the audio clock (AudioContext.currentTime), not from a frame counter or accumulated deltas."},{id:"no-miss",symptom:"Everything is a hit, or nothing is.",fix:"Judge on absolute time difference to the note's hit time, in milliseconds. A note past the late window is a miss and is removed."}],tuning:["Field 420×640. Hit line at y = 540. Notes spawn at y = -40, so 580 px of travel.","Travel time 1.6 s → note speed 362 px/s. That is the reaction time; do not go below 1.2 s.","Windows: perfect ±55 ms, great ±95 ms, good ±140 ms, anything later is a miss.","4 lanes on keys D F J K, each lane also a touch target the full width of the lane.","Chart at 120 BPM = 500 ms per beat. Start the first note 3 s in, so the player sees the field before it fills."],checks:["game.loop","game.touch-input","game.score","game.restart","game.spawn-offscreen","game.audio-unlock"]},{id:"platformer",label:"Platformer",kind:"game",family:"arcade",triggers:["platformer","mario style","jump and run","side scroller","platform game"],summary:"Run and jump across solid ground towards a goal.",mustHave:["Solid collision resolved on each axis separately, so you never stick to a wall.","A camera that follows with a dead zone, not glued to the player.","Coins or a goal, a death and respawn, and on-screen controls for touch."],pitfalls:[{id:"corner-snag",symptom:"Running along flat ground catches on the seam between two tiles.",fix:"Move and resolve the X axis fully, then the Y axis fully. Never resolve a diagonal in one step."},{id:"no-coyote",symptom:"Jumps feel like they do not register at ledges.",fix:"Coyote time of 100 ms after leaving ground, and a jump buffer of 120 ms before landing. Both are invisible and both are why good platformers feel good."}],tuning:["Tile 32 px. Gravity 2400 px/s², jump -720 px/s → 96 px of clearance, three tiles.","Run 260 px/s with 1800 px/s² acceleration and 2600 deceleration.","Camera dead zone 160 px wide, lerp 8% per frame at 60 fps."],checks:["game.loop","game.delta-time","game.touch-input","game.lose-state","game.restart","game.collision"]},{id:"maze",label:"Maze",kind:"game",family:"board",triggers:["maze game","maze","labyrinth"],summary:"A generated maze with a start, an exit and something to collect.",mustHave:["A generated maze that is guaranteed solvable, not a random wall soup.","A visible player, a goal, a move counter or timer, and a new-maze button.","Arrow keys, WASD and swipe."],pitfalls:[{id:"unsolvable",symptom:"The exit is walled off.",fix:"Generate with a spanning-tree algorithm (recursive backtracker or Prim) so every cell is reachable by construction. Never place walls at random."},{id:"stack-overflow",symptom:"Big mazes crash the tab.",fix:"Write the backtracker with an explicit stack array, not recursion."}],tuning:["15×15 cells for the first level, growing by 2 each level to a cap of 31.","Cell size derived from the canvas so the maze always fits: cell = floor(min(width, height) / cells).","Walls 2 px, drawn as lines between cells rather than as filled blocks — it reads much better."],checks:["game.loop","game.touch-input","game.restart","game.key-scroll"]},{id:"tetris",label:"Falling blocks",kind:"game",family:"board",triggers:["tetris","falling blocks","block stacking game","tetromino"],summary:"Rotate and drop falling shapes to complete lines.",mustHave:["All seven tetrominoes, rotation with wall kicks, a next-piece preview and a hold slot.","Line clear with a flash, scoring by lines cleared at once, and a level that raises gravity.","Touch: swipe to move, tap to rotate, swipe down to drop."],pitfalls:[{id:"rotate-into-wall",symptom:"Rotation next to a wall does nothing, which feels broken.",fix:"Try the rotation, then try it offset by -1, +1, -2, +2 columns. Accept the first that fits."},{id:"instant-lock",symptom:"A piece locks the moment it touches, removing all last-second placement.",fix:"Lock delay of 500 ms, reset on a successful move, capped at 15 resets."}],tuning:["Board 10×20. Gravity 1000 ms per row at level 1, × 0.8 per level, floor 80 ms.","Scoring 100 / 300 / 500 / 800 for one to four lines, × level. Level up every 10 lines.","Key repeat: 170 ms before repeat starts, then every 50 ms."],checks:["game.loop","game.touch-input","game.lose-state","game.restart","game.score","game.key-scroll"]},{id:"2048",label:"Sliding numbers",kind:"game",family:"board",triggers:["2048","sliding tiles","merge game","number merge"],summary:"Slide a grid of numbers together to merge them into larger ones.",mustHave:["Slide and merge in four directions, with a new tile only when the board changed.","Score, best score kept, undo of one move, and a game-over test that checks for possible merges as well as empty cells.","Swipe and arrow keys."],pitfalls:[{id:"double-merge",symptom:"2 2 4 slides into 8 in one move.",fix:"Mark a tile as merged this move and refuse to merge it again until the next move."},{id:"phantom-spawn",symptom:"A new tile appears after a move that did nothing.",fix:"Compare the board before and after; only spawn when something actually moved or merged."}],tuning:['4×4 grid, new tiles 90% "2" and 10% "4", two tiles to start.',"Slide animation 110 ms, merge pop 90 ms — fast enough to keep up with quick input.","Tile colours should step in lightness with the value, and the text must flip to the light ink above 8 or it becomes unreadable."],checks:["game.touch-input","game.lose-state","game.restart","game.score","game.key-scroll"]},{id:"memory",label:"Memory match",kind:"game",family:"board",triggers:["memory game","matching game","concentration game","card match","pairs game"],summary:"Flip cards two at a time to find matching pairs.",mustHave:["A shuffled board with an even number of cards, a flip animation, a move counter and a timer.","Difficulty choice that changes the grid size.","A win screen with the score."],pitfalls:[{id:"flip-spam",symptom:"Clicking fast reveals the whole board.",fix:"Lock input while two cards are face up and while the flip-back timer is running."},{id:"same-card-twice",symptom:"Clicking one card twice counts as a pair.",fix:"Ignore a click on a card that is already face up or already matched."}],tuning:["Default 4×4, that is 8 pairs. Easy 4×3, hard 6×5.","Flip animation 250 ms, mismatch stays visible for 700 ms before flipping back — long enough to memorise.","Grid uses CSS grid with aspect-ratio: 1 on the cards, so it stays square at any width."],checks:["game.restart","app.escape-output"]},{id:"tictactoe",label:"Tic-tac-toe",kind:"game",family:"board",triggers:["tic tac toe","tictactoe","noughts and crosses","xs and os","three in a row"],summary:"Three in a row, against a person or the computer.",mustHave:["A computer opponent with at least two difficulties, one of which is unbeatable (minimax on nine cells is trivial and instant).","A drawn winning line, a draw state, and a running tally across games."],pitfalls:[{id:"no-draw-state",symptom:"A full board with no winner leaves the game hanging.",fix:"Check for a full board after checking for a win, and declare a draw."},{id:"ai-plays-taken",symptom:"The computer plays into an occupied square or freezes.",fix:"Enumerate the empty cells and choose from that list only."}],tuning:["Easy plays randomly with a 60% chance of taking a winning or blocking move; hard runs full minimax and cannot lose.","Computer replies after 300 ms so the move is visible rather than instantaneous."],checks:["game.restart","app.escape-output"]},{id:"minesweeper",label:"Minesweeper",kind:"game",family:"board",triggers:["minesweeper","mine sweeper","bomb grid game"],summary:"Reveal a grid without hitting a mine, using the numbers as clues.",mustHave:["First click always safe, flags, a mine counter and a timer, and chording on a satisfied number.","Long-press to flag on touch, right-click on desktop."],pitfalls:[{id:"first-click-death",symptom:"Losing on the very first click.",fix:"Place the mines after the first click, excluding that cell and its eight neighbours."},{id:"recursive-flood",symptom:"Revealing a large empty region freezes or crashes.",fix:"Flood fill with an explicit queue, not recursion."}],tuning:["Beginner 9×9 with 10 mines, intermediate 16×16 with 40, expert 24×16 with 99. These ratios are the standard ones and they are well balanced.","Long-press threshold 400 ms, with the cell highlighting at 200 ms so the gesture is discoverable.","Number colours: the classic 1 blue, 2 green, 3 red, 4 navy, 5 maroon, 6 teal, 7 black, 8 grey — recognisable and each distinct."],checks:["game.lose-state","game.restart","game.touch-input"]},{id:"quiz",label:"Quiz",kind:"game",family:"crud",triggers:["quiz","trivia","multiple choice","test your knowledge","quiz game"],summary:"Multiple choice questions with scoring and a result at the end.",mustHave:["A real question bank with at least 10 well-written questions on the subject, and correct answers that are actually correct.","Shuffled questions and shuffled answers, immediate feedback, a progress indicator and a final score with a breakdown.","Keyboard number keys as well as clicking."],pitfalls:[{id:"shuffle-index-bug",symptom:"The wrong answer is marked correct after shuffling.",fix:"Store the correct answer as a value or an object reference, and shuffle the option objects. Never shuffle strings while keeping a numeric correct index."},{id:"double-answer",symptom:"Clicking twice adds two points.",fix:"Disable the options as soon as one is chosen."}],tuning:["10 questions per round, 4 options each. Feedback for 900 ms before advancing, or advance on a click.",'Show the correct answer when the player is wrong — a quiz that only says "wrong" teaches nothing.'],checks:["app.escape-output","game.restart","game.score"]},{id:"typing",label:"Typing test",kind:"game",family:"utility",triggers:["typing test","typing game","wpm test","typing speed"],summary:"Type a passage against the clock and get words per minute and accuracy.",mustHave:["A live view of the passage with the current character highlighted, correct characters in one colour and mistakes in another.","WPM and accuracy updating live, a fixed test duration, and a results screen."],pitfalls:[{id:"wrong-wpm",symptom:"The WPM number is nonsense.",fix:'WPM = (correct characters / 5) / minutes elapsed. The "word" is five characters by definition; do not count actual words.'},{id:"input-focus-lost",symptom:"Typing stops registering after clicking anywhere.",fix:"Keep a hidden input focused, or listen on the document for keydown and preventDefault on space so the page does not scroll."}],tuning:["60 second test by default, with 15 and 30 as options. Passage of at least 400 characters so nobody runs out.","Accuracy = correct keystrokes / total keystrokes, counted as they happen — backspacing should not erase the record of a mistake."],checks:["game.restart","game.score","app.escape-output"]},{id:"clicker",label:"Idle clicker",kind:"game",family:"crud",triggers:["clicker game","idle game","incremental game","cookie clicker"],summary:"Click to earn, buy upgrades that earn for you, watch the number rise.",mustHave:["A click reward, at least five upgrades with rising costs, and automatic income per second.",'A save to localStorage, a readable number format, and a floating "+n" on each click.'],pitfalls:[{id:"unreadable-numbers",symptom:"The counter becomes 1.2345678901e+21.",fix:"Format with suffixes — K, M, B, T — from about 10,000 upwards, to one decimal place."},{id:"cost-curve-flat",symptom:"Everything is affordable at once and there is no game.",fix:"Cost = base × 1.15^owned. That exponent is the standard for a reason: it keeps every upgrade about 30 seconds away."}],tuning:["Base click 1. First upgrade costs 15 and gives 0.1/s. Each subsequent upgrade roughly 8× the cost and 8× the output of the last.","Tick income at 10 Hz using elapsed time, so a background tab does not lose progress.","Autosave every 5 s and on visibilitychange."],checks:["app.persist","app.escape-output","game.score"]},{id:"wordguess",label:"Word guess",kind:"game",family:"board",triggers:["wordle","word guess","hangman","word game","guess the word"],summary:"Guess a hidden word from letter feedback.",mustHave:["A real word list, an on-screen keyboard that tracks letter states, and six attempts.",'A share-able result grid and a "new word" button.'],pitfalls:[{id:"double-letter-marking",symptom:"Guessing SPEED against ERASE marks both E positions yellow when only one E remains.",fix:"Two passes. First mark exact matches green and consume those letters from a pool. Then, for the rest, mark yellow only if the letter is still in the pool, consuming it. This is the bug every implementation has."},{id:"accepts-nonsense",symptom:"Any five characters are accepted as a guess.",fix:"Validate against the word list and shake the row on an invalid guess."}],tuning:["Five letters, six guesses. Reveal animation 300 ms per tile staggered by 120 ms.","Keyboard letter state priority: green beats yellow beats grey — never downgrade a letter already known green."],checks:["game.restart","app.escape-output","game.touch-input"]},{id:"towerdefense",label:"Tower defence",kind:"game",family:"arcade",triggers:["tower defense","tower defence","td game","defend the base"],summary:"Place towers along a path to stop waves of enemies.",mustHave:["A fixed path drawn on the map, towers placed only off-path, and a build cost with income from kills.","Range shown while placing, waves with a countdown, lives lost when an enemy reaches the end."],pitfalls:[{id:"path-following",symptom:"Enemies drift off the path or stutter at corners.",fix:"Move along waypoints by distance travelled: advance the remaining step distance into the next segment rather than snapping to the waypoint."},{id:"no-economy",symptom:"Either you can afford everything immediately or nothing ever.",fix:"Start with exactly two towers' worth of money and pay about 40% of a tower per wave cleared."}],tuning:["Wave n has 5 + 2n enemies with 20 × 1.18^n health, spawned 700 ms apart, 6 s between waves.","Basic tower: cost 50, range 110 px, 1 shot per 700 ms, 12 damage. That kills a wave-1 enemy in two shots.","20 lives. Enemy speed 55 px/s, +3% per wave."],checks:["game.loop","game.delta-time","game.lose-state","game.restart","game.score"]},{id:"simon",label:"Sequence memory",kind:"game",family:"board",triggers:["simon says","simon game","sequence game","memory sequence"],summary:"Repeat a growing sequence of lights and sounds.",mustHave:["Four pads that light and play a distinct tone, a growing sequence, and a strike-out on a wrong press.","Input locked during playback."],pitfalls:[{id:"input-during-playback",symptom:"Pressing during the demonstration registers as an answer.",fix:"A boolean gate around the playback, released only after the last pad goes dark."},{id:"silent-audio",symptom:"No sound until the second game.",fix:"Create or resume the AudioContext inside the first user gesture — browsers block it otherwise."}],tuning:["Tones 329.63, 261.63, 220, 164.81 Hz — E4, C4, A3, E3, which are pleasant together rather than arbitrary.","Playback 600 ms per step at level 1, dropping 25 ms per level to a floor of 320 ms. Gap of 120 ms between pads so repeats are distinguishable."],checks:["game.restart","game.score","game.audio-unlock"]},{id:"todo",label:"To-do list",kind:"app",family:"crud",triggers:["todo","to do list","task list","task manager","checklist app","task app"],summary:"Capture tasks, tick them off, keep them between visits.",mustHave:["Add, complete, edit in place, delete, and a filter for all / active / done.","Persistence to localStorage on every change, restored on load.","A count of what is left, and a way to clear the completed ones.","Empty state that says something useful rather than showing a blank box."],pitfalls:[{id:"dom-as-state",symptom:"Filtering loses tasks, or reordering duplicates them.",fix:"Keep an array of objects as the only truth and re-render from it. Never read state back out of the DOM."},{id:"xss-title",symptom:"A task called <img onerror=...> executes.",fix:"Set task text with textContent. If you must build markup, escape &, <, > first."},{id:"lost-on-reload",symptom:"Everything is gone after a refresh.",fix:"Save on every mutation, not on a timer or on unload — unload does not reliably fire on mobile."}],tuning:["Store as { id, text, done, createdAt }. Id from crypto.randomUUID() with a Date.now() fallback.","Enter adds, Escape cancels an edit, and the input regains focus after adding so a list can be typed quickly."],checks:["app.persist","app.escape-output","web.responsive"]},{id:"notes",label:"Notes",kind:"app",family:"crud",triggers:["note app","notes app","notepad","journal app","diary app"],summary:"Write and keep notes, find them again later.",mustHave:["A list beside an editor, autosave, search across titles and bodies, and a delete with confirmation.","The title derived from the first line if none is given.","Word count and a last-edited time."],pitfalls:[{id:"save-thrash",symptom:"Typing is janky in a long note.",fix:"Debounce the save by about 400 ms; do not write to storage on every keystroke."},{id:"lost-selection",symptom:"The cursor jumps to the end while typing.",fix:"Do not re-render the textarea from state while it is focused. Bind it once and read from it."}],tuning:["Debounce 400 ms. Search filters as you type with no button. Sort by last edited, newest first.","On a narrow screen the list and the editor become two views with a back button, not two squeezed columns."],checks:["app.persist","app.escape-output","web.responsive"]},{id:"calculator",label:"Calculator",kind:"app",family:"utility",triggers:["calculator","calc app","arithmetic app"],summary:"Arithmetic with a keypad and a keyboard.",mustHave:["Operator precedence, parentheses or at least chained operations, percent, sign flip, and a clear that distinguishes CE from C.","Full keyboard support including Enter for equals and Escape for clear.","A visible expression line above the result."],pitfalls:[{id:"eval",symptom:"Works until someone types something odd, then throws or worse.",fix:"Write a small tokeniser and a precedence-climbing evaluator. It is about forty lines and it never has this class of bug. Do not call eval or new Function."},{id:"float-display",symptom:"0.1 + 0.2 shows 0.30000000000000004.",fix:"Round the displayed result to 12 significant digits and strip trailing zeros."},{id:"divide-by-zero",symptom:"Infinity appears in the display.",fix:'Catch it and show "Cannot divide by zero", then reset on the next input.'}],tuning:["Buttons at least 44×44 px — the minimum comfortable touch target.","Display font tabular and right-aligned, shrinking by steps once the number exceeds the width rather than overflowing."],checks:["app.no-eval","web.responsive","app.escape-output"]},{id:"timer",label:"Timer / Pomodoro",kind:"app",family:"utility",triggers:["pomodoro","focus timer","countdown timer","timer app","stopwatch","interval timer"],summary:"Count down a work period, then a break, with a signal at each end.",mustHave:["Start, pause, reset, and a configurable length.","An audible end signal generated in the page, plus a visual one — sound alone fails on a muted phone.","The remaining time in the document title so it is visible from another tab."],pitfalls:[{id:"timer-drift",symptom:"After twenty minutes the timer is a minute slow.",fix:"Store the target timestamp and compute remaining = target - Date.now() on each tick. Never decrement a counter inside setInterval — background tabs throttle it to once a second or less."},{id:"audio-blocked",symptom:"No sound when the timer ends.",fix:"Create the AudioContext on the first Start click and resume() it there; a context created on page load is suspended."}],tuning:["Pomodoro defaults: 25 minutes work, 5 short break, 15 long break after four rounds.","Tick the display at 250 ms so the seconds never appear to skip.","End signal: three 880 Hz beeps of 180 ms with 120 ms gaps, at 0.2 gain. Loud enough to notice, not enough to startle."],checks:["app.timer-drift","app.persist","game.audio-unlock"]},{id:"habit",label:"Habit tracker",kind:"app",family:"crud",triggers:["habit tracker","habit app","streak tracker","daily tracker"],summary:"Mark habits done each day and watch the streak.",mustHave:["A grid of the last several weeks per habit, a current and best streak, and add/remove habits.","Today clearly marked, and a tap on any day to toggle it."],pitfalls:[{id:"timezone-day",symptom:"Days shift by one for some users, or a habit ticks itself at midnight UTC.",fix:"Key days by local YYYY-MM-DD built from getFullYear/getMonth/getDate. Never use toISOString() for a local date."},{id:"streak-off-by-one",symptom:"The streak resets even though today is ticked.",fix:"Walk backwards from today; a missing today does not break the streak until tomorrow."}],tuning:["Show 12 weeks. Cell 14 px with 3 px gaps, four intensity levels if the habit is countable.",'Store as { id, name, colour, days: { "2026-08-12": true } }.'],checks:["app.persist","app.escape-output","web.responsive"]},{id:"budget",label:"Budget / expenses",kind:"app",family:"crud",triggers:["budget app","expense tracker","expense app","spending tracker","money tracker","finance app"],summary:"Record what came in and what went out, and see where it went.",mustHave:["Entries with amount, category, date and note; a running balance; totals by category with a chart.","Filter by month, and an export to CSV."],pitfalls:[{id:"float-money",symptom:"Totals are out by a penny.",fix:"Store money as integer cents and divide only when displaying. 0.1 + 0.2 is not 0.3 in binary floating point."},{id:"category-freetext",symptom:'Twelve spellings of "groceries" in the report.',fix:'A fixed category list plus an "add category" action, not a free text field.'}],tuning:["Currency formatted with Intl.NumberFormat and the browser locale.","Category chart as a donut drawn in SVG — no library needed for eight slices, and it stays sharp at any size."],checks:["app.money-float","app.persist","app.escape-output"]},{id:"drawing",label:"Drawing app",kind:"app",family:"canvas",triggers:["drawing app","paint app","sketch app","whiteboard","canvas drawing"],summary:"Draw with a pointer, choose colours and brush sizes, save the result.",mustHave:["Pointer events so mouse, pen and touch all work with one code path.","Colour, brush size, eraser, clear, undo, and download as PNG.","Pressure support where the device reports it."],pitfalls:[{id:"canvas-cleared-on-resize",symptom:"The drawing vanishes when the window is resized or the phone rotates.",fix:"Setting canvas.width or height clears it. Copy the bitmap out first, resize, then draw it back."},{id:"blurry-canvas",symptom:"Lines look soft on a phone or a retina screen.",fix:"Size the backing store to cssWidth × devicePixelRatio and scale the context by the same factor."},{id:"scroll-while-drawing",symptom:"Drawing scrolls the page on a phone.",fix:"touch-action: none on the canvas, and setPointerCapture on pointerdown."}],tuning:["Undo as a stack of up to 20 ImageData snapshots — beyond that the memory cost is real.","Line join and cap round, and interpolate between pointer samples with quadratic curves or fast strokes look like polygons."],checks:["app.canvas-dpr","game.touch-input","web.responsive"]},{id:"kanban",label:"Kanban board",kind:"app",family:"crud",triggers:["kanban","trello","board app","project board"],summary:"Cards in columns, moved as work progresses.",mustHave:["Columns with add-card, edit and delete, card counts, and persistence.","Moving a card between columns by drag on desktop and by an explicit control on touch."],pitfalls:[{id:"html5-dnd-on-touch",symptom:"Dragging does nothing on a phone.",fix:"HTML5 drag and drop does not fire on touch. Either implement dragging with pointer events and a ghost element, or provide a move button on each card. Do both if there is time."},{id:"drop-target-flicker",symptom:"The drop zone flickers as the pointer moves over child elements.",fix:"Count dragenter and dragleave rather than toggling on each event."}],tuning:["Three columns to start: To do, Doing, Done. Columns scroll independently; the board scrolls horizontally on a phone with scroll-snap.","Store { columns: [{ id, title, cards: [{ id, text }] }] }."],checks:["app.persist","app.escape-output","web.responsive"]},{id:"flashcards",label:"Flashcards",kind:"app",family:"crud",triggers:["flashcards","flash cards","study app","revision app","spaced repetition"],summary:"Cards with a front and a back, reviewed until known.",mustHave:['A deck editor, a review mode with a flip, and "knew it / did not" that affects what comes back.',"Progress through the deck and a session summary."],pitfalls:[{id:"no-scheduling",symptom:"The same cards cycle forever with no sense of progress.",fix:"Even a simple box system beats none: a card answered correctly moves up a box and is seen less often; a wrong answer sends it back to box one."}],tuning:["Five boxes, reviewed at intervals of 1, 2, 4, 8 and 16 sessions.","Flip on click, space and swipe, with a 3D flip of 400 ms — this is one of the few places a flourish genuinely helps."],checks:["app.persist","app.escape-output"]},{id:"converter",label:"Unit converter",kind:"app",family:"utility",triggers:["unit converter","converter app","conversion tool","metric converter","currency converter"],summary:"Convert between units in a category, both directions, live.",mustHave:["Several categories, conversion as you type in either field, and a swap button.","Correct factors — verify them; a converter that is wrong is worse than none."],pitfalls:[{id:"offset-units",symptom:"Celsius to Fahrenheit is wrong.",fix:"Temperature is affine, not a simple ratio. Convert to a base with an offset and a factor: value → base then base → target. Do not use one multiplier table for everything."},{id:"both-fields-fight",symptom:"Typing in one field rewrites what you are typing.",fix:"Only write to the field that is not focused."}],tuning:["Length, mass, temperature, volume, area, speed, data and time cover almost every request.","Show up to 6 significant digits and strip trailing zeros; nobody wants 25.400000000000002 mm."],checks:["app.no-eval","web.responsive"]},{id:"musicplayer",label:"Music player",kind:"app",family:"crud",triggers:["music player","audio player","mp3 player","playlist app","podcast player"],summary:"A playlist, transport controls and a progress bar.",mustHave:["Play / pause / next / previous, a seek bar that can be dragged, volume, and the current time and duration.","Files added by the user through a file input or drag and drop — there is no library of music to ship.","Keyboard: space to play or pause, arrows to seek."],pitfalls:[{id:"seek-fights-playback",symptom:"The scrubber jumps back while dragging.",fix:"Stop updating the bar from timeupdate while the user is dragging it."},{id:"objecturl-leak",symptom:"Memory grows with every file loaded.",fix:"revokeObjectURL when a track is removed or replaced."}],tuning:["Visualise with an AnalyserNode at fftSize 256 — 128 bars is plenty and it is cheap.","Show duration as m:ss, and handle NaN duration before metadata loads."],checks:["game.audio-unlock","web.responsive"]},{id:"markdown",label:"Markdown editor",kind:"app",family:"utility",triggers:["markdown editor","markdown preview","md editor","text editor with preview"],summary:"Write markdown on the left, see it rendered on the right.",mustHave:["Headings, bold, italic, links, lists, code blocks, inline code, quotes and rules at minimum.","Synchronised scrolling, a word count, autosave and a copy-as-HTML action."],pitfalls:[{id:"xss-in-preview",symptom:"Typing a script tag runs it.",fix:"Escape &, <, > on the raw text BEFORE applying any markdown transforms. Every transform then produces only markup you generated."},{id:"greedy-regex",symptom:"Two separate bold spans merge into one.",fix:"Non-greedy quantifiers, and process code spans first so their contents are protected from other rules."}],tuning:["Two panes above 780 px, tabs below it.","Debounce the render by 120 ms — fast enough to feel live, slow enough not to re-parse on every keystroke."],checks:["app.escape-output","app.persist","web.responsive"]},{id:"weather",label:"Weather",kind:"app",family:"crud",triggers:["weather app","forecast app","weather dashboard"],summary:"Current conditions and a forecast for a place.",mustHave:["A real API if one is available without a key — Open-Meteo needs none — with a clear offline or failed state.","Search by city, the current conditions large, and a multi-day forecast.","A loading state and an error state that says what went wrong."],pitfalls:[{id:"key-required",symptom:"The app is dead because the user has no API key.",fix:"Prefer api.open-meteo.com, which is free, keyless and CORS-enabled. Geocode with its companion geocoding endpoint."},{id:"no-failure-path",symptom:"A blank screen when the network is down.",fix:"Catch, show the last cached result with its timestamp, and say plainly that it is stale."}],tuning:["Cache the last successful response in localStorage with a fetched-at time.","Map weather codes to icons drawn as inline SVG rather than fetching images."],checks:["web.responsive","app.escape-output"]},{id:"chatui",label:"Chat interface",kind:"app",family:"crud",triggers:["chat app","chat ui","chat interface","chat window","messaging app","chatbot ui","message board","chat"],summary:"A conversation view with a composer.",mustHave:["Messages with sender, time and status; a composer that grows with the text; auto-scroll to the newest.","Enter sends, Shift+Enter makes a new line.","A typing indicator and an empty state."],pitfalls:[{id:"scroll-hijack",symptom:"Reading history is impossible because it keeps jumping to the bottom.",fix:"Only auto-scroll when the view was already within about 80 px of the bottom."},{id:"unescaped-message",symptom:"A message containing markup breaks the layout.",fix:"textContent for message bodies."}],tuning:["Composer max height about 40% of the viewport, then it scrolls internally.","Message max width 68ch so long lines stay readable."],checks:["app.escape-output","web.responsive"]},{id:"gallery",label:"Image gallery",kind:"app",family:"crud",triggers:["image gallery","photo gallery","lightbox","photo grid"],summary:"A grid of images with a full-size view.",mustHave:["A responsive grid, a lightbox with keyboard navigation and a close on Escape, and lazy loading.","Alt text on every image."],pitfalls:[{id:"layout-shift",symptom:"The page jumps as images load.",fix:"Give every image a width, a height and an aspect-ratio in CSS so the space is reserved."},{id:"lightbox-focus-trap",symptom:"Tab moves behind the lightbox.",fix:"Move focus into the dialog on open, trap it, and return it to the trigger on close."}],tuning:["grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) handles every screen with one line.",'loading="lazy" and decoding="async" on every thumbnail.'],checks:["web.alt-text","web.responsive","html.missing-asset"]},{id:"landing",label:"Landing page",kind:"site",family:"marketing",triggers:["landing page","marketing page","product page","homepage","sales page","website"],summary:"One page that explains an offer and asks for one action.",mustHave:["A hero with a specific headline — what it is and who it is for, not a slogan — and one primary call to action above the fold.","Real written sections: what it does, who it is for, proof, pricing or a close, and a footer.",'Written copy about the actual subject. Not lorem ipsum, not "Feature One".',"Responsive from 320 px up, with a working mobile navigation."],pitfalls:[{id:"vague-hero",symptom:'"Empower your workflow" — nobody knows what it is.',fix:'The headline names the thing and the outcome. "Invoices your clients actually pay on time" beats any abstraction.'},{id:"cta-everywhere",symptom:"Eight competing buttons.",fix:"One primary action repeated, everything else visibly secondary."},{id:"contrast-fail",symptom:"Grey text on a grey gradient.",fix:"Body text at 4.5:1 minimum against its actual background, including over images — put a scrim behind text on a photo."}],tuning:["Content column max 1120 px, text blocks max 68ch. Section padding 96 px desktop, 56 px mobile.","Type scale 1.25 ratio from a 17 px base. One display face, one text face, no more.","Hero above the fold at 900×700 — check that the headline, the sub and the button all fit there."],checks:["content.placeholder","web.responsive","web.meta-description","html.missing-asset","web.contrast"]},{id:"portfolio",label:"Portfolio",kind:"site",family:"marketing",triggers:["portfolio","personal site","personal website","my website","showcase site"],summary:"Who someone is, what they have made, and how to reach them.",mustHave:["An introduction with a real position statement, a project list with outcomes rather than just titles, and working contact links.","Each project: what it is, what was done, what the result was."],pitfalls:[{id:"projects-without-outcome",symptom:"A list of nouns nobody can evaluate.",fix:"One line per project on the problem, one on the approach, one on the result."},{id:"dead-contact",symptom:"A contact form that goes nowhere.",fix:"Use a mailto: link with a subject, or say plainly where to reach them. Do not fake a submit."}],tuning:["Long-form single column at 640–720 px reads better than a card grid for a personal site.","Include a print stylesheet — people do print these."],checks:["content.placeholder","web.responsive","html.missing-asset"]},{id:"restaurant",label:"Restaurant / local business",kind:"site",family:"marketing",triggers:["restaurant website","cafe website","bakery website","salon website","menu page","local business site","restaurant","bakery","cafe","coffee shop","salon","barber","diner","pizzeria","takeaway"],summary:"A local business page: what they serve, where they are, when they are open.",mustHave:["Hours, address, phone as a tel: link, and a map link — these are what people actually come for.","A real menu or service list with prices, in sections.","Photos or, if none exist, a strong typographic treatment instead of grey boxes."],pitfalls:[{id:"missing-basics",symptom:"A beautiful page with no address or opening hours.",fix:"Put the practical details in the header or immediately below the hero, and repeat them in the footer."}],tuning:["tel: and mailto: links, and an https://maps.google.com/?q=<address> link rather than an embedded map that needs a key.","Menu as a definition list with a leader line, not a table — it works at every width."],checks:["content.placeholder","web.responsive","html.missing-asset"]},{id:"resume",label:"Résumé / CV",kind:"site",family:"marketing",triggers:["resume","cv","curriculum vitae","resume site"],summary:"A one-page professional history that prints well.",mustHave:["Name, one-line summary, contact row, experience with dates and outcomes, skills, education.","A print stylesheet that fits one page in A4 and Letter with no dark backgrounds."],pitfalls:[{id:"print-breaks",symptom:"Printing produces four pages with a section split in half.",fix:"@media print with page-break-inside: avoid on each entry, black on white, and hidden navigation."}],tuning:["Body 11pt in print, 16px on screen. Margins 14 mm.","Dates right-aligned in a two-column row that collapses to stacked below 560 px."],checks:["content.placeholder","web.responsive","site.print"]},{id:"blog",label:"Blog",kind:"site",family:"marketing",triggers:["blog","blog site","article site","writing site"],summary:"An index of posts and a readable article page.",mustHave:["An index with title, date and a real excerpt, and at least two complete example posts.","Article typography that is genuinely comfortable: measure, leading, heading rhythm."],pitfalls:[{id:"unreadable-measure",symptom:"Lines running the full width of a desktop screen.",fix:"max-width: 68ch on the article body. This single rule does more for readability than anything else."}],tuning:["Body 18–19 px, line height 1.65, paragraph spacing 1.25em. Headings at 1.3 line height, more space above than below.","Code blocks with a horizontal scroll rather than wrapping."],checks:["content.placeholder","web.responsive","html.missing-asset"]},{id:"dashboard",label:"Dashboard",kind:"viz",family:"crud",triggers:["dashboard","admin panel","analytics page","metrics page","stats page"],summary:"Numbers and charts arranged so the state of something is legible at a glance.",mustHave:["Headline figures with a comparison — a number with no baseline says nothing.","At least two charts drawn from real-looking data, with axes, labels and units.","A time range control that actually changes the data."],pitfalls:[{id:"chart-without-units",symptom:"A line going up, of what, nobody knows.",fix:"Every axis labelled, every series named, units stated once."},{id:"cdn-chart-lib",symptom:"A blank dashboard when the CDN is blocked or offline.",fix:"Draw with inline SVG or canvas. A line chart and a bar chart are about sixty lines each and they never fail to load."}],tuning:["Grid of cards at repeat(auto-fit, minmax(280px, 1fr)).","Chart colours from the project palette, sequential for one series and categorical for many. Never a rainbow.","Y axis from zero for bars; a truncated axis on a bar chart is a lie."],checks:["web.responsive","viz.axis-labels","web.cdn-offline"]},{id:"docs",label:"Documentation site",kind:"site",family:"marketing",triggers:["documentation site","docs site","api docs","reference site","wiki"],summary:"Navigable reference material.",mustHave:["A sidebar of sections, in-page anchors, a search over headings, and code samples that can be copied.","Real content for at least three pages or sections."],pitfalls:[{id:"no-anchors",symptom:"Nobody can link to a specific part.",fix:"An id on every heading and a copy-link affordance."}],tuning:["Sidebar 260 px, collapsing to a drawer below 900 px. Content 72ch.","Highlight the current section with an IntersectionObserver on the headings."],checks:["content.placeholder","web.responsive"]},{id:"ecommerce",label:"Shop front",kind:"site",family:"marketing",triggers:["store","shop","ecommerce","e-commerce","online store","product listing","storefront"],summary:"Products, a detail view and a basket.",mustHave:["A product grid with price and image, a detail view, and a basket with quantities and a total.","The basket persisted, and an empty-basket state.","A checkout that is honest about being a demo rather than pretending to take a card."],pitfalls:[{id:"fake-payment",symptom:"A form that looks like it takes card details.",fix:"Never build a fake card form. Stop at the basket and say a real checkout needs a payment provider."},{id:"money-float",symptom:"The total is a penny out.",fix:"Integer cents."}],tuning:["At least 6 products with real names, real descriptions and plausible prices.","Basket in localStorage, with the count on the header icon."],checks:["app.money-float","app.persist","web.responsive","content.placeholder"]},{id:"event",label:"Event page",kind:"site",family:"marketing",triggers:["event page","conference site","wedding website","party invite","meetup page"],summary:"What is happening, when, where, and how to come.",mustHave:["Date, time, place and an RSVP or ticket action, all above the fold.","A schedule, directions, and an add-to-calendar link built as a data: .ics URL."],pitfalls:[{id:"date-buried",symptom:"The date is somewhere in paragraph three.",fix:"Date and place in the hero, large, before anything else."}],tuning:["Countdown driven from a fixed target timestamp, recomputed from Date.now() each second.","The .ics as a data URL means add-to-calendar works with no backend."],checks:["content.placeholder","web.responsive"]},{id:"generic-app",label:"Web app",kind:"app",family:"crud",triggers:["app","web app","tool","application"],summary:"An interactive tool with state that survives a reload.",mustHave:["A single clear purpose visible on first load, with an empty state that explains what to do.","State persisted to localStorage.","Keyboard support for the primary action."],pitfalls:[{id:"no-empty-state",symptom:"A blank rectangle on first visit.",fix:"Every list needs an empty state saying what it will hold and how to add the first one."}],tuning:["Content column 720–960 px. Controls at least 44 px tall."],checks:["app.persist","app.escape-output","web.responsive"]}],kt=new Map(Dt.map(e=>[e.id,e]));function Q(e){return kt.get(e)??kt.get("generic-app")}const Fa={game:["Work out what the player does second by second before writing any code, and check that the numbers you chose allow it.","Every simulation step is scaled by elapsed time. A game that moves a fixed amount per frame runs at double speed on a 120 Hz screen.","Anything the player must react to enters from off screen. Compute how long it is visible before it matters and say the number.","There must be a way to lose and a way to start again without reloading.","Touch is not optional. Every keyboard control needs a pointer equivalent, and arrow keys and space must preventDefault so the page does not scroll.","Sound must be created inside a user gesture, and there must be a mute."],app:["State lives in one object that the view is rendered from. The DOM is never the source of truth.","Anything the user creates survives a reload.","Every list has an empty state; every destructive action is either confirmed or undoable.","User text goes in with textContent. Never innerHTML."],site:["Write the actual copy. Placeholder text is a failed build, not a draft.","One page, one primary action. Everything else supports it.","Check it at 320 px wide before calling it done.","Semantic landmarks — header, nav, main, footer — and headings in order."],tool:["The input is the interface. Put it first, focus it on load, and make Enter do the obvious thing.","Show the result as it is typed rather than behind a button where you can."],viz:["Every axis is labelled and every unit is stated. A chart without units is decoration.","Draw with SVG or canvas rather than depending on a chart library from a CDN.","Bars start at zero. Lines may not, but say so."],story:["Branches must all resolve. No dead ends that leave the reader stuck.","Keep a state object for what the reader has done, and let it affect what is available."]},at=[{id:"score",label:"scoring",triggers:["score","points","scoring"],note:"Score visible at all times, not only at the end."},{id:"highscore",label:"high score",triggers:["high score","highscore","best score","leaderboard","personal best"],note:"Persist the best score in localStorage and show it beside the current one."},{id:"levels",label:"levels",triggers:["levels","stages","waves","rounds"],note:"Each level must differ in a way the player can name, not just be faster."},{id:"sound",label:"sound",triggers:["sound","sfx","audio","sound effects","beep"],note:"Generate effects with the Web Audio API rather than shipping files; create the context inside a user gesture and provide a mute."},{id:"music",label:"music",triggers:["music","soundtrack","background music","song"],note:"Synthesise a simple loop with oscillators, or let the user supply a file. Never hotlink audio."},{id:"multiplayer-local",label:"two players",triggers:["two player","2 player","multiplayer","versus","local multiplayer"],note:"Two sets of controls on one keyboard, and a shared score line."},{id:"ai-opponent",label:"computer opponent",triggers:["against the computer","ai opponent","vs computer","bot"],note:"Beatable at the easy setting, with a difficulty control."},{id:"difficulty",label:"difficulty",triggers:["difficulty","easy mode","hard mode","gets harder","progressive"],note:"Difficulty changes something structural, and the current level is visible."},{id:"powerups",label:"power-ups",triggers:["power up","powerup","power-ups","bonus","pickups"],note:"Timed, visibly indicated while active, and never stacking into an unloseable state."},{id:"lives",label:"lives",triggers:["lives","hearts","health"],note:"Shown as icons, with brief invulnerability after a hit."},{id:"timer",label:"timer",triggers:["timer","countdown","time limit","against the clock"],note:"Driven from timestamps, never from a decrementing interval counter."},{id:"pause",label:"pause",triggers:["pause","pausing"],note:"Escape and a button, with the loop actually stopping and time not accruing."},{id:"darkmode",label:"dark mode",triggers:["dark mode","light mode","theme toggle","dark theme"],note:"A toggle that persists, defaulting to prefers-color-scheme."},{id:"save",label:"saved data",triggers:["save","saves","persist","remember","keeps"],note:"localStorage, written on every change and read on load, with a version key."},{id:"export",label:"export",triggers:["export","download","csv","save as file"],note:"Build a Blob and an object URL; revoke it after the click."},{id:"import",label:"import",triggers:["import","upload","load a file"],note:"A file input plus a drop zone, with validation and a clear error."},{id:"search",label:"search",triggers:["search","find","filter by name"],note:"Filters as you type, case-insensitive, with a no-results state."},{id:"filter",label:"filters",triggers:["filter","filters","categories","tags"],note:"Filter state visible and clearable."},{id:"sort",label:"sorting",triggers:["sort","order by","sorting"],note:"Indicate the active column and direction."},{id:"dragdrop",label:"drag and drop",triggers:["drag","drag and drop","reorder","drag to"],note:"Pointer events, not HTML5 drag and drop, or it is dead on touch. Provide a non-drag fallback."},{id:"charts",label:"charts",triggers:["chart","graph","visualise","visualize","pie chart","bar chart"],note:"Inline SVG or canvas with labelled axes. No CDN chart library."},{id:"animation",label:"animation",triggers:["animation","animated","smooth","transitions"],note:"Transform and opacity only, 150–300 ms, and honour prefers-reduced-motion."},{id:"particles",label:"particles",triggers:["particles","confetti","explosion","sparkle"],note:"Pooled, capped, and cleared on state change."},{id:"shortcuts",label:"keyboard shortcuts",triggers:["keyboard shortcut","hotkey","shortcuts"],note:"Listed somewhere in the UI — an undiscoverable shortcut does not exist."},{id:"share",label:"sharing",triggers:["share","share button","copy link"],note:"navigator.share where available, clipboard copy as the fallback, with confirmation."},{id:"print",label:"print",triggers:["print","printable","pdf"],note:"A print stylesheet: black on white, navigation hidden, no page breaks mid-entry."},{id:"auth",label:"accounts",triggers:["login","sign in","account","user accounts","register"],note:"There is no backend here. Build the UI and say plainly that it is not real authentication. Never store a password."},{id:"realtime",label:"live data",triggers:["real time","realtime","live data","api"],note:"Only keyless, CORS-enabled APIs work here. Otherwise use realistic local data and label it."},{id:"offline",label:"offline",triggers:["offline","works offline","no internet"],note:"No external requests at all: no CDN, no fonts, no images from a URL."},{id:"accessibility",label:"accessibility",triggers:["accessible","accessibility","a11y","screen reader"],note:"Labels, roles, focus order, visible focus, and 4.5:1 contrast throughout."},{id:"tutorial",label:"instructions",triggers:["tutorial","instructions","how to play","help"],note:"Shown before the first play and reachable afterwards."},{id:"settings",label:"settings",triggers:["settings","options","preferences","customise","customize"],note:"Persisted, and applied without a reload."},{id:"undo",label:"undo",triggers:["undo","redo","history"],note:"A stack with a bound size, and a visible affordance."}],Et={retro:["retro","arcade","80s","8-bit","8 bit","pixel","vintage","nostalgic","crt"],neon:["neon","cyberpunk","synthwave","vaporwave","glow","futuristic","cyber"],minimal:["minimal","minimalist","clean","simple","plain","understated","swiss"],playful:["playful","fun","cute","kids","children","colourful","colorful","friendly","cartoon"],elegant:["elegant","luxury","premium","sophisticated","refined","classy","upmarket"],brutal:["brutalist","bold","loud","raw","punk","zine"],nature:["nature","organic","earthy","forest","botanical","calm","zen","natural"],dark:["dark","night","noir","moody","gothic","shadow"],warm:["warm","cosy","cozy","homely","rustic","handmade","craft"],corporate:["professional","corporate","business","enterprise","serious","formal"],editorial:["editorial","magazine","newspaper","literary","typographic"],space:["space","cosmic","galaxy","stars","astronomy","sci-fi","scifi"]},qa=[{text:"Page, canvas and the design system",acceptance:"The page opens with the palette applied, the canvas fills its box at any window size, and nothing is unstyled."},{text:"The loop and the world",acceptance:"A requestAnimationFrame loop scaled by elapsed time draws the field; the frame rate does not change the speed of anything."},{text:"Controls — keyboard, pointer and touch",acceptance:"Every action can be performed with a key and with a finger, and arrow keys and space do not scroll the page."},{text:"Rules: collision, scoring, difficulty",acceptance:"Scoring happens on the right event, collisions are correct at the edges, and difficulty changes in a way the player can feel."},{text:"Losing and starting again",acceptance:"There is a way to lose, a screen that says so with the score, and a restart that resets every variable — not a page reload."},{text:"Feel: sound, feedback, HUD",acceptance:"Every meaningful event has feedback, sound is created inside a gesture and can be muted, and the HUD is readable while playing."},{text:"Review and fix",acceptance:"review_project reports no blockers or majors."}],Ua=[{text:"Shell and the design system",acceptance:"The layout holds from 320 px to a wide desktop, with the palette applied throughout."},{text:"The data model and storage",acceptance:"One state object is the single source of truth, and it survives a reload."},{text:"The core actions",acceptance:"Everything the app is for can be done — create, change and remove — with the view re-rendered from state each time."},{text:"Views, filters and search",acceptance:"Every way of looking at the data works, and the active view is visible."},{text:"Empty, loading and error states",acceptance:"A first-time user sees an explanation rather than a blank box, and every failure says what went wrong."},{text:"Keyboard and polish",acceptance:"The primary action has a keyboard path, focus is visible, and destructive actions are undoable or confirmed."},{text:"Review and fix",acceptance:"review_project reports no blockers or majors."}],Ya=[{text:"Write the actual copy",acceptance:"Every heading and paragraph is about the real subject. There is no placeholder text anywhere."},{text:"Structure and the design system",acceptance:"Semantic landmarks, headings in order, and the palette and type scale applied."},{text:"The hero",acceptance:"At 900×700 the headline, the sub-line and the primary action are all visible without scrolling."},{text:"The supporting sections",acceptance:"Each section earns its place and says something specific."},{text:"Responsive and navigation",acceptance:"At 320 px nothing overflows sideways and the navigation still works."},{text:"Metadata and finish",acceptance:"Title, description, favicon, and every link and image resolves."},{text:"Review and fix",acceptance:"review_project reports no blockers or majors."}],Ka=[{text:"Layout and the design system",acceptance:"A responsive card grid with the palette applied."},{text:"The data",acceptance:"Realistic data with units, in one place, shaped the way real data would be."},{text:"The charts",acceptance:"Drawn in SVG or canvas, with labelled axes, a legend and units. Nothing loaded from a CDN."},{text:"Headline figures",acceptance:"Every number has a comparison beside it, so it means something."},{text:"Controls",acceptance:"The range or filter control actually changes what is drawn."},{text:"Review and fix",acceptance:"review_project reports no blockers or majors."}];function Va(e){const t=Q(e.archetype),n=(e.kind==="game"?qa:e.kind==="site"?Ya:e.kind==="viz"?Ka:Ua).map(o=>({...o})),r={"multiplayer-local":{text:"Two-player mode",acceptance:"Both players can play at once on one keyboard, with separate scores."},"ai-opponent":{text:"The computer opponent",acceptance:"It plays legally, it can be beaten on easy, and the difficulty control changes how it plays."},export:{text:"Export",acceptance:"The exported file downloads and opens correctly in the app it is meant for."},import:{text:"Import",acceptance:"A valid file loads, and an invalid one produces a clear message instead of a crash."},charts:{text:"Charts",acceptance:"Axes labelled, units stated, drawn without any external library."},print:{text:"Print stylesheet",acceptance:"Printing produces a clean page with no navigation and no split entries."},darkmode:{text:"Theme toggle",acceptance:"It switches, it persists, and it defaults to the system preference."},tutorial:{text:"Instructions",acceptance:"A first-time player is told what to do before they have to do it."}};for(const o of e.features){const c=r[o];c&&!n.some(l=>l.text===c.text)&&n.splice(n.length-1,0,c)}const s=e.constraints.singleFile?[["index.html","Everything — markup, styles in a <style> tag, script in a <script> tag."]]:t.files??Xa(e);return{milestones:n,manifest:s,definitionOfDone:Ja(e)}}function Xa(e){const t=e.kind==="game"?"game.js":"app.js",a=[["index.html","Markup and nothing else — no inline styles, no inline logic."],["styles.css","The design tokens from the brief, then the layout and components."],[t,e.kind==="game"?"State, the loop, input, rules and rendering.":"State, storage, actions and rendering."]];return e.kind==="game"?a.push(["README.md","What it is, how to play, and the numbers chosen for difficulty."]):a.push(["README.md","What it is and how to use it."]),a}function Ja(e){switch(e.kind){case"game":return"Someone opens it, understands what to do within five seconds, plays a full round without reading anything, loses, and starts again with one press — on a phone as well as a laptop.";case"site":return"Someone lands on it and can say within ten seconds what this is, who it is for and what to do next — and the page still reads well at 320 px.";case"viz":return"Someone can answer a real question from the screen without asking what a number means or what unit it is in.";default:return"Someone can do the thing the app is for, close the tab, come back tomorrow and find their work still there."}}const Za=new Set(["a","an","the","and","or","but","if","then","so","to","of","in","on","at","by","for","with","from","as","is","are","was","be","been","it","its","this","that","these","those","i","me","my","mine","we","our","you","your","they","them","make","makes","making","made","build","building","create","creating","created","write","writing","code","coding","develop","design","do","does","can","could","would","should","will","want","wants","need","needs","please","thanks","thank","like","some","something","thing","things","new","nice","good","great","best","really","very","just","also","about","using","use","uses","have","has","had","where","when","which","what","who","how","lets","let","up","out","me","us","project","website","webpage","page","site","app","application","program","software","simple","basic","small","quick","little","full","complete","working","proper"]),Qa=["add","change","fix","update","remove","delete","rename","move","refactor","improve","tweak","adjust","also","now ","instead","can you make it","make it","it should","the button","the game","why","it doesn","it does not","broken"],en=["react","vue","svelte","angular","next.js","nextjs","tailwind","typescript","node","express","python","flask","django"],tn=new Set(["space","galaxy","stars","astronomy","forest","nature","night","cyber","arcade","pixel","magazine","newspaper","shadow","craft","business"]);function an(e){return` ${e.toLowerCase().replace(/[^a-z0-9+.#\s-]/g," ").replace(/\s+/g," ").trim()} `}function we(e,t){return e.includes(` ${t} `)||e.includes(` ${t}s `)||e.startsWith(`${t} `)}function nn(e){const t=e.split(" ").length;return t*t+1}function sn(e){const t=[],a=[/\bno ([a-z0-9 -]{2,28})/g,/\bwithout ([a-z0-9 -]{2,28})/g,/\bdon'?t (?:want|need|add) ([a-z0-9 -]{2,28})/g,/\bnot? (?:need|want) ([a-z0-9 -]{2,28})/g];for(const n of a)for(const r of e.matchAll(n))t.push(` ${r[1].trim()} `);return t}function rn(e){const t=[];for(const a of e.split(/(?<=[.!?;])\s+|\n+/)){const n=a.trim();n.length<8||n.length>240||/\b(must|should|make sure|has to|needs? to|it should|don'?t|do not|never|always|only|except)\b/i.test(n)&&t.push(n.replace(/\s+/g," "))}return t.slice(0,8)}function jt(e){return e.map(t=>t.length<=2&&/^(of|in|on|to|a)$/.test(t)?t:t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function on(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48)||"project"}function ln(e,t){const a=e.trim(),n=an(a),r=sn(n),s=E=>r.some(k=>k.includes(E));let o={id:"generic-app",score:0,matched:[]},c=0;for(const E of Dt){let k=0;const H=[];for(const ae of E.triggers){if(!we(n,ae))continue;H.push(ae);let bt=nn(ae);n.indexOf(` ${ae} `)<24&&(bt+=2),k+=bt}E.id.startsWith("generic")?k*=.35:E.id==="landing"&&(k*=.6),k>o.score?(c=o.score,o={id:E.id,score:k,matched:H}):k>c&&(c=k)}const l=Q(o.id),u=o.score/(o.score+4),d=o.score===0?0:1-c/(o.score+.001),h=Math.max(0,Math.min(1,u*(.55+.45*d)));let m=l.kind;o.score<3&&(/\bgame\b|\bplay\b/.test(n)?m="game":/\b(site|website|landing|page|blog|portfolio)\b/.test(n)?m="site":/\b(dashboard|chart|graph|visuali[sz])/.test(n)?m="viz":/\b(story|adventure|interactive fiction)\b/.test(n)&&(m="story"));const p=[];for(const[E,k]of Object.entries(Et))k.some(H=>we(n,H))&&!p.includes(E)&&p.push(E);const g=[],S=[];for(const E of at){const k=E.triggers.find(H=>we(n,H));k&&(s(k)?S.push(E.id):g.push(E.id))}const b=m==="game"?["score","highscore","sound"]:m==="app"?["save"]:[];for(const E of b)!g.includes(E)&&!S.includes(E)&&g.push(E);const x=en.find(E=>we(n,E))??null,L={noBuild:!t.canRunCommands,singleFile:/\b(single file|one file|one html file|single html)\b/.test(n),mobile:!/\bdesktop only\b/.test(n),offline:g.includes("offline")||/\b(offline|no internet|without internet)\b/.test(n),framework:x,scheme:/\bdark (mode|theme|version)?\b/.test(n)&&!/\blight\b/.test(n)?"dark":/\blight (mode|theme)\b/.test(n)?"light":null},$=new Set;for(const E of l.triggers)for(const k of E.split(" "))$.add(k);for(const E of at)for(const k of E.triggers)for(const H of k.split(" "))$.add(H);for(const E of Object.values(Et))for(const k of E)$.add(k);for(const E of tn)$.delete(E);const B=[];for(const E of n.trim().split(" ")){const k=E.replace(/^-+|-+$/g,"");k.length<3||Za.has(k)||$.has(k)||/^\d+$/.test(k)||B.includes(k)||B.push(k)}const re=B.slice(0,3).join(" "),N=B.slice(0,6),Z=B.slice(0,2),q=o.matched.slice().sort((E,k)=>k.length-E.length)[0],j=Z.length?jt([...Z,...l.id.startsWith("generic")?[]:[l.label.toLowerCase()]]):q?jt(q.split(" ")):l.label,R=[];h<.34&&R.push("The prompt does not clearly name a kind of project, so the shape below is an interpretation — say if it is wrong."),x&&L.noBuild&&R.push(`${x} was mentioned, but this host has no build step. Building it as plain HTML, CSS and JavaScript instead — it will still run everywhere.`),g.includes("auth")&&R.push("Accounts were mentioned. There is no server here, so sign-in can only be a demonstration — it will be labelled as such rather than faked."),g.includes("realtime")&&!/(open-meteo|openmeteo)/.test(n)&&R.push("Live data was mentioned. Only keyless, CORS-friendly APIs can work from a page like this; anything else needs a key you would have to supply.");const D=n.trim().slice(0,32),O=t.hasFiles&&Qa.some(E=>D.startsWith(E));return{raw:a,title:j,slug:on(j),kind:m,archetype:l.id,archetypeLabel:l.label,confidence:Number(h.toFixed(2)),subject:re,subjectWords:B,mood:p,features:g,excluded:S,entities:N,constraints:L,verbatim:rn(a),unknowns:R,isEdit:O}}const Ge=new Map(at.map(e=>[e.id,e]));function cn(e,t){const a=ln(e,t),n=Wa(a),r=Va(a),s=Q(a.archetype);return{spec:a,design:n,plan:r,archetype:s,text:dn({spec:a,design:n,plan:r,archetype:s})}}function dn(e){const{spec:t,design:a,plan:n,archetype:r}=e,s=[];s.push(`# Build brief — ${t.title}`),s.push("Compiled from the user's message by Maestro, the planner built into this app. It is what they asked for, expanded with what a specialist in this kind of project already knows. Treat it as the specification. Where it contradicts the user's own words, the user wins.");const o=[`**Building:** ${r.label}${t.subject?` about ${t.subject}`:""} — ${r.summary}`];t.mood.length&&o.push(`**Feel:** ${t.mood.join(", ")}`),t.features.length&&o.push(`**Asked for:** ${t.features.map(d=>Ge.get(d)?.label??d).join(", ")}`),t.excluded.length&&o.push(`**Explicitly not wanted:** ${t.excluded.map(d=>Ge.get(d)?.label??d).join(", ")} — do not add these.`),t.confidence<.34&&o.push("**Note:** the request was open-ended, so this reading is a guess. Say what you assumed in your first sentence."),s.push(o.join(`
`)),s.push(`## What "finished" means here
${n.definitionOfDone}`);const c=[...r.mustHave];for(const d of t.features){const h=Ge.get(d);h&&!c.some(m=>m.toLowerCase().includes(h.label))&&c.push(`${h.label[0].toUpperCase()}${h.label.slice(1)}: ${h.note}`)}s.push(`## Requirements
${c.map(d=>`- ${d}`).join(`
`)}`),t.verbatim.length&&s.push(`## The user's own words — these outrank everything else here
${t.verbatim.map(d=>`- "${d}"`).join(`
`)}`),r.tuning.length&&s.push(`## Numbers — use these rather than improvising
These are chosen so the thing is actually playable and fair. Change them only with a reason, and say what the reason was.
`+r.tuning.map(d=>`- ${d}`).join(`
`)),r.pitfalls.length&&s.push(`## How this specific thing usually breaks
Each of these has shipped broken more than once. Check every one before you finish.
`+r.pitfalls.map(d=>`- **${d.symptom}**
  → ${d.fix}`).join(`
`));const l=Fa[t.kind];l?.length&&s.push(`## True of every ${t.kind==="viz"?"data view":t.kind}
${l.map(d=>`- ${d}`).join(`
`)}`),s.push(`## Design direction — ${a.name}
${a.notes}

Use these exact values. Do not substitute a different palette, and do not reach for a purple gradient on white.

\`\`\`css
`+$t(a)+`
\`\`\`
Everything else follows from them: ${a.scheme} scheme, ${a.radius} corners, one accent used sparingly so it still means something. No web fonts — the stacks above are installed everywhere and work offline.`);const u=[];return t.constraints.noBuild&&u.push("There is no build step and no shell. Plain HTML, CSS and JavaScript loaded directly — no npm, no imports from a package, no JSX, no TypeScript."),t.constraints.offline&&u.push("It must work offline: no CDN scripts, no remote fonts, no remote images."),t.constraints.singleFile&&u.push("Everything in one HTML file, as asked."),t.constraints.mobile&&u.push("It must work on a phone — 320 px wide, touch only, no hover."),t.constraints.framework&&t.constraints.noBuild&&u.push(`${t.constraints.framework} was mentioned but cannot be compiled here. Build it in plain JavaScript and say so in one line.`),u.length&&s.push(`## Constraints
${u.map(d=>`- ${d}`).join(`
`)}`),s.push(`## Always
${Ha.map(d=>`- ${d}`).join(`
`)}
${Ga.map(d=>`- ${d}`).join(`
`)}`),s.push(`## Files
${n.manifest.map(([d,h])=>`- \`${d}\` — ${h}`).join(`
`)}`),s.push(`## The plan to publish
Call update_plan with exactly these steps, then keep it current as you go.
`+n.milestones.map((d,h)=>`${h+1}. ${d.text} — done when: ${d.acceptance}`).join(`
`)),s.push(`## Before you say you are finished
Call **review_project**. It reads what you actually wrote and reports what is broken — missing files, unbalanced code, a game with no way to lose, a keyboard-only control scheme, placeholder text left behind. Fix everything it reports as a blocker or a major, then call it again. Do not tell the user it is done while it still reports either.`),t.unknowns.length&&s.push(`## Worth saying out loud
${t.unknowns.map(d=>`- ${d}`).join(`
`)}`),s.join(`

`)}function Mt(e){const t=e.split("");let a=0;const n=e.length,r=(o,c)=>{for(let l=o;l<c&&l<n;l++)t[l]!==`
`&&(t[l]=" ")};let s="";for(;a<n;){const o=e[a],c=e[a+1];if(o==="/"&&c==="/"){const l=e.indexOf(`
`,a);r(a,l===-1?n:l),a=l===-1?n:l;continue}if(o==="/"&&c==="*"){const l=e.indexOf("*/",a+2);r(a,l===-1?n:l+2),a=l===-1?n:l+2;continue}if(o==='"'||o==="'"||o==="`"){let l=a+1;for(;l<n;){if(e[l]==="\\"){l+=2;continue}if(e[l]===o)break;if(o==="`"&&e[l]==="$"&&e[l+1]==="{"){let u=1;for(l+=2;l<n&&u>0;)e[l]==="{"?u++:e[l]==="}"&&u--,l++;continue}l++}r(a+1,l),a=l+1,s=o;continue}if(o==="/"&&c!=="="&&!/[\w)\]]/.test(s)){let l=a+1,u=!1;for(;l<n;){if(e[l]==="\\"){l+=2;continue}if(e[l]==="[")u=!0;else if(e[l]==="]")u=!1;else{if(e[l]==="/"&&!u)break;if(e[l]===`
`){l=-1;break}}l++}if(l>0&&l<n){r(a+1,l),a=l+1,s="/";continue}}/\s/.test(o)||(s=o),a++}return t.join("")}function M(e,t){let a=1;for(let n=0;n<t&&n<e.length;n++)e[n]===`
`&&a++;return a}function It(e){const t=[],a={")":"(","]":"[","}":"{"};for(const n of e)if(n==="("||n==="["||n==="{")t.push(n);else if((n===")"||n==="]"||n==="}")&&t.pop()!==a[n])return{char:n,missing:"open"};return t.length?{char:t[t.length-1],missing:"close"}:null}const un=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),St=new Set(["li","p","td","th","tr","option","dt","dd","thead","tbody","tfoot"]);function At(e,t){const a=[],n=new RegExp(`<${t}\\b[^>]*>([\\s\\S]*?)</${t}>`,"gi");for(const r of e.matchAll(n))a.push(r[1]);return a}const Rt=new Set(["alert","confirm","prompt","fetch","setTimeout","setInterval","clearTimeout","clearInterval","requestAnimationFrame","cancelAnimationFrame","queueMicrotask","structuredClone","atob","btoa","parseInt","parseFloat","isNaN","isFinite","encodeURIComponent","decodeURIComponent","encodeURI","decodeURI","String","Number","Boolean","Array","Object","Math","JSON","Date","RegExp","Error","TypeError","RangeError","Map","Set","WeakMap","WeakSet","Promise","Symbol","Proxy","Reflect","BigInt","Intl","URL","URLSearchParams","Blob","File","FileReader","FormData","Headers","Request","Response","AbortController","Image","Audio","AudioContext","webkitAudioContext","OffscreenCanvas","Path2D","ImageData","DOMParser","MutationObserver","IntersectionObserver","ResizeObserver","CustomEvent","Event","KeyboardEvent","MouseEvent","PointerEvent","TouchEvent","Worker","BroadcastChannel","Notification","ArrayBuffer","Uint8Array","Uint8ClampedArray","Int32Array","Float32Array","Float64Array","DataView","console","window","document","navigator","location","history","localStorage","sessionStorage","performance","screen","matchMedia","getComputedStyle","scrollTo","scrollBy","open","close","addEventListener","removeEventListener","dispatchEvent","postMessage","crypto","speechSynthesis","SpeechSynthesisUtterance","devicePixelRatio","innerWidth","innerHeight","top","self","globalThis","if","for","while","switch","catch","return","typeof","function","super","this","new","await","yield","delete","void","in","of","do","else","try","throw","case","default"]);function zt(e,t){const a=[],n=new Set,r=d=>{const h=`${d.rule}|${d.path}|${d.line??""}|${d.message}`;n.has(h)||(n.add(h),a.push(d))},s=[],o=[];for(const[d,h]of e)/\.m?js$/i.test(d)?s.push(h):/\.css$/i.test(d)?o.push(h):/\.html?$/i.test(d)&&(s.push(...At(h,"script")),o.push(...At(h,"style")));const c=s.join(`
;
`),l={files:e,spec:t,allScript:c,allScriptBare:Mt(c),allStyle:o.join(`
`),add:r};pn(l);for(const[d,h]of e)/\.html?$/i.test(d)?fn(l,d,h):/\.css$/i.test(d)?yn(l,d,h):/\.m?js$/i.test(d)&&vn(l,d,h),mn(l,d,h);bn(l),t&&(wn(l,t),t.kind==="game"&&xn(l,t));const u={blocker:0,major:1,minor:2};return a.sort((d,h)=>u[d.severity]-u[h.severity]||d.path.localeCompare(h.path))}function pn(e){const t=[...e.files.keys()];if(t.length===0){e.add({rule:"project.empty",severity:"blocker",path:".",message:"Nothing was created.",fix:"Write the files. Call write_file with the complete contents of each one."});return}const a=t.some(s=>/(^|\/)index\.html?$/i.test(s)),n=t.some(s=>/\.html?$/i.test(s));!a&&n&&e.add({rule:"project.entry",severity:"major",path:t.find(s=>/\.html?$/i.test(s)),message:"There is HTML but no index.html, so the Preview panel has nothing to open.",fix:"Name the entry page index.html, at the root of the project."}),!n&&e.spec?.constraints.noBuild&&e.add({rule:"project.entry",severity:"blocker",path:".",message:"There is no HTML page, so nothing can run here.",fix:"This host has no build step and no shell. Create index.html and load the CSS and JavaScript from it."});const r=new Set;for(const[s,o]of e.files)if(/\.html?$/i.test(s))for(const c of o.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi))r.add(Ne(c[1]));for(const s of t)/\.(css|m?js)$/i.test(s)&&(r.has(Ne(s))||e.add({rule:"project.orphan-file",severity:"major",path:s,message:`${s} exists but no page loads it, so none of it runs.`,fix:`Add a <link rel="stylesheet" href="${s}"> or <script src="${s}" defer><\/script> to index.html.`}))}function Ne(e){return e.split("?")[0].split("#")[0].replace(/^\.\//,"").replace(/^\//,"").toLowerCase()}const hn=[[/lorem ipsum/i,"lorem ipsum"],[/\bTODO\b|\bFIXME\b/,"a TODO left in the code"],[/your (?:text|content|name|logo) here/i,'a "your text here" placeholder'],[/\bfeature (?:one|two|three)\b/i,'unnamed "Feature One" copy'],[/\bplaceholder (?:text|content)\b/i,"text literally labelled placeholder"],[/coming soon/i,'a "coming soon" stub'],[/implement (?:this|later)|not implemented/i,"an unimplemented stub"],[/\bxxx+\b/i,"XXX filler"]];function mn(e,t,a){const n=a.replace(/\s/g,"");if(n.length===0){e.add({rule:"content.empty-file",severity:"major",path:t,message:`${t} is empty.`,fix:"Either write it properly or delete it."});return}if(n.length<24&&!/\.(md|txt|json)$/i.test(t)&&e.add({rule:"content.empty-file",severity:"major",path:t,message:`${t} is almost empty — ${n.length} characters.`,fix:"Finish it, or delete it if it is not needed."}),!/README|CHANGELOG|NOTES/i.test(t))for(const[r,s]of hn){const o=r.exec(a);o&&e.add({rule:"content.placeholder",severity:"major",path:t,line:M(a,o.index),message:`${t} still contains ${s}.`,fix:"Replace it with the real thing. Placeholder text means the feature is not finished."})}}function fn(e,t,a){const n=/(^|\/)index\.html?$/i.test(t),r=m=>m.test(a);if(n){r(/<!doctype\s+html/i)||e.add({rule:"html.doctype",severity:"minor",path:t,message:"No <!doctype html>, so the browser falls back to quirks mode.",fix:"Put <!doctype html> on the first line."}),r(/<html[^>]*\slang\s*=/i)||e.add({rule:"html.lang",severity:"minor",path:t,message:"The <html> element has no lang attribute.",fix:'Use <html lang="en"> — screen readers need it to choose a voice.'}),r(/<meta[^>]+charset/i)||e.add({rule:"html.charset",severity:"minor",path:t,message:"No charset declaration.",fix:'Add <meta charset="utf-8"> as the first thing in <head>.'});const m=/<title[^>]*>([\s\S]*?)<\/title>/i.exec(a);(!m||!m[1].trim()||/^(document|untitled|title)$/i.test(m[1].trim()))&&e.add({rule:"html.title",severity:"major",path:t,message:"The page has no real <title>.",fix:"Give it the name of the thing — it is the browser tab, the bookmark and the search result."}),r(/<meta[^>]+name=["']viewport["']/i)||e.add({rule:"html.viewport",severity:"major",path:t,message:"No viewport meta tag, so a phone will render the page at desktop width and zoom out.",fix:'Add <meta name="viewport" content="width=device-width, initial-scale=1">.'}),!r(/<meta[^>]+name=["']description["']/i)&&e.spec?.kind==="site"&&e.add({rule:"web.meta-description",severity:"minor",path:t,message:"No meta description.",fix:"Add one sentence describing the page — it is what shows up when the link is shared."})}const s=[],o=/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g,c=a.replace(/<!--[\s\S]*?-->/g,m=>" ".repeat(m.length));let l=null;for(const m of c.matchAll(o)){const p=m[1]==="/",g=m[2].toLowerCase();if(!(un.has(g)||m[3].trimEnd().endsWith("/"))){if(g==="script"||g==="style"){p?s[s.length-1]?.tag===g&&s.pop():s.push({tag:g,index:m.index});continue}if(!p)s.push({tag:g,index:m.index});else{for(;s.length&&St.has(s[s.length-1].tag)&&s[s.length-1].tag!==g;)s.pop();const S=s.pop();if(!S||S.tag!==g){l={tag:g,index:m.index};break}}}}const u=s.filter(m=>!St.has(m.tag));if(l)e.add({rule:"html.unbalanced",severity:"blocker",path:t,line:M(a,l.index),message:`A </${l.tag}> closes something that was never opened, so the rest of the page nests wrongly.`,fix:"Read the markup around that line and match every opening tag with its closing tag."});else if(u.length){const m=u[u.length-1];e.add({rule:"html.unbalanced",severity:"blocker",path:t,line:M(a,m.index),message:`<${m.tag}> is never closed, so everything after it is nested inside it.`,fix:`Add the matching </${m.tag}>.`})}const d=new Map;for(const m of a.matchAll(/\sid\s*=\s*["']([^"']+)["']/gi)){const p=m[1];d.has(p)&&e.add({rule:"html.duplicate-id",severity:"major",path:t,line:M(a,m.index),message:`Two elements share id="${p}" — getElementById will only ever find the first.`,fix:"Ids must be unique. Use a class for the ones that repeat."}),d.set(p,m.index)}const h=new Set([...e.files.keys()].map(Ne));for(const m of a.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)){const p=m[1].trim();/^(https?:|data:|mailto:|tel:|#|javascript:|\/\/)/i.test(p)||p===""||h.has(Ne(p))||e.add({rule:"html.missing-asset",severity:"blocker",path:t,line:M(a,m.index),message:`${t} loads "${p}", which does not exist in the project.`,fix:`Either create ${p} or remove the reference. A missing script means none of the behaviour runs.`})}for(const m of a.matchAll(/\son[a-z]+\s*=\s*["']([^"']+)["']/gi)){const p=/([A-Za-z_$][\w$]*)\s*\(/.exec(m[1]);if(!p)continue;const g=p[1];Rt.has(g)||Wt(e.allScriptBare,g)||e.add({rule:"html.inline-handler-undefined",severity:"blocker",path:t,line:M(a,m.index),message:`An inline handler calls ${g}(), which is not defined anywhere.`,fix:`Define ${g}, or better, remove the inline handler and bind the listener in the script with addEventListener.`})}for(const m of a.matchAll(/<img\b([^>]*)>/gi))/\balt\s*=/.test(m[1])||e.add({rule:"web.alt-text",severity:"major",path:t,line:M(a,m.index),message:"An <img> has no alt attribute.",fix:'Describe the image, or use alt="" if it is purely decorative. Never leave it off.'});if(e.spec?.constraints.offline){const m=/(?:src|href)\s*=\s*["'](https?:)?\/\//i.exec(a);m&&e.add({rule:"web.cdn-offline",severity:"major",path:t,line:M(a,m.index),message:"The page loads something from the internet, but it was asked to work offline.",fix:"Inline it, or replace it — system font stacks instead of web fonts, hand-drawn SVG instead of remote images, and no CDN libraries."})}}function Wt(e,t){const a=t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return[new RegExp(`\\bfunction\\s+${a}\\b`),new RegExp(`\\b(?:const|let|var)\\s+${a}\\b`),new RegExp(`\\bclass\\s+${a}\\b`),new RegExp(`\\b${a}\\s*=\\s*(?:function|\\(|async)`),new RegExp(`window\\.${a}\\s*=`),new RegExp(`\\b${a}\\s*[,)]?\\s*=>`),new RegExp(`\\b${a}\\s*[,}\\]]`),new RegExp(`[(,]\\s*${a}\\s*[),]`)].some(r=>r.test(e))}function gn(e,t){for(const[a,n]of e.files){if(!/\.m?js$/i.test(a))continue;const r=t.exec(n);if(r)return{path:a,line:M(n,r.index)}}return{path:Bt(e)}}function Bt(e){const t=[...e.files.keys()].filter(a=>/\.m?js$/i.test(a));return t.find(a=>!/engine\.js$/i.test(a))??t[0]??[...e.files.keys()][0]??"game.js"}function yn(e,t,a){const n=a.replace(/\/\*[\s\S]*?\*\//g,s=>" ".repeat(s.length)),r=It(n.replace(/[()[\]]/g," "));r&&e.add({rule:"css.unbalanced",severity:"blocker",path:t,message:r.missing==="close"?"A CSS rule is never closed — everything after it is ignored by the browser.":"There is a stray } in the stylesheet.",fix:"Match every { with a }. A single unclosed rule silently kills the rest of the file."})}function bn(e){const t=e.allStyle;if(!t.trim())return;const a=new Set;for(const c of t.matchAll(/(--[\w-]+)\s*:/g))a.add(c[1]);const n=new Set;for(const c of t.matchAll(/var\(\s*(--[\w-]+)\s*([,)])/g))c[2]!==","&&(a.has(c[1])||n.add(c[1]));for(const c of n)e.add({rule:"css.undefined-var",severity:"major",path:"styles.css",message:`var(${c}) is used but never defined, so anything relying on it falls back to nothing.`,fix:`Define ${c} in :root, or use a value that exists.`});const r=c=>{const l=new RegExp(`${c}\\s*:\\s*(#[0-9a-fA-F]{3,8})`).exec(t);return l?l[1]:null},s=[["--ink","--bg","body text on the background",4.5],["--ink-dim","--bg","secondary text on the background",4.5],["--accent-ink","--accent","text on the accent colour",4.5]];for(const[c,l,u,d]of s){const h=r(c),m=r(l);if(!h||!m)continue;const p=Ra(h,m);p<d&&e.add({rule:"web.contrast",severity:"major",path:"styles.css",message:`${u} is only ${p.toFixed(1)}:1 — below the 4.5:1 needed to be readable.`,fix:`Darken ${c} or lighten ${l} until the ratio passes. Low contrast is the most common reason a good-looking page is unusable.`})}!/@media|clamp\(|minmax\(|flex-wrap|grid-template-columns:\s*repeat\(auto/i.test(t)&&t.length>400&&e.add({rule:"web.responsive",severity:"major",path:"styles.css",message:"The stylesheet has no media query and no fluid sizing, so the layout is fixed at one width.",fix:"Add a breakpoint, or use fluid units — clamp(), minmax(), auto-fit grids, flex-wrap. Check it at 320 px before finishing."})}function vn(e,t,a){const n=Mt(a),r=It(n);if(r&&e.add({rule:"js.unbalanced",severity:"blocker",path:t,message:r.missing==="close"?`A ${r.char} is never closed, so the whole file fails to parse and nothing in it runs.`:`There is an unmatched ${r.char}, so the file fails to parse.`,fix:"Read the file back and match every bracket. A syntax error anywhere kills the entire script."}),/\beval\s*\(|new\s+Function\s*\(/.test(n)){const c=/\beval\s*\(|new\s+Function\s*\(/.exec(n);e.add({rule:"app.no-eval",severity:"major",path:t,line:M(a,c.index),message:"eval or new Function is used to run text as code.",fix:"Write the logic properly. For arithmetic, a tokeniser and a precedence-climbing evaluator is about forty lines and cannot be tricked."})}for(const c of a.matchAll(/(innerHTML|outerHTML)\s*[+]?=\s*([`"'][\s\S]{0,600}?[`"'])/g)){const l=c[2];!l.includes("${")&&!l.includes(" + ")||/escapeHtml|escapeHTML|\besc\(|encodeURIComponent|sanitiz/i.test(l)||e.add({rule:"app.escape-output",severity:"major",path:t,line:M(a,c.index),message:"Values are interpolated straight into innerHTML, so any text the user types can inject markup.",fix:'Use textContent for text, or run every interpolated value through an escapeHtml() that replaces &, <, > and ". This is also why a task called <b>hi</b> renders bold instead of showing the tags.'})}const s=new Map;for(const c of n.matchAll(/(^|[^.\w$])([a-z_$][\w$]*)\s*\(/g)){const l=c[2];if(Rt.has(l)||l.length<3||new RegExp(`\\b${l}\\s*\\(\\s*\\)\\s*{`).test(n)&&/^(if|for|while|switch|catch)$/.test(l))continue;let u=s.get(l);u===void 0&&(u=Wt(e.allScriptBare,l),s.set(l,u)),u||e.add({rule:"js.undefined-function",severity:"blocker",path:t,line:M(a,c.index),message:`${l}() is called but never defined, so it throws the moment that line runs — and everything after it stops.`,fix:`Define ${l}, or fix the name if it is a typo.`})}const o=new Map;for(const c of n.matchAll(/^function\s+([A-Za-z_$][\w$]*)/gm)){const l=(o.get(c[1])??0)+1;o.set(c[1],l),l===2&&e.add({rule:"js.duplicate-declaration",severity:"major",path:t,line:M(a,c.index),message:`function ${c[1]} is declared twice — the second one replaces the first, silently.`,fix:"Delete the one that is out of date, or rename it if both are needed."})}}function wn(e,t){const a=e.allScriptBare,n=e.allScript,r=[...e.files.keys()].find(s=>/\.(m?js|html?)$/i.test(s))??"index.html";if(t.constraints.noBuild)for(const[s,o]of e.files){if(/\.(tsx?|jsx)$/i.test(s)&&e.add({rule:"web.build-step",severity:"blocker",path:s,message:`${s} needs to be compiled, and there is no build step here.`,fix:"Rewrite it as plain JavaScript in a .js file loaded by a <script> tag."}),/\.m?js$/i.test(s)){const c=/^\s*import\s+[\s\S]{0,120}?from\s+['"][^./][^'"]*['"]/m.exec(o);c&&e.add({rule:"web.build-step",severity:"blocker",path:s,line:M(o,c.index),message:"This imports from a package, which cannot resolve without a bundler.",fix:"Write the code without the dependency, or load the library from a CDN with a script tag if it is genuinely needed."})}/(^|\/)package\.json$/i.test(s)&&/"dependencies"\s*:\s*{[^}]*"/.test(o)&&e.add({rule:"web.build-step",severity:"major",path:s,message:"A package.json with dependencies cannot be installed here — there is no shell.",fix:"Remove it and build with what the browser gives you."})}if(t.features.includes("save")&&!/localStorage|indexedDB/.test(a)&&e.add({rule:"app.persist",severity:"major",path:r,message:"Nothing is saved, so everything the user does disappears on reload.",fix:'Write state to localStorage on every change and read it back on load. Use a versioned key such as "'+t.slug+'.v1".'}),t.features.includes("timer")||t.archetype==="timer"){const s=/Date\.now\(\)|performance\.now\(\)|new Date\(\)/.test(a);/setInterval/.test(a)&&!s&&e.add({rule:"app.timer-drift",severity:"major",path:r,message:"The timer counts down inside setInterval without checking the clock, so it drifts — and a background tab throttles it to once a second or less.",fix:"Store the target timestamp once, then compute remaining = target - Date.now() on each tick. The interval becomes a repaint trigger, not the source of truth."})}(t.archetype==="budget"||t.archetype==="ecommerce")&&!/Math\.round|cents|toFixed\(2\)/.test(a)&&e.add({rule:"app.money-float",severity:"minor",path:r,message:"Money looks like it is being held in floating point, which will eventually be a penny out.",fix:"Store amounts as integer cents and divide by 100 only when displaying."}),t.archetype==="drawing"&&!/devicePixelRatio/.test(a)&&e.add({rule:"app.canvas-dpr",severity:"minor",path:r,message:"The canvas is not scaled for the device pixel ratio, so strokes will look soft on a phone or a retina screen.",fix:"Set canvas.width = cssWidth * devicePixelRatio and ctx.scale(dpr, dpr) — and redraw after any resize, because resizing clears the canvas."}),t.archetype==="resume"&&!/@media\s+print/i.test(e.allStyle)&&e.add({rule:"site.print",severity:"major",path:"styles.css",message:"A résumé with no print stylesheet will print with a dark background and split sections.",fix:"Add @media print: black on white, navigation hidden, page-break-inside: avoid on each entry."}),t.kind==="viz"&&/canvas|<svg/i.test(n)&&(/fillText|<text/i.test(n)||e.add({rule:"viz.axis-labels",severity:"major",path:r,message:"The charts have no text on them, so no axis is labelled and no unit is stated.",fix:"Label both axes, name every series, and state the unit once. A chart without units is decoration."}))}function xn(e,t){const a=Q(t.archetype),n=new Set(a.checks),r=e.allScriptBare,s=e.allScript,o=Bt(e),c=l=>n.has(l);if(c("game.loop")&&!/requestAnimationFrame/.test(r)&&e.add({rule:"game.loop",severity:"blocker",path:o,message:"There is no animation loop, so nothing on screen can move.",fix:"Drive the game from requestAnimationFrame, and scale every movement by the elapsed time between frames."}),c("game.delta-time")&&/requestAnimationFrame/.test(r)&&(/\b(dt|delta|elapsed|deltaTime)\b/.test(r)||/performance\.now\(\)|\bnow\s*-\s*last/.test(r)||e.add({rule:"game.delta-time",severity:"major",path:o,message:"The loop moves things by a fixed amount per frame, so the game runs at double speed on a 120 Hz screen and half speed on a slow one.",fix:"Take the timestamp requestAnimationFrame passes in, work out the seconds since the last frame, and multiply every movement by it."})),c("game.touch-input")&&(/pointerdown|pointermove|touchstart|touchmove|['"]click['"]|onclick/.test(s)||e.add({rule:"game.touch-input",severity:"major",path:o,message:"The only controls are on the keyboard, so the game cannot be played on a phone at all.",fix:"Add pointer or touch handlers for every action — a swipe, a tap zone, or on-screen buttons. Roughly half the people who open this will be on a phone."})),c("game.key-scroll")&&/keydown|keyup/.test(s)){const l=/preventDefault/.test(s);/Arrow(Up|Down|Left|Right)|['"] ['"]|Space/.test(s)&&!l&&e.add({rule:"game.key-scroll",severity:"major",path:o,message:"Arrow keys and space are read but never prevented, so playing scrolls the page underneath the game.",fix:"Call event.preventDefault() in the keydown handler for the keys the game uses."})}if(c("game.lose-state")&&!/game ?over|gameOver|isOver|\bdead\b|\blost\b|lose\(|defeat/i.test(s)&&e.add({rule:"game.lose-state",severity:"major",path:o,message:"There is no way to lose, so there is no game — just a toy.",fix:"Add a fail condition and a screen that says what the score was, then offer a restart."}),c("game.restart")&&!/restart|resetGame|newGame|playAgain|tryAgain|\breset\(/i.test(s)&&e.add({rule:"game.restart",severity:"major",path:o,message:"There is no way to play again without reloading the page.",fix:"Write a restart that resets every piece of state — score, position, speed, entities, timers — and bind it to a button and a key."}),c("game.score")&&!/\bscore\b/i.test(s)&&e.add({rule:"game.score",severity:"major",path:o,message:"Nothing is scored, so there is no reason to play twice.",fix:"Keep a score, show it while playing, and save the best one to localStorage."}),c("game.spawn-offscreen")){/(?:spawn|start|enter|note|obstacle|enemy|pipe|bullet|x|y)\w*\s*[:=]\s*-\s*\d/i.test(r)||/[:=]\s*[^;\n]{0,40}\b(?:canvas\.)?(?:width|height|W|H|VIEW_W|VIEW_H)\s*\+\s*\d/.test(r)||e.add({rule:"game.spawn-offscreen",severity:"blocker",path:o,message:"Nothing is created outside the visible field, which means the things the player has to react to appear already on top of them. This is unplayable, and it is the single most common way this kind of game ships broken.",fix:"Spawn every obstacle, enemy or note off screen — above the top edge, or beyond the right edge — and let it travel in. Work out how long it is visible before it matters (distance ÷ speed) and state that number. It must be at least 1.2 seconds."});const u=/(?=.*\b(?:push|spawn|create|add|unshift)\w*\s*\()(?=.*\by\s*[:=]\s*(?:hitLine|hitY|HIT_Y|HITLINE|targetY|TARGET_Y|judgeLine|JUDGE_Y|goalY|GOAL_Y)\b).*/m,d=gn(e,u);u.test(r)&&e.add({rule:"game.spawn-offscreen",severity:"blocker",path:d.path,line:d.line,message:"Something is created at the hit line itself, so the player has zero time to react to it.",fix:"A note is scheduled by the time it must be hit. Create it travelTime seconds earlier, off the top of the field, and derive its position from how long ago it was created."})}c("game.collision")&&!/Math\.(?:abs|hypot|sqrt)|\bintersect|\boverlap|\bcollide|\bhitTest/i.test(r)&&e.add({rule:"game.collision",severity:"minor",path:o,message:"No collision maths anywhere — nothing appears to be able to hit anything.",fix:"Add a real overlap test. For boxes compare edges; for circles compare the distance between centres with the sum of the radii."}),c("game.difficulty")&&(/speed\s*[+*]=|\+=\s*0\.\d|level\s*\+\+|difficulty|Math\.min\([^)]*speed|Math\.max\([^)]*interval/i.test(r)||e.add({rule:"game.difficulty",severity:"minor",path:o,message:"The difficulty never changes, so the game is the same at 30 seconds as at 3 minutes.",fix:"Raise the speed or the spawn rate gradually, and cap it so it stays possible."})),c("game.audio-unlock")&&/AudioContext/.test(s)&&(/\.resume\(\)/.test(s)||e.add({rule:"game.audio-unlock",severity:"major",path:o,message:"An AudioContext is created but never resumed, so there will be no sound until the page is reloaded after a click — often no sound at all.",fix:"Create or resume() the context inside the first real user gesture (the start button, the first key press). Browsers suspend any context made before that."}))}function ot(e){const t={blocker:0,major:0,minor:0};for(const a of e)t[a.severity]++;return t}function Le(e){const t=ot(e);if(!e.length)return"Nothing wrong found";const a=[];return t.blocker&&a.push(`${t.blocker} blocker${t.blocker===1?"":"s"}`),t.major&&a.push(`${t.major} major`),t.minor&&a.push(`${t.minor} minor`),a.join(", ")}function Ot(e,t={}){if(!e.length)return"Review passed: no blockers, no majors, no minors. The project is structurally sound, runnable, responsive and free of placeholder content.";const a=ot(e),n=[`Review of what is actually in the project — ${Le(e)}.`,""];for(const r of["blocker","major","minor"]){const s=e.filter(o=>o.severity===r);if(s.length){n.push(r==="blocker"?"BLOCKERS — the project does not work until these are fixed:":r==="major"?"MAJOR — it runs, but it is not finished:":"MINOR — worth doing if there is time:");for(const o of s.slice(0,14))n.push(`- [${o.rule}] ${o.path}${o.line?`:${o.line}`:""} — ${o.message}`),n.push(`  Fix: ${o.fix}`);s.length>14&&n.push(`  …and ${s.length-14} more of the same kind.`),n.push("")}}return t.final!==!0&&(a.blocker||a.major)&&n.push("Fix the blockers and the majors now — read each file first, then edit it. Do not reply to the user until they are gone. When you have fixed them, call review_project again to confirm."),n.join(`
`)}function kn(e,t,a){const n=[];for(const[r,s]of e){if(!/\.html?$/i.test(r))continue;let o=s;const c=[];/<!doctype\s+html/i.test(o)||(o=`<!doctype html>
${o.replace(/^\s*<!doctype[^>]*>\s*/i,"")}`,c.push("added the missing <!doctype html>")),/<html\b/i.test(o)&&!/<html[^>]*\slang\s*=/i.test(o)&&(o=o.replace(/<html\b/i,'<html lang="en"'),c.push('set lang="en" on <html>'));const l=/<head[^>]*>/i.exec(o);if(l){const u=[];if(/<meta[^>]+charset/i.test(o)||(u.push('  <meta charset="utf-8">'),c.push('added <meta charset="utf-8">')),/<meta[^>]+name=["']viewport["']/i.test(o)||(u.push('  <meta name="viewport" content="width=device-width, initial-scale=1">'),c.push("added the viewport tag so it renders properly on a phone")),t&&t.kind==="site"&&!/<meta[^>]+name=["']description["']/i.test(o)){const d=`${t.title}${t.subject?` — ${t.subject}`:""}.`.replace(/"/g,"");u.push(`  <meta name="description" content="${d}">`),c.push("added a meta description")}u.length&&(o=o.replace(l[0],`${l[0]}
${u.join(`
`)}`))}!/<title[^>]*>[\s\S]*?<\/title>/i.test(o)&&l&&t&&(o=o.replace(/<head[^>]*>/i,u=>`${u}
  <title>${Ht(t.title)}</title>`),c.push(`added the page title "${t.title}"`)),l&&!/rel=["'](?:shortcut )?icon["']/i.test(o)&&a&&t&&(o=o.replace(/<head[^>]*>/i,u=>`${u}
  <link rel="icon" href="${jn(t.title,a)}">`),c.push("added a favicon so the browser tab is not blank"));for(const u of e.keys()){if(u===r)continue;const d=u.replace(/^\.\//,"");En(e,d)||(/\.css$/i.test(u)&&/<\/head>/i.test(o)?(o=o.replace(/<\/head>/i,`  <link rel="stylesheet" href="${d}">
</head>`),c.push(`linked ${d}, which nothing was loading`)):/\.m?js$/i.test(u)&&/<\/body>/i.test(o)&&(o=o.replace(/<\/body>/i,`  <script src="${d}" defer><\/script>
</body>`),c.push(`loaded ${d}, which nothing was loading`)))}o!==s&&n.push({path:r,content:o,fixes:c})}return n}function En(e,t){const a=t.toLowerCase();for(const[n,r]of e)if(/\.html?$/i.test(n)){for(const s of r.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi))if(s[1].split("?")[0].split("#")[0].replace(/^\.\//,"").replace(/^\//,"").toLowerCase()===a)return!0}return!1}function Ht(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function jn(e,t){const a=Ht((e.trim()[0]??"M").toUpperCase()),n=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='${t.colors.accent}'/><text x='32' y='44' font-family='system-ui,sans-serif' font-size='38' font-weight='700' text-anchor='middle' fill='${t.colors.accentInk}'>${a}</text></svg>`;return`data:image/svg+xml,${encodeURIComponent(n)}`}function nt(e,t){const a=e.subject?e.subject.split(" ")[0]:"task",n=a.endsWith("s")?a:`${a}s`,r=`/* --- ${e.title} ---------------------------------------------------
   One array of items is the only truth; the list is rendered from it every
   time. Nothing is ever read back out of the DOM, which is what stops
   filtering losing items and reordering duplicating them.

   Item text goes in with textContent. Never innerHTML: a ${a} called
   <img onerror=alert(1)> would otherwise run. */

var KEY = '${e.slug}.v1';

var items = load();
var filter = 'all';

var listEl = document.getElementById('list');
var formEl = document.getElementById('add-form');
var inputEl = document.getElementById('add-input');
var countEl = document.getElementById('count');
var emptyEl = document.getElementById('empty');
var clearEl = document.getElementById('clear-done');

function load() {
  var saved = Engine.store.get(KEY, null);
  return Array.isArray(saved) ? saved : [];
}

function save() {
  Engine.store.set(KEY, items);
}

function uid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
}

function add(text) {
  var trimmed = text.trim();
  if (!trimmed) return;
  items.unshift({ id: uid(), text: trimmed, done: false, createdAt: Date.now() });
  save();
  render();
}

function toggle(id) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].id === id) { items[i].done = !items[i].done; break; }
  }
  save();
  render();
}

function remove(id) {
  items = items.filter(function (item) { return item.id !== id; });
  save();
  render();
}

function rename(id, text) {
  var trimmed = text.trim();
  if (!trimmed) return remove(id);
  for (var i = 0; i < items.length; i++) {
    if (items[i].id === id) { items[i].text = trimmed; break; }
  }
  save();
  render();
}

function visible() {
  if (filter === 'active') return items.filter(function (i) { return !i.done; });
  if (filter === 'done') return items.filter(function (i) { return i.done; });
  return items;
}

function render() {
  var shown = visible();
  listEl.textContent = '';

  for (var i = 0; i < shown.length; i++) {
    listEl.appendChild(row(shown[i]));
  }

  var left = items.filter(function (i) { return !i.done; }).length;
  countEl.textContent = items.length === 0
    ? 'Nothing yet'
    : left + ' of ' + items.length + ' ${n} left';

  emptyEl.hidden = shown.length > 0;
  emptyEl.textContent = items.length === 0
    ? 'No ${n} yet. Type one above and press Enter.'
    : filter === 'done' ? 'Nothing finished yet.' : 'Nothing left here — try another filter.';

  clearEl.hidden = !items.some(function (i) { return i.done; });
}

function row(item) {
  var li = document.createElement('li');
  li.className = 'item' + (item.done ? ' is-done' : '');

  var check = document.createElement('input');
  check.type = 'checkbox';
  check.className = 'item__check';
  check.checked = item.done;
  check.id = 'chk-' + item.id;
  check.addEventListener('change', function () { toggle(item.id); });

  var label = document.createElement('label');
  label.className = 'item__text';
  label.setAttribute('for', check.id);
  label.textContent = item.text;                    /* never innerHTML */

  /* Double click to edit in place; Escape cancels, Enter and blur commit. */
  label.addEventListener('dblclick', function () {
    var editor = document.createElement('input');
    editor.type = 'text';
    editor.className = 'item__editor';
    editor.value = item.text;
    li.replaceChild(editor, label);
    editor.focus();
    editor.setSelectionRange(editor.value.length, editor.value.length);

    var cancelled = false;
    editor.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') editor.blur();
      if (e.key === 'Escape') { cancelled = true; editor.blur(); }
    });
    editor.addEventListener('blur', function () {
      if (cancelled) render();
      else rename(item.id, editor.value);
    });
  });

  var del = document.createElement('button');
  del.type = 'button';
  del.className = 'item__delete';
  del.textContent = 'Delete';
  del.setAttribute('aria-label', 'Delete ' + item.text);
  del.addEventListener('click', function () { remove(item.id); });

  li.appendChild(check);
  li.appendChild(label);
  li.appendChild(del);
  return li;
}

formEl.addEventListener('submit', function (e) {
  e.preventDefault();
  add(inputEl.value);
  inputEl.value = '';
  inputEl.focus();                                  /* so a list can be typed straight through */
});

var filterButtons = document.querySelectorAll('[data-filter]');
for (var f = 0; f < filterButtons.length; f++) {
  (function (button) {
    button.addEventListener('click', function () {
      filter = button.dataset.filter;
      for (var b = 0; b < filterButtons.length; b++) {
        filterButtons[b].setAttribute('aria-pressed', filterButtons[b] === button ? 'true' : 'false');
      }
      render();
    });
  })(filterButtons[f]);
}

clearEl.addEventListener('click', function () {
  items = items.filter(function (i) { return !i.done; });
  save();
  render();
});

render();
inputEl.focus();
`,s=`      <form class="add" id="add-form">
        <input id="add-input" class="add__input" type="text" autocomplete="off"
               placeholder="Add a ${a} and press Enter" aria-label="New ${a}">
        <button type="submit" class="btn">Add</button>
      </form>

      <div class="bar">
        <p class="muted" id="count">Nothing yet</p>
        <div class="filters" role="group" aria-label="Filter">
          <button type="button" data-filter="all" aria-pressed="true">All</button>
          <button type="button" data-filter="active" aria-pressed="false">Active</button>
          <button type="button" data-filter="done" aria-pressed="false">Done</button>
        </div>
        <button type="button" class="link" id="clear-done" hidden>Clear finished</button>
      </div>

      <ul class="list" id="list"></ul>
      <p class="empty" id="empty">No ${n} yet. Type one above and press Enter.</p>`;return{script:r,markup:s,css:`
.add { display: flex; gap: 10px; }
.add__input {
  flex: 1;
  min-height: 48px;
  padding: 0 14px;
  font: inherit;
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.add__input::placeholder { color: var(--ink-dim); }

.bar { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.bar .muted { margin-right: auto; }

.filters { display: flex; gap: 4px; padding: 3px; background: var(--surface-alt); border-radius: var(--radius); }
.filters button {
  min-height: 36px;
  padding: 0 14px;
  border-radius: calc(var(--radius) - 2px);
  color: var(--ink-dim);
  font-size: 0.9rem;
}
.filters button[aria-pressed="true"] { background: var(--surface); color: var(--ink); box-shadow: var(--shadow); }

.link { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; font-size: 0.9rem; }

.list { list-style: none; padding: 0; display: grid; gap: 8px; }
.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.item__check { width: 20px; height: 20px; accent-color: var(--accent); flex: none; }
.item__text { flex: 1; cursor: pointer; word-break: break-word; }
.item.is-done .item__text { color: var(--ink-dim); text-decoration: line-through; }
.item__editor {
  flex: 1;
  font: inherit;
  color: var(--ink);
  background: var(--surface-alt);
  border: 1px solid var(--accent);
  border-radius: 6px;
  padding: 4px 8px;
}
.item__delete { color: var(--ink-dim); font-size: 0.85rem; opacity: 0; transition: opacity var(--motion); }
.item:hover .item__delete, .item__delete:focus-visible { opacity: 1; }
@media (hover: none) { .item__delete { opacity: 1; } }

.empty {
  padding: 32px 16px;
  text-align: center;
  color: var(--ink-dim);
  border: 1px dashed var(--line);
  border-radius: var(--radius);
}
.empty[hidden] { display: none; }`,howTo:[`Type a ${a} and press Enter.`,"Click the checkbox to finish one; double-click the text to edit it.","The filters show all, unfinished, or finished. Everything is saved as you go."],notes:["One array is the only source of truth and the list is re-rendered from it, so filtering and reordering cannot lose or duplicate anything.","Item text is written with textContent, so a title containing markup shows as text rather than running.","Saved to localStorage on every change — not on unload, which does not fire reliably on a phone.","The delete button is always visible on touch devices, where there is no hover to reveal it."],engine:!0,scriptName:"app.js"}}function Sn(e,t){return{script:`/* --- ${e.title} ---------------------------------------------------
   The expression is parsed and evaluated properly: a tokeniser, then a
   precedence-climbing parser. About sixty lines, and unlike eval it cannot
   be handed something that runs code, and unlike a left-to-right chain it
   gets 2 + 3 * 4 right. */

var expression = '';
var lastAnswer = 0;
var justEvaluated = false;

var exprEl = document.getElementById('expr');
var resultEl = document.getElementById('result');

/* ---- tokenise ---- */
function tokenise(source) {
  var tokens = [];
  var i = 0;
  while (i < source.length) {
    var ch = source[i];
    if (ch === ' ') { i++; continue; }
    if (ch >= '0' && ch <= '9' || ch === '.') {
      var start = i;
      while (i < source.length && (source[i] >= '0' && source[i] <= '9' || source[i] === '.')) i++;
      tokens.push({ type: 'number', value: parseFloat(source.slice(start, i)) });
      continue;
    }
    if ('+-*/()%'.indexOf(ch) >= 0) { tokens.push({ type: ch }); i++; continue; }
    throw new Error('Unexpected character');
  }
  return tokens;
}

/* ---- parse and evaluate ---- */
var PRECEDENCE = { '+': 1, '-': 1, '*': 2, '/': 2 };

function parse(tokens) {
  var position = 0;

  function peek() { return tokens[position]; }
  function next() { return tokens[position++]; }

  function primary() {
    var token = next();
    if (!token) throw new Error('Unfinished expression');
    if (token.type === 'number') {
      var value = token.value;
      while (peek() && peek().type === '%') { next(); value = value / 100; }
      return value;
    }
    if (token.type === '-') return -primary();
    if (token.type === '+') return primary();
    if (token.type === '(') {
      var inner = expr(1);
      var closing = next();
      if (!closing || closing.type !== ')') throw new Error('Missing closing bracket');
      return inner;
    }
    throw new Error('Unexpected symbol');
  }

  function expr(minPrecedence) {
    var left = primary();
    while (true) {
      var token = peek();
      if (!token || !PRECEDENCE[token.type] || PRECEDENCE[token.type] < minPrecedence) break;
      next();
      var right = expr(PRECEDENCE[token.type] + 1);
      if (token.type === '+') left = left + right;
      else if (token.type === '-') left = left - right;
      else if (token.type === '*') left = left * right;
      else {
        if (right === 0) throw new Error('divide by zero');
        left = left / right;
      }
    }
    return left;
  }

  var value = expr(1);
  if (position < tokens.length) throw new Error('Unexpected trailing symbol');
  return value;
}

/** 12 significant digits, then trailing zeros stripped: no 0.30000000000000004. */
function format(value) {
  if (!isFinite(value)) return 'Cannot divide by zero';
  var text = Number(value.toPrecision(12)).toString();
  if (text.indexOf('e') >= 0) return Number(value).toExponential(6);
  return text;
}

function preview() {
  exprEl.textContent = expression || '0';
  if (!expression) { resultEl.textContent = '0'; return; }
  try {
    var value = parse(tokenise(expression));
    resultEl.textContent = format(value);
    resultEl.classList.remove('is-error');
  } catch (err) {
    resultEl.textContent = '';
  }
  fitDisplay();
}

function fitDisplay() {
  var length = resultEl.textContent.length;
  resultEl.style.fontSize = length > 15 ? '1.6rem' : length > 11 ? '2.2rem' : length > 8 ? '2.8rem' : '3.4rem';
}

function press(key) {
  Engine.audio.tone(440, 0.02, 'sine', 0.05);

  if (key === 'C') { expression = ''; justEvaluated = false; preview(); return; }
  if (key === 'CE') { expression = expression.slice(0, -1); justEvaluated = false; preview(); return; }
  if (key === '=') {
    if (!expression) return;
    try {
      var value = parse(tokenise(expression));
      lastAnswer = value;
      expression = format(value);
      resultEl.classList.remove('is-error');
      justEvaluated = true;
    } catch (err) {
      resultEl.textContent = err.message === 'divide by zero' ? 'Cannot divide by zero' : 'That is not a complete sum';
      resultEl.classList.add('is-error');
      justEvaluated = true;
      exprEl.textContent = expression;
      return;
    }
    exprEl.textContent = expression;
    resultEl.textContent = expression;
    fitDisplay();
    return;
  }
  if (key === '+/-') {
    expression = expression.charAt(0) === '-' ? expression.slice(1) : '-' + expression;
    preview();
    return;
  }

  /* Typing a digit straight after equals starts a new sum; an operator continues. */
  if (justEvaluated) {
    if ('0123456789.'.indexOf(key) >= 0) expression = '';
    justEvaluated = false;
  }
  expression += key;
  preview();
}

var buttons = document.querySelectorAll('[data-key]');
for (var i = 0; i < buttons.length; i++) {
  (function (button) {
    button.addEventListener('click', function () {
      Engine.audio.unlock();
      press(button.dataset.key);
    });
  })(buttons[i]);
}

window.addEventListener('keydown', function (e) {
  var key = e.key;
  if ('0123456789.+-*/()%'.indexOf(key) >= 0 && key.length === 1) { press(key); e.preventDefault(); }
  else if (key === 'Enter' || key === '=') { press('='); e.preventDefault(); }
  else if (key === 'Backspace') { press('CE'); e.preventDefault(); }
  else if (key === 'Escape' || key === 'Delete') { press('C'); e.preventDefault(); }
});

preview();
`,markup:`      <div class="calc">
        <div class="calc__display">
          <p class="calc__expr" id="expr" aria-live="off">0</p>
          <output class="calc__result" id="result" aria-live="polite">0</output>
        </div>

        <div class="calc__keys">
          <button type="button" data-key="C" class="key key--fn">C</button>
          <button type="button" data-key="CE" class="key key--fn">←</button>
          <button type="button" data-key="%" class="key key--fn">%</button>
          <button type="button" data-key="/" class="key key--op">÷</button>

          <button type="button" data-key="7" class="key">7</button>
          <button type="button" data-key="8" class="key">8</button>
          <button type="button" data-key="9" class="key">9</button>
          <button type="button" data-key="*" class="key key--op">×</button>

          <button type="button" data-key="4" class="key">4</button>
          <button type="button" data-key="5" class="key">5</button>
          <button type="button" data-key="6" class="key">6</button>
          <button type="button" data-key="-" class="key key--op">−</button>

          <button type="button" data-key="1" class="key">1</button>
          <button type="button" data-key="2" class="key">2</button>
          <button type="button" data-key="3" class="key">3</button>
          <button type="button" data-key="+" class="key key--op">+</button>

          <button type="button" data-key="+/-" class="key">±</button>
          <button type="button" data-key="0" class="key">0</button>
          <button type="button" data-key="." class="key">.</button>
          <button type="button" data-key="=" class="key key--equals">=</button>
        </div>
      </div>

      <p class="muted small">Keyboard works too — digits, operators, Enter for equals, Backspace to delete, Escape to clear.</p>`,css:`
.calc {
  width: min(100%, 420px);
  margin-inline: auto;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.calc__display {
  padding: 22px 20px 16px;
  text-align: right;
  background: var(--surface-alt);
  min-height: 128px;
  display: grid;
  align-content: end;
  gap: 6px;
}
.calc__expr {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--ink-dim);
  word-break: break-all;
  max-width: none;
}
.calc__result {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 3.4rem;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
  word-break: break-all;
}
.calc__result.is-error { font-size: 1.2rem; color: var(--bad); }

.calc__keys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--line); }
.key {
  min-height: 68px;
  background: var(--surface);
  font-size: 1.3rem;
  font-weight: 600;
  transition: background var(--motion);
}
.key:hover { background: var(--surface-alt); }
.key:active { background: var(--line); }
.key--fn { color: var(--ink-dim); }
.key--op { color: var(--accent); font-size: 1.5rem; }
.key--equals { background: var(--accent); color: var(--accent-ink); }
.key--equals:hover { background: var(--accent); filter: brightness(1.08); }

.small { font-size: 0.88rem; text-align: center; }

@media (max-width: 420px) { .key { min-height: 60px; } .calc__result { font-size: 2.8rem; } }`,howTo:["Click the keys or type — digits, + − × ÷, brackets, Enter for equals.","Backspace deletes, Escape clears, ± flips the sign.","The answer previews live as you type; equals commits it."],notes:["Expressions are tokenised and parsed with precedence climbing, so 2 + 3 × 4 is 14 and brackets work. No eval anywhere.","Results are rounded to 12 significant digits and trailing zeros stripped, so 0.1 + 0.2 shows 0.3.","Dividing by zero says so in words instead of showing Infinity.","Keys are at least 60 px tall — comfortably above the 44 px minimum touch target."],engine:!0,scriptName:"app.js"}}function An(e,t){return{script:`/* --- ${e.title} ---------------------------------------------------
   The timer is a target timestamp, not a counter. remaining = target -
   Date.now() on every tick, so it stays exact even though a background tab
   throttles setInterval to once a second or slower. Counting down inside
   the interval is the classic way this loses a minute in twenty. */

var KEY = '${e.slug}.settings';
var DEFAULTS = { work: 25, short: 5, long: 15, rounds: 4 };

var settings = Object.assign({}, DEFAULTS, Engine.store.get(KEY, {}) || {});
var mode = 'work';
var target = 0;
var remaining = settings.work * 60000;
var running = false;
var round = 1;
var ticker = 0;

var timeEl = document.getElementById('time');
var modeEl = document.getElementById('mode');
var roundEl = document.getElementById('round');
var startEl = document.getElementById('start');
var resetEl = document.getElementById('reset');
var skipEl = document.getElementById('skip');
var ringEl = document.getElementById('ring-progress');
var pageTitle = document.title;

var RING = 2 * Math.PI * 130;
ringEl.style.strokeDasharray = String(RING);

function lengthFor(which) {
  return (which === 'work' ? settings.work : which === 'short' ? settings.short : settings.long) * 60000;
}

function label(which) {
  return which === 'work' ? 'Focus' : which === 'short' ? 'Short break' : 'Long break';
}

function format(ms) {
  var total = Math.max(0, Math.ceil(ms / 1000));
  var minutes = Math.floor(total / 60);
  var seconds = total % 60;
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function paint() {
  var text = format(remaining);
  timeEl.textContent = text;
  modeEl.textContent = label(mode);
  roundEl.textContent = 'Round ' + round + ' of ' + settings.rounds;
  document.title = running ? text + ' · ' + label(mode) : pageTitle;

  var fraction = 1 - remaining / lengthFor(mode);
  ringEl.style.strokeDashoffset = String(RING * Math.max(0, Math.min(1, fraction)));
  document.body.dataset.mode = mode;
}

function tick() {
  remaining = target - Date.now();
  if (remaining <= 0) {
    remaining = 0;
    paint();
    complete();
    return;
  }
  paint();
}

function start() {
  if (running) return pause();
  Engine.audio.unlock();
  running = true;
  target = Date.now() + remaining;
  startEl.textContent = 'Pause';
  // 250ms so the seconds never appear to skip; the clock is the truth.
  ticker = setInterval(tick, 250);
  paint();
}

function pause() {
  running = false;
  clearInterval(ticker);
  remaining = Math.max(0, target - Date.now());
  startEl.textContent = 'Start';
  paint();
}

function reset() {
  running = false;
  clearInterval(ticker);
  remaining = lengthFor(mode);
  startEl.textContent = 'Start';
  paint();
}

function chime() {
  // Three beeps rather than one: a single tone is easy to miss.
  for (var i = 0; i < 3; i++) {
    (function (n) {
      setTimeout(function () { Engine.audio.tone(880, 0.18, 'triangle', 0.2); }, n * 300);
    })(i);
  }
}

function complete() {
  running = false;
  clearInterval(ticker);
  chime();
  document.body.classList.add('is-done');
  setTimeout(function () { document.body.classList.remove('is-done'); }, 1600);
  advance();
}

function advance() {
  if (mode === 'work') {
    if (round >= settings.rounds) { mode = 'long'; round = 1; }
    else { mode = 'short'; round++; }
  } else {
    mode = 'work';
  }
  remaining = lengthFor(mode);
  startEl.textContent = 'Start';
  paint();
}

startEl.addEventListener('click', start);
resetEl.addEventListener('click', reset);
skipEl.addEventListener('click', function () { clearInterval(ticker); running = false; advance(); });

var inputs = document.querySelectorAll('[data-setting]');
for (var i = 0; i < inputs.length; i++) {
  (function (input) {
    input.value = String(settings[input.dataset.setting]);
    input.addEventListener('change', function () {
      var value = Math.max(1, Math.min(180, Number(input.value) || DEFAULTS[input.dataset.setting]));
      input.value = String(value);
      settings[input.dataset.setting] = value;
      Engine.store.set(KEY, settings);
      if (!running) reset();
    });
  })(inputs[i]);
}

window.addEventListener('keydown', function (e) {
  if (e.key === ' ') { e.preventDefault(); start(); }
  if (e.key === 'r') reset();
});

paint();
`,markup:`      <div class="timer">
        <svg class="ring" viewBox="0 0 300 300" role="img" aria-label="Time remaining">
          <circle class="ring__track" cx="150" cy="150" r="130" />
          <circle class="ring__progress" id="ring-progress" cx="150" cy="150" r="130" />
        </svg>
        <div class="timer__readout">
          <p class="timer__mode" id="mode">Focus</p>
          <p class="timer__time" id="time" role="timer" aria-live="off">25:00</p>
          <p class="timer__round muted" id="round">Round 1 of 4</p>
        </div>
      </div>

      <div class="timer__controls">
        <button type="button" class="btn" id="start">Start</button>
        <button type="button" class="btn btn--ghost" id="reset">Reset</button>
        <button type="button" class="btn btn--ghost" id="skip">Skip</button>
      </div>

      <details class="settings">
        <summary>Lengths</summary>
        <div class="settings__grid">
          <label>Focus <input type="number" data-setting="work" min="1" max="180"></label>
          <label>Short break <input type="number" data-setting="short" min="1" max="60"></label>
          <label>Long break <input type="number" data-setting="long" min="1" max="60"></label>
          <label>Rounds <input type="number" data-setting="rounds" min="1" max="12"></label>
        </div>
      </details>

      <p class="muted small">Space starts and pauses. R resets. The remaining time shows in the browser tab.</p>`,css:`
.timer { position: relative; width: min(100%, 340px); margin-inline: auto; aspect-ratio: 1; }
.ring { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring__track { fill: none; stroke: var(--surface-alt); stroke-width: 14; }
.ring__progress {
  fill: none;
  stroke: var(--accent);
  stroke-width: 14;
  stroke-linecap: round;
  transition: stroke-dashoffset 250ms linear, stroke 400ms var(--motion);
}
body[data-mode="short"] .ring__progress, body[data-mode="long"] .ring__progress { stroke: var(--good); }

.timer__readout { position: absolute; inset: 0; display: grid; place-content: center; text-align: center; gap: 4px; }
.timer__mode { font-size: 0.8rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-dim); }
.timer__time {
  font-family: var(--font-display);
  font-size: clamp(52px, 16vw, 72px);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.timer__round { font-size: 0.9rem; }

.timer__controls { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }

.settings { max-width: 480px; margin-inline: auto; width: 100%; }
.settings summary { cursor: pointer; color: var(--ink-dim); padding: 8px 0; }
.settings__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(140px, 100%), 1fr)); gap: 12px; padding-top: 8px; }
.settings label { display: grid; gap: 4px; font-size: 0.85rem; color: var(--ink-dim); }
.settings input {
  min-height: 44px; padding: 0 12px; font: inherit; color: var(--ink);
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
}

.small { text-align: center; font-size: 0.88rem; }

body.is-done { animation: flash 400ms 3 var(--motion); }
@keyframes flash { 50% { background: var(--accent); } }`,howTo:["Start, pause and reset with the buttons, or space and R.","Focus runs 25 minutes, then a 5 minute break, with a longer one after four rounds. All four lengths are editable and remembered.","The remaining time appears in the browser tab, so it is visible from another window."],notes:["The timer stores a target timestamp and computes the remaining time from Date.now() on every tick — a background tab throttles setInterval, and counting down inside it loses about a minute in twenty.","The display updates every 250 ms so seconds never appear to skip.","The end signal is three 880 Hz beeps 300 ms apart plus a visual flash, because sound alone fails on a muted phone.","The AudioContext is created inside the Start click — one made on page load is suspended and stays silent."],engine:!0,scriptName:"app.js"}}function _n(e,t){return{script:`/* --- ${e.title} ---------------------------------------------------
   Two things that are easy to get wrong and ruin a drawing app:

   Setting canvas.width or canvas.height CLEARS the canvas, so a resize has
   to copy the bitmap out and draw it back. And the backing store must be
   sized by devicePixelRatio or every stroke is soft on a phone.

   Pointer events cover mouse, pen and touch in one path, and pointer
   capture means a stroke that leaves the canvas still finishes properly. */

var canvas = document.getElementById('paper');
var ctx = canvas.getContext('2d');
var wrap = document.getElementById('paper-wrap');

var drawing = false;
var last = null;
var undoStack = [];
var MAX_UNDO = 20;

var state = {
  color: getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#111',
  size: 6,
  erasing: false
};

function sizeCanvas() {
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width = wrap.clientWidth;
  var height = Math.max(320, Math.round(width * 0.66));

  /* Copy what is there before resizing, because resizing wipes it. */
  var snapshot = document.createElement('canvas');
  snapshot.width = canvas.width;
  snapshot.height = canvas.height;
  if (canvas.width && canvas.height) snapshot.getContext('2d').drawImage(canvas, 0, 0);

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  var background = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#fff';
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  if (snapshot.width) ctx.drawImage(snapshot, 0, 0, snapshot.width / dpr, snapshot.height / dpr);
}

function pushUndo() {
  try {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length > MAX_UNDO) undoStack.shift();
    document.getElementById('undo').disabled = false;
  } catch (err) { /* nothing to lose if the browser refuses */ }
}

function undo() {
  var image = undoStack.pop();
  if (!image) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.putImageData(image, 0, 0);
  ctx.restore();
  document.getElementById('undo').disabled = undoStack.length === 0;
}

function point(e) {
  var rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top, pressure: e.pressure > 0 ? e.pressure : 0.5 };
}

canvas.addEventListener('pointerdown', function (e) {
  canvas.setPointerCapture(e.pointerId);
  pushUndo();
  drawing = true;
  last = point(e);
  stroke(last, last);
});

canvas.addEventListener('pointermove', function (e) {
  if (!drawing) return;
  var now = point(e);
  stroke(last, now);
  last = now;
});

function stop() { drawing = false; last = null; }
canvas.addEventListener('pointerup', stop);
canvas.addEventListener('pointercancel', stop);

function stroke(from, to) {
  var background = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#fff';
  ctx.strokeStyle = state.erasing ? background : state.color;
  ctx.lineWidth = state.size * (state.erasing ? 2.4 : 0.6 + to.pressure * 1.1);
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  /* A quadratic through the midpoint, or fast strokes look like polygons. */
  ctx.quadraticCurveTo(from.x, from.y, (from.x + to.x) / 2, (from.y + to.y) / 2);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

var swatches = document.querySelectorAll('[data-color]');
for (var i = 0; i < swatches.length; i++) {
  (function (swatch) {
    swatch.style.setProperty('--swatch', swatch.dataset.color);
    swatch.addEventListener('click', function () {
      state.color = getComputedStyle(document.documentElement).getPropertyValue(swatch.dataset.color).trim() || swatch.dataset.color;
      state.erasing = false;
      document.getElementById('erase').setAttribute('aria-pressed', 'false');
      for (var s = 0; s < swatches.length; s++) swatches[s].setAttribute('aria-pressed', swatches[s] === swatch ? 'true' : 'false');
    });
  })(swatches[i]);
}

document.getElementById('size').addEventListener('input', function (e) {
  state.size = Number(e.target.value);
  document.getElementById('size-value').textContent = e.target.value + ' px';
});

document.getElementById('erase').addEventListener('click', function (e) {
  state.erasing = !state.erasing;
  e.currentTarget.setAttribute('aria-pressed', state.erasing ? 'true' : 'false');
});

document.getElementById('undo').addEventListener('click', undo);

document.getElementById('clear').addEventListener('click', function () {
  pushUndo();
  var background = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#fff';
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
});

document.getElementById('save').addEventListener('click', function () {
  var link = document.createElement('a');
  link.download = '${e.slug}.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

window.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
});

var resizeTimer = 0;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(sizeCanvas, 150);
});

sizeCanvas();
document.getElementById('undo').disabled = true;
`,markup:`      <div class="tools">
        <div class="swatches" role="group" aria-label="Colour">
          <button type="button" class="swatch" data-color="--ink" aria-pressed="true" aria-label="Ink"></button>
          <button type="button" class="swatch" data-color="--accent" aria-pressed="false" aria-label="Accent"></button>
          <button type="button" class="swatch" data-color="--accent-2" aria-pressed="false" aria-label="Second accent"></button>
          <button type="button" class="swatch" data-color="--good" aria-pressed="false" aria-label="Green"></button>
          <button type="button" class="swatch" data-color="--bad" aria-pressed="false" aria-label="Red"></button>
        </div>

        <label class="field field--inline">
          <span>Brush</span>
          <input type="range" id="size" min="1" max="42" value="6">
          <output id="size-value">6 px</output>
        </label>

        <button type="button" class="btn btn--ghost" id="erase" aria-pressed="false">Eraser</button>
        <button type="button" class="btn btn--ghost" id="undo">Undo</button>
        <button type="button" class="btn btn--ghost" id="clear">Clear</button>
        <button type="button" class="btn" id="save">Save PNG</button>
      </div>

      <div class="paper-wrap" id="paper-wrap">
        <canvas id="paper" aria-label="Drawing area"></canvas>
      </div>

      <p class="muted small">Mouse, finger or pen. Pressure is used where the device reports it. Ctrl+Z undoes.</p>`,css:`
.tools { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.swatches { display: flex; gap: 6px; }
.swatch {
  --swatch: var(--ink);
  width: 34px; height: 34px;
  border-radius: 50%;
  background: var(--swatch);
  border: 2px solid var(--line);
}
.swatch[aria-pressed="true"] { outline: 2px solid var(--accent); outline-offset: 2px; }

.field--inline { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--ink-dim); }
.field--inline input[type="range"] { width: 120px; accent-color: var(--accent); }
.field--inline output { font-variant-numeric: tabular-nums; min-width: 46px; }

.paper-wrap { width: 100%; }
.paper-wrap canvas {
  display: block;
  width: 100%;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  touch-action: none;         /* or drawing scrolls the page on a phone */
  cursor: crosshair;
}

.small { font-size: 0.88rem; }`,howTo:["Draw with a mouse, a finger or a pen — pressure is used where the device reports it.","Pick a colour, change the brush size, or switch to the eraser.","Ctrl+Z undoes up to 20 strokes. Save PNG downloads what is on the paper."],notes:["The canvas backing store is sized by devicePixelRatio, so strokes are sharp on a phone and on a retina screen.","A resize copies the bitmap out and draws it back, because setting canvas.width clears it — that is why drawings normally vanish when the window changes.","touch-action: none plus pointer capture, so drawing does not scroll the page and a stroke that leaves the canvas still finishes.","Strokes are interpolated with a quadratic through the midpoint, otherwise a fast line looks like a polygon."],engine:!0,scriptName:"app.js"}}function Cn(e,t){const a=e.subject||"the service",n=`/* --- ${e.title} ---------------------------------------------------
   The data is generated from a fixed seed so it looks like real traffic and
   does not jump about between reloads. Replace makeSeries() with your own
   source; everything below works off the same shape. */

var RANGES = { '7': 7, '30': 30, '90': 90 };
var range = 30;

/** A tiny seeded generator — same numbers every time the page loads. */
function seeded(seed) {
  var value = seed;
  return function () {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function makeSeries(days, seed, base, drift, noise) {
  var random = seeded(seed);
  var points = [];
  var level = base;
  var today = new Date();
  for (var i = days - 1; i >= 0; i--) {
    var date = new Date(today.getTime() - i * 86400000);
    level = level * (1 + drift) + (random() - 0.5) * noise;
    /* weekends are quieter, which is what makes a chart look real */
    var weekend = date.getDay() === 0 || date.getDay() === 6;
    points.push({
      date: date,
      value: Math.max(0, Math.round(level * (weekend ? 0.68 : 1)))
    });
  }
  return points;
}

function sum(points) {
  var total = 0;
  for (var i = 0; i < points.length; i++) total += points[i].value;
  return total;
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(Math.round(n));
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/* ---- line chart ------------------------------------------------- */

function lineChart(target, points, unit, colour) {
  var W = 720, H = 260, PAD_L = 52, PAD_B = 34, PAD_T = 14, PAD_R = 12;
  var max = 0;
  for (var i = 0; i < points.length; i++) max = Math.max(max, points[i].value);
  max = niceMax(max);

  var plotW = W - PAD_L - PAD_R;
  var plotH = H - PAD_T - PAD_B;
  var stepX = plotW / Math.max(1, points.length - 1);

  var svg = ns('svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Daily ' + unit + ' over the last ' + points.length + ' days');

  /* horizontal grid and the y axis labels — a chart without units is decoration */
  for (var g = 0; g <= 4; g++) {
    var value = (max / 4) * g;
    var y = PAD_T + plotH - (value / max) * plotH;
    var grid = ns('line');
    grid.setAttribute('x1', String(PAD_L));
    grid.setAttribute('x2', String(W - PAD_R));
    grid.setAttribute('y1', String(y));
    grid.setAttribute('y2', String(y));
    grid.setAttribute('class', 'grid');
    svg.appendChild(grid);

    var label = ns('text');
    label.setAttribute('x', String(PAD_L - 10));
    label.setAttribute('y', String(y + 4));
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('class', 'axis');
    label.textContent = formatNumber(value);
    svg.appendChild(label);
  }

  var d = '';
  var area = '';
  for (var p = 0; p < points.length; p++) {
    var px = PAD_L + p * stepX;
    var py = PAD_T + plotH - (points[p].value / max) * plotH;
    d += (p === 0 ? 'M' : 'L') + px.toFixed(1) + ' ' + py.toFixed(1) + ' ';
  }
  area = d + 'L' + (PAD_L + plotW).toFixed(1) + ' ' + (PAD_T + plotH) + ' L' + PAD_L + ' ' + (PAD_T + plotH) + ' Z';

  var fill = ns('path');
  fill.setAttribute('d', area);
  fill.setAttribute('fill', colour);
  fill.setAttribute('opacity', '0.14');
  svg.appendChild(fill);

  var line = ns('path');
  line.setAttribute('d', d.trim());
  line.setAttribute('fill', 'none');
  line.setAttribute('stroke', colour);
  line.setAttribute('stroke-width', '2.5');
  line.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(line);

  /* x axis: first, middle and last date, so it is readable at any width */
  var marks = [0, Math.floor(points.length / 2), points.length - 1];
  for (var m = 0; m < marks.length; m++) {
    var mark = ns('text');
    mark.setAttribute('x', String(PAD_L + marks[m] * stepX));
    mark.setAttribute('y', String(H - 10));
    mark.setAttribute('text-anchor', m === 0 ? 'start' : m === 2 ? 'end' : 'middle');
    mark.setAttribute('class', 'axis');
    mark.textContent = formatDate(points[marks[m]].date);
    svg.appendChild(mark);
  }

  var unitLabel = ns('text');
  unitLabel.setAttribute('x', String(PAD_L));
  unitLabel.setAttribute('y', '10');
  unitLabel.setAttribute('class', 'axis');
  unitLabel.textContent = unit + ' per day';
  svg.appendChild(unitLabel);

  target.textContent = '';
  target.appendChild(svg);
}

/* ---- bar chart -------------------------------------------------- */

function barChart(target, rows, unit, colour) {
  var W = 720, H = 260, PAD_L = 108, PAD_B = 28, PAD_T = 10, PAD_R = 16;
  var max = 0;
  for (var i = 0; i < rows.length; i++) max = Math.max(max, rows[i].value);
  max = niceMax(max);

  var plotW = W - PAD_L - PAD_R;
  var band = (H - PAD_T - PAD_B) / rows.length;

  var svg = ns('svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', unit + ' by source');

  for (var r = 0; r < rows.length; r++) {
    var y = PAD_T + r * band;
    var width = (rows[r].value / max) * plotW;      /* bars always start at zero */

    var bar = ns('rect');
    bar.setAttribute('x', String(PAD_L));
    bar.setAttribute('y', String(y + band * 0.18));
    bar.setAttribute('width', String(Math.max(2, width)));
    bar.setAttribute('height', String(band * 0.64));
    bar.setAttribute('fill', colour);
    bar.setAttribute('rx', '3');
    svg.appendChild(bar);

    var name = ns('text');
    name.setAttribute('x', String(PAD_L - 12));
    name.setAttribute('y', String(y + band / 2 + 4));
    name.setAttribute('text-anchor', 'end');
    name.setAttribute('class', 'axis');
    name.textContent = rows[r].label;
    svg.appendChild(name);

    var value = ns('text');
    value.setAttribute('x', String(PAD_L + Math.max(2, width) + 8));
    value.setAttribute('y', String(y + band / 2 + 4));
    value.setAttribute('class', 'axis');
    value.textContent = formatNumber(rows[r].value);
    svg.appendChild(value);
  }

  var caption = ns('text');
  caption.setAttribute('x', String(PAD_L));
  caption.setAttribute('y', String(H - 8));
  caption.setAttribute('class', 'axis');
  caption.textContent = 'Total ' + unit + ' in the period';
  svg.appendChild(caption);

  target.textContent = '';
  target.appendChild(svg);
}

function niceMax(value) {
  if (value <= 0) return 10;
  var magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / magnitude) * magnitude;
}

function ns(tag) {
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

/* ---- tiles ------------------------------------------------------- */

function tile(id, current, previous, unit) {
  var valueEl = document.getElementById(id);
  var deltaEl = document.getElementById(id + '-delta');
  valueEl.textContent = formatNumber(current) + (unit || '');
  if (!previous) { deltaEl.textContent = 'no earlier period'; return; }
  var change = ((current - previous) / previous) * 100;
  deltaEl.textContent = (change >= 0 ? '+' : '') + change.toFixed(1) + '% vs the previous ' + range + ' days';
  deltaEl.className = 'tile__delta ' + (change >= 0 ? 'is-up' : 'is-down');
}

/* ---- render ------------------------------------------------------ */

function accentColour(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#4c9aff';
}

function render() {
  var visits = makeSeries(range * 2, 20260812, 900, 0.004, 140);
  var signups = makeSeries(range * 2, 77712, 62, 0.006, 22);

  var currentVisits = visits.slice(range);
  var earlierVisits = visits.slice(0, range);
  var currentSignups = signups.slice(range);
  var earlierSignups = signups.slice(0, range);

  tile('visits', sum(currentVisits), sum(earlierVisits), '');
  tile('signups', sum(currentSignups), sum(earlierSignups), '');
  tile('rate', (sum(currentSignups) / Math.max(1, sum(currentVisits))) * 100, (sum(earlierSignups) / Math.max(1, sum(earlierVisits))) * 100, '%');
  tile('session', 214, 226, 's');

  lineChart(document.getElementById('chart-line'), currentVisits, 'Visits', accentColour('--accent'));

  barChart(document.getElementById('chart-bar'), [
    { label: 'Direct', value: Math.round(sum(currentVisits) * 0.34) },
    { label: 'Search', value: Math.round(sum(currentVisits) * 0.28) },
    { label: 'Referral', value: Math.round(sum(currentVisits) * 0.19) },
    { label: 'Social', value: Math.round(sum(currentVisits) * 0.13) },
    { label: 'Email', value: Math.round(sum(currentVisits) * 0.06) }
  ], 'Visits', accentColour('--accent-2'));

  document.getElementById('period').textContent = 'Last ' + range + ' days';
}

var buttons = document.querySelectorAll('[data-range]');
for (var i = 0; i < buttons.length; i++) {
  (function (button) {
    button.addEventListener('click', function () {
      range = RANGES[button.dataset.range];
      for (var b = 0; b < buttons.length; b++) {
        buttons[b].setAttribute('aria-pressed', buttons[b] === button ? 'true' : 'false');
      }
      render();
    });
  })(buttons[i]);
}

render();
window.addEventListener('resize', render);
`,r=`      <div class="dash-head">
        <div>
          <h2>${a.charAt(0).toUpperCase()}${a.slice(1)} overview</h2>
          <p class="muted" id="period">Last 30 days</p>
        </div>
        <div class="ranges" role="group" aria-label="Time range">
          <button type="button" data-range="7" aria-pressed="false">7 days</button>
          <button type="button" data-range="30" aria-pressed="true">30 days</button>
          <button type="button" data-range="90" aria-pressed="false">90 days</button>
        </div>
      </div>

      <div class="tiles">
        <article class="tile"><h3>Visits</h3><p class="tile__value" id="visits">—</p><p class="tile__delta" id="visits-delta"></p></article>
        <article class="tile"><h3>Sign-ups</h3><p class="tile__value" id="signups">—</p><p class="tile__delta" id="signups-delta"></p></article>
        <article class="tile"><h3>Conversion</h3><p class="tile__value" id="rate">—</p><p class="tile__delta" id="rate-delta"></p></article>
        <article class="tile"><h3>Median session</h3><p class="tile__value" id="session">—</p><p class="tile__delta" id="session-delta"></p></article>
      </div>

      <section class="panel">
        <h3>Visits per day</h3>
        <div class="chart" id="chart-line"></div>
      </section>

      <section class="panel">
        <h3>Where they came from</h3>
        <div class="chart" id="chart-bar"></div>
      </section>

      <p class="muted small">The figures are generated sample data with a fixed seed, so they are stable between reloads. Replace makeSeries() in app.js with your own source.</p>`;return{script:n,markup:r,css:`
.dash-head { display: flex; gap: 16px; align-items: end; justify-content: space-between; flex-wrap: wrap; }
.dash-head h2 { font-size: var(--step-2); }

.ranges { display: flex; gap: 4px; padding: 3px; background: var(--surface-alt); border-radius: var(--radius); }
.ranges button { min-height: 38px; padding: 0 14px; border-radius: calc(var(--radius) - 2px); color: var(--ink-dim); font-size: 0.9rem; }
.ranges button[aria-pressed="true"] { background: var(--surface); color: var(--ink); box-shadow: var(--shadow); }

.tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr)); gap: 14px; }
.tile { padding: 18px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); }
.tile h3 { font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-dim); font-family: var(--font-body); }
.tile__value { font-family: var(--font-display); font-size: 2rem; font-weight: 700; font-variant-numeric: tabular-nums; margin-top: 6px; }
.tile__delta { font-size: 0.85rem; color: var(--ink-dim); margin-top: 2px; }
.tile__delta.is-up { color: var(--good); }
.tile__delta.is-down { color: var(--bad); }

.panel { padding: 18px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); }
.panel h3 { font-size: 1rem; margin-bottom: 12px; }
.chart { overflow-x: auto; }
.chart svg { width: 100%; height: auto; min-width: 420px; display: block; }
.chart .grid { stroke: var(--line); stroke-width: 1; }
.chart .axis { fill: var(--ink-dim); font-size: 11px; font-family: var(--font-body); }

.small { font-size: 0.85rem; }`,howTo:["Switch the range with the 7, 30 and 90 day buttons — the tiles and both charts change with it.","Replace makeSeries() in app.js with a real data source; everything else works off the same shape."],notes:["Both charts are inline SVG built in the page — no chart library, so nothing can fail to load and the drawing stays sharp at any size.","Every axis is labelled, both charts state their unit, and the bars start at zero.","Every headline figure carries its change against the previous period of the same length; a number with no baseline says nothing.","The sample data uses a fixed seed and a weekend dip, so it looks like real traffic and does not jump between reloads.","Charts scroll horizontally inside their panel below 420 px rather than squashing."],engine:!1,scriptName:"app.js"}}const Tn=`/* Engine — the small runtime every game in this project is built on.
   Canvas fitting, a time-based loop, input, sound and particles. */
(function (global) {
  'use strict';

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rand(lo, hi) { return lo + Math.random() * (hi - lo); }
  function randInt(lo, hi) { return Math.floor(rand(lo, hi + 1)); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = list[i]; list[i] = list[j]; list[j] = t;
    }
    return list;
  }
  /** Axis-aligned box overlap. Boxes are {x, y, w, h} with x,y at the corner. */
  function overlaps(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }
  /** Circle overlap by centre distance — cheaper and fairer than boxes. */
  function circlesHit(ax, ay, ar, bx, by, br) {
    var dx = ax - bx, dy = ay - by, r = ar + br;
    return dx * dx + dy * dy <= r * r;
  }

  /* ---------------------------------------------------------------- stage */

  /**
   * A canvas that always shows the same logical W x H field, fitted to
   * whatever space it has, sharp on any pixel ratio.
   */
  function stage(canvas, W, H) {
    var ctx = canvas.getContext('2d');
    var api = { canvas: canvas, ctx: ctx, W: W, H: H, scale: 1 };

    function resize() {
      var box = canvas.parentElement || document.body;
      var availW = box.clientWidth || window.innerWidth;
      var availH = box.clientHeight || window.innerHeight;
      var scale = Math.min(availW / W, availH / H);
      if (!isFinite(scale) || scale <= 0) scale = 1;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.width = Math.floor(W * scale) + 'px';
      canvas.style.height = Math.floor(H * scale) + 'px';
      canvas.width = Math.max(1, Math.floor(W * scale * dpr));
      canvas.height = Math.max(1, Math.floor(H * scale * dpr));
      // Everything below draws in logical units and comes out sharp.
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      api.scale = scale;
    }

    /** Client coordinates to field coordinates. */
    api.toLocal = function (clientX, clientY) {
      var r = canvas.getBoundingClientRect();
      return { x: (clientX - r.left) * (W / r.width), y: (clientY - r.top) * (H / r.height) };
    };
    api.resize = resize;

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', function () { setTimeout(resize, 120); });
    return api;
  }

  /* ----------------------------------------------------------------- loop */

  /**
   * step(dt, time) is called once per frame with the seconds since the last
   * one, clamped so a backgrounded tab never resumes with a huge jump.
   */
  function loop(step) {
    var raf = 0, last = 0, running = false;

    function frame(t) {
      if (!running) return;
      if (!last) last = t;
      var dt = (t - last) / 1000;
      last = t;
      if (dt > 0.05) dt = 0.05;
      step(dt, t / 1000);
      raf = requestAnimationFrame(frame);
    }

    return {
      start: function () {
        if (running) return;
        running = true; last = 0;
        raf = requestAnimationFrame(frame);
      },
      stop: function () { running = false; cancelAnimationFrame(raf); },
      isRunning: function () { return running; }
    };
  }

  /* ---------------------------------------------------------------- input */

  var keys = Object.create(null);
  var keyDownHandlers = [];
  // The keys a game uses that would otherwise scroll the page.
  var SWALLOW = { ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1, ' ': 1, Spacebar: 1, PageUp: 1, PageDown: 1, Home: 1, End: 1 };

  window.addEventListener('keydown', function (e) {
    if (SWALLOW[e.key]) e.preventDefault();
    keys[e.key] = true;
    if (typeof e.key === 'string') keys[e.key.toLowerCase()] = true;
    if (!e.repeat) {
      for (var i = 0; i < keyDownHandlers.length; i++) keyDownHandlers[i](e.key, e);
    }
  }, { passive: false });

  window.addEventListener('keyup', function (e) {
    keys[e.key] = false;
    if (typeof e.key === 'string') keys[e.key.toLowerCase()] = false;
  });

  window.addEventListener('blur', function () { for (var k in keys) keys[k] = false; });

  var input = {
    held: function (key) { return !!keys[key]; },
    /** Any of several keys, so WASD and the arrows are one call. */
    any: function (list) {
      for (var i = 0; i < list.length; i++) if (keys[list[i]]) return true;
      return false;
    },
    onKey: function (fn) { keyDownHandlers.push(fn); },
    clear: function () { for (var k in keys) keys[k] = false; }
  };

  /**
   * Pointer input for one element, in field coordinates, with swipes.
   * Pointer events cover mouse, pen and touch in one path.
   */
  function pointer(el, st, handlers) {
    var start = null;
    el.style.touchAction = 'none';

    el.addEventListener('pointerdown', function (e) {
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* not fatal */ }
      var p = st.toLocal(e.clientX, e.clientY);
      start = { x: e.clientX, y: e.clientY, t: performance.now(), swiped: false };
      if (handlers.down) handlers.down(p, e);
    });

    el.addEventListener('pointermove', function (e) {
      var p = st.toLocal(e.clientX, e.clientY);
      if (handlers.move) handlers.move(p, e);
      if (start && !start.swiped && handlers.swipe) {
        var dx = e.clientX - start.x, dy = e.clientY - start.y;
        // 24px, so a slightly shaky tap is not read as a swipe.
        if (Math.abs(dx) > 24 || Math.abs(dy) > 24) {
          start.swiped = true;
          handlers.swipe(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
        }
      }
    });

    function end(e) {
      var p = st.toLocal(e.clientX, e.clientY);
      var wasTap = start && !start.swiped && performance.now() - start.t < 320;
      if (handlers.up) handlers.up(p, e);
      if (wasTap && handlers.tap) handlers.tap(p, e);
      start = null;
    }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', function () { start = null; });
  }

  /* ---------------------------------------------------------------- audio */

  /**
   * Sound synthesised on the spot — no files to load, nothing to 404.
   * The context is created on the first unlock() call, which every game makes
   * from inside a real gesture, because a context made before one is suspended.
   */
  var audio = {
    ctx: null,
    muted: false,

    unlock: function () {
      if (!this.ctx) {
        var AC = global.AudioContext || global.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },

    tone: function (freq, dur, type, gain) {
      if (this.muted) return;
      var ctx = this.unlock();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var amp = ctx.createGain();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      amp.gain.setValueAtTime(0.0001, ctx.currentTime);
      amp.gain.exponentialRampToValueAtTime(gain || 0.14, ctx.currentTime + 0.008);
      amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (dur || 0.12));
      osc.connect(amp); amp.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (dur || 0.12) + 0.02);
    },

    /** A short slide, for pickups and jumps. */
    sweep: function (from, to, dur, gain) {
      if (this.muted) return;
      var ctx = this.unlock();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var amp = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(from, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), ctx.currentTime + dur);
      amp.gain.setValueAtTime(gain || 0.16, ctx.currentTime);
      amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(amp); amp.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur + 0.02);
    },

    /** Filtered noise, for hits and explosions. */
    noise: function (dur, gain) {
      if (this.muted) return;
      var ctx = this.unlock();
      if (!ctx) return;
      var len = Math.floor(ctx.sampleRate * (dur || 0.2));
      var buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      var src = ctx.createBufferSource();
      var amp = ctx.createGain();
      src.buffer = buffer;
      amp.gain.value = gain || 0.16;
      src.connect(amp); amp.connect(ctx.destination);
      src.start();
    },

    toggle: function () {
      this.muted = !this.muted;
      if (!this.muted) this.unlock();
      return this.muted;
    }
  };

  /* ------------------------------------------------------------ particles */

  /** A fixed pool, so a long game never grows its memory. */
  function particles(max) {
    var pool = [];
    for (var i = 0; i < (max || 220); i++) pool.push({ alive: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, size: 3, color: '#fff' });

    return {
      burst: function (x, y, count, color, speed) {
        var made = 0;
        for (var i = 0; i < pool.length && made < count; i++) {
          var p = pool[i];
          if (p.alive) continue;
          var a = Math.random() * Math.PI * 2;
          var s = (speed || 160) * (0.35 + Math.random() * 0.9);
          p.alive = true; p.x = x; p.y = y;
          p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s;
          p.max = p.life = 0.35 + Math.random() * 0.4;
          p.size = 2 + Math.random() * 3;
          p.color = color;
          made++;
        }
      },
      update: function (dt, gravity) {
        for (var i = 0; i < pool.length; i++) {
          var p = pool[i];
          if (!p.alive) continue;
          p.life -= dt;
          if (p.life <= 0) { p.alive = false; continue; }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += (gravity == null ? 420 : gravity) * dt;
        }
      },
      draw: function (ctx) {
        for (var i = 0; i < pool.length; i++) {
          var p = pool[i];
          if (!p.alive) continue;
          ctx.globalAlpha = Math.max(0, p.life / p.max);
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
      },
      clear: function () { for (var i = 0; i < pool.length; i++) pool[i].alive = false; }
    };
  }

  /* -------------------------------------------------------------- shake */

  function shaker() {
    var amount = 0;
    return {
      kick: function (n) { amount = Math.max(amount, n); },
      update: function (dt) { amount = Math.max(0, amount - dt * 26); },
      apply: function (ctx) {
        if (amount <= 0) return;
        ctx.translate(rand(-amount, amount), rand(-amount, amount));
      }
    };
  }

  /* -------------------------------------------------------------- storage */

  /** localStorage is unavailable in some private modes; never let that throw. */
  var store = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (err) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) { /* full or blocked */ }
    }
  };

  /* --------------------------------------------------------------- text */

  function text(ctx, str, x, y, size, color, align, font) {
    ctx.fillStyle = color;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '700 ' + size + 'px ' + (font || 'system-ui, sans-serif');
    ctx.fillText(str, x, y);
  }

  function roundRect(ctx, x, y, w, h, r) {
    var rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  global.Engine = {
    stage: stage,
    loop: loop,
    input: input,
    pointer: pointer,
    audio: audio,
    particles: particles,
    shaker: shaker,
    store: store,
    text: text,
    roundRect: roundRect,
    clamp: clamp,
    lerp: lerp,
    rand: rand,
    randInt: randInt,
    pick: pick,
    shuffle: shuffle,
    overlaps: overlaps,
    circlesHit: circlesHit
  };
})(window);
`,V=`/* --- the scaffold every arcade game here shares --- */

/** Palette, read from the stylesheet so the game matches the page. */
var css = getComputedStyle(document.documentElement);
function token(name, fallback) {
  var v = css.getPropertyValue(name);
  return v && v.trim() ? v.trim() : fallback;
}
var C = {
  bg: token('--bg', '#101014'),
  surface: token('--surface', '#1a1a20'),
  surfaceAlt: token('--surface-alt', '#24242c'),
  ink: token('--ink', '#f2f2f5'),
  inkDim: token('--ink-dim', '#9a9aa6'),
  line: token('--line', '#33333d'),
  accent: token('--accent', '#5ad1ff'),
  accentInk: token('--accent-ink', '#06202b'),
  accent2: token('--accent-2', '#ffcf6b'),
  good: token('--good', '#4ad991'),
  bad: token('--bad', '#ff5f56')
};

function Game(opts) {
  var stage = Engine.stage(document.getElementById('game'), opts.W, opts.H);
  var ctx = stage.ctx;
  var overlay = document.getElementById('overlay');
  var overlayTitle = document.getElementById('overlay-title');
  var overlayText = document.getElementById('overlay-text');
  var startBtn = document.getElementById('start');
  var scoreEl = document.getElementById('score');
  var bestEl = document.getElementById('best');
  var muteBtn = document.getElementById('mute');

  var api = {
    W: opts.W,
    H: opts.H,
    stage: stage,
    ctx: ctx,
    score: 0,
    best: Number(Engine.store.get(opts.key, 0)) || 0,
    playing: false,
    paused: false,
    particles: Engine.particles(240),
    shake: Engine.shaker()
  };

  bestEl.textContent = String(api.best);

  api.setScore = function (n) {
    api.score = n;
    scoreEl.textContent = String(Math.floor(n));
    if (n > api.best) {
      api.best = n;
      bestEl.textContent = String(Math.floor(n));
      Engine.store.set(opts.key, n);
    }
  };
  api.addScore = function (n) { api.setScore(api.score + n); };

  function showOverlay(title, message, button) {
    overlayTitle.textContent = title;
    overlayText.textContent = message;
    startBtn.textContent = button;
    overlay.hidden = false;
    startBtn.focus();
  }

  /** Reset absolutely everything and play. Never a page reload. */
  function restart() {
    Engine.audio.unlock();
    overlay.hidden = true;
    api.paused = false;
    api.playing = true;
    api.particles.clear();
    api.setScore(0);
    Engine.input.clear();
    if (opts.onStart) opts.onStart();
    loop.start();
  }
  api.restart = restart;

  api.gameOver = function (reason) {
    if (!api.playing) return;
    api.playing = false;
    Engine.audio.sweep(320, 90, 0.35, 0.18);
    showOverlay('Game over', reason + '  ·  Score ' + Math.floor(api.score) + '  ·  Best ' + Math.floor(api.best), 'Play again');
  };

  api.win = function (message) {
    api.playing = false;
    Engine.audio.tone(880, 0.1, 'triangle', 0.16);
    setTimeout(function () { Engine.audio.tone(1320, 0.16, 'triangle', 0.16); }, 110);
    showOverlay('You win', message + '  ·  Score ' + Math.floor(api.score), 'Play again');
  };

  function togglePause() {
    if (!api.playing) return;
    api.paused = !api.paused;
    if (api.paused) showOverlay('Paused', 'Take your time.', 'Resume');
    else overlay.hidden = true;
  }

  var loop = Engine.loop(function (dt, t) {
    if (api.playing && !api.paused && opts.onUpdate) opts.onUpdate(dt, t);
    api.particles.update(dt, opts.particleGravity);
    api.shake.update(dt);
    ctx.save();
    api.shake.apply(ctx);
    opts.onDraw(ctx, dt, t);
    api.particles.draw(ctx);
    ctx.restore();
  });
  api.loop = loop;

  /* input */
  startBtn.addEventListener('click', function () {
    if (api.paused) { api.paused = false; overlay.hidden = true; return; }
    restart();
  });

  Engine.input.onKey(function (key, event) {
    if (key === 'Escape' || key === 'p') { togglePause(); return; }
    if (!api.playing) {
      if (key === 'Enter' || key === ' ') { event.preventDefault(); restart(); }
      return;
    }
    if (opts.onKey) opts.onKey(key, event);
  });

  Engine.pointer(stage.canvas, stage, {
    down: function (p, e) { if (opts.onDown) opts.onDown(p, e); },
    move: function (p, e) { if (opts.onMove) opts.onMove(p, e); },
    up: function (p, e) { if (opts.onUp) opts.onUp(p, e); },
    tap: function (p, e) { if (api.playing && opts.onTap) opts.onTap(p, e); },
    swipe: function (dir) { if (api.playing && opts.onSwipe) opts.onSwipe(dir); }
  });

  muteBtn.addEventListener('click', function () {
    var muted = Engine.audio.toggle();
    muteBtn.textContent = muted ? 'Sound off' : 'Sound on';
    muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
  });

  // Losing the window while playing pauses rather than continuing unseen.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && api.playing && !api.paused) togglePause();
  });

  showOverlay(opts.title, opts.intro, 'Play');
  if (opts.onStart) opts.onStart();
  loop.start();
  return api;
}
`;function X(e,t,a){return`      <div class="hud">
        <div class="hud__stat"><span class="hud__label">Score</span><strong id="score">0</strong></div>
        <div class="hud__stat"><span class="hud__label">Best</span><strong id="best">0</strong></div>
        <button type="button" id="mute" class="hud__mute" aria-pressed="false">Sound on</button>
      </div>

      <div class="stage">
        <canvas id="game" role="img" aria-label="${a}"></canvas>
        <div class="overlay" id="overlay">
          <h2 id="overlay-title">${e.title}</h2>
          <p id="overlay-text"></p>
          <button type="button" class="btn" id="start">Play</button>
        </div>
      </div>

      <p class="controls muted">${t}</p>`}function J(e){return`
.page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  gap: calc(var(--space) * 2);
  padding: calc(var(--space) * 2);
}

/* The stage grows into whatever is left, so <main> has to grow too — otherwise
   it sizes to its content and the canvas stays small in a tall window. */
.main { flex: 1 1 0; min-height: 0; display: flex; flex-direction: column; gap: 12px; }

.masthead { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.masthead h1 { font-size: var(--step-2); }
.masthead p { color: var(--ink-dim); font-size: 0.95rem; }

.hud {
  display: flex;
  align-items: center;
  gap: calc(var(--space) * 2);
  padding: 10px 14px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.hud__stat { display: flex; align-items: baseline; gap: 8px; }
.hud__label { color: var(--ink-dim); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; }
.hud__stat strong { font-size: var(--step-1); font-variant-numeric: tabular-nums; }
.hud__mute {
  margin-left: auto;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  color: var(--ink-dim);
  font-size: 0.85rem;
}
.hud__mute:hover { color: var(--ink); }

/* No aspect-ratio here on purpose. The canvas keeps the ${e} field shape
   itself by fitting to whichever of this box's dimensions runs out first; an
   aspect-ratio on the container as well would fight that and overflow the
   viewport on a short window. */
.stage {
  position: relative;
  flex: 1 1 0;
  min-height: 220px;
  display: grid;
  place-items: center;
  width: 100%;
  max-width: min(100%, 900px);
  margin-inline: auto;
}
.stage canvas {
  display: block;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  touch-action: none;
}

.overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 14px;
  padding: 24px;
  text-align: center;
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(3px);
  border-radius: var(--radius);
}
.overlay[hidden] { display: none; }
.overlay h2 { font-size: var(--step-3); }
.overlay p { color: var(--ink-dim); max-width: 34ch; }

.controls { text-align: center; font-size: 0.9rem; }

@media (max-width: 560px) {
  .page { padding: 10px; gap: 10px; }
  .hud { padding: 8px 10px; gap: 12px; }
  .masthead p { display: none; }
}`}function Nn(e,t){return{script:`${V}
/* --- ${e.title} ---------------------------------------------------
   A 22x22 grid. The snake steps once per tick, not once per frame, so the
   speed is the same on every screen. The tick shortens by 4ms per apple to
   a floor of 65ms — about twice the starting speed after sixteen apples. */

var COLS = 22, ROWS = 22, CELL = 24;
var START_TICK = 0.130, MIN_TICK = 0.065, TICK_STEP = 0.004;

var snake, dir, queued, food, tick, acc, grow;

function freeCells() {
  var taken = {};
  for (var i = 0; i < snake.length; i++) taken[snake[i].x + ',' + snake[i].y] = true;
  var free = [];
  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) if (!taken[x + ',' + y]) free.push({ x: x, y: y });
  }
  return free;
}

/** Picking from the free cells means food can never land under the snake. */
function placeFood() {
  var free = freeCells();
  food = free.length ? Engine.pick(free) : null;
}

function reset() {
  snake = [{ x: 8, y: 11 }, { x: 7, y: 11 }, { x: 6, y: 11 }, { x: 5, y: 11 }];
  dir = { x: 1, y: 0 };
  queued = [];
  grow = 0;
  tick = START_TICK;
  acc = 0;
  placeFood();
}

/** Turns are queued and validated against the direction actually applied, so
    pressing left then up inside one tick cannot fold the snake into itself. */
function turn(nx, ny) {
  var last = queued.length ? queued[queued.length - 1] : dir;
  if (last.x === -nx && last.y === -ny) return;
  if (last.x === nx && last.y === ny) return;
  if (queued.length < 2) queued.push({ x: nx, y: ny });
}

function step() {
  if (queued.length) dir = queued.shift();
  var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS) {
    G.shake.kick(9);
    G.gameOver('You hit the wall.');
    return;
  }
  for (var i = 0; i < snake.length - 1; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      G.shake.kick(9);
      G.gameOver('You bit yourself.');
      return;
    }
  }

  snake.unshift(head);
  if (food && head.x === food.x && head.y === food.y) {
    grow += 1;
    G.addScore(10);
    tick = Math.max(MIN_TICK, tick - TICK_STEP);
    G.particles.burst(head.x * CELL + CELL / 2, head.y * CELL + CELL / 2, 14, C.accent2, 150);
    Engine.audio.tone(660 + Math.min(600, G.score), 0.07, 'square', 0.12);
    placeFood();
  }
  if (grow > 0) grow--;
  else snake.pop();
}

var G = Game({
  W: COLS * CELL,
  H: ROWS * CELL,
  key: '${e.slug}.best',
  title: '${e.title}',
  intro: 'Eat to grow. Do not hit the walls or yourself. Arrows, WASD or swipe.',
  particleGravity: 0,

  onStart: reset,

  onUpdate: function (dt) {
    acc += dt;
    while (acc >= tick && G.playing) {
      acc -= tick;
      step();
    }
  },

  onKey: function (key) {
    if (key === 'ArrowUp' || key === 'w') turn(0, -1);
    else if (key === 'ArrowDown' || key === 's') turn(0, 1);
    else if (key === 'ArrowLeft' || key === 'a') turn(-1, 0);
    else if (key === 'ArrowRight' || key === 'd') turn(1, 0);
  },

  onSwipe: function (d) {
    if (d === 'up') turn(0, -1);
    else if (d === 'down') turn(0, 1);
    else if (d === 'left') turn(-1, 0);
    else turn(1, 0);
  },

  onDraw: function (ctx) {
    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, G.W, G.H);

    ctx.strokeStyle = C.line;
    ctx.lineWidth = 1;
    for (var i = 1; i < COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL + 0.5, 0);
      ctx.lineTo(i * CELL + 0.5, G.H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL + 0.5);
      ctx.lineTo(G.W, i * CELL + 0.5);
      ctx.stroke();
    }

    if (food) {
      var fx = food.x * CELL + CELL / 2, fy = food.y * CELL + CELL / 2;
      ctx.fillStyle = C.accent2;
      ctx.beginPath();
      ctx.arc(fx, fy, CELL * 0.32, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var s = snake.length - 1; s >= 0; s--) {
      var part = snake[s];
      var head = s === 0;
      ctx.fillStyle = head ? C.accent : C.good;
      ctx.globalAlpha = head ? 1 : 0.55 + 0.45 * (1 - s / snake.length);
      Engine.roundRect(ctx, part.x * CELL + 2, part.y * CELL + 2, CELL - 4, CELL - 4, head ? 7 : 4);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
});
`,markup:X(e,"Arrows or WASD to turn · Swipe on a phone · Esc to pause","Snake game board"),css:J("1 / 1"),howTo:["Arrow keys or WASD to turn.","Swipe on a phone.","Escape pauses; Enter starts and restarts."],notes:["Grid 22×22 at 24 px a cell.","One step every 130 ms at the start, dropping 4 ms per apple to a floor of 65 ms — roughly double speed after sixteen apples.","Turns are queued and checked against the direction actually applied last tick, so a fast left-then-up cannot kill you.","Food is chosen from the list of free cells, so it never appears under the snake."],engine:!0,scriptName:"game.js"}}function Ln(e,t){return{script:`${V}
/* --- ${e.title} ---------------------------------------------------
   640x480 field. The paddle is 110 wide — 17% of the width, wide enough to
   be fair. The ball leaves the paddle at an angle set by where it hit, so
   there is skill in it, and it is clamped away from horizontal so no rally
   can stall. It moves in sub-steps no longer than its own radius, which is
   what stops it tunnelling through a brick at speed. */

var W = 640, H = 480;
var PADDLE_W = 110, PADDLE_H = 14, PADDLE_Y = H - 40;
var BALL_R = 7, START_SPEED = 300, MAX_SPEED = 520, SPEED_GAIN = 1.03;
var ROWS = 5, COLS = 9, BRICK_H = 22, BRICK_GAP = 6, TOP = 64;
var BRICK_W = (W - BRICK_GAP * (COLS + 1)) / COLS;

var paddleX, ball, bricks, lives, launched, serveDir;

function reset() {
  paddleX = W / 2;
  lives = 3;
  serveDir = 1;
  bricks = [];
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      bricks.push({
        x: BRICK_GAP + c * (BRICK_W + BRICK_GAP),
        y: TOP + r * (BRICK_H + BRICK_GAP),
        w: BRICK_W,
        h: BRICK_H,
        alive: true,
        points: (ROWS - r) * 10,
        row: r
      });
    }
  }
  serve();
}

function serve() {
  launched = false;
  ball = { x: paddleX, y: PADDLE_Y - BALL_R - 2, vx: 0, vy: 0, speed: START_SPEED };
}

function launch() {
  if (launched) return;
  launched = true;
  // Between 35 and 55 degrees: never so flat it crawls, never so steep it stalls.
  var angle = (35 + Math.random() * 20) * Math.PI / 180;
  ball.vx = Math.cos(angle) * ball.speed * serveDir;
  ball.vy = -Math.sin(angle) * ball.speed;
  serveDir = -serveDir;
  Engine.audio.tone(520, 0.06, 'square', 0.1);
}

function bounceOffPaddle() {
  var offset = Engine.clamp((ball.x - paddleX) / (PADDLE_W / 2), -1, 1);
  var angle = offset * 60 * Math.PI / 180;
  ball.vx = Math.sin(angle) * ball.speed;
  ball.vy = -Math.abs(Math.cos(angle)) * ball.speed;
  Engine.audio.tone(300, 0.05, 'square', 0.1);
}

function hitBrick(brick) {
  brick.alive = false;
  G.addScore(brick.points);
  G.particles.burst(brick.x + brick.w / 2, brick.y + brick.h / 2, 10, rowColor(brick.row), 170);
  Engine.audio.tone(420 + brick.points * 4, 0.05, 'square', 0.1);
  ball.speed = Math.min(MAX_SPEED, ball.speed * SPEED_GAIN);
  var mag = Math.hypot(ball.vx, ball.vy) || 1;
  ball.vx = ball.vx / mag * ball.speed;
  ball.vy = ball.vy / mag * ball.speed;
  for (var i = 0; i < bricks.length; i++) if (bricks[i].alive) return;
  G.win('Every brick cleared.');
}

function rowColor(row) {
  var scale = [C.accent, C.accent2, C.good, C.bad, C.inkDim];
  return scale[row % scale.length];
}

function moveBall(dt) {
  // Sub-stepping: never travel further than the radius in one collision test.
  var distance = Math.hypot(ball.vx, ball.vy) * dt;
  var steps = Math.max(1, Math.ceil(distance / BALL_R));
  var sub = dt / steps;

  for (var s = 0; s < steps; s++) {
    ball.x += ball.vx * sub;
    ball.y += ball.vy * sub;

    if (ball.x - BALL_R < 0) { ball.x = BALL_R; ball.vx = Math.abs(ball.vx); }
    if (ball.x + BALL_R > W) { ball.x = W - BALL_R; ball.vx = -Math.abs(ball.vx); }
    if (ball.y - BALL_R < 0) { ball.y = BALL_R; ball.vy = Math.abs(ball.vy); }

    if (ball.vy > 0 && ball.y + BALL_R >= PADDLE_Y && ball.y - BALL_R < PADDLE_Y + PADDLE_H) {
      if (Math.abs(ball.x - paddleX) <= PADDLE_W / 2 + BALL_R) {
        ball.y = PADDLE_Y - BALL_R;
        bounceOffPaddle();
      }
    }

    for (var i = 0; i < bricks.length; i++) {
      var b = bricks[i];
      if (!b.alive) continue;
      if (ball.x + BALL_R < b.x || ball.x - BALL_R > b.x + b.w) continue;
      if (ball.y + BALL_R < b.y || ball.y - BALL_R > b.y + b.h) continue;

      // Push out along the shallower overlap, and reverse only that axis, so
      // the ball never ends up stuck inside a brick chewing through a column.
      var overlapX = Math.min(ball.x + BALL_R - b.x, b.x + b.w - (ball.x - BALL_R));
      var overlapY = Math.min(ball.y + BALL_R - b.y, b.y + b.h - (ball.y - BALL_R));
      if (overlapX < overlapY) {
        ball.x += ball.x < b.x + b.w / 2 ? -overlapX : overlapX;
        ball.vx = -ball.vx;
      } else {
        ball.y += ball.y < b.y + b.h / 2 ? -overlapY : overlapY;
        ball.vy = -ball.vy;
      }
      hitBrick(b);
      break;
    }

    if (ball.y - BALL_R > H) {
      lives--;
      G.shake.kick(10);
      Engine.audio.noise(0.25, 0.14);
      if (lives <= 0) G.gameOver('Out of balls.');
      else serve();
      return;
    }
  }
}

var G = Game({
  W: W, H: H,
  key: '${e.slug}.best',
  title: '${e.title}',
  intro: 'Clear every brick. Move with the mouse, a finger or the arrow keys. Space to launch.',
  particleGravity: 260,

  onStart: reset,

  onUpdate: function (dt) {
    if (Engine.input.any(['ArrowLeft', 'a'])) paddleX -= 460 * dt;
    if (Engine.input.any(['ArrowRight', 'd'])) paddleX += 460 * dt;
    paddleX = Engine.clamp(paddleX, PADDLE_W / 2, W - PADDLE_W / 2);

    if (!launched) {
      ball.x = paddleX;
      ball.y = PADDLE_Y - BALL_R - 2;
      return;
    }
    moveBall(dt);
  },

  onKey: function (key, e) {
    if (key === ' ' || key === 'ArrowUp') { e.preventDefault(); launch(); }
  },
  onMove: function (p) { paddleX = Engine.clamp(p.x, PADDLE_W / 2, W - PADDLE_W / 2); },
  onTap: function () { launch(); },

  onDraw: function (ctx) {
    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, W, H);

    for (var i = 0; i < bricks.length; i++) {
      var b = bricks[i];
      if (!b.alive) continue;
      ctx.fillStyle = rowColor(b.row);
      Engine.roundRect(ctx, b.x, b.y, b.w, b.h, 3);
      ctx.fill();
    }

    ctx.fillStyle = C.ink;
    Engine.roundRect(ctx, paddleX - PADDLE_W / 2, PADDLE_Y, PADDLE_W, PADDLE_H, 7);
    ctx.fill();

    ctx.fillStyle = C.accent;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    for (var l = 0; l < lives; l++) {
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(16 + l * 18, 22, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!launched && G.playing) {
      Engine.text(ctx, 'Space or tap to launch', W / 2, H - 78, 15, C.inkDim, 'center');
    }
  }
});
`,markup:X(e,"Mouse, finger or arrow keys to move · Space to launch · Esc to pause","Brick breaker playfield"),css:J("4 / 3"),howTo:["Move the paddle with the mouse, a finger or the arrow keys.","Space or tap to launch the ball.","Clear all 45 bricks to win. Three lives."],notes:["Paddle 110 px on a 640 px field — 17%, wide enough to be fair.","The ball leaves the paddle at up to 60° from vertical depending on where it hit, so aiming is a real skill rather than a coin toss.","Speed rises 3% per brick to a cap of 520 px/s.","The ball moves in sub-steps no larger than its radius, which is what prevents it passing through bricks at speed."],engine:!0,scriptName:"game.js"}}function Pn(e,t){return{script:`${V}
/* --- ${e.title} ---------------------------------------------------
   400x600. The gap is 155px, 26% of the height. Nothing scrolls until the
   first tap, and the first gap starts at x = W + 200, so nobody dies while
   they are still working out the controls. Each gap centre is within 140px
   of the last, so every pair of gaps is connected by a flyable path. */

var W = 400, H = 600;
var GRAVITY = 1500, FLAP = -430, MAX_FALL = 700;
var SCROLL = 150, GAP = 155, SPACING = 230, PIPE_W = 62;
var SPAWN_X = W + 200;          /* off screen — the player must see it coming */
var BIRD_X = 110, BIRD_R = 13, HIT_R = BIRD_R * 0.7;

var bird, pipes, started, groundOffset;

function reset() {
  bird = { y: H / 2, vy: 0, tilt: 0 };
  pipes = [];
  started = false;
  groundOffset = 0;
  addPipe(SPAWN_X);
}

function addPipe(x) {
  var last = pipes.length ? pipes[pipes.length - 1].centre : H / 2;
  var lo = Math.max(GAP / 2 + 40, last - 140);
  var hi = Math.min(H - 90 - GAP / 2, last + 140);
  pipes.push({ x: x, centre: Engine.rand(lo, hi), passed: false });
}

function flap() {
  if (!G.playing) return;
  started = true;
  bird.vy = FLAP;
  Engine.audio.sweep(420, 700, 0.08, 0.12);
}

var G = Game({
  W: W, H: H,
  key: '${e.slug}.best',
  title: '${e.title}',
  intro: 'Tap, click or press space to fly. Through the gaps, not into them.',
  particleGravity: 500,

  onStart: reset,

  onUpdate: function (dt) {
    if (!started) return;

    bird.vy = Math.min(MAX_FALL, bird.vy + GRAVITY * dt);
    bird.y += bird.vy * dt;
    bird.tilt = Engine.clamp(bird.vy / 700, -0.5, 1.1);
    groundOffset = (groundOffset + SCROLL * dt) % 40;

    for (var i = pipes.length - 1; i >= 0; i--) {
      var p = pipes[i];
      p.x -= SCROLL * dt;

      if (!p.passed && p.x + PIPE_W < BIRD_X) {
        p.passed = true;
        G.addScore(1);
        Engine.audio.tone(880, 0.06, 'triangle', 0.1);
      }
      if (p.x + PIPE_W < -20) pipes.splice(i, 1);

      var withinX = BIRD_X + HIT_R > p.x && BIRD_X - HIT_R < p.x + PIPE_W;
      if (withinX) {
        var top = p.centre - GAP / 2, bottom = p.centre + GAP / 2;
        if (bird.y - HIT_R < top || bird.y + HIT_R > bottom) return crash();
      }
    }

    var last = pipes[pipes.length - 1];
    if (!last || last.x < W - SPACING) addPipe(W + PIPE_W);

    if (bird.y + HIT_R > H - 60) return crash();
    if (bird.y - HIT_R < 0) { bird.y = HIT_R; bird.vy = 0; }
  },

  onKey: function (key, e) { if (key === ' ' || key === 'ArrowUp') { e.preventDefault(); flap(); } },
  onDown: function () { flap(); },

  onDraw: function (ctx) {
    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, W, H);

    for (var i = 0; i < pipes.length; i++) {
      var p = pipes[i];
      ctx.fillStyle = C.good;
      ctx.fillRect(p.x, 0, PIPE_W, p.centre - GAP / 2);
      ctx.fillRect(p.x, p.centre + GAP / 2, PIPE_W, H - (p.centre + GAP / 2) - 60);
      ctx.fillStyle = C.line;
      ctx.fillRect(p.x - 4, p.centre - GAP / 2 - 14, PIPE_W + 8, 14);
      ctx.fillRect(p.x - 4, p.centre + GAP / 2, PIPE_W + 8, 14);
    }

    ctx.fillStyle = C.surfaceAlt;
    ctx.fillRect(0, H - 60, W, 60);
    ctx.fillStyle = C.line;
    for (var g = -40; g < W + 40; g += 40) ctx.fillRect(g - groundOffset, H - 60, 20, 5);

    ctx.save();
    ctx.translate(BIRD_X, bird.y);
    ctx.rotate(bird.tilt * 0.5);
    ctx.fillStyle = C.accent;
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.accentInk;
    ctx.beginPath();
    ctx.arc(5, -4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.accent2;
    ctx.beginPath();
    ctx.moveTo(BIRD_R - 2, 1);
    ctx.lineTo(BIRD_R + 9, 4);
    ctx.lineTo(BIRD_R - 2, 7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    if (!started && G.playing) {
      Engine.text(ctx, 'Tap to start', W / 2, H / 2 - 90, 18, C.inkDim, 'center');
    }
  }
});

function crash() {
  G.shake.kick(12);
  G.particles.burst(BIRD_X, bird.y, 18, C.accent, 220);
  Engine.audio.noise(0.3, 0.16);
  G.gameOver('You clipped it.');
}
`,markup:X(e,"Space, click or tap to fly · Esc to pause","Flying game field"),css:J("2 / 3"),howTo:["Tap, click or press space to flap.","Fly through the gaps; touching a pipe or the ground ends the run.","One point per gap."],notes:["Gap 155 px on a 600 px field — 26%, forgiving but not trivial.","Gravity 1500 px/s² with a flap of −430 px/s and a terminal fall of 700 px/s.","Nothing moves until the first tap and the first pipe starts 200 px beyond the right edge, so nobody dies while reading the screen.","Consecutive gap centres are within 140 px of each other, so every pair is connected by a flyable path.","The collision radius is 70% of the drawn bird, so near misses read as misses."],engine:!0,scriptName:"game.js"}}function $n(e,t){const a=e.subject?e.subject.split(" ")[0]:"runner";return{script:`${V}
/* --- ${e.title} ---------------------------------------------------
   Obstacles are created at x = W + 40 and travel left, so they are visible
   for 2.8 seconds at the starting speed of 300px/s across an 800px field.
   The minimum gap between them is derived from the jump arc, not guessed:
   at 300px/s the jump covers about 186px, so the gap floor is 1.6 times
   that. Falling gravity is 1.7x rising gravity, which is not physical and
   feels far better. */

var W = 800, H = 380;
var GROUND = H * 0.78;
var GRAVITY_UP = 2200, GRAVITY_DOWN = 3700, JUMP = -760;
var START_SPEED = 300, SPEED_GAIN = 6, MAX_SPEED = 720;
var SPAWN_X = W + 40;               /* off screen, always */
var PLAYER_W = 30, PLAYER_H = 42;

var player, obstacles, speed, distance, nextGap, clouds;

function reset() {
  player = { x: 90, y: GROUND - PLAYER_H, vy: 0, onGround: true, duck: false };
  obstacles = [];
  speed = START_SPEED;
  distance = 0;
  nextGap = 320;
  clouds = [];
  for (var i = 0; i < 5; i++) clouds.push({ x: Math.random() * W, y: 40 + Math.random() * 110, s: 0.25 + Math.random() * 0.3, r: 14 + Math.random() * 16 });
}

/** How far the player travels during one full jump, at the current speed. */
function jumpDistance() {
  var up = -JUMP / GRAVITY_UP;
  var down = -JUMP / GRAVITY_DOWN;
  return (up + down) * speed;
}

function spawn() {
  var tall = Math.random() < 0.28;
  obstacles.push({
    x: SPAWN_X,
    y: tall ? GROUND - 78 : GROUND - 34,
    w: tall ? 26 : 22 + Math.random() * 26,
    h: tall ? 30 : 34,
    tall: tall
  });
  nextGap = Math.max(190, jumpDistance() * 1.6) + Math.random() * 160;
}

function jump() {
  if (!player.onGround || !G.playing) return;
  player.vy = JUMP;
  player.onGround = false;
  Engine.audio.sweep(300, 620, 0.1, 0.11);
}

var G = Game({
  W: W, H: H,
  key: '${e.slug}.best',
  title: '${e.title}',
  intro: 'Jump the obstacles. Space or tap to jump, hold to jump higher, down to duck.',
  particleGravity: 900,

  onStart: reset,

  onUpdate: function (dt) {
    speed = Math.min(MAX_SPEED, speed + SPEED_GAIN * dt);
    distance += speed * dt;
    G.setScore(Math.floor(distance / 10));

    player.duck = Engine.input.any(['ArrowDown', 's']) && player.onGround;

    // A short tap gives a short hop: cut the rise when the key is released.
    var rising = player.vy < 0;
    var holding = Engine.input.any([' ', 'ArrowUp', 'w']);
    if (rising && !holding) player.vy += GRAVITY_DOWN * dt;
    player.vy += (rising ? GRAVITY_UP : GRAVITY_DOWN) * dt;
    player.y += player.vy * dt;

    var floor = GROUND - (player.duck ? PLAYER_H * 0.6 : PLAYER_H);
    if (player.y >= floor) { player.y = floor; player.vy = 0; player.onGround = true; }

    nextGap -= speed * dt;
    if (nextGap <= 0) spawn();

    var box = {
      x: player.x + 4,
      y: player.y + 3,
      w: PLAYER_W - 8,
      h: (player.duck ? PLAYER_H * 0.6 : PLAYER_H) - 6
    };

    for (var i = obstacles.length - 1; i >= 0; i--) {
      var o = obstacles[i];
      o.x -= speed * dt;
      if (o.x + o.w < -40) { obstacles.splice(i, 1); continue; }
      if (Engine.overlaps(box, o)) {
        G.shake.kick(12);
        G.particles.burst(player.x + PLAYER_W / 2, player.y + PLAYER_H / 2, 20, C.bad, 250);
        Engine.audio.noise(0.3, 0.17);
        G.gameOver('You hit ' + (o.tall ? 'the high one' : 'a block') + '.');
        return;
      }
    }

    for (var c = 0; c < clouds.length; c++) {
      clouds[c].x -= speed * clouds[c].s * dt;
      if (clouds[c].x < -40) { clouds[c].x = W + 40; clouds[c].y = 40 + Math.random() * 110; }
    }
  },

  onKey: function (key, e) {
    if (key === ' ' || key === 'ArrowUp' || key === 'w') { e.preventDefault(); jump(); }
  },
  onDown: function (p) { if (p.y < GROUND) jump(); else player.duck = true; },
  onUp: function () { player.duck = false; },

  onDraw: function (ctx) {
    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = C.surfaceAlt;
    for (var c = 0; c < clouds.length; c++) {
      ctx.beginPath();
      ctx.arc(clouds[c].x, clouds[c].y, clouds[c].r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = C.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND + 1);
    ctx.lineTo(W, GROUND + 1);
    ctx.stroke();

    ctx.fillStyle = C.line;
    var offset = distance % 46;
    for (var m = 0; m <= Math.ceil(W / 46); m++) {
      ctx.fillRect(m * 46 - offset, GROUND + 10, 22, 3);
    }

    for (var i = 0; i < obstacles.length; i++) {
      var o = obstacles[i];
      ctx.fillStyle = o.tall ? C.bad : C.accent2;
      Engine.roundRect(ctx, o.x, o.y, o.w, o.h, 3);
      ctx.fill();
    }

    var h = player.duck ? PLAYER_H * 0.6 : PLAYER_H;
    ctx.fillStyle = C.accent;
    Engine.roundRect(ctx, player.x, player.y, PLAYER_W, h, 6);
    ctx.fill();
    ctx.fillStyle = C.accentInk;
    ctx.fillRect(player.x + PLAYER_W - 11, player.y + 9, 5, 5);

    Engine.text(ctx, Math.floor(distance / 10) + ' m', W - 16, 26, 16, C.inkDim, 'right');
  }
});
`,markup:X(e,"Space or tap to jump · Hold for a higher jump · Down to duck",`${a} running game`),css:J("20 / 9"),howTo:["Space, up, or tap to jump — hold it longer to jump higher.","Down arrow to duck under the high blocks.","Score is distance travelled."],notes:["Obstacles are created 40 px beyond the right edge and never inside the field.","At the starting speed of 300 px/s an obstacle is visible for 2.8 seconds before it matters.","The minimum gap between obstacles is 1.6× the distance covered by a full jump, computed from the physics rather than guessed.","Falling gravity is 1.7× rising gravity, and releasing the key cuts the rise — that is what makes the jump feel controllable."],engine:!0,scriptName:"game.js"}}function Dn(e,t){return{script:`${V}
/* --- ${e.title} ---------------------------------------------------
   480x720. Enemies enter above y = -50 at 90px/s, taking eight seconds to
   cross, so they are visible long before they matter. The player's hit
   radius is 11 against a 34px ship — generous to the player, honest to the
   enemy, which is what makes near misses feel fair. */

var W = 480, H = 720;
var SPAWN_Y = -50;                 /* above the field, never inside it */
var PLAYER_R = 11, PLAYER_SIZE = 34, PLAYER_SPEED = 340;
var BULLET_SPEED = 620, FIRE_COOLDOWN = 0.17, MAX_BULLETS = 6;
var BASE_ENEMY_SPEED = 90, ENEMY_R = 15;

var player, bullets, enemies, stars, wave, waveLeft, spawnTimer, cooldown, lives, invuln;

function reset() {
  player = { x: W / 2, y: H - 90, target: null };
  bullets = [];
  enemies = [];
  wave = 0;
  waveLeft = 0;
  spawnTimer = 0.8;
  cooldown = 0;
  lives = 3;
  invuln = 0;
  stars = [];
  for (var i = 0; i < 70; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, s: 12 + Math.random() * 46, r: Math.random() * 1.6 + 0.4 });
  nextWave();
}

function nextWave() {
  wave++;
  waveLeft = 4 + wave;
  spawnTimer = 0.6;
}

function spawnEnemy() {
  enemies.push({
    x: Engine.rand(30, W - 30),
    y: SPAWN_Y,
    speed: Math.min(260, BASE_ENEMY_SPEED * Math.pow(1.08, wave - 1)),
    drift: Engine.rand(-40, 40),
    hp: wave > 4 && Math.random() < 0.25 ? 2 : 1
  });
}

function fire() {
  if (cooldown > 0 || bullets.length >= MAX_BULLETS) return;
  cooldown = FIRE_COOLDOWN;
  bullets.push({ x: player.x, y: player.y - 20 });
  Engine.audio.tone(880, 0.05, 'square', 0.08);
}

function hurt() {
  if (invuln > 0) return;
  lives--;
  invuln = 1.2;
  G.shake.kick(14);
  Engine.audio.noise(0.35, 0.18);
  if (lives <= 0) G.gameOver('Your ship is gone.');
}

var G = Game({
  W: W, H: H,
  key: '${e.slug}.best',
  title: '${e.title}',
  intro: 'Move and shoot. Arrows or WASD, space to fire — or just drag a finger, which fires for you.',
  particleGravity: 0,

  onStart: reset,

  onUpdate: function (dt) {
    cooldown -= dt;
    invuln -= dt;

    if (player.target != null) {
      player.x += Engine.clamp(player.target - player.x, -PLAYER_SPEED * dt * 1.6, PLAYER_SPEED * dt * 1.6);
      fire();
    }
    if (Engine.input.any(['ArrowLeft', 'a'])) player.x -= PLAYER_SPEED * dt;
    if (Engine.input.any(['ArrowRight', 'd'])) player.x += PLAYER_SPEED * dt;
    if (Engine.input.any([' ', 'ArrowUp', 'w'])) fire();
    player.x = Engine.clamp(player.x, 20, W - 20);

    for (var s = 0; s < stars.length; s++) {
      stars[s].y += stars[s].s * dt;
      if (stars[s].y > H) { stars[s].y = -2; stars[s].x = Math.random() * W; }
    }

    for (var b = bullets.length - 1; b >= 0; b--) {
      bullets[b].y -= BULLET_SPEED * dt;
      if (bullets[b].y < -12) bullets.splice(b, 1);
    }

    spawnTimer -= dt;
    if (spawnTimer <= 0 && waveLeft > 0) {
      spawnEnemy();
      waveLeft--;
      spawnTimer = Math.max(0.35, 1.1 - wave * 0.05);
    }

    for (var e = enemies.length - 1; e >= 0; e--) {
      var en = enemies[e];
      en.y += en.speed * dt;
      en.x += en.drift * dt;
      if (en.x < 24 || en.x > W - 24) en.drift = -en.drift;

      if (en.y > H + 30) {
        enemies.splice(e, 1);
        continue;
      }
      if (invuln <= 0 && Engine.circlesHit(en.x, en.y, ENEMY_R, player.x, player.y, PLAYER_R)) {
        enemies.splice(e, 1);
        G.particles.burst(en.x, en.y, 20, C.bad, 240);
        hurt();
        continue;
      }
      for (var bb = bullets.length - 1; bb >= 0; bb--) {
        if (!Engine.circlesHit(en.x, en.y, ENEMY_R, bullets[bb].x, bullets[bb].y, 4)) continue;
        bullets.splice(bb, 1);
        en.hp--;
        if (en.hp <= 0) {
          enemies.splice(e, 1);
          G.addScore(10 * wave);
          G.particles.burst(en.x, en.y, 16, C.accent2, 220);
          Engine.audio.tone(180, 0.09, 'sawtooth', 0.1);
        } else {
          Engine.audio.tone(300, 0.04, 'square', 0.07);
        }
        break;
      }
    }

    if (waveLeft === 0 && enemies.length === 0) nextWave();
  },

  onKey: function (key, e) { if (key === ' ') { e.preventDefault(); fire(); } },
  onDown: function (p) { player.target = p.x; },
  onMove: function (p) { if (player.target != null) player.target = p.x; },
  onUp: function () { player.target = null; },

  onDraw: function (ctx) {
    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = C.inkDim;
    for (var s = 0; s < stars.length; s++) {
      ctx.globalAlpha = 0.25 + stars[s].r / 3;
      ctx.fillRect(stars[s].x, stars[s].y, stars[s].r, stars[s].r);
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = C.accent2;
    for (var b = 0; b < bullets.length; b++) ctx.fillRect(bullets[b].x - 2, bullets[b].y - 10, 4, 12);

    for (var e = 0; e < enemies.length; e++) {
      var en = enemies[e];
      ctx.fillStyle = en.hp > 1 ? C.bad : C.good;
      ctx.beginPath();
      ctx.moveTo(en.x, en.y + ENEMY_R);
      ctx.lineTo(en.x - ENEMY_R, en.y - ENEMY_R * 0.7);
      ctx.lineTo(en.x + ENEMY_R, en.y - ENEMY_R * 0.7);
      ctx.closePath();
      ctx.fill();
    }

    if (invuln <= 0 || Math.floor(invuln * 12) % 2 === 0) {
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y - PLAYER_SIZE / 2);
      ctx.lineTo(player.x - PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2);
      ctx.lineTo(player.x, player.y + PLAYER_SIZE / 4);
      ctx.lineTo(player.x + PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2);
      ctx.closePath();
      ctx.fill();
    }

    for (var l = 0; l < lives; l++) {
      ctx.fillStyle = C.accent;
      ctx.fillRect(14 + l * 16, 16, 9, 9);
    }
    Engine.text(ctx, 'Wave ' + wave, W - 14, 22, 15, C.inkDim, 'right');
  }
});
`,markup:X(e,"Arrows or WASD to move · Space to fire · Drag a finger to move and fire","Space shooter field"),css:J("2 / 3"),howTo:["Arrows or A/D to move, space to fire.","On a phone, drag anywhere — the ship follows your finger and fires automatically.","Three lives, with a moment of invulnerability after each hit."],notes:["Enemies enter above the top edge at y = −50 and take about eight seconds to cross the field at wave one.","The player hit radius is 11 px against a 34 px ship, so near misses genuinely miss.","Fire cooldown 170 ms with at most six bullets alive, so holding fire does not remove the difficulty.","Each wave adds one enemy and 8% speed, capped at 260 px/s."],engine:!0,scriptName:"game.js"}}function Mn(e,t){return{script:`${V}
/* --- ${e.title} ---------------------------------------------------
   The thing that matters most in this file:

   A note is scheduled by the time it must be HIT. Its position is derived
   from how far away that moment is:

       y = HIT_Y - (note.time - songTime) * SPEED

   so at note.time it is exactly on the hit line, and TRAVEL seconds earlier
   it is at HIT_Y - TRAVEL * SPEED, which is 40px above the top of the field.
   Notes are therefore never created on the hit line, and the player always
   gets 1.6 seconds of warning.

   The clock is the audio clock, not a frame counter, so nothing drifts. */

var W = 420, H = 640;
var LANES = 4, LANE_W = W / LANES;
var HIT_Y = 540;
var TRAVEL = 1.6;                        /* seconds of reaction time */
var SPEED = (HIT_Y + 40) / TRAVEL;       /* px per second, so spawn y = -40 */
var SPAWN_Y = -40;
var NOTE_H = 22;
var BPM = 120, BEAT = 60 / BPM, LEAD_IN = 3;
var PERFECT = 0.055, GREAT = 0.095, GOOD = 0.140;
var KEYS = ['d', 'f', 'j', 'k'];

var chart, combo, bestCombo, hits, judged, flash, laneGlow, beatIndex;
var songStart = null;

/** A fixed pattern rather than random spawning — a chart you can learn. */
function buildChart() {
  var notes = [];
  var pattern = [
    [0], [2], [1], [3],
    [0], [0], [2], [1],
    [3], [1], [2], [0],
    [1, 3], [0], [2], [0, 2]
  ];
  for (var bar = 0; bar < 8; bar++) {
    for (var i = 0; i < pattern.length; i++) {
      var lanes = pattern[(i + bar * 3) % pattern.length];
      for (var l = 0; l < lanes.length; l++) {
        notes.push({
          lane: lanes[l],
          time: LEAD_IN + (bar * pattern.length + i) * (BEAT / 2),
          hit: false,
          missed: false
        });
      }
    }
  }
  return notes;
}

function reset() {
  chart = buildChart();
  combo = 0;
  bestCombo = 0;
  hits = { perfect: 0, great: 0, good: 0, miss: 0 };
  judged = '';
  flash = 0;
  laneGlow = [0, 0, 0, 0];
  beatIndex = 0;
  songStart = null;
}

function now() {
  var ctx = Engine.audio.ctx;
  return ctx ? ctx.currentTime : performance.now() / 1000;
}

/* songStart is checked against null, not for truthiness: a freshly created
   AudioContext reports currentTime 0, and "0" is falsy, which would leave the
   song frozen at the start forever. */
function songTime() {
  return songStart === null ? 0 : now() - songStart;
}

function judge(lane) {
  laneGlow[lane] = 1;
  var t = songTime();
  var best = null, bestDelta = 999;
  for (var i = 0; i < chart.length; i++) {
    var n = chart[i];
    if (n.lane !== lane || n.hit || n.missed) continue;
    var delta = Math.abs(n.time - t);
    if (delta < bestDelta) { bestDelta = delta; best = n; }
  }
  if (!best || bestDelta > GOOD) return;

  best.hit = true;
  var name = bestDelta <= PERFECT ? 'perfect' : bestDelta <= GREAT ? 'great' : 'good';
  var points = name === 'perfect' ? 300 : name === 'great' ? 200 : 100;
  hits[name]++;
  combo++;
  bestCombo = Math.max(bestCombo, combo);
  G.addScore(points + Math.min(combo, 50) * 2);
  judged = name;
  flash = 0.35;
  Engine.audio.tone(name === 'perfect' ? 1046 : name === 'great' ? 880 : 660, 0.06, 'triangle', 0.12);
}

function accuracy() {
  var total = hits.perfect + hits.great + hits.good + hits.miss;
  if (!total) return 100;
  return Math.round(((hits.perfect + hits.great * 0.75 + hits.good * 0.4) / total) * 100);
}

var G = Game({
  W: W, H: H,
  key: '${e.slug}.best',
  title: '${e.title}',
  intro: 'Hit each note as it crosses the line. Keys D F J K, or tap the lane.',
  particleGravity: 300,

  onStart: function () {
    // The audio context is already unlocked by restart(), inside the click.
    reset();
    songStart = now();
  },

  onUpdate: function (dt) {
    var t = songTime();
    flash = Math.max(0, flash - dt);
    for (var l = 0; l < LANES; l++) laneGlow[l] = Math.max(0, laneGlow[l] - dt * 4);

    /* a click track on every beat, from the audio clock */
    while (LEAD_IN + beatIndex * BEAT < t + 0.05) {
      if (LEAD_IN + beatIndex * BEAT > t - 0.2) {
        Engine.audio.tone(beatIndex % 4 === 0 ? 180 : 120, 0.04, 'sine', 0.05);
      }
      beatIndex++;
    }

    var remaining = 0;
    for (var i = 0; i < chart.length; i++) {
      var n = chart[i];
      if (n.hit) continue;
      if (!n.missed && t > n.time + GOOD) {
        n.missed = true;
        hits.miss++;
        combo = 0;
        judged = 'miss';
        flash = 0.3;
      }
      if (!n.missed) remaining++;
    }

    if (remaining === 0 && t > LEAD_IN) {
      G.win('Accuracy ' + accuracy() + '%, best combo ' + bestCombo);
    }
  },

  onKey: function (key) {
    var lane = KEYS.indexOf(String(key).toLowerCase());
    if (lane >= 0) judge(lane);
  },
  onDown: function (p) {
    var lane = Math.floor(p.x / LANE_W);
    if (lane >= 0 && lane < LANES) judge(lane);
  },

  onDraw: function (ctx) {
    var t = songTime();

    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, W, H);

    for (var l = 0; l < LANES; l++) {
      ctx.fillStyle = l % 2 ? C.surfaceAlt : C.surface;
      ctx.fillRect(l * LANE_W, 0, LANE_W, H);
      if (laneGlow[l] > 0) {
        ctx.globalAlpha = laneGlow[l] * 0.3;
        ctx.fillStyle = C.accent;
        ctx.fillRect(l * LANE_W, 0, LANE_W, H);
        ctx.globalAlpha = 1;
      }
      ctx.strokeStyle = C.line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(l * LANE_W + 0.5, 0);
      ctx.lineTo(l * LANE_W + 0.5, H);
      ctx.stroke();
    }

    /* the hit line */
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, HIT_Y);
    ctx.lineTo(W, HIT_Y);
    ctx.stroke();
    for (var k = 0; k < LANES; k++) {
      ctx.strokeStyle = C.inkDim;
      ctx.lineWidth = 2;
      Engine.roundRect(ctx, k * LANE_W + 10, HIT_Y - 16, LANE_W - 20, 32, 6);
      ctx.stroke();
      Engine.text(ctx, KEYS[k].toUpperCase(), k * LANE_W + LANE_W / 2, HIT_Y + 44, 15, C.inkDim, 'center');
    }

    /* notes — position derived from the time until they must be hit */
    for (var i = 0; i < chart.length; i++) {
      var n = chart[i];
      if (n.hit || n.missed) continue;
      var away = n.time - t;
      if (away > TRAVEL || away < -0.4) continue;
      var y = HIT_Y - away * SPEED;
      ctx.fillStyle = n.lane % 2 ? C.accent : C.accent2;
      Engine.roundRect(ctx, n.lane * LANE_W + 12, y - NOTE_H / 2, LANE_W - 24, NOTE_H, 5);
      ctx.fill();
    }

    if (t < LEAD_IN) {
      Engine.text(ctx, String(Math.ceil(LEAD_IN - t)), W / 2, H / 2 - 60, 64, C.inkDim, 'center');
    }

    if (flash > 0 && judged) {
      ctx.globalAlpha = Math.min(1, flash * 3);
      Engine.text(ctx, judged.toUpperCase(), W / 2, HIT_Y - 90, 30, judged === 'miss' ? C.bad : C.accent, 'center');
      ctx.globalAlpha = 1;
    }
    if (combo > 2) Engine.text(ctx, combo + ' combo', W / 2, 60, 22, C.ink, 'center');
    Engine.text(ctx, accuracy() + '%', W - 14, 26, 15, C.inkDim, 'right');
  }
});
`,markup:X(e,"D F J K to hit · Tap the lane on a phone · Esc to pause","Rhythm game lanes"),css:J("21 / 32"),howTo:["Hit D, F, J or K as the note crosses the line — or tap that lane on a phone.","Perfect within 55 ms, great within 95 ms, good within 140 ms. Later than that is a miss.","The combo multiplies your score; a miss resets it."],notes:["Notes are scheduled by the moment they must be hit and their position is derived from how far away that moment is, so they arrive exactly on the beat and are never created on the hit line.","Travel time is 1.6 seconds over 580 px, which is 362 px/s — that is the reaction time, and it should not go below 1.2 s.","The clock is AudioContext.currentTime, not a frame counter, so the notes and the click track cannot drift apart.","The chart is a fixed pattern that shifts each bar, so it can be learned rather than guessed at."],engine:!0,scriptName:"game.js"}}function In(e,t){return{script:`${V}
/* --- ${e.title} ---------------------------------------------------
   The computer paddle is capped at 380px/s, below the ball's maximum
   vertical speed, and only tracks once the ball is coming towards it. That
   is what makes it beatable: a fast angled shot outruns it. */

var W = 720, H = 440;
var PADDLE_W = 12, PADDLE_H = 86, EDGE = 26;
var BALL = 9, START_SPEED = 340, MAX_SPEED = 620;
var AI_SPEED = 380, TARGET = 7;

var left, right, ball, serveDelay, scores, twoPlayer;

function reset() {
  left = { y: H / 2, target: null };
  right = { y: H / 2, target: null };
  scores = { left: 0, right: 0 };
  twoPlayer = false;
  serve(1);
}

function serve(direction) {
  ball = { x: W / 2, y: H / 2, vx: 0, vy: 0, speed: START_SPEED, dir: direction };
  serveDelay = 0.7;
}

function launch() {
  var angle = Engine.rand(-0.45, 0.45);
  ball.vx = Math.cos(angle) * ball.speed * ball.dir;
  ball.vy = Math.sin(angle) * ball.speed;
}

function bounce(paddleY) {
  var offset = Engine.clamp((ball.y - paddleY) / (PADDLE_H / 2), -1, 1);
  var angle = offset * 60 * Math.PI / 180;
  ball.speed = Math.min(MAX_SPEED, ball.speed * 1.04);
  var dir = ball.vx > 0 ? -1 : 1;
  ball.vx = Math.cos(angle) * ball.speed * dir;
  ball.vy = Math.sin(angle) * ball.speed;
  Engine.audio.tone(420, 0.05, 'square', 0.1);
}

function point(side) {
  scores[side]++;
  G.setScore(scores.left);
  Engine.audio.sweep(300, 120, 0.25, 0.14);
  G.shake.kick(7);
  if (scores[side] >= TARGET) {
    if (side === 'left') G.win('You won ' + scores.left + '–' + scores.right + '.');
    else G.gameOver('Lost ' + scores.left + '–' + scores.right + '.');
    return;
  }
  serve(side === 'left' ? 1 : -1);
}

var G = Game({
  W: W, H: H,
  key: '${e.slug}.best',
  title: '${e.title}',
  intro: 'First to seven. W and S, or drag on the left. Press 2 for two players.',
  particleGravity: 0,

  onStart: reset,

  onUpdate: function (dt) {
    if (serveDelay > 0) {
      serveDelay -= dt;
      if (serveDelay <= 0) launch();
      return;
    }

    if (Engine.input.any(['w', 'ArrowUp'])) left.y -= 460 * dt;
    if (Engine.input.any(['s', 'ArrowDown'])) left.y += 460 * dt;
    if (left.target != null) left.y = left.target;
    left.y = Engine.clamp(left.y, PADDLE_H / 2, H - PADDLE_H / 2);

    if (twoPlayer) {
      if (Engine.input.any(['o'])) right.y -= 460 * dt;
      if (Engine.input.any(['l'])) right.y += 460 * dt;
      if (right.target != null) right.y = right.target;
    } else if (ball.vx > 0) {
      // Only tracks when the ball is coming, and never faster than AI_SPEED.
      var aim = ball.y + Engine.clamp((ball.y - right.y) * 0.1, -18, 18);
      right.y += Engine.clamp(aim - right.y, -AI_SPEED * dt, AI_SPEED * dt);
    }
    right.y = Engine.clamp(right.y, PADDLE_H / 2, H - PADDLE_H / 2);

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.y - BALL / 2 < 0) { ball.y = BALL / 2; ball.vy = Math.abs(ball.vy); }
    if (ball.y + BALL / 2 > H) { ball.y = H - BALL / 2; ball.vy = -Math.abs(ball.vy); }

    if (ball.vx < 0 && ball.x - BALL / 2 <= EDGE + PADDLE_W && ball.x > EDGE) {
      if (Math.abs(ball.y - left.y) <= PADDLE_H / 2 + BALL / 2) { ball.x = EDGE + PADDLE_W + BALL / 2; bounce(left.y); }
    }
    if (ball.vx > 0 && ball.x + BALL / 2 >= W - EDGE - PADDLE_W && ball.x < W - EDGE) {
      if (Math.abs(ball.y - right.y) <= PADDLE_H / 2 + BALL / 2) { ball.x = W - EDGE - PADDLE_W - BALL / 2; bounce(right.y); }
    }

    if (ball.x < -20) point('right');
    else if (ball.x > W + 20) point('left');
  },

  onKey: function (key) {
    if (key === '2') twoPlayer = !twoPlayer;
  },
  onDown: function (p) { if (p.x < W / 2) left.target = p.y; else if (twoPlayer) right.target = p.y; },
  onMove: function (p) { if (p.x < W / 2) left.target = p.y; else if (twoPlayer) right.target = p.y; },
  onUp: function () { left.target = null; right.target = null; },

  onDraw: function (ctx) {
    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = C.line;
    for (var y = 10; y < H; y += 26) ctx.fillRect(W / 2 - 2, y, 4, 14);

    ctx.fillStyle = C.accent;
    Engine.roundRect(ctx, EDGE, left.y - PADDLE_H / 2, PADDLE_W, PADDLE_H, 5);
    ctx.fill();
    ctx.fillStyle = twoPlayer ? C.accent2 : C.inkDim;
    Engine.roundRect(ctx, W - EDGE - PADDLE_W, right.y - PADDLE_H / 2, PADDLE_W, PADDLE_H, 5);
    ctx.fill();

    ctx.fillStyle = C.ink;
    ctx.fillRect(ball.x - BALL / 2, ball.y - BALL / 2, BALL, BALL);

    Engine.text(ctx, String(scores.left), W / 2 - 46, 44, 34, C.inkDim, 'right');
    Engine.text(ctx, String(scores.right), W / 2 + 46, 44, 34, C.inkDim, 'left');
    Engine.text(ctx, twoPlayer ? 'Two players — O and L' : 'You vs the computer — press 2 to change', W / 2, H - 20, 13, C.inkDim, 'center');

    if (serveDelay > 0 && G.playing) {
      Engine.text(ctx, String(Math.ceil(serveDelay * 3)), W / 2, H / 2, 40, C.line, 'center');
    }
  }
});
`,markup:X(e,"W / S or drag on your half · 2 toggles two players · Esc to pause","Pong court"),css:J("18 / 11"),howTo:["W and S, or drag on the left half.","Press 2 for two players — the second uses O and L, or drags on the right.","First to seven points."],notes:["The computer paddle is capped at 380 px/s and only moves once the ball is heading its way, so a fast angled shot beats it.","The exit angle comes from where the ball hit the paddle, up to 60° — the same trick as brick breaker, and the reason rallies vary.","Ball speed rises 4% per hit to a cap of 620 px/s."],engine:!0,scriptName:"game.js"}}function Rn(e,t){return{script:`${V}
/* --- ${e.title} ---------------------------------------------------
   The maze is carved with a recursive backtracker driven by an explicit
   stack — an actual spanning tree, so every cell is reachable and the exit
   can never be walled off. An explicit stack rather than recursion, because
   recursion blows the call stack on a large grid. */

var CELLS = 15, MAX_CELLS = 31;
var W = 600, H = 600;

var grid, cell, player, goal, level, moves, startedAt, elapsed, cols;

function index(x, y) { return y * cols + x; }

function carve() {
  cols = CELLS;
  cell = Math.floor(Math.min(W, H) / cols);
  grid = [];
  for (var i = 0; i < cols * cols; i++) {
    grid.push({ n: true, e: true, s: true, w: true, seen: false });
  }

  var stack = [{ x: 0, y: 0 }];
  grid[0].seen = true;
  var visited = 1;

  while (visited < cols * cols) {
    var current = stack[stack.length - 1];
    var options = [];
    if (current.y > 0 && !grid[index(current.x, current.y - 1)].seen) options.push('n');
    if (current.x < cols - 1 && !grid[index(current.x + 1, current.y)].seen) options.push('e');
    if (current.y < cols - 1 && !grid[index(current.x, current.y + 1)].seen) options.push('s');
    if (current.x > 0 && !grid[index(current.x - 1, current.y)].seen) options.push('w');

    if (!options.length) {
      stack.pop();
      if (!stack.length) break;
      continue;
    }

    var dir = Engine.pick(options);
    var next = { x: current.x, y: current.y };
    if (dir === 'n') next.y--;
    else if (dir === 's') next.y++;
    else if (dir === 'e') next.x++;
    else next.x--;

    var a = grid[index(current.x, current.y)];
    var b = grid[index(next.x, next.y)];
    a[dir] = false;
    b[{ n: 's', s: 'n', e: 'w', w: 'e' }[dir]] = false;
    b.seen = true;
    visited++;
    stack.push(next);
  }
}

function reset() {
  level = 1;
  nextMaze();
}

function nextMaze() {
  carve();
  player = { x: 0, y: 0 };
  goal = { x: cols - 1, y: cols - 1 };
  moves = 0;
  startedAt = performance.now();
  elapsed = 0;
}

function move(dx, dy) {
  if (!G.playing) return;
  var here = grid[index(player.x, player.y)];
  if (dx === 1 && here.e) return;
  if (dx === -1 && here.w) return;
  if (dy === 1 && here.s) return;
  if (dy === -1 && here.n) return;

  player.x += dx;
  player.y += dy;
  moves++;
  Engine.audio.tone(300 + moves % 6 * 40, 0.03, 'sine', 0.05);

  if (player.x === goal.x && player.y === goal.y) {
    var seconds = Math.max(1, Math.round(elapsed));
    G.addScore(Math.max(50, 600 - moves * 4 - seconds * 3));
    G.particles.burst(goal.x * cell + cell / 2, goal.y * cell + cell / 2, 26, C.accent2, 220);
    Engine.audio.tone(880, 0.12, 'triangle', 0.14);
    level++;
    CELLS = Math.min(MAX_CELLS, CELLS + 2);
    nextMaze();
  }
}

var G = Game({
  W: W, H: H,
  key: '${e.slug}.best',
  title: '${e.title}',
  intro: 'Find the way out. Arrows, WASD, or swipe. Each maze is bigger than the last.',
  particleGravity: 0,

  onStart: function () { CELLS = 15; reset(); },

  onUpdate: function () {
    elapsed = (performance.now() - startedAt) / 1000;
  },

  onKey: function (key) {
    if (key === 'ArrowUp' || key === 'w') move(0, -1);
    else if (key === 'ArrowDown' || key === 's') move(0, 1);
    else if (key === 'ArrowLeft' || key === 'a') move(-1, 0);
    else if (key === 'ArrowRight' || key === 'd') move(1, 0);
  },
  onSwipe: function (d) {
    if (d === 'up') move(0, -1);
    else if (d === 'down') move(0, 1);
    else if (d === 'left') move(-1, 0);
    else move(1, 0);
  },

  onDraw: function (ctx) {
    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, W, H);

    var size = cols * cell;
    var ox = (W - size) / 2, oy = (H - size) / 2;

    ctx.save();
    ctx.translate(ox, oy);

    ctx.fillStyle = C.accent2;
    ctx.globalAlpha = 0.25;
    ctx.fillRect(goal.x * cell, goal.y * cell, cell, cell);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 2;
    ctx.lineCap = 'square';
    ctx.beginPath();
    for (var y = 0; y < cols; y++) {
      for (var x = 0; x < cols; x++) {
        var c = grid[index(x, y)];
        var px = x * cell, py = y * cell;
        if (c.n) { ctx.moveTo(px, py); ctx.lineTo(px + cell, py); }
        if (c.w) { ctx.moveTo(px, py); ctx.lineTo(px, py + cell); }
        if (y === cols - 1 && c.s) { ctx.moveTo(px, py + cell); ctx.lineTo(px + cell, py + cell); }
        if (x === cols - 1 && c.e) { ctx.moveTo(px + cell, py); ctx.lineTo(px + cell, py + cell); }
      }
    }
    ctx.stroke();

    ctx.fillStyle = C.accent;
    ctx.beginPath();
    ctx.arc(player.x * cell + cell / 2, player.y * cell + cell / 2, cell * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    Engine.text(ctx, 'Level ' + level + '  ·  ' + moves + ' moves  ·  ' + Math.round(elapsed) + 's', W / 2, 18, 15, C.inkDim, 'center');
  }
});
`,markup:X(e,"Arrows, WASD or swipe · Esc to pause","Maze grid"),css:J("1 / 1"),howTo:["Arrows, WASD, or swipe to move.","Reach the highlighted corner. Each maze is two cells wider than the last, up to 31.","Fewer moves and less time means a higher score."],notes:["The maze is carved with a recursive backtracker using an explicit stack, so it is a spanning tree: every cell is reachable and the exit can never be sealed off.","An explicit stack rather than recursion, because a 31×31 grid would otherwise risk a stack overflow.","Walls are drawn as lines between cells rather than filled blocks, which reads far better at small sizes."],engine:!0,scriptName:"game.js"}}function zn(e,t){return{script:`/* --- ${e.title} ---------------------------------------------------
   Input is locked while two cards are face up and while the flip-back timer
   runs. Without that lock, clicking quickly reveals the whole board — which
   is the way every memory game is broken. */

var SYMBOLS = ['\\u25B2', '\\u25CF', '\\u25A0', '\\u25C6', '\\u2605', '\\u271A', '\\u25D0', '\\u2726', '\\u25B6', '\\u2756', '\\u25C9', '\\u2725', '\\u2739', '\\u25CB', '\\u25B0'];
var SIZES = { easy: [4, 3], normal: [4, 4], hard: [6, 5] };

var board = document.getElementById('board');
var movesEl = document.getElementById('moves');
var pairsEl = document.getElementById('pairs');
var timeEl = document.getElementById('time');
var bestEl = document.getElementById('best');
var statusEl = document.getElementById('status');
var difficulty = document.getElementById('difficulty');

var cards = [], first = null, second = null, locked = false;
var moves = 0, matched = 0, total = 0, startedAt = 0, ticker = 0;

function best(key) { return Engine.store.get('${e.slug}.best.' + key, null); }

function newGame() {
  var size = SIZES[difficulty.value] || SIZES.normal;
  var pairs = (size[0] * size[1]) / 2;
  var deck = [];
  for (var i = 0; i < pairs; i++) {
    deck.push({ symbol: SYMBOLS[i % SYMBOLS.length], pair: i });
    deck.push({ symbol: SYMBOLS[i % SYMBOLS.length], pair: i });
  }
  Engine.shuffle(deck);

  cards = deck;
  first = second = null;
  locked = false;
  moves = 0;
  matched = 0;
  total = pairs;
  startedAt = 0;
  clearInterval(ticker);
  timeEl.textContent = '0s';
  movesEl.textContent = '0';
  pairsEl.textContent = '0 / ' + pairs;
  statusEl.textContent = 'Find every pair.';
  bestEl.textContent = best(difficulty.value) == null ? '—' : best(difficulty.value) + ' moves';

  board.style.setProperty('--cols', String(size[0]));
  board.textContent = '';
  for (var c = 0; c < cards.length; c++) {
    board.appendChild(makeCard(cards[c], c));
  }
}

function makeCard(card, index) {
  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'card-tile';
  button.setAttribute('aria-label', 'Card ' + (index + 1) + ', face down');
  button.dataset.index = String(index);

  var inner = document.createElement('span');
  inner.className = 'card-tile__inner';

  var back = document.createElement('span');
  back.className = 'card-tile__face card-tile__back';

  var front = document.createElement('span');
  front.className = 'card-tile__face card-tile__front';
  front.textContent = card.symbol;

  inner.appendChild(back);
  inner.appendChild(front);
  button.appendChild(inner);
  button.addEventListener('click', function () { flip(button, card); });
  return button;
}

function startClock() {
  if (startedAt) return;
  startedAt = Date.now();
  // Driven from the timestamp, so a throttled tab cannot make it run slow.
  ticker = setInterval(function () {
    timeEl.textContent = Math.round((Date.now() - startedAt) / 1000) + 's';
  }, 250);
}

function flip(button, card) {
  if (locked) return;
  if (button.classList.contains('is-up') || button.classList.contains('is-matched')) return;

  Engine.audio.tone(520, 0.05, 'sine', 0.08);
  startClock();
  button.classList.add('is-up');
  button.setAttribute('aria-label', 'Card showing ' + card.symbol);

  if (!first) { first = { button: button, card: card }; return; }

  second = { button: button, card: card };
  moves++;
  movesEl.textContent = String(moves);
  locked = true;

  if (first.card.pair === second.card.pair) {
    var a = first.button, b = second.button;
    setTimeout(function () {
      a.classList.add('is-matched');
      b.classList.add('is-matched');
      a.disabled = true;
      b.disabled = true;
      matched++;
      pairsEl.textContent = matched + ' / ' + total;
      Engine.audio.tone(880, 0.09, 'triangle', 0.11);
      first = second = null;
      locked = false;
      if (matched === total) finish();
    }, 260);
  } else {
    var x = first.button, y = second.button;
    // 700ms is long enough to memorise and short enough not to be a wait.
    setTimeout(function () {
      x.classList.remove('is-up');
      y.classList.remove('is-up');
      x.setAttribute('aria-label', 'Card face down');
      y.setAttribute('aria-label', 'Card face down');
      first = second = null;
      locked = false;
    }, 700);
  }
}

function finish() {
  clearInterval(ticker);
  var seconds = Math.round((Date.now() - startedAt) / 1000);
  var previous = best(difficulty.value);
  var record = previous == null || moves < previous;
  if (record) Engine.store.set('${e.slug}.best.' + difficulty.value, moves);
  bestEl.textContent = (record ? moves : previous) + ' moves';
  statusEl.textContent = record
    ? 'All pairs found in ' + moves + ' moves and ' + seconds + 's — a new best.'
    : 'All pairs found in ' + moves + ' moves and ' + seconds + 's.';
  Engine.audio.tone(660, 0.1, 'triangle', 0.12);
  setTimeout(function () { Engine.audio.tone(990, 0.16, 'triangle', 0.12); }, 120);
}

document.getElementById('restart').addEventListener('click', function () {
  Engine.audio.unlock();
  newGame();
});
difficulty.addEventListener('change', newGame);
newGame();
`,markup:`      <div class="toolbar">
        <label class="field">
          <span>Board</span>
          <select id="difficulty">
            <option value="easy">Easy · 6 pairs</option>
            <option value="normal" selected>Normal · 8 pairs</option>
            <option value="hard">Hard · 15 pairs</option>
          </select>
        </label>
        <button type="button" class="btn" id="restart">New game</button>
      </div>

      <div class="stats">
        <div class="stat"><span>Moves</span><strong id="moves">0</strong></div>
        <div class="stat"><span>Pairs</span><strong id="pairs">0 / 8</strong></div>
        <div class="stat"><span>Time</span><strong id="time">0s</strong></div>
        <div class="stat"><span>Best</span><strong id="best">—</strong></div>
      </div>

      <p class="status" id="status" role="status">Find every pair.</p>
      <div class="board" id="board"></div>`,css:`
.toolbar { display: flex; gap: 12px; align-items: end; flex-wrap: wrap; }
.field { display: grid; gap: 4px; font-size: 0.85rem; color: var(--ink-dim); }
.field select {
  min-height: 44px; padding: 0 12px; font: inherit; color: var(--ink);
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
}

.stats { display: flex; gap: calc(var(--space) * 3); flex-wrap: wrap; }
.stat { display: grid; }
.stat span { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-dim); }
.stat strong { font-size: var(--step-1); font-variant-numeric: tabular-nums; }

.status { color: var(--ink-dim); min-height: 1.6em; }

.board {
  display: grid;
  grid-template-columns: repeat(var(--cols, 4), 1fr);
  gap: 10px;
  max-width: 620px;
}

.card-tile {
  aspect-ratio: 1;
  padding: 0;
  perspective: 700px;
  background: none;
  border: 0;
}
.card-tile__inner {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  transition: transform 250ms var(--motion);
  transform-style: preserve-3d;
}
.card-tile.is-up .card-tile__inner,
.card-tile.is-matched .card-tile__inner { transform: rotateY(180deg); }

.card-tile__face {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: var(--radius);
  backface-visibility: hidden;
  font-size: clamp(20px, 6vw, 34px);
}
.card-tile__back {
  background: var(--surface-alt);
  border: 1px solid var(--line);
}
.card-tile__front {
  background: var(--accent);
  color: var(--accent-ink);
  transform: rotateY(180deg);
}
.card-tile.is-matched .card-tile__front { background: var(--good); color: var(--bg); }
.card-tile:disabled { cursor: default; }`,howTo:["Click or tap two cards to turn them over.","A pair stays face up; anything else turns back after 700 ms.","Fewer moves is better — the best score is kept per board size."],notes:["Input is locked while two cards are face up, so clicking quickly cannot reveal the board.","A mismatch stays visible for 700 ms — long enough to memorise, short enough not to be a wait.","The board is a CSS grid with square cards, so it fits any screen without a media query.","The clock is computed from a start timestamp rather than counted up, so a background tab does not slow it down."],engine:!0,scriptName:"game.js"}}function Wn(e,t){return{script:`/* --- ${e.title} ---------------------------------------------------
   Hard mode is full minimax. On nine squares the whole tree is about half a
   million positions in the worst case and it evaluates instantly, so there
   is no reason to approximate it — and it genuinely cannot be beaten. */

var LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

var boardEl = document.getElementById('board');
var statusEl = document.getElementById('status');
var tallyEl = { you: document.getElementById('tally-you'), draw: document.getElementById('tally-draw'), cpu: document.getElementById('tally-cpu') };
var modeEl = document.getElementById('mode');

var board, turn, over, thinking;
var tally = Engine.store.get('${e.slug}.tally', { you: 0, draw: 0, cpu: 0 });

function winner(cells) {
  for (var i = 0; i < LINES.length; i++) {
    var l = LINES[i];
    if (cells[l[0]] && cells[l[0]] === cells[l[1]] && cells[l[1]] === cells[l[2]]) return { mark: cells[l[0]], line: l };
  }
  return cells.indexOf('') === -1 ? { mark: 'draw', line: null } : null;
}

function empties(cells) {
  var list = [];
  for (var i = 0; i < 9; i++) if (!cells[i]) list.push(i);
  return list;
}

/** Returns a score from O's point of view: +10 win, -10 loss, 0 draw. */
function minimax(cells, isO, depth) {
  var result = winner(cells);
  if (result) {
    if (result.mark === 'O') return 10 - depth;
    if (result.mark === 'X') return depth - 10;
    return 0;
  }
  var options = empties(cells);
  var best = isO ? -Infinity : Infinity;
  for (var i = 0; i < options.length; i++) {
    cells[options[i]] = isO ? 'O' : 'X';
    var value = minimax(cells, !isO, depth + 1);
    cells[options[i]] = '';
    best = isO ? Math.max(best, value) : Math.min(best, value);
  }
  return best;
}

function bestMove(cells) {
  var options = empties(cells);
  var best = -Infinity, choice = options[0];
  for (var i = 0; i < options.length; i++) {
    cells[options[i]] = 'O';
    var value = minimax(cells, false, 0);
    cells[options[i]] = '';
    if (value > best) { best = value; choice = options[i]; }
  }
  return choice;
}

/** Easy takes an obvious win or block 60% of the time, otherwise plays freely. */
function easyMove(cells) {
  var options = empties(cells);
  if (Math.random() < 0.6) {
    for (var mark = 0; mark < 2; mark++) {
      var me = mark === 0 ? 'O' : 'X';
      for (var i = 0; i < options.length; i++) {
        cells[options[i]] = me;
        var result = winner(cells);
        cells[options[i]] = '';
        if (result && result.mark === me) return options[i];
      }
    }
  }
  return Engine.pick(options);
}

function render(highlight) {
  boardEl.textContent = '';
  for (var i = 0; i < 9; i++) {
    var cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell' + (highlight && highlight.indexOf(i) >= 0 ? ' is-win' : '');
    cell.textContent = board[i];
    cell.disabled = !!board[i] || over || thinking;
    cell.setAttribute('aria-label', 'Square ' + (i + 1) + (board[i] ? ', ' + board[i] : ', empty'));
    (function (index) {
      cell.addEventListener('click', function () { play(index); });
    })(i);
    boardEl.appendChild(cell);
  }
  tallyEl.you.textContent = String(tally.you);
  tallyEl.draw.textContent = String(tally.draw);
  tallyEl.cpu.textContent = String(tally.cpu);
}

function finish(result) {
  over = true;
  if (result.mark === 'X') { tally.you++; statusEl.textContent = 'You win.'; Engine.audio.tone(880, 0.12, 'triangle', 0.13); }
  else if (result.mark === 'O') { tally.cpu++; statusEl.textContent = 'The computer wins.'; Engine.audio.sweep(400, 150, 0.3, 0.12); }
  else { tally.draw++; statusEl.textContent = 'A draw.'; Engine.audio.tone(300, 0.14, 'sine', 0.1); }
  Engine.store.set('${e.slug}.tally', tally);
  render(result.line);
}

function play(index) {
  if (over || thinking || board[index]) return;
  Engine.audio.unlock();
  board[index] = 'X';
  Engine.audio.tone(560, 0.05, 'square', 0.09);

  var result = winner(board);
  if (result) return finish(result);

  thinking = true;
  render();
  statusEl.textContent = 'Thinking…';
  // A visible pause, so the reply reads as a move rather than a flicker.
  setTimeout(function () {
    var move = modeEl.value === 'hard' ? bestMove(board.slice()) : easyMove(board.slice());
    board[move] = 'O';
    Engine.audio.tone(400, 0.05, 'square', 0.09);
    thinking = false;
    var after = winner(board);
    if (after) return finish(after);
    statusEl.textContent = 'Your turn.';
    render();
  }, 300);
}

function reset() {
  board = ['', '', '', '', '', '', '', '', ''];
  turn = 'X';
  over = false;
  thinking = false;
  statusEl.textContent = 'Your turn. You are X.';
  render();
}

document.getElementById('restart').addEventListener('click', reset);
modeEl.addEventListener('change', reset);
reset();
`,markup:`      <div class="toolbar">
        <label class="field">
          <span>Computer</span>
          <select id="mode">
            <option value="easy" selected>Easy — beatable</option>
            <option value="hard">Perfect — cannot lose</option>
          </select>
        </label>
        <button type="button" class="btn" id="restart">New game</button>
      </div>

      <p class="status" id="status" role="status">Your turn. You are X.</p>
      <div class="board" id="board"></div>

      <div class="stats">
        <div class="stat"><span>You</span><strong id="tally-you">0</strong></div>
        <div class="stat"><span>Draws</span><strong id="tally-draw">0</strong></div>
        <div class="stat"><span>Computer</span><strong id="tally-cpu">0</strong></div>
      </div>`,css:`
.toolbar { display: flex; gap: 12px; align-items: end; flex-wrap: wrap; }
.field { display: grid; gap: 4px; font-size: 0.85rem; color: var(--ink-dim); }
.field select {
  min-height: 44px; padding: 0 12px; font: inherit; color: var(--ink);
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
}
.status { color: var(--ink-dim); min-height: 1.6em; }

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: min(100%, 380px);
}
.cell {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: clamp(38px, 12vw, 62px);
  font-weight: 700;
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  transition: background var(--motion);
}
.cell:hover:not(:disabled) { background: var(--surface-alt); }
.cell.is-win { background: var(--accent); color: var(--accent-ink); }

.stats { display: flex; gap: calc(var(--space) * 3); }
.stat { display: grid; }
.stat span { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-dim); }
.stat strong { font-size: var(--step-1); font-variant-numeric: tabular-nums; }`,howTo:["Click a square. You are X and you go first.","Easy can be beaten; Perfect runs full minimax and cannot lose.","The running tally is kept between visits."],notes:["Perfect mode is a complete minimax search — nine squares is small enough to solve exactly, and it returns instantly.","A draw is checked after the win test, so a full board never leaves the game hanging.","The computer chooses from the list of empty squares, so it can never play into an occupied one.","It replies after 300 ms so the move is visible rather than instantaneous."],engine:!0,scriptName:"game.js"}}function Bn(e,t){return{script:`/* --- ${e.title} ---------------------------------------------------
   Two rules make this correct rather than nearly correct:
   a tile that has merged this move is flagged and cannot merge again, so
   2 2 4 becomes 4 4 and not 8; and a new tile only appears when the board
   actually changed. */

var SIZE = 4;
var gridEl = document.getElementById('grid');
var scoreEl = document.getElementById('score');
var bestEl = document.getElementById('best');
var statusEl = document.getElementById('status');

var cells, score, best, previous, over, won;

best = Number(Engine.store.get('${e.slug}.best', 0)) || 0;

function empty() {
  var list = [];
  for (var i = 0; i < SIZE * SIZE; i++) if (!cells[i]) list.push(i);
  return list;
}

function addTile() {
  var free = empty();
  if (!free.length) return;
  cells[Engine.pick(free)] = { value: Math.random() < 0.9 ? 2 : 4, fresh: true, merged: false };
}

function reset() {
  cells = new Array(SIZE * SIZE).fill(null);
  score = 0;
  over = false;
  won = false;
  previous = null;
  addTile();
  addTile();
  statusEl.textContent = 'Slide to combine matching numbers.';
  render();
}

function serialise() {
  return cells.map(function (c) { return c ? c.value : 0; }).join(',');
}

function line(indices) {
  var values = [];
  for (var i = 0; i < indices.length; i++) if (cells[indices[i]]) values.push(cells[indices[i]]);

  var out = [];
  for (var v = 0; v < values.length; v++) {
    var current = values[v];
    var next = values[v + 1];
    if (next && next.value === current.value) {
      out.push({ value: current.value * 2, fresh: false, merged: true });
      score += current.value * 2;
      v++;                                  /* the merged pair is consumed */
    } else {
      out.push({ value: current.value, fresh: false, merged: false });
    }
  }
  while (out.length < indices.length) out.push(null);
  for (var k = 0; k < indices.length; k++) cells[indices[k]] = out[k];
}

function move(direction) {
  if (over) return;
  var before = serialise();
  previous = { cells: cells.map(function (c) { return c ? { value: c.value, fresh: false, merged: false } : null; }), score: score };

  for (var i = 0; i < SIZE; i++) {
    var indices = [];
    for (var j = 0; j < SIZE; j++) {
      if (direction === 'left') indices.push(i * SIZE + j);
      else if (direction === 'right') indices.push(i * SIZE + (SIZE - 1 - j));
      else if (direction === 'up') indices.push(j * SIZE + i);
      else indices.push((SIZE - 1 - j) * SIZE + i);
    }
    line(indices);
  }

  if (serialise() === before) { previous = null; return; }

  Engine.audio.tone(300, 0.04, 'sine', 0.06);
  addTile();
  render();

  if (!won) {
    for (var t = 0; t < cells.length; t++) {
      if (cells[t] && cells[t].value >= 2048) {
        won = true;
        statusEl.textContent = 'You made 2048. Keep going if you like.';
        Engine.audio.tone(880, 0.14, 'triangle', 0.13);
        break;
      }
    }
  }
  if (!movesRemain()) {
    over = true;
    statusEl.textContent = 'No moves left. Final score ' + score + '.';
    Engine.audio.sweep(360, 120, 0.35, 0.14);
  }
}

/** Game over needs a merge test as well as an empty-cell test. */
function movesRemain() {
  if (empty().length) return true;
  for (var y = 0; y < SIZE; y++) {
    for (var x = 0; x < SIZE; x++) {
      var here = cells[y * SIZE + x];
      if (x < SIZE - 1 && cells[y * SIZE + x + 1] && cells[y * SIZE + x + 1].value === here.value) return true;
      if (y < SIZE - 1 && cells[(y + 1) * SIZE + x] && cells[(y + 1) * SIZE + x].value === here.value) return true;
    }
  }
  return false;
}

function undo() {
  if (!previous) return;
  cells = previous.cells;
  score = previous.score;
  previous = null;
  over = false;
  statusEl.textContent = 'Took that one back.';
  render();
}

function render() {
  gridEl.textContent = '';
  for (var i = 0; i < cells.length; i++) {
    var tile = document.createElement('div');
    var value = cells[i] ? cells[i].value : 0;
    tile.className = 'tile' + (value ? ' tile--' + Math.min(value, 4096) : ' tile--empty') +
      (cells[i] && cells[i].fresh ? ' is-new' : '') + (cells[i] && cells[i].merged ? ' is-merged' : '');
    tile.textContent = value ? String(value) : '';
    if (cells[i]) cells[i].fresh = false;
    gridEl.appendChild(tile);
  }
  scoreEl.textContent = String(score);
  if (score > best) {
    best = score;
    Engine.store.set('${e.slug}.best', best);
  }
  bestEl.textContent = String(best);
}

window.addEventListener('keydown', function (e) {
  var map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', a: 'left', d: 'right', w: 'up', s: 'down' };
  var direction = map[e.key];
  if (!direction) return;
  e.preventDefault();                        /* or the page scrolls as you play */
  Engine.audio.unlock();
  move(direction);
});

Engine.pointer(gridEl, { toLocal: function (x, y) { return { x: x, y: y }; } }, {
  swipe: function (dir) { Engine.audio.unlock(); move(dir); }
});

document.getElementById('restart').addEventListener('click', reset);
document.getElementById('undo').addEventListener('click', undo);
reset();
`,markup:`      <div class="toolbar">
        <div class="stats">
          <div class="stat"><span>Score</span><strong id="score">0</strong></div>
          <div class="stat"><span>Best</span><strong id="best">0</strong></div>
        </div>
        <button type="button" class="btn btn--ghost" id="undo">Undo</button>
        <button type="button" class="btn" id="restart">New game</button>
      </div>

      <p class="status" id="status" role="status">Slide to combine matching numbers.</p>
      <div class="grid" id="grid"></div>`,css:`
.toolbar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.stats { display: flex; gap: calc(var(--space) * 3); margin-right: auto; }
.stat { display: grid; }
.stat span { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-dim); }
.stat strong { font-size: var(--step-1); font-variant-numeric: tabular-nums; }
.status { color: var(--ink-dim); min-height: 1.6em; }

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 10px;
  width: min(100%, 460px);
  aspect-ratio: 1;
  background: var(--surface-alt);
  border-radius: var(--radius);
  touch-action: none;
}
.tile {
  display: grid;
  place-items: center;
  border-radius: var(--radius);
  background: var(--surface);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(18px, 6vw, 32px);
  font-variant-numeric: tabular-nums;
  color: var(--ink);
}
.tile--empty { background: color-mix(in srgb, var(--surface) 50%, transparent); }
.tile--2, .tile--4 { background: var(--surface); }
.tile--8, .tile--16 { background: var(--accent-2); color: var(--bg); }
.tile--32, .tile--64 { background: var(--accent); color: var(--accent-ink); }
.tile--128, .tile--256, .tile--512 { background: var(--good); color: var(--bg); }
.tile--1024, .tile--2048, .tile--4096 { background: var(--bad); color: var(--bg); font-size: clamp(16px, 5vw, 28px); }

.is-new { animation: pop 140ms var(--motion); }
.is-merged { animation: bump 160ms var(--motion); }
@keyframes pop { from { transform: scale(0.4); opacity: 0; } }
@keyframes bump { 50% { transform: scale(1.12); } }`,howTo:["Arrow keys, WASD, or swipe.","Matching numbers merge. Reach 2048.","One level of undo, and the best score is kept."],notes:["A tile that merges is flagged for that move and cannot merge again, so 2 2 4 becomes 4 4 rather than 8.","A new tile only appears when the board actually changed, so a move into a wall does not hand you a free tile.","Game over checks for possible merges as well as for empty cells — a full board is not necessarily finished.","The tile text flips to the background colour above 8, where the tile colour is too light for dark ink."],engine:!0,scriptName:"game.js"}}function On(e,t){return{script:`/* --- ${e.title} ---------------------------------------------------
   The correct answer is stored as its text, not as an index, and the
   options are shuffled as whole values. That is deliberate: shuffling the
   strings while keeping a numeric "correct index" is how almost every quiz
   ends up marking the wrong answer right. */

var ROUND = 10;

var stageEl = document.getElementById('quiz');
var progressEl = document.getElementById('progress');
var scoreEl = document.getElementById('score');
var barEl = document.getElementById('bar');

var deck, index, score, answered, results;

function start() {
  deck = Engine.shuffle(QUESTIONS.slice()).slice(0, Math.min(ROUND, QUESTIONS.length));
  index = 0;
  score = 0;
  results = [];
  scoreEl.textContent = '0';
  show();
}

function show() {
  answered = false;
  var item = deck[index];
  progressEl.textContent = 'Question ' + (index + 1) + ' of ' + deck.length;
  barEl.style.width = Math.round((index / deck.length) * 100) + '%';

  stageEl.textContent = '';

  var question = document.createElement('h2');
  question.className = 'question';
  question.textContent = item.q;
  stageEl.appendChild(question);

  var list = document.createElement('div');
  list.className = 'options';

  var options = Engine.shuffle(item.options.slice());
  for (var i = 0; i < options.length; i++) {
    (function (value, position) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'option';
      var key = document.createElement('kbd');
      key.textContent = String(position + 1);
      var label = document.createElement('span');
      label.textContent = value;
      button.appendChild(key);
      button.appendChild(label);
      button.addEventListener('click', function () { choose(button, value, item); });
      list.appendChild(button);
    })(options[i], i);
  }
  stageEl.appendChild(list);
}

function choose(button, value, item) {
  if (answered) return;
  answered = true;
  Engine.audio.unlock();

  var correct = value === item.answer;
  if (correct) {
    score++;
    scoreEl.textContent = String(score);
    button.classList.add('is-right');
    Engine.audio.tone(880, 0.09, 'triangle', 0.12);
  } else {
    button.classList.add('is-wrong');
    Engine.audio.tone(200, 0.14, 'sawtooth', 0.1);
  }
  results.push({ q: item.q, chosen: value, answer: item.answer, correct: correct });

  var buttons = stageEl.querySelectorAll('.option');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
    /* Always show the right answer — a quiz that only says "wrong" teaches nothing. */
    if (buttons[i].lastChild.textContent === item.answer) buttons[i].classList.add('is-right');
  }

  setTimeout(function () {
    index++;
    if (index >= deck.length) finish();
    else show();
  }, 900);
}

function finish() {
  barEl.style.width = '100%';
  progressEl.textContent = 'Finished';
  stageEl.textContent = '';

  var heading = document.createElement('h2');
  heading.className = 'question';
  heading.textContent = 'You scored ' + score + ' out of ' + deck.length;
  stageEl.appendChild(heading);

  var verdict = document.createElement('p');
  verdict.className = 'muted';
  verdict.textContent = score === deck.length ? 'Perfect.' : score >= deck.length * 0.7 ? 'Strong round.' : 'Worth another go.';
  stageEl.appendChild(verdict);

  var review = document.createElement('ul');
  review.className = 'review';
  for (var i = 0; i < results.length; i++) {
    var row = document.createElement('li');
    row.className = results[i].correct ? 'is-right' : 'is-wrong';
    var q = document.createElement('strong');
    q.textContent = results[i].q;
    var a = document.createElement('span');
    a.textContent = results[i].correct ? results[i].answer : 'You said ' + results[i].chosen + ' — it was ' + results[i].answer;
    row.appendChild(q);
    row.appendChild(a);
    review.appendChild(row);
  }
  stageEl.appendChild(review);

  var again = document.createElement('button');
  again.type = 'button';
  again.className = 'btn';
  again.textContent = 'Play again';
  again.addEventListener('click', start);
  stageEl.appendChild(again);
}

window.addEventListener('keydown', function (e) {
  var n = Number(e.key);
  if (!n || n < 1 || n > 4) return;
  var buttons = stageEl.querySelectorAll('.option');
  if (buttons[n - 1]) buttons[n - 1].click();
});

document.getElementById('restart').addEventListener('click', start);
start();
`,markup:`      <div class="toolbar">
        <p id="progress" class="muted">Question 1</p>
        <div class="stat"><span>Score</span><strong id="score">0</strong></div>
        <button type="button" class="btn btn--ghost" id="restart">Restart</button>
      </div>

      <div class="progress"><div class="progress__bar" id="bar"></div></div>
      <div id="quiz" class="quiz"></div>`,css:`
.toolbar { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.toolbar #progress { margin-right: auto; }
.stat { display: flex; align-items: baseline; gap: 8px; }
.stat span { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-dim); }
.stat strong { font-size: var(--step-1); font-variant-numeric: tabular-nums; }

.progress { height: 6px; background: var(--surface-alt); border-radius: 999px; overflow: hidden; }
.progress__bar { height: 100%; width: 0; background: var(--accent); transition: width 300ms var(--motion); }

.quiz { display: grid; gap: calc(var(--space) * 3); }
.question { font-size: var(--step-2); max-width: 30ch; }

.options { display: grid; gap: 10px; max-width: 620px; }
.option {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 56px;
  padding: 12px 16px;
  text-align: left;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  transition: background var(--motion), border-color var(--motion);
}
.option:hover:not(:disabled) { border-color: var(--accent); }
.option kbd {
  display: grid;
  place-items: center;
  width: 26px; height: 26px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  background: var(--surface-alt);
  border-radius: 6px;
  color: var(--ink-dim);
  flex: none;
}
.option.is-right { background: var(--good); color: var(--bg); border-color: var(--good); }
.option.is-wrong { background: var(--bad); color: var(--bg); border-color: var(--bad); }
.option.is-right kbd, .option.is-wrong kbd { background: rgba(0,0,0,.2); color: inherit; }

.review { list-style: none; padding: 0; display: grid; gap: 10px; max-width: 640px; }
.review li { display: grid; gap: 2px; padding: 10px 14px; border-left: 3px solid var(--line); background: var(--surface); }
.review li.is-right { border-left-color: var(--good); }
.review li.is-wrong { border-left-color: var(--bad); }
.review span { color: var(--ink-dim); font-size: 0.92rem; }`,howTo:["Click an answer, or press 1 to 4.","The right answer is always shown, even when you get it wrong.","Ten questions a round, drawn at random from the bank."],notes:["The correct answer is stored as text and the whole option values are shuffled, so shuffling can never mark the wrong one right.","Options are disabled the moment one is chosen, so a fast second click cannot score twice.","The bank lives in questions.js on its own — swap in your own subject without touching the game."],engine:!0,scriptName:"game.js"}}const Hn=`/* The question bank.
   Real, checked general-knowledge questions, so the quiz works out of the box.
   Replace them with your own subject — keep the shape: a question, a list of
   options, and the correct answer written out in full rather than as an index,
   which is what stops shuffling from breaking the marking. */

var QUESTIONS = [
  { q: 'Which planet has the shortest day in the solar system?', options: ['Mercury', 'Jupiter', 'Mars', 'Neptune'], answer: 'Jupiter' },
  { q: 'What is the largest organ of the human body?', options: ['The liver', 'The skin', 'The lungs', 'The brain'], answer: 'The skin' },
  { q: 'In which country would you find the city of Marrakesh?', options: ['Egypt', 'Tunisia', 'Morocco', 'Algeria'], answer: 'Morocco' },
  { q: 'What does the "www" in a web address stand for?', options: ['World Wide Web', 'Web Wide World', 'Wide Web World', 'World Web Wide'], answer: 'World Wide Web' },
  { q: 'Which element has the chemical symbol "Au"?', options: ['Silver', 'Aluminium', 'Gold', 'Argon'], answer: 'Gold' },
  { q: 'How many minutes are there in a full week?', options: ['10,080', '7,200', '1,440', '43,200'], answer: '10,080' },
  { q: 'Which ocean is the deepest?', options: ['Atlantic', 'Indian', 'Southern', 'Pacific'], answer: 'Pacific' },
  { q: 'What is the capital of Canada?', options: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'], answer: 'Ottawa' },
  { q: 'Roughly how long does light take to reach Earth from the Sun?', options: ['8 minutes', '8 seconds', '8 hours', '80 minutes'], answer: '8 minutes' },
  { q: 'Which instrument measures atmospheric pressure?', options: ['Hygrometer', 'Barometer', 'Anemometer', 'Altimeter'], answer: 'Barometer' },
  { q: 'In computing, what does "CPU" stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Power Unit', 'Control Program Utility'], answer: 'Central Processing Unit' },
  { q: 'Which country has the most time zones, counting its overseas territories?', options: ['Russia', 'France', 'United States', 'China'], answer: 'France' },
  { q: 'What is the smallest prime number?', options: ['0', '1', '2', '3'], answer: '2' },
  { q: 'Which sea is the saltiest of the major seas?', options: ['The Red Sea', 'The Dead Sea', 'The Black Sea', 'The Caspian Sea'], answer: 'The Dead Sea' }
];
`;function Pe(e){return e.replace(/\b[a-z]/g,t=>t.toUpperCase())}const Gn={restaurant:"place",event:"good company",portfolio:"design and code",ecommerce:"well-made things",blog:"writing",docs:"the tool"};function Fn(e){return e.subject||e.subjectWords[0]||Gn[e.archetype]||"the work"}const qn=new Set(["make","makes","build","create","me","my","a","an","the","for","of","to","with","website","site","page","app","web","please","want","need","i","we","about","landing","simple","nice","good","new","small","own","personal","business","local"]);function Un(e){const t=e.raw.toLowerCase().replace(/[^a-z0-9\s-]/g," ").split(/\s+/).filter(n=>n.length>2&&!qn.has(n)),a=(e.subjectWords.length?e.subjectWords:t).slice(0,2);return Pe(a.join(" ")||e.title)}function oe(e,t){const a=Fn(e),n=Un(e),r=e.archetype==="restaurant",s=e.archetype==="event",o=e.archetype==="portfolio",c=e.archetype==="ecommerce",l=s?`${n}, and you should be there`:r?`${n} — made here, every day`:o?`${n}. I build things that work.`:c?`${n}, made properly and priced honestly`:`${n} without the usual friction`,u=s?`One afternoon of ${a}, in a room full of people who care about it. Doors at 6, and it is worth arriving early.`:r?`A small ${a} that opens early, uses good ingredients and does not cut corners. Come in, or call ahead.`:o?`Selected work in ${a} — what the problem was, what I did about it, and what changed as a result.`:c?"A short, considered range. Everything here is something we would use ourselves, and nothing is here to pad the catalogue.":`A straightforward approach to ${a}: fewer steps, clearer decisions, and nothing you have to learn twice.`,d=s?"Save me a seat":r?"See the menu":c?"Browse the range":o?"See the work":"Get started",h=r?`        <section class="practical" aria-label="Visiting">
          <div class="practical__item">
            <h2>Opening hours</h2>
            <dl class="hours">
              <div><dt>Monday to Friday</dt><dd>7:00 – 17:00</dd></div>
              <div><dt>Saturday</dt><dd>8:00 – 16:00</dd></div>
              <div><dt>Sunday</dt><dd>9:00 – 14:00</dd></div>
            </dl>
          </div>
          <div class="practical__item">
            <h2>Find us</h2>
            <p>128 Main Street, Milton, Ontario</p>
            <p><a href="tel:+19055550142">(905) 555-0142</a></p>
            <p><a href="https://maps.google.com/?q=128+Main+Street+Milton+Ontario" rel="noopener">Open in Maps</a></p>
          </div>
          <div class="practical__item">
            <h2>Orders</h2>
            <p>Call before 15:00 the day before for anything large. We bake to order rather than to a forecast.</p>
            <p><a href="mailto:hello@example.com">hello@example.com</a></p>
          </div>
        </section>`:s?`        <section class="practical" aria-label="Details">
          <div class="practical__item"><h2>When</h2><p>Saturday 12 September, 18:00 – 22:00</p><p class="muted">Doors at 17:30.</p></div>
          <div class="practical__item"><h2>Where</h2><p>The Old Exchange, 12 Market Square</p><p><a href="https://maps.google.com/?q=The+Old+Exchange+Market+Square" rel="noopener">Open in Maps</a></p></div>
          <div class="practical__item"><h2>Tickets</h2><p>Free, but the room holds 120 people.</p><p><a href="#rsvp">Reserve a place</a></p></div>
        </section>`:"",m=o?`        <section class="work" id="work" aria-label="Selected work">
          <h2 class="section-title">Selected work</h2>
          <article class="project">
            <h3>Order tracking that people stopped phoning about</h3>
            <p class="project__meta">Six weeks · design and front end</p>
            <p>Support was taking two hundred "where is my order" calls a week. I replaced the status email with a live page and a single honest estimate, then made the estimate visible before checkout rather than after it.</p>
            <p class="project__result">Calls about order status fell by roughly two thirds within a month.</p>
          </article>
          <article class="project">
            <h3>A booking flow that fits on one screen</h3>
            <p class="project__meta">Three weeks · end to end</p>
            <p>The old form asked for eleven fields across four steps. Seven of them were only needed after payment, so they moved there, and the rest fitted in one view with the price always visible.</p>
            <p class="project__result">Completed bookings rose by about a fifth, with no change to traffic.</p>
          </article>
          <article class="project">
            <h3>${Pe(a)} tooling for a team of four</h3>
            <p class="project__meta">Ongoing</p>
            <p>A small internal tool that removed a spreadsheet nobody trusted. It does one job, it is fast, and it has needed almost no maintenance.</p>
            <p class="project__result">The spreadsheet has not been opened since March.</p>
          </article>
        </section>`:c?`        <section class="products" id="range" aria-label="The range">
          <h2 class="section-title">The range</h2>
          <div class="grid-cards">
            <article class="card product"><h3>The everyday one</h3><p>What you will reach for most. Nothing clever, made well.</p><p class="price">$38</p></article>
            <article class="card product"><h3>The heavy one</h3><p>Twice the weight, for when the everyday one is not enough.</p><p class="price">$64</p></article>
            <article class="card product"><h3>The small one</h3><p>Fits in a pocket. Same materials, less of them.</p><p class="price">$24</p></article>
            <article class="card product"><h3>The set</h3><p>All three, boxed. Works out cheaper than buying them separately.</p><p class="price">$112</p></article>
          </div>
          <p class="muted">Prices include tax. Shipping is flat rate and free over $75.</p>
        </section>`:`        <section class="features" id="what" aria-label="What it does">
          <h2 class="section-title">What it actually does</h2>
          <div class="grid-cards">
            <article class="card">
              <h3>It starts on the first screen</h3>
              <p>No setup wizard and no empty dashboard. The thing you came to do is the first thing in front of you.</p>
            </article>
            <article class="card">
              <h3>It keeps your work</h3>
              <p>Everything is saved as you go. Close the tab, come back next week, and it is exactly where you left it.</p>
            </article>
            <article class="card">
              <h3>It works on a phone</h3>
              <p>Not a shrunk-down desktop layout — a version built for a thumb, with the same features and none of the pinching.</p>
            </article>
          </div>
        </section>

        <section class="steps" aria-label="How it works">
          <h2 class="section-title">Three steps, then you are done</h2>
          <ol class="steps__list">
            <li><strong>Say what you want.</strong> One sentence is enough to start.</li>
            <li><strong>Watch it take shape.</strong> Every change is visible while it happens, and nothing is hidden behind a spinner.</li>
            <li><strong>Keep it.</strong> Download it, share it, or carry on editing. It is yours either way.</li>
          </ol>
        </section>`,p=`        <section class="cta" id="rsvp" aria-label="${s?"Reserve a place":"Get started"}">
          <h2>${s?"Reserve a place":r?"Come and see us":"Ready when you are"}</h2>
          <p>${s?"Send a note and we will keep one for you.":r?"We are open from seven, and the good things go early.":"No account needed to look around."}</p>
          <a class="btn" href="mailto:hello@example.com?subject=${encodeURIComponent(n)}">${d}</a>
        </section>`,g=`      <header class="site-header">
        <a class="brand" href="#top">${n}</a>
        <nav aria-label="Main">
          <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav">Menu</button>
          <ul class="nav" id="nav">
            <li><a href="#what">${o?"Work":c?"Range":r?"Menu":"What it does"}</a></li>
            <li><a href="#story">About</a></li>
            <li><a href="#rsvp" class="nav__cta">${d}</a></li>
          </ul>
        </nav>
      </header>

      <section class="hero" id="top">
        <p class="eyebrow">${s?"Saturday 12 September":r?"Open from 7am":Pe(a)}</p>
        <h1>${l}</h1>
        <p class="hero__sub">${u}</p>
        <div class="hero__actions">
          <a class="btn" href="#rsvp">${d}</a>
          <a class="btn btn--ghost" href="#what">${o?"See the work":"Read more"}</a>
        </div>
      </section>

${h}

${m}

      <section class="story" id="story" aria-label="About">
        <h2 class="section-title">Why this exists</h2>
        <p>Most things in ${a} are built for the person selling them rather than the person using them. This one started from the opposite end: what does someone actually need in the first thirty seconds, and what can be removed entirely?</p>
        <p>The answer turned out to be less than expected. What is left is here.</p>
        <blockquote class="quote">
          <p>It does the one thing, it does it quickly, and it has never once asked me to sign up before showing me anything.</p>
          <cite>An early user — replace with a real quote before publishing</cite>
        </blockquote>
      </section>

${p}

      <footer class="site-footer">
        <p>© <span id="year">2026</span> ${n}. Built as a single page — no trackers, no cookie banner, nothing to accept.</p>
        <p><a href="mailto:hello@example.com">hello@example.com</a></p>
      </footer>`;return{script:`/* --- ${e.title} ---------------------------------------------------
   A marketing page needs almost no JavaScript. This is the mobile menu, the
   current year, and a scroll-spy that marks the section you are looking at. */

var toggle = document.getElementById('nav-toggle');
var nav = document.getElementById('nav');

toggle.addEventListener('click', function () {
  var open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
  nav.classList.toggle('is-open', !open);
});

/* Close the menu after following a link, or the page appears not to move. */
var links = nav.querySelectorAll('a');
for (var i = 0; i < links.length; i++) {
  links[i].addEventListener('click', function () {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  });
}

document.getElementById('year').textContent = String(new Date().getFullYear());

if ('IntersectionObserver' in window) {
  var sections = document.querySelectorAll('section[id]');
  var observer = new IntersectionObserver(function (entries) {
    for (var e = 0; e < entries.length; e++) {
      if (!entries[e].isIntersecting) continue;
      var id = entries[e].target.id;
      for (var l = 0; l < links.length; l++) {
        links[l].classList.toggle('is-current', links[l].getAttribute('href') === '#' + id);
      }
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  for (var s = 0; s < sections.length; s++) observer.observe(sections[s]);
}
`,markup:g,css:`
/* Deliberately a block, not a grid. A section containing an auto-fit grid has
   a min-content width of all its columns side by side; as a grid ITEM that
   cannot shrink, and the whole page ends up twice the width of the phone. */
.page { display: block; }

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 14px clamp(16px, 4vw, 48px);
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
}
.brand { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: var(--ink); text-decoration: none; margin-right: auto; }

.nav { display: flex; gap: 22px; list-style: none; padding: 0; align-items: center; }
.nav a { color: var(--ink-dim); text-decoration: none; font-size: 0.95rem; }
.nav a:hover, .nav a.is-current { color: var(--ink); }
.nav__cta { color: var(--accent) !important; font-weight: 600; }
.nav-toggle { display: none; min-height: 44px; padding: 0 12px; border: 1px solid var(--line); border-radius: var(--radius); }

.hero {
  padding: clamp(56px, 12vw, 128px) clamp(16px, 4vw, 48px) clamp(40px, 8vw, 96px);
  max-width: 1120px;
  margin-inline: auto;
  width: 100%;
}
.eyebrow { color: var(--accent); font-size: 0.82rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; }
.hero h1 { margin-top: 14px; max-width: 18ch; font-size: clamp(2.2rem, 6.5vw, 4rem); }
.hero__sub { margin-top: 18px; font-size: clamp(1.05rem, 2.2vw, 1.3rem); color: var(--ink-dim); max-width: 52ch; }
.hero__actions { margin-top: 30px; display: flex; gap: 12px; flex-wrap: wrap; }

section { padding: clamp(44px, 8vw, 88px) clamp(16px, 4vw, 48px); max-width: 1120px; margin-inline: auto; width: 100%; }
.section-title { font-size: clamp(1.5rem, 3.6vw, 2.2rem); margin-bottom: 26px; }

/* min(230px, 100%) rather than a bare 230px: on a narrow screen the track
   floor must be allowed to fall below its ideal, or the row cannot collapse. */
.practical { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(230px, 100%), 1fr)); gap: 32px; border-block: 1px solid var(--line); }
.practical h2 { font-size: 1rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-dim); margin-bottom: 10px; }
.hours div { display: flex; justify-content: space-between; gap: 12px; padding: 4px 0; border-bottom: 1px dotted var(--line); }
.hours dt { color: var(--ink-dim); }
.hours dd { margin: 0; font-variant-numeric: tabular-nums; }

.grid-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr)); gap: 18px; }
.card h3 { font-size: 1.15rem; margin-bottom: 8px; }
.card p { color: var(--ink-dim); }
.product .price { margin-top: 12px; color: var(--ink); font-weight: 700; font-size: 1.2rem; }

.steps__list { counter-reset: step; list-style: none; padding: 0; display: grid; gap: 16px; max-width: 62ch; }
.steps__list li { position: relative; padding-left: 48px; color: var(--ink-dim); }
.steps__list li::before {
  counter-increment: step;
  content: counter(step);
  position: absolute; left: 0; top: -2px;
  width: 32px; height: 32px;
  display: grid; place-items: center;
  background: var(--accent); color: var(--accent-ink);
  border-radius: 50%; font-weight: 700; font-size: 0.9rem;
}
.steps__list strong { color: var(--ink); }

.project { padding: 24px 0; border-top: 1px solid var(--line); }
.project h3 { font-size: 1.3rem; }
.project__meta { color: var(--ink-dim); font-size: 0.85rem; letter-spacing: 0.04em; margin: 4px 0 12px; }
.project__result { margin-top: 10px; color: var(--accent); font-weight: 600; }

.quote { margin-top: 32px; padding: 20px 24px; border-left: 3px solid var(--accent); background: var(--surface); }
.quote p { font-size: 1.15rem; }
.quote cite { display: block; margin-top: 10px; color: var(--ink-dim); font-size: 0.88rem; font-style: normal; }

.cta { text-align: center; background: var(--surface); border-block: 1px solid var(--line); max-width: none; }
.cta h2 { font-size: clamp(1.6rem, 4vw, 2.4rem); }
.cta p { margin: 12px auto 24px; color: var(--ink-dim); max-width: 46ch; }

.site-footer {
  display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  padding: 28px clamp(16px, 4vw, 48px);
  color: var(--ink-dim); font-size: 0.9rem;
  max-width: 1120px; margin-inline: auto; width: 100%;
}

@media (max-width: 720px) {
  .nav-toggle { display: block; }
  .nav {
    position: absolute; left: 0; right: 0; top: 100%;
    flex-direction: column; align-items: stretch; gap: 0;
    background: var(--bg); border-bottom: 1px solid var(--line);
    display: none;
  }
  .nav.is-open { display: flex; }
  .nav li { border-top: 1px solid var(--line); }
  .nav a { display: block; padding: 14px clamp(16px, 4vw, 48px); }
  .site-header { position: relative; }
}`,howTo:["Open index.html. The whole page is one file of markup, one stylesheet and a few lines of script.","Replace the copy with your own — the structure is what matters, the words are a starting point.","Search for example.com and the sample quote; those are the two things that must be changed before it goes live."],notes:['Real written copy throughout — no lorem ipsum and no unnamed "Feature One" cards.',"One primary action, repeated: the header, the hero and the closing section all point at the same thing.","Text blocks are capped at about 52 to 62 characters a line, which is the range that reads comfortably.","The mobile menu is a real disclosure with aria-expanded, and it closes after a link is followed.","Nothing is loaded from the internet — no fonts, no analytics, no cookie banner to accept."],engine:!1,scriptName:"app.js"}}function Yn(e,t){return{script:"",markup:`      <header class="cv-head">
        <h1>${Pe(e.subjectWords.slice(0,2).join(" ")||"Your Name")}</h1>
        <p class="cv-role">Software developer — front end and product</p>
        <ul class="cv-contact">
          <li><a href="mailto:hello@example.com">hello@example.com</a></li>
          <li><a href="tel:+19055550142">(905) 555-0142</a></li>
          <li>Milton, Ontario</li>
          <li><a href="https://example.com" rel="noopener">example.com</a></li>
        </ul>
      </header>

      <section aria-label="Summary">
        <p class="cv-summary">Builds and ships small products end to end — interface, logic and the parts nobody wants to own. Most recent work has been on tools where the measure of success is that people stop asking for help.</p>
      </section>

      <section aria-label="Experience">
        <h2>Experience</h2>

        <article class="entry">
          <div class="entry__head">
            <h3>Front-end developer · Northline Tools</h3>
            <p class="entry__dates">2024 — present</p>
          </div>
          <ul>
            <li>Rebuilt the order-status page as a live view, which cut "where is my order" support contacts by roughly two thirds.</li>
            <li>Took the booking flow from four steps to one screen; completed bookings rose about a fifth on the same traffic.</li>
            <li>Introduced a shared component set that removed three separate button implementations.</li>
          </ul>
        </article>

        <article class="entry">
          <div class="entry__head">
            <h3>Developer · Freelance</h3>
            <p class="entry__dates">2022 — 2024</p>
          </div>
          <ul>
            <li>Delivered eleven small sites and internal tools for local businesses, all hand-built and all still running.</li>
            <li>Standardised on plain HTML, CSS and JavaScript for anything under a certain size, which made handover trivial.</li>
          </ul>
        </article>
      </section>

      <section aria-label="Skills">
        <h2>Skills</h2>
        <ul class="cv-skills">
          <li>JavaScript, TypeScript</li>
          <li>HTML, CSS, accessibility</li>
          <li>React, plain DOM</li>
          <li>Node, REST APIs</li>
          <li>Git, CI</li>
          <li>Design systems</li>
        </ul>
      </section>

      <section aria-label="Education">
        <h2>Education</h2>
        <article class="entry">
          <div class="entry__head">
            <h3>BSc Computer Science · University of Waterloo</h3>
            <p class="entry__dates">2018 — 2022</p>
          </div>
        </article>
      </section>

      <p class="cv-note muted">Replace every line above with your own history before sending this anywhere.</p>`,css:`
.page { max-width: 820px; margin-inline: auto; padding: clamp(24px, 5vw, 56px); }

.cv-head { border-bottom: 2px solid var(--ink); padding-bottom: 18px; margin-bottom: 26px; }
.cv-head h1 { font-size: clamp(2rem, 6vw, 2.8rem); }
.cv-role { color: var(--ink-dim); font-size: 1.05rem; margin-top: 4px; }
.cv-contact { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 6px 20px; margin-top: 12px; font-size: 0.92rem; color: var(--ink-dim); }

section { margin-bottom: 26px; }
section h2 {
  font-size: 0.86rem; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-dim); border-bottom: 1px solid var(--line);
  padding-bottom: 6px; margin-bottom: 14px;
}
.cv-summary { font-size: 1.05rem; max-width: 70ch; }

.entry { margin-bottom: 18px; break-inside: avoid; page-break-inside: avoid; }
.entry__head { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; }
.entry__head h3 { font-size: 1.05rem; }
.entry__dates { color: var(--ink-dim); font-size: 0.9rem; font-variant-numeric: tabular-nums; white-space: nowrap; }
.entry ul { margin-top: 8px; padding-left: 20px; display: grid; gap: 5px; }
.entry li { color: var(--ink-dim); }

.cv-skills { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(160px, 100%), 1fr)); gap: 6px 20px; }
.cv-note { font-size: 0.85rem; margin-top: 32px; }

@media (max-width: 560px) {
  .entry__head { flex-direction: column; gap: 2px; }
}

/* Printing is the point of a résumé, so it gets a proper stylesheet. */
@media print {
  :root { --bg: #fff; --surface: #fff; --ink: #000; --ink-dim: #333; --line: #999; --accent: #000; }
  body { font-size: 11pt; line-height: 1.42; background: #fff; color: #000; }
  .page { max-width: none; padding: 14mm; }
  .cv-note, .no-print { display: none; }
  a { color: #000; text-decoration: none; }
  h1 { font-size: 20pt; }
  section h2 { font-size: 9pt; }
  .entry { page-break-inside: avoid; }
  @page { margin: 12mm; }
}`,howTo:["Replace every line with your own history — the sample content is there to show the shape.","Print or save as PDF straight from the browser; the print stylesheet handles the rest."],notes:["A full @media print block: black on white, 11pt body, 12mm page margins, and page-break-inside: avoid on every entry so nothing splits across pages.","Dates are right-aligned in a two-column row that stacks below 560 px.","Contact details are real links — the phone number dials and the address is copyable."],engine:!1,scriptName:"app.js"}}const Gt={snake:Nn,breakout:Ln,pong:In,flappy:Pn,runner:$n,shooter:Dn,rhythm:Mn,maze:Rn,memory:zn,tictactoe:Wn,2048:Bn,quiz:On,todo:nt,"generic-app":nt,calculator:Sn,timer:An,drawing:_n,dashboard:Cn,landing:oe,portfolio:oe,restaurant:oe,event:oe,ecommerce:oe,resume:Yn},Kn={platformer:"runner",towerdefense:"shooter",tetris:"2048",clicker:"2048",minesweeper:"memory",simon:"memory",wordguess:"quiz",typing:"quiz",flashcards:"quiz",converter:"calculator",notes:"todo",habit:"todo",kanban:"todo",budget:"todo",chatui:"todo",gallery:"todo",musicplayer:"todo",markdown:"todo",weather:"todo",blog:"landing",docs:"landing"},Vn={arcade:"runner",board:"memory",crud:"todo",utility:"calculator",marketing:"landing",canvas:"drawing"};function Ft(e){return Gt[e.archetype]?e.archetype:Kn[e.archetype]??Vn[Q(e.archetype).family]??"todo"}function Xn(e){return Gt[Ft(e)]??nt}function Jn(e,t){const a=Ft(e),n=a!==e.archetype,r=Q(e.archetype),s=Q(a),o=n?{...e,archetype:a,archetypeLabel:s.label,kind:s.kind,title:e.subject?`${e.subject.split(" ")[0].replace(/^./,m=>m.toUpperCase())} ${s.label.toLowerCase()}`:s.label}:e,c=Xn(e)(o,t),l=o.kind==="site",u=o,d=[];c.engine&&d.push("engine.js"),u.archetype==="quiz"&&d.push("questions.js"),c.script.trim()&&d.push(c.scriptName);const h={"index.html":Qn(u,t,c,d,l),"styles.css":`${Oa(t)}
${l?"":Zn}
${c.css}
`};return c.engine&&(h["engine.js"]=Tn),u.archetype==="quiz"&&(h["questions.js"]=Hn),c.script.trim()&&(h[c.scriptName]=c.script),h["README.md"]=ai(u,t,c,s.label,n?r.label:null),{files:h,builtArchetype:a,substitutedFor:n?r.label:null,plan:["Work out what was asked for","Choose the palette and the type","Write the page and the styles",u.kind==="game"?"Write the game logic":"Write the behaviour","Check it over"],summary:ni(u,t,c,n?r.label:null),notes:c.notes,howTo:c.howTo}}const Zn=`
.page {
  width: min(100% - 32px, 860px);
  margin-inline: auto;
  min-height: 100dvh;
  padding-block: 34px 56px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.masthead h1 { font-size: var(--step-3); }
.masthead p { margin-top: 4px; color: var(--ink-dim); }
.main { display: flex; flex-direction: column; gap: 20px; min-width: 0; }

@media (max-width: 560px) {
  .page { width: min(100% - 20px, 860px); padding-block: 20px 36px; gap: 20px; }
}
`;function Qn(e,t,a,n,r){const s=qt(e),o=n.map(l=>`  <script src="${l}" defer><\/script>`).join(`
`),c=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${de(e.title)}</title>
  <meta name="description" content="${de(s)}">
  <meta name="color-scheme" content="${t.scheme}">
  <link rel="icon" href="${ti(e.title,t)}">
  <link rel="stylesheet" href="styles.css">
</head>
<body>`;return r?`${c}
  <div class="page">
${a.markup}
  </div>
${o}
</body>
</html>
`:`${c}
  <div class="page">
    <header class="masthead">
      <h1>${de(e.title)}</h1>
      <p>${de(ei(e))}</p>
    </header>

    <main class="main">
${a.markup}
    </main>
  </div>
${o}
</body>
</html>
`}function ei(e){return e.kind==="game"?"Built to be played with a keyboard or a thumb.":e.kind==="viz"?"Numbers with a baseline, and units on everything.":"Everything is saved as you go."}function qt(e){const t=e.archetypeLabel.toLowerCase();return e.subject?`A ${t} about ${e.subject}.`:`A ${t}, built to work on a phone as well as a laptop.`}function de(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ti(e,t){const a=de((e.trim()[0]??"M").toUpperCase()),n=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='${t.colors.accent}'/><text x='32' y='45' font-family='system-ui,sans-serif' font-size='38' font-weight='700' text-anchor='middle' fill='${t.colors.accentInk}'>${a}</text></svg>`;return`data:image/svg+xml,${encodeURIComponent(n)}`}function ai(e,t,a,n,r){const s=["`index.html`  the markup","`styles.css`  the design tokens and the layout"];return a.engine&&s.push("`engine.js`  the shared runtime — canvas fitting, the loop, input, sound"),e.archetype==="quiz"&&s.push("`questions.js`  the question bank, on its own so it can be swapped"),a.script.trim()&&s.push(`\`${a.scriptName}\`  ${e.kind==="game"?"the game":"the behaviour"}`),`# ${e.title}

${qt(e)} A ${n.toLowerCase()}, built from the sentence
"${e.raw.replace(/\n+/g," ").slice(0,160)}".
${r?`
> You asked for a ${r.toLowerCase()}. The builder that ships inside the app
> does not have one, so it built the closest thing it does have. For a real
> ${r.toLowerCase()}, switch to **Free** or your own key in Settings.
`:""}
## How to use it

${a.howTo.map(o=>`- ${o}`).join(`
`)}

Open \`index.html\` in a browser. There is nothing to install and nothing to
build — it is plain HTML, CSS and JavaScript, and it works offline.

## The decisions

${a.notes.map(o=>`- ${o}`).join(`
`)}

## The look

**${t.name}** — ${t.notes}

The palette lives in \`:root\` in \`styles.css\` as custom properties. Change
\`--accent\` and the whole thing follows. No web fonts: the stacks are faces
that ship with Windows, macOS, iOS and Android, so it looks right with the
network off.

## The files

${s.map(o=>`- ${o}`).join(`
`)}

---

Built by the builder inside **Masterpiece Coder**, which runs on your own
machine with no account, no key and no internet. Switch to one of the AI
providers in Settings for something made to order.
`}function ni(e,t,a,n){return[n?`You asked for a ${n.toLowerCase()}, and the builder inside the app does not have one — so it built **${e.title}** instead, which is the closest thing it does have. Switch to **Free** or your own key in Settings for a real ${n.toLowerCase()}.`:`**${e.title}** is built and ready to play in the Preview panel.`,"",a.howTo.map(s=>`- ${s}`).join(`
`),"","The choices worth knowing about:",a.notes.slice(0,4).map(s=>`- ${s}`).join(`
`),"",`The look is **${t.name}** — ${t.notes.split(".")[0].toLowerCase()}. Everything is in \`styles.css\` as custom properties, so changing \`--accent\` re-themes the whole thing.`,"","This came from the builder that ships inside the app, so it took no account, no key and no internet — but it builds from a fixed set of blueprints rather than to order. Switch to **Free** or your own key in Settings for something bespoke."].join(`
`)}const ii=4e5,si=120;function Ut(e,t){return cn(e,t)}async function lt(e){const t=new Map,a=await e.walk();for(const n of a.slice(0,si)){if(Te(n))continue;const r=await e.read(n);r===null||r.length>ii||t.set(n,r)}return t}async function ri(e,t){return zt(await lt(e),t)}async function oi(e,t,a,n){const r=await lt(e),s=kn(r,t,a),o={fixes:[],changed:[]};for(const c of s){const l=r.get(c.path)??"";n&&await n(c.path),await e.write(c.path,c.content),o.changed.push({path:c.path,before:l,after:c.content}),o.fixes.push(...c.fixes)}return o}function Yt(e){return Jn(e.spec,e.design)}const $e=[{id:"puter",label:"Free",tagline:"No API key, no card. One click to sign in, then build.",wire:"puter",free:!0,needsKey:!1,signIn:!0,browserOk:!0,allowCustomModel:!0,note:"Usage runs through your free Puter account, which also syncs your projects across the web app and the desktop app.",models:[{id:"claude-sonnet-4-5",label:"Claude Sonnet 4.5",blurb:"Best at building things. The default."},{id:"gpt-5",label:"GPT-5",blurb:"Strong all-rounder."},{id:"gpt-4.1",label:"GPT-4.1",blurb:"Reliable and quick."},{id:"gpt-5-nano",label:"GPT-5 nano",blurb:"Fastest, but often too weak to finish a build."},{id:"gemini-3.1-flash-lite",label:"Gemini 3.1 Flash Lite",blurb:"Very fast."}]},{id:"builtin",label:"Built in",tagline:"Maestro, the builder inside the app. No account, no key, no internet — and instant.",wire:"builtin",free:!0,needsKey:!1,browserOk:!0,note:"Not a language model: a planner and a code generator that ship with the app, so you are never stuck with nothing. It understands the sentence you typed, picks a palette to suit it, and writes a complete, playable, responsive project — snake, brick breaker, a rhythm game, a runner, a shooter, pong, a maze, memory, tic-tac-toe, sliding numbers, a quiz, a to-do list, a calculator, a focus timer, a drawing pad, a dashboard, a landing page or a résumé. It builds from blueprints rather than to order, so pick one of the AI providers when you want something truly bespoke.",models:[{id:"offline-builder",label:"Maestro",blurb:"No download, no network, always available."}]},{id:"local",label:"On this machine",tagline:"A real model running on your own GPU. Downloads once, then works offline forever.",wire:"local",free:!0,needsKey:!1,browserOk:!0,allowCustomModel:!0,note:"First use downloads the model (about 1–3 GB depending on which you pick) and needs a machine with WebGPU. It is much weaker than the hosted models and will need more nudging on anything big — but nothing leaves your computer.",models:[{id:"Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC",label:"Qwen2.5 Coder 1.5B",blurb:"~1.6 GB. Smallest useful coder."},{id:"Qwen2.5-Coder-3B-Instruct-q4f16_1-MLC",label:"Qwen2.5 Coder 3B",blurb:"~2.5 GB. Noticeably better."},{id:"Qwen2.5-Coder-7B-Instruct-q4f16_1-MLC",label:"Qwen2.5 Coder 7B",blurb:"~5.1 GB. Needs a real GPU."},{id:"Hermes-3-Llama-3.2-3B-q4f16_1-MLC",label:"Hermes 3 (3B)",blurb:"~2.3 GB. Good at following instructions."}]},{id:"anthropic",label:"Anthropic",tagline:"Claude, direct from Anthropic. The best coding models.",wire:"anthropic",free:!1,needsKey:!0,keyUrl:"https://console.anthropic.com/settings/keys",keyHint:"sk-ant-…",endpoint:"https://api.anthropic.com/v1/messages",browserOk:!0,models:[{id:"claude-opus-5",label:"Opus 5",blurb:"Best for complex agentic coding.",inputPrice:5,outputPrice:25},{id:"claude-sonnet-5",label:"Sonnet 5",blurb:"Near-Opus quality, cheaper.",inputPrice:3,outputPrice:15},{id:"claude-opus-4-8",label:"Opus 4.8",blurb:"Previous generation Opus.",inputPrice:5,outputPrice:25},{id:"claude-haiku-4-5",label:"Haiku 4.5",blurb:"Fastest and cheapest.",inputPrice:1,outputPrice:5}]},{id:"google",label:"Google Gemini",tagline:"Has a genuinely free tier. The key takes about a minute to get.",wire:"openai",free:!0,needsKey:!0,keyUrl:"https://aistudio.google.com/apikey",keyHint:"AIza…",endpoint:"https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",browserOk:!0,allowCustomModel:!0,models:[{id:"gemini-2.5-flash",label:"Gemini 2.5 Flash",blurb:"Free tier, fast, good at code."},{id:"gemini-2.5-pro",label:"Gemini 2.5 Pro",blurb:"Stronger, smaller free allowance."},{id:"gemini-2.0-flash",label:"Gemini 2.0 Flash",blurb:"Older, very generous limits."}]},{id:"openai",label:"OpenAI",tagline:"GPT models, direct from OpenAI.",wire:"openai",free:!1,needsKey:!0,keyUrl:"https://platform.openai.com/api-keys",keyHint:"sk-…",endpoint:"https://api.openai.com/v1/chat/completions",browserOk:!0,allowCustomModel:!0,models:[{id:"gpt-4.1",label:"GPT-4.1"},{id:"gpt-4.1-mini",label:"GPT-4.1 mini",blurb:"Cheap and quick."},{id:"gpt-4o",label:"GPT-4o"}]},{id:"openrouter",label:"OpenRouter",tagline:"One key, hundreds of models — including free ones.",wire:"openai",free:!0,needsKey:!0,keyUrl:"https://openrouter.ai/keys",keyHint:"sk-or-…",endpoint:"https://openrouter.ai/api/v1/chat/completions",browserOk:!0,allowCustomModel:!0,models:[{id:"deepseek/deepseek-chat-v3.1:free",label:"DeepSeek V3.1 (free)",blurb:"Free, strong at code."},{id:"z-ai/glm-4.5-air:free",label:"GLM 4.5 Air (free)",blurb:"Free."},{id:"anthropic/claude-sonnet-4.5",label:"Claude Sonnet 4.5",blurb:"Paid, excellent."}]},{id:"custom",label:"Custom endpoint",tagline:"Any OpenAI-compatible server — LM Studio, vLLM, a gateway at work.",wire:"openai",free:!1,needsKey:!1,endpoint:"",browserOk:!0,allowCustomModel:!0,note:"Set the full chat-completions URL in the box below. A key is optional.",models:[{id:"local-model",label:"local-model",blurb:"Whatever your server calls it."}]},{id:"ollama",label:"Ollama",tagline:"Models running on your own machine. Free and private, but you install it.",wire:"openai",free:!0,needsKey:!1,endpoint:"http://localhost:11434/v1/chat/completions",browserOk:!1,allowCustomModel:!0,note:"Needs Ollama running locally. In the web app the browser blocks localhost requests, so this one is desktop only.",models:[{id:"qwen2.5-coder:7b",label:"Qwen2.5 Coder 7B",blurb:"Good small coding model."},{id:"llama3.1:8b",label:"Llama 3.1 8B"}]}];function U(e){return $e.find(t=>t.id===e)??$e[0]}function li(e,t){const a=U(e).models.find(n=>n.id===t);return{inputPrice:a?.inputPrice??0,outputPrice:a?.outputPrice??0}}const fe={input:0,output:0,cacheRead:0,cacheWrite:0};class P extends Error{constructor(t,a,n=!1){super(t),this.status=a,this.retryable=n}}async function*Kt(e){let t="";for await(const a of e.lines()){t+=a;let n;for(;(n=t.indexOf(`
`))!==-1;){const r=t.slice(0,n).trim();if(t=t.slice(n+1),!r.startsWith("data:"))continue;const s=r.slice(5).trim();if(!(s===""||s==="[DONE]"))try{yield JSON.parse(s)}catch{}}}}function Vt(e,t,a){const n=t.slice(0,400),r=e===429||e>=500;return e===401||e===403?new P(`${a.label} rejected the key. Check it in Settings.${n?` (${n})`:""}`,e):e===404?new P(`${a.label} does not have that model. Pick another in Settings.`,e):e===429?new P(`${a.label} is rate limiting. Wait a moment, or switch model.`,e,!0):e>=500?new P(`${a.label} is having trouble right now. Try again shortly.`,e,!0):new P(`${a.label} returned ${e}: ${n}`,e,r)}function ci(e){return e.map(t=>{if(t.role==="user")return{role:"user",content:t.content};if(t.role==="tool")return{role:"user",content:t.results.map(n=>({type:"tool_result",tool_use_id:n.id,content:n.content,...n.isError?{is_error:!0}:{}}))};if(t.native)return{role:"assistant",content:t.native};const a=[];t.content&&a.push({type:"text",text:t.content});for(const n of t.toolCalls??[])a.push({type:"tool_use",id:n.id,name:n.name,input:n.input});return{role:"assistant",content:a.length?a:[{type:"text",text:"…"}]}})}async function di(e,t,a,n,r,s){const o={model:n.model,max_tokens:n.maxTokens,system:[{type:"text",text:n.system}],messages:ci(n.messages),tools:n.tools.map(b=>({name:b.name,description:b.description,input_schema:b.parameters})),stream:!0};s.thinking&&n.thinking&&(o.thinking={type:"adaptive",display:"summarized"}),s.effort&&(o.output_config={effort:n.effort}),s.cache&&(o.cache_control={type:"ephemeral"});const c=await a.request(e.endpoint,{method:"POST",headers:{"content-type":"application/json","x-api-key":t,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify(o),signal:n.signal});if(!c.ok)throw Vt(c.status,await c.text(),e);const l=[],u=new Map;let d="",h="",m=null;const p={...fe};for await(const b of Kt(c))if(b.type==="message_start"){const x=b.message?.usage??{};p.input+=x.input_tokens??0,p.cacheRead+=x.cache_read_input_tokens??0,p.cacheWrite+=x.cache_creation_input_tokens??0}else if(b.type==="content_block_start")l[b.index]={...b.content_block},b.content_block?.type==="tool_use"&&(u.set(b.index,""),r.onToolPending?.(b.content_block.id,b.content_block.name));else if(b.type==="content_block_delta"){const x=b.delta??{},L=l[b.index]??(l[b.index]={});x.type==="text_delta"?(d+=x.text,L.text=(L.text??"")+x.text,r.onText(x.text)):x.type==="thinking_delta"?(h+=x.thinking,L.thinking=(L.thinking??"")+x.thinking,r.onThinking(x.thinking)):x.type==="signature_delta"?L.signature=(L.signature??"")+x.signature:x.type==="input_json_delta"&&u.set(b.index,(u.get(b.index)??"")+x.partial_json)}else if(b.type==="content_block_stop"){const x=u.get(b.index);if(x!==void 0&&l[b.index])try{l[b.index].input=x?JSON.parse(x):{}}catch{l[b.index].input={}}}else if(b.type==="message_delta")m=b.delta?.stop_reason??m,p.output+=b.usage?.output_tokens??0;else if(b.type==="error")throw new P(b.error?.message??"Anthropic stream error",null,!0);const g=l.filter(Boolean),S=g.filter(b=>b.type==="tool_use").map(b=>({id:b.id,name:b.name,input:b.input??{}}));return{text:d,thinking:h,toolCalls:S,native:g,usage:p,stopReason:m}}function Xt(e,t){const a=[{role:"system",content:e}];for(const n of t)if(n.role==="user")a.push({role:"user",content:n.content});else if(n.role==="assistant"){const r={role:"assistant",content:n.content||null};n.toolCalls?.length&&(r.tool_calls=n.toolCalls.map(s=>({id:s.id,type:"function",function:{name:s.name,arguments:JSON.stringify(s.input??{})}}))),a.push(r)}else for(const r of n.results)a.push({role:"tool",tool_call_id:r.id,content:r.content});return a}function Jt(e){return e.map(t=>({type:"function",function:{name:t.name,description:t.description,parameters:t.parameters}}))}class ui{byIndex=new Map;absorb(t,a){for(const n of t??[]){const r=n.index??0;let s=this.byIndex.get(r);if(s||(s={id:n.id??`call_${r}_${Date.now()}`,name:"",args:""},this.byIndex.set(r,s)),n.id&&(s.id=n.id),n.function?.name){const o=s.name==="";s.name+=n.function.name,o&&a?.(s.id,s.name)}n.function?.arguments&&(s.args+=n.function.arguments)}}finish(){return[...this.byIndex.values()].filter(t=>t.name).map(t=>{let a={};try{a=t.args?JSON.parse(t.args):{}}catch{a={}}return{id:t.id,name:t.name,input:a}})}}async function pi(e,t,a,n,r,s){if(!s)throw new P("No endpoint is set for this provider. Add one in Settings.",null);const o={"content-type":"application/json"};t&&(o.authorization=`Bearer ${t}`),e.id==="openrouter"&&(o["http-referer"]="https://keyfive5.github.io/Masterpiece-Coder",o["x-title"]="Masterpiece Coder");const c=await a.request(s,{method:"POST",headers:o,body:JSON.stringify({model:n.model,messages:Xt(n.system,n.messages),tools:n.tools.length?Jt(n.tools):void 0,max_tokens:n.maxTokens,stream:!0,stream_options:e.id==="openai"?{include_usage:!0}:void 0}),signal:n.signal});if(!c.ok)throw Vt(c.status,await c.text(),e);const l=new ui;let u="",d="",h=null;const m={...fe};for await(const g of Kt(c)){if(g.error)throw new P(g.error.message??"Stream error",null,!0);const S=g.choices?.[0];if(g.usage&&(m.input+=g.usage.prompt_tokens??0,m.output+=g.usage.completion_tokens??0),!S)continue;const b=S.delta??{};typeof b.content=="string"&&b.content&&(u+=b.content,r.onText(b.content));const x=b.reasoning_content??b.reasoning;typeof x=="string"&&x&&(d+=x,r.onThinking(x)),l.absorb(b.tool_calls,r.onToolPending),S.finish_reason&&(h=S.finish_reason)}const p=l.finish();return{text:u,thinking:d,toolCalls:p,native:null,usage:m,stopReason:h}}let xe=null;function ge(){return typeof window>"u"?Promise.resolve(!1):window.puter?Promise.resolve(!0):xe||(xe=new Promise(e=>{const t=document.createElement("script");t.src="https://js.puter.com/v2/",t.onload=()=>e(!!window.puter),t.onerror=()=>e(!1),document.head.appendChild(t),setTimeout(()=>e(!!window.puter),12e3)}),xe)}const ee={async ready(){return ge()},isSignedIn(){try{return!!window.puter?.auth?.isSignedIn?.()}catch{return!1}},async user(){try{return await window.puter.auth.getUser()??null}catch{return null}},async signIn(){if(!await ge())throw new Error("Could not reach Puter. Check your internet connection.");return await window.puter.auth.signIn(),ee.user()},signOut(){try{window.puter.auth.signOut()}catch{}}};function hi(e){const t=e?.message??e?.choices?.[0]?.message??e,a=[],n=[t?.tool_calls,e?.tool_calls,e?.choices?.[0]?.message?.tool_calls];for(const s of n)if(Array.isArray(s)){for(const o of s){const c=o?.function?.name??o?.name;if(!c)continue;const l=o?.function?.arguments??o?.arguments??o?.input;let u={};try{u=typeof l=="string"?JSON.parse(l||"{}"):l??{}}catch{u={}}a.push({id:o?.id??`call_${a.length}_${Date.now()}`,name:c,input:u})}if(a.length)return a}const r=Array.isArray(t?.content)?t.content:Array.isArray(e?.content)?e.content:null;for(const s of r??[])s?.type!=="tool_use"||!s?.name||a.push({id:s.id??`call_${a.length}_${Date.now()}`,name:s.name,input:s.input??{}});return a}function mi(e){const t=e?.message??e?.choices?.[0]?.message??e;if(typeof t=="string")return t;const a=t?.content??e?.text??"";return Array.isArray(a)?a.filter(n=>n?.type==="text"||typeof n?.text=="string").map(n=>n?.text??"").join(""):typeof a=="string"?a:""}async function fi(e,t){if(!await ge())throw new P("Could not load the free AI service. Check your internet connection.",null,!0);const a=window.puter;if(!ee.isSignedIn())throw new P("__PUTER_SIGNIN__",401);const n=Xt(e.system,e.messages),r=e.tools.length>0,s={model:e.model};if(r&&(s.tools=Jt(e.tools)),!r)try{const h=await a.ai.chat(n,{...s,stream:!0});if(h&&typeof h[Symbol.asyncIterator]=="function"){let m="";for await(const p of h){if(e.signal.aborted)break;const g=p?.text??p?.delta?.content;typeof g=="string"&&g&&(m+=g,t.onText(g))}if(m)return{text:m,thinking:"",toolCalls:[],native:null,usage:{...fe},stopReason:"end_turn"}}}catch{}const o=await a.ai.chat(n,s).catch(h=>{const m=String(h?.message??h);throw/sign|auth|login|not.*logged/i.test(m)?new P("__PUTER_SIGNIN__",401):/model|not.*(found|support|available)/i.test(m)?new P(`__PUTER_MODEL__${m}`,404):new P(`The free AI service failed: ${m}`,null,!0)}),c=mi(o),l=hi(o);c&&t.onText(c);const u={...fe},d=o?.usage;return d&&(u.input=d.prompt_tokens??d.input_tokens??0,u.output=d.completion_tokens??d.output_tokens??0),{text:c,thinking:"",toolCalls:l,native:null,usage:u,stopReason:l.length?"tool_use":"end_turn"}}async function gi(e,t){const a=e.messages.find(d=>d.role==="user"),n=a&&a.role==="user"?a.content:"",r=Ut(n,{canRunCommands:!1,hasFiles:!1}),s=Yt(r),o=Object.entries(s.files),c=e.messages.filter(d=>d.role==="assistant").length,l=(d,h)=>({id:`builtin_${c}_${d}_${Date.now()}`,name:d,input:h}),u=(d,h)=>(d&&t.onText(d),{text:d,thinking:"",toolCalls:h,native:null,usage:{...fe},stopReason:h.length?"tool_use":"end_turn"});if(await new Promise(d=>setTimeout(d,260)),c===0){const[d,h]=o[0],m=`${r.archetype.label.toLowerCase()}${r.spec.subject?` about ${r.spec.subject}`:""}`;return u(`Building a ${m} in ${r.design.name.toLowerCase()} — no network needed for this one.`,[l("update_plan",{todos:s.plan.map((p,g)=>({text:p,status:g===0?"active":"pending"}))}),l("write_file",{path:d,content:h})])}if(c<o.length){const[d,h]=o[c],m=s.plan.map((p,g)=>({text:p,status:g<c?"done":g===c?"active":"pending"}));return u("",[l("update_plan",{todos:m}),l("write_file",{path:d,content:h})])}return c===o.length?u("",[l("update_plan",{todos:s.plan.map(d=>({text:d,status:"done"}))})]):u(s.summary,[])}async function Fe(e,t,a){const{provider:n}=e;if(n.wire==="builtin")return gi(t,a);if(n.wire==="local"){const{runLocal:s}=await Y(async()=>{const{runLocal:o}=await import("./local-BUCdRf0W.js");return{runLocal:o}},__vite__mapDeps([0,1,2]),import.meta.url);return s(t,a)}if(n.wire==="puter")return fi(t,a);if(n.wire==="openai"){const s=e.endpointOverride?.trim()||n.endpoint||"";return pi(n,e.key,e.net,t,a,s)}let r={...e.anthropicFeatures};for(let s=0;s<4;s++)try{return await di(n,e.key,e.net,t,a,r)}catch(o){const c=o instanceof P?o.status:null,l=String(o.message??"");if(c!==400)throw o;const u=/cache_control/i.test(l)?"cache":/effort|output_config/i.test(l)?"effort":/thinking/i.test(l)?"thinking":r.cache?"cache":r.effort?"effort":r.thinking?"thinking":null;if(!u||!r[u])throw o;r={...r,[u]:!1},e.onFeatureDisabled?.(u),a.onNotice?.(`This key does not support ${u==="cache"?"prompt caching":u==="effort"?"the effort setting":"extended thinking"}. Continuing without it.`)}throw new P("Could not reach Anthropic after several attempts.",null,!0)}function De(e){return e===""?[]:e.replace(/\r\n/g,`
`).split(`
`)}function Zt(e,t){const a=De(e),n=De(t);if(a.length*n.length>4e6)return[...a.map((d,h)=>({op:"del",text:d,a:h+1,b:null})),...n.map((d,h)=>({op:"add",text:d,a:null,b:h+1}))];const r=a.length,s=n.length,o=Array.from({length:r+1},()=>new Uint32Array(s+1));for(let d=r-1;d>=0;d--)for(let h=s-1;h>=0;h--)o[d][h]=a[d]===n[h]?o[d+1][h+1]+1:Math.max(o[d+1][h],o[d][h+1]);const c=[];let l=0,u=0;for(;l<r&&u<s;)a[l]===n[u]?(c.push({op:"same",text:a[l],a:l+1,b:u+1}),l++,u++):o[l+1][u]>=o[l][u+1]?(c.push({op:"del",text:a[l],a:l+1,b:null}),l++):(c.push({op:"add",text:n[u],a:null,b:u+1}),u++);for(;l<r;)c.push({op:"del",text:a[l],a:++l,b:null});for(;u<s;)c.push({op:"add",text:n[u],a:null,b:++u});return c}function it(e,t){if(e===null)return{added:De(t??"").length,removed:0};if(t===null)return{added:0,removed:De(e).length};let a=0,n=0;for(const r of Zt(e,t))r.op==="add"?a++:r.op==="del"&&n++;return{added:a,removed:n}}function yi(e,t=3){const a=new Set;e.forEach((s,o)=>{if(s.op!=="same")for(let c=Math.max(0,o-t);c<=Math.min(e.length-1,o+t);c++)a.add(c)});const n=[];let r=0;return e.forEach((s,o)=>{a.has(o)?(r>0&&(n.push({op:"gap",count:r}),r=0),n.push(s)):r++}),r>0&&n.push({op:"gap",count:r}),n}const bi=40;class vi{checkpoints=[];begin(t,a){for(this.checkpoints.push({turnId:t,label:a,at:Date.now(),files:new Map});this.checkpoints.length>bi;)this.checkpoints.shift()}async capture(t,a,n){const r=this.checkpoints.find(o=>o.turnId===a),s=await t.read(n);return r&&!r.files.has(n)&&r.files.set(n,s),s}list(){return this.checkpoints.filter(t=>t.files.size>0).map(t=>({turnId:t.turnId,label:t.label,at:t.at,files:t.files.size})).reverse()}async restore(t,a){const n=this.checkpoints.findIndex(s=>s.turnId===a);if(n===-1)throw new Error("That checkpoint is no longer available.");let r=0;for(let s=this.checkpoints.length-1;s>=n;s--)for(const[o,c]of this.checkpoints[s].files)c===null?await t.remove(o).catch(()=>{}):await t.write(o,c),r++;return this.checkpoints.splice(n),r}clear(){this.checkpoints=[]}}function wi(e){const{snapshot:t,custom:a,approvalMode:n,workspace:r,platform:s,brief:o}=e,c=r.canRunCommands?`You can run shell commands with run_command (${s}). Use it to install packages, run tests and build.`:"There is NO shell here — this is the web app. run_command does not exist. Build things that run with no install step and no build step: plain HTML, CSS and JavaScript, loaded directly. Do not write package.json, imports from npm, JSX, TypeScript, or anything that needs compiling. If a library is genuinely needed, load it from a CDN with a script tag.";return`You are Masterpiece Coder — an autonomous coding agent inside an app where someone types an idea in plain language and you bring it to life as working code.

# Who you are working with
They may not be a professional developer, and they do not use a terminal. They see your thinking, every tool call, the files you change, a live diff and a Preview panel. Never tell them to run something themselves — do it. Never ask them to paste file contents — read the files yourself. Never ask them to choose a technology unless it genuinely changes what gets built.

# The environment
${t}

${c}
Approval mode: ${n==="autopilot"?"AUTOPILOT — your writes and commands run immediately.":"ASK — writes, deletes and commands pause for approval. Batch related work so they are not spammed."}

# The one rule that matters
You build by CALLING TOOLS, not by describing code. Never print a file's contents in your reply and never say what you "would" write — call write_file and actually write it. A reply that contains code but made no tool call has failed. If you are unsure where to start, call write_file on a first file and iterate from there. Keep going, turn after turn, until the thing actually works; do not stop after one file.

# How to work
- Understand what exists first. Use find_files, search_code and read_file before changing anything. Never edit a file you have not read this session.
- For anything beyond a one-line change, call update_plan first with the steps you intend to take, then keep it current. It is the user's window into what you are doing.
- Prefer edit_file over write_file when a file already exists.
- Build the whole thing. If they ask for an app, produce something that actually runs — real markup, real styling, real logic. No "TODO: implement later" stubs, no lorem ipsum where real content belongs, no half-finished features.
- Make it look good. Given a free hand, produce something with genuine visual character rather than an unstyled default. Avoid the generic AI look: no Inter-on-white with a purple gradient. Pick a palette and a typeface that suit the subject and commit to them.
- Verify. After a meaningful change, read the file back if unsure, or run the tests or build when one exists. If something fails, fix it rather than reporting success.
- Deliver what was asked at the scope intended. Make routine judgment calls yourself; ask only when two readings lead to genuinely different work. Do not add features, abstractions or error handling for situations that cannot happen.

# When you build a game or anything interactive
Before you write the code, decide what the player actually does second to second, and make sure the rules you are about to write allow it. Then read your own logic back and check the loop is winnable and losable.

The usual ways this goes wrong — check each one that applies:
- Things the player must react to are created already at the point where they must be reacted to. Spawn them far away and give the player travel time to see them coming.
- Nothing can be scored, or everything scores, because the hit test is the wrong size or in the wrong place.
- Speed, spawn rate or difficulty starts at a level nobody can play, or never changes at all.
- There is no way to lose, or no way to start again after losing.
- Controls only work on a keyboard, so the thing is dead on a phone. Add pointer or touch input too.

State the timings and sizes you chose and why they are fair. If a value is a guess, say so and pick the forgiving end of it.

# Talking to the user
Your text between tool calls is what they read while they wait. Say what you are about to do in a sentence before the first tool call, then speak up when you find something important or change direction. Do not narrate routine steps.

Finish by leading with the outcome — what now exists and what it does — in plain language, then any detail that matters. A few sentences unless they asked for depth. Do not recap every file; they watched it happen. If you could not finish something, say exactly what is missing and why.

# What this app gives you
- Every message is checkpointed, so the user can rewind a whole turn. Move confidently.
- The Preview panel renders the project. If you build a web page, say so at the end.
- **review_project** reads what you actually wrote and reports what is broken. Call it before you claim to be done.${o?`

---

${o}`:""}${a.trim()?`

# The user's standing instructions
These come from the user and take priority over everything above, including the build brief.
${a.trim()}`:""}`}const xi=new Set(["node_modules",".git",".svn",".hg","dist","build","out","release",".next",".nuxt",".cache",".parcel-cache",".turbo",".vite","coverage","__pycache__",".venv","venv",".idea",".gradle",".masterpiece"]);function le(e){const t=String(e??"").replace(/\\/g,"/"),a=[];for(const n of t.split("/"))if(!(n===""||n===".")){if(n===".."){if(a.length===0)throw new Error(`Path "${t}" escapes the project.`);a.pop();continue}a.push(n)}if(a.length===0)throw new Error("A file path is required.");return a.join("/")}function _t(e){let t="";for(let a=0;a<e.length;a++){const n=e[a];n==="*"?e[a+1]==="*"?e[a+2]==="/"?(t+="(?:.*/)?",a+=2):(t+=".*",a+=1):t+="[^/]*":n==="?"?t+="[^/]":"\\^$+.()|[]{}".includes(n)?t+=`\\${n}`:t+=n}return new RegExp(`^${t}$`,"i")}async function ki(e){const t=await e.walk();if(t.length===0)return`Project: ${e.label}
The project is EMPTY — you are starting from scratch.`;const a=t.slice(0,300),n=t.length-a.length;return[`Project: ${e.label}`,`Files (${t.length}${n>0?", first 300 shown":""}):`,...a.map(r=>`  ${r}`),...n>0?[`  …and ${n} more`]:[]].join(`
`)}const ke="The user declined this action. Do not retry it; ask what they would like instead.";function qe(e,t=12e3){return e.length>t?`${e.slice(0,t)}
…[truncated, ${e.length-t} more characters]`:e}function Ei(e,t=1){return e.split(`
`).map((a,n)=>`${String(t+n).padStart(5," ")}  ${a}`).join(`
`)}async function Ue(e,t,a,n){const{added:r,removed:s}=it(a,n);return e.emit({type:"file_change",turnId:e.turnId,change:{path:t,before:a,after:n,added:r,removed:s}}),{added:r,removed:s}}const ji=[{name:"read_file",guarded:!1,description:"Read a text file from the project. Returns the contents with line numbers. Read a file before editing it so your edits match the real text exactly.",parameters:{type:"object",properties:{path:{type:"string",description:'Path relative to the project root, e.g. "src/App.tsx".'},start_line:{type:"integer",description:"Optional 1-based first line to return."},end_line:{type:"integer",description:"Optional 1-based last line to return."}},required:["path"]},async run(e,t){const a=le(e.path);if(Te(a))return{ok:!0,summary:`${a} — binary`,content:`${a} is a binary file; it cannot be shown as text.`};const n=await t.workspace.read(a);if(n===null)return{ok:!1,summary:`Not found: ${a}`,content:`${a} does not exist.`};const r=n.split(`
`),s=Math.max(1,Number(e.start_line)||1),o=Math.min(r.length,Number(e.end_line)||r.length),c=r.slice(s-1,o).join(`
`);return{ok:!0,summary:`${a} · ${r.length} lines`,detail:qe(c,4e3),content:`${a} (lines ${s}-${o} of ${r.length}):
${Ei(c,s)}`}}},{name:"write_file",guarded:!0,description:"Create a new file, or completely replace an existing one. Always pass the FULL final contents. For a small change to a large existing file prefer edit_file.",parameters:{type:"object",properties:{path:{type:"string",description:"Path relative to the project root."},content:{type:"string",description:"The complete contents of the file."}},required:["path","content"]},async run(e,t){const a=le(e.path),n=String(e.content??""),r=await t.workspace.exists(a);if(!await t.approve("write_file",r?`Overwrite ${a}`:`Create ${a}`,`${n.split(`
`).length} lines`))return{ok:!1,summary:`Declined: ${a}`,content:ke};const o=await t.capture(a);await t.workspace.write(a,n);const{added:c,removed:l}=await Ue(t,a,o,n);return{ok:!0,summary:`${r?"Updated":"Created"} ${a} · +${c}/-${l}`,content:`Wrote ${a} (${n.split(`
`).length} lines).`}}},{name:"edit_file",guarded:!0,description:"Replace an exact snippet of text inside an existing file. old_text must appear verbatim and, unless replace_all is true, exactly once. Include surrounding context to make the match unique.",parameters:{type:"object",properties:{path:{type:"string",description:"Path relative to the project root."},old_text:{type:"string",description:"The exact text to find."},new_text:{type:"string",description:"The replacement. Empty string deletes."},replace_all:{type:"boolean",description:"Replace every occurrence."}},required:["path","old_text","new_text"]},async run(e,t){const a=le(e.path),n=String(e.old_text??""),r=String(e.new_text??""),s=await t.workspace.read(a);if(s===null)return{ok:!1,summary:`Not found: ${a}`,content:`${a} does not exist. Create it with write_file.`};if(n==="")return{ok:!1,summary:"Empty search text",content:"old_text cannot be empty. Use write_file instead."};const o=s.split(n).length-1;if(o===0)return{ok:!1,summary:`No match in ${a}`,content:`That text is not in ${a}. Read the file again and copy the exact text, including whitespace.`};if(o>1&&!e.replace_all)return{ok:!1,summary:`${o} matches in ${a}`,content:`Found ${o} occurrences. Add more context so the match is unique, or pass replace_all: true.`};if(!await t.approve("edit_file",`Edit ${a}`,`${o} replacement${o===1?"":"s"}`))return{ok:!1,summary:`Declined: ${a}`,content:ke};await t.capture(a);const l=e.replace_all?s.split(n).join(r):s.replace(n,r);await t.workspace.write(a,l);const{added:u,removed:d}=await Ue(t,a,s,l);return{ok:!0,summary:`Edited ${a} · +${u}/-${d}`,content:`Edited ${a}: ${o} replacement(s), +${u}/-${d} lines.`}}},{name:"delete_file",guarded:!0,description:"Delete a file or folder from the project.",parameters:{type:"object",properties:{path:{type:"string",description:"Path relative to the project root."}},required:["path"]},async run(e,t){const a=le(e.path);if(!await t.approve("delete_file",`Delete ${a}`,"Undo is possible from History."))return{ok:!1,summary:`Declined: ${a}`,content:ke};const r=await t.capture(a);return await t.workspace.remove(a),await Ue(t,a,r,null),{ok:!0,summary:`Deleted ${a}`,content:`Deleted ${a}.`}}},{name:"list_files",guarded:!1,description:"List the files and folders directly inside a directory of the project.",parameters:{type:"object",properties:{path:{type:"string",description:"Directory relative to the root. Omit for the root."}}},async run(e,t){const a=e.path?le(e.path):"",n=await t.workspace.list(a),r=n.length?n.map(s=>s.dir?`${s.name}/`:s.name).join(`
`):"(empty)";return{ok:!0,summary:`${a||"."} · ${n.length} item${n.length===1?"":"s"}`,detail:r,content:`Contents of ${a||"the project root"}:
${r}`}}},{name:"find_files",guarded:!1,description:'Find files by name with a glob such as "**/*.tsx" or "src/**/index.*".',parameters:{type:"object",properties:{pattern:{type:"string",description:"Glob matched against project-relative paths."},limit:{type:"integer",description:"Maximum paths to return (default 200)."}},required:["pattern"]},async run(e,t){const a=String(e.pattern),n=Math.min(Number(e.limit)||200,1e3),r=_t(a.includes("/")?a:`**/${a}`),s=(await t.workspace.walk()).filter(o=>r.test(o)).slice(0,n);return{ok:!0,summary:`${a} · ${s.length} match${s.length===1?"":"es"}`,detail:s.join(`
`),content:s.length?s.join(`
`):`No files matched ${a}.`}}},{name:"search_code",guarded:!1,description:"Search file contents with a regular expression. Returns matching lines with file and line number.",parameters:{type:"object",properties:{pattern:{type:"string",description:"Regular expression."},glob:{type:"string",description:"Optional glob limiting which files are searched."},case_sensitive:{type:"boolean",description:"Defaults to false."},limit:{type:"integer",description:"Maximum matching lines (default 80)."}},required:["pattern"]},async run(e,t){const a=Math.min(Number(e.limit)||80,400);let n;try{n=new RegExp(String(e.pattern),e.case_sensitive?"":"i")}catch(c){return{ok:!1,summary:"Invalid pattern",content:`Not a valid regular expression: ${c.message}`}}const r=e.glob?_t(String(e.glob)):null,s=(await t.workspace.walk()).filter(c=>(!r||r.test(c))&&!Te(c)),o=[];for(const c of s){if(o.length>=a)break;const l=await t.workspace.read(c);if(l===null)continue;const u=l.split(`
`);for(let d=0;d<u.length&&o.length<a;d++)n.test(u[d])&&o.push(`${c}:${d+1}: ${u[d].trim().slice(0,200)}`)}return{ok:!0,summary:`/${e.pattern}/ · ${o.length} hit${o.length===1?"":"s"}`,detail:o.join(`
`),content:o.length?o.join(`
`):`No matches for /${e.pattern}/.`}}},{name:"run_command",guarded:!0,needsShell:!0,description:"Run a shell command in the project folder — installing packages, running tests, building. Output comes back to you. Do not start long-lived servers; use the Preview panel instead.",parameters:{type:"object",properties:{command:{type:"string",description:"The command line to execute."},purpose:{type:"string",description:"One short sentence describing why, shown to the user."}},required:["command","purpose"]},async run(e,t){const a=String(e.command);if(!t.workspace.run)return{ok:!1,summary:"No shell here",content:"Commands cannot run in the web app. Build something that works without a build step, or ask the user to open the desktop app."};if(!await t.approve("run_command",a,String(e.purpose??"")))return{ok:!1,summary:`Declined: ${a}`,content:ke};const r=`cmd_${Date.now()}`,s=await t.workspace.run(a,c=>t.emit({type:"command_output",id:r,chunk:c})),o=s.timedOut?"timed out":`exit ${s.code??"?"}`;return{ok:s.code===0&&!s.timedOut,summary:`${a} · ${o}`,detail:qe(s.output,6e3),content:`$ ${a}
(${o})
${qe(s.output,2e4)||"(no output)"}`}}},{name:"update_plan",guarded:!1,description:"Publish or update your task list so the user can follow along. Call this at the start of any multi-step job and again whenever a step completes. Send the whole list every time.",parameters:{type:"object",properties:{todos:{type:"array",description:"The full plan, in order.",items:{type:"object",properties:{text:{type:"string"},status:{type:"string",enum:["pending","active","done"]}},required:["text","status"]}}},required:["todos"]},async run(e,t){const a=(Array.isArray(e.todos)?e.todos:[]).filter(r=>r&&typeof r.text=="string").map(r=>({text:String(r.text),status:["pending","active","done"].includes(r.status)?r.status:"pending"}));t.emit({type:"todos",items:a});const n=a.filter(r=>r.status==="done").length;return{ok:!0,summary:`Plan · ${n}/${a.length} done`,content:`Plan updated (${n}/${a.length} complete).`}}},{name:"review_project",guarded:!1,description:"Check the project you have built for real problems: files that are referenced but missing, code that does not parse, functions called but never defined, placeholder text left behind, a layout with no responsive rules, a game with no way to lose or no touch controls, low contrast, and the specific failure modes of this kind of project. Call this before you tell the user you are finished, and again after fixing what it reports. It reads the actual files — it is not an opinion.",parameters:{type:"object",properties:{}},async run(e,t){const a=await lt(t.workspace),n=zt(a,t.spec??null),r=n.filter(o=>o.severity!=="minor"),s=Ot(n);return{ok:r.length===0,summary:`Review · ${Le(n)}`,detail:s.slice(0,4e3),content:s}}}];function Qt(e){return ji.filter(t=>!t.needsShell||e.canRunCommands)}function Si(e){return Qt(e).map(({name:t,description:a,parameters:n})=>({name:t,description:a,parameters:n}))}const Ai=60,_i=2;class Ci{constructor(t){this.host=t}messages=[];aborter=null;pending=new Map;sessionAllow=new Set;anthropicFeatures={thinking:!0,effort:!0,cache:!0};triedModels=new Set;preferredModel=null;checkpoints=new vi;busy=!1;reset(){this.messages=[],this.sessionAllow.clear(),this.checkpoints.clear()}stop(){this.aborter?.abort();for(const[t,a]of this.pending)a(!1),this.pending.delete(t)}resolveApproval(t,a,n,r){const s=this.pending.get(t);s&&(this.pending.delete(t),a&&n&&r&&this.sessionAllow.add(r),s(a))}async send(t,a,n,r,s){if(this.busy){s({type:"notice",level:"warn",message:"Still working on the previous message."});return}const o=U(r.provider);if(o.needsKey&&!this.host.keyFor(o.id)){s({type:"need_key",provider:o.id}),s({type:"idle"});return}this.busy=!0,this.aborter=new AbortController;const c=this.aborter.signal,l=`turn_${Date.now()}`;this.checkpoints.begin(l,t.slice(0,60)||"Turn"),s({type:"turn_start",turnId:l});let u=t;for(const m of a){const p=await n.read(m);p!==null&&(u+=`

<attached_file path="${m}">
${p.slice(0,6e4)}
</attached_file>`)}this.messages.push({role:"user",content:u});let d=null;if(r.maestro!==!1)try{s({type:"activity",label:"Working out what you mean"}),d=Ut(t,{canRunCommands:n.canRunCommands,hasFiles:(await n.walk()).length>0}),d.spec.isEdit||s({type:"notice",level:"info",message:`Building a ${d.archetype.label.toLowerCase()}${d.spec.subject?` about ${d.spec.subject}`:""} · ${d.design.name} · ${d.plan.milestones.length} steps`+(d.spec.confidence<.34?" — the request was open-ended, so this is an interpretation.":".")})}catch{d=null}const h={spec:d?.spec??null,turnId:l,workspace:n,emit:s,signal:c,capture:m=>this.checkpoints.capture(n,l,m),approve:(m,p,g)=>{if(r.approvalMode==="autopilot"||this.sessionAllow.has(m)||r.alwaysAllow.includes(m))return Promise.resolve(!0);const S=`ap_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;return s({type:"approval_request",id:S,tool:m,title:p,detail:g}),new Promise(b=>{this.pending.set(S,x=>{s({type:"approval_resolved",id:S,approved:x}),b(x)})})}};try{const m=wi({snapshot:await ki(n),custom:r.customInstructions,approvalMode:r.approvalMode,workspace:n,platform:this.host.platform,brief:d?.text}),p=Si(n),g=new Map(Qt(n).map(L=>[L.name,L]));let S=0;const b=2;let x=0;for(let L=0;L<Ai&&!c.aborted;L++){s({type:"activity",label:L===0?"Thinking about your idea":"Thinking"});const $=`b_${l}_${L}`;let B=!1,re=!1;const N=await this.runOneStep(o.id,r,m,p,c,{onText:j=>{B||(s({type:"block_start",kind:"text",id:`${$}_t`}),B=!0),s({type:"delta",id:`${$}_t`,kind:"text",text:j})},onThinking:j=>{re||(s({type:"block_start",kind:"thinking",id:`${$}_k`}),re=!0),s({type:"delta",id:`${$}_k`,kind:"thinking",text:j})},onToolPending:()=>{},onNotice:j=>s({type:"notice",level:"info",message:j}),onActivity:j=>s({type:"activity",label:j})},s);re&&s({type:"block_end",id:`${$}_k`}),B&&s({type:"block_end",id:`${$}_t`});const Z=li(o.id,r.model);if(s({type:"usage",delta:{input:N.usage.input,output:N.usage.output,cacheRead:N.usage.cacheRead,cacheWrite:N.usage.cacheWrite,costUsd:(N.usage.input*Z.inputPrice+N.usage.output*Z.outputPrice+N.usage.cacheRead*Z.inputPrice*.1+N.usage.cacheWrite*Z.inputPrice*1.25)/1e6}}),this.messages.push({role:"assistant",content:N.text,thinking:N.thinking,toolCalls:N.toolCalls,native:N.native}),N.stopReason==="refusal"){s({type:"notice",level:"warn",message:"The model declined this request. Try rephrasing it."}),s({type:"turn_end",turnId:l,stopReason:"refusal"});break}if(N.toolCalls.length===0){const j=/```|<\/?[a-z]+[\s>]/i.test(N.text),R=(await n.walk()).length===0;if((j||R)&&S<b){S++,s({type:"notice",level:"info",message:R?"It replied without creating anything — asking it to actually write the files.":"It pasted code instead of saving it — asking it to write the files properly."}),this.messages.push({role:"user",content:"You did not create any files. Do not describe or paste code in your reply. Call the write_file tool now, once per file, with the complete contents of each file. Then keep going until the project actually runs."});continue}if(d&&!c.aborted&&x<_i){x++,s({type:"activity",label:"Checking what was built"});const D=await oi(n,d.spec,d.design,k=>this.checkpoints.capture(n,l,k));for(const k of D.changed){const{added:H,removed:ae}=it(k.before,k.after);s({type:"file_change",turnId:l,change:{path:k.path,before:k.before,after:k.after,added:H,removed:ae}})}D.fixes.length&&s({type:"notice",level:"info",message:`Tidied up — ${D.fixes.join("; ")}.`});const O=await ri(n,d.spec),E=ot(O);if(E.blocker+E.major>0){s({type:"notice",level:"warn",message:`Review found ${Le(O)} — sending it back to be fixed rather than calling it done.`}),this.messages.push({role:"user",content:Ot(O)}),S=0;continue}s({type:"notice",level:"info",message:O.length?`Review passed — only ${Le(O)} left, none of it broken.`:"Review passed: nothing broken, nothing missing, nothing left as a placeholder."})}d&&!d.spec.isEdit&&!c.aborted&&(await n.walk()).length===0&&await this.rescueBuild(d,n,l,s),s({type:"turn_end",turnId:l,stopReason:N.stopReason});break}S=0;const q=[];for(const j of N.toolCalls){if(c.aborted)break;s({type:"activity",label:Ti(j.name,j.input)}),s({type:"tool_start",id:j.id,name:j.name,input:j.input});const R=g.get(j.name);if(!R){s({type:"tool_end",id:j.id,status:"error",summary:`Unknown tool ${j.name}`}),q.push({id:j.id,name:j.name,content:`No such tool: ${j.name}`,isError:!0});continue}try{const D=await R.run(j.input??{},h);s({type:"tool_end",id:j.id,status:D.ok?"ok":D.content.startsWith("The user declined")?"rejected":"error",summary:D.summary,detail:D.detail}),q.push({id:j.id,name:j.name,content:D.content,isError:!D.ok})}catch(D){const O=D.message??String(D);s({type:"tool_end",id:j.id,status:"error",summary:O}),q.push({id:j.id,name:j.name,content:`Error: ${O}`,isError:!0})}}for(const j of N.toolCalls)q.some(R=>R.id===j.id)||q.push({id:j.id,name:j.name,content:"Stopped by the user.",isError:!0});if(this.messages.push({role:"tool",results:q}),c.aborted)break}}catch(m){c.aborted?s({type:"notice",level:"info",message:"Stopped."}):s({type:"notice",level:"error",message:Ni(m)}),s({type:"turn_end",turnId:l,stopReason:"error"})}finally{this.busy=!1,this.aborter=null,s({type:"idle"})}}async rescueBuild(t,a,n,r){r({type:"activity",label:"Building it here instead"}),r({type:"notice",level:"warn",message:"The model replied without creating anything, so the builder inside the app made it instead."});const s=Yt(t);for(const[o,c]of Object.entries(s.files)){const l=await this.checkpoints.capture(a,n,o);await a.write(o,c);const{added:u,removed:d}=it(l,c);r({type:"file_change",turnId:n,change:{path:o,before:l,after:c,added:u,removed:d}})}r({type:"todos",items:s.plan.map(o=>({text:o,status:"done"}))})}async runOneStep(t,a,n,r,s,o,c){const l=U(t),u={model:this.preferredModel??a.model,system:n,messages:this.messages,tools:r,maxTokens:Math.max(2048,Math.min(a.maxTokens,64e3)),effort:a.effort,thinking:a.showThinking,signal:s},d={provider:l,key:this.host.keyFor(l.id),net:this.host.net,endpointOverride:a.customEndpoint,anthropicFeatures:this.anthropicFeatures,onFeatureDisabled:h=>{this.anthropicFeatures={...this.anthropicFeatures,[h]:!1}}};try{return await Fe(d,u,o)}catch(h){if(!(h instanceof P))throw h;if(h.message==="__PUTER_SIGNIN__"){if(c({type:"activity",label:"Waiting for you to sign in"}),!await this.host.requestSignIn())throw new P("Sign-in was cancelled, so nothing was built.",401);return c({type:"activity",label:"Thinking"}),Fe(d,u,o)}if(h.message.startsWith("__PUTER_MODEL__")){const p=l.models.map(g=>g.id).filter(g=>!this.triedModels.has(g))[0];if(!p)throw new P("No free model is available right now. Try again shortly, or pick another provider in Settings.",404);return this.triedModels.add(p),c({type:"notice",level:"info",message:`${a.model} is not available — switching to ${p}.`}),this.preferredModel=p,Fe(d,{...u,model:p},o)}throw h}}}function Ti(e,t){const a=typeof t?.path=="string"?t.path:"";switch(e){case"write_file":return`Writing ${a}`;case"edit_file":return`Editing ${a}`;case"read_file":return`Reading ${a}`;case"delete_file":return`Deleting ${a}`;case"list_files":return"Looking around the project";case"find_files":return`Searching for ${t?.pattern??"files"}`;case"search_code":return"Searching the code";case"run_command":return`Running ${String(t?.command??"").slice(0,50)}`;case"update_plan":return"Updating the plan";case"review_project":return"Reviewing what it built";default:return e}}function Ni(e){if(e instanceof P)return e.message;const t=String(e?.message??e??"Unknown error");return/Failed to fetch|NetworkError|ENOTFOUND|ECONNREFUSED/i.test(t)?"Could not reach the AI service. Check your internet connection.":t}const Li=2;function Pi(e){const t={...Me,...e??{}};return(t.version??1)<2&&t.provider==="puter"&&t.model==="gpt-5-nano"&&(t.model=Me.model),t.version=Li,t}const Me={provider:"puter",model:"claude-sonnet-4-5",effort:"high",approvalMode:"autopilot",showThinking:!0,maxTokens:32e3,customInstructions:"",alwaysAllow:[],customEndpoint:"",maestro:!0};async function ue(){if(!navigator.storage?.getDirectory)throw new Error("This browser cannot store projects. Try Chrome, Edge, or the desktop app.");return(await navigator.storage.getDirectory()).getDirectoryHandle("projects",{create:!0})}async function Ee(e,t,a){let n=await(await ue()).getDirectoryHandle(e,{create:a});for(const r of t)try{n=await n.getDirectoryHandle(r,{create:a})}catch{return null}return n}function Ye(e){const t=e.split("/").filter(Boolean);return{name:t.pop()??"",dirs:t}}class Ke{constructor(t,a){this.project=t,this.label=a}canRunCommands=!1;async list(t){const a=await Ee(this.project,t.split("/").filter(Boolean),!1);if(!a)return[];const n=[];for await(const[r,s]of a.entries())xi.has(r)||n.push({name:r,path:t?`${t}/${r}`:r,dir:s.kind==="directory"});return n.sort((r,s)=>r.dir===s.dir?r.name.localeCompare(s.name):r.dir?-1:1),n}async read(t){const{dirs:a,name:n}=Ye(t),r=await Ee(this.project,a,!1);if(!r)return null;try{return(await(await r.getFileHandle(n)).getFile()).text()}catch{return null}}async write(t,a){const{dirs:n,name:r}=Ye(t),s=await Ee(this.project,n,!0);if(!s)throw new Error(`Could not create ${t}`);const o=await s.getFileHandle(r,{create:!0});if(!o.createWritable)throw new Error("This browser cannot write files. Try Chrome, Edge, or the desktop app.");const c=await o.createWritable();await c.write(a),await c.close()}async remove(t){const{dirs:a,name:n}=Ye(t),r=await Ee(this.project,a,!1);r&&await r.removeEntry(n,{recursive:!0}).catch(()=>{})}async exists(t){return await this.read(t)!==null}async walk(){const t=[],a=async(n,r)=>{if(!(r>10||t.length>3e3))for(const s of await this.list(n))s.dir?await a(s.path,r+1):t.push(s.path)};return await a("",0),t}}const $i={png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",webp:"image/webp",svg:"image/svg+xml",ico:"image/x-icon"};async function Di(e){const t=await e.walk(),a=t.find(o=>o==="index.html")??t.find(o=>o.endsWith("/index.html"))??t.find(o=>o.endsWith(".html"));if(!a)return{error:"No HTML file yet. Ask for a web page and it will appear here."};const n=a.includes("/")?a.slice(0,a.lastIndexOf("/")+1):"",r=o=>/^(https?:|data:|#|mailto:)/i.test(o)?null:(n+o.replace(/^\.\//,"")).replace(/^\//,"");let s=await e.read(a)??"";for(const o of[...s.matchAll(/<link\b[^>]*?href=["']([^"']+)["'][^>]*>/gi)]){if(!/stylesheet/i.test(o[0]))continue;const c=r(o[1]);if(!c)continue;const l=await e.read(c);l!==null&&(s=s.replace(o[0],`<style>
${l}
</style>`))}for(const o of[...s.matchAll(/<script\b[^>]*?src=["']([^"']+)["'][^>]*>\s*<\/script>/gi)]){const c=r(o[1]);if(!c)continue;const l=await e.read(c);if(l===null)continue;const u=/type=["']module["']/i.test(o[0]);s=s.replace(o[0],`<script${u?' type="module"':""}>
${l}
<\/script>`)}for(const o of[...s.matchAll(/src=["']([^"']+\.(?:png|jpe?g|gif|webp|svg|ico))["']/gi)]){const c=r(o[1]);if(!c)continue;const l=await e.read(c);if(l===null)continue;const u=c.split(".").pop().toLowerCase(),d=u==="svg"?`data:image/svg+xml;utf8,${encodeURIComponent(l)}`:`data:${$i[u]??"application/octet-stream"};base64,${btoa(unescape(encodeURIComponent(l)))}`;s=s.replace(o[0],`src="${d}"`)}return{srcdoc:s}}const Mi={async request(e,t){const a=await fetch(e,{method:t.method,headers:t.headers,body:t.body,signal:t.signal});return{status:a.status,ok:a.ok,text:()=>a.text(),async*lines(){const n=a.body?.getReader();if(!n)return;const r=new TextDecoder;for(;;){const{done:s,value:o}=await n.read();if(s)break;yield r.decode(o,{stream:!0})}}}}},Ct="mc.settings",je="mc.keys",ce="mc.lastProject",ea="mc.projects";function Se(e,t){try{const a=localStorage.getItem(e);return a?{...t,...JSON.parse(a)}:t}catch{return t}}function Ae(){try{return JSON.parse(localStorage.getItem(ea)??"{}")}catch{return{}}}function Ve(e){localStorage.setItem(ea,JSON.stringify(e))}function Tt(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40)||"project"}function Ii(){return{kind:"web",platform:"web",net:Mi,canRunCommands:!1,async listProjects(){const e=Ae(),t=[];try{const a=await ue();for await(const[n,r]of a.entries())r.kind==="directory"&&t.push({id:n,name:e[n]?.name??n,location:n,updatedAt:e[n]?.updatedAt??0})}catch{}return t.sort((a,n)=>n.updatedAt-a.updatedAt)},async createProject(e){const t=Ae();let a=Tt(e),n=2;for(;t[a];)a=`${Tt(e)}-${n++}`;return await(await ue()).getDirectoryHandle(a,{create:!0}),t[a]={name:e,updatedAt:Date.now()},Ve(t),localStorage.setItem(ce,a),{id:a,name:e,location:a,updatedAt:Date.now()}},async openProject(e){const t=Ae();try{await(await ue()).getDirectoryHandle(e,{create:!1})}catch{return null}return t[e]={name:t[e]?.name??e,updatedAt:Date.now()},Ve(t),localStorage.setItem(ce,e),{id:e,name:t[e].name,location:e,updatedAt:Date.now()}},async deleteProject(e){await(await ue()).removeEntry(e,{recursive:!0}).catch(()=>{});const t=Ae();delete t[e],Ve(t),localStorage.getItem(ce)===e&&localStorage.removeItem(ce)},async lastProject(){const e=localStorage.getItem(ce);return e?this.openProject(e):null},workspace(e){return new Ke(e.location,e.name)},async readMeta(e,t){const a=new Ke(e.location,e.name);if(Te(t))return{path:t,content:"",language:"plaintext",truncated:!1,binary:!0};const n=await a.read(t)??"";return{path:t,content:n,language:Ma(t),truncated:!1,binary:!1}},async getSettings(){return Pi(Se(Ct,Me))},async setSettings(e){const t={...await this.getSettings(),...e};return localStorage.setItem(Ct,JSON.stringify(t)),t},async getKey(e){return Se(je,{})[e]??""},async setKey(e,t){const a=Se(je,{});t?a[e]=t:delete a[e],localStorage.setItem(je,JSON.stringify(a))},async configuredKeys(){return Object.keys(Se(je,{}))},async preview(e){return Di(new Ke(e.location,e.name))},openExternal(e){window.open(e,"_blank","noopener")}}}function Ri(e){const t=new Map;return e.onNetChunk((a,n)=>{t.get(a)?.push(n)}),{async request(a,n){const r=await e.netRequest(a,{method:n.method,headers:n.headers,body:n.body}),{requestId:s}=r,o=[];let c=!1,l=null;t.set(s,{push:d=>{d===null?c=!0:o.push(d),l?.()}}),n.signal.addEventListener("abort",()=>e.netAbort(s),{once:!0});const u=async function*(){try{for(;;){if(o.length){yield o.shift();continue}if(c)return;await new Promise(d=>{l=d}),l=null}}finally{t.delete(s)}};return{status:r.status,ok:r.ok,lines:u,async text(){let d="";for await(const h of u())d+=h;return d}}}}}class zi{constructor(t,a){this.bridge=t,this.label=a}canRunCommands=!0;list(t){return this.bridge.list(t)}read(t){return this.bridge.read(t)}write(t,a){return this.bridge.write(t,a)}remove(t){return this.bridge.remove(t)}exists(t){return this.bridge.exists(t)}walk(){return this.bridge.walk()}async run(t,a){const n=this.bridge.onCommandChunk(a);try{return await this.bridge.run(t)}finally{n()}}}function Wi(e){const t=Ri(e);return{kind:"desktop",platform:e.platform,net:t,canRunCommands:!0,listProjects:()=>e.listProjects(),createProject:a=>e.createProject(a),openProject:a=>e.openProject(a),chooseProject:()=>e.chooseProject(),deleteProject:async()=>{},lastProject:()=>e.currentProject(),workspace(a){return new zi(e,a.name)},readMeta:(a,n)=>e.readMeta(n),getSettings:()=>e.getSettings(),setSettings:a=>e.setSettings(a),getKey:a=>e.getKey(a),setKey:(a,n)=>e.setKey(a,n),configuredKeys:()=>e.listKeys(),async preview(){const a=await e.startPreview();return a?{url:a}:{error:"Could not start the preview server."}},openExternal:a=>void e.openExternal(a),window:{minimize:()=>e.minimize(),toggleMaximize:()=>e.toggleMaximize(),close:()=>e.close()}}}const w=window.mc?Wi(window.mc):Ii(),W=w.kind==="web",ta={ready:!1,project:null,projects:[],settings:Me,configuredKeys:[],account:null,syncing:!1,cloudProjects:[],githubUser:null,githubBusy:null,repoLink:null,tree:{},expanded:[],tabs:[],active:null,files:{},chat:[],todos:[],changes:[],busy:!1,activity:"",startedAt:0,playable:!1,usage:{input:0,output:0,cost:0},center:"editor",diffPath:null,preview:null,output:"",outputOpen:!1,modal:null,keyProvider:null,checkpoints:[],toast:null};let he=ta;const st=new Set,aa=[];function I(){return he}function f(e){he={...he,...typeof e=="function"?e(he):e};for(const t of st)t()}function Bi(e){return st.add(e),()=>st.delete(e)}function y(e){return v.useSyncExternalStore(Bi,()=>e(he),()=>e(ta))}let Xe=null;function C(e){f({toast:e}),Xe&&clearTimeout(Xe),Xe=setTimeout(()=>f({toast:null}),3400)}function pe(e){f(t=>({chat:[...t.chat,e]}))}function Je(e,t){f(a=>({chat:a.chat.map(n=>n.id===e?{...n,...t}:n)}))}const na="mc.projects.index",ia=e=>`mc.project.${e}`;async function Ie(){return!await ge()||!ee.isSignedIn()?null:window.puter.kv}async function sa(){const e=await Ie();if(!e)return[];try{const t=await e.get(na);if(!t)return[];const a=typeof t=="string"?JSON.parse(t):t;return Array.isArray(a)?a:[]}catch{return[]}}async function Oi(e){const t=await Ie();t&&await t.set(na,JSON.stringify(e.slice(0,60)))}async function ra(e,t){const a=await Ie();if(!a)return!1;const n={};for(const o of await t.walk()){const c=await t.read(o);c!==null&&c.length<4e5&&(n[o]=c)}const r=e.id;await a.set(ia(r),JSON.stringify({name:e.name,files:n,updatedAt:Date.now()}));const s=(await sa()).filter(o=>o.id!==r);return s.unshift({id:r,name:e.name,updatedAt:Date.now(),fileCount:Object.keys(n).length}),await Oi(s.sort((o,c)=>c.updatedAt-o.updatedAt)),!0}async function Hi(e){const t=await Ie();if(!t)return null;const a=await t.get(ia(e));if(!a)return null;const n=typeof a=="string"?JSON.parse(a):a,r=n?.files??{},s=n?.name??e,c=(await w.listProjects()).find(u=>u.id===e||u.name===s)??await w.createProject(s),l=w.workspace(c);for(const[u,d]of Object.entries(r))await l.write(u,d).catch(()=>{});return c}let ne=null;function oa(e,t,a){ne&&clearTimeout(ne),ne=setTimeout(async()=>{const n=await ra(e,t).catch(()=>!1);a?.(n)},4e3)}function la(){ne&&clearTimeout(ne),ne=null}const ct=Object.freeze(Object.defineProperty({__proto__:null,cancelPush:la,listCloudProjects:sa,pullProject:Hi,pushProject:ra,schedulePush:oa},Symbol.toStringTag,{value:"Module"})),me=new Map;let Ze=null;function Gi(){Ze===null&&(Ze=setTimeout(()=>{if(Ze=null,me.size===0)return;const e=new Map(me);me.clear(),f(t=>({chat:t.chat.map(a=>{const n=e.get(a.id);return n===void 0||a.kind!=="text"&&a.kind!=="thinking"?a:{...a,text:a.text+n}})}))},32))}let A=null;const K=new Ci({net:w.net,platform:w.platform,keyFor:e=>G[e]??"",requestSignIn:async()=>Re(!0)}),G={};function Fi(e){switch(e.type){case"turn_start":f({busy:!0,activity:"Getting started",startedAt:Date.now()});break;case"activity":f({activity:e.label});break;case"block_start":pe({kind:e.kind,id:e.id,text:"",done:!1});break;case"delta":me.set(e.id,(me.get(e.id)??"")+e.text),Gi();break;case"block_end":Je(e.id,{done:!0});break;case"tool_start":pe({kind:"tool",id:e.id,name:e.name,input:e.input,status:"running",summary:""});break;case"tool_end":Je(e.id,{status:e.status,summary:e.summary,detail:e.detail});break;case"approval_request":pe({kind:"approval",id:e.id,tool:e.tool,title:e.title,detail:e.detail,resolved:null});break;case"approval_resolved":Je(e.id,{resolved:e.approved});break;case"todos":f({todos:e.items});break;case"file_change":{const t=e.change;f(a=>{const n=a.files[t.path];return{changes:[...a.changes.filter(r=>r.path!==t.path),t],files:n?{...a.files,[t.path]:{...n,content:t.after??"",original:t.after??"",dirty:!1}}:a.files,diffPath:t.path,center:a.center==="preview"?"preview":"diff"}}),te(),be();break}case"command_output":f(t=>({output:(t.output+e.chunk).slice(-12e4),outputOpen:!0}));break;case"usage":f(t=>({usage:{input:t.usage.input+e.delta.input+e.delta.cacheRead+e.delta.cacheWrite,output:t.usage.output+e.delta.output,cost:t.usage.cost+e.delta.costUsd}}));break;case"notice":pe({kind:"notice",id:`n_${Date.now()}_${Math.random()}`,level:e.level,message:e.message});break;case"need_key":f({modal:"key",keyProvider:e.provider});break;case"idle":{f({busy:!1,activity:"",checkpoints:K.checkpoints.list()}),ga();const t=I();(t.center==="preview"||t.changes.length>0)&&ye();break}}}async function qi(){const[e,t,a]=await Promise.all([w.getSettings(),w.configuredKeys(),w.listProjects()]);for(const s of t)G[s]=await w.getKey(s);f({settings:e,configuredKeys:t,projects:a,ready:!0}),(async()=>{if(!await ge()||!ee.isSignedIn())return;const s=await ee.user();s&&f({account:s})})(),G.github&&Y(()=>import("./github-DDn50CN_.js"),__vite__mapDeps([3,4,1,2]),import.meta.url).then(async({whoAmI:s})=>{f({githubUser:await s(w.net,G.github)})});const n=await w.lastProject();n&&await ie(n),window.mcEvents?.onProjectChanged?.(s=>void ie(s))}async function ie(e){A=w.workspace(e),K.reset(),la(),f({project:e,tree:{},expanded:[],tabs:[],active:null,files:{},chat:[],todos:[],changes:[],output:"",preview:null,center:"editor",usage:{input:0,output:0,cost:0},checkpoints:[],repoLink:null}),await te(),f({repoLink:await ss()}),await ga()}async function rt(e){const t=await w.createProject(e);return f(a=>({projects:[t,...a.projects.filter(n=>n.id!==t.id)]})),await ie(t),t}async function ca(e){const t=await w.openProject(e);t?await ie(t):C("That project could not be opened.")}async function da(){const e=await w.chooseProject?.();e&&(f(t=>({projects:[e,...t.projects.filter(a=>a.id!==e.id)]})),await ie(e))}async function Ui(e){await w.deleteProject(e),f(t=>({projects:t.projects.filter(a=>a.location!==e)})),C("Project deleted")}async function Yi(){f({projects:await w.listProjects()})}async function Ki(){if(!I().account){f({cloudProjects:[]});return}const{listCloudProjects:e}=await Y(async()=>{const{listCloudProjects:t}=await Promise.resolve().then(()=>ct);return{listCloudProjects:t}},void 0,import.meta.url);f({cloudProjects:await e()})}async function Vi(e){f({githubBusy:"Downloading from your account…"});try{const{pullProject:t}=await Y(async()=>{const{pullProject:n}=await Promise.resolve().then(()=>ct);return{pullProject:n}},void 0,import.meta.url),a=await t(e);if(!a){C("That project could not be downloaded.");return}await Yi(),await ie(a),f({modal:null}),C(`Opened ${a.name} from your account`)}catch(t){C(t.message)}finally{f({githubBusy:null})}}async function te(e=""){if(!A)return;const t=await A.list(e);f(a=>({tree:{...a.tree,[e]:t}}))}async function Xi(e){const{expanded:t,tree:a}=I();if(t.includes(e)){f({expanded:t.filter(n=>n!==e)});return}a[e]||await te(e),f(n=>({expanded:[...n.expanded,e]}))}async function dt(e,t="editor"){const{project:a,files:n}=I();if(a){if(!n[e]){const r=await w.readMeta(a,e);f(s=>({files:{...s.files,[e]:{content:r.content,original:r.content,language:r.language,dirty:!1,binary:r.binary}}}))}f(r=>({tabs:r.tabs.includes(e)?r.tabs:[...r.tabs,e],active:e,center:t,diffPath:t==="diff"?e:r.diffPath}))}}function Ji(e){f(t=>{const a=t.tabs.filter(r=>r!==e),n={...t.files};return delete n[e],{tabs:a,files:n,active:t.active===e?a[a.length-1]??null:t.active}})}function Zi(e,t){f(a=>{const n=a.files[e];return n?{files:{...a.files,[e]:{...n,content:t,dirty:t!==n.original}}}:{}})}async function ut(){const{active:e,files:t}=I();if(!e||!A)return;const a=t[e];a?.dirty&&(await A.write(e,a.content),f(n=>({files:{...n.files,[e]:{...n.files[e],original:a.content,dirty:!1}}})),be(),C(`Saved ${e}`))}async function ua(e,t=[]){const a=e.trim();if(!a)return;let{project:n,settings:r}=I();n||(n=await rt(Qi(a)),r=I().settings),A&&(pe({kind:"user",id:`u_${Date.now()}`,text:a,attachments:t}),f({busy:!0,activity:"Getting started",startedAt:Date.now()}),await K.send(a,t,A,r,Fi))}function Qi(e){const t=new Set(["a","an","the","make","build","create","me","my","i","want","need","please","can","you","app","that","with","for","and","to","of","in","on","is","it"]),a=e.toLowerCase().replace(/[^a-z0-9\s-]/g," ").split(/\s+/).filter(n=>n&&!t.has(n)).slice(0,4);return a.length?a.join("-"):"new-project"}function pa(){K.stop(),f({busy:!1})}function Qe(e,t,a){const n=I().chat.find(s=>s.id===e),r=n&&n.kind==="approval"?n.tool:void 0;if(K.resolveApproval(e,t,a,r),a&&t&&r){const s=I().settings;s.alwaysAllow.includes(r)||z({alwaysAllow:[...s.alwaysAllow,r]})}}function es(){K.reset(),f({chat:[],todos:[],changes:[],usage:{input:0,output:0,cost:0},output:"",checkpoints:[]}),C("Fresh session — the project files are untouched")}async function z(e){const t=await w.setSettings(e);f({settings:t})}async function ts(e,t){await w.setKey(e,t),G[e]=t,f({configuredKeys:await w.configuredKeys(),modal:null,keyProvider:null}),C(t?"Key saved":"Key removed")}async function as(e){const t=U(e),a=I().settings.model,n=t.models.some(r=>r.id===a)?a:t.models[0]?.id??a;await z({provider:e,model:n})}async function Re(e=!1){try{const t=await ee.signIn();return t?(f({account:t}),e||C(`Signed in as ${t.username}`),!0):!1}catch{return e||C("Sign-in was cancelled"),!1}}function ha(){ee.signOut(),f({account:null}),C("Signed out. Your projects stay on this device.")}function be(){const{account:e,project:t}=I();!e||!t||!A||(f({syncing:!0}),oa(t,A,a=>{f({syncing:!1}),a||C("Could not sync to your account.")}))}async function ns(){const{account:e,project:t}=I();if(!e||!t||!A){C("Sign in first to sync.");return}f({syncing:!0});const{pushProject:a}=await Y(async()=>{const{pushProject:r}=await Promise.resolve().then(()=>ct);return{pushProject:r}},void 0,import.meta.url),n=await a(t,A).catch(()=>!1);f({syncing:!1}),C(n?"Synced to your account":"Sync failed")}async function is(e){if(!A)return;const t=await K.checkpoints.restore(A,e);C(`Rewound ${t} file${t===1?"":"s"}`),f({modal:null,changes:[],files:{},tabs:[],active:null,checkpoints:K.checkpoints.list()}),await te(),be()}async function ma(e,t){A&&(t===null?await A.remove(e):await A.write(e,t),f(a=>({changes:a.changes.filter(n=>n.path!==e),files:{},tabs:a.tabs.filter(n=>n!==e)})),await te(),be(),C(`Reverted ${e}`))}const fa=".masterpiece/github.json";async function ss(){if(!A)return null;const e=await A.read(fa);if(!e)return null;try{const t=JSON.parse(e);return t?.owner&&t?.repo?t:null}catch{return null}}async function pt(e){await A?.write(fa,JSON.stringify(e,null,2)),f({repoLink:e})}async function Nt(e){await w.setKey("github",e),G.github=e;const{whoAmI:t}=await Y(async()=>{const{whoAmI:n}=await import("./github-DDn50CN_.js");return{whoAmI:n}},__vite__mapDeps([3,4,1,2]),import.meta.url),a=await t(w.net,e);f({githubUser:a,configuredKeys:await w.configuredKeys()}),C(a?`Connected to GitHub as ${a}`:"Token saved, but GitHub did not recognise it")}async function rs(e){if(!A)return;const{parseRepo:t,pullRepo:a}=await Y(async()=>{const{parseRepo:r,pullRepo:s}=await import("./github-DDn50CN_.js");return{parseRepo:r,pullRepo:s}},__vite__mapDeps([3,4,1,2]),import.meta.url),n=t(e);if(!n){C("That does not look like a GitHub link.");return}f({githubBusy:"Connecting…"});try{const r=await a(w.net,G.github??"",n,A,s=>f({githubBusy:s}));await pt(n),await te(),be(),C(`Pulled ${r.files} file${r.files===1?"":"s"} from ${n.owner}/${n.repo}`)}catch(r){C(r.message)}finally{f({githubBusy:null})}}async function os(e,t){if(!A)return;const{parseRepo:a,pushRepo:n}=await Y(async()=>{const{parseRepo:s,pushRepo:o}=await import("./github-DDn50CN_.js");return{parseRepo:s,pushRepo:o}},__vite__mapDeps([3,4,1,2]),import.meta.url),r=a(e);if(!r){C("That does not look like a GitHub link.");return}f({githubBusy:"Connecting…"});try{const s=await n(w.net,G.github??"",r,A,t||"Update from Masterpiece Coder",o=>f({githubBusy:o}));await pt(r),C(`Saved ${s.files} files to ${r.owner}/${r.repo} — commit ${s.commit}`)}catch(s){C(s.message)}finally{f({githubBusy:null})}}async function ls(e,t){if(!A)return;const{createRepo:a,pushRepo:n}=await Y(async()=>{const{createRepo:r,pushRepo:s}=await import("./github-DDn50CN_.js");return{createRepo:r,pushRepo:s}},__vite__mapDeps([3,4,1,2]),import.meta.url);f({githubBusy:"Creating the repository…"});try{const r=await a(w.net,G.github??"",e,t),s=await n(w.net,G.github??"",r,A,"First commit from Masterpiece Coder",o=>f({githubBusy:o}));await pt(r),C(`Created ${r.owner}/${r.repo} with ${s.files} files`),w.openExternal(r.url)}catch(r){C(r.message)}finally{f({githubBusy:null})}}async function ga(){if(!A){f({playable:!1});return}const e=await A.walk();f({playable:e.some(t=>t.toLowerCase().endsWith(".html"))})}async function ye(){const{project:e}=I();if(!e)return;const t=await w.preview(e);f({preview:t,center:"preview"})}const _=(e,t="0 0 24 24")=>function({size:n=15,className:r}){return i.jsx("svg",{width:n,height:n,viewBox:t,fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round",className:r,"aria-hidden":"true",children:e})},ze=_(i.jsx("path",{d:"M9 6l6 6-6 6"})),se=_(i.jsx("path",{d:"M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"})),ht=_(i.jsx("path",{d:"M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"})),ya=_(i.jsx("path",{d:"M7 4l12 8-12 8z"})),cs=_(i.jsx("rect",{x:"6",y:"6",width:"12",height:"12",rx:"2"})),ds=_(i.jsxs(i.Fragment,{children:[i.jsx("circle",{cx:"12",cy:"12",r:"3"}),i.jsx("path",{d:"M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"})]})),us=_(i.jsxs(i.Fragment,{children:[i.jsx("path",{d:"M3 12a9 9 0 1 0 3-6.7L3 8"}),i.jsx("path",{d:"M3 3v5h5"}),i.jsx("path",{d:"M12 7v5l3 2"})]})),ba=_(i.jsxs(i.Fragment,{children:[i.jsx("path",{d:"M12 3v18M4 8h6M4 16h6M14 12h6"}),i.jsx("path",{d:"M17 9l3 3-3 3"})]})),ps=_(i.jsxs(i.Fragment,{children:[i.jsx("path",{d:"M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"}),i.jsx("circle",{cx:"12",cy:"12",r:"3"})]})),va=_(i.jsx("path",{d:"M9 18l-6-6 6-6M15 6l6 6-6 6"})),mt=_(i.jsx("path",{d:"M12 5v14M5 12h14"})),ft=_(i.jsxs(i.Fragment,{children:[i.jsx("path",{d:"M21 12a9 9 0 1 1-2.6-6.4L21 8"}),i.jsx("path",{d:"M21 3v5h-5"})]})),wa=_(i.jsxs(i.Fragment,{children:[i.jsx("rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}),i.jsx("path",{d:"M7 9l3 3-3 3M13 15h4"})]})),hs=_(i.jsxs(i.Fragment,{children:[i.jsx("path",{d:"M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"}),i.jsx("path",{d:"M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"})]})),ms=_(i.jsx("path",{d:"M4 12l5 5L20 6"})),F=_(i.jsx("path",{d:"M6 6l12 12M18 6L6 18"})),fs=_(i.jsxs(i.Fragment,{children:[i.jsx("path",{d:"M9.5 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5.2A3 3 0 0 0 7 17.6 3 3 0 0 0 12 19V5.5A1.5 1.5 0 0 0 10.5 4z"}),i.jsx("path",{d:"M14.5 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5.2 3 3 0 0 1-2.5 5.4A3 3 0 0 1 12 19"})]})),gs=_(i.jsxs(i.Fragment,{children:[i.jsx("path",{d:"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"}),i.jsx("path",{d:"M17 21v-8H7v8M7 3v5h8"})]})),xa=_(i.jsx("path",{d:"M4 12l16-8-6 16-2.5-6.2z"})),gt=_(i.jsxs(i.Fragment,{children:[i.jsx("path",{d:"M3 8h11a6 6 0 0 1 0 12H8"}),i.jsx("path",{d:"M3 8l4-4M3 8l4 4"})]})),ys=_(i.jsxs(i.Fragment,{children:[i.jsx("path",{d:"M14 4h6v6"}),i.jsx("path",{d:"M20 4l-9 9"}),i.jsx("path",{d:"M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"})]})),yt=_(i.jsx("path",{d:"M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.1 11.1 3.5 3.5 0 0 0 6.5 19z"})),ka=_(i.jsxs(i.Fragment,{children:[i.jsx("path",{d:"M12 3v12"}),i.jsx("path",{d:"M7 11l5 5 5-5"}),i.jsx("path",{d:"M4 21h16"})]})),bs=_(i.jsxs(i.Fragment,{children:[i.jsx("path",{d:"M12 17V5"}),i.jsx("path",{d:"M7 9l5-5 5 5"}),i.jsx("path",{d:"M4 21h16"})]})),vs=_(i.jsx("path",{d:"M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"})),ws=_(i.jsx("path",{d:"M5 12h14"})),xs=_(i.jsx("rect",{x:"5",y:"5",width:"14",height:"14",rx:"2"}));function ks(){const e=y(c=>c.project),t=y(c=>c.settings),a=y(c=>c.account),n=y(c=>c.syncing),r=y(c=>c.busy),s=y(c=>c.playable),o=U(t.provider);return i.jsxs("div",{className:"titlebar",children:[i.jsxs("div",{className:"brand",children:[i.jsx("div",{className:"mark"}),i.jsx("span",{children:"Masterpiece Coder"})]}),i.jsxs("button",{className:"crumb",onClick:()=>f({modal:"projects"}),title:"Switch project",children:[i.jsx(se,{size:13}),i.jsx("span",{children:e?e.name:"No project"})]}),i.jsxs("button",{className:"crumb",onClick:()=>f({modal:"settings"}),title:`${o.label} · ${t.model}`,children:[i.jsx("span",{style:{color:o.free?"var(--green)":"var(--accent-2)"},children:o.free?"✦ Free":o.label}),i.jsx("span",{style:{color:"var(--faint)"},children:t.model})]}),s&&i.jsxs("button",{className:"btn play",onClick:()=>void ye(),title:"Run what you have built",children:[i.jsx(ya,{size:12})," Play"]}),i.jsx("div",{style:{flex:1}}),i.jsxs("button",{className:`btn ghost${a?" on":""}`,onClick:()=>a?void ns():void Re(),title:a?`Signed in as ${a.username}. Click to sync this project now.`:"Sign in free to use the free AI and sync projects between the web app and the desktop app",children:[i.jsx(yt,{size:13}),n?"Syncing…":a?a.username:"Sign in"]}),a&&i.jsx("button",{className:"iconbtn",onClick:ha,title:"Sign out",children:i.jsx(F,{size:13})}),i.jsxs("button",{className:"btn ghost",onClick:es,disabled:r,title:"Clear the conversation, keep the files",children:[i.jsx(mt,{size:13})," New chat"]}),i.jsx("button",{className:"btn ghost",onClick:()=>f({modal:"github"}),title:"Save this project to GitHub, or pull a repo into it",children:i.jsx(vs,{size:13})}),i.jsx("button",{className:"btn ghost",onClick:()=>f({modal:"history"}),title:"Rewind changes",children:i.jsx(us,{size:13})}),i.jsx("button",{className:"btn ghost",onClick:()=>f({modal:"settings"}),title:"Settings",children:i.jsx(ds,{size:13})}),!W&&w.window&&i.jsxs("div",{className:"winbtns",children:[i.jsx("button",{className:"winbtn",onClick:()=>w.window.minimize(),"aria-label":"Minimize",children:i.jsx(ws,{size:14})}),i.jsx("button",{className:"winbtn",onClick:()=>w.window.toggleMaximize(),"aria-label":"Maximize",children:i.jsx(xs,{size:12})}),i.jsx("button",{className:"winbtn close",onClick:()=>w.window.close(),"aria-label":"Close",children:i.jsx(F,{size:14})})]})]})}const Es={ts:"#5aa9f8",tsx:"#5aa9f8",js:"#f0c33c",jsx:"#f0c33c",json:"#f0c33c",html:"#ff8a5b",css:"#7c8cff",scss:"#ff7bb0",md:"#8b94a8",py:"#4fd6a0",go:"#48d8e6",rs:"#ff9a62",java:"#ff6b6b",svg:"#b98cff"};function js(e){const t=e.includes(".")?e.slice(e.lastIndexOf(".")+1).toLowerCase():"";return{text:(t||"·").slice(0,3),color:Es[t]??"#5b6478"}}function Ea({node:e,depth:t}){const a=y(c=>c.expanded.includes(e.path)),n=y(c=>c.tree[e.path]),r=y(c=>c.active===e.path),s=y(c=>c.changes.some(l=>l.path===e.path)),o=js(e.name);return i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:`row${r?" on":""}`,style:{paddingLeft:6+t*12},onClick:()=>e.dir?Xi(e.path):dt(e.path),title:e.path,children:[e.dir?i.jsx(ze,{size:12,className:`chev${a?" open":""}`}):i.jsx("span",{className:"filetype",style:{color:o.color},children:o.text}),i.jsx("span",{className:"name",children:e.name}),s&&i.jsx("span",{className:"dot changed"})]}),e.dir&&a&&(n??aa).map(c=>i.jsx(Ea,{node:c,depth:t+1},c.path))]})}function Ss(){const e=y(t=>t.changes);return e.length===0?null:i.jsxs("div",{className:"changes",children:[i.jsxs("div",{className:"pane-head",style:{borderTop:"1px solid var(--line-soft)",borderBottom:"none"},children:["Changed",i.jsx("div",{className:"grow"}),i.jsx("span",{style:{fontFamily:"var(--mono)",letterSpacing:0},children:e.length})]}),e.map(t=>i.jsxs("div",{className:"change-row",onClick:()=>f({diffPath:t.path,center:"diff"}),title:`Open the diff for ${t.path}`,children:[i.jsx(ba,{size:12}),i.jsx("span",{className:"p",children:t.path}),i.jsxs("span",{className:"stat-add",children:["+",t.added]}),i.jsxs("span",{className:"stat-del",children:["−",t.removed]}),i.jsx("button",{className:"iconbtn",title:"Undo this file",onClick:a=>{a.stopPropagation(),ma(t.path,t.before)},children:i.jsx(gt,{size:12})})]},t.path))]})}function As(){const e=y(t=>t.tree[""]??aa);return i.jsxs("div",{className:"pane",children:[i.jsxs("div",{className:"pane-head",children:["Files",i.jsx("div",{className:"grow"}),i.jsx("button",{className:"iconbtn",title:"Refresh",onClick:()=>te(),children:i.jsx(ft,{size:13})})]}),i.jsxs("div",{className:"tree",children:[e.length===0&&i.jsx("div",{style:{padding:"14px 12px",color:"var(--faint)",fontSize:12,lineHeight:1.6},children:"Empty for now. Describe what you want and the files appear here as they are written."}),e.map(t=>i.jsx(Ea,{node:t,depth:0},t.path))]}),i.jsx(Ss,{})]})}self.MonacoEnvironment={getWorker(e,t){switch(t){case"json":return new La;case"css":case"scss":case"less":return new Na;case"html":case"handlebars":case"razor":return new Ta;case"typescript":case"javascript":return new Ca;default:return new _a}}};tt.defineTheme("masterpiece",{base:"vs-dark",inherit:!0,rules:[{token:"",foreground:"d6dced"},{token:"comment",foreground:"5b6478",fontStyle:"italic"},{token:"keyword",foreground:"b98cff"},{token:"string",foreground:"8ce39a"},{token:"number",foreground:"f5b544"},{token:"type",foreground:"48d8e6"},{token:"type.identifier",foreground:"48d8e6"},{token:"function",foreground:"7c8cff"},{token:"identifier",foreground:"d6dced"},{token:"delimiter",foreground:"7b8398"},{token:"tag",foreground:"ff8a5b"},{token:"attribute.name",foreground:"7c8cff"},{token:"attribute.value",foreground:"8ce39a"}],colors:{"editor.background":"#10141c","editor.foreground":"#d6dced","editorLineNumber.foreground":"#39425a","editorLineNumber.activeForeground":"#8b94a8","editor.lineHighlightBackground":"#161c27","editor.selectionBackground":"#2b3557","editor.inactiveSelectionBackground":"#20273a","editorCursor.foreground":"#7c8cff","editorIndentGuide.background1":"#1c2331","editorIndentGuide.activeBackground1":"#2b3446","editorWidget.background":"#141924","editorWidget.border":"#1f2735","editorSuggestWidget.background":"#141924","editorSuggestWidget.selectedBackground":"#22293a","editorGutter.addedBackground":"#4ade80","editorGutter.modifiedBackground":"#48d8e6","editorGutter.deletedBackground":"#ff6b6b","diffEditor.insertedTextBackground":"#4ade8022","diffEditor.removedTextBackground":"#ff6b6b22","scrollbarSlider.background":"#232b3a80","scrollbarSlider.hoverBackground":"#2f394b","scrollbarSlider.activeBackground":"#39425a"}});const _s={theme:"masterpiece",fontFamily:"'JetBrains Mono', 'Cascadia Code', Consolas, monospace",fontSize:13,lineHeight:21,fontLigatures:!0,minimap:{enabled:!1},smoothScrolling:!0,cursorBlinking:"smooth",cursorSmoothCaretAnimation:"on",renderLineHighlight:"line",scrollBeyondLastLine:!1,padding:{top:14,bottom:40},automaticLayout:!0,tabSize:2,bracketPairColorization:{enabled:!0},guides:{indentation:!0,bracketPairs:!1},scrollbar:{verticalScrollbarSize:10,horizontalScrollbarSize:10,useShadows:!1},overviewRulerBorder:!1,fixedOverflowWidgets:!0};function Cs(){const e=y(n=>n.diffPath),t=y(n=>n.changes.find(r=>r.path===n.diffPath)),a=v.useMemo(()=>t?yi(Zt(t.before??"",t.after??"")):[],[t]);return!e||!t?i.jsx("div",{className:"empty",children:i.jsxs("div",{children:[i.jsx("h3",{children:"No changes yet"}),i.jsx("p",{children:"When the agent writes a file, its diff shows up here."})]})}):i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"diff-head",children:[i.jsx("span",{className:"path",children:t.path}),i.jsxs("span",{className:"stat-add",children:["+",t.added]}),i.jsxs("span",{className:"stat-del",children:["−",t.removed]}),i.jsx("div",{style:{flex:1}}),i.jsxs("button",{className:"btn tiny danger",onClick:()=>ma(t.path,t.before),children:[i.jsx(gt,{size:12})," Undo this file"]}),i.jsx("button",{className:"btn tiny ghost",onClick:()=>f({center:"editor"}),title:"Back to the editor",children:i.jsx(F,{size:12})})]}),i.jsx("div",{className:"diff",children:a.map((n,r)=>n.op==="gap"?i.jsxs("div",{className:"diff-gap",children:["⋯ ",n.count," unchanged line",n.count===1?"":"s"]},r):i.jsxs("div",{className:`diff-line ${n.op}`,children:[i.jsxs("div",{className:"gutter",children:[i.jsx("i",{children:n.a??""}),i.jsx("i",{children:n.b??""})]}),i.jsx("div",{className:"code",children:n.text||" "})]},r))})]})}function Ts({visible:e}){const t=y(u=>u.active),a=y(u=>u.active?u.files[u.active]:null),n=v.useRef(null),r=v.useRef(null),s=v.useRef(new Map),o=v.useRef(!1);v.useEffect(()=>{if(!n.current)return;const u=tt.create(n.current,_s);return r.current=u,u.addCommand(Pa.CtrlCmd|$a.KeyS,()=>void ut()),()=>{u.dispose();for(const d of s.current.values())d.dispose();s.current.clear(),r.current=null}},[]),v.useEffect(()=>{const u=r.current;if(!u||!t||!a)return;let d=s.current.get(t);d||(d=tt.createModel(a.content,a.language),s.current.set(t,d),d.onDidChangeContent(()=>{o.current||Zi(t,d.getValue())})),u.getModel()!==d&&u.setModel(d),u.focus()},[t,a?.language]),v.useEffect(()=>{const u=r.current;if(!u||!t||!a)return;const d=s.current.get(t);if(!d||d.getValue()===a.content)return;o.current=!0;const h=u.getPosition();d.pushEditOperations([],[{range:d.getFullModelRange(),text:a.content}],()=>null),h&&u.setPosition(h),o.current=!1},[t,a?.content]);const c=y(u=>u.tabs);v.useEffect(()=>{for(const[u,d]of s.current)c.includes(u)||(d.dispose(),s.current.delete(u))},[c]),v.useEffect(()=>{e&&r.current?.layout()},[e]);const l=!!(t&&a&&!a.binary);return i.jsxs(i.Fragment,{children:[i.jsx("div",{className:"editor-wrap",ref:n,style:{display:e&&l?"block":"none"}}),e&&!l&&i.jsx("div",{className:"empty",children:a?.binary?i.jsxs("div",{children:[i.jsx("h3",{children:t}),i.jsx("p",{children:"This is a binary file, so there is nothing to show as text."})]}):i.jsxs("div",{children:[i.jsx("h3",{children:"Nothing open"}),i.jsx("p",{children:"Pick a file from the explorer, or describe what you want built and watch the files appear."})]})})]})}function Ns(){const e=y(a=>a.preview),t=v.useRef(null);return!e||e.error?i.jsx("div",{className:"empty",children:i.jsxs("div",{children:[i.jsx("h3",{children:"Preview"}),i.jsx("p",{children:e?.error??"Shows the project running. Press the button to build it."}),i.jsxs("button",{className:"btn primary",style:{marginTop:14},onClick:()=>void ye(),children:[i.jsx(ps,{size:13})," ",e?.error?"Try again":"Start preview"]})]})}):i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"diff-head",children:[i.jsx("span",{className:"path",children:e.url??"Live preview"}),i.jsx("div",{style:{flex:1}}),i.jsxs("button",{className:"btn tiny",onClick:()=>void ye(),children:[i.jsx(ft,{size:12})," Reload"]}),e.url&&i.jsxs("button",{className:"btn tiny",onClick:()=>w.openExternal(e.url),children:[i.jsx(ys,{size:12})," Browser"]})]}),i.jsx("iframe",{ref:t,className:"preview-frame",...e.url?{src:e.url}:{srcDoc:e.srcdoc},sandbox:"allow-scripts allow-modals allow-forms allow-popups",title:"Project preview"})]})}function Ls(){const e=y(n=>n.output),t=y(n=>n.outputOpen),a=v.useRef(null);return v.useEffect(()=>{a.current&&(a.current.scrollTop=a.current.scrollHeight)},[e]),!t||!e?null:i.jsxs("div",{className:"output",children:[i.jsxs("div",{className:"pane-head",children:[i.jsx(wa,{size:12})," Output",i.jsx("div",{className:"grow"}),i.jsx("button",{className:"iconbtn",onClick:()=>f({output:""}),title:"Clear",children:i.jsx(ft,{size:12})}),i.jsx("button",{className:"iconbtn",onClick:()=>f({outputOpen:!1}),title:"Hide",children:i.jsx(F,{size:12})})]}),i.jsx("pre",{ref:a,children:e})]})}function Ps(){const e=y(c=>c.tabs),t=y(c=>c.active),a=y(c=>c.center),n=y(c=>c.files),r=t?n[t]?.dirty??!1:!1,s=y(c=>c.changes.length),o=y(c=>c.output.length>0);return i.jsxs("div",{className:"pane",style:{position:"relative"},children:[i.jsxs("div",{className:"tabs",children:[e.map(c=>i.jsxs("div",{className:`tab${t===c&&a==="editor"?" on":""}`,onClick:()=>dt(c),children:[i.jsx("span",{children:c.split("/").pop()}),n[c]?.dirty&&i.jsx("span",{className:"pip"}),i.jsx("span",{className:"x",onClick:l=>{l.stopPropagation(),Ji(c)},children:"×"})]},c)),i.jsx("div",{style:{flex:1}}),i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,padding:"0 10px"},children:[r&&i.jsxs("button",{className:"btn tiny",onClick:ut,title:"Ctrl+S",children:[i.jsx(gs,{size:12})," Save"]}),i.jsxs("div",{className:"seg",children:[i.jsxs("button",{className:a==="editor"?"on":"",onClick:()=>f({center:"editor"}),children:[i.jsx(va,{size:11})," Code"]}),i.jsxs("button",{className:a==="diff"?"on":"",onClick:()=>f({center:"diff"}),children:[i.jsx(ba,{size:11})," Diff",s>0?` ${s}`:""]}),i.jsxs("button",{className:a==="preview"?"on":"",onClick:()=>void ye(),children:[i.jsx(ya,{size:11})," Play"]})]}),o&&i.jsx("button",{className:"iconbtn",title:"Show command output",onClick:()=>f({outputOpen:!0}),children:i.jsx(wa,{size:13})})]})]}),i.jsxs("div",{style:{flex:1,minHeight:0,display:"flex",flexDirection:"column"},children:[i.jsx(Ts,{visible:a==="editor"}),a==="diff"&&i.jsx(Cs,{}),a==="preview"&&i.jsx(Ns,{})]}),i.jsx(Ls,{})]})}function ja(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function _e(e){let t=ja(e);const a=[];return t=t.replace(/`([^`]+)`/g,(n,r)=>(a.push(r),`\0${a.length-1}\0`)),t=t.replace(/\*\*\*([^*]+)\*\*\*/g,"<strong><em>$1</em></strong>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/(^|[\s(])\*([^*\n]+)\*/g,"$1<em>$2</em>").replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g,'$1<a href="$2" target="_blank" rel="noreferrer">$2</a>'),t=t.replace(/\0(\d+)\0/g,(n,r)=>`<code>${a[Number(r)]}</code>`),t}function $s(e){const t=e.replace(/\r\n/g,`
`).split(`
`),a=[];let n=0,r=null;const s=()=>{r&&(a.push(`</${r}>`),r=null)};for(;n<t.length;){const o=t[n],c=o.match(/^\s*```(\w*)\s*$/);if(c){s();const p=[];for(n++;n<t.length&&!/^\s*```/.test(t[n]);)p.push(t[n++]);n++,a.push(`<pre><code class="lang-${c[1]||"text"}">${ja(p.join(`
`))}</code></pre>`);continue}if(/^\s*(---|\*\*\*|___)\s*$/.test(o)){s(),a.push("<hr />"),n++;continue}const l=o.match(/^(#{1,6})\s+(.*)$/);if(l){s();const p=Math.min(l[1].length+1,4);a.push(`<h${p}>${_e(l[2])}</h${p}>`),n++;continue}const u=o.match(/^>\s?(.*)$/);if(u){s();const p=[u[1]];for(n++;n<t.length&&/^>\s?/.test(t[n]);)p.push(t[n++].replace(/^>\s?/,""));a.push(`<blockquote>${_e(p.join(" "))}</blockquote>`);continue}const d=o.match(/^\s*[-*+]\s+(.*)$/),h=o.match(/^\s*\d+[.)]\s+(.*)$/);if(d||h){const p=d?"ul":"ol";r!==p&&(s(),a.push(`<${p}>`),r=p),a.push(`<li>${_e((d??h)[1])}</li>`),n++;continue}if(o.trim()===""){s(),n++;continue}s();const m=[o];for(n++;n<t.length&&t[n].trim()!==""&&!/^\s*(```|[-*+]\s|\d+[.)]\s|#{1,6}\s|>)/.test(t[n]);)m.push(t[n++]);a.push(`<p>${_e(m.join(`
`))}</p>`)}return s(),a.join("")}function Ds({text:e}){const t=v.useMemo(()=>$s(e),[e]);return i.jsx("div",{className:"md",dangerouslySetInnerHTML:{__html:t}})}function Ms(){const e=y(p=>p.busy),t=y(p=>p.project),a=y(p=>p.settings.approvalMode),[n,r]=v.useState(""),[s,o]=v.useState([]),[c,l]=v.useState(null),u=v.useRef(null);v.useEffect(()=>{const p=u.current;p&&(p.style.height="auto",p.style.height=`${Math.min(p.scrollHeight,220)}px`)},[n]),v.useEffect(()=>{const p=g=>{g.key==="l"&&(g.ctrlKey||g.metaKey)&&(g.preventDefault(),u.current?.focus())};return window.addEventListener("keydown",p),()=>window.removeEventListener("keydown",p)},[]);const d=()=>{if(e||!n.trim())return;const p=n,g=s;r(""),o([]),l(null),ua(p,g)},h=async p=>{r(p);const g=p.match(/@([\w./-]*)$/),S=I().project;if(!g||!S){l(null);return}const b=w.workspace(S),x=g[1].toLowerCase(),L=await b.walk();l(L.filter($=>$.toLowerCase().includes(x)).slice(0,6).map($=>({name:$.split("/").pop()??$,path:$,dir:!1})))},m=p=>{r(g=>g.replace(/@([\w./-]*)$/,"")),o(g=>g.includes(p.path)?g:[...g,p.path]),l(null),u.current?.focus()};return i.jsxs("div",{className:"composer",children:[c&&c.length>0&&i.jsx("div",{className:"suggestions",children:c.map(p=>i.jsxs("button",{className:"suggestion",onClick:()=>m(p),children:["@",p.path]},p.path))}),s.length>0&&i.jsx("div",{className:"suggestions",children:s.map(p=>i.jsxs("button",{className:"suggestion",title:"Remove",onClick:()=>o(g=>g.filter(S=>S!==p)),children:["@",p," ×"]},p))}),i.jsxs("div",{className:"composer-box",children:[i.jsx("textarea",{ref:u,value:n,placeholder:t?"What next?  (@ to attach a file)":"Describe what you want built…",onChange:p=>void h(p.target.value),onKeyDown:p=>{p.key==="Enter"&&!p.shiftKey&&(p.preventDefault(),d())},spellCheck:!1}),i.jsxs("div",{className:"composer-bar",children:[i.jsxs("div",{className:"seg",title:"How much freedom the agent has",children:[i.jsx("button",{className:a==="ask"?"on":"",onClick:()=>z({approvalMode:"ask"}),disabled:e,children:"Ask first"}),i.jsx("button",{className:a==="autopilot"?"on":"",onClick:()=>z({approvalMode:"autopilot"}),disabled:e,children:"Autopilot"})]}),i.jsx("div",{className:"grow"}),i.jsx("span",{className:"hint",children:"⏎ send"}),e?i.jsxs("button",{className:"btn danger",onClick:pa,children:[i.jsx(cs,{size:12})," Stop"]}):i.jsxs("button",{className:"btn primary",onClick:d,disabled:!n.trim(),children:[i.jsx(xa,{size:13})," Send"]})]})]})]})}const Sa={read_file:"Read",write_file:"Write",edit_file:"Edit",delete_file:"Delete",list_files:"List",find_files:"Find",search_code:"Search",run_command:"Run",update_plan:"Plan"};function Is({item:e}){const t=y(r=>r.settings.showThinking),[a,n]=v.useState(!0);return v.useEffect(()=>{e.done&&n(!1)},[e.done]),t?i.jsxs("div",{className:"thinking",children:[i.jsxs("div",{className:"thinking-head",onClick:()=>n(r=>!r),children:[i.jsx(ze,{size:11,className:`chev${a?" open":""}`}),i.jsx(fs,{size:12}),e.done?i.jsx("span",{children:"Thought process"}):i.jsx("span",{className:"shimmer",children:"Thinking…"})]}),a&&e.text&&i.jsx("div",{className:"thinking-body",children:e.text})]}):null}function Rs({item:e}){const[t,a]=v.useState(!1),n=Sa[e.name]??e.name,r=typeof e.input?.path=="string"?e.input.path:typeof e.input?.command=="string"?e.input.command:typeof e.input?.pattern=="string"?e.input.pattern:"",s=e.name==="write_file"||e.name==="edit_file";return i.jsxs("div",{className:"tool",children:[i.jsxs("div",{className:"tool-head",onClick:()=>e.detail&&a(o=>!o),children:[e.status==="running"?i.jsx("div",{className:"spin"}):i.jsx("span",{className:`pill ${e.status}`,children:e.status==="ok"?i.jsx(ms,{size:12}):e.status==="rejected"?"⃠":i.jsx(F,{size:12})}),i.jsx("span",{className:"tool-name",children:n}),i.jsx("span",{className:"tool-sum",onClick:o=>{!s||!e.input?.path||(o.stopPropagation(),dt(String(e.input.path),"diff"))},style:s?{cursor:"pointer",color:"var(--accent-2)"}:void 0,children:e.summary||r}),e.detail&&i.jsx(ze,{size:11,className:`chev${t?" open":""}`})]}),t&&e.detail&&i.jsx("div",{className:"tool-body",children:e.detail})]})}function zs({item:e}){return e.resolved!==null?i.jsxs("div",{className:"approval done",children:[i.jsx("div",{className:"title",children:e.title}),i.jsx("div",{className:"why",children:e.resolved?"Approved":"Declined"})]}):i.jsxs("div",{className:"approval",children:[i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:7,marginBottom:5},children:[i.jsx(ht,{size:13}),i.jsx("span",{style:{fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:600},children:"Permission needed"})]}),i.jsx("div",{className:"title",children:e.title}),e.detail&&i.jsx("div",{className:"why",children:e.detail}),i.jsxs("div",{className:"acts",children:[i.jsx("button",{className:"btn primary tiny",onClick:()=>Qe(e.id,!0,!1),children:"Allow once"}),i.jsxs("button",{className:"btn tiny",onClick:()=>Qe(e.id,!0,!0),children:["Always allow ",Sa[e.tool]??e.tool]}),i.jsx("button",{className:"btn tiny danger",onClick:()=>Qe(e.id,!1,!1),children:"Decline"})]})]})}function Ws(){const e=y(r=>r.todos),[t,a]=v.useState(!0);if(e.length===0)return null;const n=e.filter(r=>r.status==="done").length;return i.jsxs("div",{className:"plan",children:[i.jsxs("div",{className:"plan-head",onClick:()=>a(r=>!r),children:[i.jsx(ze,{size:11,className:`chev${t?" open":""}`}),"Plan",i.jsx("div",{style:{flex:1}}),i.jsxs("span",{style:{fontFamily:"var(--mono)",letterSpacing:0},children:[n,"/",e.length]})]}),t&&i.jsx("div",{className:"plan-list",children:e.map((r,s)=>i.jsxs("div",{className:`plan-item ${r.status}`,children:[i.jsx("span",{className:"plan-box",children:r.status==="done"?"✓":""}),i.jsx("span",{children:r.text})]},s))})]})}function Bs({item:e}){switch(e.kind){case"user":return i.jsxs("div",{className:"msg-user",children:[e.text,e.attachments.length>0&&i.jsx("div",{className:"chips",children:e.attachments.map(t=>i.jsxs("span",{className:"chip",children:["@",t]},t))})]});case"thinking":return i.jsx(Is,{item:e});case"text":return e.text?i.jsx("div",{className:"msg-text",children:i.jsx(Ds,{text:e.text})}):null;case"tool":return i.jsx(Rs,{item:e});case"approval":return i.jsx(zs,{item:e});case"notice":return i.jsxs("div",{className:`notice ${e.level}`,children:[i.jsx("span",{children:e.level==="error"?"⚠":e.level==="warn"?"!":"i"}),i.jsx("span",{children:e.message})]});default:return null}}function Os(){const e=y(r=>r.activity),t=y(r=>r.startedAt),[,a]=v.useState(0);v.useEffect(()=>{const r=setInterval(()=>a(s=>s+1),1e3);return()=>clearInterval(r)},[]);const n=t?Math.floor((Date.now()-t)/1e3):0;return i.jsxs("div",{className:"activity",children:[i.jsx("div",{className:"spin"}),i.jsx("span",{className:"shimmer",children:e||"Working"}),i.jsx("div",{style:{flex:1}}),i.jsx("span",{className:"activity-time",children:n<60?`${n}s`:`${Math.floor(n/60)}m ${n%60}s`}),i.jsx("button",{className:"btn tiny danger",onClick:pa,children:"Stop"})]})}function Hs(){const e=y(t=>t.project);return i.jsxs("div",{style:{margin:"auto",textAlign:"center",padding:"30px 16px",color:"var(--faint)"},children:[i.jsx("div",{style:{width:44,height:44,margin:"0 auto 14px",borderRadius:14,background:"linear-gradient(135deg, var(--accent), var(--accent-2))",boxShadow:"0 0 34px var(--accent-glow)"}}),i.jsx("div",{style:{color:"var(--text)",fontSize:15.5,fontWeight:600,marginBottom:5},children:e?"What next?":"Describe an idea"}),i.jsx("div",{style:{fontSize:12.5,maxWidth:300,margin:"0 auto",lineHeight:1.6},children:"Say it in plain language. It reads your project, plans, writes the files and checks its own work."})]})}function Gs(){const e=y(s=>s.chat),t=y(s=>s.busy),a=y(s=>s.usage),n=v.useRef(null),r=v.useRef(!0);return v.useEffect(()=>{const s=n.current;s&&r.current&&(s.scrollTop=s.scrollHeight)}),i.jsxs("div",{className:"pane",children:[i.jsxs("div",{className:"pane-head",children:["Agent",i.jsx("div",{className:"grow"}),a.cost>0&&i.jsxs("span",{style:{fontFamily:"var(--mono)",letterSpacing:0},children:["$",a.cost.toFixed(3)]})]}),i.jsxs("div",{className:"chat",ref:n,onScroll:s=>{const o=s.currentTarget;r.current=o.scrollHeight-o.scrollTop-o.clientHeight<90},children:[e.length===0?i.jsx(Hs,{}):e.map(s=>i.jsx(Bs,{item:s},s.id)),t&&i.jsx(Os,{})]}),i.jsx(Ws,{}),i.jsx(Ms,{})]})}function ve({children:e,onClose:t}){return i.jsx("div",{className:"scrim",onMouseDown:a=>a.target===a.currentTarget&&t(),children:i.jsx("div",{className:"modal",children:e})})}function et({on:e,label:t,desc:a,onChange:n}){return i.jsxs("div",{className:`opt${e?" on":""}`,onClick:()=>n(!e),children:[i.jsx("div",{className:`switch${e?" on":""}`}),i.jsxs("div",{children:[i.jsx("div",{className:"t",children:t}),i.jsx("div",{className:"s",children:a})]})]})}function Fs({providerId:e,onClose:t}){const a=U(e),[n,r]=v.useState(""),[s,o]=v.useState(!1),c=async()=>{o(!0),await ts(a.id,n),o(!1)};return i.jsxs(ve,{onClose:t,children:[i.jsxs("header",{children:["Connect ",a.label,i.jsx("div",{style:{flex:1}}),i.jsx("button",{className:"iconbtn",onClick:t,children:i.jsx(F,{size:14})})]}),i.jsxs("div",{className:"content",children:[i.jsxs("div",{className:"field",children:[i.jsx("label",{children:"API key"}),i.jsx("input",{type:"password",value:n,autoFocus:!0,placeholder:a.keyHint??"Paste your key",onChange:l=>r(l.target.value),onKeyDown:l=>l.key==="Enter"&&n.trim()&&c()}),i.jsxs("div",{className:"desc",children:["Stored ",W?"in this browser":"encrypted on this machine"," and sent only to ",a.label,".",a.keyUrl&&i.jsxs(i.Fragment,{children:[" ","Get one at"," ",i.jsx("a",{href:a.keyUrl,onClick:l=>{l.preventDefault(),w.openExternal(a.keyUrl)},style:{color:"var(--accent-2)"},children:new URL(a.keyUrl).host}),"."]})]})]}),i.jsxs("div",{className:"notice",children:[i.jsx("span",{children:"i"}),i.jsxs("span",{children:["Do not want to deal with keys? Switch to ",i.jsx("b",{children:"Free"})," in settings — one sign-in, no card, and it syncs your projects too."]})]})]}),i.jsxs("footer",{children:[i.jsx("button",{className:"btn",onClick:t,children:"Cancel"}),i.jsx("button",{className:"btn primary",disabled:!n.trim()||s,onClick:c,children:s?"Saving…":"Save key"})]})]})}const qs=[{id:"low",label:"Low — quick and cheap"},{id:"medium",label:"Medium — balanced"},{id:"high",label:"High — thinks it through (default)"},{id:"xhigh",label:"Extra high — hard multi-file builds"},{id:"max",label:"Max — no ceiling"}];function Us({onClose:e}){const t=y(l=>l.settings),a=y(l=>l.configuredKeys),n=y(l=>l.account),[r,s]=v.useState(t.customInstructions),o=U(t.provider),c=$e.filter(l=>l.browserOk||!W);return i.jsxs(ve,{onClose:e,children:[i.jsxs("header",{children:["Settings",i.jsx("div",{style:{flex:1}}),i.jsx("button",{className:"iconbtn",onClick:e,children:i.jsx(F,{size:14})})]}),i.jsxs("div",{className:"content",children:[i.jsxs("div",{className:"field",children:[i.jsx("label",{children:"Who builds it"}),i.jsx("div",{className:"opts",children:c.map(l=>{const u=!l.needsKey||a.includes(l.id);return i.jsxs("div",{className:`opt${t.provider===l.id?" on":""}`,onClick:()=>void as(l.id),children:[i.jsx("div",{className:"radio"}),i.jsxs("div",{style:{flex:1},children:[i.jsxs("div",{className:"t",children:[l.label,l.free&&i.jsx("span",{className:"tag free",children:"free"}),l.needsKey&&!u&&i.jsx("span",{className:"tag",children:"needs a key"}),l.needsKey&&u&&i.jsx("span",{className:"tag ok",children:"connected"})]}),i.jsx("div",{className:"s",children:l.tagline}),l.note&&t.provider===l.id&&i.jsx("div",{className:"s dim",children:l.note})]}),l.needsKey&&i.jsx("button",{className:"btn tiny",onClick:d=>{d.stopPropagation(),f({modal:"key",keyProvider:l.id})},children:u?"Replace":"Add key"})]},l.id)})}),$e.some(l=>!l.browserOk)&&W&&i.jsx("div",{className:"desc",children:"Ollama is hidden here because a web page cannot reach your local machine. It works in the desktop app."})]}),o.id==="custom"&&i.jsxs("div",{className:"field",children:[i.jsx("label",{children:"Endpoint URL"}),i.jsx("input",{type:"text",defaultValue:t.customEndpoint,placeholder:"http://localhost:1234/v1/chat/completions",onBlur:l=>z({customEndpoint:l.target.value.trim()})}),i.jsx("div",{className:"desc",children:"The full chat-completions URL of any OpenAI-compatible server."})]}),i.jsxs("div",{className:"field",children:[i.jsx("label",{children:"Model"}),i.jsxs("select",{value:t.model,onChange:l=>z({model:l.target.value}),children:[o.models.map(l=>i.jsxs("option",{value:l.id,children:[l.label,l.blurb?` — ${l.blurb}`:""]},l.id)),!o.models.some(l=>l.id===t.model)&&i.jsxs("option",{value:t.model,children:[t.model," (custom)"]})]}),o.allowCustomModel&&i.jsxs(i.Fragment,{children:[i.jsx("input",{type:"text",style:{marginTop:7},placeholder:"…or type any model id this provider supports",defaultValue:"",onKeyDown:l=>{if(l.key==="Enter"){const u=l.target.value.trim();u&&z({model:u})}}}),i.jsx("div",{className:"desc",children:"Press enter to use a model that is not in the list."})]})]}),o.wire==="anthropic"&&i.jsxs("div",{className:"field",children:[i.jsx("label",{children:"Thinking effort"}),i.jsx("select",{value:t.effort,onChange:l=>z({effort:l.target.value}),children:qs.map(l=>i.jsx("option",{value:l.id,children:l.label},l.id))})]}),i.jsxs("div",{className:"field",children:[i.jsx("label",{children:"Account"}),i.jsx("div",{className:"opts",children:i.jsxs("div",{className:"opt",style:{cursor:"default"},children:[i.jsx(yt,{size:17}),i.jsxs("div",{style:{flex:1},children:[i.jsx("div",{className:"t",children:n?n.username:"Not signed in"}),i.jsx("div",{className:"s",children:n?"Free AI is enabled and your projects sync between the web app and the desktop app.":"Sign in free to use the free AI and to carry projects between the browser and the desktop app."})]}),i.jsx("button",{className:"btn tiny",onClick:()=>n?ha():void Re(),children:n?"Sign out":"Sign in"})]})})]}),i.jsxs("div",{className:"field",children:[i.jsx("label",{children:"Behaviour"}),i.jsxs("div",{className:"opts",children:[i.jsx(et,{on:t.maestro!==!1,label:"Maestro",desc:"Plan before building and check afterwards. Works out what you meant, chooses a palette, hands the AI the numbers that make the thing actually work, then reads what it wrote and sends anything broken back to be fixed.",onChange:l=>z({maestro:l})}),i.jsx(et,{on:t.approvalMode==="autopilot",label:"Autopilot",desc:"Let it write files and run commands without asking each time. Everything is still rewindable.",onChange:l=>z({approvalMode:l?"autopilot":"ask"})}),i.jsx(et,{on:t.showThinking,label:"Show the thought process",desc:"Stream the reasoning into the chat when the model provides it.",onChange:l=>z({showThinking:l})})]})]}),i.jsxs("div",{className:"field",children:[i.jsx("label",{children:"Standing instructions"}),i.jsx("textarea",{value:r,placeholder:'e.g. "Always use plain HTML and CSS." · "Comment sparingly." · "Dark theme by default."',onChange:l=>s(l.target.value),onBlur:()=>z({customInstructions:r})}),i.jsx("div",{className:"desc",children:"Added to every request, so you never repeat yourself."})]}),t.alwaysAllow.length>0&&i.jsxs("div",{className:"field",children:[i.jsx("label",{children:"Always allowed"}),i.jsx("div",{style:{display:"flex",gap:6,flexWrap:"wrap"},children:t.alwaysAllow.map(l=>i.jsxs("button",{className:"idea",onClick:()=>z({alwaysAllow:t.alwaysAllow.filter(u=>u!==l)}),children:[l," ×"]},l))}),i.jsx("div",{className:"desc",children:"Click to revoke."})]})]}),i.jsx("footer",{children:i.jsx("button",{className:"btn primary",onClick:e,children:"Done"})})]})}function Ys({onClose:e}){const t=y(l=>l.projects),a=y(l=>l.project),n=y(l=>l.account),r=y(l=>l.cloudProjects),s=y(l=>l.githubBusy),[o,c]=v.useState("");return v.useEffect(()=>{Ki()},[]),i.jsxs(ve,{onClose:e,children:[i.jsxs("header",{children:["Projects",i.jsx("div",{style:{flex:1}}),i.jsx("button",{className:"iconbtn",onClick:e,children:i.jsx(F,{size:14})})]}),i.jsxs("div",{className:"content",children:[i.jsxs("div",{className:"field",children:[i.jsx("label",{children:"New project"}),i.jsxs("div",{style:{display:"flex",gap:8},children:[i.jsx("input",{type:"text",value:o,placeholder:"my-idea",onChange:l=>c(l.target.value),onKeyDown:l=>{l.key==="Enter"&&o.trim()&&(rt(o.trim()),e())}}),i.jsxs("button",{className:"btn primary",disabled:!o.trim(),onClick:()=>{rt(o.trim()),e()},children:[i.jsx(mt,{size:13})," Create"]})]}),!W&&i.jsxs("button",{className:"btn",style:{marginTop:8},onClick:()=>{da(),e()},children:[i.jsx(se,{size:13})," Open an existing folder"]})]}),i.jsxs("div",{className:"field",children:[i.jsx("label",{children:"From your account"}),n?s?i.jsxs("div",{className:"activity",children:[i.jsx("div",{className:"spin"}),i.jsx("span",{className:"shimmer",children:s})]}):r.length===0?i.jsx("div",{className:"desc",style:{marginTop:0},children:"Nothing in the cloud yet. Projects sync up as you work."}):i.jsx("div",{className:"opts",children:r.map(l=>i.jsxs("div",{className:"opt",children:[i.jsx(yt,{size:16}),i.jsxs("div",{style:{flex:1,minWidth:0},children:[i.jsx("div",{className:"t",children:l.name}),i.jsxs("div",{className:"s",children:[l.fileCount," file",l.fileCount===1?"":"s"," ·"," ",new Date(l.updatedAt).toLocaleString()]})]}),i.jsxs("button",{className:"btn tiny",onClick:()=>void Vi(l.id),children:[i.jsx(ka,{size:12})," Open here"]})]},l.id))}):i.jsxs("div",{className:"desc",style:{marginTop:0},children:[i.jsx("button",{className:"linkish",onClick:()=>void Re(),children:"Sign in"})," ","to see projects you started on another device — write a prompt on your phone, then pull the result down here."]})]}),i.jsxs("div",{className:"field",children:[i.jsxs("label",{children:["On this ",W?"browser":"computer"]}),t.length===0?i.jsx("div",{className:"desc",style:{marginTop:0},children:"Nothing yet — describe an idea and one gets made for you."}):i.jsx("div",{className:"opts",children:t.map(l=>i.jsxs("div",{className:`opt${a?.id===l.id?" on":""}`,children:[i.jsx(se,{size:16}),i.jsxs("div",{style:{flex:1,minWidth:0,cursor:"pointer"},onClick:()=>{ca(l.location),e()},children:[i.jsx("div",{className:"t",children:l.name}),i.jsx("div",{className:"s",style:{overflow:"hidden",textOverflow:"ellipsis"},children:W?"Saved in this browser":l.location})]}),W&&i.jsx("button",{className:"iconbtn",title:"Delete this project",onClick:()=>void Ui(l.location),children:i.jsx(hs,{size:13})})]},l.id))})]})]}),i.jsx("footer",{children:i.jsx("button",{className:"btn",onClick:e,children:"Close"})})]})}function Ks({onClose:e}){const t=y(p=>p.repoLink),a=y(p=>p.githubUser),n=y(p=>p.githubBusy),r=y(p=>p.project),s=y(p=>p.configuredKeys),[o,c]=v.useState(""),[l,u]=v.useState(t?`${t.owner}/${t.repo}`:""),[d,h]=v.useState(""),m=s.includes("github");return i.jsxs(ve,{onClose:e,children:[i.jsxs("header",{children:["GitHub",i.jsx("div",{style:{flex:1}}),i.jsx("button",{className:"iconbtn",onClick:e,children:i.jsx(F,{size:14})})]}),i.jsx("div",{className:"content",children:m?i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"notice",children:[i.jsx("span",{children:"✓"}),i.jsxs("span",{children:["Connected",a?` as ${a}`:"","."," ",i.jsx("button",{className:"linkish",onClick:()=>{Nt(""),c("")},children:"Disconnect"})]})]}),i.jsxs("div",{className:"field",children:[i.jsx("label",{children:"Repository"}),i.jsx("input",{type:"text",value:l,placeholder:"https://github.com/you/your-repo  ·  or  you/your-repo",onChange:p=>u(p.target.value)}),i.jsx("div",{className:"desc",children:"Paste a link to pull it down, or to choose where this project gets saved."})]}),i.jsxs("div",{className:"field",children:[i.jsx("label",{children:"Commit message"}),i.jsx("input",{type:"text",value:d,placeholder:"Update from Masterpiece Coder",onChange:p=>h(p.target.value)})]}),n&&i.jsxs("div",{className:"activity",children:[i.jsx("div",{className:"spin"}),i.jsx("span",{className:"shimmer",children:n})]}),i.jsxs("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[i.jsxs("button",{className:"btn",disabled:!l.trim()||!!n,onClick:()=>void rs(l),children:[i.jsx(ka,{size:13})," Pull into this project"]}),i.jsxs("button",{className:"btn primary",disabled:!l.trim()||!!n,onClick:()=>void os(l,d),children:[i.jsx(bs,{size:13})," Save to GitHub"]}),i.jsx("div",{style:{flex:1}}),i.jsxs("button",{className:"btn",disabled:!!n||!r,onClick:()=>void ls(r?.name??"masterpiece-project",!1),title:"Create a brand new public repository from this project",children:[i.jsx(mt,{size:13})," New repo from this project"]})]}),i.jsx("div",{className:"desc",children:"Pulling overwrites files in this project with the ones from the repo. Saving commits everything here as a single commit on the default branch."})]}):i.jsxs("div",{className:"field",children:[i.jsx("label",{children:"Connect your account"}),i.jsx("input",{type:"password",value:o,autoFocus:!0,placeholder:"ghp_… or github_pat_…",onChange:p=>c(p.target.value)}),i.jsxs("div",{className:"desc",children:["A personal access token with ",i.jsx("b",{children:"Contents: read and write"}),". Create one at"," ",i.jsx("a",{href:"https://github.com/settings/tokens",onClick:p=>{p.preventDefault(),w.openExternal("https://github.com/settings/tokens?type=beta")},style:{color:"var(--accent-2)"},children:"github.com/settings/tokens"}),". Stored ",W?"in this browser":"encrypted on this machine"," and sent only to GitHub."]}),i.jsx("button",{className:"btn primary",style:{marginTop:9},disabled:!o.trim(),onClick:()=>void Nt(o.trim()),children:"Connect"})]})}),i.jsx("footer",{children:i.jsx("button",{className:"btn",onClick:e,children:"Close"})})]})}function Vs({onClose:e}){const t=y(a=>a.checkpoints);return i.jsxs(ve,{onClose:e,children:[i.jsxs("header",{children:["History",i.jsx("div",{style:{flex:1}}),i.jsx("button",{className:"iconbtn",onClick:e,children:i.jsx(F,{size:14})})]}),i.jsx("div",{className:"content",children:i.jsxs("div",{className:"field",style:{margin:0},children:[i.jsx("div",{className:"desc",style:{marginTop:0,marginBottom:10},children:"Every message creates a checkpoint. Rewinding restores every file touched from that point onward — nothing else is affected."}),t.length===0?i.jsx("div",{style:{color:"var(--faint)",fontSize:12.5},children:"No file changes to rewind yet."}):i.jsx("div",{className:"opts",children:t.map(a=>i.jsxs("div",{className:"checkpoint",children:[i.jsxs("div",{className:"l",children:[i.jsx("div",{children:a.label}),i.jsxs("div",{children:[new Date(a.at).toLocaleTimeString()," · ",a.files," file",a.files===1?"":"s"]})]}),i.jsxs("button",{className:"btn tiny",onClick:()=>is(a.turnId),children:[i.jsx(gt,{size:12})," Rewind"]})]},a.turnId))})]})}),i.jsx("footer",{children:i.jsx("button",{className:"btn",onClick:e,children:"Close"})})]})}function Xs(){const e=y(n=>n.modal),t=y(n=>n.keyProvider),a=()=>f({modal:null,keyProvider:null});return e==="settings"?i.jsx(Us,{onClose:a}):e==="history"?i.jsx(Vs,{onClose:a}):e==="projects"?i.jsx(Ys,{onClose:a}):e==="github"?i.jsx(Ks,{onClose:a}):e==="key"?i.jsx(Fs,{providerId:t??"anthropic",onClose:a}):null}const Ce=["a snake game I can play with arrow keys","a landing page for a coffee roaster","a pomodoro timer with a circular progress ring","a tip calculator that splits the bill","a synthesizer I can play with my keyboard","a markdown notes app that saves to my browser","a solar system I can orbit around","a habit tracker with a streak counter"];function Js(){const e=y(d=>d.projects),t=y(d=>d.settings),a=y(d=>d.account),[n,r]=v.useState(""),[s,o]=v.useState(Ce[0]),c=v.useRef(null),l=U(t.provider);v.useEffect(()=>{c.current?.focus();let d=0;const h=setInterval(()=>{d=(d+1)%Ce.length,o(Ce[d])},3600);return()=>clearInterval(h)},[]),v.useEffect(()=>{const d=c.current;d&&(d.style.height="auto",d.style.height=`${Math.min(d.scrollHeight,200)}px`)},[n]);const u=d=>{const h=d.trim();h&&ua(h)};return i.jsx("div",{className:"launcher",children:i.jsxs("div",{className:"launcher-inner",children:[i.jsx("div",{className:"launcher-mark"}),i.jsx("h1",{children:"What do you want to build?"}),i.jsx("p",{className:"lead",children:"Describe it in a sentence. It gets built here, in front of you — files, code and all."}),i.jsxs("div",{className:"launcher-box",children:[i.jsx("textarea",{ref:c,value:n,placeholder:`Make me ${s}…`,onChange:d=>r(d.target.value),onKeyDown:d=>{d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),u(n))},spellCheck:!1,rows:2}),i.jsxs("div",{className:"launcher-bar",children:[i.jsxs("button",{className:"chip-btn",onClick:()=>f({modal:"settings"}),title:"Choose which AI builds this",children:[i.jsx(ht,{size:12}),l.free?"Free":l.label,i.jsx("span",{className:"chip-sub",children:t.model})]}),i.jsx("div",{style:{flex:1}}),i.jsxs("button",{className:"btn primary",onClick:()=>u(n),disabled:!n.trim(),children:[i.jsx(xa,{size:13})," Build it"]})]})]}),i.jsx("div",{className:"launcher-note",children:l.free&&!l.needsKey?a?i.jsxs(i.Fragment,{children:["Signed in as ",i.jsx("b",{children:a.username})," — free, and your projects sync across the web app and the desktop app."]}):i.jsx(i.Fragment,{children:"No API key needed. You will be asked to sign in once, free, when the first build starts."}):i.jsxs(i.Fragment,{children:["Using ",i.jsx("b",{children:l.label}),l.needsKey?" with your own key":"",". Switch to the free option any time in settings."]})}),i.jsx("div",{className:"ideas",children:Ce.slice(0,4).map(d=>i.jsx("button",{className:"idea",onClick:()=>u(`Make me ${d}`),children:d},d))}),(e.length>0||!W)&&i.jsxs("div",{className:"launcher-recent",children:[i.jsxs("div",{className:"launcher-recent-head",children:[e.length>0?"Or pick up where you left off":"Already have a project?",i.jsx("div",{style:{flex:1}}),!W&&i.jsxs("button",{className:"btn tiny ghost",onClick:da,children:[i.jsx(se,{size:12})," Open a folder"]})]}),e.slice(0,5).map(d=>i.jsxs("button",{className:"card",onClick:()=>void ca(d.location),children:[i.jsx(se,{size:16}),i.jsxs("div",{style:{flex:1,minWidth:0,textAlign:"left"},children:[i.jsx("div",{className:"t",children:d.name}),i.jsx("div",{className:"s",children:w.kind==="web"?"Saved in this browser":d.location})]})]},d.id))]})]})})}function Lt({varName:e,fallback:t,min:a,max:n,invert:r,side:s}){const[o,c]=v.useState(!1),l=v.useRef(null);return v.useEffect(()=>{if(!o)return;const u=h=>{const m=l.current?.parentElement;if(!m)return;const p=m.getBoundingClientRect(),g=r?p.right-h.clientX:h.clientX-p.left;m.style.setProperty(e,`${Math.max(a,Math.min(n,g))}px`)},d=()=>c(!1);return window.addEventListener("mousemove",u),window.addEventListener("mouseup",d),document.body.style.cursor="col-resize",document.body.style.userSelect="none",()=>{window.removeEventListener("mousemove",u),window.removeEventListener("mouseup",d),document.body.style.cursor="",document.body.style.userSelect=""}},[o,r,n,a,e]),i.jsx("div",{ref:l,className:`resizer${o?" active":""}`,style:s==="left"?{left:`calc(var(${e}, ${t}px) - 3px)`}:{right:`calc(var(${e}, ${t}px) - 3px)`},onMouseDown:()=>c(!0)})}function Zs(){const e=y(l=>l.project),t=y(l=>l.busy),a=y(l=>l.usage),n=y(l=>l.settings),r=y(l=>l.account),s=y(l=>l.active),o=y(l=>l.changes.length),c=U(n.provider);return i.jsxs("div",{className:"status",children:[i.jsx("span",{className:t?"live":"",children:t?"● working":"○ idle"}),i.jsx("b",{children:n.model}),i.jsx("span",{children:c.free?"free":c.label.toLowerCase()}),i.jsx("span",{children:n.approvalMode==="autopilot"?"autopilot":"ask first"}),i.jsx("div",{className:"grow"}),s&&i.jsx("span",{children:s}),o>0&&i.jsxs("span",{children:[o," changed"]}),a.cost>0&&i.jsxs("span",{children:["$",a.cost.toFixed(3)]}),r&&i.jsxs("span",{children:["☁ ",r.username]}),i.jsx("span",{children:W?"web":"desktop"}),e&&i.jsx("span",{title:e.location,children:e.name})]})}function Qs({view:e,onChange:t}){const a=y(r=>r.changes.length),n=y(r=>r.busy);return i.jsxs("div",{className:"mobile-tabs",children:[i.jsxs("button",{className:e==="chat"?"on":"",onClick:()=>t("chat"),children:[i.jsx(ht,{size:16}),n?"Working…":"Build"]}),i.jsxs("button",{className:e==="code"?"on":"",onClick:()=>t("code"),children:[i.jsx(va,{size:16}),"Code"]}),i.jsxs("button",{className:e==="files"?"on":"",onClick:()=>t("files"),children:[i.jsx(se,{size:16}),"Files",a>0?` (${a})`:""]})]})}function er(){const e=y(s=>s.ready),t=y(s=>s.project),a=y(s=>s.toast),[n,r]=v.useState("chat");return v.useEffect(()=>{qi()},[]),v.useEffect(()=>{const s=o=>{(o.ctrlKey||o.metaKey)&&o.key==="s"&&(o.preventDefault(),ut()),(o.ctrlKey||o.metaKey)&&o.key===","&&(o.preventDefault(),f({modal:"settings"})),o.key==="Escape"&&f({modal:null,keyProvider:null})};return window.addEventListener("keydown",s),()=>window.removeEventListener("keydown",s)},[]),e?i.jsxs("div",{className:`app${W?" web":""}`,children:[i.jsx(ks,{}),t?i.jsxs("div",{className:"body","data-view":n,style:{position:"relative"},children:[i.jsx(As,{}),i.jsx(Ps,{}),i.jsx(Gs,{}),i.jsx(Lt,{varName:"--explorer",fallback:248,min:170,max:420,side:"left"}),i.jsx(Lt,{varName:"--chat",fallback:430,min:320,max:720,side:"right",invert:!0})]}):i.jsx(Js,{}),t&&i.jsx(Qs,{view:n,onChange:r}),i.jsx(Zs,{}),i.jsx(Xs,{}),a&&i.jsx("div",{className:"toast",children:a})]}):null}const Pt=document.getElementById("root");Pt&&Aa(Pt).render(i.jsx(er,{}));export{xi as I};
