import type { PlasmoCSConfig } from 'plasmo';

import { htmlToMarkdown } from '../core/html-to-markdown';
import { showToast } from '../lib/toast';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'c') {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || selection.isCollapsed) return;

    e.preventDefault();
    const range = selection.getRangeAt(0);
    const fragment = range.cloneContents();
    const container = document.createElement('div');
    container.appendChild(fragment);

    const md = htmlToMarkdown(container);
    navigator.clipboard
      .writeText(md)
      .then(() => showToast('Copied as Markdown!'));
  }
});
