import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import katex from '../assets/katex/katex.mjs';
import {mathText,equation,formulaBlock,mathOptions} from '../js/math.js';
import {LABS,renderLab,resetLab,labState} from '../js/labs.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const files=['curriculum','lesson-content','exams','videos'].map(n=>read('data/'+n+'.json'));
function strings(x,path='',callback){
 if(typeof x==='string')callback(x,path);
 else if(x&&typeof x==='object')for(const[k,v]of Object.entries(x))strings(v,path+'.'+k,callback);
}
test('all authored inline/display math has balanced delimiters and parses strictly',()=>{
 let count=0;
 for(const content of files)strings(content,'',(text,path)=>{
  if(path.endsWith('.code')||path.endsWith('.expected'))return;
  const pattern=/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g;
  for(const m of text.matchAll(pattern)){
   const tex=m[1]??m[2];assert.ok(!/\\[()[\]]/.test(tex),'nested delimiters: '+path);
   assert.doesNotThrow(()=>katex.renderToString(tex,{...mathOptions,displayMode:m[2]!==undefined}),path);
   count++;
  }
  assert.ok(!/\\[()[\]]/.test(text.replace(pattern,'')),'unbalanced delimiter: '+path);
  assert.ok(!text.includes('\0'),'conversion placeholder: '+path);
 });
 assert.ok(count>1500);
});
test('reviewable original-to-TeX conversion inventory parses without errors',()=>{
 const conversions=read('tests/fixtures/math-conversions.json');assert.ok(conversions.length>400);
 for(const c of conversions){assert.ok(c.original);assert.doesNotThrow(()=>katex.renderToString(c.tex,mathOptions),c.original);}
});
test('seven formula blocks retain bilingual fallback and accessible MathML',()=>{
 const blocks=files[1].sections.flatMap(s=>s.blocks).filter(b=>b.formula);
 assert.equal(blocks.length,7);
 for(const b of blocks){assert.ok(b.formula.fallback.en);assert.ok(b.formula.fallback.zh);
  for(const lang of ['en','zh']){const html=formulaBlock(b.formula,lang);assert.ok(html.includes('<math'));assert.ok(!html.includes('math-fallback'));}
 }
});
test('text is escaped, invalid TeX falls back, and trusted HTML/link commands are disabled',()=>{
 assert.equal(mathText('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
 assert.ok(equation(String.raw`\broken{`,true,'a < b').includes('a &lt; b'));
 for(const tex of [String.raw`\href{javascript:alert(1)}{click}`,String.raw`\htmlClass{evil}{x}`,String.raw`\includegraphics{https://example.com/a.png}`]){
  const html=equation(tex);assert.ok(!html.includes('<a '));assert.ok(!html.includes('<img '));assert.ok(!html.includes('class="evil"'));
 }
 assert.ok(mathText(String.raw`Cost $5; \(x^2\) and \[\frac{1}{2}\]`).includes('Cost $5;'));
 assert.equal(mathText('Python: **, $, [1,2], and ='), 'Python: **, $, [1,2], and =');
});
test('all mathematical labs render both languages, update, reset and handle invalid inputs',()=>{
 const mathLabs=['vectors','probability','regression','gradient','knn','kmeans','neuron','convolution','metrics'];
 for(const lang of ['en','zh'])for(const [id]of LABS){
  resetLab(id);const b=(en,zh)=>lang==='zh'?zh:en;
  let html=renderLab(id,b,x=>String(x));assert.ok(!html.includes('math-fallback'),id);
  if(mathLabs.includes(id))assert.ok(html.includes('<math'),id);
  if(['gradient','convolution','kmeans'].includes(id)){labState.step=1;html=renderLab(id,b,x=>String(x));assert.ok(!html.includes('math-fallback'));resetLab(id);assert.equal(labState.step,0);}
 }
 resetLab('metrics');labState.params={tp:'0',fp:'0',fn:'0',tn:'0'};
 assert.match(renderLab('metrics',(en)=>en,String),/Undefined: zero denominator/);
 resetLab('vectors');labState.params.a='not a vector';assert.ok(!renderLab('vectors',(en)=>en,String).includes('<math'));
});
test('renderer scripts, styles, font references and licenses are cached locally',()=>{
 const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
 for(const p of ['js/math.js','js/lab-math.js','assets/katex/katex.mjs','assets/katex/katex.min.css','assets/katex/LICENSE'])assert.ok(sw.includes('./'+p));
 const css=readFileSync(new URL('../assets/katex/katex.min.css',import.meta.url),'utf8');
 for(const m of css.matchAll(/url\((fonts\/[^)]+)\)/g)){const p='assets/katex/'+m[1];assert.ok(existsSync(new URL('../'+p,import.meta.url)),p);assert.ok(sw.includes('./'+p),p);}
});
