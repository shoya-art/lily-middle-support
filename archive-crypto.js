/* Password-protected, read-only archives. No password or plaintext belongs here. */
(function (root) {
  'use strict';
  const encoder = new TextEncoder();
  const encode = bytes => btoa(Array.from(new Uint8Array(bytes), b => String.fromCharCode(b)).join(''));
  const decode = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
  const aad = id => encoder.encode(`ReRelation/archive/v1/${id}`);
  function validate(envelope, id) {
    if (envelope.version !== 1 || envelope.memberId !== id || envelope.cipher !== 'AES-GCM' ||
        envelope.kdf !== 'PBKDF2-SHA256' || envelope.iterations !== 600000 ||
        decode(envelope.salt).length !== 16 || decode(envelope.iv).length !== 12) {
      throw new Error('Unsupported archive');
    }
  }
  async function derive(password, envelope, id) {
    validate(envelope, id);
    const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({name:'PBKDF2', salt:decode(envelope.salt), iterations:600000, hash:'SHA-256'}, material,
      {name:'AES-GCM', length:256}, true, ['encrypt', 'decrypt']);
  }
  async function decrypt(envelope, key, id) {
    validate(envelope, id);
    const plain = await crypto.subtle.decrypt({name:'AES-GCM', iv:decode(envelope.iv), additionalData:aad(id), tagLength:128}, key, decode(envelope.data));
    const result = JSON.parse(new TextDecoder().decode(plain));
    if (result.memberId !== id || result.schemaVersion !== 1 || !Array.isArray(result.sessions) ||
        !result.sessions.every(s => s.memberId === id) || !Array.isArray(result.supplementary) ||
        !result.supplementary.every(s => s.memberId === id)) throw new Error('Wrong member archive');
    return result;
  }
  async function encrypt(payload, password) {
    const envelope = {version:1, memberId:payload.memberId, cipher:'AES-GCM', kdf:'PBKDF2-SHA256', iterations:600000,
      salt:encode(crypto.getRandomValues(new Uint8Array(16))), iv:encode(crypto.getRandomValues(new Uint8Array(12)))};
    const key = await derive(password, envelope, payload.memberId);
    envelope.data = encode(await crypto.subtle.encrypt({name:'AES-GCM', iv:decode(envelope.iv), additionalData:aad(payload.memberId), tagLength:128},
      key, encoder.encode(JSON.stringify(payload))));
    return envelope;
  }
  const api = {encrypt, derive, decrypt,
    exportKey:async key => encode(await crypto.subtle.exportKey('raw', key)),
    importKey:raw => crypto.subtle.importKey('raw', decode(raw), {name:'AES-GCM'}, false, ['decrypt'])};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MemberArchiveCrypto = api;
})(globalThis);
