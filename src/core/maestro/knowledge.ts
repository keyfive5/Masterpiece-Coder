import { Archetype } from './types';

/**
 * What Maestro knows about building things.
 *
 * Every entry is the answer to "what does a competent developer already know
 * about this that the person asking did not say?". A prompt is four words; a
 * good build is two hundred decisions. This file makes those decisions in
 * advance, with numbers, so nobody has to guess at them under time pressure.
 *
 * The `tuning` lines matter more than anything else here. "Give the player
 * reaction time" is advice. "Spawn at y = -40 and travel 700 px to a hit line
 * at height - 120 at 420 px/s, which is 1.67 s of warning" is a specification.
 * The first one produced a rhythm game whose arrows appeared already on the hit
 * line. The second one cannot.
 *
 * `checks` name rules in critic.ts, so a knowledge entry is not just prose —
 * it is enforced after the build.
 */

/* ================================================================
   Universal — applies to every web project Maestro touches
   ================================================================ */

export const UNIVERSAL_REQUIREMENTS = [
  'The project must actually run when opened. No missing files, no references to scripts or stylesheets that do not exist, no half-written functions.',
  'Real content everywhere. No lorem ipsum, no "TODO", no "coming soon" standing in for a feature that was asked for.',
  'It must work on a phone: a viewport meta tag, a layout that reflows below 420 px, and touch input wherever there is mouse or keyboard input.',
  'Text must be legible — body text at least 16 px, and at least 4.5:1 contrast against its background.',
  'Never put user-supplied text into innerHTML. Use textContent, or escape it.',
  'Keyboard focus must be visible on anything interactive.',
];

export const UNIVERSAL_PITFALLS = [
  'Silent failure: an exception in an event handler kills everything after it and the page just sits there. Guard anything that can be absent, and check the console before declaring victory.',
  'Layout collapse on a narrow screen: fixed pixel widths, a grid that never becomes one column, a canvas wider than the viewport.',
  'The "generic AI look": Inter on white, a purple-to-blue gradient, three rounded cards with emoji. Choose a real palette and a real typeface with a reason behind them.',
];

/* ================================================================
   Archetypes
   ================================================================ */

