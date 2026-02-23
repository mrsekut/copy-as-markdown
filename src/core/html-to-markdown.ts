const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

export function htmlToMarkdown(el: Node): string {
  return Array.from(el.childNodes)
    .map(convertNode)
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function findChildByTag(el: HTMLElement, tagName: string): HTMLElement | null {
  return (
    (Array.from(el.children).find(
      child => child.tagName.toLowerCase() === tagName,
    ) as HTMLElement | undefined) ?? null
  );
}

function collectByTag(
  el: HTMLElement,
  tags: readonly string[],
): readonly HTMLElement[] {
  return Array.from(el.children).flatMap(child => [
    ...(tags.includes(child.tagName.toLowerCase())
      ? [child as HTMLElement]
      : []),
    ...(child.children.length > 0
      ? collectByTag(child as HTMLElement, tags)
      : []),
  ]);
}

function convertNode(node: Node): string {
  if (node.nodeType === TEXT_NODE) {
    return node.textContent ?? '';
  }
  if (node.nodeType !== ELEMENT_NODE) return '';

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  const inner = (): string =>
    Array.from(el.childNodes).map(convertNode).join('');

  switch (tag) {
    case 'h1':
      return `# ${inner()}\n\n`;
    case 'h2':
      return `## ${inner()}\n\n`;
    case 'h3':
      return `### ${inner()}\n\n`;
    case 'h4':
      return `#### ${inner()}\n\n`;
    case 'p':
      return `${inner()}\n\n`;
    case 'strong':
    case 'b':
      return `**${inner()}**`;
    case 'em':
    case 'i':
      return `*${inner()}*`;
    case 'code':
      if (
        el.parentElement &&
        el.parentElement.tagName.toLowerCase() === 'pre'
      ) {
        return inner();
      }
      return `\`${inner()}\``;
    case 'pre': {
      const codeEl =
        findChildByTag(el, 'code') ?? el.querySelector('code');
      const lang = codeEl?.className?.match(/language-(\S+)/)?.[1] ?? '';
      const code = codeEl ? codeEl.textContent : el.textContent;
      return `\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
    }
    case 'ol':
      return convertList(el, true);
    case 'ul':
      return convertList(el, false);
    case 'li':
      return inner();
    case 'a': {
      const href = el.getAttribute('href');
      return href ? `[${inner()}](${href})` : inner();
    }
    case 'br':
      return '\n';
    case 'hr':
      return '---\n\n';
    case 'blockquote': {
      const lines = inner().trim().split('\n');
      return lines.map(l => `> ${l}`).join('\n') + '\n\n';
    }
    case 'table':
      return convertTable(el);
    default:
      return inner();
  }
}

function convertList(node: HTMLElement, ordered: boolean): string {
  const items = Array.from(node.children)
    .filter(child => child.tagName.toLowerCase() === 'li')
    .map((child, i) => {
      const prefix = ordered ? `${i + 1}. ` : '- ';
      const content = Array.from(child.childNodes)
        .map(convertNode)
        .join('')
        .trim();
      return `${prefix}${content}`;
    });
  return items.join('\n') + '\n\n';
}

function convertTable(table: HTMLElement): string {
  const rows = collectByTag(table, ['tr']);
  if (!rows.length) return '';

  const lines = rows.map((row, i) => {
    const cells = Array.from(row.children).filter(c => {
      const t = c.tagName.toLowerCase();
      return t === 'th' || t === 'td';
    });
    const line = `| ${cells.map(c => c.textContent?.trim() ?? '').join(' | ')} |`;
    return i === 0
      ? `${line}\n| ${cells.map(() => '---').join(' | ')} |`
      : line;
  });
  return lines.join('\n') + '\n';
}
