import type { Metadata, Viewport } from "next"
import "katex/dist/katex.min.css"
import "./globals.css"

export const metadata: Metadata = {
  title: "Triks — Aplikasi persiapan ujian untuk pelajar",
  description:
    "Pelajari materi, kerjakan bank soal, ikuti tryout TKA, dan tinjau pembahasan dalam satu alur belajar.",
  openGraph: {
    title: "Triks — Aplikasi persiapan ujian untuk pelajar",
    description:
      "Materi, latihan, tryout TKA, dan pembahasan untuk persiapan ujian.",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" data-type="software" data-radius="soft" data-buttons="solid" data-ground="sage" data-motion suppressHydrationWarning>
      <head>
        <meta name="page-type" content="software" />
        <meta name="site-kind" content="software" />
        <meta name="theme-color" content="#0f0f0f" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Onest:wght@400..700&family=JetBrains+Mono:wght@400..500&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)" }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
