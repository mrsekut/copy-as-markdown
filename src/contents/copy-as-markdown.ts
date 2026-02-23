import type { PlasmoCSConfig } from 'plasmo';

import { getAdapter } from '../adapters';
import { htmlToMarkdown } from '../core/html-to-markdown';
import { showToast } from '../lib/toast';

export const config: PlasmoCSConfig = {
  matches: ['https://chatgpt.com/*'],
};

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'c') {
    const selection = window.getSelection();
    if (!selection) return;

    const adapter = getAdapter(location.href);
    if (!adapter) return;

    const container = adapter.getSelectionContainer(selection);
    if (!container) return;

    e.preventDefault();
    const normalized = adapter.normalizeContainer(container);
    const md = htmlToMarkdown(normalized);
    navigator.clipboard
      .writeText(md)
      .then(() => showToast('Copied as Markdown!'));
  }
});
