import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const secret = process.env.AUTH_SECRET
  if (!secret || !process.env.DATABASE_URL) return NextResponse.json({ error: "Database belum dikonfigurasi." }, { status: 503 })
  const token = cookies().get("triks_session")?.value
  if (!token) return NextResponse.json({ error: "Masuk untuk menyimpan hasil." }, { status: 401 })
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    const data = await request.json()
    const score = Math.max(0, Math.min(20, Number(data.score)))
    const durationSec = Math.max(0, Math.min(1800, Number(data.durationSec)))
    const attempt = await prisma.attempt.create({ data: { userId: String(payload.sub), section: String(data.section ?? "Tryout per bab").slice(0, 100), score, total: 20, durationSec } })
    return NextResponse.json({ id: attempt.id, score })
  } catch { return NextResponse.json({ error: "Sesi tidak valid atau hasil gagal disimpan." }, { status: 401 }) }
}

export async function GET() {
  if (!process.env.DATABASE_URL) return NextResponse.json({ entries: [], configured: false })
  try {
    const attempts = await prisma.attempt.findMany({ orderBy: [{ score: "desc" }, { createdAt: "asc" }], take: 50, include: { user: { select: { username: true } } } })
    return NextResponse.json({ configured: true, entries: attempts.map((a) => ({ username: a.user.username, score: a.score, total: a.total, createdAt: a.createdAt })) })
  } catch { return NextResponse.json({ configured: false, entries: [] }) }
}
