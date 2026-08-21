import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';

import {
  ARTICLE_COMPONENT_OPTIONS,
  ARTICLE_COMPONENT_SUMMARY_WEB_SCRIPT,
  ARTICLE_COMPONENT_WEB_SCRIPT,
  buildArticleComponentFields,
  summarizeArticleComponentFields
} from '../dist/components/rich-text-contract.js';

const cases = [
  ['youtubeVideo', ['video-123'], { blockType: 'youtubeVideo', videoId: 'video-123' }],
  ['xPost', ['https://example.com/x'], { blockType: 'xPost', url: 'https://example.com/x' }],
  ['instagramPost', ['https://example.com/instagram'], { blockType: 'instagramPost', url: 'https://example.com/instagram' }],
  ['tiktokVideo', ['https://example.com/tiktok'], { blockType: 'tiktokVideo', url: 'https://example.com/tiktok' }],
  ['audioEmbed', ['https://example.com/audio.mp3', 'Title', 'Caption'], { blockType: 'audioEmbed', url: 'https://example.com/audio.mp3', title: 'Title', caption: 'Caption' }],
  ['pullQuote', ['Quoted text', 'Source'], { blockType: 'pullQuote', quote: 'Quoted text', attribution: 'Source' }],
  ['infoBox', ['warning', '<p>Important</p>', 'Notice'], { blockType: 'infoBox', tone: 'warning', title: 'Notice', html: '<p>Important</p>' }],
  ['keyPoints', ['One | Two', 'Highlights'], { blockType: 'keyPoints', title: 'Highlights', points: ['One', 'Two'] }],
  ['relatedLinks', ['First,https://example.com/1|Second,https://example.com/2', 'Coverage'], { blockType: 'relatedLinks', title: 'Coverage', links: [{ label: 'First', url: 'https://example.com/1' }, { label: 'Second', url: 'https://example.com/2' }] }],
  ['dataTable', ['Name | Value', 'Alpha,10|Beta,20', 'Results'], { blockType: 'dataTable', caption: 'Results', headers: [{ value: 'Name' }, { value: 'Value' }], rows: [{ cells: [{ value: 'Alpha' }, { value: '10' }] }, { cells: [{ value: 'Beta' }, { value: '20' }] }] }],
  ['liveUpdate', ['Breaking headline', '2026-08-20T20:00:00.000Z', '<p>Details</p>'], { blockType: 'liveUpdate', timestamp: '2026-08-20T20:00:00.000Z', headline: 'Breaking headline', html: '<p>Details</p>' }]
];

function normalize(value) {
  return JSON.parse(JSON.stringify(value));
}

function prompts(values) {
  let index = 0;
  return () => values[index++] ?? null;
}

function buildInWebView(blockType, values) {
  const context = { blockType, values, output: undefined };
  vm.createContext(context);
  vm.runInContext(`${ARTICLE_COMPONENT_WEB_SCRIPT}\nlet index=0;output=buildArticleComponentFields(blockType,()=>values[index++]??null,()=>"2026-08-20T20:00:00.000Z");`, context);
  return normalize(context.output);
}

function summarizeInWebView(fields) {
  const context = { fields, output: undefined };
  vm.createContext(context);
  vm.runInContext(`${ARTICLE_COMPONENT_SUMMARY_WEB_SCRIPT}\noutput=summary(fields);`, context);
  return context.output;
}

test('exposes the exact eleven Auburndale component choices', () => {
  assert.deepEqual(ARTICLE_COMPONENT_OPTIONS.map(({ value }) => value), cases.map(([value]) => value));
});

for (const [blockType, values, expected] of cases) {
  test(`${blockType} matches Auburndale fields in native and WebView paths`, () => {
    const native = buildArticleComponentFields(blockType, prompts(values), () => '2026-08-20T20:00:00.000Z');
    assert.deepEqual(normalize(native), expected);
    assert.deepEqual(buildInWebView(blockType, values), expected);
  });
}

test('required cancellation, blank values, malformed lists, and unknown types fail closed', () => {
  assert.equal(buildArticleComponentFields('youtubeVideo', () => null), null);
  assert.equal(buildArticleComponentFields('youtubeVideo', () => '   '), null);
  assert.equal(buildArticleComponentFields('relatedLinks', prompts(['invalid', 'Title'])), null);
  assert.equal(buildArticleComponentFields('dataTable', prompts(['Name', '   '])), null);
  assert.equal(buildArticleComponentFields('futureComponent', () => 'value'), null);
  assert.equal(buildInWebView('youtubeVideo', []), null);
  assert.equal(buildInWebView('youtubeVideo', ['   ']), null);
  assert.equal(buildInWebView('relatedLinks', ['invalid', 'Title']), null);
  assert.equal(buildInWebView('dataTable', ['Name', '   ']), null);
  assert.equal(buildInWebView('futureComponent', ['value']), null);
});

test('defaults and summaries match Auburndale', () => {
  assert.deepEqual(normalize(buildArticleComponentFields('infoBox', prompts(['unsupported', '<p>Body</p>', null]))), { blockType: 'infoBox', tone: 'neutral', html: '<p>Body</p>' });
  assert.deepEqual(normalize(buildArticleComponentFields('keyPoints', prompts(['One|Two', '']))), { blockType: 'keyPoints', title: 'Key Points', points: ['One', 'Two'] });
  assert.equal(summarizeArticleComponentFields({ blockType: 'keyPoints', points: ['One', 'Two'] }), '2 points');
  assert.equal(summarizeArticleComponentFields({ blockType: 'infoBox', tone: 'warning', title: 'Notice' }), 'warning Notice');
  assert.equal(summarizeArticleComponentFields({ blockType: 'futureComponent' }), '');
  const summaryCases = [
    [{ blockType: 'youtubeVideo', videoId: 'video-123' }, 'video-123'],
    [{ blockType: 'xPost', url: 'https://example.com/x' }, 'https://example.com/x'],
    [{ blockType: 'instagramPost', url: 'https://example.com/instagram' }, 'https://example.com/instagram'],
    [{ blockType: 'tiktokVideo', url: 'https://example.com/tiktok' }, 'https://example.com/tiktok'],
    [{ blockType: 'audioEmbed', url: 'https://example.com/audio' }, 'https://example.com/audio'],
    [{ blockType: 'pullQuote', quote: 'Quoted text' }, 'Quoted text'],
    [{ blockType: 'relatedLinks', links: [{ label: 'One', url: 'https://example.com' }] }, '1 links'],
    [{ blockType: 'dataTable', headers: [{ value: 'One' }, { value: 'Two' }] }, '2 columns'],
    [{ blockType: 'liveUpdate', headline: 'Breaking headline' }, 'Breaking headline']
  ];
  for (const [fields, expected] of summaryCases) {
    assert.equal(summarizeArticleComponentFields(fields), expected);
    assert.equal(summarizeInWebView(fields), expected);
  }
});
