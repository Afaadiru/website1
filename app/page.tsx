"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import katex from "katex"

type StudyMode = "materi" | "latihan" | "tryout"

const modeTabs: { id: StudyMode; label: string }[] = [
  { id: "materi", label: "Materi" },
  { id: "latihan", label: "Latihan" },
  { id: "tryout", label: "Tryout" },
]

const answerOptions = [
  { id: "a", value: "3" },
  { id: "b", value: "5" },
  { id: "c", value: "8" },
  { id: "d", value: "15" },
]

function Arrow() {
  return (
    <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
      <path className="m-arrow__stem" d="M1 6h8" />
      <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
    </svg>
  )
}

function MathInline({ math }: { math: string }) {
  return <span className="home-math" dangerouslySetInnerHTML={{ __html: katex.renderToString(math, { throwOnError: false }) }} />
}

function Navbar({ onModeChange }: { onModeChange: (mode: StudyMode) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className={`nav nav--centre${menuOpen ? " is-open" : ""}`}>
      <div className="wrap nav__bar">
        <a className="skip-link" href="#top">Lompat ke konten</a>
        <a className="nav__logo" href="#top" aria-label="Triks, beranda">
          <span className="mark" data-mark="stack" aria-hidden="true" />
          Triks
        </a>
        <nav className="nav__links" aria-label="Navigasi utama">
          <div className="nav__item"><a className="nav__link" href="/materi" onClick={() => setMenuOpen(false)}>Materi</a></div>
          <div className="nav__item"><a className="nav__link" href="/bank-soal" onClick={() => { onModeChange("latihan"); setMenuOpen(false) }}>Bank soal</a></div>
          <div className="nav__item"><a className="nav__link" href="/tryout" onClick={() => { onModeChange("tryout"); setMenuOpen(false) }}>Tryout</a></div>
          <div className="nav__item"><a className="nav__link" href="/diktat" onClick={() => setMenuOpen(false)}>Diktat</a></div>
          <div className="nav__item"><a className="nav__link" href="/ranking" onClick={() => setMenuOpen(false)}>Peringkat</a></div>
        </nav>
        <div className="nav__actions">
          <a className="btn btn--primary" href="/materi">Mulai Belajar <Arrow /></a>
        </div>
        <button className="nav__toggle" type="button" aria-expanded={menuOpen} aria-label={menuOpen ? "Tutup menu" : "Buka menu"} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}</button>
      </div>
    </header>
  )
}

