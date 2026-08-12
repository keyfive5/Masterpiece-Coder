import { FileMap } from './critic';
import { DesignSystem, Spec } from './types';

/**
 * The repairer.
 *
 * A small set of fixes that are always right, applied without asking. Nothing
 * here changes behaviour or design — it only completes things that were left
 * off: a missing viewport tag, a stylesheet nothing links to, no page title.
 *
 * The bar for adding a rule here is that it cannot be wrong. Anything requiring
 * judgement stays in the critic and goes back to whoever is building, because a
 * confident wrong edit is far worse than a report.
 */

export interface Repair {
  path: string;
  content: string;
  /** One line per change, for the chat. */
  fixes: string[];
}

export function repair(files: FileMap, spec: Spec | null, design: DesignSystem | null): Repair[] {
  const out: Repair[] = [];

  for (const [path, original] of files) {
    if (!/\.html?$/i.test(path)) continue;
    let body = original;
    const fixes: string[] = [];

    /* ---- doctype ---- */
    if (!/<!doctype\s+html/i.test(body)) {
      body = `<!doctype html>\n${body.replace(/^\s*<!doctype[^>]*>\s*/i, '')}`;
      fixes.push('added the missing <!doctype html>');
    }

    /* ---- lang ---- */
    if (/<html\b/i.test(body) && !/<html[^>]*\slang\s*=/i.test(body)) {
      body = body.replace(/<html\b/i, '<html lang="en"');
      fixes.push('set lang="en" on <html>');
    }

    const headOpen = /<head[^>]*>/i.exec(body);

    /* ---- charset, viewport, description ---- */
    if (headOpen) {
      const insertions: string[] = [];
      if (!/<meta[^>]+charset/i.test(body)) {
        insertions.push('  <meta charset="utf-8">');
        fixes.push('added <meta charset="utf-8">');
      }
      if (!/<meta[^>]+name=["']viewport["']/i.test(body)) {
        insertions.push('  <meta name="viewport" content="width=device-width, initial-scale=1">');
        fixes.push('added the viewport tag so it renders properly on a phone');
      }
      if (spec && spec.kind === 'site' && !/<meta[^>]+name=["']description["']/i.test(body)) {
        const description = `${spec.title}${spec.subject ? ` — ${spec.subject}` : ''}.`.replace(/"/g, '');
        insertions.push(`  <meta name="description" content="${description}">`);
        fixes.push('added a meta description');
      }
      if (insertions.length) {
        body = body.replace(headOpen[0], `${headOpen[0]}\n${insertions.join('\n')}`);
      }
    }

    /* ---- title ---- */
    if (!/<title[^>]*>[\s\S]*?<\/title>/i.test(body) && headOpen && spec) {
      body = body.replace(/<head[^>]*>/i, (m) => `${m}\n  <title>${escapeHtml(spec.title)}</title>`);
      fixes.push(`added the page title "${spec.title}"`);
    }

    /* ---- favicon: a generated one beats a 404 in the console ---- */
    if (headOpen && !/rel=["'](?:shortcut )?icon["']/i.test(body) && design && spec) {
      body = body.replace(/<head[^>]*>/i, (m) => `${m}\n  <link rel="icon" href="${faviconDataUri(spec.title, design)}">`);
      fixes.push('added a favicon so the browser tab is not blank');
    }

    /* ---- files nothing loads ---- */
    for (const other of files.keys()) {
      if (other === path) continue;
      const ref = other.replace(/^\.\//, '');
      if (isReferencedAnywhere(files, ref)) continue;

      if (/\.css$/i.test(other) && /<\/head>/i.test(body)) {
        body = body.replace(/<\/head>/i, `  <link rel="stylesheet" href="${ref}">\n</head>`);
        fixes.push(`linked ${ref}, which nothing was loading`);
      } else if (/\.m?js$/i.test(other) && /<\/body>/i.test(body)) {
        body = body.replace(/<\/body>/i, `  <script src="${ref}" defer></script>\n</body>`);
        fixes.push(`loaded ${ref}, which nothing was loading`);
      }
    }

    if (body !== original) out.push({ path, content: body, fixes });
  }

  return out;
}

function isReferencedAnywhere(files: FileMap, ref: string): boolean {
  const needle = ref.toLowerCase();
  for (const [path, body] of files) {
    if (!/\.html?$/i.test(path)) continue;
    for (const m of body.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
      const value = m[1].split('?')[0].split('#')[0].replace(/^\.\//, '').replace(/^\//, '').toLowerCase();
      if (value === needle) return true;
    }
  }
  return false;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * An SVG favicon as a data URI: the project's initial on its accent colour.
 * No file, no request, and the tab stops looking like an unfinished page.
 */
function faviconDataUri(title: string, design: DesignSystem): string {
  const letter = escapeHtml((title.trim()[0] ?? 'M').toUpperCase());
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>` +
    `<rect width='64' height='64' rx='12' fill='${design.colors.accent}'/>` +
    `<text x='32' y='44' font-family='system-ui,sans-serif' font-size='38' font-weight='700' ` +
    `text-anchor='middle' fill='${design.colors.accentInk}'>${letter}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
