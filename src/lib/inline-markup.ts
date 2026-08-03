/**
 * Minimal inline-markdown renderer for frontmatter strings.
 *
 * Frontmatter values are plain YAML, not MDX, so `` `code` `` and `**bold**`
 * would otherwise render as literal punctuation in the key-terms panel, the
 * challenge cards and the learned list. This supports exactly the three inline
 * marks that content actually uses — nothing block-level, no links, no nesting
 * of the same mark.
 *
 * Input is escaped before any markup is applied, so the output is safe to pass
 * to `set:html` even though the content is already trusted.
 */

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ESCAPES[char]!);
}

export function inlineMarkup(value: string): string {
  return (
    escapeHtml(value)
      // `code` first: its content must not be reinterpreted as bold or italic.
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Single asterisks, but only outside the spans already consumed above —
      // `[^*]+` cannot cross an asterisk, so `**x**` is never matched here.
      .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>')
  );
}
