const encoder = new TextEncoder();
const digest = async value => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value))),b=>b.toString(16).padStart(2,'0')).join('');
const equal = (a,b) => {if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;};
const token = () => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
function rowJSON(row){return {recordKey:row.record_key,version:row.version,envelope:JSON.parse(row.envelope),updatedAt:row.updated_at};}
function allowedKey(key,env){const match=/^(work|learning):(\d+)$/.exec(key);return !!match&&Number(match[2])>=Number(env.FIRST_ROUND)&&Number(match[2])<=Number(env.LAST_ROUND);}
export async function handle(request,env){
  const origin=request.headers.get('Origin');
  const allowed=origin===env.ALLOWED_ORIGIN;
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff'};
  if(allowed)Object.assign(headers,{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers':'Authorization,Content-Type','Access-Control-Max-Age':'600'});
  const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers});
  const path=new URL(request.url).pathname;
  if(path==='/health'&&request.method==='GET')return reply(200,{ok:true});
  if(!allowed)return reply(403,{error:'アクセスできません。'});
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  try{
    if(path==='/v1/session'&&request.method==='POST'){
      const text=await request.text();if(text.length>1024)return reply(413,{error:'リクエストが大きすぎます。'});
      let body;try{body=JSON.parse(text);}catch{return reply(400,{error:'入力を確認してください。'});}
      const now=Date.now(),hour=Math.floor(now/3600000);
      const ip=request.headers.get('CF-Connecting-IP')||'unknown';
      const bucket=await digest(`login:${env.AUTH_HASH}:${ip}:${hour}`);
      const attempts=await env.DB.prepare('INSERT INTO login_limits(bucket,attempts,expires_at) VALUES (?,1,?) ON CONFLICT(bucket) DO UPDATE SET attempts=attempts+1 RETURNING attempts').bind(bucket,now+7200000).first();
      if(attempts.attempts>30)return reply(429,{error:'ログインを繰り返し試されています。時間をおいてお試しください。'});
      if(body.memberId!==env.MEMBER_ID||typeof body.authKey!=='string'||!equal(await digest(body.authKey),env.AUTH_HASH))return reply(401,{error:'IDまたはパスワードが正しくありません。'});
      const sessionToken=token(),expiresAt=now+8*3600000;
      await env.DB.batch([
        env.DB.prepare('DELETE FROM member_sessions WHERE expires_at < ?').bind(now),
        env.DB.prepare('DELETE FROM login_limits WHERE expires_at < ?').bind(now),
        env.DB.prepare('INSERT INTO member_sessions(token_hash,member_id,expires_at) VALUES (?,?,?)').bind(await digest(sessionToken),env.MEMBER_ID,expiresAt)
      ]);
      return reply(200,{token:sessionToken,memberId:env.MEMBER_ID,expiresAt});
    }
    const raw=request.headers.get('Authorization')?.match(/^Bearer ([A-Za-z0-9_-]{43})$/)?.[1];
    if(!raw)return reply(401,{error:'もう一度ログインしてください。'});
    const hash=await digest(raw);
    const session=await env.DB.prepare('SELECT member_id,expires_at FROM member_sessions WHERE token_hash=?').bind(hash).first();
    if(!session||session.member_id!==env.MEMBER_ID||session.expires_at<=Date.now())return reply(401,{error:'もう一度ログインしてください。'});
    if(path==='/v1/session'&&request.method==='DELETE'){
      await env.DB.prepare('DELETE FROM member_sessions WHERE token_hash=?').bind(hash).run();
      return reply(200,{ok:true});
    }
    if(path==='/v1/records'&&request.method==='GET'){
      const rows=await env.DB.prepare('SELECT record_key,version,envelope,updated_at FROM work_records WHERE member_id=? ORDER BY record_key').bind(session.member_id).all();
      return reply(200,{memberId:session.member_id,records:rows.results.map(rowJSON)});
    }
    const match=/^\/v1\/records\/([^/]+)$/.exec(path);
    if(match&&request.method==='PUT'){
      const key=decodeURIComponent(match[1]);if(!allowedKey(key,env))return reply(403,{error:'この回の回答は変更できません。'});
      const text=await request.text();if(text.length>200000)return reply(413,{error:'回答が長すぎます。少し短くして保存してください。'});
      let body;try{body=JSON.parse(text);}catch{return reply(400,{error:'入力を確認してください。'});}
      const e=body.envelope;
      if(!Number.isSafeInteger(body.baseVersion)||body.baseVersion<0||typeof body.mutationId!=='string'||!/^[a-f0-9-]{36}$/i.test(body.mutationId)||
        !e||e.v!==1||e.memberId!==session.member_id||e.recordKey!==key||e.keyId!==env.KEY_ID||typeof e.iv!=='string'||!/^[A-Za-z0-9+/]{16}$/.test(e.iv)||
        typeof e.data!=='string'||e.data.length<24||e.data.length>180000||!/^[A-Za-z0-9+/]+=*$/.test(e.data))return reply(400,{error:'回答データを確認してください。'});
      const replay=await env.DB.prepare('SELECT record_key,version,envelope,updated_at FROM work_history WHERE member_id=? AND record_key=? AND mutation_id=?').bind(session.member_id,key,body.mutationId).first();
      if(replay)return reply(200,{record:rowJSON(replay)});
      const updatedAt=new Date().toISOString();
      await env.DB.batch([
        env.DB.prepare('INSERT INTO work_records(member_id,record_key,version,envelope,mutation_id,updated_at) SELECT ?,?,1,?,?,? WHERE ?=0 OR EXISTS(SELECT 1 FROM work_records WHERE member_id=? AND record_key=? AND version=?) ON CONFLICT(member_id,record_key) DO UPDATE SET version=work_records.version+1,envelope=excluded.envelope,mutation_id=excluded.mutation_id,updated_at=excluded.updated_at WHERE work_records.version=?').bind(session.member_id,key,JSON.stringify(e),body.mutationId,updatedAt,body.baseVersion,session.member_id,key,body.baseVersion,body.baseVersion),
        env.DB.prepare('INSERT OR IGNORE INTO work_history(member_id,record_key,version,envelope,mutation_id,updated_at) SELECT member_id,record_key,version,envelope,mutation_id,updated_at FROM work_records WHERE member_id=? AND record_key=? AND mutation_id=?').bind(session.member_id,key,body.mutationId)
      ]);
      const current=await env.DB.prepare('SELECT record_key,version,envelope,mutation_id,updated_at FROM work_records WHERE member_id=? AND record_key=?').bind(session.member_id,key).first();
      if(!current||current.mutation_id!==body.mutationId)return reply(409,{error:'別の端末で新しい回答が保存されています。',latest:current?rowJSON(current):null});
      return reply(200,{record:rowJSON(current)});
    }
    return reply(404,{error:'ページが見つかりません。'});
  }catch{
    // Do not log credentials, tokens, or encrypted/private request bodies.
    return reply(503,{error:'保存先に接続できませんでした。時間をおいて、もう一度保存してください。'});
  }
}
export default {fetch:handle};
