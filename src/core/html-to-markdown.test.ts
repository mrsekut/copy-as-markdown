import { test, expect } from 'bun:test';
import { Window } from 'happy-dom';
import { htmlToMarkdown } from './html-to-markdown';

const window = new Window();
const document = window.document;

function createEl(html: string): HTMLElement {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el as unknown as HTMLElement;
}

test('converts paragraph', () => {
  const el = createEl('<p>Hello world</p>');
  expect(htmlToMarkdown(el)).toBe('Hello world');
});

test('converts headings', () => {
  const el = createEl('<h1>Title</h1><h2>Subtitle</h2><h3>Section</h3>');
  expect(htmlToMarkdown(el)).toBe('# Title\n\n## Subtitle\n\n### Section');
});

test('converts bold and italic', () => {
  const el = createEl('<p><strong>bold</strong> and <em>italic</em></p>');
  expect(htmlToMarkdown(el)).toBe('**bold** and *italic*');
});

test('converts inline code', () => {
  const el = createEl('<p>Use <code>console.log</code> for debugging</p>');
  expect(htmlToMarkdown(el)).toBe('Use `console.log` for debugging');
});

test('converts code block with language', () => {
  const el = createEl(
    '<pre><code class="language-typescript">const x = 1;</code></pre>',
  );
  expect(htmlToMarkdown(el)).toBe('```typescript\nconst x = 1;\n```');
});

test('converts code block without language', () => {
  const el = createEl('<pre><code>plain code</code></pre>');
  expect(htmlToMarkdown(el)).toBe('```\nplain code\n```');
});

test('converts unordered list', () => {
  const el = createEl('<ul><li>one</li><li>two</li><li>three</li></ul>');
  expect(htmlToMarkdown(el)).toBe('- one\n- two\n- three');
});

test('converts ordered list', () => {
  const el = createEl('<ol><li>first</li><li>second</li></ol>');
  expect(htmlToMarkdown(el)).toBe('1. first\n2. second');
});

test('converts link', () => {
  const el = createEl('<a href="https://example.com">Example</a>');
  expect(htmlToMarkdown(el)).toBe('[Example](https://example.com)');
});

test('converts blockquote', () => {
  const el = createEl('<blockquote>quoted text</blockquote>');
  expect(htmlToMarkdown(el)).toBe('> quoted text');
});

test('converts horizontal rule', () => {
  const el = createEl('<p>above</p><hr><p>below</p>');
  expect(htmlToMarkdown(el)).toBe('above\n\n---\n\nbelow');
});

test('converts table', () => {
  const el = createEl(
    '<table><tr><th>Name</th><th>Age</th></tr><tr><td>Alice</td><td>30</td></tr></table>',
  );
  expect(htmlToMarkdown(el)).toBe(
    '| Name | Age |\n| --- | --- |\n| Alice | 30 |',
  );
});

test('handles nested formatting', () => {
  const el = createEl('<p><strong><em>bold italic</em></strong></p>');
  expect(htmlToMarkdown(el)).toBe('***bold italic***');
});

test('passes through container elements', () => {
  const el = createEl('<div><span>text</span></div>');
  expect(htmlToMarkdown(el)).toBe('text');
});

test('handles empty selection', () => {
  const el = createEl('');
  expect(htmlToMarkdown(el)).toBe('');
});
