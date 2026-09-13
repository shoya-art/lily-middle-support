const misakiSessions=[{
  number:1,
  videoTitle:'彼に対して不安になった時、自分がどう動いているかに気づく',
  videoUrl:'https://youtu.be/9cqC2Tbu1iw',
  videoEmbedUrl:'https://www.youtube.com/embed/9cqC2Tbu1iw',
  workTitle:'彼に対する行動を振り返る',
  workQuestions:[
    {question:'最近、彼のことで不安になった場面はありましたか？どんな時でしたか？',examples:['彼からの既読がついたのに、なかなか返信が来なかった','彼がストーリーを見ていないことに気づいた','彼とのLINEアルバムが、まだ残っていた'],label:'ミサキさんの場面'},
    {question:'その時、ミサキさんは彼に対して、実際にどんな行動をとりましたか？',examples:['すぐにもう一度彼にLINEを送った','彼とのやり取りのスクショを何回も見返した','彼のSNSをチェックした'],label:'ミサキさんの行動'},
    {question:'その場面で、今わかっている「事実」だけを書き出してみてください。',examples:['彼から既読がついてから、3時間返信がなかった。それだけ。'],label:'事実だけを書くと'},
    {question:'その事実に対して、ミサキさんが想像していたことは何でしたか？',examples:['彼はもう好きじゃないのかもしれない','彼に他に気になる人ができたのかもしれない'],label:'ミサキさんの想像'},
    {question:'同じ事実でも、彼の側に他にどんな理由が考えられそうですか？',examples:['彼は仕事が忙しかった','彼は返信の内容を考えていた','彼はスマホを見る時間がなかった'],label:'他にありそうな理由'},
    {question:'もし今、同じことがもう一回起きたら、彼に対して行動する前に「60秒待つ」を実際にやってみたいですか？',type:'choice',choices:['やってみたい','まだ難しそう']},
    {question:'彼に対して不安になった時、自分に言ってあげたい言葉をひとつ決めるとしたら？',examples:['これは事実？それとも想像？','60秒だけ待ってみよう'],label:'ミサキさんの言葉'}
  ]
},{
  number:2,
  videoTitle:'彼の「触れられたくない話題」を理解する',
  videoUrl:'https://youtu.be/PXvLwOUYgPA',
  videoEmbedUrl:'https://www.youtube.com/embed/PXvLwOUYgPA',
  workTitle:'彼の「触れられたくない話題」リストを作る',
  workDescription:['彼が触れられたくないと感じやすい話題を、あらかじめ言語化しておく','過去に送ったLINEを、彼の受け取り方の視点で見直す練習をする','送る前のチェック方法を、実際に体験してみる'],
  workQuestions:[
    {question:'彼が自分から話してくれた、コンプレックス・弱み・過去の失敗を、思いつく限り書き出してみてください。',examples:['仕事が長く続かないこと','過去の恋愛での失敗','家族との関係で悩んでいたこと'],label:'ミサキさんのリスト',placeholder:'1.\n\n2.\n\n3.\n\n4.\n\n5.'},
    {question:'これまで彼に、彼自身のことについて、誰かの意見やアドバイスを伝えたことはありますか？どんな内容でしたか？',label:'ミサキさんの経験'},
    {question:'その時のLINE（または会話）を、彼の立場で読み返してみてください。彼はそれを読んで、「大事にされてる」と感じそうですか？それとも「値踏みされてる」と感じそうですか？',type:'choice',choices:['大事にされてる','値踏みされてる']},
    {question:'質問2で伝えた内容を、彼を評価しない言い方に変えるとしたら、どう伝え直せますか？',examples:['変更前：「お母さんが、逃げ癖は3年頑張れば直るって言ってた」','変更後：「無理しないでほしいけど、今の場所で頑張ってるあなたを、私は応援してるよ」'],label:'ミサキさんの伝え直し'},
    {question:'これから彼にLINEを送る前、送信ボタンを押す直前に、自分に聞く言葉を決めておきましょう。',label:'ミサキさんの言葉',placeholder:'これ、彼が読んだら「大事にされてる」って感じるかな？それとも「　　　　　」って感じるかな？'}
  ],
  workNote:'質問1で作ったリストは、スマホのメモに保存しておいて、彼にLINEを送る前にいつでも見返せるようにしておいてください。今日から完璧にできなくても大丈夫です。まずは、送る前に一度立ち止まって、このリストを見る習慣をつけることがゴールです。'
},{
  number:3,
  videoTitle:'一度返事をもらった後、何度も確認・謝罪してしまうことについて',
  videoUrl:'https://youtu.be/ZWlNK6RwUSY',
  videoEmbedUrl:'https://www.youtube.com/embed/ZWlNK6RwUSY',
  workTitle:'確認・謝罪のやり取りを振り返る',
  workDescription:['一度返事をもらった後、もう一度確認してしまった場面を振り返る','予定変更をまとめて伝える練習をする','次に同じ場面が来た時の対応を、あらかじめ決めておく'],
  workQuestions:[
    {question:'彼から一度「いいよ」「大丈夫」と返事をもらった後、もう一度同じことを確認してしまったことはありますか？どんな場面でしたか？',label:'ミサキさんの場面'},
    {question:'その時、なぜもう一度確認したくなったと思いますか？',examples:['本当に大丈夫か、もっと安心したかった','相手の本音が知りたかった'],label:'ミサキさんの理由'},
    {question:'もし今回の場面（予定変更について「それも嫌だった？」と聞いた場面）を、確認せずに終えていたとしたら、どう変わっていたと思いますか？',label:'ミサキさんの考え'},
    {question:'質問1の場面で、「それも嫌だった？」のような、もう一度確認する言葉の代わりに、「ありがとう、助かる！」のように会話を区切る一言を返すとしたら、どんな言葉になりそうですか？',label:'ミサキさんの一言'},
    {question:'これから、彼から一度返事をもらったら、自分に言い聞かせる言葉を決めておきましょう。',examples:['「一度もらった返事は、そのまま受け取る」','「気になっても、今日はもう聞かない」'],label:'ミサキさんの言葉'},
    {question:'それでも、もし本当に気になって仕方がない時は、どれくらい時間を置いてから、どんな聞き方で確認したいですか？',fields:['時間の目安','確認する時の聞き方']},
    {question:'今、予定として変更しそうなこと、まだ彼に伝えていないことがあれば、書き出してみてください。それをまとめて伝えるとしたら、どんな1つのメッセージにできますか？',fields:['変更しそうな予定','まとめて伝えるメッセージ案']}
  ]
}];

