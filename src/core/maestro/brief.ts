import { chooseDesign, renderTokens } from './design';
import { FEATURES, KIND_GUIDE, UNIVERSAL_PITFALLS, UNIVERSAL_REQUIREMENTS, archetypeById } from './knowledge';
import { buildPlan } from './plan';
import { compileSpec, CompileOptions } from './spec';
import { Brief, Spec } from './types';

/**
 * The brief.
 *
 * This is the text Maestro hands to whichever AI is doing the writing. It is
 * the single highest-leverage thing in the whole app: the difference between a
 * model inventing a rhythm game from four words and a model implementing a
 * specification that already knows notes must spawn off screen 1.6 seconds
 * before the beat.
 *
 * It is deliberately written as instructions rather than notes, and it says
 * plainly that the user's own words outrank it — an expanded requirement is a
 * best guess at what someone meant, and it must never override what they said.
 */

const FEATURE_BY_ID = new Map(FEATURES.map((f) => [f.id, f]));

export function compileBrief(prompt: string, options: CompileOptions): Brief {
  const spec = compileSpec(prompt, options);
  const design = chooseDesign(spec);
  const plan = buildPlan(spec);
  const archetype = archetypeById(spec.archetype);
  return { spec, design, plan, archetype, text: renderBrief({ spec, design, plan, archetype, text: '' }) };
}

