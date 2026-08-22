import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';

import { ARTICLE_COMPONENT_OPTIONS } from '../dist/components/rich-text-contract.js';
import {
  articleComponentToolbarHtml,
  escapeHtmlAttribute,
  isRichTextDocument,
  RICH_TEXT_HTML_WEB_SCRIPT
} from '../dist/components/rich-text-html.js';

const text = { detail: 0, format: 0, mode: 'normal', style: '', text: 'Known content', type: 'text', version: 1 };
const unknown = { children: [text], payload: { preserved: true }, type: 'future-node', version: 9 };
const documentWithUnknown = {
  root: { children: [{ children: [text], type: 'paragraph', version: 1 }, unknown], type: 'root', version: 1 }
};

test('placeholder text is escaped without losing user-visible characters', () => {
  assert.equal(
    escapeHtmlAttribute(`5 > 3 & "counting" isn't done`),
    '5 &gt; 3 &amp; &quot;counting&quot; isn&#39;t done'
  );
});

test('malformed documents fail validation before the WebView can emit changes', () => {
  const malformed = [null, 42, { root: { children: 'not-an-array', type: 'root', version: 1 } }, {
    root: { children: [{ children: 'not-an-array', type: 'paragraph', version: 1 }], type: 'root', version: 1 }
  }, { root: { children: [{ type: 'text', version: 1 }], type: 'root', version: 1 } }];
  for (const value of malformed) assert.equal(isRichTextDocument(value), false);
});

test('unknown nodes retain their full payload through the WebView preservation encoding', () => {
  assert.equal(isRichTextDocument(documentWithUnknown), true);
  const context = { input: unknown, output: undefined };
  vm.createContext(context);
  vm.runInContext(`${RICH_TEXT_HTML_WEB_SCRIPT}\noutput=decode(encode(input),null);`, context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.output)), unknown);
});

test('article component toggle controls only insertion tools', () => {
  assert.equal(articleComponentToolbarHtml(false, ARTICLE_COMPONENT_OPTIONS), '');
  const enabled = articleComponentToolbarHtml(true, ARTICLE_COMPONENT_OPTIONS);
  assert.match(enabled, /id="component-type"/);
  assert.match(enabled, /id="insert-component"/);
  for (const option of ARTICLE_COMPONENT_OPTIONS) assert.match(enabled, new RegExp(`value="${option.value}"`));
  assert.equal(isRichTextDocument({ root: { children: [{ fields: { blockType: 'youtubeVideo', videoId: 'video-123' }, type: 'block', version: 1 }], type: 'root', version: 1 } }), true);
});