export const ARCHETYPES: Archetype[] = [
  /* ------------------------------------------------------------ games */
  {
    id: 'snake',
    label: 'Snake',
    kind: 'game',
    family: 'arcade',
    triggers: ['snake game', 'snake', 'nokia game', 'worm game'],
    summary: 'A grid game where a growing line must eat without hitting itself or the walls.',
    mustHave: [
      'A fixed grid, drawn to a square canvas that scales with the viewport.',
      'A movement tick independent of the render frame, so speed is the same on a 60 Hz and a 144 Hz screen.',
      'Food that never appears underneath the snake.',
      'Growth by appending a segment, not by teleporting the tail.',
      'Score, a persisted high score, a game-over screen and a restart that fully resets state.',
      'Swipe controls as well as arrow keys and WASD.',
    ],
    pitfalls: [
      {
        id: 'reverse-into-self',
        symptom: 'Pressing left then up in one tick kills you instantly for no visible reason.',
        fix: 'Queue direction changes and validate each against the direction actually applied last tick, not against the queued one. Reject only the exact opposite.',
      },
      {
        id: 'speed-by-frame',
        symptom: 'The snake is unplayably fast on a good monitor.',
        fix: 'Accumulate elapsed milliseconds and step the simulation when the accumulator passes the tick interval. Never move one cell per animation frame.',
      },
      {
        id: 'food-under-snake',
        symptom: 'Food appears somewhere unreachable or invisible.',
        fix: 'Build the list of free cells and pick from it, rather than picking at random and re-rolling.',
      },
    ],
    tuning: [
      'Grid 22×22. Cell size = canvas size / 22, canvas square and sized to min(viewport width - 32, 560).',
      'Tick 130 ms at the start, minus 4 ms per food eaten, floor 65 ms. That is roughly twice the starting speed at 16 apples — noticeable but survivable.',
      'Start length 4, in the middle, moving right, with the first food at least 5 cells away.',
      'Swipe threshold 24 px so a tap is not read as a swipe.',
    ],
    checks: ['game.loop', 'game.delta-time', 'game.touch-input', 'game.lose-state', 'game.restart', 'game.score', 'game.key-scroll'],
  },
  {
    id: 'breakout',
    label: 'Brick breaker',
    kind: 'game',
    family: 'arcade',
    triggers: ['breakout', 'brick breaker', 'brick game', 'arkanoid', 'block breaker', 'paddle and ball'],
    summary: 'A paddle bounces a ball into a wall of bricks until they are gone.',
    mustHave: [
      'Paddle control by mouse, touch drag and arrow keys, all three.',
      'Bricks in rows with distinct colours and a per-row score value.',
      'Lives, a win state when the last brick falls, and a loss when the last life is gone.',
      'Ball speed that rises slowly, with a hard cap.',
    ],
    pitfalls: [
      {
        id: 'flat-bounce',
        symptom: 'The ball ends up bouncing straight up and down forever and the game plays itself.',
        fix: 'Reflect off the paddle by contact point: the horizontal component comes from where on the paddle it hit, not from negating velocity. Clamp the resulting angle away from vertical and horizontal.',
      },
      {
        id: 'tunnelling',
        symptom: 'At speed the ball passes through bricks and walls.',
        fix: 'Step the ball in sub-steps no larger than half the ball radius per iteration, and resolve collisions each sub-step.',
      },
      {
        id: 'stuck-in-brick',
        symptom: 'The ball jitters inside a brick, destroying a column instantly.',
        fix: 'On a hit, push the ball out along the axis of least penetration before reversing that axis only.',
      },
    ],
    tuning: [
      'Field 640×480 logical units, scaled to fit. Paddle 110×14, so about 17% of the width — wide enough to be fair.',
      'Ball radius 7, launch speed 300 px/s at a random angle between 35° and 55° from horizontal, alternating left and right.',
      'Speed × 1.03 per row fully cleared, capped at 520 px/s.',
      'Bounce angle from paddle: offset = (ballX - paddleCentre) / (paddleWidth / 2), clamped to ±1, then angle = offset × 60°.',
      '5 rows × 9 bricks, top row worth 50 down to 10 for the bottom.',
    ],
    checks: ['game.loop', 'game.delta-time', 'game.touch-input', 'game.lose-state', 'game.restart', 'game.score', 'game.collision'],
  },
  {
    id: 'pong',
    label: 'Pong',
    kind: 'game',
    family: 'arcade',
    triggers: ['pong', 'table tennis game', 'ping pong game', 'two paddle game'],
    summary: 'Two paddles, one ball, first to a target score.',
    mustHave: [
      'A computer opponent that can be beaten, and an optional two-player mode on one keyboard.',
      'Serve from the centre towards whoever last conceded, after a short pause.',
      'Score display and a match end at 7 points.',
    ],
    pitfalls: [
      {
        id: 'unbeatable-ai',
        symptom: 'The computer paddle tracks the ball perfectly and the game is pointless.',
        fix: 'Cap the AI paddle speed below the ball\'s maximum vertical speed and only let it track once the ball is travelling towards it. Add a small aim error that grows with rally length.',
      },
      {
        id: 'no-english',
        symptom: 'Every rally is identical because the ball always leaves at the same angle.',
        fix: 'Vary the exit angle by contact point on the paddle, exactly as in brick breaker.',
      },
    ],
    tuning: [
      'Field 720×440. Paddles 12×86, ball 9 square. Ball 340 px/s at serve, +4% per paddle hit, cap 620.',
      'AI paddle max speed 380 px/s with ±18 px of aim error, so a fast angled shot beats it.',
      'Serve delay 700 ms with a visible countdown.',
    ],
    checks: ['game.loop', 'game.delta-time', 'game.touch-input', 'game.restart', 'game.score', 'game.collision'],
  },
  {
    id: 'flappy',
    label: 'Tap-to-fly',
    kind: 'game',
    family: 'arcade',
    triggers: ['flappy', 'flappy bird', 'tap to fly', 'helicopter game', 'jetpack game'],
    summary: 'One-button flight through gaps in an endless scrolling wall.',
    mustHave: [
      'One input — tap, click and space all do the same thing.',
      'A "ready" state before the first pipe so the player is not killed while reading the screen.',
      'Score on passing a gap, persisted best, instant restart.',
    ],
    pitfalls: [
      {
        id: 'instant-death',
        symptom: 'The first obstacle arrives before the player has understood the controls.',
        fix: 'Do not start scrolling until the first input, and place the first gap at x = width + 200.',
      },
      {
        id: 'impossible-gap',
        symptom: 'Consecutive gaps are at opposite extremes, so no flight path connects them.',
        fix: 'Clamp each gap centre to within 140 px of the previous one.',
      },
    ],
    tuning: [
      'Field 400×600. Gap 155 px tall — that is 26% of the height, forgiving but not trivial.',
      'Gravity 1500 px/s², flap impulse -430 px/s, terminal fall 700 px/s.',
      'Scroll 150 px/s, pipes every 230 px of distance, so roughly 1.5 s between them.',
      'Player hit box 70% of the drawn sprite, so near misses read as misses.',
    ],
    checks: ['game.loop', 'game.delta-time', 'game.touch-input', 'game.lose-state', 'game.restart', 'game.score', 'game.spawn-offscreen'],
  },
  {
    id: 'runner',
    label: 'Endless runner',
    kind: 'game',
    family: 'arcade',
    triggers: ['endless runner', 'runner game', 'dino game', 'jumping game', 'obstacle game', 'dodge game'],
    summary: 'Automatic forward movement, obstacles to jump or duck, distance as score.',
    mustHave: [
      'Jump with a variable height by hold length, and a duck.',
      'Ground, parallax background, and a run cycle or at least a squash on landing.',
      'Distance score, speed that climbs, high score kept.',
    ],
    pitfalls: [
      {
        id: 'unjumpable-gap',
        symptom: 'Two obstacles so close together that no jump clears both.',
        fix: 'Compute the jump arc length from the physics constants and enforce a minimum spacing of 1.6× that. Do not pick spacing by feel.',
      },
      {
        id: 'spawn-on-player',
        symptom: 'Obstacles appear already next to the player.',
        fix: 'Spawn at x = width + 40 only. Never inside the visible field.',
      },
      {
        id: 'floaty-jump',
        symptom: 'The jump feels like the moon.',
        fix: 'Use a higher gravity on the way down than the way up (about 1.7×). It is not physical and it feels far better.',
      },
    ],
    tuning: [
      'Ground at 78% of height. Gravity 2200 px/s² rising, 3700 falling. Jump impulse -760 px/s → about 0.62 s airborne, 165 px of clearance.',
      'Start speed 300 px/s, +6 px/s per second, cap 720. At 300 px/s an obstacle spawned off the right edge of an 800 px field is visible for 2.8 s.',
      'Minimum obstacle spacing = speed × 0.75 s, never less than 190 px.',
    ],
    checks: ['game.loop', 'game.delta-time', 'game.touch-input', 'game.lose-state', 'game.restart', 'game.score', 'game.spawn-offscreen', 'game.difficulty'],
  },
  {
    id: 'shooter',
    label: 'Space shooter',
    kind: 'game',
    family: 'arcade',
    triggers: ['space invaders', 'shooter', 'shoot em up', 'spaceship game', 'asteroids', 'galaga', 'alien game'],
    summary: 'Move, shoot, survive waves coming from the far edge.',
    mustHave: [
      'Movement by keyboard and by dragging a finger, with firing automatic on touch.',
      'Enemy waves that get harder, an explosion effect, lives or shields.',
      'Bullet pooling rather than unbounded array growth.',
    ],
    pitfalls: [
      {
        id: 'spawn-inside-view',
        symptom: 'Enemies appear in the middle of the screen already on top of the player.',
        fix: 'Spawn above y = -60 and let them travel in. The player must see them coming for at least two seconds.',
      },
      {
        id: 'bullet-hose',
        symptom: 'Holding fire fills the screen and removes all difficulty.',
        fix: 'Cooldown between shots and a cap on simultaneous player bullets.',
      },
      {
        id: 'unfair-hitbox',
        symptom: 'Deaths that look like near misses.',
        fix: 'Player collision radius at 55–65% of the drawn ship; enemy radius at 100%. Generous to the player, honest to the enemy.',
      },
    ],
    tuning: [
      'Field 480×720. Player 34 px wide, hit radius 11. Bullets 620 px/s, cooldown 170 ms, max 6 alive.',
      'Enemies enter at y = -50 at 90 px/s: 8 s to cross a 720 px field. Wave size 4 + wave, speed +8% per wave, cap 260 px/s.',
      'Three lives, 1.2 s of invulnerability after a hit with the ship flashing.',
    ],
    checks: ['game.loop', 'game.delta-time', 'game.touch-input', 'game.lose-state', 'game.restart', 'game.score', 'game.spawn-offscreen', 'game.difficulty'],
  },
  {
    id: 'rhythm',
    label: 'Rhythm game',
    kind: 'game',
    family: 'arcade',
    triggers: ['rhythm game', 'dance game', 'ddr', 'guitar hero', 'beat game', 'music game', 'tap to the beat', 'dance revolution'],
    summary: 'Notes fall towards a fixed hit line and are struck in time with the music.',
    mustHave: [
      'Notes that spawn OFF SCREEN and travel to the hit line, giving the player time to react.',
      'Timing windows with named judgements, a combo counter and an accuracy percentage.',
      'Lane keys, and a tappable lane target for touch.',
      'A chart — an actual list of note times — not random spawning.',
    ],
    pitfalls: [
      {
        id: 'spawn-at-hitline',
        symptom: 'Notes appear already on the hit line, so the game is pure luck. This is the single most common way a rhythm game is broken.',
        fix: 'A note is scheduled by the time it must be HIT. Spawn it travelTime seconds earlier at the top of the field: spawnTime = hitTime - travelTime. Its y position is derived from (now - spawnTime), so it arrives exactly on the beat. Never create a note at the hit line under any circumstance.',
      },
      {
        id: 'audio-drift',
        symptom: 'The notes and the music separate after twenty seconds.',
        fix: 'Drive the whole thing from the audio clock (AudioContext.currentTime), not from a frame counter or accumulated deltas.',
      },
      {
        id: 'no-miss',
        symptom: 'Everything is a hit, or nothing is.',
        fix: 'Judge on absolute time difference to the note\'s hit time, in milliseconds. A note past the late window is a miss and is removed.',
      },
    ],
    tuning: [
      'Field 420×640. Hit line at y = 540. Notes spawn at y = -40, so 580 px of travel.',
      'Travel time 1.6 s → note speed 362 px/s. That is the reaction time; do not go below 1.2 s.',
      'Windows: perfect ±55 ms, great ±95 ms, good ±140 ms, anything later is a miss.',
      '4 lanes on keys D F J K, each lane also a touch target the full width of the lane.',
      'Chart at 120 BPM = 500 ms per beat. Start the first note 3 s in, so the player sees the field before it fills.',
    ],
    checks: ['game.loop', 'game.touch-input', 'game.score', 'game.restart', 'game.spawn-offscreen', 'game.audio-unlock'],
  },
  {
    id: 'platformer',
    label: 'Platformer',
    kind: 'game',
    family: 'arcade',
    triggers: ['platformer', 'mario style', 'jump and run', 'side scroller', 'platform game'],
    summary: 'Run and jump across solid ground towards a goal.',
    mustHave: [
      'Solid collision resolved on each axis separately, so you never stick to a wall.',
      'A camera that follows with a dead zone, not glued to the player.',
      'Coins or a goal, a death and respawn, and on-screen controls for touch.',
    ],
    pitfalls: [
      {
        id: 'corner-snag',
        symptom: 'Running along flat ground catches on the seam between two tiles.',
        fix: 'Move and resolve the X axis fully, then the Y axis fully. Never resolve a diagonal in one step.',
      },
      {
        id: 'no-coyote',
        symptom: 'Jumps feel like they do not register at ledges.',
        fix: 'Coyote time of 100 ms after leaving ground, and a jump buffer of 120 ms before landing. Both are invisible and both are why good platformers feel good.',
      },
    ],
    tuning: [
      'Tile 32 px. Gravity 2400 px/s², jump -720 px/s → 96 px of clearance, three tiles.',
      'Run 260 px/s with 1800 px/s² acceleration and 2600 deceleration.',
      'Camera dead zone 160 px wide, lerp 8% per frame at 60 fps.',
    ],
    checks: ['game.loop', 'game.delta-time', 'game.touch-input', 'game.lose-state', 'game.restart', 'game.collision'],
  },
  {
    id: 'maze',
    label: 'Maze',
    kind: 'game',
    family: 'board',
    triggers: ['maze game', 'maze', 'labyrinth'],
    summary: 'A generated maze with a start, an exit and something to collect.',
    mustHave: [
      'A generated maze that is guaranteed solvable, not a random wall soup.',
      'A visible player, a goal, a move counter or timer, and a new-maze button.',
      'Arrow keys, WASD and swipe.',
    ],
    pitfalls: [
      {
        id: 'unsolvable',
        symptom: 'The exit is walled off.',
        fix: 'Generate with a spanning-tree algorithm (recursive backtracker or Prim) so every cell is reachable by construction. Never place walls at random.',
      },
      {
        id: 'stack-overflow',
        symptom: 'Big mazes crash the tab.',
        fix: 'Write the backtracker with an explicit stack array, not recursion.',
      },
    ],
    tuning: [
      '15×15 cells for the first level, growing by 2 each level to a cap of 31.',
      'Cell size derived from the canvas so the maze always fits: cell = floor(min(width, height) / cells).',
      'Walls 2 px, drawn as lines between cells rather than as filled blocks — it reads much better.',
    ],
    checks: ['game.loop', 'game.touch-input', 'game.restart', 'game.key-scroll'],
  },
  {
    id: 'tetris',
    label: 'Falling blocks',
    kind: 'game',
    family: 'board',
    triggers: ['tetris', 'falling blocks', 'block stacking game', 'tetromino'],
    summary: 'Rotate and drop falling shapes to complete lines.',
    mustHave: [
      'All seven tetrominoes, rotation with wall kicks, a next-piece preview and a hold slot.',
      'Line clear with a flash, scoring by lines cleared at once, and a level that raises gravity.',
      'Touch: swipe to move, tap to rotate, swipe down to drop.',
    ],
    pitfalls: [
      {
        id: 'rotate-into-wall',
        symptom: 'Rotation next to a wall does nothing, which feels broken.',
        fix: 'Try the rotation, then try it offset by -1, +1, -2, +2 columns. Accept the first that fits.',
      },
      {
        id: 'instant-lock',
        symptom: 'A piece locks the moment it touches, removing all last-second placement.',
        fix: 'Lock delay of 500 ms, reset on a successful move, capped at 15 resets.',
      },
    ],
    tuning: [
      'Board 10×20. Gravity 1000 ms per row at level 1, × 0.8 per level, floor 80 ms.',
      'Scoring 100 / 300 / 500 / 800 for one to four lines, × level. Level up every 10 lines.',
      'Key repeat: 170 ms before repeat starts, then every 50 ms.',
    ],
    checks: ['game.loop', 'game.touch-input', 'game.lose-state', 'game.restart', 'game.score', 'game.key-scroll'],
  },
  {
    id: '2048',
    label: 'Sliding numbers',
    kind: 'game',
    family: 'board',
    triggers: ['2048', 'sliding tiles', 'merge game', 'number merge'],
    summary: 'Slide a grid of numbers together to merge them into larger ones.',
    mustHave: [
      'Slide and merge in four directions, with a new tile only when the board changed.',
      'Score, best score kept, undo of one move, and a game-over test that checks for possible merges as well as empty cells.',
      'Swipe and arrow keys.',
    ],
    pitfalls: [
      {
        id: 'double-merge',
        symptom: '2 2 4 slides into 8 in one move.',
        fix: 'Mark a tile as merged this move and refuse to merge it again until the next move.',
      },
      {
        id: 'phantom-spawn',
        symptom: 'A new tile appears after a move that did nothing.',
        fix: 'Compare the board before and after; only spawn when something actually moved or merged.',
      },
    ],
    tuning: [
      '4×4 grid, new tiles 90% "2" and 10% "4", two tiles to start.',
      'Slide animation 110 ms, merge pop 90 ms — fast enough to keep up with quick input.',
      'Tile colours should step in lightness with the value, and the text must flip to the light ink above 8 or it becomes unreadable.',
    ],
    checks: ['game.touch-input', 'game.lose-state', 'game.restart', 'game.score', 'game.key-scroll'],
  },
  {
    id: 'memory',
    label: 'Memory match',
    kind: 'game',
    family: 'board',
    triggers: ['memory game', 'matching game', 'concentration game', 'card match', 'pairs game'],
    summary: 'Flip cards two at a time to find matching pairs.',
    mustHave: [
      'A shuffled board with an even number of cards, a flip animation, a move counter and a timer.',
      'Difficulty choice that changes the grid size.',
      'A win screen with the score.',
    ],
    pitfalls: [
      {
        id: 'flip-spam',
        symptom: 'Clicking fast reveals the whole board.',
        fix: 'Lock input while two cards are face up and while the flip-back timer is running.',
      },
      {
        id: 'same-card-twice',
        symptom: 'Clicking one card twice counts as a pair.',
        fix: 'Ignore a click on a card that is already face up or already matched.',
      },
    ],
    tuning: [
      'Default 4×4, that is 8 pairs. Easy 4×3, hard 6×5.',
      'Flip animation 250 ms, mismatch stays visible for 700 ms before flipping back — long enough to memorise.',
      'Grid uses CSS grid with aspect-ratio: 1 on the cards, so it stays square at any width.',
    ],
    // No game.score: in a memory game the score is the move count and the
    // clock, and demanding a variable called "score" would be pedantry.
    checks: ['game.restart', 'app.escape-output'],
  },
  {
    id: 'tictactoe',
    label: 'Tic-tac-toe',
    kind: 'game',
    family: 'board',
    triggers: ['tic tac toe', 'tictactoe', 'noughts and crosses', 'xs and os', 'three in a row'],
    summary: 'Three in a row, against a person or the computer.',
    mustHave: [
      'A computer opponent with at least two difficulties, one of which is unbeatable (minimax on nine cells is trivial and instant).',
      'A drawn winning line, a draw state, and a running tally across games.',
    ],
    pitfalls: [
      {
        id: 'no-draw-state',
        symptom: 'A full board with no winner leaves the game hanging.',
        fix: 'Check for a full board after checking for a win, and declare a draw.',
      },
      {
        id: 'ai-plays-taken',
        symptom: 'The computer plays into an occupied square or freezes.',
        fix: 'Enumerate the empty cells and choose from that list only.',
      },
    ],
    tuning: [
      'Easy plays randomly with a 60% chance of taking a winning or blocking move; hard runs full minimax and cannot lose.',
      'Computer replies after 300 ms so the move is visible rather than instantaneous.',
    ],
    checks: ['game.restart', 'app.escape-output'],
  },
  {
    id: 'minesweeper',
    label: 'Minesweeper',
    kind: 'game',
    family: 'board',
    triggers: ['minesweeper', 'mine sweeper', 'bomb grid game'],
    summary: 'Reveal a grid without hitting a mine, using the numbers as clues.',
    mustHave: [
      'First click always safe, flags, a mine counter and a timer, and chording on a satisfied number.',
      'Long-press to flag on touch, right-click on desktop.',
    ],
    pitfalls: [
      {
        id: 'first-click-death',
        symptom: 'Losing on the very first click.',
        fix: 'Place the mines after the first click, excluding that cell and its eight neighbours.',
      },
      {
        id: 'recursive-flood',
        symptom: 'Revealing a large empty region freezes or crashes.',
        fix: 'Flood fill with an explicit queue, not recursion.',
      },
    ],
    tuning: [
      'Beginner 9×9 with 10 mines, intermediate 16×16 with 40, expert 24×16 with 99. These ratios are the standard ones and they are well balanced.',
      'Long-press threshold 400 ms, with the cell highlighting at 200 ms so the gesture is discoverable.',
      'Number colours: the classic 1 blue, 2 green, 3 red, 4 navy, 5 maroon, 6 teal, 7 black, 8 grey — recognisable and each distinct.',
    ],
    checks: ['game.lose-state', 'game.restart', 'game.touch-input'],
  },
  {
    id: 'quiz',
    label: 'Quiz',
    kind: 'game',
    family: 'crud',
    triggers: ['quiz', 'trivia', 'multiple choice', 'test your knowledge', 'quiz game'],
    summary: 'Multiple choice questions with scoring and a result at the end.',
    mustHave: [
      'A real question bank with at least 10 well-written questions on the subject, and correct answers that are actually correct.',
      'Shuffled questions and shuffled answers, immediate feedback, a progress indicator and a final score with a breakdown.',
      'Keyboard number keys as well as clicking.',
    ],
    pitfalls: [
      {
        id: 'shuffle-index-bug',
        symptom: 'The wrong answer is marked correct after shuffling.',
        fix: 'Store the correct answer as a value or an object reference, and shuffle the option objects. Never shuffle strings while keeping a numeric correct index.',
      },
      {
        id: 'double-answer',
        symptom: 'Clicking twice adds two points.',
        fix: 'Disable the options as soon as one is chosen.',
      },
    ],
    tuning: [
      '10 questions per round, 4 options each. Feedback for 900 ms before advancing, or advance on a click.',
      'Show the correct answer when the player is wrong — a quiz that only says "wrong" teaches nothing.',
    ],
    checks: ['app.escape-output', 'game.restart', 'game.score'],
  },
  {
    id: 'typing',
    label: 'Typing test',
    kind: 'game',
    family: 'utility',
    triggers: ['typing test', 'typing game', 'wpm test', 'typing speed'],
    summary: 'Type a passage against the clock and get words per minute and accuracy.',
    mustHave: [
      'A live view of the passage with the current character highlighted, correct characters in one colour and mistakes in another.',
      'WPM and accuracy updating live, a fixed test duration, and a results screen.',
    ],
    pitfalls: [
      {
        id: 'wrong-wpm',
        symptom: 'The WPM number is nonsense.',
        fix: 'WPM = (correct characters / 5) / minutes elapsed. The "word" is five characters by definition; do not count actual words.',
      },
      {
        id: 'input-focus-lost',
        symptom: 'Typing stops registering after clicking anywhere.',
        fix: 'Keep a hidden input focused, or listen on the document for keydown and preventDefault on space so the page does not scroll.',
      },
    ],
    tuning: [
      '60 second test by default, with 15 and 30 as options. Passage of at least 400 characters so nobody runs out.',
      'Accuracy = correct keystrokes / total keystrokes, counted as they happen — backspacing should not erase the record of a mistake.',
    ],
    checks: ['game.restart', 'game.score', 'app.escape-output'],
  },
  {
    id: 'clicker',
    label: 'Idle clicker',
    kind: 'game',
    family: 'crud',
    triggers: ['clicker game', 'idle game', 'incremental game', 'cookie clicker'],
    summary: 'Click to earn, buy upgrades that earn for you, watch the number rise.',
    mustHave: [
      'A click reward, at least five upgrades with rising costs, and automatic income per second.',
      'A save to localStorage, a readable number format, and a floating "+n" on each click.',
    ],
    pitfalls: [
      {
        id: 'unreadable-numbers',
        symptom: 'The counter becomes 1.2345678901e+21.',
        fix: 'Format with suffixes — K, M, B, T — from about 10,000 upwards, to one decimal place.',
      },
      {
        id: 'cost-curve-flat',
        symptom: 'Everything is affordable at once and there is no game.',
        fix: 'Cost = base × 1.15^owned. That exponent is the standard for a reason: it keeps every upgrade about 30 seconds away.',
      },
    ],
    tuning: [
      'Base click 1. First upgrade costs 15 and gives 0.1/s. Each subsequent upgrade roughly 8× the cost and 8× the output of the last.',
      'Tick income at 10 Hz using elapsed time, so a background tab does not lose progress.',
      'Autosave every 5 s and on visibilitychange.',
    ],
    checks: ['app.persist', 'app.escape-output', 'game.score'],
  },
  {
    id: 'wordguess',
    label: 'Word guess',
    kind: 'game',
    family: 'board',
    triggers: ['wordle', 'word guess', 'hangman', 'word game', 'guess the word'],
    summary: 'Guess a hidden word from letter feedback.',
    mustHave: [
      'A real word list, an on-screen keyboard that tracks letter states, and six attempts.',
      'A share-able result grid and a "new word" button.',
    ],
    pitfalls: [
      {
        id: 'double-letter-marking',
        symptom: 'Guessing SPEED against ERASE marks both E positions yellow when only one E remains.',
        fix: 'Two passes. First mark exact matches green and consume those letters from a pool. Then, for the rest, mark yellow only if the letter is still in the pool, consuming it. This is the bug every implementation has.',
      },
      {
        id: 'accepts-nonsense',
        symptom: 'Any five characters are accepted as a guess.',
        fix: 'Validate against the word list and shake the row on an invalid guess.',
      },
    ],
    tuning: [
      'Five letters, six guesses. Reveal animation 300 ms per tile staggered by 120 ms.',
      'Keyboard letter state priority: green beats yellow beats grey — never downgrade a letter already known green.',
    ],
    checks: ['game.restart', 'app.escape-output', 'game.touch-input'],
  },
  {
    id: 'towerdefense',
    label: 'Tower defence',
    kind: 'game',
    family: 'arcade',
    triggers: ['tower defense', 'tower defence', 'td game', 'defend the base'],
    summary: 'Place towers along a path to stop waves of enemies.',
    mustHave: [
      'A fixed path drawn on the map, towers placed only off-path, and a build cost with income from kills.',
      'Range shown while placing, waves with a countdown, lives lost when an enemy reaches the end.',
    ],
    pitfalls: [
      {
        id: 'path-following',
        symptom: 'Enemies drift off the path or stutter at corners.',
        fix: 'Move along waypoints by distance travelled: advance the remaining step distance into the next segment rather than snapping to the waypoint.',
      },
      {
        id: 'no-economy',
        symptom: 'Either you can afford everything immediately or nothing ever.',
        fix: 'Start with exactly two towers\' worth of money and pay about 40% of a tower per wave cleared.',
      },
    ],
    tuning: [
      'Wave n has 5 + 2n enemies with 20 × 1.18^n health, spawned 700 ms apart, 6 s between waves.',
      'Basic tower: cost 50, range 110 px, 1 shot per 700 ms, 12 damage. That kills a wave-1 enemy in two shots.',
      '20 lives. Enemy speed 55 px/s, +3% per wave.',
    ],
    checks: ['game.loop', 'game.delta-time', 'game.lose-state', 'game.restart', 'game.score'],
  },
  {
    id: 'simon',
    label: 'Sequence memory',
    kind: 'game',
    family: 'board',
    triggers: ['simon says', 'simon game', 'sequence game', 'memory sequence'],
    summary: 'Repeat a growing sequence of lights and sounds.',
    mustHave: [
      'Four pads that light and play a distinct tone, a growing sequence, and a strike-out on a wrong press.',
      'Input locked during playback.',
    ],
    pitfalls: [
      {
        id: 'input-during-playback',
        symptom: 'Pressing during the demonstration registers as an answer.',
        fix: 'A boolean gate around the playback, released only after the last pad goes dark.',
      },
      {
        id: 'silent-audio',
        symptom: 'No sound until the second game.',
        fix: 'Create or resume the AudioContext inside the first user gesture — browsers block it otherwise.',
      },
    ],
    tuning: [
      'Tones 329.63, 261.63, 220, 164.81 Hz — E4, C4, A3, E3, which are pleasant together rather than arbitrary.',
      'Playback 600 ms per step at level 1, dropping 25 ms per level to a floor of 320 ms. Gap of 120 ms between pads so repeats are distinguishable.',
    ],
    checks: ['game.restart', 'game.score', 'game.audio-unlock'],
  },

  /* ------------------------------------------------------------ apps */
  {
    id: 'todo',
    label: 'To-do list',
    kind: 'app',
    family: 'crud',
    triggers: ['todo', 'to do list', 'task list', 'task manager', 'checklist app', 'task app'],
    summary: 'Capture tasks, tick them off, keep them between visits.',
    mustHave: [
      'Add, complete, edit in place, delete, and a filter for all / active / done.',
      'Persistence to localStorage on every change, restored on load.',
      'A count of what is left, and a way to clear the completed ones.',
      'Empty state that says something useful rather than showing a blank box.',
    ],
    pitfalls: [
      {
        id: 'dom-as-state',
        symptom: 'Filtering loses tasks, or reordering duplicates them.',
        fix: 'Keep an array of objects as the only truth and re-render from it. Never read state back out of the DOM.',
      },
      {
        id: 'xss-title',
        symptom: 'A task called <img onerror=...> executes.',
        fix: 'Set task text with textContent. If you must build markup, escape &, <, > first.',
      },
      {
        id: 'lost-on-reload',
        symptom: 'Everything is gone after a refresh.',
        fix: 'Save on every mutation, not on a timer or on unload — unload does not reliably fire on mobile.',
      },
    ],
    tuning: [
      'Store as { id, text, done, createdAt }. Id from crypto.randomUUID() with a Date.now() fallback.',
      'Enter adds, Escape cancels an edit, and the input regains focus after adding so a list can be typed quickly.',
    ],
    checks: ['app.persist', 'app.escape-output', 'web.responsive'],
  },
  {
    id: 'notes',
    label: 'Notes',
    kind: 'app',
    family: 'crud',
    triggers: ['note app', 'notes app', 'notepad', 'journal app', 'diary app'],
    summary: 'Write and keep notes, find them again later.',
    mustHave: [
      'A list beside an editor, autosave, search across titles and bodies, and a delete with confirmation.',
      'The title derived from the first line if none is given.',
      'Word count and a last-edited time.',
    ],
    pitfalls: [
      {
        id: 'save-thrash',
        symptom: 'Typing is janky in a long note.',
        fix: 'Debounce the save by about 400 ms; do not write to storage on every keystroke.',
      },
      {
        id: 'lost-selection',
        symptom: 'The cursor jumps to the end while typing.',
        fix: 'Do not re-render the textarea from state while it is focused. Bind it once and read from it.',
      },
    ],
    tuning: [
      'Debounce 400 ms. Search filters as you type with no button. Sort by last edited, newest first.',
      'On a narrow screen the list and the editor become two views with a back button, not two squeezed columns.',
    ],
    checks: ['app.persist', 'app.escape-output', 'web.responsive'],
  },
  {
    id: 'calculator',
    label: 'Calculator',
    kind: 'app',
    family: 'utility',
    triggers: ['calculator', 'calc app', 'arithmetic app'],
    summary: 'Arithmetic with a keypad and a keyboard.',
    mustHave: [
      'Operator precedence, parentheses or at least chained operations, percent, sign flip, and a clear that distinguishes CE from C.',
      'Full keyboard support including Enter for equals and Escape for clear.',
      'A visible expression line above the result.',
    ],
    pitfalls: [
      {
        id: 'eval',
        symptom: 'Works until someone types something odd, then throws or worse.',
        fix: 'Write a small tokeniser and a precedence-climbing evaluator. It is about forty lines and it never has this class of bug. Do not call eval or new Function.',
      },
      {
        id: 'float-display',
        symptom: '0.1 + 0.2 shows 0.30000000000000004.',
        fix: 'Round the displayed result to 12 significant digits and strip trailing zeros.',
      },
      {
        id: 'divide-by-zero',
        symptom: 'Infinity appears in the display.',
        fix: 'Catch it and show "Cannot divide by zero", then reset on the next input.',
      },
    ],
    tuning: [
      'Buttons at least 44×44 px — the minimum comfortable touch target.',
      'Display font tabular and right-aligned, shrinking by steps once the number exceeds the width rather than overflowing.',
    ],
    checks: ['app.no-eval', 'web.responsive', 'app.escape-output'],
  },
  {
    id: 'timer',
    label: 'Timer / Pomodoro',
    kind: 'app',
    family: 'utility',
    triggers: ['pomodoro', 'focus timer', 'countdown timer', 'timer app', 'stopwatch', 'interval timer'],
    summary: 'Count down a work period, then a break, with a signal at each end.',
    mustHave: [
      'Start, pause, reset, and a configurable length.',
      'An audible end signal generated in the page, plus a visual one — sound alone fails on a muted phone.',
      'The remaining time in the document title so it is visible from another tab.',
    ],
    pitfalls: [
      {
        id: 'timer-drift',
        symptom: 'After twenty minutes the timer is a minute slow.',
        fix: 'Store the target timestamp and compute remaining = target - Date.now() on each tick. Never decrement a counter inside setInterval — background tabs throttle it to once a second or less.',
      },
      {
        id: 'audio-blocked',
        symptom: 'No sound when the timer ends.',
        fix: 'Create the AudioContext on the first Start click and resume() it there; a context created on page load is suspended.',
      },
    ],
    tuning: [
      'Pomodoro defaults: 25 minutes work, 5 short break, 15 long break after four rounds.',
      'Tick the display at 250 ms so the seconds never appear to skip.',
      'End signal: three 880 Hz beeps of 180 ms with 120 ms gaps, at 0.2 gain. Loud enough to notice, not enough to startle.',
    ],
    checks: ['app.timer-drift', 'app.persist', 'game.audio-unlock'],
  },
  {
    id: 'habit',
    label: 'Habit tracker',
    kind: 'app',
    family: 'crud',
    triggers: ['habit tracker', 'habit app', 'streak tracker', 'daily tracker'],
    summary: 'Mark habits done each day and watch the streak.',
    mustHave: [
      'A grid of the last several weeks per habit, a current and best streak, and add/remove habits.',
      'Today clearly marked, and a tap on any day to toggle it.',
    ],
    pitfalls: [
      {
        id: 'timezone-day',
        symptom: 'Days shift by one for some users, or a habit ticks itself at midnight UTC.',
        fix: 'Key days by local YYYY-MM-DD built from getFullYear/getMonth/getDate. Never use toISOString() for a local date.',
      },
      {
        id: 'streak-off-by-one',
        symptom: 'The streak resets even though today is ticked.',
        fix: 'Walk backwards from today; a missing today does not break the streak until tomorrow.',
      },
    ],
    tuning: [
      'Show 12 weeks. Cell 14 px with 3 px gaps, four intensity levels if the habit is countable.',
      'Store as { id, name, colour, days: { "2026-08-12": true } }.',
    ],
    checks: ['app.persist', 'app.escape-output', 'web.responsive'],
  },
  {
    id: 'budget',
    label: 'Budget / expenses',
    kind: 'app',
    family: 'crud',
    triggers: ['budget app', 'expense tracker', 'expense app', 'spending tracker', 'money tracker', 'finance app'],
    summary: 'Record what came in and what went out, and see where it went.',
    mustHave: [
      'Entries with amount, category, date and note; a running balance; totals by category with a chart.',
      'Filter by month, and an export to CSV.',
    ],
    pitfalls: [
      {
        id: 'float-money',
        symptom: 'Totals are out by a penny.',
        fix: 'Store money as integer cents and divide only when displaying. 0.1 + 0.2 is not 0.3 in binary floating point.',
      },
      {
        id: 'category-freetext',
        symptom: 'Twelve spellings of "groceries" in the report.',
        fix: 'A fixed category list plus an "add category" action, not a free text field.',
      },
    ],
    tuning: [
      'Currency formatted with Intl.NumberFormat and the browser locale.',
      'Category chart as a donut drawn in SVG — no library needed for eight slices, and it stays sharp at any size.',
    ],
    checks: ['app.money-float', 'app.persist', 'app.escape-output'],
  },
  {
    id: 'drawing',
    label: 'Drawing app',
    kind: 'app',
    family: 'canvas',
    triggers: ['drawing app', 'paint app', 'sketch app', 'whiteboard', 'canvas drawing'],
    summary: 'Draw with a pointer, choose colours and brush sizes, save the result.',
    mustHave: [
      'Pointer events so mouse, pen and touch all work with one code path.',
      'Colour, brush size, eraser, clear, undo, and download as PNG.',
      'Pressure support where the device reports it.',
    ],
    pitfalls: [
      {
        id: 'canvas-cleared-on-resize',
        symptom: 'The drawing vanishes when the window is resized or the phone rotates.',
        fix: 'Setting canvas.width or height clears it. Copy the bitmap out first, resize, then draw it back.',
      },
      {
        id: 'blurry-canvas',
        symptom: 'Lines look soft on a phone or a retina screen.',
        fix: 'Size the backing store to cssWidth × devicePixelRatio and scale the context by the same factor.',
      },
      {
        id: 'scroll-while-drawing',
        symptom: 'Drawing scrolls the page on a phone.',
        fix: 'touch-action: none on the canvas, and setPointerCapture on pointerdown.',
      },
    ],
    tuning: [
      'Undo as a stack of up to 20 ImageData snapshots — beyond that the memory cost is real.',
      'Line join and cap round, and interpolate between pointer samples with quadratic curves or fast strokes look like polygons.',
    ],
    checks: ['app.canvas-dpr', 'game.touch-input', 'web.responsive'],
  },
  {
    id: 'kanban',
    label: 'Kanban board',
    kind: 'app',
    family: 'crud',
    triggers: ['kanban', 'trello', 'board app', 'project board'],
    summary: 'Cards in columns, moved as work progresses.',
    mustHave: [
      'Columns with add-card, edit and delete, card counts, and persistence.',
      'Moving a card between columns by drag on desktop and by an explicit control on touch.',
    ],
    pitfalls: [
      {
        id: 'html5-dnd-on-touch',
        symptom: 'Dragging does nothing on a phone.',
        fix: 'HTML5 drag and drop does not fire on touch. Either implement dragging with pointer events and a ghost element, or provide a move button on each card. Do both if there is time.',
      },
      {
        id: 'drop-target-flicker',
        symptom: 'The drop zone flickers as the pointer moves over child elements.',
        fix: 'Count dragenter and dragleave rather than toggling on each event.',
      },
    ],
    tuning: [
      'Three columns to start: To do, Doing, Done. Columns scroll independently; the board scrolls horizontally on a phone with scroll-snap.',
      'Store { columns: [{ id, title, cards: [{ id, text }] }] }.',
    ],
    checks: ['app.persist', 'app.escape-output', 'web.responsive'],
  },
  {
    id: 'flashcards',
    label: 'Flashcards',
    kind: 'app',
    family: 'crud',
    triggers: ['flashcards', 'flash cards', 'study app', 'revision app', 'spaced repetition'],
    summary: 'Cards with a front and a back, reviewed until known.',
    mustHave: [
      'A deck editor, a review mode with a flip, and "knew it / did not" that affects what comes back.',
      'Progress through the deck and a session summary.',
    ],
    pitfalls: [
      {
        id: 'no-scheduling',
        symptom: 'The same cards cycle forever with no sense of progress.',
        fix: 'Even a simple box system beats none: a card answered correctly moves up a box and is seen less often; a wrong answer sends it back to box one.',
      },
    ],
    tuning: [
      'Five boxes, reviewed at intervals of 1, 2, 4, 8 and 16 sessions.',
      'Flip on click, space and swipe, with a 3D flip of 400 ms — this is one of the few places a flourish genuinely helps.',
    ],
    checks: ['app.persist', 'app.escape-output'],
  },
  {
    id: 'converter',
    label: 'Unit converter',
    kind: 'app',
    family: 'utility',
    triggers: ['unit converter', 'converter app', 'conversion tool', 'metric converter', 'currency converter'],
    summary: 'Convert between units in a category, both directions, live.',
    mustHave: [
      'Several categories, conversion as you type in either field, and a swap button.',
      'Correct factors — verify them; a converter that is wrong is worse than none.',
    ],
    pitfalls: [
      {
        id: 'offset-units',
        symptom: 'Celsius to Fahrenheit is wrong.',
        fix: 'Temperature is affine, not a simple ratio. Convert to a base with an offset and a factor: value → base then base → target. Do not use one multiplier table for everything.',
      },
      {
        id: 'both-fields-fight',
        symptom: 'Typing in one field rewrites what you are typing.',
        fix: 'Only write to the field that is not focused.',
      },
    ],
    tuning: [
      'Length, mass, temperature, volume, area, speed, data and time cover almost every request.',
      'Show up to 6 significant digits and strip trailing zeros; nobody wants 25.400000000000002 mm.',
    ],
    checks: ['app.no-eval', 'web.responsive'],
  },
  {
    id: 'musicplayer',
    label: 'Music player',
    kind: 'app',
    family: 'crud',
    triggers: ['music player', 'audio player', 'mp3 player', 'playlist app', 'podcast player'],
    summary: 'A playlist, transport controls and a progress bar.',
    mustHave: [
      'Play / pause / next / previous, a seek bar that can be dragged, volume, and the current time and duration.',
      'Files added by the user through a file input or drag and drop — there is no library of music to ship.',
      'Keyboard: space to play or pause, arrows to seek.',
    ],
    pitfalls: [
      {
        id: 'seek-fights-playback',
        symptom: 'The scrubber jumps back while dragging.',
        fix: 'Stop updating the bar from timeupdate while the user is dragging it.',
      },
      {
        id: 'objecturl-leak',
        symptom: 'Memory grows with every file loaded.',
        fix: 'revokeObjectURL when a track is removed or replaced.',
      },
    ],
    tuning: [
      'Visualise with an AnalyserNode at fftSize 256 — 128 bars is plenty and it is cheap.',
      'Show duration as m:ss, and handle NaN duration before metadata loads.',
    ],
    checks: ['game.audio-unlock', 'web.responsive'],
  },
  {
    id: 'markdown',
    label: 'Markdown editor',
    kind: 'app',
    family: 'utility',
    triggers: ['markdown editor', 'markdown preview', 'md editor', 'text editor with preview'],
    summary: 'Write markdown on the left, see it rendered on the right.',
    mustHave: [
      'Headings, bold, italic, links, lists, code blocks, inline code, quotes and rules at minimum.',
      'Synchronised scrolling, a word count, autosave and a copy-as-HTML action.',
    ],
    pitfalls: [
      {
        id: 'xss-in-preview',
        symptom: 'Typing a script tag runs it.',
        fix: 'Escape &, <, > on the raw text BEFORE applying any markdown transforms. Every transform then produces only markup you generated.',
      },
      {
        id: 'greedy-regex',
        symptom: 'Two separate bold spans merge into one.',
        fix: 'Non-greedy quantifiers, and process code spans first so their contents are protected from other rules.',
      },
    ],
    tuning: [
      'Two panes above 780 px, tabs below it.',
      'Debounce the render by 120 ms — fast enough to feel live, slow enough not to re-parse on every keystroke.',
    ],
    checks: ['app.escape-output', 'app.persist', 'web.responsive'],
  },
  {
    id: 'weather',
    label: 'Weather',
    kind: 'app',
    family: 'crud',
    triggers: ['weather app', 'forecast app', 'weather dashboard'],
    summary: 'Current conditions and a forecast for a place.',
    mustHave: [
      'A real API if one is available without a key — Open-Meteo needs none — with a clear offline or failed state.',
      'Search by city, the current conditions large, and a multi-day forecast.',
      'A loading state and an error state that says what went wrong.',
    ],
    pitfalls: [
      {
        id: 'key-required',
        symptom: 'The app is dead because the user has no API key.',
        fix: 'Prefer api.open-meteo.com, which is free, keyless and CORS-enabled. Geocode with its companion geocoding endpoint.',
      },
      {
        id: 'no-failure-path',
        symptom: 'A blank screen when the network is down.',
        fix: 'Catch, show the last cached result with its timestamp, and say plainly that it is stale.',
      },
    ],
    tuning: [
      'Cache the last successful response in localStorage with a fetched-at time.',
      'Map weather codes to icons drawn as inline SVG rather than fetching images.',
    ],
    checks: ['web.responsive', 'app.escape-output'],
  },
  {
    id: 'chatui',
    label: 'Chat interface',
    kind: 'app',
    family: 'crud',
    triggers: ['chat app', 'chat ui', 'chat interface', 'chat window', 'messaging app', 'chatbot ui', 'message board', 'chat'],
    summary: 'A conversation view with a composer.',
    mustHave: [
      'Messages with sender, time and status; a composer that grows with the text; auto-scroll to the newest.',
      'Enter sends, Shift+Enter makes a new line.',
      'A typing indicator and an empty state.',
    ],
    pitfalls: [
      {
        id: 'scroll-hijack',
        symptom: 'Reading history is impossible because it keeps jumping to the bottom.',
        fix: 'Only auto-scroll when the view was already within about 80 px of the bottom.',
      },
      {
        id: 'unescaped-message',
        symptom: 'A message containing markup breaks the layout.',
        fix: 'textContent for message bodies.',
      },
    ],
    tuning: [
      'Composer max height about 40% of the viewport, then it scrolls internally.',
      'Message max width 68ch so long lines stay readable.',
    ],
    checks: ['app.escape-output', 'web.responsive'],
  },
  {
    id: 'gallery',
    label: 'Image gallery',
    kind: 'app',
    family: 'crud',
    triggers: ['image gallery', 'photo gallery', 'lightbox', 'photo grid'],
    summary: 'A grid of images with a full-size view.',
    mustHave: [
      'A responsive grid, a lightbox with keyboard navigation and a close on Escape, and lazy loading.',
      'Alt text on every image.',
    ],
    pitfalls: [
      {
        id: 'layout-shift',
        symptom: 'The page jumps as images load.',
        fix: 'Give every image a width, a height and an aspect-ratio in CSS so the space is reserved.',
      },
      {
        id: 'lightbox-focus-trap',
        symptom: 'Tab moves behind the lightbox.',
        fix: 'Move focus into the dialog on open, trap it, and return it to the trigger on close.',
      },
    ],
    tuning: [
      'grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) handles every screen with one line.',
      'loading="lazy" and decoding="async" on every thumbnail.',
    ],
    checks: ['web.alt-text', 'web.responsive', 'html.missing-asset'],
  },

  /* ------------------------------------------------------------ sites */
  {
    id: 'landing',
    label: 'Landing page',
    kind: 'site',
    family: 'marketing',
    // No "website for" here: it is a two-word trigger, and it would outscore
    // the specific archetype in "website for my bakery".
    triggers: ['landing page', 'marketing page', 'product page', 'homepage', 'sales page', 'website'],
    summary: 'One page that explains an offer and asks for one action.',
    mustHave: [
      'A hero with a specific headline — what it is and who it is for, not a slogan — and one primary call to action above the fold.',
      'Real written sections: what it does, who it is for, proof, pricing or a close, and a footer.',
      'Written copy about the actual subject. Not lorem ipsum, not "Feature One".',
      'Responsive from 320 px up, with a working mobile navigation.',
    ],
    pitfalls: [
      {
        id: 'vague-hero',
        symptom: '"Empower your workflow" — nobody knows what it is.',
        fix: 'The headline names the thing and the outcome. "Invoices your clients actually pay on time" beats any abstraction.',
      },
      {
        id: 'cta-everywhere',
        symptom: 'Eight competing buttons.',
        fix: 'One primary action repeated, everything else visibly secondary.',
      },
      {
        id: 'contrast-fail',
        symptom: 'Grey text on a grey gradient.',
        fix: 'Body text at 4.5:1 minimum against its actual background, including over images — put a scrim behind text on a photo.',
      },
    ],
    tuning: [
      'Content column max 1120 px, text blocks max 68ch. Section padding 96 px desktop, 56 px mobile.',
      'Type scale 1.25 ratio from a 17 px base. One display face, one text face, no more.',
      'Hero above the fold at 900×700 — check that the headline, the sub and the button all fit there.',
    ],
    checks: ['content.placeholder', 'web.responsive', 'web.meta-description', 'html.missing-asset', 'web.contrast'],
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    kind: 'site',
    family: 'marketing',
    triggers: ['portfolio', 'personal site', 'personal website', 'my website', 'showcase site'],
    summary: 'Who someone is, what they have made, and how to reach them.',
    mustHave: [
      'An introduction with a real position statement, a project list with outcomes rather than just titles, and working contact links.',
      'Each project: what it is, what was done, what the result was.',
    ],
    pitfalls: [
      {
        id: 'projects-without-outcome',
        symptom: 'A list of nouns nobody can evaluate.',
        fix: 'One line per project on the problem, one on the approach, one on the result.',
      },
      {
        id: 'dead-contact',
        symptom: 'A contact form that goes nowhere.',
        fix: 'Use a mailto: link with a subject, or say plainly where to reach them. Do not fake a submit.',
      },
    ],
    tuning: [
      'Long-form single column at 640–720 px reads better than a card grid for a personal site.',
      'Include a print stylesheet — people do print these.',
    ],
    checks: ['content.placeholder', 'web.responsive', 'html.missing-asset'],
  },
  {
    id: 'restaurant',
    label: 'Restaurant / local business',
    kind: 'site',
    family: 'marketing',
    triggers: ['restaurant website', 'cafe website', 'bakery website', 'salon website', 'menu page', 'local business site', 'restaurant', 'bakery', 'cafe', 'coffee shop', 'salon', 'barber', 'diner', 'pizzeria', 'takeaway'],
    summary: 'A local business page: what they serve, where they are, when they are open.',
    mustHave: [
      'Hours, address, phone as a tel: link, and a map link — these are what people actually come for.',
      'A real menu or service list with prices, in sections.',
      'Photos or, if none exist, a strong typographic treatment instead of grey boxes.',
    ],
    pitfalls: [
      {
        id: 'missing-basics',
        symptom: 'A beautiful page with no address or opening hours.',
        fix: 'Put the practical details in the header or immediately below the hero, and repeat them in the footer.',
      },
    ],
    tuning: [
      'tel: and mailto: links, and an https://maps.google.com/?q=<address> link rather than an embedded map that needs a key.',
      'Menu as a definition list with a leader line, not a table — it works at every width.',
    ],
    checks: ['content.placeholder', 'web.responsive', 'html.missing-asset'],
  },
  {
    id: 'resume',
    label: 'Résumé / CV',
    kind: 'site',
    family: 'marketing',
    triggers: ['resume', 'cv', 'curriculum vitae', 'resume site'],
    summary: 'A one-page professional history that prints well.',
    mustHave: [
      'Name, one-line summary, contact row, experience with dates and outcomes, skills, education.',
      'A print stylesheet that fits one page in A4 and Letter with no dark backgrounds.',
    ],
    pitfalls: [
      {
        id: 'print-breaks',
        symptom: 'Printing produces four pages with a section split in half.',
        fix: '@media print with page-break-inside: avoid on each entry, black on white, and hidden navigation.',
      },
    ],
    tuning: [
      'Body 11pt in print, 16px on screen. Margins 14 mm.',
      'Dates right-aligned in a two-column row that collapses to stacked below 560 px.',
    ],
    checks: ['content.placeholder', 'web.responsive', 'site.print'],
  },
  {
    id: 'blog',
    label: 'Blog',
    kind: 'site',
    family: 'marketing',
    triggers: ['blog', 'blog site', 'article site', 'writing site'],
    summary: 'An index of posts and a readable article page.',
    mustHave: [
      'An index with title, date and a real excerpt, and at least two complete example posts.',
      'Article typography that is genuinely comfortable: measure, leading, heading rhythm.',
    ],
    pitfalls: [
      {
        id: 'unreadable-measure',
        symptom: 'Lines running the full width of a desktop screen.',
        fix: 'max-width: 68ch on the article body. This single rule does more for readability than anything else.',
      },
    ],
    tuning: [
      'Body 18–19 px, line height 1.65, paragraph spacing 1.25em. Headings at 1.3 line height, more space above than below.',
      'Code blocks with a horizontal scroll rather than wrapping.',
    ],
    checks: ['content.placeholder', 'web.responsive', 'html.missing-asset'],
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    kind: 'viz',
    family: 'crud',
    triggers: ['dashboard', 'admin panel', 'analytics page', 'metrics page', 'stats page'],
    summary: 'Numbers and charts arranged so the state of something is legible at a glance.',
    mustHave: [
      'Headline figures with a comparison — a number with no baseline says nothing.',
      'At least two charts drawn from real-looking data, with axes, labels and units.',
      'A time range control that actually changes the data.',
    ],
    pitfalls: [
      {
        id: 'chart-without-units',
        symptom: 'A line going up, of what, nobody knows.',
        fix: 'Every axis labelled, every series named, units stated once.',
      },
      {
        id: 'cdn-chart-lib',
        symptom: 'A blank dashboard when the CDN is blocked or offline.',
        fix: 'Draw with inline SVG or canvas. A line chart and a bar chart are about sixty lines each and they never fail to load.',
      },
    ],
    tuning: [
      'Grid of cards at repeat(auto-fit, minmax(280px, 1fr)).',
      'Chart colours from the project palette, sequential for one series and categorical for many. Never a rainbow.',
      'Y axis from zero for bars; a truncated axis on a bar chart is a lie.',
    ],
    checks: ['web.responsive', 'viz.axis-labels', 'web.cdn-offline'],
  },
  {
    id: 'docs',
    label: 'Documentation site',
    kind: 'site',
    family: 'marketing',
    triggers: ['documentation site', 'docs site', 'api docs', 'reference site', 'wiki'],
    summary: 'Navigable reference material.',
    mustHave: [
      'A sidebar of sections, in-page anchors, a search over headings, and code samples that can be copied.',
      'Real content for at least three pages or sections.',
    ],
    pitfalls: [
      {
        id: 'no-anchors',
        symptom: 'Nobody can link to a specific part.',
        fix: 'An id on every heading and a copy-link affordance.',
      },
    ],
    tuning: [
      'Sidebar 260 px, collapsing to a drawer below 900 px. Content 72ch.',
      'Highlight the current section with an IntersectionObserver on the headings.',
    ],
    checks: ['content.placeholder', 'web.responsive'],
  },
  {
    id: 'ecommerce',
    label: 'Shop front',
    kind: 'site',
    family: 'marketing',
    triggers: ['store', 'shop', 'ecommerce', 'e-commerce', 'online store', 'product listing', 'storefront'],
    summary: 'Products, a detail view and a basket.',
    mustHave: [
      'A product grid with price and image, a detail view, and a basket with quantities and a total.',
      'The basket persisted, and an empty-basket state.',
      'A checkout that is honest about being a demo rather than pretending to take a card.',
    ],
    pitfalls: [
      {
        id: 'fake-payment',
        symptom: 'A form that looks like it takes card details.',
        fix: 'Never build a fake card form. Stop at the basket and say a real checkout needs a payment provider.',
      },
      {
        id: 'money-float',
        symptom: 'The total is a penny out.',
        fix: 'Integer cents.',
      },
    ],
    tuning: [
      'At least 6 products with real names, real descriptions and plausible prices.',
      'Basket in localStorage, with the count on the header icon.',
    ],
    checks: ['app.money-float', 'app.persist', 'web.responsive', 'content.placeholder'],
  },
  {
    id: 'event',
    label: 'Event page',
    kind: 'site',
    family: 'marketing',
    triggers: ['event page', 'conference site', 'wedding website', 'party invite', 'meetup page'],
    summary: 'What is happening, when, where, and how to come.',
    mustHave: [
      'Date, time, place and an RSVP or ticket action, all above the fold.',
      'A schedule, directions, and an add-to-calendar link built as a data: .ics URL.',
    ],
    pitfalls: [
      {
        id: 'date-buried',
        symptom: 'The date is somewhere in paragraph three.',
        fix: 'Date and place in the hero, large, before anything else.',
      },
    ],
    tuning: [
      'Countdown driven from a fixed target timestamp, recomputed from Date.now() each second.',
      'The .ics as a data URL means add-to-calendar works with no backend.',
    ],
    checks: ['content.placeholder', 'web.responsive'],
  },

  /* ------------------------------------------------------------ generic */
  {
    id: 'generic-app',
    label: 'Web app',
    kind: 'app',
    family: 'crud',
    triggers: ['app', 'web app', 'tool', 'application'],
    summary: 'An interactive tool with state that survives a reload.',
    mustHave: [
      'A single clear purpose visible on first load, with an empty state that explains what to do.',
      'State persisted to localStorage.',
      'Keyboard support for the primary action.',
    ],
    pitfalls: [
      {
        id: 'no-empty-state',
        symptom: 'A blank rectangle on first visit.',
        fix: 'Every list needs an empty state saying what it will hold and how to add the first one.',
      },
    ],
    tuning: ['Content column 720–960 px. Controls at least 44 px tall.'],
    checks: ['app.persist', 'app.escape-output', 'web.responsive'],
  },
];

