"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, FileText, GraduationCap, Trophy, Clock3, ArrowLeft, ArrowRight, Play, CheckCircle2 } from "lucide-react"
import { chaptersFor, courses, curricula, levels, makeQuestions } from "@/lib/catalog"
import katex from "katex"

type Section = "materi" | "diktat" | "bank-soal" | "tryout" | "ranking"
const links = [{ href: "/materi", label: "Materi", icon: BookOpen }, { href: "/diktat", label: "Diktat", icon: FileText }, { href: "/bank-soal", label: "Bank soal", icon: GraduationCap }, { href: "/tryout", label: "Tryout", icon: Clock3 }, { href: "/ranking", label: "Peringkat", icon: Trophy }]

function Latex({ children }: { children: string }) {
  const parts = children.split(/\\\((.*?)\\\)/g)
  return <span className="latex-copy">{parts.map((part, i) => i % 2 ? <span key={i} dangerouslySetInnerHTML={{ __html: katex.renderToString(part, { throwOnError: false, output: "htmlAndMathml" }) }} /> : part)}</span>
}

function formulaFor(courseId: string, chapter: string) {
  if (!["mtk", "pk", "pm"].includes(courseId)) return null
  const topic = chapter.toLocaleLowerCase("id")
  if (/eksponen|logaritma/.test(topic)) return "\\(a^m \\, a^n = a^{m+n}\\)"
  if (/trigonometri/.test(topic)) return "\\(\\sin^2\\theta + \\cos^2\\theta = 1\\)"
  if (/statistika/.test(topic)) return "\\(\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n}x_i\\)"
  if (/peluang|ketidakpastian/.test(topic)) return "\\(P(A)=\\frac{n(A)}{n(S)}\\)"
  if (/barisan|deret/.test(topic)) return "\\(U_n=a+(n-1)b\\)"
  if (/limit/.test(topic)) return "\\(\\lim_{x\\to a} f(x)\\)"
  if (/turunan/.test(topic)) return "\\(\\frac{d}{dx}x^n=nx^{n-1}\\)"
  if (/integral/.test(topic)) return "\\(\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C\\)"
  if (/vektor/.test(topic)) return "\\(\\vec{a}\\cdot\\vec{b}=|a||b|\\cos\\theta\\)"
  if (/geometri/.test(topic)) return "\\(a^2+b^2=c^2\\)"
  if (/peluang/.test(topic)) return "\\(P(A)=\\frac{n(A)}{n(S)}\\)"
  return "\\(ax+b=c \\Longrightarrow x=\\frac{c-b}{a}\\)"
}

