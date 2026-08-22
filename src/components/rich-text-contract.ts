export const ARTICLE_COMPONENT_OPTIONS = [
  { value: 'youtubeVideo', label: 'YouTube Video' },
  { value: 'xPost', label: 'X Post' },
  { value: 'instagramPost', label: 'Instagram Post' },
  { value: 'tiktokVideo', label: 'TikTok Video' },
  { value: 'audioEmbed', label: 'Audio Embed' },
  { value: 'pullQuote', label: 'Pull Quote' },
  { value: 'infoBox', label: 'Info Box' },
  { value: 'keyPoints', label: 'Key Points' },
  { value: 'relatedLinks', label: 'Related Links' },
  { value: 'dataTable', label: 'Data Table' },
  { value: 'liveUpdate', label: 'Live Update' }
] as const;

export type ArticleComponentType = (typeof ARTICLE_COMPONENT_OPTIONS)[number]['value'];
export interface ArticleComponentFields { blockType: string; [key: string]: unknown }
export type ArticleComponentPrompt = (message: string, fallback?: string) => string | null;

export function articleComponentLabel(blockType: string): string {
  return ARTICLE_COMPONENT_OPTIONS.find((option) => option.value === blockType)?.label ?? blockType;
}

export function summarizeArticleComponentFields(fields: ArticleComponentFields): string {
  switch (String(fields.blockType || '')) {
    case 'youtubeVideo': return String(fields.videoId || '');
    case 'xPost': case 'instagramPost': case 'tiktokVideo': case 'audioEmbed': return String(fields.url || '');
    case 'pullQuote': return String(fields.quote || '');
    case 'infoBox': return `${String(fields.tone || 'neutral')} ${String(fields.title || '').trim()}`.trim();
    case 'keyPoints': return `${Array.isArray(fields.points) ? fields.points.length : 0} points`;
    case 'relatedLinks': return `${Array.isArray(fields.links) ? fields.links.length : 0} links`;
    case 'dataTable': return `${Array.isArray(fields.headers) ? fields.headers.length : 0} columns`;
    case 'liveUpdate': return String(fields.headline || '');
    default: return '';
  }
}

// Executed only inside the isolated editor WebView. The regression suite checks
// every component type against summarizeArticleComponentFields above.
export const ARTICLE_COMPONENT_SUMMARY_WEB_SCRIPT = String.raw`
function summary(fields){switch(String(fields.blockType||'')){case'youtubeVideo':return String(fields.videoId||'');case'xPost':case'instagramPost':case'tiktokVideo':case'audioEmbed':return String(fields.url||'');case'pullQuote':return String(fields.quote||'');case'infoBox':return(String(fields.tone||'neutral')+' '+String(fields.title||'').trim()).trim();case'keyPoints':return(Array.isArray(fields.points)?fields.points.length:0)+' points';case'relatedLinks':return(Array.isArray(fields.links)?fields.links.length:0)+' links';case'dataTable':return(Array.isArray(fields.headers)?fields.headers.length:0)+' columns';case'liveUpdate':return String(fields.headline||'');default:return''}}
`;

function toPipeList(rawValue: string): string[] {
  return rawValue.split('|').map((entry) => entry.trim()).filter(Boolean);
}