export const ARCHETYPES_BY_ID = new Map(ARCHETYPES.map((a) => [a.id, a]));

export function archetypeById(id: string): Archetype {
  return ARCHETYPES_BY_ID.get(id) ?? ARCHETYPES_BY_ID.get('generic-app')!;
}

/* ================================================================
   Guidance by kind — the things true of every game, every site…
   ================================================================ */

export const KIND_GUIDE: Record<string, string[]> = {
  game: [
    'Work out what the player does second by second before writing any code, and check that the numbers you chose allow it.',
    'Every simulation step is scaled by elapsed time. A game that moves a fixed amount per frame runs at double speed on a 120 Hz screen.',
    'Anything the player must react to enters from off screen. Compute how long it is visible before it matters and say the number.',
    'There must be a way to lose and a way to start again without reloading.',
    'Touch is not optional. Every keyboard control needs a pointer equivalent, and arrow keys and space must preventDefault so the page does not scroll.',
    'Sound must be created inside a user gesture, and there must be a mute.',
  ],
  app: [
    'State lives in one object that the view is rendered from. The DOM is never the source of truth.',
    'Anything the user creates survives a reload.',
    'Every list has an empty state; every destructive action is either confirmed or undoable.',
    'User text goes in with textContent. Never innerHTML.',
  ],
  site: [
    'Write the actual copy. Placeholder text is a failed build, not a draft.',
    'One page, one primary action. Everything else supports it.',
    'Check it at 320 px wide before calling it done.',
    'Semantic landmarks — header, nav, main, footer — and headings in order.',
  ],
  tool: [
    'The input is the interface. Put it first, focus it on load, and make Enter do the obvious thing.',
    'Show the result as it is typed rather than behind a button where you can.',
  ],
  viz: [
    'Every axis is labelled and every unit is stated. A chart without units is decoration.',
    'Draw with SVG or canvas rather than depending on a chart library from a CDN.',
    'Bars start at zero. Lines may not, but say so.',
  ],
  story: [
    'Branches must all resolve. No dead ends that leave the reader stuck.',
    'Keep a state object for what the reader has done, and let it affect what is available.',
  ],
};

