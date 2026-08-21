import type { ArticleComponentFields } from './rich-text-contract';

export interface RichTextNode {
  children?: RichTextNode[];
  fields?: ArticleComponentFields;
  [key: string]: unknown;
  type: string;
  version: number;
}

export interface RichTextDocument {
  root: { children: RichTextNode[]; direction?: null | string; format?: string; indent?: number; type: 'root'; version: number };
}

export function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function articleComponentToolbarHtml(
  enabled: boolean,
  options: ReadonlyArray<{ label: string; value: string }>
): string {
  if (!enabled) return '';
  const optionHtml = options
    .map((option) => `<option value="${escapeHtmlAttribute(option.value)}">${escapeHtmlAttribute(option.label)}</option>`)
    .join('');
  return `<select id="component-type">${optionHtml}</select><button id="insert-component">+ Insert</button>`;
}

function isRichTextNode(value: unknown): value is RichTextNode {
  if (!value || typeof value !== 'object') return false;
  const node = value as Record<string, unknown>;
  if (typeof node.type !== 'string' || typeof node.version !== 'number') return false;
  if (node.type === 'text' && typeof node.text !== 'string') return false;
  if (['paragraph', 'heading', 'quote', 'list', 'listitem'].includes(node.type) && !Array.isArray(node.children)) return false;
  if ('children' in node && (!Array.isArray(node.children) || !node.children.every(isRichTextNode))) return false;
  return true;
}

export function isRichTextDocument(value: unknown): value is RichTextDocument {
  if (!value || typeof value !== 'object') return false;
  const root = (value as { root?: unknown }).root;
  if (!root || typeof root !== 'object') return false;
  const candidate = root as Record<string, unknown>;
  return candidate.type === 'root'
    && typeof candidate.version === 'number'
    && Array.isArray(candidate.children)
    && candidate.children.every(isRichTextNode);
}

// Executed only inside the isolated editor WebView. Keeping these helpers in a
// testable contract prevents HTML escaping and preserved-node encoding drift.
export const RICH_TEXT_HTML_WEB_SCRIPT = String.raw`
function esc(value){return String(value||'').replace(/[&<>]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[char]))}
function escAttr(value){return String(value||'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function encode(value){return encodeURIComponent(JSON.stringify(value))}
function decode(value,fallback){try{return JSON.parse(decodeURIComponent(value))}catch{return fallback}}
`;
