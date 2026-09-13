const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function storage(){
  const values = new Map();
  return {getItem:key=>values.get(key) ?? null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
}
const elements = {};
for(const id of ['#member-id','#password','#login-error','#lesson-root','#course-count','#course-fill','#modal-title','#modal-content','#lesson-modal','#modal-content .wide-btn','#answers-root']){
  elements[id] = {value:'',innerHTML:'',textContent:'',style:{},classList:{add(){},remove(){}}};
}
let fields = [];
const listeners = {};
const context = vm.createContext({
  console,URLSearchParams,Intl,Date,
  localStorage:storage(),sessionStorage:storage(),
  location:{pathname:'/lectures.html',search:'',href:''},
  document:{querySelector:selector=>elements[selector] || null,querySelectorAll:()=>fields,addEventListener:(name,fn)=>listeners[name]=fn}
});
for(const file of ['ayano-content.js','app.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const run = source=>vm.runInContext(source,context);
listeners.DOMContentLoaded();
assert.equal(context.location.href,'index.html');
assert.equal(run('lessons.length'),0);
assert.equal(run('ayanoSessions.length'),30);
assert.equal(run('ayanoSessions.reduce((n,s)=>n+s.workQuestions.length,0)'),300);
assert.equal(run('ayanoSessions.every(s=>s.previouslyCompleted && s.workQuestions.every(q=>!q.examples))'),true);
context.localStorage.setItem('work-1-work',JSON.stringify({'0':'legacy Misaki answer'}));
elements['#member-id'].value='002';elements['#password'].value='ayano';
run('login()');
assert.equal(context.location.href,'dashboard.html');
assert.equal(context.sessionStorage.getItem('member-account').includes('password'),false);
listeners.DOMContentLoaded();
assert.equal(run('lessons.length'),58);
assert.equal(run('lessons.filter(l=>l.type==="work").every(l=>lessonDone(l))'),true);
assert.equal(run('lessons.filter(l=>l.type==="video").length'),28);
assert.equal(run('lessons.some(l=>["11-video","12-video"].includes(l.id))'),false);
run('openLesson("1-video")');
assert.ok(elements['#modal-content'].innerHTML.includes('1wjVgDKMuUmX0sTNptIytEPmt3JPWvq4K/preview'));
assert.ok(elements['#modal-content'].innerHTML.includes('Google Driveで開く'));
assert.equal(run('hasAnswers("1-work")'),false);
assert.equal(context.localStorage.getItem('member-002:work-1-work'),null);
fields=[{type:'textarea',dataset:{question:'0'},value:'Ayano <script>alert(1)</script>'}];
run('saveWork("1-work");renderAnswers()');
assert.equal(run('getAnswers("1-work")["0"]'),fields[0].value);
assert.ok(elements['#answers-root'].innerHTML.includes('&lt;script&gt;'));
assert.ok(!elements['#answers-root'].innerHTML.includes('<script>'));
run('openLesson("1-work")');
assert.ok(elements['#modal-content'].innerHTML.includes('&lt;script&gt;'));
assert.ok(!elements['#modal-content'].innerHTML.includes('legacy Misaki answer'));
for(const id of ['#dashboard-root','#greeting','#member-pill','#today','#hero-message','#stat-progress','#stat-video','#stat-work','#home-count','#home-percent','#home-fill','#course-description','#member-list','#detail-name','#detail-flag','#detail-progress','#detail-concern','#admin-member-count','#admin-course-count','#admin-answer-count']){
  elements[id]={innerHTML:'',textContent:'',style:{}};
}
run('renderDashboard();renderAdmin(1)');
assert.equal(elements['#greeting'].textContent,'あやのさん、こんにちは');
assert.equal(elements['#home-count'].textContent,'30 / 58 完了');
assert.equal(elements['#admin-member-count'].textContent,'2名');
assert.equal(elements['#admin-course-count'].textContent,'33回');
assert.equal(elements['#detail-name'].textContent,'あやの');
assert.equal(context.localStorage.getItem('member-001:work-1-work'),null);
elements['#member-id'].value='001';elements['#password'].value='misaki';
run('login()');listeners.DOMContentLoaded();
assert.equal(run('lessons.length'),6);
assert.equal(run('getAnswers("1-work")["0"]'),'legacy Misaki answer');
assert.ok(context.localStorage.getItem('work-1-work'));
fields=[
  {type:'textarea',dataset:{question:'0'},value:'Misaki updated'},
  {type:'radio',checked:false,dataset:{question:'5'},value:'まだ難しそう'},
  {type:'radio',checked:true,dataset:{question:'5'},value:'やってみたい'}
];
run('saveWork("1-work")');
assert.equal(run('getAnswers("1-work")["5"]'),'やってみたい');
assert.equal(JSON.parse(context.localStorage.getItem('member-002:work-1-work'))['0'],'Ayano <script>alert(1)</script>');
run('openLesson("3-work")');
assert.ok(elements['#modal-content'].innerHTML.includes('data-question="5-0"'));
assert.ok(elements['#modal-content'].innerHTML.includes('data-question="6-1"'));
run('logout()');
assert.equal(context.sessionStorage.getItem('member-account'),null);
assert.equal(run('currentMember()'),null);
console.log('PASS: 30 rounds/300 questions, account separation, legacy preservation, answer review, editing, choice fields, logout and login gate');
