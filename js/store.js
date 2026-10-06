import {defaults,validateState,encodeBackup} from './core.js';
const KEY='caicp-academy-v1';
export function createStore(ids,storage=globalThis.localStorage){
 let state=defaults(),error=false;try{const raw=storage.getItem(KEY);if(raw)state=validateState(JSON.parse(raw),ids);}catch{error=true;}
 return {get state(){return state;},get error(){return error;},save(){try{storage.setItem(KEY,JSON.stringify(state));error=false;}catch{error=true;}return !error;},replace(value){state=validateState(value,ids);return this.save();},reset(){state=defaults();return this.save();},export(){return encodeBackup(state);}};
}