export function renderBrief(brief: Omit<Brief, 'text'> & { text?: string }): string {
  const { spec, design, plan, archetype } = brief;
  const out: string[] = [];

  out.push(`# Build brief — ${spec.title}`);
  out.push(
    `Compiled from the user's message by Maestro, the planner built into this app. ` +
      `It is what they asked for, expanded with what a specialist in this kind of project already knows. ` +
      `Treat it as the specification. Where it contradicts the user's own words, the user wins.`,
  );

  /* -------- what ------------------------------------------------------ */

  const facts: string[] = [
    `**Building:** ${archetype.label}${spec.subject ? ` about ${spec.subject}` : ''} — ${archetype.summary}`,
  ];
  if (spec.mood.length) facts.push(`**Feel:** ${spec.mood.join(', ')}`);
  if (spec.features.length) {
    facts.push(`**Asked for:** ${spec.features.map((id) => FEATURE_BY_ID.get(id)?.label ?? id).join(', ')}`);
  }
  if (spec.excluded.length) {
    facts.push(`**Explicitly not wanted:** ${spec.excluded.map((id) => FEATURE_BY_ID.get(id)?.label ?? id).join(', ')} — do not add these.`);
  }
  if (spec.confidence < 0.34) {
    facts.push(`**Note:** the request was open-ended, so this reading is a guess. Say what you assumed in your first sentence.`);
  }
  out.push(facts.join('\n'));

  /* -------- requirements ---------------------------------------------- */

  out.push(`## What "finished" means here\n${plan.definitionOfDone}`);

  const requirements = [...archetype.mustHave];
  for (const id of spec.features) {
    const feature = FEATURE_BY_ID.get(id);
    if (feature && !requirements.some((r) => r.toLowerCase().includes(feature.label))) {
      requirements.push(`${feature.label[0].toUpperCase()}${feature.label.slice(1)}: ${feature.note}`);
    }
  }
  out.push(`## Requirements\n${requirements.map((r) => `- ${r}`).join('\n')}`);

  if (spec.verbatim.length) {
    out.push(
      `## The user's own words — these outrank everything else here\n${spec.verbatim.map((v) => `- "${v}"`).join('\n')}`,
    );
  }

  /* -------- numbers --------------------------------------------------- */

  if (archetype.tuning.length) {
    out.push(
      `## Numbers — use these rather than improvising\n` +
        `These are chosen so the thing is actually playable and fair. Change them only with a reason, and say what the reason was.\n` +
        archetype.tuning.map((t) => `- ${t}`).join('\n'),
    );
  }

  /* -------- pitfalls -------------------------------------------------- */

  if (archetype.pitfalls.length) {
    out.push(
      `## How this specific thing usually breaks\n` +
        `Each of these has shipped broken more than once. Check every one before you finish.\n` +
        archetype.pitfalls.map((p) => `- **${p.symptom}**\n  → ${p.fix}`).join('\n'),
    );
  }

  /* -------- kind guidance --------------------------------------------- */

  const guide = KIND_GUIDE[spec.kind];
  if (guide?.length) {
    out.push(`## True of every ${spec.kind === 'viz' ? 'data view' : spec.kind}\n${guide.map((g) => `- ${g}`).join('\n')}`);
  }

  /* -------- design ---------------------------------------------------- */

  out.push(
    `## Design direction — ${design.name}\n` +
      `${design.notes}\n\n` +
      `Use these exact values. Do not substitute a different palette, and do not reach for a purple gradient on white.\n\n` +
      '```css\n' +
      renderTokens(design) +
      '\n```\n' +
      `Everything else follows from them: ${design.scheme} scheme, ${design.radius} corners, one accent used sparingly so it still means something. ` +
      `No web fonts — the stacks above are installed everywhere and work offline.`,
  );

  /* -------- constraints ----------------------------------------------- */

  const limits: string[] = [];
  if (spec.constraints.noBuild) {
    limits.push(
      'There is no build step and no shell. Plain HTML, CSS and JavaScript loaded directly — no npm, no imports from a package, no JSX, no TypeScript.',
    );
  }
  if (spec.constraints.offline) limits.push('It must work offline: no CDN scripts, no remote fonts, no remote images.');
  if (spec.constraints.singleFile) limits.push('Everything in one HTML file, as asked.');
  if (spec.constraints.mobile) limits.push('It must work on a phone — 320 px wide, touch only, no hover.');
  if (spec.constraints.framework && spec.constraints.noBuild) {
    limits.push(`${spec.constraints.framework} was mentioned but cannot be compiled here. Build it in plain JavaScript and say so in one line.`);
  }
  if (limits.length) out.push(`## Constraints\n${limits.map((l) => `- ${l}`).join('\n')}`);

  /* -------- universal ------------------------------------------------- */

  out.push(
    `## Always\n${UNIVERSAL_REQUIREMENTS.map((r) => `- ${r}`).join('\n')}\n${UNIVERSAL_PITFALLS.map((p) => `- ${p}`).join('\n')}`,
  );

  /* -------- files and plan -------------------------------------------- */

  out.push(`## Files\n${plan.manifest.map(([path, role]) => `- \`${path}\` — ${role}`).join('\n')}`);

  out.push(
    `## The plan to publish\n` +
      `Call update_plan with exactly these steps, then keep it current as you go.\n` +
      plan.milestones.map((m, i) => `${i + 1}. ${m.text} — done when: ${m.acceptance}`).join('\n'),
  );

  /* -------- the closing instruction ------------------------------------ */

  out.push(
    `## Before you say you are finished\n` +
      `Call **review_project**. It reads what you actually wrote and reports what is broken — missing files, unbalanced code, ` +
      `a game with no way to lose, a keyboard-only control scheme, placeholder text left behind. ` +
      `Fix everything it reports as a blocker or a major, then call it again. Do not tell the user it is done while it still reports either.`,
  );

  if (spec.unknowns.length) {
    out.push(`## Worth saying out loud\n${spec.unknowns.map((u) => `- ${u}`).join('\n')}`);
  }

  return out.join('\n\n');
}

/** Short form for the chat, so the user can see what was understood. */
export function briefSummary(spec: Spec): string {
  const parts = [`${spec.archetypeLabel}${spec.subject ? ` · ${spec.subject}` : ''}`];
  if (spec.mood.length) parts.push(spec.mood[0]);
  if (spec.features.length) parts.push(`${spec.features.length} features`);
  return parts.join(' · ');
}