function PracticePreview({ mode, onModeChange }: { mode: StudyMode; onModeChange: (mode: StudyMode) => void }) {
  const [answer, setAnswer] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  return (
    <div className="ui app-frame study-window" role="group" aria-label="Pratinjau aplikasi belajar Triks">
      <div className="window-bar">
        <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
        <span>triks / ruang-belajar</span>
        <span className="window-account">A</span>
      </div>
      <div className="study-layout">
        <aside className="study-sidebar" aria-label="Menu belajar">
          <a className="side-brand" href="#top"><span className="mark" data-mark="stack" aria-hidden="true" />Triks</a>
          <span className="side-label">Ruang belajar</span>
          <a className="side-link side-link--active" href="#materi"><span className="side-symbol">01</span>Materi</a>
          <a className="side-link" href="#latihan"><span className="side-symbol">02</span>Latihan</a>
          <a className="side-link" href="#tryout"><span className="side-symbol">03</span>Tryout UTBK</a>
          <a className="side-link" href="#pembahasan"><span className="side-symbol">04</span>Pembahasan</a>
          <div className="sidebar-progress">
            <span className="side-label">Topik berikutnya</span>
            <span className="progress-copy"><b>Persamaan linear</b></span>
          </div>
        </aside>
        <section className="study-main" aria-label="Materi dan latihan">
          <div className="study-topline">
            <div><span className="crumb">Persiapan ujian <span>/</span> Matematika</span><h2>Ruang belajar</h2></div>
            <span className="study-date">Sesi belajar</span>
          </div>
          <div className="study-welcome">
            <div><p className="study-kicker">Rencana belajar hari ini</p><h3>Mulai dari satu soal.</h3><p>Kerjakan satu langkah, lalu lanjutkan ke materi berikutnya.</p></div>
          </div>
          <div className="study-tabs" role="group" aria-label="Mode belajar">
            {modeTabs.map((tab) => (
              <button key={tab.id} id={tab.id === "materi" ? undefined : tab.id} className="study-tab" type="button" aria-pressed={mode === tab.id} onClick={() => { setAnswer(null); setChecked(false); onModeChange(tab.id) }}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="exercise-panel" id="study-panel" aria-live="polite">
            {mode === "materi" ? (
              <div className="mode-content">
                <div className="exercise-heading"><div><span className="exercise-label">Materi · Aljabar</span><h3>Persamaan linear</h3></div><span className="exercise-time">6 menit</span></div>
                <p className="lesson-line">Persamaan linear memiliki variabel berpangkat satu. Untuk mencari nilainya, lakukan operasi yang sama pada kedua sisi.</p>
                <div className="math-example"><span>Contoh</span><MathInline math="3x + 5 = 20" /><span>Kurangi 5 di kedua sisi, lalu bagi dengan 3.</span></div>
              </div>
            ) : mode === "tryout" ? (
              <div className="mode-content">
                <div className="exercise-heading"><div><span className="exercise-label">Tryout UTBK · Matematika</span><h3>Simulasi ujian</h3></div><span className="timer-chip"><span /> Batas waktu</span></div>
                <p className="lesson-line">Selesaikan soal dalam batas waktu, lalu tinjau nilai dan pembahasan setiap jawaban.</p>
                <div className="tryout-progress"><div className="tryout-progress__labels"><span>Urutan simulasi</span><b>Kerjakan → Tinjau hasil</b></div></div>
              </div>
            ) : (
              <div className="mode-content">
                <div className="exercise-heading"><div><span className="exercise-label">Latihan · Matematika</span><h3>Persamaan linear</h3></div><span className="exercise-time">Latihan aljabar</span></div>
                <p className="question-copy">Jika <MathInline math="3x + 5 = 20" />, berapa nilai <MathInline math="x" />?</p>
                <div className="answer-grid" role="group" aria-label="Pilih jawaban">
                  {answerOptions.map((option) => {
                    const isSelected = answer === option.id
                    const isCorrect = checked && option.id === "b"
                    const isIncorrect = checked && isSelected && option.id !== "b"
                    return <button key={option.id} type="button" className={`answer-option${isSelected ? " is-selected" : ""}${isCorrect ? " is-correct" : ""}${isIncorrect ? " is-incorrect" : ""}`} aria-pressed={isSelected} onClick={() => { setAnswer(option.id); setChecked(false) }}><span>{option.id.toUpperCase()}</span>{option.value}</button>
                  })}
                </div>
                <div className="exercise-bottom">
                  <span className={checked ? `answer-feedback ${answer === "b" ? "is-right" : "is-wrong"}` : "answer-feedback"} role="status">{checked ? answer === "b" ? "Jawaban benar. Lihat langkahnya di pembahasan." : "Belum tepat. Coba periksa kembali persamaannya." : "Pilih satu jawaban untuk melanjutkan."}</span>
                  <button className="check-answer" type="button" disabled={!answer} onClick={() => setChecked(true)}>Cek jawaban <Arrow /></button>
                </div>
              </div>
            )}
          </div>
          <div className="study-footnote"><span className="footnote-mark" />Materi, latihan, tryout, dan pembahasan dalam satu alur.</div>
        </section>
      </div>
    </div>
  )
}

function Hero({ mode, onModeChange }: { mode: StudyMode; onModeChange: (mode: StudyMode) => void }) {
  return (
    <section className="hero hero--split" data-enter aria-labelledby="hero-title">
      <div className="wrap">
        <div className="hero-text grid hero__grid">
          <div className="hero__text span-5">
            <p className="hero__kicker"><span className="status-dot" />Platform persiapan ujian</p>
            <h1 id="hero-title">Belajar terarah. Hadapi ujian lebih siap.</h1>
            <p className="hero__lead">Pilih bab, pahami konsep, lalu uji pemahaman lewat latihan dan tryout bertimer.</p>
            <div className="btn-row">
              <a className="btn btn--primary" href="/materi">Jelajahi materi <Arrow /></a>
              <a className="btn btn--secondary" href="#fitur">Lihat fitur <Arrow /></a>
            </div>
            <dl className="hero-facts">
              <div><dt>Modul belajar</dt><dd>5 bagian</dd></div>
              <div><dt>Latihan</dt><dd>Ribuan soal</dd></div>
              <div><dt>Simulasi</dt><dd>Tryout UTBK</dd></div>
            </dl>
          </div>
          <div className="hero__media span-6 start-7" data-visual role="group" aria-label="Antarmuka ruang belajar Triks">
            <div className="hero-mesh" data-fx="fluted-glass" data-fx-seed="328db722" aria-hidden="true" />
            <PracticePreview mode={mode} onModeChange={onModeChange} />
          </div>
        </div>
      </div>
    </section>
  )
}

function LearningMoment() {
  return (
    <section className="section statement-section" id="materi" data-moment="letters-assemble" aria-labelledby="moment-title">
      <div className="wrap">
        <h2 className="mo-la__type" id="moment-title">Pahami setiap langkah</h2>
        <p className="section-index">01 / Cara belajar</p>
        <div className="moment-bottom">
          <p className="mo-la__sub">Mulai dari materi, lanjutkan dengan latihan, lalu ukur kesiapan lewat tryout dan pembahasan.</p>
          <a className="link" href="#fitur">Lihat alur belajar <Arrow /></a>
        </div>
      </div>
    </section>
  )
}

const features = [
  { id: "01", title: "Materi belajar", text: "Ringkasan topik yang membantu kamu mulai dari konsep dasarnya.", target: "materi", tag: "Pahami konsep" },
  { id: "02", title: "Bank soal", text: "Latihan soal berdasarkan topik dan tingkat kesulitan.", target: "latihan", tag: "Asah kemampuan" },
  { id: "03", title: "Tryout UTBK", text: "Simulasi per bab dengan timer dan pembahasan setelah selesai.", target: "tryout", tag: "Ukur kesiapan" },
  { id: "04", title: "Pembahasan", text: "Ikuti langkah penyelesaian agar kamu tahu cara mendapatkan jawaban.", target: "pembahasan", tag: "Tinjau jawaban" },
  { id: "05", title: "Diktat ringkas", text: "Catatan konsep dan video pencarian untuk setiap bab.", target: "materi", tag: "Ulangi materi" },
  { id: "06", title: "Peringkat", text: "Lihat hasil tryout yang tersimpan bersama peserta lain.", target: "fitur", tag: "Lihat progres" },
]

function Features() {
  return (
    <section className="section g2 g2m features-section" id="fitur" aria-labelledby="features-title">
      <div className="wrap">
        <div className="section-head section-head--split">
          <div><h2 id="features-title">Belajar, berlatih, dan ukur progres</h2><p className="section-index">02 / Isi platform</p></div>
          <p>Belajar tidak berhenti setelah membaca materi. Lanjutkan ke soal, simulasi, lalu lihat pembahasan untuk setiap langkah.</p>
        </div>
        <div className="features-layout">
          <div className="feature-list">
            {features.map((feature) => (
              <a className="feature-row" href={`#${feature.target}`} key={feature.id}>
                <span className="feature-num">{feature.id}</span>
                <span className="feature-copy"><strong>{feature.title}</strong><span>{feature.text}</span></span>
                <span className="feature-tag">{feature.tag}</span>
                <Arrow />
              </a>
            ))}
          </div>
          <div className="explanation-window" id="pembahasan" role="group" aria-label="Tampilan pembahasan soal">
            <div className="explanation-top"><span className="exercise-label">Pembahasan · Matematika</span><span className="solved-state"><i /> Selesai</span></div>
            <h3><MathInline math="3x + 5 = 20" /></h3>
            <div className="solution-step"><span>01</span><p>Kurangi 5 dari kedua sisi.</p><b><MathInline math="3x = 15" /></b></div>
            <div className="solution-step"><span>02</span><p>Bagi kedua sisi dengan 3.</p><b><MathInline math="x = 5" /></b></div>
            <div className="solution-result"><span>Jawaban</span><strong><MathInline math="x = 5" /></strong></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Closing() {
  return (
    <footer className="footer closing footer--dark g2m" id="close" aria-labelledby="close-title">
      <div className="wrap">
        <div className="closing__cta close--type">
          <div><h2 id="close-title">Siapkan ujian berikutnya dengan Triks.</h2><p className="section-index">Mulai dari satu soal</p></div>
          <a className="btn btn--primary btn--xl" href="#latihan">Mulai Belajar <Arrow /></a>
        </div>
        <div className="closing__links">
          <div className="footer-brand-block">
            <a className="nav__logo" href="#top"><span className="mark" data-mark="stack" aria-hidden="true" />Triks</a>
            <p>Platform persiapan ujian untuk pelajar.</p>
          </div>
          <nav className="footer-nav" aria-label="Navigasi footer">
            <a href="/materi">Materi</a><a href="/diktat">Diktat</a><a href="/bank-soal">Bank soal</a><a href="/tryout">Tryout UTBK</a><a href="/ranking">Peringkat</a>
          </nav>
          <div className="footer-legal"><span>© 2026 Triks</span><span>Platform belajar untuk persiapan ujian</span></div>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  const [mode, setMode] = useState<StudyMode>("latihan")

  return (
    <>
      <Navbar onModeChange={setMode} />
      <main id="top">
        <Hero mode={mode} onModeChange={setMode} />
        <LearningMoment />
        <Features />
      </main>
      <Closing />
    </>
  )
}
