import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {defaults} from '../js/core.js';

let sequence=0;
// Run the actual app module/event handlers with a minimal DOM and local store.
// No network, browser profile, videos, worker runtime or external services.
async function appHarness(kind='practice',lang='en'){
 const state=defaults(),startedAt=Date.now();state.settings.lang=lang;
 state.active={id:'ui-attempt',kind,title:{en:'Test attempt',zh:'测试练习'},questionIds:['drill-1.1-1','drill-1.1-2'],index:0,answers:{},flags:{},graded:{},startedAt,deadline:kind==='exam'?startedAt+90*60000:null,submittedAt:null};
 let stored=JSON.stringify(state),dialog=null;
 const node=()=>({innerHTML:'',listeners:{},style:{},addEventListener(type,fn){this.listeners[type]=fn;},focus(){},close(){},showModal(){},remove(){if(dialog===this)dialog=null;}});
 const root=node(),toast=node(),main=node(),skip=node();
 const document={compatMode:'CSS1Compat',activeElement:null,documentElement:{},body:{classList:{toggle(){}},append(el){dialog=el;}},querySelector(selector){return {'#app':root,'#toast':toast,'#main':main,'.skip':skip,dialog}[selector]??null;},createElement:node};
 const replacements={document,window:{addEventListener(){},scrollTo(){}},navigator:{},location:{hash:'#quiz'},localStorage:{getItem(){return stored;},setItem(key,value){stored=value;}},fetch:async url=>({ok:true,json:async()=>JSON.parse(readFileSync(url,'utf8'))}),setInterval(){},setTimeout(){},clearTimeout(){}};
 const descriptors=new Map(Object.keys(replacements).map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
 for(const[k,v]of Object.entries(replacements))Object.defineProperty(globalThis,k,{configurable:true,writable:true,value:v});
 const event=(action,extra={})=>({target:{closest(){return {dataset:{action,...extra}};}}});
 try{await import(new URL(`../js/app.js?attempt-ui=${sequence++}`,import.meta.url));}catch(e){restore();throw e;}
 function restore(){for(const[k,d]of descriptors)if(d)Object.defineProperty(globalThis,k,d);else delete globalThis[k];}
 return {root,toast,state:()=>JSON.parse(stored),dialog:()=>dialog,
  click:action=>root.listeners.click(event(action)),
  choose:value=>root.listeners.change({target:{name:'answer',value:String(value),dataset:{}}}),
  confirm:()=>dialog.listeners.click(event('dialog-confirm')),
  cancel:()=>dialog.listeners.click(event('dialog-cancel')),restore};
}

test('English/Chinese give-up control cancels safely, then exits with no marks or explanations',async()=>{
 for(const lang of ['en','zh'])for(const kind of ['practice','diagnostic','review','exam']){
  const app=await appHarness(kind,lang);
  try{
   assert.ok(app.root.innerHTML.includes('data-action="abandon"'));
   await app.choose(0);app.click('flag');const before=app.state();
   app.click('abandon');assert.ok(app.dialog().innerHTML.includes(lang==='en'?'Give up this attempt?':'放弃本次练习？'));
   app.cancel();assert.deepEqual(app.state(),before);
   app.click('abandon');app.confirm();
   assert.equal(app.state().active,null);assert.deepEqual(app.state().responses,[]);
   assert.deepEqual(app.state().reviews,{});assert.deepEqual(app.state().attempts,[]);
   assert.equal(location.hash,'practice');assert.ok(!app.root.innerHTML.includes('class="feedback'));
   assert.ok(!app.root.innerHTML.includes('class="option '));assert.ok(!app.root.innerHTML.includes('results-score'));
   assert.ok(!app.root.innerHTML.includes('data-action="abandon"'));
  }finally{app.restore();}
 }
});
test('give-up confirmation explains checked-answer retention without marking remaining answers',async()=>{
 const app=await appHarness();
 try{
  await app.choose(0);app.click('check');const checked=app.state();assert.equal(checked.responses.length,1);
  app.click('quiz-next');await app.choose(1);app.click('abandon');
  assert.ok(app.dialog().innerHTML.includes('Previously checked practice answers stay in your review history.'));
  app.confirm();assert.deepEqual(app.state(),{...checked,active:null});
  assert.ok(!app.root.innerHTML.includes('class="feedback'));
 }finally{app.restore();}
});
test('completed results have no give-up control and are not discarded',async()=>{
 const app=await appHarness();
 try{
  app.click('submit');app.confirm();const completed=app.state();
  assert.ok(!app.root.innerHTML.includes('data-action="abandon"'));
  app.click('abandon');assert.equal(app.dialog(),null);assert.deepEqual(app.state(),completed);
 }finally{app.restore();}
});
