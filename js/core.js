export const DAY=86400000;
export const STATE_VERSION=1;
export function defaults(){return {version:STATE_VERSION,settings:{lang:'en',theme:'light',route:'E1',dailyGoal:10},completed:[],bookmarks:[],notes:{},lastLesson:'1.1',responses:[],reviews:{},attempts:[],active:null,python:{exercise:'basics',drafts:{},inputs:{}},focusEndsAt:null};}
export function sameAnswer(a,b){return a.length===b.length&&[...a].sort().every((x,i)=>x===[...b].sort()[i]);}
export function grade(quiz,questions){let earned=0,total=0;for(const id of quiz.questionIds){const q=questions.get(id);total+=q.points;if(sameAnswer(quiz.answers[id]||[],q.answer))earned+=q.points;}return {earned,total,percent:total?Math.round(100*earned/total):0};}
export function reviewNext(previous,correct,now=Date.now()) {const intervals=[1,3,7,14,30];const stage=correct?Math.min((previous?.stage??-1)+1,4):0;return {stage,due:now+intervals[stage]*DAY};}
export function recordResponse(state,q,answer,attemptId,now=Date.now()){
 if(state.responses.some(r=>r.attemptId===attemptId&&r.questionId===q.id))return;
 const correct=sameAnswer(answer,q.answer);state.responses.push({questionId:q.id,answer:[...answer],correct,at:now,attemptId});state.reviews[q.id]=reviewNext(state.reviews[q.id],correct,now);
}
export function expired(quiz,now=Date.now()){return !!(quiz?.deadline&&now>=quiz.deadline&&!quiz.submittedAt);}
export function mastery(state,lessonId,questions){const latest=new Map();for(const r of state.responses)if(questions.get(r.questionId)?.lessonIds.includes(lessonId))latest.set(r.questionId,r.correct);return {correct:[...latest.values()].filter(Boolean).length,total:latest.size,percent:latest.size?Math.round(100*[...latest.values()].filter(Boolean).length/latest.size):null};}
export function localDay(t){const d=new Date(t);return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;}
export function validateState(s,ids){
 const fail=()=>{throw new Error('Invalid or unsupported backup');};
 const obj=x=>x&&typeof x==='object'&&!Array.isArray(x);
 const walk=(x,depth=0)=>{if(depth>20)fail();if(x&&typeof x==='object')for(const [k,v] of Object.entries(x)){if(['__proto__','constructor','prototype'].includes(k))fail();walk(v,depth+1);}};walk(s);
 if(!obj(s)||s.version!==STATE_VERSION||!obj(s.settings)||!['en','zh'].includes(s.settings.lang)||!['light','dark'].includes(s.settings.theme)||!['E1','E2','J1','J2','S1','S2'].includes(s.settings.route)||!Number.isInteger(s.settings.dailyGoal)||s.settings.dailyGoal<0||s.settings.dailyGoal>100)fail();
 const lesson=x=>typeof x==='string'&&ids.lessons.has(x);const question=x=>typeof x==='string'&&ids.questions.has(x);
 for(const field of ['completed','bookmarks'])if(!Array.isArray(s[field])||s[field].some(x=>!lesson(x))||new Set(s[field]).size!==s[field].length)fail();
 if(!lesson(s.lastLesson)||!obj(s.notes)||Object.entries(s.notes).some(([k,v])=>!lesson(k)||typeof v!=='string'||v.length>20000))fail();
 const finite=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
 const answer=(a,id)=>Array.isArray(a)&&new Set(a).size===a.length&&a.every(n=>Number.isInteger(n)&&n>=0&&n<ids.questions.get(id).options.length);
 if(!Array.isArray(s.responses)||s.responses.length>20000||s.responses.some(r=>!obj(r)||!question(r.questionId)||!answer(r.answer,r.questionId)||typeof r.correct!=='boolean'||r.correct!==sameAnswer(r.answer,ids.questions.get(r.questionId).answer)||!finite(r.at)||typeof r.attemptId!=='string'))fail();
 if(!obj(s.reviews)||Object.entries(s.reviews).some(([k,v])=>!question(k)||!obj(v)||!Number.isInteger(v.stage)||v.stage<0||v.stage>4||!finite(v.due)))fail();
 const checkQuiz=q=>{if(!obj(q)||typeof q.id!=='string'||!['practice','diagnostic','review','exam'].includes(q.kind)||!obj(q.title)||typeof q.title.en!=='string'||typeof q.title.zh!=='string'||!Array.isArray(q.questionIds)||!q.questionIds.length||q.questionIds.length>200||new Set(q.questionIds).size!==q.questionIds.length||q.questionIds.some(id=>!question(id))||!Number.isInteger(q.index)||q.index<0||q.index>=q.questionIds.length||!finite(q.startedAt)||!(q.deadline===null||finite(q.deadline))||!(q.submittedAt===null||finite(q.submittedAt))||q.deadline!==null&&q.deadline<q.startedAt||q.kind==='exam'&&q.deadline!==q.startedAt+90*60000)fail();for(const key of ['answers','flags','graded'])if(!obj(q[key])||Object.keys(q[key]).some(id=>!q.questionIds.includes(id)))fail();if(Object.entries(q.answers).some(([id,a])=>!answer(a,id))||Object.values(q.flags).some(v=>typeof v!=='boolean')||Object.values(q.graded).some(v=>typeof v!=='boolean'))fail();};
 if(s.active!==null)checkQuiz(s.active);if(!Array.isArray(s.attempts)||s.attempts.length>1000)fail();s.attempts.forEach(q=>{checkQuiz(q);if(q.submittedAt===null)fail();});
 if(!obj(s.python)||typeof s.python.exercise!=='string'||!['basics','functions','numpy','pandas','plot','model'].includes(s.python.exercise)||!obj(s.python.drafts)||!obj(s.python.inputs))fail();for(const field of ['drafts','inputs'])if(Object.entries(s.python[field]).some(([k,v])=>!['basics','functions','numpy','pandas','plot','model'].includes(k)||typeof v!=='string'||v.length>100000))fail();
 if(!(s.focusEndsAt===null||finite(s.focusEndsAt)))fail();return structuredClone(s);
}
export function decodeBackup(text,ids){if(text.length>5*1024*1024)throw new Error('Backup too large');const v=JSON.parse(text);if(v.app!=='CAICP Academy'||v.version!==STATE_VERSION)throw new Error('Unsupported backup');return validateState(v.data,ids);}
export function encodeBackup(state){return JSON.stringify({app:'CAICP Academy',version:STATE_VERSION,exportedAt:new Date().toISOString(),data:state},null,2);}

export function diagnosticQuestions(routeIds,lessons,count=12){
 const candidates=Array.from({length:3},(_,i)=>routeIds.map(id=>lessons.get(id).questionIds[i])).flat();
 return Array.from({length:Math.min(count,candidates.length)},(_,i)=>candidates[Math.floor(i*candidates.length/Math.min(count,candidates.length))]);
}
