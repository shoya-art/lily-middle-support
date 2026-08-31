const sessions=[{
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
}];
const lessons=sessions.flatMap(session=>[
  {id:`${session.number}-video`,round:`第${session.number}回`,title:session.videoTitle,type:'video',url:session.videoUrl,done:false},
  {id:`${session.number}-work`,round:`第${session.number}回`,title:session.workTitle,type:'work',questions:session.workQuestions,description:session.workDescription,note:session.workNote,done:false}
]);
const memberAccounts=[{id:'001',password:'misaki',name:'ミサキ'}];
function login(){const id=document.querySelector('#member-id').value.trim();const pw=document.querySelector('#password').value;const error=document.querySelector('#login-error');if(!id||!pw){error.textContent='IDとパスワードを入力してください';return}if(id==='000'&&pw==='ziro'){sessionStorage.setItem('demo-role','admin');sessionStorage.removeItem('member-account');location.href='admin.html';return}const member=memberAccounts.find(account=>account.id===id&&account.password===pw);if(!member){error.textContent='IDまたはパスワードが正しくありません';return}sessionStorage.setItem('demo-role','member');sessionStorage.setItem('member-account',JSON.stringify(member));location.href='dashboard.html'}
function guardAdmin(){if(location.pathname.endsWith('/admin.html')&&sessionStorage.getItem('demo-role')!=='admin')location.href='index.html'}
function renderLessons(){const root=document.querySelector('#lesson-root');if(!root)return;if(!lessons.length){root.innerHTML='<section class="card empty-state"><span>▶</span><h2>講義はまだありません</h2><p>動画講義とワークが追加されると、ここに第1回から順番に表示されます。</p></section>';return}const groups=[...new Set(lessons.map(x=>x.round))];root.innerHTML=groups.map(round=>`<section class="chapter"><div class="chapter-heading">${round}</div>${lessons.filter(x=>x.round===round).map((x,index)=>`<button class="lesson-card ${x.done?'completed':''}" onclick="openLesson('${x.id}')"><span class="lesson-num">${x.done?'✓':index+1}</span><span class="lesson-copy"><span class="lesson-type ${x.type}">${x.type==='video'?'動画講義':'ワーク'}</span><strong>${x.title}</strong></span><span class="lesson-arrow">${x.done?'✓':'›'}</span></button>`).join('')}</section>`).join('')}
function openLesson(id){const l=lessons.find(x=>x.id===id);if(!l)return;document.querySelector('#modal-title').textContent=l.title;if(l.type==='video'){document.querySelector('#modal-content').innerHTML=`<div class="video-box"><iframe src="${l.url.replace('https://youtu.be/','https://www.youtube.com/embed/')}" title="${l.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><a class="video-link" href="${l.url}" target="_blank" rel="noopener">YouTubeで開く</a><button class="wide-btn" onclick="closeModal()">視聴を完了する</button>`}else{const saved=JSON.parse(localStorage.getItem(`work-${l.id}`)||'{}');document.querySelector('#modal-content').innerHTML=`<p class="work-intro">動画講義を振り返りながら、順番に答えてみましょう。</p>${l.description?`<div class="work-goals"><strong>このワークでやりたいこと</strong><ul>${l.description.map(item=>`<li>${item}</li>`).join('')}</ul></div>`:''}${l.questions.map((q,index)=>`<section class="work-question"><h3>質問${index+1}</h3><p>${q.question}</p>${q.examples?`<div class="work-examples"><small>例えばこんな感じです</small><ul>${q.examples.map(example=>`<li>${example}</li>`).join('')}</ul></div>`:''}${q.type==='choice'?`<div class="choice-list">${q.choices.map(choice=>`<label><input type="radio" name="question-${index}" data-question="${index}" value="${choice}" ${saved[index]===choice?'checked':''}> ${choice}</label>`).join('')}</div>`:`<label>${q.label}</label><textarea data-question="${index}" placeholder="${q.placeholder||'ここに回答を入力してください'}">${saved[index]||''}</textarea>`}</section>`).join('')}${l.note?`<div class="work-note">${l.note}</div>`:''}<button class="wide-btn" onclick="saveWork('${l.id}')">回答を保存する</button>`}document.querySelector('#lesson-modal').classList.add('open')}
function closeModal(){document.querySelector('#lesson-modal')?.classList.remove('open')}
function saveWork(id){const answers={};document.querySelectorAll('[data-question]').forEach(field=>{const key=field.dataset.question;if(field.type==='radio'){if(field.checked)answers[key]=field.value}else{answers[key]=field.value}});localStorage.setItem(`work-${id}`,JSON.stringify(answers));const b=document.querySelector('#modal-content .wide-btn');b.textContent='保存しました ✓'}
const members=[{name:'ミサキ',progress:0,last:'まだありません',concern:'ワーク回答はまだありません。',flag:'未開始',tone:'warning'}];
function renderAdmin(selected=0){const list=document.querySelector('#member-list');if(!list)return;list.innerHTML=members.map((m,i)=>`<button class="${i===selected?'active':''}" onclick="renderAdmin(${i})"><span class="member-name"><b>${m.name}</b><small>最終取組 ${m.last}</small></span><span class="member-progress"><b>${m.progress}%</b><span class="mini-track"><i style="width:${m.progress}%"></i></span></span><span class="member-concern">${m.concern}</span><span class="flag ${m.tone}">${m.flag}</span></button>`).join('');const m=members[selected];document.querySelector('#detail-name').textContent=m.name;document.querySelector('#detail-flag').className=`flag ${m.tone}`;document.querySelector('#detail-flag').textContent=m.flag;document.querySelector('#detail-concern').textContent=m.concern;document.querySelector('#detail-progress').textContent=`進捗 ${m.progress}% ・ 最終取組 ${m.last}`}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&document.querySelector('#member-id'))login()});
document.addEventListener('DOMContentLoaded',()=>{guardAdmin();renderLessons();renderAdmin()});