const memberAccounts = [
  {id:'001',password:'misaki',name:'ミサキ'},
  {id:'002',password:'ayano',name:'あやの'}
];
const courseByMember = {'001':misakiSessions,'002':ayanoSessions};
let lessons = [];
function escapeHtml(value){return String(value ?? '').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]))}
function readJson(storage,key,fallback={}){
  try{return JSON.parse(storage.getItem(key) || 'null') || fallback}catch{return fallback}
}
function currentMember(){
  if(sessionStorage.getItem('demo-role')!=='member')return null;
  const stored=readJson(sessionStorage,'member-account');
  return memberAccounts.find(account=>account.id===stored.id) || null;
}
function answerKey(id,memberId=currentMember()?.id){return `member-${memberId}:work-${id}`}
function getAnswers(id,memberId=currentMember()?.id){
  if(!memberId)return {};
  const saved=readJson(localStorage,answerKey(id,memberId));
  return saved && typeof saved==='object' && !Array.isArray(saved)?saved:{};
}
function hasAnswers(id,memberId=currentMember()?.id){return Object.values(getAnswers(id,memberId)).some(value=>typeof value==='string' && value.trim())}
function buildLessons(memberId){
  return (courseByMember[memberId] || []).flatMap(session=>[
    ...(session.videoUrl?[{id:`${session.number}-video`,round:`第${session.number}回`,title:session.videoTitle,type:'video',url:session.videoUrl,embedUrl:session.videoEmbedUrl,previouslyCompleted:!!session.videoPreviouslyCompleted}]:[]),
    {id:`${session.number}-work`,round:`第${session.number}回`,title:session.workTitle,type:'work',questions:session.workQuestions,description:session.workDescription,note:session.workNote,previouslyCompleted:!!session.previouslyCompleted}
  ]);
}
function migrateMisakiAnswers(){
  // The old unscoped version had only account 001. Preserve its answers without
  // ever assigning them to newly added members. Keep original keys as a backup.
  if(currentMember()?.id!=='001')return;
  misakiSessions.forEach(session=>{
    const id=`${session.number}-work`, target=answerKey(id,'001');
    const legacy=localStorage.getItem(`work-${id}`);
    if(legacy && !localStorage.getItem(target))localStorage.setItem(target,legacy);
  });
}
function login(){
  const id=document.querySelector('#member-id').value.trim(),pw=document.querySelector('#password').value;
  const error=document.querySelector('#login-error');
  if(id==='000' && pw==='ziro'){
    sessionStorage.setItem('demo-role','admin');sessionStorage.removeItem('member-account');location.href='admin.html';return;
  }
  const member=memberAccounts.find(account=>account.id===id && account.password===pw);
  if(!member){error.textContent='IDまたはパスワードが正しくありません';return}
  sessionStorage.setItem('demo-role','member');
  sessionStorage.setItem('member-account',JSON.stringify({id:member.id,name:member.name}));
  migrateMisakiAnswers();location.href='dashboard.html';
}
function logout(){sessionStorage.removeItem('demo-role');sessionStorage.removeItem('member-account');location.href='index.html'}
function lessonDone(lesson,memberId=currentMember()?.id){
  return lesson.previouslyCompleted || (lesson.type==='work'?hasAnswers(lesson.id,memberId):localStorage.getItem(`member-${memberId}:done-${lesson.id}`)==='true');
}
function renderLessons(){
  const root=document.querySelector('#lesson-root');if(!root)return;
  const groups=[...new Set(lessons.map(item=>item.round))];
  root.innerHTML=groups.map(round=>`<section class="chapter"><div class="chapter-heading">${round}</div>${lessons.filter(item=>item.round===round).map((item,index)=>`<button class="lesson-card ${lessonDone(item)?'completed':''}" onclick="openLesson('${item.id}')"><span class="lesson-num">${lessonDone(item)?'✓':index+1}</span><span class="lesson-copy"><span class="lesson-type ${item.type}">${item.type==='video'?'動画講義':'ワーク'}</span><strong>${escapeHtml(item.title)}</strong>${item.previouslyCompleted?'<small>過去に取り組み済み・再記入できます</small>':''}</span><span class="lesson-arrow">›</span></button>`).join('')}</section>`).join('') || '<section class="card empty-state"><h2>講義・ワークはまだありません</h2></section>';
  const done=lessons.filter(item=>lessonDone(item)).length;
  document.querySelector('#course-count').textContent=`${done} / ${lessons.length}`;
  document.querySelector('#course-fill').style.width=`${lessons.length?Math.round(done/lessons.length*100):0}%`;
}
function openLesson(id){
  const member=currentMember(),lesson=lessons.find(item=>item.id===id);if(!member || !lesson)return;
  document.querySelector('#modal-title').textContent=lesson.title;
  const content=document.querySelector('#modal-content');
  if(lesson.type==='video'){
    const driveVideo=lesson.url.startsWith('https://drive.google.com/');
    content.innerHTML=`<div class="video-box"><iframe src="${lesson.embedUrl || lesson.url.replace('https://youtu.be/','https://www.youtube.com/embed/')}" title="${escapeHtml(lesson.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><a class="video-link" href="${lesson.url}" target="_blank" rel="noopener">${driveVideo?'Google Drive':'YouTube'}で開く</a>${driveVideo?'<p class="work-intro">表示できない場合はGoogle Driveで開いてください。動画の閲覧は元の共有設定に従います。</p>':''}<button class="wide-btn" onclick="completeVideo('${id}')">視聴を完了する</button>`;
  }else{
    const saved=getAnswers(id);
    const field=(key,label,placeholder='ここに回答を入力してください')=>`<label>${escapeHtml(label)}</label><textarea data-question="${key}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(saved[key] || '')}</textarea>`;
    content.innerHTML=`<p class="work-intro">${lesson.round}の内容を振り返りながら、順番に答えてみましょう。</p>${lesson.previouslyCompleted?'<div class="work-note">このワークは過去に取り組み済みです。再提出は不要です。過去の回答は移行していないため、必要に応じてあらためて記入・保存できます。</div>':''}${lesson.description?`<div class="work-goals"><strong>このワークでやりたいこと</strong><ul>${lesson.description.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul></div>`:''}${lesson.questions.map((question,index)=>`<section class="work-question"><h3>質問${index+1}</h3><p>${escapeHtml(question.question)}</p>${question.examples?`<div class="work-examples"><small>例えばこんな感じです</small><ul>${question.examples.map(example=>`<li>${escapeHtml(example)}</li>`).join('')}</ul></div>`:''}${question.type==='choice'?`<div class="choice-list">${question.choices.map(choice=>`<label><input type="radio" name="question-${index}" data-question="${index}" value="${escapeHtml(choice)}" ${saved[index]===choice?'checked':''}> ${escapeHtml(choice)}</label>`).join('')}</div>`:question.fields?question.fields.map((label,fieldIndex)=>field(`${index}-${fieldIndex}`,label)).join(''):field(index,question.label,question.placeholder)}</section>`).join('')}${lesson.note?`<div class="work-note">${escapeHtml(lesson.note)}</div>`:''}<button class="wide-btn" onclick="saveWork('${id}')">回答を保存する</button><a class="video-link" href="answers.html">保存した回答を振り返る →</a>`;
  }
  document.querySelector('#lesson-modal').classList.add('open');
}
function closeModal(){document.querySelector('#lesson-modal')?.classList.remove('open')}
function completeVideo(id){
  if(!currentMember() || !lessons.some(item=>item.id===id && item.type==='video'))return;
  localStorage.setItem(`member-${currentMember().id}:done-${id}`,'true');closeModal();renderLessons();
}
function saveWork(id){
  if(!currentMember() || !lessons.some(item=>item.id===id && item.type==='work'))return;
  const answers={};
  document.querySelectorAll('#modal-content [data-question]').forEach(field=>{
    if(field.type!=='radio' || field.checked)answers[field.dataset.question]=field.value;
  });
  const button=document.querySelector('#modal-content .wide-btn');
  try{
    localStorage.setItem(answerKey(id),JSON.stringify(answers));
    button.textContent='保存しました ✓';renderLessons();
  }catch{button.textContent='保存できませんでした。ブラウザの設定を確認してください'}
}
function renderAnswers(){
  const root=document.querySelector('#answers-root');if(!root)return;
  root.innerHTML=lessons.filter(item=>item.type==='work').map(work=>{
    const saved=getAnswers(work.id),savedAny=hasAnswers(work.id);
    const answers=work.questions.flatMap((question,index)=>question.fields?question.fields.map((label,fieldIndex)=>({question:`質問${index+1}：${question.question}`,label,value:saved[`${index}-${fieldIndex}`]})):[{question:`質問${index+1}：${question.question}`,label:question.label || '選んだ回答',value:saved[index]}]);
    const status=savedAny?'保存済み':work.previouslyCompleted?'過去に取り組み済み':'未回答';
    return `<section class="answer-card"><div class="answer-head"><div><span>${work.round}</span><h2>${escapeHtml(work.title)}</h2></div><span class="answer-status ${savedAny || work.previouslyCompleted?'saved':'empty'}">${status}</span></div>${savedAny?`<div class="answer-list">${answers.filter(answer=>String(answer.value || '').trim()).map(answer=>`<div class="answer-item"><small>${escapeHtml(answer.question)}</small><b>${escapeHtml(answer.label)}</b><p>${escapeHtml(answer.value).replace(/\n/g,'<br>')}</p></div>`).join('')}</div>`:`<p class="answer-empty">${work.previouslyCompleted?'過去の回答は移行していません。このサイトで保存した回答は、ここに表示されます。':'このワークには、まだ保存された回答がありません。'}</p>`}<a class="answer-edit" href="lectures.html?work=${work.id}">${savedAny?'回答を確認・編集する':work.previouslyCompleted?'ワークを確認・再記入する':'ワークに回答する'} →</a></section>`;
  }).join('');
}
function renderDashboard(){
  if(!document.querySelector('#dashboard-root'))return;
  const member=currentMember(),done=lessons.filter(item=>lessonDone(item)).length;
  const percent=lessons.length?Math.round(done/lessons.length*100):0;
  document.querySelector('#greeting').textContent=`${member.name}さん、こんにちは`;
  document.querySelector('#member-pill').textContent=`${member.name}さん専用`;
  document.querySelector('#today').textContent=new Intl.DateTimeFormat('ja-JP',{year:'numeric',month:'long',day:'numeric',weekday:'short'}).format(new Date());
  document.querySelector('#hero-message').textContent=member.id==='002'?'過去に取り組んだワークを確認・再記入できます。':'自分のペースで、講義とワークに取り組みましょう。';
  document.querySelector('#stat-progress').textContent=`${percent}%`;
  document.querySelector('#stat-video').textContent=lessons.filter(item=>item.type==='video' && lessonDone(item)).length;
  document.querySelector('#stat-work').textContent=lessons.filter(item=>item.type==='work' && hasAnswers(item.id)).length;
  document.querySelector('#home-count').textContent=`${done} / ${lessons.length} 完了`;
  document.querySelector('#home-percent').textContent=`${percent}%`;
  document.querySelector('#home-fill').style.width=`${percent}%`;
  document.querySelector('#course-description').textContent=member.id==='002'?'第1回〜第30回のワークと28本の動画講義（第11・12回はワークのみ）':'第1回〜第3回の動画講義・ワーク';
}
function renderAdmin(selected=0){
  const list=document.querySelector('#member-list');if(!list)return;
  const stats=memberAccounts.map(member=>{
    const course=buildLessons(member.id),done=course.filter(item=>lessonDone(item,member.id)).length;
    return {...member,course,progress:course.length?Math.round(done/course.length*100):0,saved:course.filter(item=>item.type==='work' && hasAnswers(item.id,member.id))};
  });
  list.innerHTML=stats.map((member,index)=>`<button class="${index===selected?'active':''}" onclick="renderAdmin(${index})"><span class="member-name"><b>${member.name}</b><small>ID ${member.id}</small></span><span class="member-progress"><b>${member.progress}%</b><span class="mini-track"><i style="width:${member.progress}%"></i></span></span><span class="member-concern">このブラウザの保存回答 ${member.saved.length}件</span><span class="flag ${member.id==='002'?'good':'warning'}">${member.id==='002'?'過去受講':'受講中'}</span></button>`).join('');
  const member=stats[selected];
  document.querySelector('#detail-name').textContent=member.name;
  document.querySelector('#detail-flag').textContent=`ID ${member.id}`;
  document.querySelector('#detail-progress').textContent=`進捗 ${member.progress}% ・ ${member.course.length}コンテンツ`;
  document.querySelector('#detail-concern').textContent=member.saved.length?member.saved.map(work=>`${work.round} ${work.title}\n${Object.values(getAnswers(work.id,member.id)).filter(Boolean).join('\n')}`).join('\n\n'):'このブラウザには保存回答がありません。別端末の回答は確認できません。';
  document.querySelector('#admin-member-count').textContent=`${stats.length}名`;
  document.querySelector('#admin-course-count').textContent=`${Object.values(courseByMember).reduce((count,course)=>count+course.length,0)}回`;
  document.querySelector('#admin-answer-count').textContent=`${stats.reduce((count,member)=>count+member.saved.length,0)}件`;
}
document.addEventListener('keydown',event=>{if(event.key==='Enter' && document.querySelector('#member-id'))login()});
document.addEventListener('DOMContentLoaded',()=>{
  const page=location.pathname.split('/').pop() || 'index.html';
  if(page==='admin.html'){
    if(sessionStorage.getItem('demo-role')!=='admin'){location.href='index.html';return}
    renderAdmin();return;
  }
  if(['dashboard.html','lectures.html','answers.html'].includes(page)){
    const member=currentMember();
    if(!member){location.href='index.html';return}
    migrateMisakiAnswers();lessons=buildLessons(member.id);
    renderLessons();renderAnswers();renderDashboard();
    const workId=new URLSearchParams(location.search).get('work');
    if(page==='lectures.html' && workId)openLesson(workId);
  }
});
