"use client";

import { useState } from "react";

type Screen = "home" | "lectures" | "admin";

const chapters = [
  {
    label: "第1章",
    title: "今の状況を正しく整理する",
    items: [
      { id: "1-1", title: "まず最初に知っておいてほしいこと", type: "video", done: true },
      { id: "1-2", title: "現在の状況を書き出して整理する", type: "work", done: true },
    ],
  },
  {
    label: "第2章",
    title: "感情に振り回されない土台をつくる",
    items: [
      { id: "2-1", title: "不安や焦りが生まれる仕組み", type: "video", done: true },
      { id: "2-2", title: "不安が出たときの思考整理", type: "work", done: false },
      { id: "2-3", title: "相手ではなく自分に意識を戻す", type: "video", done: false },
    ],
  },
  {
    label: "第3章",
    title: "これからの行動を整える",
    items: [
      { id: "3-1", title: "今の関係に必要な距離感", type: "video", done: false, locked: true },
      { id: "3-2", title: "次の2週間で取り組むこと", type: "work", done: false, locked: true },
    ],
  },
];

const members = [
  { name: "山田 花子", progress: 57, updated: "今日 09:18", videos: 3, works: 2, concern: "返信がないと忘れられてしまう気がして不安です。", state: "要確認", tone: "danger" },
  { name: "佐藤 美咲", progress: 86, updated: "昨日 20:42", videos: 5, works: 4, concern: "連絡するタイミングを落ち着いて考えています。", state: "順調", tone: "good" },
  { name: "高橋 彩", progress: 43, updated: "5日前", videos: 3, works: 1, concern: "自分の気持ちをまだ整理しきれていません。", state: "停滞", tone: "warning" },
  { name: "伊藤 奈緒", progress: 14, updated: "8日前", videos: 1, works: 0, concern: "ワーク回答はまだありません。", state: "要確認", tone: "danger" },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [openItem, setOpenItem] = useState<{ title: string; type: string } | null>(null);
  const [answer, setAnswer] = useState("");
  const [saved, setSaved] = useState(false);
  const [selected, setSelected] = useState(0);

  if (screen === "lectures") {
    return <main className="course-site">
      <header className="course-header"><h1>講義・ワーク</h1><p>動画を見ながら、順番に取り組んでいきましょう</p></header>
      <div className="course-content">
        <section className="course-progress"><div><span>全体の進捗</span><strong>4 / 7 完了</strong></div><div className="progress-bg"><i style={{ width: "57%" }} /></div></section>
        {chapters.map((chapter) => <section className="chapter" key={chapter.label}>
          <div className="chapter-title"><span>{chapter.label}</span>{chapter.title}</div>
          {chapter.items.map((item) => <button key={item.id} className={`lecture-card ${item.done ? "completed" : ""} ${item.locked ? "locked" : ""}`} onClick={() => !item.locked && setOpenItem(item)}>
            <span className={`lecture-num ${item.done ? "num-done" : item.type === "video" ? "num-video" : "num-work"}`}>{item.done ? "✓" : item.locked ? "🔒" : item.id}</span>
            <span className="lecture-info"><small className={item.type === "video" ? "badge-video" : "badge-work"}>{item.type === "video" ? "動画講義" : "ワーク"}</small><strong>{item.title}</strong>{item.locked && <em>前の講義を完了すると公開されます</em>}</span>
            <span className="lecture-arrow">{item.done ? <b>✓</b> : item.locked ? "" : "›"}</span>
          </button>)}
        </section>)}
      </div>
      <nav className="course-nav"><button onClick={() => setScreen("home")}><span>🏠</span>ホーム</button><button className="active"><span>▶️</span>講義</button></nav>
      {openItem && <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && setOpenItem(null)}><section className="lecture-modal"><div className="modal-handle"/><div className="modal-head"><small className={openItem.type === "video" ? "badge-video" : "badge-work"}>{openItem.type === "video" ? "動画講義" : "ワーク"}</small><h2>{openItem.title}</h2></div><div className="modal-body">
        {openItem.type === "video" ? <><div className="video-placeholder"><span>▶</span><p>ここに動画が表示されます</p></div><p className="lecture-description">動画を見終わったら、下のボタンを押して完了してください。</p><button className="modal-primary" onClick={() => setOpenItem(null)}>視聴を完了する</button></> : <><div className="work-prompt">今、一番強く感じている不安は何ですか？<br/>また、その不安の奥にある本音も書いてみましょう。</div><label className="answer-label">あなたの回答</label><textarea value={answer} onChange={(e) => { setAnswer(e.target.value); setSaved(false); }} placeholder="ここに回答を入力してください"/><button className="modal-primary" onClick={() => setSaved(true)}>{saved ? "保存しました ✓" : "回答を保存する"}</button></>}
      </div></section></div>}
    </main>;
  }

  if (screen === "admin") {
    const member = members[selected];
    return <main className="dark-site admin-site">
      <header className="dark-header"><h1>管理画面</h1><button className="ghost-button" onClick={() => setScreen("home")}>← ダッシュボード</button></header>
      <div className="admin-content">
        <section className="overview"><div><strong>4</strong><span>受講者数</span></div><div><strong>2</strong><span>今日の取組</span></div><div><strong>61%</strong><span>平均進捗</span></div><div className="attention"><strong>2</strong><span>要確認</span></div></section>
        <section className="dark-section"><div className="dark-section-title">受講者の状況</div><div className="table-wrap"><table><thead><tr><th>名前</th><th>進捗</th><th>動画</th><th>ワーク</th><th>最終取組</th><th>状態</th></tr></thead><tbody>{members.map((m, i) => <tr key={m.name} className={selected === i ? "selected" : ""} onClick={() => setSelected(i)}><td><b>{m.name}</b></td><td><span className="table-progress"><i style={{ width: `${m.progress}%` }}/></span><small>{m.progress}%</small></td><td>{m.videos}件</td><td>{m.works}件</td><td>{m.updated}</td><td><em className={`status ${m.tone}`}>{m.state}</em></td></tr>)}</tbody></table></div></section>
        <section className="admin-detail"><div className="detail-head"><div><small>受講者詳細</small><h2>{member.name}</h2></div><em className={`status ${member.tone}`}>{member.state}</em></div><div className="detail-grid"><div className="dark-section"><div className="dark-section-title">進捗状況</div><div className="large-progress"><strong>{member.progress}%</strong><div><i style={{ width: `${member.progress}%` }}/></div><p>動画 {member.videos}件完了　・　ワーク {member.works}件提出</p></div></div><div className="dark-section concern-box"><div className="dark-section-title">最近困っていそうなこと</div><p>{member.concern}</p><small>最新のワーク回答から表示</small></div></div><div className="dark-section"><div className="dark-section-title">最新のワーク回答</div><div className="answer-item"><div><b>不安が出たときの思考整理</b><span>{member.updated}</span></div><small>今、一番強く感じている不安は何ですか？</small><p>{member.concern}</p></div></div></section>
      </div>
    </main>;
  }

  return <main className="dark-site">
    <header className="dark-header"><h1>復縁サポート</h1><div><button className="admin-button" onClick={() => setScreen("admin")}>管理画面</button><button className="ghost-button">ログアウト</button></div></header>
    <div className="home-content">
      <section className="welcome-dark"><h2>花子さん、こんにちは</h2><p>2026年8月24日 月曜日</p></section>
      <section className="stats-row"><div><strong>57%</strong><span>全体の進捗</span></div><div><strong>3</strong><span>動画完了</span></div><div><strong>2</strong><span>ワーク提出</span></div></section>
      <button className="next-cta" onClick={() => { setScreen("lectures"); setOpenItem({ title: "不安が出たときの思考整理", type: "work" }); }}><div><small>次に取り組む内容</small><h3>不安が出たときの思考整理</h3><p>今の気持ちを言葉にして、落ち着いて整理しましょう</p></div><span>→</span></button>
      <section className="dark-section"><div className="dark-section-title">講義の進み具合</div><div className="home-progress"><div><span>4 / 7 完了</span><strong>57%</strong></div><div className="home-progress-bg"><i style={{ width: "57%" }}/></div><button onClick={() => setScreen("lectures")}>講義・ワークを見る →</button></div></section>
      <section className="dark-section"><div className="dark-section-title">最近のワーク</div><div className="recent-work"><div><span>✓</span><div><b>現在の状況を書き出して整理する</b><small>8月22日に回答</small></div></div><button onClick={() => { setScreen("lectures"); setOpenItem({ title: "現在の状況を書き出して整理する", type: "work" }); }}>回答を見る</button></div></section>
    </div>
    <nav className="bottom-nav"><button className="active"><span>🏠</span>ホーム</button><button onClick={() => setScreen("lectures")}><span>▶️</span>講義</button></nav>
  </main>;
}
