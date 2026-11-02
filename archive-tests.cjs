const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const cipher = require('./archive-crypto.js');
const password = 'test-only-random-fixture-password';
const payload = {schemaVersion:1,memberId:'003',memberName:'テスト',sourceCapturedAt:'2026-11-02',
  sessions:[{memberId:'003',number:1,importedAnswers:{0:{text:'PRIVATE ANSWER\n<script>test</script>'}}}],supplementary:[]};
function storage() {
  const values = new Map();
  return {values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
}
(async () => {
  const envelope = await cipher.encrypt(payload,password);
  assert.ok(!JSON.stringify(envelope).includes('PRIVATE ANSWER'));
  const key = await cipher.derive(password,envelope,'003');
  assert.deepEqual(await cipher.decrypt(envelope,key,'003'),payload);
  await assert.rejects(cipher.derive(password,envelope,'002'));
  await assert.rejects(cipher.decrypt(envelope,await cipher.derive('wrong',envelope,'003'),'003'));
  const tampered = {...envelope,data:(envelope.data[0]==='A'?'B':'A')+envelope.data.slice(1)};
  await assert.rejects(cipher.decrypt(tampered,key,'003'));
  assert.notEqual((await cipher.encrypt(payload,password)).iv,envelope.iv);
  const sessionStorage = storage();
  const context = vm.createContext({crypto:globalThis.crypto,MemberArchiveCrypto:cipher,sessionStorage,
    fetch:async()=>({ok:true,json:async()=>envelope}),Date,JSON,
    location:{replace(url){this.url=url}}});
  vm.runInContext(fs.readFileSync('archive-client.js','utf8'),context);
  const client = context.MemberArchive;
  assert.equal(await client.restore(),null);
  assert.equal(await client.login('002',password),false);
  await assert.rejects(client.login('003','wrong'));
  assert.equal(await client.restore(),null);
  assert.equal(await client.login('003',password),true);
  assert.deepEqual(await client.restore(),payload);
  const stored = JSON.stringify([...sessionStorage.values]);
  assert.ok(!stored.includes('PRIVATE ANSWER'));
  assert.ok(!stored.includes(password));
  sessionStorage.setItem('member-account',JSON.stringify({id:'001'}));
  assert.equal(await client.restore(),null);
  await client.login('003',password);
  const expired = JSON.parse(sessionStorage.getItem('re-relation:archive-session'));
  expired.expiresAt=0;sessionStorage.setItem('re-relation:archive-session',JSON.stringify(expired));
  assert.equal(await client.restore(),null);
  await client.login('003',password);
  client.logout();
  assert.equal(await client.restore(),null);
  assert.equal(context.location.url,'index.html');
  assert.equal(sessionStorage.values.size,0);
  console.log('PASS: encrypted round trip, wrong password/member rejection, tamper detection, session expiry/logout, no plaintext persistence');
  const [sourcePath,credentialPath] = process.argv.slice(2);
  if (sourcePath && credentialPath) {
    const source=JSON.parse(fs.readFileSync(sourcePath,'utf8'));
    const credential=JSON.parse(fs.readFileSync(credentialPath,'utf8'));
    const encrypted=JSON.parse(fs.readFileSync('archives/003.json','utf8'));
    const actual=await cipher.decrypt(encrypted,await cipher.derive(credential.password,encrypted,'003'),'003');
    assert.equal(actual.sessions.length,32);
    assert.equal(actual.supplementary.length,34);
    let count=0;
    for (const session of actual.sessions) {
      const original=source.sessions.find(s=>s.number===session.number);
      assert.equal(session.memberId,'003');
      assert.deepEqual(session.workQuestions,original.workQuestions);
      assert.deepEqual(session.importedAnswers,original.importedAnswers);
      count+=Object.values(session.importedAnswers).filter(a=>a.text.trim()).length;
    }
    assert.equal(count,273);
    assert.deepEqual(actual.supplementary,source.supplementary);
    // Ensure none of the personal answers or credential occur in tracked/public source.
    const cp=require('node:child_process');
    const files=cp.execFileSync('git',['ls-files','--cached','--others','--exclude-standard'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
    const answerSamples=actual.sessions.flatMap(s=>Object.values(s.importedAnswers).map(a=>a.text)).filter(s=>s.trim().length>40);
    for (const file of files) {
      if (/\.(png|jpg|jpeg)$/.test(file)) continue;
      const text=fs.readFileSync(file,'utf8');
      assert.ok(!text.includes(credential.password),`Credential leak in ${file}`);
      for (const answer of answerSamples) assert.ok(!text.includes(answer),`Plaintext answer leak in ${file}`);
    }
    console.log(`PASS: ${actual.sessions.length} rounds, ${count} unchanged answers, 34 supplementary tabs, no private plaintext/password in publishable files`);
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
