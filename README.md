<div class="title-block" style="text-align: center;" align="center">

# Copy as Markdown

A Chrome extension that copies selected web content as Markdown.

<p><img title="Copy as Markdown logo" src="assets/icon.png" width="320" height="320"></p>

</div>

## Usage

1. Select any content on a webpage
2. Press `Ctrl+Shift+C` (`Cmd+Shift+C` on Mac)
3. Paste the Markdown anywhere

A toast notification confirms when the content has been copied.

## Supported Conversions

- Headings (h1-h4)
- Bold, italic
- Links
- Inline code and fenced code blocks (with language detection)
- Ordered and unordered lists
- Blockquotes
- Tables
- Horizontal rules

## Install from Source

```sh
bun install
bun run build
```

Then load `build/chrome-mv3-prod/` as an unpacked extension in `chrome://extensions`.

## Development

```sh
bun run dev
bun test
```
