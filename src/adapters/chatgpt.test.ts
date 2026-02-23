import { test, expect } from 'bun:test';
import { Window } from 'happy-dom';
import { chatgptAdapter } from './chatgpt';
import { htmlToMarkdown } from '../core/html-to-markdown';

const window = new Window();
const document = window.document;

function createContainer(html: string): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div as unknown as HTMLElement;
}

function findCode(container: HTMLElement): HTMLElement | null {
  const codes = container.getElementsByTagName('code');
  return (codes[0] as unknown as HTMLElement) ?? null;
}

test('normalizes ChatGPT CodeMirror code block', () => {
  const container = createContainer(`
    <pre>
      <div>
        <div>
          <div class="sticky">
            <div>haskell</div>
            <button>コピーする</button>
          </div>
          <div class="cm-content">
            <span>add</span><span> </span><span>::</span><span> </span><span>Int</span><span> </span><span>-></span><span> </span><span>Int</span><span> </span><span>-></span><span> </span><span>Int</span><br><span>add</span><span> x y </span><span>=</span><span> x </span><span>+</span><span> y</span>
          </div>
        </div>
      </div>
    </pre>
  `);

  const normalized = chatgptAdapter.normalizeContainer(container);
  const code = findCode(normalized);

  expect(code).not.toBeNull();
  expect(code!.className).toBe('language-haskell');
  expect(code!.textContent).toContain('add :: Int -> Int -> Int');
  expect(code!.textContent).toContain('add x y = x + y');
});

test('produces correct markdown from ChatGPT code block', () => {
  const container = createContainer(`
    <pre>
      <div>
        <div>
          <div class="sticky">
            <div>python</div>
            <button>Copy</button>
          </div>
          <div class="cm-content">
            <span>def</span><span> </span><span>hello</span><span>():</span><br><span>    </span><span>print</span><span>("Hello")</span>
          </div>
        </div>
      </div>
    </pre>
  `);

  const normalized = chatgptAdapter.normalizeContainer(container);
  const md = htmlToMarkdown(normalized);

  expect(md).toContain('```python');
  expect(md).toContain('def hello():');
  expect(md).toContain('print("Hello")');
  expect(md).toContain('```');
});

test('leaves standard pre>code untouched', () => {
  const container = createContainer(`
    <pre><code class="language-js">console.log("hi")</code></pre>
  `);

  const normalized = chatgptAdapter.normalizeContainer(container);
  const md = htmlToMarkdown(normalized);

  expect(md).toBe('```js\nconsole.log("hi")\n```');
});
