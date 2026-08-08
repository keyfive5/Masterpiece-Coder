import React, { useMemo } from 'react';

/**
 * A small, dependency-free Markdown renderer covering exactly what the agent
 * actually writes: paragraphs, headings, lists, fenced and inline code, bold,
 * italics, links, quotes and rules. Everything is escaped before formatting, so
 * model output can never inject markup.
 */

function escape(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(text: string): string {
  let out = escape(text);
  // Inline code first so its contents are not further formatted.
  const codes: string[] = [];
  out = out.replace(/`([^`]+)`/g, (_m, code) => {
    codes.push(code);
    return `\0${codes.length - 1}\0`;
  });
  out = out
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noreferrer">$2</a>');
  out = out.replace(/\0(\d+)\0/g, (_m, i) => `<code>${codes[Number(i)]}</code>`);
  return out;
}

function render(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let i = 0;
  let list: 'ul' | 'ol' | null = null;

  const closeList = () => {
    if (list) {
      html.push(`</${list}>`);
      list = null;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    const fence = line.match(/^\s*```(\w*)\s*$/);
    if (fence) {
      closeList();
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) body.push(lines[i++]);
      i++;
      html.push(`<pre><code class="lang-${fence[1] || 'text'}">${escape(body.join('\n'))}</code></pre>`);
      continue;
    }

    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      closeList();
      html.push('<hr />');
      i++;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = Math.min(heading[1].length + 1, 4);
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      closeList();
      const body: string[] = [quote[1]];
      i++;
      while (i < lines.length && /^>\s?/.test(lines[i])) body.push(lines[i++].replace(/^>\s?/, ''));
      html.push(`<blockquote>${inline(body.join(' '))}</blockquote>`);
      continue;
    }

    const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const want = bullet ? 'ul' : 'ol';
      if (list !== want) {
        closeList();
        html.push(`<${want}>`);
        list = want;
      }
      html.push(`<li>${inline((bullet ?? numbered)![1])}</li>`);
      i++;
      continue;
    }

    if (line.trim() === '') {
      closeList();
      i++;
      continue;
    }

    closeList();
    const para: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^\s*(```|[-*+]\s|\d+[.)]\s|#{1,6}\s|>)/.test(lines[i])
    ) {
      para.push(lines[i++]);
    }
    html.push(`<p>${inline(para.join('\n'))}</p>`);
  }

  closeList();
  return html.join('');
}

export function Markdown({ text }: { text: string }) {
  const html = useMemo(() => render(text), [text]);
  return <div className="md" dangerouslySetInnerHTML={{ __html: html }} />;
}
