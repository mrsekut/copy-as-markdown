import type { Adapter } from './types';

export const chatgptAdapter: Adapter = {
  matches: ['https://chatgpt.com/*'],

  getSelectionContainer(selection: Selection): HTMLElement | null {
    if (!selection.rangeCount || selection.isCollapsed) return null;

    const range = selection.getRangeAt(0);
    const fragment = range.cloneContents();
    const container = document.createElement('div');
    container.appendChild(fragment);
    return container;
  },

  normalizeContainer(container: HTMLElement): HTMLElement {
    for (const pre of Array.from(container.getElementsByTagName('pre'))) {
      normalizeCodeBlock(pre as HTMLElement);
    }
    return container;
  },
};

/**
 * ChatGPT renders code blocks as:
 *   <pre>
 *     <div>
 *       <div>...<div>haskell</div>...<button>Copy</button>...</div>
 *       <div class="cm-content">...spans...</div>
 *     </div>
 *   </pre>
 *
 * Normalize into: <pre><code class="language-haskell">...code...</code></pre>
 */
function normalizeCodeBlock(pre: HTMLElement): void {
  const cmContent = findByClass(pre, 'cm-content');
  if (!cmContent) return;

  const lang = detectLanguage(pre, cmContent);
  const code = extractCodeFromCM(cmContent);

  const codeEl = pre.ownerDocument.createElement('code');
  if (lang) codeEl.className = `language-${lang}`;
  codeEl.textContent = code;

  pre.textContent = '';
  pre.appendChild(codeEl);
}

function detectLanguage(pre: HTMLElement, cmContent: HTMLElement): string {
  // Walk backward through siblings of cm-content's ancestors to find the header
  // ChatGPT places the language label in a sibling div before the code area
  const findInSiblings = (sibling: HTMLElement | null): string | null => {
    if (!sibling) return null;
    const text = sibling.textContent?.trim() ?? '';
    const match = text.match(/^([a-zA-Z0-9_+#.-]+)/);
    if (match) return match[1];
    return findInSiblings(sibling.previousElementSibling as HTMLElement | null);
  };

  const findInAncestors = (node: HTMLElement | null): string => {
    if (!node || node === pre) return '';
    return (
      findInSiblings(node.previousElementSibling as HTMLElement | null) ??
      findInAncestors(node.parentElement as HTMLElement | null)
    );
  };

  return findInAncestors(cmContent);
}

function extractCodeFromCM(cmContent: HTMLElement): string {
  const isBr = (node: Node): boolean =>
    node.nodeType === 1 && (node as HTMLElement).tagName.toLowerCase() === 'br';

  return Array.from(cmContent.childNodes)
    .reduce<string[][]>(
      (lines, node) =>
        isBr(node)
          ? [...lines, []]
          : [
              ...lines.slice(0, -1),
              [...(lines.at(-1) ?? []), node.textContent ?? ''],
            ],
      [[]],
    )
    .map(parts => parts.join(''))
    .join('\n');
}

/** Recursively find the first descendant with the given class name */
function findByClass(root: HTMLElement, className: string): HTMLElement | null {
  for (const child of Array.from(root.children)) {
    const el = child as HTMLElement;
    if (el.classList?.contains(className)) {
      return el;
    }
    const found = findByClass(el, className);
    if (found) return found;
  }
  return null;
}
