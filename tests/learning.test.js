import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {learningBlocks,videoCard,embedURL,contents,diagram,activateVideo} from '../js/learning.js';
import {LABS} from '../js/labs.js';
import {EXERCISES} from '../js/python.js';
const read=name=>JSON.parse(readFileSync(new URL('../data/'+name+'.json',import.meta.url)));
const content=read('lesson-content'),curriculum=read('curriculum'),catalog=read('videos'),coverage=read('coverage'),playerChecks=read('video-player-checks');
const blocks=content.sections.flatMap(s=>s.blocks),concepts=new Map(blocks.map(b=>[b.id,b]));
const bilingual=x=>{assert.ok(x.en?.trim());assert.ok(x.zh?.trim());};
test('every stable lesson has bilingual structured concepts, sources and retrieval prompts',()=>{
 assert.deepEqual(content.sections.map(s=>s.id),curriculum.lessons.map(s=>s.id));
 assert.equal(concepts.size,blocks.length);const checks=new Set();
 for(const b of blocks){bilingual(b.title);assert.ok(b.paragraphs.length);b.paragraphs.forEach(bilingual);assert.ok(b.pages.length);for(const p of b.pages)assert.ok(Number.isInteger(p)&&p>=1&&p<=239);assert.ok(b.checks.length);
  for(const q of b.checks){assert.ok(!checks.has(q.id));checks.add(q.id);bilingual(q.prompt);bilingual(q.answer);}
  if(b.table){b.table.headers.forEach(bilingual);for(const row of b.table.rows){assert.equal(row.length,b.table.headers.length);row.forEach(bilingual);}}
  if(b.lab)assert.ok(LABS.some(l=>l[0]===b.lab));if(b.exercise)assert.ok(EXERCISES.some(e=>e.id===b.exercise));
 }
 content.studyGuide.forEach(bilingual);
});
test('video citations, IDs, concept mappings and verified segments are valid',()=>{
 const vids=new Map(catalog.videos.map(v=>[v.id,v]));assert.equal(vids.size,catalog.videos.length);const placements=new Set();
 for(const v of vids.values()){const check=playerChecks.checks.filter(c=>c.id===v.id).at(-1);assert.ok(check);assert.ok(!check.inspectionError);assert.equal(check.error,null);assert.match(v.id,/^[\w-]{11}$/);for(const key of ['title','creator','creatorUrl','url','checkedAt','license','creatorSource'])assert.ok(v[key]);assert.ok(['https://www.youtube.com/watch?v='+v.id,'https://youtu.be/'+v.id].includes(v.url));assert.equal(v.verification.oembed,'available');assert.equal(v.verification.embedAllowed,true);assert.equal(v.verification.watchStatus,'OK');assert.ok(v.duration>0);}
 for(const p of catalog.placements){assert.ok(!placements.has(p.id));placements.add(p.id);assert.ok(concepts.has(p.conceptId));assert.equal(p.conceptId.split('-')[1],p.lessonId);const v=vids.get(p.videoId);assert.ok(v);assert.ok(p.start>=0&&p.start<v.duration);if(p.end!=null)assert.ok(p.end>p.start&&p.end<=v.duration);for(const k of ['label','lookFor','guidance','followUp'])bilingual(p[k]);assert.ok(['direct','background'].includes(p.coverage));}
 for(const s of content.sections)assert.ok(catalog.placements.some(p=>p.lessonId===s.id&&p.kind==='major'));
});
test('players remain click-to-load with citations beneath their stage in both languages',()=>{
 for(const lang of ['en','zh'])for(const p of catalog.placements){const html=videoCard(p,catalog,lang);assert.ok(!html.includes('<iframe'));assert.ok(!html.includes('<img'));assert.ok(html.indexOf('video-citation')>html.indexOf('data-video-slot'));assert.ok(html.includes('rel="noopener noreferrer"'));if(p.kind==='detail')assert.match(html,/^<details[^>]*>/);}
 const p=catalog.placements.find(p=>p.end!=null),v=catalog.videos.find(v=>v.id===p.videoId),url=new URL(embedURL(v,p,'http://localhost:4173'));
 assert.equal(url.hostname,'www.youtube-nocookie.com');assert.equal(url.searchParams.get('controls'),'1');assert.equal(url.searchParams.get('origin'),'http://localhost:4173');assert.equal(url.searchParams.get('start'),String(p.start));assert.equal(url.searchParams.get('end'),String(p.end));assert.equal(url.searchParams.has('autoplay'),false);
});
test('concept anchors, accessible diagrams and localized rendering stay aligned',()=>{
 for(const s of content.sections)for(const lang of ['en','zh']){const html=learningBlocks(s,catalog,lang),nav=contents(s,lang);for(const b of s.blocks){assert.ok(html.includes('id="'+b.id+'"'));assert.ok(nav.includes('#lesson/'+s.id+'/'+b.id));if(b.diagram){const drawing=diagram(b,lang);assert.ok(drawing.includes('role="img"'));assert.ok(drawing.includes('<figcaption>'));}}}
});
test('coverage inventories every printed page and numbered figure/table with valid destinations',()=>{
 const items=new Map(coverage.items.map(i=>[i.id,i]));assert.equal(items.size,coverage.items.length);
 for(let p=1;p<=287;p++)assert.ok(items.has('page-'+String(p).padStart(3,'0')));
 for(const i of items.values()){assert.ok(i.destinations.length);assert.ok(i.page>=1&&i.page<=287);for(const d of i.destinations){if(d.startsWith('concept-')){assert.ok(concepts.has(d));assert.ok(concepts.get(d).pages.includes(i.page));}else assert.match(d,/^(curriculum-navigation|routes:[EJS][12]|bilingual-glossary|study-guide|paper:[EJS]|answer-keys:[EJS])$/);}}
 assert.equal(coverage.items.filter(i=>['diagram','table'].includes(i.kind)).length,89);
});
test('all expanded assets are present in the scoped offline cache',()=>{
 const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');for(const path of ['js/learning.js','data/lesson-content.json','data/videos.json','data/coverage.json'])assert.ok(sw.includes('./'+path));for(const m of sw.matchAll(/'\.\/([^']+)'/g))assert.ok(existsSync(new URL('../'+m[1],import.meta.url)));assert.ok(!sw.includes('youtube.com/embed'));
});
test('offline video activation leaves lesson content usable and reports connectivity',()=>{
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,'navigator');
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{onLine:false}});
 try{
  const p=catalog.placements[0],message={textContent:''};
  const stage={dataset:{videoSlot:p.id},querySelector:()=>null,closest:()=>({querySelector:()=>message})};
  assert.equal(activateVideo({querySelectorAll:()=>[stage]},p.id,catalog,'en'),false);
  assert.match(message.textContent,/offline/);
  assert.equal(activateVideo({querySelectorAll:()=>[stage]},p.id,catalog,'zh'),false);
  assert.match(message.textContent,/离线/);
 }finally{if(descriptor)Object.defineProperty(globalThis,'navigator',descriptor);else delete globalThis.navigator;}
});