export function buildArticleComponentFields(blockType: string, prompt: ArticleComponentPrompt, now: () => string = () => new Date().toISOString()): ArticleComponentFields | null {
  const required = (message: string, fallback = ''): string | null => {
    const value = prompt(message, fallback);
    if (value === null) return null;
    return value.trim() || null;
  };
  const optional = (message: string, fallback = ''): string | undefined => {
    const value = prompt(message, fallback);
    if (value === null) return undefined;
    return value.trim() || undefined;
  };
  switch (blockType) {
    case 'youtubeVideo': { const videoId = required('YouTube Video ID'); return videoId ? { blockType, videoId } : null; }
    case 'xPost': case 'instagramPost': case 'tiktokVideo': { const url = required('Post URL'); return url ? { blockType, url } : null; }
    case 'audioEmbed': { const url = required('Audio URL'); return url ? { blockType, url, title: optional('Audio title (optional)'), caption: optional('Audio caption (optional)') } : null; }
    case 'pullQuote': { const quote = required('Quote text'); return quote ? { blockType, quote, attribution: optional('Attribution (optional)') } : null; }
    case 'infoBox': {
      const tone = optional('Tone: neutral, info, warning, or success', 'neutral')?.toLowerCase();
      const html = required('Info box HTML');
      if (!html) return null;
      return { blockType, tone: tone === 'info' || tone === 'warning' || tone === 'success' ? tone : 'neutral', title: optional('Title (optional)'), html };
    }
    case 'keyPoints': {
      const raw = required('Points separated by |'); if (!raw) return null;
      const points = toPipeList(raw);
      return points.length ? { blockType, title: optional('Title (optional)', 'Key Points') || 'Key Points', points } : null;
    }
    case 'relatedLinks': {
      const raw = required('Links in format label,url|label,url'); if (!raw) return null;
      const links = raw.split('|').map((entry) => entry.trim()).filter(Boolean).map((entry) => {
        const [label, url] = entry.split(',').map((part) => part.trim());
        return label && url ? { label, url } : null;
      }).filter((entry): entry is { label: string; url: string } => Boolean(entry));
      return links.length ? { blockType, title: optional('Title (optional)', 'Related Coverage') || 'Related Coverage', links } : null;
    }
    case 'dataTable': {
      const headersRaw = required('Headers separated by |'); if (!headersRaw) return null;
      const headers = toPipeList(headersRaw).map((value) => ({ value })); if (!headers.length) return null;
      const rowsRaw = required('Rows in format cell,cell|cell,cell'); if (!rowsRaw) return null;
      const rows = rowsRaw.split('|').map((row) => row.trim()).filter(Boolean).map((row) => ({ cells: row.split(',').map((cell) => cell.trim()).filter(Boolean).map((value) => ({ value })) })).filter((row) => row.cells.length > 0);
      return rows.length ? { blockType, caption: optional('Caption (optional)'), headers, rows } : null;
    }
    case 'liveUpdate': {
      const headline = required('Headline'); if (!headline) return null;
      return { blockType, timestamp: optional('Timestamp (ISO, optional)', now()) || now(), headline, html: optional('HTML (optional)') };
    }
    default: return null;
  }
}

// Executed only inside the isolated editor WebView. The regression suite compares
// this output with buildArticleComponentFields for every supported block type.
export const ARTICLE_COMPONENT_WEB_SCRIPT = String.raw`
function toPipeList(rawValue){return rawValue.split('|').map(entry=>entry.trim()).filter(Boolean)}
function buildArticleComponentFields(blockType,prompt,now){
 const required=(message,fallback='')=>{const value=prompt(message,fallback);if(value===null)return null;return value.trim()||null};
 const optional=(message,fallback='')=>{const value=prompt(message,fallback);if(value===null)return undefined;return value.trim()||undefined};
 switch(blockType){
 case'youtubeVideo':{const videoId=required('YouTube Video ID');return videoId?{blockType,videoId}:null}
 case'xPost':case'instagramPost':case'tiktokVideo':{const url=required('Post URL');return url?{blockType,url}:null}
 case'audioEmbed':{const url=required('Audio URL');return url?{blockType,url,title:optional('Audio title (optional)'),caption:optional('Audio caption (optional)')}:null}
 case'pullQuote':{const quote=required('Quote text');return quote?{blockType,quote,attribution:optional('Attribution (optional)')}:null}
 case'infoBox':{const tone=optional('Tone: neutral, info, warning, or success','neutral')?.toLowerCase();const html=required('Info box HTML');if(!html)return null;return{blockType,tone:tone==='info'||tone==='warning'||tone==='success'?tone:'neutral',title:optional('Title (optional)'),html}}
 case'keyPoints':{const raw=required('Points separated by |');if(!raw)return null;const points=toPipeList(raw);return points.length?{blockType,title:optional('Title (optional)','Key Points')||'Key Points',points}:null}
 case'relatedLinks':{const raw=required('Links in format label,url|label,url');if(!raw)return null;const links=raw.split('|').map(entry=>entry.trim()).filter(Boolean).map(entry=>{const[label,url]=entry.split(',').map(part=>part.trim());return label&&url?{label,url}:null}).filter(Boolean);return links.length?{blockType,title:optional('Title (optional)','Related Coverage')||'Related Coverage',links}:null}
 case'dataTable':{const headersRaw=required('Headers separated by |');if(!headersRaw)return null;const headers=toPipeList(headersRaw).map(value=>({value}));if(!headers.length)return null;const rowsRaw=required('Rows in format cell,cell|cell,cell');if(!rowsRaw)return null;const rows=rowsRaw.split('|').map(row=>row.trim()).filter(Boolean).map(row=>({cells:row.split(',').map(cell=>cell.trim()).filter(Boolean).map(value=>({value}))})).filter(row=>row.cells.length);return rows.length?{blockType,caption:optional('Caption (optional)'),headers,rows}:null}
 case'liveUpdate':{const headline=required('Headline');if(!headline)return null;return{blockType,timestamp:optional('Timestamp (ISO, optional)',now())||now(),headline,html:optional('HTML (optional)')}}
 default:return null
 }}
`;