/* ================================================================
   Features — the vocabulary the intent compiler recognises
   ================================================================ */

export interface FeatureDef {
  id: string;
  label: string;
  triggers: string[];
  /** What building it properly means. Included in the brief when detected. */
  note: string;
}

export const FEATURES: FeatureDef[] = [
  { id: 'score', label: 'scoring', triggers: ['score', 'points', 'scoring'], note: 'Score visible at all times, not only at the end.' },
  { id: 'highscore', label: 'high score', triggers: ['high score', 'highscore', 'best score', 'leaderboard', 'personal best'], note: 'Persist the best score in localStorage and show it beside the current one.' },
  { id: 'levels', label: 'levels', triggers: ['levels', 'stages', 'waves', 'rounds'], note: 'Each level must differ in a way the player can name, not just be faster.' },
  { id: 'sound', label: 'sound', triggers: ['sound', 'sfx', 'audio', 'sound effects', 'beep'], note: 'Generate effects with the Web Audio API rather than shipping files; create the context inside a user gesture and provide a mute.' },
  { id: 'music', label: 'music', triggers: ['music', 'soundtrack', 'background music', 'song'], note: 'Synthesise a simple loop with oscillators, or let the user supply a file. Never hotlink audio.' },
  { id: 'multiplayer-local', label: 'two players', triggers: ['two player', '2 player', 'multiplayer', 'versus', 'local multiplayer'], note: 'Two sets of controls on one keyboard, and a shared score line.' },
  { id: 'ai-opponent', label: 'computer opponent', triggers: ['against the computer', 'ai opponent', 'vs computer', 'bot'], note: 'Beatable at the easy setting, with a difficulty control.' },
  { id: 'difficulty', label: 'difficulty', triggers: ['difficulty', 'easy mode', 'hard mode', 'gets harder', 'progressive'], note: 'Difficulty changes something structural, and the current level is visible.' },
  { id: 'powerups', label: 'power-ups', triggers: ['power up', 'powerup', 'power-ups', 'bonus', 'pickups'], note: 'Timed, visibly indicated while active, and never stacking into an unloseable state.' },
  { id: 'lives', label: 'lives', triggers: ['lives', 'hearts', 'health'], note: 'Shown as icons, with brief invulnerability after a hit.' },
  { id: 'timer', label: 'timer', triggers: ['timer', 'countdown', 'time limit', 'against the clock'], note: 'Driven from timestamps, never from a decrementing interval counter.' },
  { id: 'pause', label: 'pause', triggers: ['pause', 'pausing'], note: 'Escape and a button, with the loop actually stopping and time not accruing.' },
  { id: 'darkmode', label: 'dark mode', triggers: ['dark mode', 'light mode', 'theme toggle', 'dark theme'], note: 'A toggle that persists, defaulting to prefers-color-scheme.' },
  { id: 'save', label: 'saved data', triggers: ['save', 'saves', 'persist', 'remember', 'keeps'], note: 'localStorage, written on every change and read on load, with a version key.' },
  { id: 'export', label: 'export', triggers: ['export', 'download', 'csv', 'save as file'], note: 'Build a Blob and an object URL; revoke it after the click.' },
  { id: 'import', label: 'import', triggers: ['import', 'upload', 'load a file'], note: 'A file input plus a drop zone, with validation and a clear error.' },
  { id: 'search', label: 'search', triggers: ['search', 'find', 'filter by name'], note: 'Filters as you type, case-insensitive, with a no-results state.' },
  { id: 'filter', label: 'filters', triggers: ['filter', 'filters', 'categories', 'tags'], note: 'Filter state visible and clearable.' },
  { id: 'sort', label: 'sorting', triggers: ['sort', 'order by', 'sorting'], note: 'Indicate the active column and direction.' },
  { id: 'dragdrop', label: 'drag and drop', triggers: ['drag', 'drag and drop', 'reorder', 'drag to'], note: 'Pointer events, not HTML5 drag and drop, or it is dead on touch. Provide a non-drag fallback.' },
  { id: 'charts', label: 'charts', triggers: ['chart', 'graph', 'visualise', 'visualize', 'pie chart', 'bar chart'], note: 'Inline SVG or canvas with labelled axes. No CDN chart library.' },
  { id: 'animation', label: 'animation', triggers: ['animation', 'animated', 'smooth', 'transitions'], note: 'Transform and opacity only, 150–300 ms, and honour prefers-reduced-motion.' },
  { id: 'particles', label: 'particles', triggers: ['particles', 'confetti', 'explosion', 'sparkle'], note: 'Pooled, capped, and cleared on state change.' },
  { id: 'shortcuts', label: 'keyboard shortcuts', triggers: ['keyboard shortcut', 'hotkey', 'shortcuts'], note: 'Listed somewhere in the UI — an undiscoverable shortcut does not exist.' },
  { id: 'share', label: 'sharing', triggers: ['share', 'share button', 'copy link'], note: 'navigator.share where available, clipboard copy as the fallback, with confirmation.' },
  { id: 'print', label: 'print', triggers: ['print', 'printable', 'pdf'], note: 'A print stylesheet: black on white, navigation hidden, no page breaks mid-entry.' },
  { id: 'auth', label: 'accounts', triggers: ['login', 'sign in', 'account', 'user accounts', 'register'], note: 'There is no backend here. Build the UI and say plainly that it is not real authentication. Never store a password.' },
  { id: 'realtime', label: 'live data', triggers: ['real time', 'realtime', 'live data', 'api'], note: 'Only keyless, CORS-enabled APIs work here. Otherwise use realistic local data and label it.' },
  { id: 'offline', label: 'offline', triggers: ['offline', 'works offline', 'no internet'], note: 'No external requests at all: no CDN, no fonts, no images from a URL.' },
  { id: 'accessibility', label: 'accessibility', triggers: ['accessible', 'accessibility', 'a11y', 'screen reader'], note: 'Labels, roles, focus order, visible focus, and 4.5:1 contrast throughout.' },
  { id: 'tutorial', label: 'instructions', triggers: ['tutorial', 'instructions', 'how to play', 'help'], note: 'Shown before the first play and reachable afterwards.' },
  { id: 'settings', label: 'settings', triggers: ['settings', 'options', 'preferences', 'customise', 'customize'], note: 'Persisted, and applied without a reload.' },
  { id: 'undo', label: 'undo', triggers: ['undo', 'redo', 'history'], note: 'A stack with a bound size, and a visible affordance.' },
];

