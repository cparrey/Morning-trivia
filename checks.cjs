const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const C=require('./core.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/questions.js','utf8'),context);const bank=JSON.parse(JSON.stringify(context.window.TRIVIA_QUESTIONS));
assert.equal(bank.length,2000);
const ids=new Set(),strings=new Set(),cats={};
for(const q of bank){assert.equal(typeof q.id,'string');assert.ok(!ids.has(q.id),'Duplicate ID '+q.id);ids.add(q.id);const normal=q.question.toLowerCase().replace(/[^a-z0-9]/g,'');assert.ok(!strings.has(normal),'Duplicate question '+q.question);strings.add(normal);assert.equal(q.wrong.length,2);assert.equal(new Set([q.answer,...q.wrong].map(a=>a.toLowerCase().trim())).size,3,q.id);assert.ok([q.question,q.answer,...q.wrong].every(v=>typeof v==='string'&&v.trim()));assert.match(q.source,/^https:\/\//,q.id);cats[q.category]=(cats[q.category]||0)+1;}
assert.equal(Object.keys(cats).length,20);Object.values(cats).forEach(n=>assert.equal(n,100));
const s=C.blank(),all=Object.keys(cats),first=bank[0],second=bank[1];
s.asked[first.id]='2026-10-14T01:00:00.000Z';s.hidden[second.id]={date:'2026-10-14T01:01:00.000Z',reason:'Review'};
assert.equal(C.available(bank,s,all).length,1998);
assert.ok(!C.available(bank,s,[first.category]).some(q=>q.id===first.id||q.id===second.id));
const r=C.makeRound(bank,s,all,15);assert.equal(r.items.length,15);assert.equal(new Set(r.items.map(q=>q.id)).size,15);assert.ok(r.items.every(q=>!s.asked[q.id]&&!s.hidden[q.id]));
for(const item of r.items){const q=bank.find(q=>q.id===item.id);assert.deepEqual([...item.choices].sort(),[q.answer,...q.wrong].sort());}
assert.equal(C.makeRound(bank,s,all,0).items.length,1998);assert.equal(C.makeRound(bank,s,[],5).items.length,0);
s.round=r;s.round.revealed=true;const reloaded=C.sanitise(JSON.parse(JSON.stringify(s)),bank,true);assert.deepEqual(reloaded,s);
// A skipped/revealed question has no asked record and can appear in a later round.
const skipped=r.items[0].id;r.index++;r.skipped++;assert.ok(C.available(bank,s,all).some(q=>q.id===skipped));
s.asked[skipped]='2026-10-14T01:02:00.000Z';assert.ok(!C.available(bank,s,all).some(q=>q.id===skipped));delete s.asked[skipped];assert.ok(C.available(bank,s,all).some(q=>q.id===skipped));
const other=C.blank();other.asked[bank[50].id]='2026-10-14T01:03:00.000Z';const merged=C.merge(s,other);assert.equal(Object.keys(merged.asked).length,2);assert.equal(merged.round,null);assert.ok(merged.hidden[second.id]);
assert.throws(()=>C.sanitise({version:9,asked:{},hidden:{}},bank,true));assert.throws(()=>C.sanitise({...s,asked:{[first.id]:'bad date'}},bank,true));
const badRound={...s,round:{...r,items:[{id:first.id,choices:['wrong','wrong','wrong']}]}};assert.equal(C.sanitise(badRound,bank).round,null);
const almostDone=C.blank();bank.slice(0,-2).forEach(q=>almostDone.asked[q.id]='2026-10-14T01:00:00.000Z');assert.equal(C.makeRound(bank,almostDone,all,15).items.length,2);
console.log('PASS: 2,000 questions; 20 × 100; IDs, exact duplicates, choices and source URLs; category/mixed exclusion; round uniqueness; reveal/skip/undo; save/reload; backup merge and invalid data; exhaustion.');
