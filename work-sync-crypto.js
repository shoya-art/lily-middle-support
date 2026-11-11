(function(root){
  'use strict';
  const encoder=new TextEncoder();
  const b64=bytes=>btoa(Array.from(new Uint8Array(bytes),b=>String.fromCharCode(b)).join(''));
  const bytes=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
  const aad=(config,key)=>encoder.encode(`ReRelation/member-sync/v1/${config.memberId}/${config.keyId}/${key}`);
  async function derive(password,config){
    const material=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
    const seed=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:bytes(config.salt),iterations:600000},material,256);
    const hmac=await crypto.subtle.importKey('raw',seed,{name:'HMAC',hash:'SHA-256'},false,['sign']);
    const sign=label=>crypto.subtle.sign('HMAC',hmac,encoder.encode(`ReRelation/member-sync/v1/${config.memberId}/${label}`));
    return {authKey:b64(await sign('auth')),encryptionKey:b64(await sign('encryption'))};
  }
  const importKey=key=>crypto.subtle.importKey('raw',bytes(key),{name:'AES-GCM'},false,['encrypt','decrypt']);
  async function encrypt(fields,key,config,recordKey){
    const iv=crypto.getRandomValues(new Uint8Array(12));
    const data=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad(config,recordKey)},key,encoder.encode(JSON.stringify({memberId:config.memberId,recordKey,fields})));
    return {v:1,memberId:config.memberId,recordKey,keyId:config.keyId,iv:b64(iv),data:b64(data)};
  }
  async function decrypt(envelope,key,config,recordKey){
    if(envelope?.v!==1||envelope.memberId!==config.memberId||envelope.recordKey!==recordKey||envelope.keyId!==config.keyId)throw Error('Wrong member or record');
    const data=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(envelope.iv),additionalData:aad(config,recordKey)},key,bytes(envelope.data));
    const result=JSON.parse(new TextDecoder().decode(data));
    if(result.memberId!==config.memberId||result.recordKey!==recordKey||!result.fields||Object.values(result.fields).some(v=>typeof v!=='string'))throw Error('Invalid answer');
    return result.fields;
  }
  const api={derive,importKey,encrypt,decrypt};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MemberWorkCrypto=api;
})(globalThis);
