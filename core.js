/* Morning Trivia v1.0.0 — pure state helpers, also used by the checks. */
(function(root){
'use strict';
const VERSION=1;
function blank(){return {version:VERSION,asked:{},hidden:{},round:null,lastBackup:null};}
function shuffle(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function available(bank,state,categories){const set=new Set(categories);return bank.filter(q=>set.has(q.category)&&!state.asked[q.id]&&!state.hidden[q.id]);}
function makeRound(bank,state,categories,count){const pool=shuffle(available(bank,state,categories));const chosen=count===0?pool:pool.slice(0,count);return {items:chosen.map(q=>({id:q.id,choices:shuffle([q.answer,...q.wrong])})),index:0,asked:0,skipped:0,revealed:false,started:new Date().toISOString()};}
function validDate(v){return typeof v==='string'&&v.length<40&&Number.isFinite(Date.parse(v));}
function sanitise(raw,bank,strict=false){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.version!==VERSION||!raw.asked||typeof raw.asked!=='object'||Array.isArray(raw.asked)||!raw.hidden||typeof raw.hidden!=='object'||Array.isArray(raw.hidden))throw Error('This is not a supported Morning Trivia backup.');
 const state=blank(),map=new Map(bank.map(q=>[q.id,q]));
 for(const [id,date] of Object.entries(raw.asked)){if(!map.has(id))continue;if(!validDate(date)){if(strict)throw Error('The backup contains an invalid history date.');continue;}state.asked[id]=date;}
 for(const [id,item] of Object.entries(raw.hidden)){if(!map.has(id))continue;if(!item||!validDate(item.date)||typeof item.reason!=='string'){if(strict)throw Error('The backup contains an invalid hidden question.');continue;}state.hidden[id]={date:item.date,reason:item.reason.slice(0,500)};}
 if(validDate(raw.lastBackup))state.lastBackup=raw.lastBackup;
 const r=raw.round;
 if(r&&Array.isArray(r.items)&&r.items.length<=bank.length&&Number.isInteger(r.index)&&r.index>=0&&r.index<=r.items.length&&new Set(r.items.map(x=>x.id)).size===r.items.length){
  const valid=r.items.every(item=>{const q=map.get(item.id);return q&&Array.isArray(item.choices)&&item.choices.length===3&&new Set(item.choices).size===3&&item.choices.every(v=>[q.answer,...q.wrong].includes(v));});
  if(valid)state.round={items:r.items,index:r.index,asked:Math.min(r.index,Math.max(0,Math.floor(Number(r.asked)||0))),skipped:Math.min(r.index,Math.max(0,Math.floor(Number(r.skipped)||0))),revealed:!!r.revealed,started:validDate(r.started)?r.started:new Date().toISOString()};
 }
 return state;
}
function merge(base,incoming){return {...base,asked:{...base.asked,...incoming.asked},hidden:{...base.hidden,...incoming.hidden},round:null};}
const api={blank,shuffle,available,makeRound,sanitise,merge};
if(typeof module!=='undefined')module.exports=api;else root.TriviaCore=api;
})(typeof window==='undefined'?globalThis:window);
