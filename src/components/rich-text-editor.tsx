import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { useThompsonTheme } from '../theme';

export interface RichTextDocument { root: { children: unknown[]; direction?: null | string; format?: string; indent?: number; type: 'root'; version: number } }
export interface RichTextEditorProps extends ViewProps { minHeight?: number; onChange: (value: RichTextDocument) => void; value?: RichTextDocument | null; }

function safeJson(value: unknown) { return JSON.stringify(value ?? null).replace(/</g, '\\u003c').replace(/-->/g, '--\\>'); }

export function RichTextEditor({ minHeight = 320, onChange, style, value, ...props }: RichTextEditorProps) {
  const { theme } = useThompsonTheme();
  const initial = React.useRef(value);
  const html = React.useMemo(() => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><style>
  *{box-sizing:border-box}body{margin:0;background:${theme.colors.card};color:${theme.colors.textPrimary};font:15px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.toolbar{display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:${theme.colors.muted};border-bottom:1px solid ${theme.colors.border};position:sticky;top:0;z-index:2}.toolbar button,.toolbar select{height:34px;min-width:34px;padding:0 8px;border:1px solid ${theme.colors.border};border-radius:7px;background:${theme.colors.card};color:${theme.colors.textPrimary};font-weight:600}.editor{min-height:${Math.max(180, minHeight - 52)}px;padding:15px;outline:0;line-height:1.55}p{margin:0 0 11px}h2,h3{margin:16px 0 9px}blockquote{margin:12px 0;padding-left:12px;border-left:3px solid ${theme.colors.sea}}
  </style></head><body><div class="toolbar"><button data-command="undo">↶</button><button data-command="redo">↷</button><button data-command="bold"><b>B</b></button><button data-command="italic"><i>I</i></button><button data-command="underline"><u>U</u></button><button data-command="insertUnorderedList">• List</button><select id="block"><option value="p">Text</option><option value="h2">Heading</option><option value="h3">Subheading</option><option value="blockquote">Quote</option></select></div><div id="editor" class="editor" contenteditable="true"></div><script>
  const initial=${safeJson(initial.current)};const editor=document.getElementById('editor');
  function esc(s){return String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
  function nodeHtml(n){if(!n)return '';const tag=n.tag||({heading:n.tag,quote:'blockquote',paragraph:'p'}[n.type])||'span';if(n.type==='text'){let s=esc(n.text);if(n.format&1)s='<b>'+s+'</b>';if(n.format&2)s='<i>'+s+'</i>';if(n.format&8)s='<u>'+s+'</u>';return s}return '<'+tag+'>'+((n.children||[]).map(nodeHtml).join('')||'<br>')+'</'+tag+'>'}
  if(initial&&initial.root)editor.innerHTML=(initial.root.children||[]).map(nodeHtml).join('');
  function textNode(text,el){let format=0;if(el.closest('b,strong'))format|=1;if(el.closest('i,em'))format|=2;if(el.closest('u'))format|=8;return {detail:0,format,mode:'normal',style:'',text,type:'text',version:1}}
  function serialize(el){const type=el.tagName==='BLOCKQUOTE'?'quote':/^H[1-6]$/.test(el.tagName)?'heading':el.tagName==='UL'||el.tagName==='OL'?'list':'paragraph';const children=[];function walk(n){if(n.nodeType===3){if(n.textContent)children.push(textNode(n.textContent,n.parentElement));return}if(n.tagName==='BR')return;Array.from(n.childNodes).forEach(walk)}walk(el);return {children,direction:null,format:'',indent:0,type,version:1,...(type==='heading'?{tag:el.tagName.toLowerCase()}:{})}}
  function send(){ReactNativeWebView.postMessage(JSON.stringify({root:{children:Array.from(editor.children).map(serialize),direction:null,format:'',indent:0,type:'root',version:1}}))}
  document.querySelectorAll('[data-command]').forEach(button=>button.addEventListener('click',()=>{document.execCommand(button.dataset.command,false);editor.focus();send()}));document.getElementById('block').addEventListener('change',event=>{document.execCommand('formatBlock',false,event.target.value);event.target.value='p';editor.focus();send()});editor.addEventListener('input',send);
  </script></body></html>`, [minHeight, theme.colors.border, theme.colors.card, theme.colors.muted, theme.colors.sea, theme.colors.textPrimary]);
  const handleMessage = (event: WebViewMessageEvent) => { try { const document = JSON.parse(event.nativeEvent.data) as RichTextDocument; if (document?.root?.type === 'root' && Array.isArray(document.root.children)) onChange(document); } catch { /* Preserve the last valid document. */ } };
  return <View style={[styles.frame, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, height: minHeight }, style]} {...props}><WebView javaScriptEnabled onMessage={handleMessage} originWhitelist={['about:blank']} scrollEnabled={false} source={{ html }} style={{ backgroundColor: theme.colors.card }} /></View>;
}

const styles = StyleSheet.create({ frame: { borderRadius: 8, borderWidth: 1, overflow: 'hidden' } });
