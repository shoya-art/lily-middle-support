"use client";

import { useState } from "react";

type View = "member" | "admin";

const lessons = [
  { chapter: "STEP 1", title: "現在地を整理する", kind: "動画講義", duration: "18分", status: "done" },
  { chapter: "STEP 1", title: "別れの本当の原因を見つける", kind: "ワーク", duration: "回答済み", status: "done" },
  { chapter: "STEP 2", title: "感情に振り回されない土台づくり", kind: "動画講義", duration: "24分", status: "current" },
  { chapter: "STEP 2", title: "不安が出たときの思考整理", kind: "ワーク", duration: "約15分", status: "next" },
];

const members = [
  { name: "山田 花子", progress: 68, last: "今日", videos: "8/12", works: "6/10", concern: "相手から返信がなく、不安が強くなっている", state: "要確認", tone: "red" },
  { name: "佐藤 美咲", progress: 86, last: "昨日", videos: "11/12", works: "8/10", concern: "次の連絡を送るタイミングで迷っている", state: "順調", tone: "green" },
  { name: "高橋 彩", progress: 42, last: "5日前", videos: "5/12", works: "4/10", concern: "自分の気持ちを整理しきれていない", state: "停滞気味", tone: "yellow" },
  { name: "伊藤 奈緒", progress: 24, last: "8日前", videos: "3/12", works: "2/10", concern: "まだ回答がありません", state: "要フォロー", tone: "red" },
];

export default function Home() {
  const [view, setView] = useState<View>("member");
  const [selected, setSelected] = useState(0);
  const [saved, setSaved] = useState(false);
  return (
    <main className="site-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">L</span><div><strong>Lily Support</strong><small>ミドルエンド会員サイト</small></div></div>
        <div className="view-switch" aria-label="表示切り替え"><button className={view === "member" ? "active" : ""} onClick={() => setView("member")}>受講者画面</button><button className={view === "admin" ? "active" : ""} onClick={() => setView("admin")}>管理画面</button></div>
        <div className="account"><span>山田 花子さん</span><button aria-label="アカウントメニュー">•••</button></div>
      </header>
      {view === "member" ? <div className="page member-page">
        <section className="welcome"><div><p className="eyebrow">HANAKO&apos;S PRIVATE PROGRAM</p><h1>花子さん、おかえりなさい。</h1><p>焦らず、今日できることをひとつずつ進めていきましょう。</p></div><div className="progress-orb"><strong>68<small>%</small></strong><span>全体の進捗</span></div></section>
        <div className="member-grid"><div>
          <section className="next-card"><div className="section-kicker">次に取り組む内容</div><div className="video-thumb"><span>▶</span><small>動画講義・24分</small></div><div className="next-copy"><span className="pill">STEP 2</span><h2>感情に振り回されない土台づくり</h2><p>不安や焦りが出たときも、自分を落ち着かせて適切な行動を選べるようになるための講義です。</p><button className="primary">講義を続きから見る <span>→</span></button></div></section>
          <section className="section-block"><div className="section-head"><div><span>PROGRAM</span><h2>講義とワーク</h2></div><button>すべて見る</button></div><div className="lesson-list">{lessons.map((lesson,index)=><article className={`lesson ${lesson.status}`} key={lesson.title}><div className="lesson-status">{lesson.status === "done" ? "✓" : index+1}</div><div className="lesson-main"><small>{lesson.chapter} ・ {lesson.kind}</small><strong>{lesson.title}</strong></div><span className="lesson-duration">{lesson.duration}</span><span className="arrow">›</span></article>)}</div></section>
        </div><aside>
          <section className="side-card work-card"><span className="side-icon">✎</span><small>今回のワーク</small><h3>不安が出たときの思考整理</h3><p>今、一番強く感じている不安は何ですか？ その不安の奥にある本音も書いてみましょう。</p><textarea aria-label="ワーク回答" placeholder="ここに回答を入力してください…" onChange={()=>setSaved(false)} /><button className="secondary" onClick={()=>setSaved(true)}>{saved ? "保存しました ✓" : "回答を保存する"}</button></section>
          <section className="side-card call-card"><div><small>NEXT CALL</small><strong>次回の電話サポート</strong></div><div className="call-date"><b>29</b><span>8月<br/>金曜日</span></div><p>今回のワーク内容をもとに、一緒に状況を整理します。</p></section>
        </aside></div>
      </div> : <div className="page admin-page">
        <section className="admin-title"><div><p className="eyebrow">MEMBER OVERVIEW</p><h1>受講者の状況</h1><p>進捗と直近の回答から、今フォローが必要な方を確認できます。</p></div><button className="outline">コンテンツ管理</button></section>
        <section className="stats"><article><small>受講者</small><strong>12<span>名</span></strong><em>全員アクティブ</em></article><article><small>平均進捗</small><strong>61<span>%</span></strong><em>先週より +6%</em></article><article><small>今週の提出</small><strong>23<span>件</span></strong><em>新着 4件</em></article><article className="attention"><small>要確認</small><strong>3<span>名</span></strong><em>回答または停滞あり</em></article></section>
        <div className="admin-grid"><section className="panel member-panel"><div className="panel-head"><div><h2>受講者一覧</h2><span>最終更新 10:42</span></div><div className="filters"><button className="selected">全員</button><button>要確認 3</button><button>停滞 2</button></div></div><div className="member-table"><div className="table-row table-labels"><span>受講者</span><span>進捗</span><span>最終取組</span><span>最近の困りごと</span><span>状態</span></div>{members.map((m,index)=><button className={`table-row ${selected===index?"selected-row":""}`} key={m.name} onClick={()=>setSelected(index)}><span className="member-name"><i>{m.name.slice(0,1)}</i><b>{m.name}</b><small>動画 {m.videos} ・ ワーク {m.works}</small></span><span className="mini-progress"><b>{m.progress}%</b><i><u style={{width:`${m.progress}%`}} /></i></span><span>{m.last}</span><span className="concern">{m.concern}</span><span><em className={`state ${m.tone}`}>{m.state}</em></span></button>)}</div></section>
          <aside className="detail-panel"><div className="detail-person"><i>{members[selected].name.slice(0,1)}</i><div><small>選択中の受講者</small><h2>{members[selected].name}</h2></div><span className={`state ${members[selected].tone}`}>{members[selected].state}</span></div><div className="detail-progress"><div><strong>{members[selected].progress}%</strong><span>全体進捗</span></div><div className="big-bar"><i style={{width:`${members[selected].progress}%`}} /></div><small>動画 {members[selected].videos}　ワーク {members[selected].works}</small></div><div className="insight"><span>!</span><div><small>電話前に確認</small><p>{members[selected].concern}</p></div></div><div className="answers"><div><h3>最新のワーク回答</h3><span>今日 09:18</span></div><small>今、一番強く感じている不安は何ですか？</small><p>返信がないと、このまま忘れられてしまう気がして不安です。でも追いLINEはせず、自分の時間を過ごそうとしています。</p></div><div className="activity"><h3>取り組みの推移</h3><div className="bar-chart">{[34,62,48,78,52,88,68].map((h,i)=><i key={i} style={{height:`${h}%`}} className={i===5?"hot":""} />)}</div><div className="days"><span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span>土</span><span>日</span></div></div><button className="primary full">回答内容をすべて見る <span>→</span></button></aside>
        </div>
      </div>}
    </main>
  );
}
