// Educational rendering is independent of saved-progress schema v1.
export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e=escapeHTML;
export function diagram(x,lang){
 if(!x.diagram)return '';
 const b=(en,zh)=>lang==='zh'?zh:en;
 let svg='';
 if(x.diagram.kind==='venn')svg=`<rect x="15" y="15" width="420" height="180" rx="8" fill="none" class="edge"/><circle cx="175" cy="105" r="70" class="node"/><circle cx="275" cy="105" r="70" class="node" opacity=".65"/><text x="40" y="40">U</text><text x="125" y="65">A</text><text x="310" y="65">B</text><text x="132" y="110">1,2</text><text x="212" y="110">3,4</text><text x="318" y="110">5</text><text x="365" y="170">6,7,8</text>`;
 if(x.diagram.kind==='graph'){
  const pts={S:[40,100],A:[155,40],B:[155,160],C:[280,40],D:[280,160],T:[405,100]};
  svg=[['S','A'],['S','B'],['A','C'],['A','D'],['B','D'],['C','T'],['D','T']].map(([a,z])=>`<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[z][0]}" y2="${pts[z][1]}" class="edge"/>`).join('')+Object.entries(pts).map(([label,[cx,cy]])=>`<circle cx="${cx}" cy="${cy}" r="23" class="node"/><text x="${cx}" y="${cy+5}" text-anchor="middle">${label}</text>`).join('');
 }
 if(x.diagram.kind==='network'){
  const nodes=[[60,55,'x₁'],[60,145,'x₂'],[220,55,'h₁'],[220,145,'h₂'],[390,100,'y']];
  svg=[[0,2],[0,3],[1,2],[1,3],[2,4],[3,4]].map(([a,z])=>`<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[z][0]}" y2="${nodes[z][1]}" class="edge"/>`).join('')+nodes.map(([cx,cy,label])=>`<circle cx="${cx}" cy="${cy}" r="27" class="node"/><text x="${cx}" y="${cy+5}" text-anchor="middle">${label}</text>`).join('');
 }
 if(x.diagram.kind==='convolution'){
  const grid=(vals,ox,oy)=>vals.flatMap((row,r)=>row.map((v,c)=>`<rect x="${ox+c*40}" y="${oy+r*40}" width="40" height="40" class="node"/><text x="${ox+c*40+20}" y="${oy+r*40+25}" text-anchor="middle">${v}</text>`)).join('');
  svg=grid([[1,2,0],[0,1,3],[2,1,0]],20,45)+grid([[1,0],[0,-1]],190,65)+grid([[0,-1],[-1,1]],340,65)+`<text x="160" y="110">⋆</text><text x="298" y="110">→</text><text x="25" y="190">${b('Input','输入')}</text><text x="185" y="190">${b('Shared kernel','共享卷积核')}</text><text x="345" y="190">${b('Output','输出')}</text>`;
 }
 if(x.diagram.kind==='histogram')svg=`<line x1="60" y1="165" x2="390" y2="165" class="edge"/>`+[1,5,6].map((v,i)=>`<rect x="${70+i*100}" y="${165-v*20}" width="100" height="${v*20}" class="node"/><text x="${120+i*100}" y="${155-v*20}" text-anchor="middle">${v}</text><text x="${120+i*100}" y="190" text-anchor="middle">${['[0,2)','[2,4)','[4,6)'][i]}</text>`).join('');
 return `<figure class="concept-diagram"><svg viewBox="0 0 450 210" role="img" aria-label="${e(x.diagram.caption[lang])}">${svg}</svg><figcaption>${e(x.diagram.caption[lang])}</figcaption></figure>`;
}
export function timeLabel(seconds){const n=Math.floor(seconds);return `${Math.floor(n/3600)?Math.floor(n/3600)+':':''}${String(Math.floor(n/60)%60).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;}
export function embedURL(video,placement,origin){const url=new URL(`https://www.youtube-nocookie.com/embed/${video.id}`);url.searchParams.set('start',String(placement.start||0));if(placement.end!=null)url.searchParams.set('end',String(placement.end));url.searchParams.set('playsinline','1');url.searchParams.set('controls','1');if(origin)url.searchParams.set('origin',origin);return url.href;}
export function videoCard(p,catalog,lang){const v=catalog.videos.find(x=>x.id===p.videoId);if(!v)return '';const b=(en,zh)=>lang==='zh'?zh:en,loc=x=>x?.[lang]||'';const segment=p.end!=null?`${timeLabel(p.start)}–${timeLabel(p.end)}`:p.start?`${timeLabel(p.start)} ${b('onward','起')}`:b('Full video','完整视频')+(v.duration?' · '+timeLabel(v.duration):'');
 const content=`<figure class="video-card" data-video-id="${e(p.id)}"><div class="video-heading"><span class="tag">${p.coverage==='direct'?b('CONCEPT VIDEO','概念视频'):b('BACKGROUND VIDEO','背景视频')}</span><h3>${e(v.title)}</h3></div><p class="small"><strong>${b('Look for:','观察重点：')}</strong> ${e(loc(p.lookFor))}</p><div class="video-stage" data-video-slot="${e(p.id)}"><div class="video-poster"><span class="play-symbol" aria-hidden="true">▷</span><p>${b('Watch, then explain it yourself.','看完后，用自己的话解释。')}</p><button class="primary" data-action="video-load" data-id="${e(p.id)}">${b('Load video','加载视频')}</button><span class="small">${b('Connects to YouTube only after you choose to load. No autoplay.','选择加载后才连接YouTube，不自动播放。')}</span></div></div><figcaption class="video-citation">${e(v.creator)} · ${e(v.title)} · YouTube${v.publishedAt?' · '+e(v.publishedAt):''} · <a href="${e(v.url)}" target="_blank" rel="noopener noreferrer">${b('Original source ↗','原始来源 ↗')}</a><br>${b('Audio:','语音：')} ${v.language==='zh'?b('Mandarin Chinese','中文普通话'):b('English','英语')} · ${b('Recommended:','建议片段：')} ${segment} · ${b('Source checked','来源检查')} ${e(v.checkedAt)}</figcaption><p class="small muted">${e(loc(p.guidance))}</p><div class="video-controls"><button data-action="video-close" data-id="${e(p.id)}" class="video-close" hidden>${b('Unload player','关闭播放器')}</button><span class="video-message small" role="status">${b('Video needs connectivity. If blocked, use the original link; the lesson remains available.','视频需要网络。若被阻止，可用原链接；课程仍可学习。')}</span></div><div class="retrieval"><strong>${b('After watching:','观看后：')}</strong> ${e(loc(p.followUp))}</div></figure>`;
 return p.kind==='detail'?`<details class="video-detail" data-key="${e(p.id)}"><summary>${b('Watch this detail','观看这个细节')} · ${e(loc(p.label))}</summary>${content}</details>`:content;
}
export function contents(section,lang){const b=(en,zh)=>lang==='zh'?zh:en;return `<nav class="concept-nav" aria-label="${b('Lesson contents','本节目录')}"><h3>${b('In this lesson','本节内容')}</h3><ol>${section.blocks.map(x=>`<li><a href="#lesson/${section.id}/${x.id}" data-action="concept-jump" data-id="${x.id}">${e(x.title[lang])}${x.expanded?` <span class="small muted">${b('(expand)','（展开）')}</span>`:''}</a></li>`).join('')}</ol></nav>`;}
export function learningBlocks(section,catalog,lang){const b=(en,zh)=>lang==='zh'?zh:en,loc=x=>x?.[lang]||'';
 return section.blocks.map((x,i)=>{
 const body=`${x.paragraphs.map(p=>`<p>${e(loc(p))}</p>`).join('')}${diagram(x,lang)}${x.formula?`<div class="formula" role="math" aria-label="${e(x.formula)}">${e(x.formula)}</div>`:''}${x.flow?`<div class="concept-flow" aria-label="${b('Process in text','文字流程')}">${e(loc(x.flow))}</div>`:''}${x.table?`<div class="table-scroll" role="region" tabindex="0" aria-label="${e(loc(x.title))}"><table><caption class="sr-only">${e(loc(x.title))}</caption><thead><tr>${x.table.headers.map(h=>`<th scope="col">${e(loc(h))}</th>`).join('')}</tr></thead><tbody>${x.table.rows.map(r=>`<tr>${r.map((v,j)=>j===0?`<th scope="row">${e(loc(v))}</th>`:`<td>${e(loc(v))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:''}${x.code?`<details class="code-example"><summary>${b('Try the Python example','尝试Python示例')}</summary><pre><code>${e(x.code)}</code></pre>${x.expected?`<p class="small">${b('Expected output','预期输出')}</p><pre>${e(x.expected)}</pre>`:x.exercise==='plot'?`<p class="small">${b('Expected: a labeled figure appears in the Python studio.','预期：Python练习中出现带标签图像。')}</p>`:''}<button data-action="book-code" data-id="${e(x.id)}">${b('Open a new studio draft →','在练习中打开新草稿 →')}</button><p class="small muted">${b('Your previous draft in this exercise is downloaded before replacement.','替换前会下载此练习原有草稿。')}</p></details>`:''}${x.lab?`<a class="button" href="#lab/${x.lab}">${b('Explore in the visual lab ↗','在可视化实验中探索 ↗')}</a>`:''}${x.links?`<p>${x.links.map(a=>`<a href="${e(a.url)}" target="_blank" rel="noopener noreferrer">${e(loc(a.title))} ↗</a>`).join(' · ')}</p>`:''}<div class="recall-group">${(x.checks||[]).map(q=>`<details class="retrieval" data-key="${e(q.id)}"><summary>${b('Recall & explain','回忆并解释')} · ${e(loc(q.prompt))}</summary><p>${e(loc(q.answer))}</p></details>`).join('')}</div><p class="source">${b('Book v0.9 · printed p.','教材v0.9 · 印刷页')} ${x.pages.join(', ')} · §${section.id} · CC BY-NC-SA 4.0</p>${catalog.placements.filter(p=>p.conceptId===x.id).map(p=>videoCard(p,catalog,lang)).join('')}`;
 return x.expanded?`<details id="${e(x.id)}" class="card concept-block advanced" data-key="${e(x.id)}" tabindex="-1"><summary><span class="eyebrow">${b('DEEPER UNDERSTANDING','深入理解')}</span><span class="concept-title">${e(loc(x.title))}</span></summary>${body}</details>`:`<section id="${e(x.id)}" class="card concept-block" data-key="${e(x.id)}" tabindex="-1"><div class="eyebrow">${b('CORE IDEA','核心概念')} ${i+1}</div><h2>${e(loc(x.title))}</h2>${body}</section>`;
 }).join('');
}
// Update local copy in place. An active iframe stays attached to its original node.
// Moving/reparenting an iframe would reload it, so video-stage children are protected.
export function patchLearningDOM(parent,html){const template=document.createElement('template');template.innerHTML=html;
 function patch(old,fresh){
  if(old.nodeType!==fresh.nodeType||old.nodeName!==fresh.nodeName){old.replaceWith(fresh.cloneNode(true));return;}
  if(old.nodeType===Node.TEXT_NODE){if(old.data!==fresh.data)old.data=fresh.data;return;}
  if(old.nodeType!==Node.ELEMENT_NODE)return;
  const expanded=old.tagName==='DETAILS'?old.open:null;
  for(const attr of [...old.attributes])if(!fresh.hasAttribute(attr.name)&&!(attr.name==='open'&&expanded))old.removeAttribute(attr.name);
  for(const attr of [...fresh.attributes])if(old.getAttribute(attr.name)!==attr.value)old.setAttribute(attr.name,attr.value);
  if(old.dataset.videoSlot&&old.querySelector('iframe'))return;
  if(old.tagName==='TEXTAREA'&&document.activeElement!==old)old.value=fresh.textContent;
  const a=[...old.childNodes],z=[...fresh.childNodes];for(let i=0;i<Math.max(a.length,z.length);i++){if(!a[i])old.append(z[i].cloneNode(true));else if(!z[i])a[i].remove();else patch(a[i],z[i]);}
  if(expanded!==null)old.open=expanded;
 }
 const a=[...parent.childNodes],z=[...template.content.childNodes];for(let i=0;i<Math.max(a.length,z.length);i++){if(!a[i])parent.append(z[i].cloneNode(true));else if(!z[i])a[i].remove();else patch(a[i],z[i]);}
 for(const stage of parent.querySelectorAll('[data-video-slot]'))if(stage.querySelector('iframe'))stage.closest('figure').querySelector('.video-close').hidden=false;
}
export function jumpToConcept(id){const node=document.getElementById(id);if(!node)return;for(let p=node;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;node.scrollIntoView({block:'start',behavior:'instant'});node.focus({preventScroll:true});}
export function activateVideo(root,id,catalog,lang){const p=catalog.placements.find(x=>x.id===id),v=catalog.videos.find(x=>x.id===p?.videoId),stage=[...root.querySelectorAll('[data-video-slot]')].find(x=>x.dataset.videoSlot===id);if(!v||!stage||stage.querySelector('iframe'))return false;
 if(!navigator.onLine){stage.closest('figure').querySelector('.video-message').textContent=lang==='zh'?'当前离线，请联网后加载或访问原始来源。':'You are offline. Reconnect to load the player or visit its original source.';return false;}
 const frame=document.createElement('iframe');frame.src=embedURL(v,p,location.origin);frame.title=v.title;frame.referrerPolicy='strict-origin-when-cross-origin';frame.allow='encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.setAttribute('loading','lazy');stage.replaceChildren(frame);stage.closest('figure').querySelector('.video-close').hidden=false;return true;
}
