(function () {
  'use strict';
  const root=document.querySelector('#archive-root');
  const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const answerCount=session=>Object.values(session.importedAnswers).filter(a=>a.text.trim()).length;
  const timers=new Map(),conflicts=new Map(),dirtyForms=new Set();
  let writable=false;
  const recordStatus=recordKey=>MemberWorkSync.get(recordKey);
  function statusText(record){
    if(record?.dirty)return 'この端末に下書きがあります。保存ボタンで保存してください。';
    if(record?.updatedAt)return `保存済み：${new Date(record.updatedAt).toLocaleString('ja-JP')}`;
    return '入力後に保存してください。';
  }
  const saveControls=recordKey=>`<div class="work-save-row"><button class="wide-btn" type="submit" ${writable?'':'disabled'}>回答を保存する</button><p class="work-save-status" data-status="${recordKey}" role="status">${escape(writable?statusText(recordStatus(recordKey)):'入力・保存するには、もう一度ログインしてください。')}</p></div><div data-conflict="${recordKey}"></div>`;
  function noteHTML(note,round){
    if(round>=30){
      const recordKey=`learning:${round}`,saved=recordStatus(recordKey)?.fields;
      const original=note.cells.filter(c=>c.cell!=='A1').map(c=>c.text).join('\n');
      return `<details class="card archive-note"><summary>第${round}回の学び・気づき</summary><form data-record="${recordKey}"><label for="learning-${round}">今回のワークで学んだこと・気づいたこと</label><textarea class="work-answer-input" id="learning-${round}" data-field="text" maxlength="20000" ${writable?'':'disabled'} placeholder="自分の言葉で自由に記入してください">${escape(saved?.text??original)}</textarea>${saveControls(recordKey)}</form></details>`;
    }
    return `<details class="card archive-note"><summary>${escape(note.title.trim())}</summary>${note.cells.map(cell=>`<p>${escape(cell.text)}</p>`).join('')}</details>`;
  }
  function sessionHTML(session,notes){
    const count=answerCount(session),editable=session.number>=30,recordKey=`work:${session.number}`;
    const fields=recordStatus(recordKey)?.fields||Object.fromEntries(Object.entries(session.importedAnswers).map(([id,a])=>[id,a.text]));
    const title=editable?'回答を記入・振り返る':count?`過去の回答 ${count} / ${session.workQuestions.length}件 ・ 開いて振り返る`:'記録を振り返る';
    return `<section class="archive-round" data-round="${session.number}" id="round-${session.number}"><div class="chapter-heading">第${session.number}回</div>
      <details class="card archive-work"><summary><div><strong>${escape(session.workTitle)}</strong><small>${title}</small></div></summary>
      <p class="archive-readonly">${editable?'質問に答えたら、最後に「回答を保存する」を押してください。保存した内容は、後から何度でも確認・編集できます。':'以前に書いた回答をそのまま残しています。各質問の下で振り返れます。'}</p>
      ${session.workDescription?.length?`<div class="work-goals"><strong>このワークでやりたいこと</strong><ul>${session.workDescription.map(d=>`<li>${escape(d)}</li>`).join('')}</ul></div>`:''}
      ${editable?`<form data-record="${recordKey}">`:''}
      ${session.workQuestions.map((q,i)=>`<section class="work-question"><h3>質問${i+1}</h3><p>${escape(q.question||'（移行元の質問文が空欄のため、回答のみ表示しています）')}</p>${editable?`<label class="answer-label" for="work-${session.number}-${i}">質問${i+1}の回答</label><textarea class="work-answer-input" id="work-${session.number}-${i}" data-field="${i}" maxlength="20000" ${writable?'':'disabled'} placeholder="ここに回答を入力してください">${escape(fields[i]??'')}</textarea>${session.importedAnswers[i]?.text.trim()?`<details class="original-answer"><summary>移行前に書いた回答を確認する</summary><div class="archive-answer">${escape(session.importedAnswers[i].text)}</div></details>`:''}`:session.importedAnswers[i]?.text.trim()?`<div class="archive-answer" data-answer="${session.number}-${i}">${escape(session.importedAnswers[i].text)}</div>`:'<p class="archive-empty">移行元では未記入です。</p>'}</section>`).join('')}
      ${editable?saveControls(recordKey)+'</form>':''}${session.workNote?`<div class="work-note">${escape(session.workNote)}</div>`:''}</details>
      ${notes.map(n=>noteHTML(n,session.number)).join('')}</section>`;
  }
  const fieldsFrom=form=>Object.fromEntries([...form.querySelectorAll('[data-field]')].map(field=>[field.dataset.field,field.value]));
  const setStatus=(form,text)=>{form.querySelector('[data-status]').textContent=text;};
  const setFields=(form,fields)=>form.querySelectorAll('[data-field]').forEach(field=>{field.value=fields[field.dataset.field]??'';});
  async function submit(form){
    const recordKey=form.dataset.record;clearTimeout(timers.get(recordKey));
    const inputs=[...form.querySelectorAll('textarea,button')];inputs.forEach(input=>input.disabled=true);setStatus(form,'保存しています…');
    try{
      const saved=await MemberWorkSync.save(recordKey,fieldsFrom(form));dirtyForms.delete(recordKey);setStatus(form,statusText(saved));
      form.querySelector('[data-conflict]').replaceChildren();conflicts.delete(recordKey);
    }catch(error){
      const record=recordStatus(recordKey);
      setStatus(form,error.status===409?'別の端末で更新されています。内容を確認して、保存方法を選んでください。':`${error.message} ${record?.localBackup?'入力内容はこの端末に下書きとして残しています。':'この画面を閉じずに、もう一度保存してください。'}`);
      if(error.status===409&&error.latest){
        conflicts.set(recordKey,error.latest);
        const latest=await MemberWorkSync.latestFields(error.latest,recordKey);
        form.querySelector('[data-conflict]').innerHTML=`<div class="work-conflict"><h3>別の端末で保存された内容</h3>${Object.entries(latest).map(([id,text])=>`<p><b>${recordKey.startsWith('learning')?'学び・気づき':`質問${Number(id)+1}`}</b></p><div class="archive-answer">${escape(text||'（未記入）')}</div>`).join('')}<button type="button" data-action="load-latest">この保存内容を入力欄に反映する</button><button type="button" data-action="keep-mine">今の入力内容で保存し直す</button></div>`;
      }
    }finally{inputs.forEach(input=>input.disabled=false);}
  }
  function render(data,loadError){
    const total=data.sessions.reduce((n,s)=>n+answerCount(s),0);
    const otherNotes=data.supplementary.filter(n=>!/^第\d+回/.test(n.title));
    root.innerHTML=`<section class="hero-card"><div class="hero-top"><span>ワークと学びの記録</span><span class="user-pill">${escape(data.memberName)}さん専用</span></div><h1>${escape(data.memberName)}さん、こんにちは</h1><p>これまでの歩みを振り返りながら、一歩ずつ進みましょう。</p></section>
      <section class="stats"><div class="stat-card"><strong>${data.sessions.length}</strong><small>回分のワーク</small></div><div class="stat-card"><strong>${total}</strong><small>件の過去回答</small></div><div class="stat-card"><strong>${data.supplementary.length}</strong><small>学び・振り返りのタブ</small></div></section>
      ${!writable?'<section class="card work-connection" role="alert"><h2>入力・保存するには再ログインしてください</h2><p>以前と同じID・パスワードでログインし直すと、第30回以降に記入できます。</p><a class="video-link" href="index.html">ログイン画面へ</a></section>':loadError?`<section class="card work-connection" role="alert"><p>${escape(loadError.message)} この端末の下書きは表示しています。</p><button class="small-btn primary" id="retry-sync">保存先を再読み込みする</button></section>`:''}
      <section class="card archive-video-note"><h2>動画講義について</h2><p>動画は、これまでお送りしたリンクからご覧ください。<br>リンクが見つからない場合や必要な場合は、ジローにご連絡ください。再送します。</p></section>
      <section class="archive-filter" id="work-history"><h2>ワーク・学びの記録</h2><p class="archive-help">第29回までの回答を振り返れます。第30回以降は、ワークと「学び・気づき」を入力・保存できます。</p><label for="round-filter">取り組む回・振り返る回を選ぶ</label><select id="round-filter"><option value="all">すべての回を表示</option>${data.sessions.map(s=>`<option value="${s.number}">第${s.number}回：${escape(s.workTitle)}</option>`).join('')}</select><p><a href="#other-records">その他の振り返りへ ↓</a></p></section>
      <div id="archive-rounds">${data.sessions.map(s=>sessionHTML(s,data.supplementary.filter(n=>Number(n.title.match(/^第(\d+)回/)?.[1])===s.number))).join('')}</div>
      <section id="other-records" class="archive-filter"><h2>その他の振り返り</h2>${otherNotes.map(n=>noteHTML(n,0)).join('')}</section>
      <footer class="archive-footer">${escape(data.sourceCapturedAt.slice(0,10))}時点のシートの記録を反映しています。<br>共有の端末では、確認後にログアウトしてください。</footer>`;
    root.removeAttribute('aria-live');
    document.querySelector('#round-filter').addEventListener('change',event=>{
      document.querySelectorAll('[data-round]').forEach(section=>{section.hidden=event.target.value!=='all'&&section.dataset.round!==event.target.value;if(event.target.value!=='all'&&!section.hidden)section.querySelector('.archive-work').open=true;});
    });
    document.querySelector('#retry-sync')?.addEventListener('click',()=>{if(!dirtyForms.size)location.reload();else document.querySelector('#retry-sync').textContent='入力中の回答を先に保存してください';});
    root.addEventListener('input',event=>{
      const form=event.target.closest('form[data-record]');if(!form)return;
      const recordKey=form.dataset.record;dirtyForms.add(recordKey);clearTimeout(timers.get(recordKey));setStatus(form,'入力中です。最後に保存ボタンを押してください。');
      timers.set(recordKey,setTimeout(async()=>{try{const record=await MemberWorkSync.stage(recordKey,fieldsFrom(form));setStatus(form,record.localBackup?'端末に下書き保存済み。保存ボタンで保存してください。':'入力中です。最後に保存ボタンを押してください。');}catch(error){setStatus(form,error.message);}},600));
    });
    root.addEventListener('submit',event=>{const form=event.target.closest('form[data-record]');if(form){event.preventDefault();submit(form);}});
    root.addEventListener('click',async event=>{
      const button=event.target.closest('[data-action]');if(!button)return;
      const form=button.closest('form'),recordKey=form.dataset.record,latest=conflicts.get(recordKey);clearTimeout(timers.get(recordKey));
      if(button.dataset.action==='load-latest'){const record=await MemberWorkSync.acceptLatest(recordKey,latest);setFields(form,record.fields);dirtyForms.delete(recordKey);form.querySelector('[data-conflict]').replaceChildren();setStatus(form,statusText(record));}
      else{MemberWorkSync.useLatestVersion(recordKey,latest);submit(form);}
    });
    for(const form of root.querySelectorAll('form[data-record]'))if(recordStatus(form.dataset.record)?.dirty)dirtyForms.add(form.dataset.record);
  }
  window.addEventListener('beforeunload',event=>{if(dirtyForms.size){event.preventDefault();event.returnValue='';}});
  document.querySelector('#archive-logout').addEventListener('click',async()=>{
    // Keep encrypted local drafts even when the server is temporarily unavailable.
    for(const recordKey of dirtyForms){
      clearTimeout(timers.get(recordKey));const form=root.querySelector(`form[data-record="${recordKey}"]`);
      try{const record=await MemberWorkSync.stage(recordKey,fieldsFrom(form));if(!record.localBackup)throw Error('下書きを保存できませんでした。');}
      catch{setStatus(form,'入力内容を残せませんでした。この画面を閉じずに、回答を保存してください。');return;}
    }
    dirtyForms.clear();root.replaceChildren();MemberArchive.logout();
  });
  window.addEventListener('pagehide',()=>{for(const timer of timers.values())clearTimeout(timer);root.replaceChildren();});
  window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
  MemberArchive.restore().then(async data=>{
    if(!data){location.replace('index.html');return;}
    writable=await MemberWorkSync.restore();let loadError;
    if(writable){try{loadError=(await MemberWorkSync.load()).loadError;}catch(error){writable=false;loadError=error;}}
    render(data,loadError);
  }).catch(()=>{root.innerHTML='<section class="card"><h1>記録を読み込めませんでした</h1><p>通信状態を確認して、もう一度お試しください。</p><button class="wide-btn" id="archive-retry">もう一度読み込む</button></section>';document.querySelector('#archive-retry').addEventListener('click',()=>location.reload());});
})();
