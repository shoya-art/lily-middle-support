(function(root){
  'use strict';
  const sessionName='re-relation:work-sync-session';
  const draftPrefix='re-relation:003:work-draft:';
  let current=null,key=null;
  const records=new Map();
  const config=()=>root.ReRelationWorkConfig;
  const editable=recordKey=>{const match=/^(work|learning):(\d+)$/.exec(recordKey);return !!match&&Number(match[2])>=config().firstRound&&Number(match[2])<=config().lastRound;};
  function lock(){sessionStorage.removeItem(sessionName);current=null;key=null;records.clear();}
  async function request(path,options={}){
    let response;
    try{response=await fetch(config().apiUrl+path,{...options,credentials:'omit',cache:'no-store',headers:{'Content-Type':'application/json',...(current?.token?{Authorization:'Bearer '+current.token}:{}),...options.headers}});}
    catch{throw Error('保存先に接続できません。通信状態を確認して、もう一度保存してください。');}
    let body;try{body=await response.json();}catch{throw Error('保存先から応答がありません。時間をおいてお試しください。');}
    if(!response.ok){const error=Error(body.error||'保存できませんでした。');error.status=response.status;error.latest=body.latest;throw error;}
    return body;
  }
  async function login(password){
    lock();
    const derived=await MemberWorkCrypto.derive(password,config());
    const session=await request('/v1/session',{method:'POST',body:JSON.stringify({memberId:config().memberId,authKey:derived.authKey})});
    if(session.memberId!==config().memberId)throw Error('受講者の情報を確認できませんでした。');
    current={...session,encryptionKey:derived.encryptionKey};
    key=await MemberWorkCrypto.importKey(derived.encryptionKey);
    sessionStorage.setItem(sessionName,JSON.stringify(current));
  }
  async function restore(){
    let saved;try{saved=JSON.parse(sessionStorage.getItem(sessionName));}catch{lock();return false;}
    if(saved?.memberId!==config()?.memberId||!Number.isFinite(saved?.expiresAt)||saved.expiresAt<=Date.now()){lock();return false;}
    current=saved;key=await MemberWorkCrypto.importKey(saved.encryptionKey);return true;
  }
  function persist(record){
    try{localStorage.setItem(draftPrefix+record.recordKey,JSON.stringify({version:1,memberId:config().memberId,recordKey:record.recordKey,baseVersion:record.baseVersion,envelope:record.envelope,dirty:record.dirty,mutationId:record.mutationId,updatedAt:record.updatedAt}));record.localBackup=true;}
    catch{record.localBackup=false;}
  }
  async function load(){
    if(!key)throw Error('入力・保存するには、もう一度ログインしてください。');
    let response,loadError;
    try{response=await request('/v1/records');if(response.memberId!==config().memberId)throw Error('受講者の情報が一致しません。');}
    catch(error){loadError=error;}
    records.clear();
    const remote=new Map((response?.records||[]).map(record=>[record.recordKey,record]));
    for(const kind of ['work','learning'])for(let n=config().firstRound;n<=config().lastRound;n++){
      const recordKey=`${kind}:${n}`,server=remote.get(recordKey);
      let local;try{local=JSON.parse(localStorage.getItem(draftPrefix+recordKey));}catch{/* leave damaged storage untouched */}
      if(local&&(local.memberId!==config().memberId||local.recordKey!==recordKey))throw Error('端末の下書き情報を確認できませんでした。');
      const useLocal=local&&(local.dirty||!server);
      const envelope=useLocal?local.envelope:server?.envelope;
      const fields=envelope?await MemberWorkCrypto.decrypt(envelope,key,config(),recordKey):null;
      const record={recordKey,fields,envelope,baseVersion:useLocal?local.baseVersion:server?.version||0,
        dirty:!!(useLocal&&local.dirty),mutationId:useLocal?local.mutationId:null,updatedAt:useLocal?local.updatedAt:server?.updatedAt,
        localBackup:!!local,sequence:0,remote:server,offline:!!loadError};
      records.set(recordKey,record);
      if(server&&!useLocal)persist(record);
    }
    return {records,loadError};
  }
  async function stage(recordKey,fields){
    if(!key||!editable(recordKey))throw Error('この回答は変更できません。');
    if(Object.values(fields).some(value=>typeof value!=='string'||value.length>20000))throw Error('1つの回答は20,000文字以内で入力してください。');
    const record=records.get(recordKey)||{recordKey,baseVersion:0,sequence:0};
    const sequence=++record.sequence;record.dirty=true;record.fields={...fields};record.mutationId=crypto.randomUUID();records.set(recordKey,record);
    const encrypted=await MemberWorkCrypto.encrypt(fields,key,config(),recordKey);
    if(record.sequence!==sequence)return record;
    record.envelope=encrypted;persist(record);return record;
  }
  async function save(recordKey,fields){
    const record=await stage(recordKey,fields);
    const response=await request('/v1/records/'+encodeURIComponent(recordKey),{method:'PUT',body:JSON.stringify({baseVersion:record.baseVersion,mutationId:record.mutationId,envelope:record.envelope})});
    const saved=await MemberWorkCrypto.decrypt(response.record.envelope,key,config(),recordKey);
    if(JSON.stringify(saved)!==JSON.stringify(fields))throw Error('保存内容を確認できませんでした。もう一度保存してください。');
    record.baseVersion=response.record.version;record.updatedAt=response.record.updatedAt;record.dirty=false;record.remote=response.record;record.offline=false;persist(record);return record;
  }
  async function latestFields(latest,recordKey){
    return latest?MemberWorkCrypto.decrypt(latest.envelope,key,config(),recordKey):{};
  }
  async function acceptLatest(recordKey,latest){
    if(!latest)throw Error('最新の回答を確認できませんでした。');
    const fields=await latestFields(latest,recordKey);
    const record=records.get(recordKey);Object.assign(record,{fields,envelope:latest.envelope,baseVersion:latest.version,dirty:false,mutationId:null,updatedAt:latest.updatedAt,remote:latest});persist(record);return record;
  }
  function useLatestVersion(recordKey,latest){records.get(recordKey).baseVersion=latest?.version||0;}
  function logout(){
    const old=current?.token;lock();
    if(old)fetch(config().apiUrl+'/v1/session',{method:'DELETE',credentials:'omit',keepalive:true,headers:{Authorization:'Bearer '+old}}).catch(()=>{});
  }
  root.MemberWorkSync={login,restore,load,stage,save,lock,logout,latestFields,acceptLatest,useLatestVersion,get:recordKey=>records.get(recordKey),hasUnsaved:()=>[...records.values()].some(r=>r.dirty)};
})(globalThis);