/** Style words. Order matters only in that the first match names the mood. */
export const MOODS: Record<string, string[]> = {
  retro: ['retro', 'arcade', '80s', '8-bit', '8 bit', 'pixel', 'vintage', 'nostalgic', 'crt'],
  neon: ['neon', 'cyberpunk', 'synthwave', 'vaporwave', 'glow', 'futuristic', 'cyber'],
  minimal: ['minimal', 'minimalist', 'clean', 'simple', 'plain', 'understated', 'swiss'],
  playful: ['playful', 'fun', 'cute', 'kids', 'children', 'colourful', 'colorful', 'friendly', 'cartoon'],
  elegant: ['elegant', 'luxury', 'premium', 'sophisticated', 'refined', 'classy', 'upmarket'],
  brutal: ['brutalist', 'bold', 'loud', 'raw', 'punk', 'zine'],
  nature: ['nature', 'organic', 'earthy', 'forest', 'botanical', 'calm', 'zen', 'natural'],
  dark: ['dark', 'night', 'noir', 'moody', 'gothic', 'shadow'],
  warm: ['warm', 'cosy', 'cozy', 'homely', 'rustic', 'handmade', 'craft'],
  corporate: ['professional', 'corporate', 'business', 'enterprise', 'serious', 'formal'],
  editorial: ['editorial', 'magazine', 'newspaper', 'literary', 'typographic'],
  space: ['space', 'cosmic', 'galaxy', 'stars', 'astronomy', 'sci-fi', 'scifi'],
};
