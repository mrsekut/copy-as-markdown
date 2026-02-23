<div class="title-block" style="text-align: center;" align="center">

# Copy as Markdown for AI Chat

A Chrome extension that copies AI chat responses as Markdown.

<p><img title="Chat to Markdown logo" src="assets/icon.png" width="320" height="320"></p>

</div>

## Supported Sites

- ChatGPT (chatgpt.com)

## Usage

1. Select any content in an AI chat
2. Press `Ctrl+Shift+C` (`Cmd+Shift+C` on Mac)
3. Paste the Markdown anywhere

A toast notification confirms when the content has been copied.

## Supported Conversions

- Headings
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
