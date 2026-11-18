export type Course = { id: string; name: string; chapters: string[] }

export const courses: Course[] = [
  { id: "mtk", name: "Matematika", chapters: ["Eksponen dan logaritma", "Persamaan dan pertidaksamaan", "Fungsi dan grafik", "Sistem persamaan", "Trigonometri", "Geometri dan pengukuran", "Statistika", "Peluang", "Barisan dan deret", "Matriks", "Komposisi dan invers fungsi", "Limit fungsi", "Turunan", "Integral", "Vektor dan geometri ruang"] },
  { id: "bindo", name: "Bahasa Indonesia", chapters: ["Teks laporan hasil observasi", "Teks eksposisi dan argumentasi", "Anekdot dan kritik sosial", "Hikayat dan cerpen", "Teks negosiasi", "Biografi dan keteladanan", "Teks prosedur", "Teks eksplanasi", "Ceramah dan editorial", "Proposal dan karya ilmiah", "Drama dan apresiasi sastra", "Surat lamaran kerja", "Novel dan kritik sastra", "Artikel dan tajuk rencana", "Kebahasaan dan penyuntingan"] },
  { id: "bing", name: "Bahasa Inggris", chapters: ["Descriptive text", "Recount text", "Narrative text", "Announcement and notice", "Procedure text", "Analytical exposition", "Explanation text", "News item and report", "Personal and formal letter", "Application letter", "Discussion text", "Caption and review", "Reading comprehension", "Grammar in context", "Vocabulary and inference"] },
  { id: "pu", name: "Penalaran Umum (UTBK)", chapters: ["Penalaran induktif", "Penalaran deduktif", "Penalaran kuantitatif"] },
  { id: "ppu", name: "Pengetahuan dan Pemahaman Umum (UTBK)", chapters: ["Makna kata dan relasi", "Ide pokok dan simpulan", "Informasi tersurat dan tersirat", "Kohesi dan koherensi"] },
  { id: "pbm", name: "Pemahaman Bacaan dan Menulis (UTBK)", chapters: ["Kalimat efektif", "Ejaan dan tanda baca", "Kepaduan paragraf", "Perbaikan dan penyuntingan"] },
  { id: "pk", name: "Pengetahuan Kuantitatif (UTBK)", chapters: ["Bilangan dan operasi", "Aljabar", "Rasio dan proporsi", "Geometri", "Statistika dan peluang"] },
  { id: "lit-id", name: "Literasi Bahasa Indonesia (UTBK)", chapters: ["Memahami teks informatif", "Menganalisis argumen", "Mengevaluasi bukti", "Membandingkan dua teks"] },
  { id: "lit-en", name: "Literasi Bahasa Inggris (UTBK)", chapters: ["Gagasan utama dan detail", "Inference and reference", "Purpose, tone and structure", "Evidence and comparison"] },
  { id: "pm", name: "Penalaran Matematika (UTBK)", chapters: ["Pemodelan matematika", "Penalaran aljabar", "Geometri kontekstual", "Data dan ketidakpastian"] },
]

export const levels = ["X", "XI", "XII"] as const
export const curricula = ["Kurikulum Merdeka", "Kurikulum 2013"] as const

export function chaptersFor(courseId: string, level: string) {
  const list = courses.find((course) => course.id === courseId)?.chapters ?? courses[0].chapters
  if (["pu", "ppu", "pbm", "pk", "lit-id", "lit-en", "pm"].includes(courseId)) return list
  const bands: Record<string, [number, number]> = courseId === "mtk" ? { X: [0, 6], XI: [6, 11], XII: [11, list.length] } : courseId === "bindo" ? { X: [0, 6], XI: [6, 11], XII: [11, list.length] } : { X: [0, 5], XI: [5, 10], XII: [10, list.length] }
  const [start, end] = bands[level] ?? bands.X
  return list.slice(start, end)
}

export function chapterFor(courseId: string, chapterIndex: number) {
  return courses.find((course) => course.id === courseId)?.chapters[chapterIndex] ?? courses[0].chapters[0]
}

