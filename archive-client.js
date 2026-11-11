(function (root) {
  'use strict';
  const sessionKey = 're-relation:archive-session';
  const id = '003';
  let pending = false;
  const lock = () => {sessionStorage.removeItem(sessionKey);if(root.MemberWorkSync)root.MemberWorkSync.lock();};
  async function envelope() {
    if (!root.crypto?.subtle) throw new Error('安全な接続（HTTPS）と新しいブラウザで開いてください。');
    const response = await fetch('archives/003.json', {cache:'no-store', credentials:'omit'});
    if (!response.ok) throw new Error('記録を読み込めませんでした。時間をおいてお試しください。');
    return response.json();
  }
  async function login(memberId, password) {
    if (memberId !== id || pending) return false;
    pending = true;
    lock();
    sessionStorage.removeItem('demo-role');
    sessionStorage.removeItem('member-account');
    try {
      const encrypted = await envelope();
      const key = await MemberArchiveCrypto.derive(password, encrypted, id);
      let data;
      try { data = await MemberArchiveCrypto.decrypt(encrypted, key, id); }
      catch { throw new Error('IDまたはパスワードが正しくありません。'); }
      if(root.MemberWorkSync)await root.MemberWorkSync.login(password);
      // Only a derived key, never plaintext answers/password, survives page navigation.
      sessionStorage.setItem(sessionKey, JSON.stringify({memberId:id, key:await MemberArchiveCrypto.exportKey(key), expiresAt:Date.now()+8*60*60*1000}));
      sessionStorage.setItem('demo-role', 'archive');
      sessionStorage.setItem('member-account', JSON.stringify({id, name:data.memberName}));
      return true;
    } catch (error) { lock(); throw error; }
    finally { pending = false; }
  }
  async function restore() {
    let session, member;
    try {session = JSON.parse(sessionStorage.getItem(sessionKey)); member = JSON.parse(sessionStorage.getItem('member-account'));} catch {lock();return null;}
    if (sessionStorage.getItem('demo-role') !== 'archive' || member?.id !== id || session?.memberId !== id ||
        !Number.isFinite(session.expiresAt) || session.expiresAt <= Date.now()) {lock();return null;}
    const encrypted = await envelope();
    try {
      const key = await MemberArchiveCrypto.importKey(session.key);
      return await MemberArchiveCrypto.decrypt(encrypted, key, id);
    } catch {lock();return null;}
  }
  function logout() {
    if(root.MemberWorkSync)root.MemberWorkSync.logout();
    lock();
    sessionStorage.removeItem('demo-role');
    sessionStorage.removeItem('member-account');
    location.replace('index.html');
  }
  root.MemberArchive = {login, restore, lock, logout};
})(globalThis);