export default function LearningHub({ section }: { section: Section }) {
  const [curriculum, setCurriculum] = useState<string>(curricula[0])
  const [level, setLevel] = useState<string>("X")
  const [courseId, setCourseId] = useState("mtk")
  const [chapterIndex, setChapterIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [seconds, setSeconds] = useState(section === "tryout" ? 30 * 60 : 0)
  const [started, setStarted] = useState(section !== "tryout")
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [attemptStatus, setAttemptStatus] = useState("")
  const [ranking, setRanking] = useState<{ username: string; score: number; total: number }[]>([])
  const [rankingReady, setRankingReady] = useState(false)
  const course = courses.find((item) => item.id === courseId) ?? courses[0]
  const chapterList = chaptersFor(courseId, level)
  const chapter = chapterList[chapterIndex] ?? chapterList[0]
  const formula = formulaFor(courseId, chapter)
  const questions = useMemo(() => makeQuestions(courseId, chapter), [courseId, chapter])
  const question = questions[questionIndex]

  useEffect(() => {
    if (section !== "tryout" || !started || seconds <= 0) return
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [section, started, seconds])

  useEffect(() => {
    if (section !== "ranking") return
    fetch("/api/attempts").then((r) => r.json()).then((data) => { setRanking(data.entries ?? []); setRankingReady(Boolean(data.configured)) }).catch(() => setRankingReady(false))
  }, [section])

  const finishTryout = async () => {
    const score = questions.reduce((sum, item, i) => sum + (answers[i] === item.answer ? 1 : 0), 0)
    setChecked(true)
    setStarted(false)
    setAttemptStatus("Menyimpan hasil tryout…")
    try {
      const response = await fetch("/api/attempts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ score, durationSec: 1800 - seconds, section: `${course.name} · ${chapter}` }) })
      const data = await response.json()
      setAttemptStatus(response.ok ? `Hasil tersimpan: ${score}/20.` : data.error ?? "Hasil belum tersimpan.")
    } catch { setAttemptStatus("Tidak dapat terhubung. Coba lagi setelah koneksi pulih.") }
  }

  useEffect(() => {
    if (section === "tryout" && started && seconds === 0) void finishTryout()
  }, [section, started, seconds])

  const changeChapter = (index: number) => { setChapterIndex(index); setQuestionIndex(0); setSelected(null); setChecked(false); setAnswers({}) }
  const changeCourse = (id: string) => { setCourseId(id); setChapterIndex(0); setQuestionIndex(0); setSelected(null); setChecked(false); setAnswers({}) }
  const choose = (index: number) => { setSelected(index); setAnswers((old) => ({ ...old, [questionIndex]: index })); setChecked(section !== "tryout") }
  const move = (by: number) => { const next = Math.max(0, Math.min(questions.length - 1, questionIndex + by)); setQuestionIndex(next); setSelected(answers[next] ?? null); setChecked(false) }
  const timer = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
  const title = { materi: "Materi belajar", diktat: "Diktat ringkas", "bank-soal": "Bank soal per bab", tryout: "Tryout bertimer", ranking: "Peringkat peserta" }[section]

  return <div className="hub-shell">
    <header className="hub-nav"><Link href="/" className="hub-brand"><span className="hub-mark">t</span>triks</Link><nav>{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={href === `/${section}` ? "active" : ""}><Icon size={16}/>{label}</Link>)}</nav><Link href="/masuk" className="hub-account">Masuk</Link></header>
    <main className="hub-main"><div className="hub-eyebrow">RUANG BELAJAR <span>·</span> KELAS {level}</div><h1>{title}</h1><p className="hub-lead">Pilih kurikulum, kelas, pelajaran, dan bab untuk mulai belajar.</p>
      <div className="hub-filters"><label>Kurikulum<select value={curriculum} onChange={(e) => setCurriculum(e.target.value)}>{curricula.map((v) => <option key={v}>{v}</option>)}</select></label><label>Kelas<select value={level} onChange={(e) => { setLevel(e.target.value); changeChapter(0) }}>{levels.map((v) => <option key={v}>{v}</option>)}</select></label><label>Pelajaran<select value={courseId} onChange={(e) => changeCourse(e.target.value)}>{courses.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}</select></label><label>Bab<select value={chapterIndex} onChange={(e) => changeChapter(Number(e.target.value))}>{chapterList.map((v, i) => <option key={v} value={i}>Bab {i + 1} · {v}</option>)}</select></label></div>
      <div className="hub-layout"><aside className="hub-outline"><span className="outline-label">DAFTAR BAB</span>{chapterList.map((item, i) => <button key={item} onClick={() => changeChapter(i)} className={chapterIndex === i ? "selected" : ""}><span>{String(i + 1).padStart(2, "0")}</span>{item}</button>)}<p className="curriculum-note">Pemetaan kelas dan fase dapat berbeda mengikuti ATP sekolah. Fase E umumnya kelas X; fase F mencakup XI–XII.</p></aside>
      <section className="hub-content">
        {section === "materi" && <><div className="content-meta">{curriculum} <i>·</i> Kelas {level} <i>·</i> {course.name}</div><h2>{chapter}</h2><p className="lesson-paragraph">Pahami konsep inti bab ini, periksa contoh, lalu lanjutkan ke diktat dan latihan. Materi disusun sebagai ringkasan belajar dan perlu disesuaikan dengan urutan pembelajaran sekolah.</p><div className="concept-card"><span className="card-label">KONSEP KUNCI</span><p>Gunakan hubungan antarbesaran secara bertahap. Tuliskan informasi yang diketahui, pilih model yang sesuai, kemudian periksa kembali hasilnya terhadap konteks soal.</p>{formula ? <div className="formula-box"><span>CONTOH RUMUS</span><Latex>{formula}</Latex></div> : <div className="formula-box"><span>FOKUS BAB</span><span>Gagasan utama · konteks · bukti</span></div>}</div><div className="hub-actions"><Link href="/diktat" className="hub-button subtle">Buka diktat <ArrowRight size={16}/></Link><Link href="/bank-soal" className="hub-button">Latihan 20 soal <ArrowRight size={16}/></Link></div></>}
        {section === "diktat" && <><div className="content-meta">CATATAN INTI <i>·</i> {course.name}</div><h2>{chapter}</h2><div className="diktat-list"><article><b>01</b><div><h3>Tujuan belajar</h3><p>Kenali istilah utama, baca informasi dengan cermat, dan gunakan konsep bab untuk menyelesaikan masalah.</p></div></article><article><b>02</b><div><h3>Langkah memahami</h3><p>Mulai dari definisi, catat hubungan penting, kerjakan contoh, lalu cek alasan di balik setiap langkah.</p></div></article><article><b>03</b><div><h3>{formula ? "Rumus dan notasi" : "Fokus membaca"}</h3><div className="formula-box">{formula ? <Latex>{formula}</Latex> : <span>Gagasan utama · konteks · bukti</span>}</div></div></article></div><a className="video-card" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${chapter} ${course.name} kelas ${level} pembelajaran`)}`} target="_blank" rel="noreferrer"><span className="play-icon"><Play size={17} fill="currentColor"/></span><span><b>Cari video penjelasan bab ini di YouTube</b><small>Pencarian disesuaikan dengan pelajaran dan kelas yang dipilih</small></span><ArrowRight size={17}/></a></>}
        {(section === "bank-soal" || section === "tryout") && <><div className="question-top"><div><div className="content-meta">{section === "tryout" ? "SIMULASI · 20 SOAL" : "LATIHAN BAB · 20 SOAL"} <i>·</i> SOAL {questionIndex + 1} / 20</div><h2>{chapter}</h2></div>{section === "tryout" && <div className={`timer-display ${seconds < 60 ? "urgent" : ""}`}><Clock3 size={16}/>{timer}</div>}</div>{section === "tryout" && !started ? <div className="start-panel"><Clock3 size={24}/><h3>{attemptStatus ? "Tryout selesai" : "Tryout latihan per bab"}</h3><p>{attemptStatus || "20 soal · 30 menit · satu soal ditampilkan setiap halaman."}</p>{!attemptStatus && <button className="hub-button" onClick={() => { setAnswers({}); setQuestionIndex(0); setSeconds(1800); setStarted(true); setSelected(null) }}>Mulai tryout <ArrowRight size={16}/></button>}</div> : <><div className="single-question"><div className="question-number">SOAL {String(questionIndex + 1).padStart(2, "0")}</div><p className="question-prompt"><Latex>{question.prompt}</Latex></p><div className="choices">{question.options.map((option, i) => <button key={i} onClick={() => choose(i)} className={`${selected === i ? "picked" : ""} ${checked && i === question.answer ? "right" : ""}`}><span>{String.fromCharCode(65 + i)}</span><Latex>{option}</Latex>{checked && i === question.answer && <CheckCircle2 size={16}/>}</button>)}</div>{checked && <div className="explanation"><b>{selected === question.answer ? "Tepat." : "Pembahasan"}</b><p><Latex>{question.explanation}</Latex></p></div>}</div><div className="question-footer"><button className="hub-button subtle" onClick={() => move(-1)} disabled={questionIndex === 0}><ArrowLeft size={16}/> Sebelumnya</button><div className="question-dots">{questions.map((q, i) => <button aria-label={`Ke soal ${i + 1}`} onClick={() => move(i - questionIndex)} key={q.id} className={`${i === questionIndex ? "current" : ""} ${answers[i] !== undefined ? "done" : ""}`}/>)}</div>{questionIndex < 19 ? <button className="hub-button" onClick={() => move(1)}>Berikutnya <ArrowRight size={16}/></button> : <button className="hub-button" onClick={section === "tryout" ? finishTryout : () => setChecked(true)}>Selesai <CheckCircle2 size={16}/></button>}</div></>}</>}
        {section === "ranking" && <><div className="content-meta">PAPAN PERINGKAT <i>·</i> BERDASARKAN SKOR TRYOUT</div><h2>Belajar konsisten, maju bersama.</h2>{rankingReady && ranking.length ? <div className="ranking-table"><div className="ranking-head"><span>POSISI</span><span>NAMA PENGGUNA</span><span>NILAI</span></div>{ranking.map((entry, i) => <div className="ranking-row" key={`${entry.username}-${i}`}><span>{String(i + 1).padStart(2,"0")}</span><b>{entry.username}</b><strong>{entry.score}/{entry.total}</strong></div>)}</div> : <div className="empty-ranking"><Trophy size={24}/><b>{rankingReady ? "Belum ada hasil tryout tersimpan" : "Basis data belum tersedia"}</b><span>{rankingReady ? "Selesaikan tryout untuk mengisi peringkat." : "Tambahkan DATABASE_URL PostgreSQL untuk mengaktifkan peringkat."}</span><Link href="/daftar" className="hub-button">Buat akun <ArrowRight size={16}/></Link></div>}</>}
        <div className="source-note">Materi latihan ini disusun untuk belajar dan bukan naskah resmi. Cocokkan dengan ATP sekolah serta <a href="https://kurikulum.kemdikbud.go.id/file/cp/dasmen/8.%20CP%20Bahasa%20Indonesia.pdf" target="_blank" rel="noreferrer">Capaian Pembelajaran BSKAP</a> dan <a href="https://snpmb.id/utbk-snbt/informasi-umum" target="_blank" rel="noreferrer">kerangka UTBK-SNBT SNPMB</a> terbaru.</div>
      </section></div>
    </main>
  </div>
}
