import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { useThompsonTheme } from '../theme';
import { ARTICLE_COMPONENT_OPTIONS, ARTICLE_COMPONENT_SUMMARY_WEB_SCRIPT, ARTICLE_COMPONENT_WEB_SCRIPT } from './rich-text-contract';
import { articleComponentToolbarHtml, escapeHtmlAttribute, isRichTextDocument, RICH_TEXT_HTML_WEB_SCRIPT, type RichTextDocument } from './rich-text-html';

export interface RichTextEditorProps extends ViewProps {
  articleComponents?: boolean;
  minHeight?: number;
  onChange: (value: RichTextDocument) => void;
  placeholder?: string;
  value?: RichTextDocument | null;
}

function safeJson(value: unknown): string {
  return JSON.stringify(value ?? null).replace(/</g, '\\u003c').replace(/-->/g, '--\\>');
}

export function RichTextEditor({ articleComponents = false, minHeight = 320, onChange, placeholder = 'Start typing...', style, value, ...props }: RichTextEditorProps) {
  const { theme } = useThompsonTheme();
  const initial = React.useRef(value);
  const componentToolbar = articleComponentToolbarHtml(articleComponents, ARTICLE_COMPONENT_OPTIONS);
  const cleanPlaceholder = escapeHtmlAttribute(placeholder);
  const labels = Object.fromEntries(ARTICLE_COMPONENT_OPTIONS.map((option) => [option.value, option.label]));
  const validInitial = initial.current ? isRichTextDocument(initial.current) : false;
  const html = React.useMemo(() => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><style>
*{box-sizing:border-box}body{margin:0;background:${theme.colors.card};color:${theme.colors.textPrimary};font:15px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.toolbar{display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:${theme.colors.muted};border-bottom:1px solid ${theme.colors.border};position:sticky;top:0;z-index:2}.toolbar button,.toolbar select{height:34px;min-width:34px;padding:0 8px;border:1px solid ${theme.colors.border};border-radius:7px;background:${theme.colors.card};color:${theme.colors.textPrimary};font-weight:600}.editor{min-height:${Math.max(180, minHeight - 52)}px;padding:15px;outline:0;line-height:1.55}.editor:empty:before{content:attr(data-placeholder);color:${theme.colors.textSecondary};pointer-events:none}.component,.unknown{margin:10px 0;padding:9px 11px;border:1px solid ${theme.colors.sea};border-radius:7px;background:${theme.colors.muted};font-size:12px}.unknown{border-color:${theme.colors.border}}.error{padding:18px;color:${theme.colors.textSecondary}}p{margin:0 0 11px}h1,h2,h3{margin:16px 0 9px}blockquote{margin:12px 0;padding-left:12px;border-left:3px solid ${theme.colors.sea}}
</style></head><body><div class="toolbar"><button data-command="undo" title="Undo">↶</button><button data-command="redo" title="Redo">↷</button><button data-command="bold" title="Bold"><b>B</b></button><button data-command="italic" title="Italic"><i>I</i></button><button data-command="underline" title="Underline"><u>U</u></button><button data-align="left" title="Align left">≡</button><button data-align="center" title="Align center">≣</button><button data-align="right" title="Align right">≡</button>${componentToolbar}</div><div id="editor" class="editor" data-placeholder="${cleanPlaceholder}" contenteditable="true"></div><script>
const initial=${safeJson(initial.current)};const validInitial=${safeJson(validInitial)};const editor=document.getElementById('editor');const labels=${safeJson(labels)};
${RICH_TEXT_HTML_WEB_SCRIPT}
${ARTICLE_COMPONENT_SUMMARY_WEB_SCRIPT}
function componentHtml(rawFields){const fields=rawFields&&typeof rawFields==='object'?rawFields:{blockType:'unknown'};const label=labels[fields.blockType]||fields.blockType||'';const detail=summary(fields);return '<div class="component" contenteditable="false" data-fields="'+encode(fields)+'">'+esc(label)+(detail?' • '+esc(detail):'')+'</div>'}
function textHtml(node){let output=esc(node.text);if(node.format&1)output='<b>'+output+'</b>';if(node.format&2)output='<i>'+output+'</i>';if(node.format&8)output='<u>'+output+'</u>';return output}
function nodeHtml(node){if(!node||typeof node!=='object')return'';if(node.type==='block')return componentHtml(node.fields);if(node.type==='text')return textHtml(node);const heading=/^h[1-6]$/.test(node.tag)?node.tag:'h2';const list=node.tag==='ol'||node.tag==='ul'?node.tag:(node.listType==='number'?'ol':'ul');const known={paragraph:'p',heading,quote:'blockquote',list,listitem:'li'};const tag=known[node.type];if(!tag)return '<div class="unknown" contenteditable="false" data-preserved="'+encode(node)+'">Unknown content</div>';const metadata={...node};delete metadata.children;const content=(Array.isArray(node.children)?node.children:[]).map(nodeHtml).join('')||'<br>';return '<'+tag+' data-node="'+encode(metadata)+'"'+(metadata.format?' style="text-align:'+escAttr(metadata.format)+'"':'')+'>'+content+'</'+tag+'>'}
if(initial&&!validInitial){editor.contentEditable='false';editor.innerHTML='<div class="error">Error loading editor</div>'}else if(validInitial){editor.innerHTML=initial.root.children.map(nodeHtml).join('')}
function textNode(text,element){let format=0;if(element.closest('b,strong'))format|=1;if(element.closest('i,em'))format|=2;if(element.closest('u'))format|=8;return{detail:0,format,mode:'normal',style:'',text,type:'text',version:1}}
function serialize(element){if(element.classList.contains('component'))return{type:'block',version:1,fields:decode(element.dataset.fields,{blockType:'unknown'})};if(element.classList.contains('unknown'))return decode(element.dataset.preserved,{type:'unknown',version:1});const metadata=decode(element.dataset.node,{});const children=[];function walk(node){if(node.nodeType===3){if(node.textContent)children.push(textNode(node.textContent,node.parentElement));return}if(node.tagName==='BR')return;if(node!==element&&(node.dataset?.node||node.classList?.contains('component')||node.classList?.contains('unknown'))){children.push(serialize(node));return}Array.from(node.childNodes).forEach(walk)}walk(element);const fallbackType=element.tagName==='BLOCKQUOTE'?'quote':/^H[1-6]$/.test(element.tagName)?'heading':element.tagName==='UL'||element.tagName==='OL'?'list':element.tagName==='LI'?'listitem':'paragraph';return{...metadata,children,direction:metadata.direction??null,format:element.style.textAlign||metadata.format||'',indent:metadata.indent||0,type:metadata.type||fallbackType,version:metadata.version||1,...(fallbackType==='heading'&&!metadata.tag?{tag:element.tagName.toLowerCase()}:{})}}
function documentValue(){return{root:{children:Array.from(editor.children).map(serialize),direction:initial?.root?.direction??null,format:initial?.root?.format||'',indent:initial?.root?.indent||0,type:'root',version:initial?.root?.version||1}}}
function send(){if(validInitial||!initial)ReactNativeWebView.postMessage(JSON.stringify(documentValue()))}
${ARTICLE_COMPONENT_WEB_SCRIPT}
function insertComponent(){const type=document.getElementById('component-type').value;const fields=buildArticleComponentFields(type,window.prompt.bind(window),()=>new Date().toISOString());if(!fields)return;const wrapper=document.createElement('div');wrapper.innerHTML=componentHtml(fields);const component=wrapper.firstElementChild;const paragraph=document.createElement('p');paragraph.appendChild(document.createElement('br'));const selection=window.getSelection();let topLevel=null;if(selection?.rangeCount&&editor.contains(selection.anchorNode)){topLevel=selection.anchorNode.nodeType===1?selection.anchorNode:selection.anchorNode.parentElement;while(topLevel?.parentElement!==editor)topLevel=topLevel?.parentElement}if(topLevel){topLevel.after(component,paragraph)}else{editor.append(component,paragraph)}const range=document.createRange();range.setStart(paragraph,0);range.collapse(true);selection?.removeAllRanges();selection?.addRange(range);send()}
document.querySelectorAll('[data-command]').forEach(button=>button.addEventListener('click',()=>{document.execCommand(button.dataset.command,false);editor.focus();send()}));document.querySelectorAll('[data-align]').forEach(button=>button.addEventListener('click',()=>{document.execCommand('justify'+button.dataset.align,false);editor.focus();send()}));document.getElementById('insert-component')?.addEventListener('click',insertComponent);editor.addEventListener('input',send);
</script></body></html>`, [cleanPlaceholder, componentToolbar, labels, minHeight, theme.colors.border, theme.colors.card, theme.colors.muted, theme.colors.sea, theme.colors.textPrimary, theme.colors.textSecondary, validInitial]);
  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const document = JSON.parse(event.nativeEvent.data) as RichTextDocument;
      if (document?.root?.type === 'root' && Array.isArray(document.root.children)) onChange(document);
    } catch {
      // Match Auburndale's fail-closed behavior by retaining the last valid value.
    }
  };
  return <View style={[styles.frame, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, height: minHeight }, style]} {...props}><WebView javaScriptEnabled onMessage={handleMessage} originWhitelist={['about:blank']} scrollEnabled={false} source={{ html }} style={{ backgroundColor: theme.colors.card }} /></View>;
}

const styles = StyleSheet.create({ frame: { borderRadius: 10, borderWidth: 1, overflow: 'hidden' } });
