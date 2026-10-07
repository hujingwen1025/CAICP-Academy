import katex from '../assets/katex/katex.mjs';

export const escapeText = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const mathOptions = Object.freeze({output:'htmlAndMathml', trust:false, strict:'error', throwOnError:true, maxExpand:1000, maxSize:20});
const cache = new Map();

export function equation(tex, display=false, fallback=tex) {
  const key=JSON.stringify([tex,display,fallback]);
  if(cache.has(key))return cache.get(key);
  let html;
  try {
    html=`<span class="math-${display?'display':'inline'}"${display?' tabindex="0"':''}>${katex.renderToString(String(tex), {...mathOptions,displayMode:display,macros:{}})}</span>`;
  } catch {
    html=`<span class="math-fallback ${display?'math-display':''}">${escapeText(fallback)}</span>`;
  }
  if(cache.size>=2000)cache.clear();
  cache.set(key,html);
  return html;
}

// Only explicit authored delimiters are interpreted; everything else is escaped.
// Call from text slots, never attributes, user notes, code or program output.
export function mathText(value) {
  const text=String(value??'');
  const pattern=/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g;
  let html='',last=0;
  for(const match of text.matchAll(pattern)) {
    html+=escapeText(text.slice(last,match.index));
    html+=equation(match[1]??match[2],match[2]!==undefined);
    last=match.index+match[0].length;
  }
  return html+escapeText(text.slice(last));
}

export function formulaBlock(formula,lang='en') {
  if(typeof formula==='string')return `<div class="formula">${escapeText(formula)}</div>`;
  const fallback=formula.fallback?.[lang]??formula.tex;
  return `<div class="formula">${equation(formula.tex,true,fallback)}</div>`;
}
