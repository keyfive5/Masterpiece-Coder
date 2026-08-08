/// <reference types="vite/client" />
import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

declare global {
  interface Window {
    MonacoEnvironment?: monaco.Environment;
  }
}

self.MonacoEnvironment = {
  getWorker(_id: string, label: string) {
    switch (label) {
      case 'json':
        return new JsonWorker();
      case 'css':
      case 'scss':
      case 'less':
        return new CssWorker();
      case 'html':
      case 'handlebars':
      case 'razor':
        return new HtmlWorker();
      case 'typescript':
      case 'javascript':
        return new TsWorker();
      default:
        return new EditorWorker();
    }
  },
};

monaco.editor.defineTheme('masterpiece', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: '', foreground: 'd6dced' },
    { token: 'comment', foreground: '5b6478', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'b98cff' },
    { token: 'string', foreground: '8ce39a' },
    { token: 'number', foreground: 'f5b544' },
    { token: 'type', foreground: '48d8e6' },
    { token: 'type.identifier', foreground: '48d8e6' },
    { token: 'function', foreground: '7c8cff' },
    { token: 'identifier', foreground: 'd6dced' },
    { token: 'delimiter', foreground: '7b8398' },
    { token: 'tag', foreground: 'ff8a5b' },
    { token: 'attribute.name', foreground: '7c8cff' },
    { token: 'attribute.value', foreground: '8ce39a' },
  ],
  colors: {
    'editor.background': '#10141c',
    'editor.foreground': '#d6dced',
    'editorLineNumber.foreground': '#39425a',
    'editorLineNumber.activeForeground': '#8b94a8',
    'editor.lineHighlightBackground': '#161c27',
    'editor.selectionBackground': '#2b3557',
    'editor.inactiveSelectionBackground': '#20273a',
    'editorCursor.foreground': '#7c8cff',
    'editorIndentGuide.background1': '#1c2331',
    'editorIndentGuide.activeBackground1': '#2b3446',
    'editorWidget.background': '#141924',
    'editorWidget.border': '#1f2735',
    'editorSuggestWidget.background': '#141924',
    'editorSuggestWidget.selectedBackground': '#22293a',
    'editorGutter.addedBackground': '#4ade80',
    'editorGutter.modifiedBackground': '#48d8e6',
    'editorGutter.deletedBackground': '#ff6b6b',
    'diffEditor.insertedTextBackground': '#4ade8022',
    'diffEditor.removedTextBackground': '#ff6b6b22',
    'scrollbarSlider.background': '#232b3a80',
    'scrollbarSlider.hoverBackground': '#2f394b',
    'scrollbarSlider.activeBackground': '#39425a',
  },
});

export const EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
  theme: 'masterpiece',
  fontFamily: "'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
  fontSize: 13,
  lineHeight: 21,
  fontLigatures: true,
  minimap: { enabled: false },
  smoothScrolling: true,
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: 'on',
  renderLineHighlight: 'line',
  scrollBeyondLastLine: false,
  padding: { top: 14, bottom: 40 },
  automaticLayout: true,
  tabSize: 2,
  bracketPairColorization: { enabled: true },
  guides: { indentation: true, bracketPairs: false },
  scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10, useShadows: false },
  overviewRulerBorder: false,
  fixedOverflowWidgets: true,
};

export { monaco };