export function makeQuestions(courseId: string, chapter: string) {
  const maths = ["mtk", "pk", "pm"].includes(courseId)
  const readingSkills = [
    "menemukan gagasan utama", "menafsirkan makna kata dari konteks", "memeriksa informasi tersurat", "menarik simpulan yang didukung teks", "mengenali tujuan penulis", "menentukan rujukan kata ganti", "memilih parafrasa yang setara", "membaca hubungan sebab dan akibat", "menilai bukti pendukung klaim", "mengenali nada penulis", "memahami susunan paragraf", "membedakan fakta dan opini", "membandingkan dua sudut pandang", "meringkas tanpa mengubah makna", "menilai relevansi contoh", "mengenali fungsi sebuah kalimat", "memeriksa konsistensi argumen", "memilih judul yang paling mewakili", "mengenali informasi yang tersirat", "memeriksa simpulan terhadap isi bacaan",
  ]
  return Array.from({ length: 20 }, (_, index) => {
    const n = index + 1
    const x = (n % 9) + 2
    const a = (n % 5) + 2
    const b = n % 7
    const topic = chapter.toLocaleLowerCase("id")
    const numberChoices = (value: number) => [`\\(${value - 2}\\)`, `\\(${value - 1}\\)`, `\\(${value}\\)`, `\\(${value + 1}\\)`]
    if (maths) {
      if (/eksponen|logaritma/.test(topic)) {
        const base = (n % 5) + 2
        const power = (n % 6) + 2
        if (n % 2 === 0) return { id: n, prompt: `Tentukan nilai \\( \\log_{${base}}(${base ** power}) \\).`, options: numberChoices(power), answer: 2, explanation: `Karena \\( ${base}^{${power}} = ${base ** power} \\), maka \\( \\log_{${base}}(${base ** power}) = ${power} \\).` }
        const next = (n % 4) + 1
        return { id: n, prompt: `Sederhanakan \\( ${base}^{${power}} \\times ${base}^{${next}} \\).`, options: [`\\(${base}^{${power + next - 1}}\\)`, `\\(${base}^{${power + next}}\\)`, `\\(${base}^{${power + next + 1}}\\)`, `\\(${base}^{${power + next + 2}}\\)`], answer: 1, explanation: `Untuk basis yang sama, pangkat dijumlahkan: \\( ${base}^{${power}}\\times${base}^{${next}}=${base}^{${power + next}} \\).` }
      }
      if (/trigonometri/.test(topic)) {
        const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]
        const [opposite, adjacent, hypotenuse] = triples[n % triples.length]
        const value = adjacent * adjacent
        const denominator = hypotenuse * hypotenuse
        return { id: n, prompt: `Jika \\( \\sin\\theta=\\frac{${opposite}}{${hypotenuse}} \\) dan \\(\\theta\\) lancip, nilai \\( \\cos^2\\theta \\) adalah ...`, options: [`\\(\\frac{${value - 1}}{${denominator}}\\)`, `\\(\\frac{${value}}{${denominator}}\\)`, `\\(\\frac{${value + 1}}{${denominator}}\\)`, `\\(\\frac{${opposite * opposite}}{${denominator}}\\)`], answer: 1, explanation: `Dari segitiga siku-siku, sisi sampingnya \\( ${adjacent} \\). Jadi \\( \\cos^2\\theta=\\frac{${adjacent}^2}{${hypotenuse}^2}=\\frac{${value}}{${denominator}} \\).` }
      }
      if (/statistika/.test(topic)) {
        const start = n % 8
        return { id: n, prompt: `Rata-rata dari data \\( ${start}, ${start + 1}, ${start + 2}, ${start + 3}, ${start + 4} \\) adalah ...`, options: numberChoices(start + 2), answer: 2, explanation: `Jumlah data \\(=${5 * (start + 2)}\\) dan banyak data \\(=5\\), sehingga rata-ratanya \\(\\frac{${5 * (start + 2)}}{5}=${start + 2}\\).` }
      }
      if (/peluang|ketidakpastian/.test(topic)) {
        const favorable = (n % 7) + 2
        const total = 12
        return { id: n, prompt: `Dari \\( ${total} \\) hasil yang peluangnya sama, ada \\( ${favorable} \\) hasil yang memenuhi kejadian \\(A\\). Nilai \\(P(A)\\) adalah ...`, options: [`\\(\\frac{${favorable - 1}}{${total}}\\)`, `\\(\\frac{${favorable}}{${total}}\\)`, `\\(\\frac{${favorable + 1}}{${total}}\\)`, `\\(\\frac{${total}}{${favorable}}\\)`], answer: 1, explanation: `Peluang adalah banyak hasil yang memenuhi dibagi banyak seluruh hasil: \\(P(A)=\\frac{${favorable}}{${total}}\\).` }
      }
      if (/barisan|deret/.test(topic)) {
        const first = (n % 7) + 1, difference = (n % 4) + 1, term = 5
        const value = first + (term - 1) * difference
        return { id: n, prompt: `Barisan aritmetika memiliki suku pertama \\( ${first} \\) dan beda \\( ${difference} \\). Nilai suku ke-\\( ${term} \\) adalah ...`, options: numberChoices(value), answer: 2, explanation: `Gunakan \\(U_n=a+(n-1)b\\). Maka \\(U_${term}=${first}+(${term}-1)(${difference})=${value}\\).` }
      }
      if (/turunan/.test(topic)) {
        const coefficient = (n % 5) + 1, linear = n % 4
        const value = 2 * coefficient + linear
        return { id: n, prompt: `Jika \\( f(x)=${coefficient}x^2+${linear}x \\), nilai \\(f'(1)\\) adalah ...`, options: numberChoices(value), answer: 2, explanation: `Turunannya \\(f'(x)=${2 * coefficient}x+${linear}\\), sehingga \\(f'(1)=${value}\\).` }
      }
      if (/integral/.test(topic)) {
        const coefficient = (n % 5) + 1
        return { id: n, prompt: `Hasil dari \\( \\int ${coefficient}x^2\\,dx \\) adalah ...`, options: [`\\(${coefficient}x^3+C\\)`, `\\(\\frac{${coefficient}}{3}x^3+C\\)`, `\\(\\frac{${coefficient}}{2}x^2+C\\)`, `\\(3${coefficient}x+C\\)`], answer: 1, explanation: `Pangkat dinaikkan satu dan dibagi pangkat baru: \\(\\int ${coefficient}x^2dx=\\frac{${coefficient}}{3}x^3+C\\).` }
      }
      if (/limit/.test(topic)) {
        const at = (n % 7) + 1, constant = n % 6
        const value = at * at + constant
        return { id: n, prompt: `Nilai \\( \\lim_{x\\to ${at}}(x^2+${constant}) \\) adalah ...`, options: numberChoices(value), answer: 2, explanation: `Substitusikan \\(x=${at}\\): \\(${at}^2+${constant}=${value}\\).` }
      }
      if (/matriks/.test(topic)) {
        const value = 3 * x - 2
        return { id: n, prompt: `Determinan matriks \\(\\begin{pmatrix}${x}&1\\\\2&3\\end{pmatrix}\\) adalah ...`, options: numberChoices(value), answer: 2, explanation: `Determinan matriks \\(2\\times2\\) adalah hasil kali diagonal utama dikurangi diagonal lainnya: \\(${x}\\cdot3-1\\cdot2=${value}\\).` }
      }
      if (/vektor/.test(topic)) {
        const value = 2 * x + 3
        return { id: n, prompt: `Diketahui \\(\\vec{u}=(${x},1)\\) dan \\(\\vec{v}=(2,3)\\). Hasil \\(\\vec{u}\\cdot\\vec{v}\\) adalah ...`, options: numberChoices(value), answer: 2, explanation: `Kalikan komponen bersesuaian lalu jumlahkan: \\(${x}\\cdot2+1\\cdot3=${value}\\).` }
      }
      if (/geometri/.test(topic)) {
        const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]
        const [legA, legB, hypotenuse] = triples[n % triples.length]
        return { id: n, prompt: `Segitiga siku-siku memiliki sisi tegak \\( ${legA} \\) dan \\( ${legB} \\). Panjang hipotenusanya adalah ...`, options: numberChoices(hypotenuse), answer: 2, explanation: `Teorema Pythagoras memberi \\(c=\\sqrt{${legA}^2+${legB}^2}=${hypotenuse}\\).` }
      }
      if (/sistem persamaan/.test(topic)) {
        const first = (n % 7) + 3, second = (n % 5) + 1
        return { id: n, prompt: `Jika \\(x+y=${first + second}\\) dan \\(x-y=${first - second}\\), nilai \\(x\\) adalah ...`, options: numberChoices(first), answer: 2, explanation: `Jumlahkan kedua persamaan: \\(2x=${2 * first}\\), sehingga \\(x=${first}\\).` }
      }
      if (/fungsi|persamaan|aljabar|bilangan|kuantitatif|pemodelan/.test(topic)) {
        const value = a * x + b
        return { id: n, prompt: `Diketahui \\(f(x)=${a}x+${b}\\). Nilai \\(f(${x})\\) adalah ...`, options: numberChoices(value), answer: 2, explanation: `Substitusikan \\(x=${x}\\): \\(f(${x})=${a}\\cdot${x}+${b}=${value}\\).` }
      }
      const value = a * x + b
      return { id: n, prompt: `Selesaikan persamaan \\( ${a}x + ${b} = ${value} \\). Nilai \\(x\\) adalah ...`, options: numberChoices(x), answer: 2, explanation: `Kurangi kedua ruas dengan \\(${b}\\), lalu bagi dengan \\(${a}\\), sehingga \\(x=${x}\\).` }
    }
    return {
      id: n,
      prompt: `Saat mengerjakan bab “${chapter}”, fokus pertanyaan adalah ${readingSkills[index]}. Strategi yang paling tepat ialah ...`,
      options: ["Memilih jawaban yang didukung informasi dan bukti dalam teks", "Mengandalkan pengetahuan pribadi meski bertentangan dengan teks", "Menganggap semua kalimat memiliki fungsi yang sama", "Menentukan jawaban hanya dari panjang paragraf"],
      answer: 0,
      explanation: "Gagasan utama perlu dipahami bersama alasan dan bukti yang mendukungnya. Jawaban harus merujuk pada isi teks, bukan panjang kalimat atau judul saja.",
    }
  })
}
