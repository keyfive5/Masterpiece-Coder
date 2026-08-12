import { looksBinary } from '../../shared/lang';
import { Workspace } from '../workspace';
import { compileBrief } from './brief';
import { FileMap, review, reviewReport, summarise } from './critic';
import { repair } from './repair';
import { CompileOptions } from './spec';
import { synthesize } from './synth';
import { Brief, DesignSystem, Finding, Spec } from './types';

/**
 * Maestro — the native intelligence of Masterpiece Coder.
 *
 * Public surface, in the order it is used:
 *
 *   prepare()          compile the prompt into a brief before the model runs
 *   readProject()      load what is on disk
 *   inspect()          find what is wrong with it
 *   autoRepair()       fix the things that cannot be wrong to fix
 *   buildNatively()    build the whole thing with no model at all
 *
 * Everything is deterministic, offline and free, which is the point: the app
 * has to work with no account and no key, and the quality of what it produces
 * should not depend on which model happened to answer.
 */

export * from './types';
export { compileBrief, renderBrief, briefSummary } from './brief';
export { review, reviewReport, summarise, countBySeverity, blankJs } from './critic';
export type { FileMap } from './critic';
export { compileSpec, describeSpec, slugify } from './spec';
export { chooseDesign, renderTokens, renderBaseCss, checkPalette, contrast, PALETTES } from './design';
export { buildPlan } from './plan';
export { ARCHETYPES, archetypeById, FEATURES } from './knowledge';
export { synthesize, generatorFor } from './synth';
export { repair } from './repair';

/** Files above this are not worth reading into a review. */
const MAX_FILE_BYTES = 400_000;
const MAX_FILES = 120;

/** Compile a prompt into a brief. Cheap enough to call on every turn. */
export function prepare(prompt: string, options: CompileOptions): Brief {
  return compileBrief(prompt, options);
}

/** Everything text-shaped in the project, as one map. */
export async function readProject(workspace: Workspace): Promise<FileMap> {
  const files: FileMap = new Map();
  const paths = await workspace.walk();
  for (const path of paths.slice(0, MAX_FILES)) {
    if (looksBinary(path)) continue;
    const body = await workspace.read(path);
    if (body === null || body.length > MAX_FILE_BYTES) continue;
    files.set(path, body);
  }
  return files;
}

/** Read the project and run every rule that applies to it. */
export async function inspect(workspace: Workspace, spec: Spec | null): Promise<Finding[]> {
  return review(await readProject(workspace), spec);
}

export interface RepairResult {
  /** One line per change, for the chat. */
  fixes: string[];
  /** Paths that were rewritten, with their before and after. */
  changed: Array<{ path: string; before: string; after: string }>;
}

/**
 * Apply the fixes that are always right — a missing viewport tag, a stylesheet
 * nothing links to, no page title. Anything needing judgement is left to the
 * review, because a confident wrong edit is worse than a report.
 */
export async function autoRepair(
  workspace: Workspace,
  spec: Spec | null,
  design: DesignSystem | null,
  /** Called before each write so the turn stays rewindable. */
  capture?: (path: string) => Promise<unknown>,
): Promise<RepairResult> {
  const files = await readProject(workspace);
  const repairs = repair(files, spec, design);

  const result: RepairResult = { fixes: [], changed: [] };
  for (const item of repairs) {
    const before = files.get(item.path) ?? '';
    if (capture) await capture(item.path);
    await workspace.write(item.path, item.content);
    result.changed.push({ path: item.path, before, after: item.content });
    result.fixes.push(...item.fixes);
  }
  return result;
}

/**
 * Build the whole project with no model involved. Used by the built-in
 * provider, and as the safety net when a turn produced nothing at all.
 */
export function buildNatively(brief: Brief) {
  return synthesize(brief.spec, brief.design);
}

/** How the review reads in the chat, when the user asked for it directly. */
export function describeReview(findings: Finding[]): string {
  return `${summarise(findings)}\n\n${reviewReport(findings, { final: true })}`;
}
