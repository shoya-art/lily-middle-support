(function () {
  'use strict';
  const root = document.querySelector('#archive-root');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const answerCount = session => Object.values(session.importedAnswers).filter(a => a.text.trim()).length;
  const noteHTML = note => `<details class="card archive-note"><summary>${escape(note.title.trim())}</summary>${note.cells.map(cell => `<p>${escape(cell.text)}</p>`).join('')}</details>`;
  function sessionHTML(session, notes) {
    const count = answerCount(session);
    return `<section class="archive-round" data-round="${session.number}" id="round-${session.number}">
      <div class="chapter-heading">第${session.number}回</div>
      <details class="card archive-work"><summary><div><strong>${escape(session.workTitle)}</strong><small>${count ? `過去の回答 ${count} / ${session.workQuestions.length}件` : '移行元では未記入です'} ・ 開いて振り返る</small></div></summary>
      <p class="archive-readonly">以前に書いた回答をそのまま残しています。この画面では変更・再提出の必要はありません。</p>
      ${session.workDescription?.length ? `<div class="work-goals"><strong>このワークでやりたいこと</strong><ul>${session.workDescription.map(d => `<li>${escape(d)}</li>`).join('')}</ul></div>` : ''}
      ${session.workQuestions.map((q, i) => `<section class="work-question"><h3>質問${i+1}</h3><p>${escape(q.question || '（移行元の質問文が空欄のため、回答のみ表示しています）')}</p>${session.importedAnswers[i]?.text.trim() ? `<div class="archive-answer" data-answer="${session.number}-${i}">${escape(session.importedAnswers[i].text)}</div>` : '<p class="archive-empty">移行元では未記入です。</p>'}</section>`).join('')}
      ${session.workNote ? `<div class="work-note">${escape(session.workNote)}</div>` : ''}</details>
      ${notes.map(noteHTML).join('')}</section>`;
  }
  function render(data) {
    const total = data.sessions.reduce((n, s) => n + answerCount(s), 0);
    const otherNotes = data.supplementary.filter(n => !/^第\d+回/.test(n.title));
    root.innerHTML = `<section class="hero-card"><div class="hero-top"><span>これまでの記録</span><span class="user-pill">${escape(data.memberName)}さん専用</span></div><h1>${escape(data.memberName)}さん、こんにちは</h1><p>これまでの歩みを、自分のペースで振り返りましょう。</p></section>
      <section class="stats"><div class="stat-card"><strong>${data.sessions.length}</strong><small>回分のワーク</small></div><div class="stat-card"><strong>${total}</strong><small>件の過去回答</small></div><div class="stat-card"><strong>${data.supplementary.length}</strong><small>学び・振り返りのタブ</small></div></section>
      <section class="card archive-video-note"><h2>動画講義について</h2><p>動画は、これまでお送りしたリンクからご覧ください。<br>リンクが見つからない場合や必要な場合は、ジローにご連絡ください。再送します。</p></section>
      <section class="archive-filter" id="work-history"><h2>ワークの振り返り</h2><p class="archive-help">各回を開くと、以前に書いた回答を確認できます。「学び・気づき」も回ごとに残しています。</p><label for="round-filter">振り返りたい回を選ぶ</label><select id="round-filter"><option value="all">すべての回を表示</option>${data.sessions.map(s => `<option value="${s.number}">第${s.number}回：${escape(s.workTitle)}</option>`).join('')}</select><p><a href="#other-records">その他の振り返りへ ↓</a></p></section>
      <div id="archive-rounds">${data.sessions.map(s => sessionHTML(s, data.supplementary.filter(n => Number(n.title.match(/^第(\d+)回/)?.[1]) === s.number))).join('')}</div>
      <section id="other-records" class="archive-filter"><h2>その他の振り返り</h2>${otherNotes.map(noteHTML).join('')}</section>
      <footer class="archive-footer">${escape(data.sourceCapturedAt.slice(0,10))}時点の記録を移しています。空欄は元のまま残しています。<br>共有の端末では、確認後にログアウトしてください。</footer>`;
    root.removeAttribute('aria-live');
    document.querySelector('#round-filter').addEventListener('change', event => {
      const value = event.target.value;
      document.querySelectorAll('[data-round]').forEach(section => {
        section.hidden = value !== 'all' && section.dataset.round !== value;
        if (value !== 'all' && !section.hidden) section.querySelector('.archive-work').open = true;
      });
    });
  }
  document.querySelector('#archive-logout').addEventListener('click', () => {root.replaceChildren();MemberArchive.logout();});
  // Do not leave decrypted text in the browser back-forward cache after logout.
  window.addEventListener('pagehide', () => root.replaceChildren());
  window.addEventListener('pageshow', event => {if (event.persisted) location.reload();});
  MemberArchive.restore().then(data => {
    if (!data) {location.replace('index.html');return;}
    render(data);
  }).catch(() => {
    root.innerHTML = '<section class="card"><h1>記録を読み込めませんでした</h1><p>通信状態を確認して、もう一度お試しください。</p><button class="wide-btn" id="archive-retry">もう一度読み込む</button></section>';
    document.querySelector('#archive-retry').addEventListener('click', () => location.reload());
  });
})();
