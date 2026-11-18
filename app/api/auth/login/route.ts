import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { SignJWT } from "jose"
import { prisma } from "@/lib/prisma"
export async function POST(request: Request) {
  const form = await request.formData()
  const username = String(form.get("username") ?? "").trim()
  const password = String(form.get("password") ?? "")
  const secret = process.env.AUTH_SECRET
  if (!process.env.DATABASE_URL || !secret) return NextResponse.json({ error: "Basis data belum dikonfigurasi di pengaturan deployment." }, { status: 503 })
  try {
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user || !(await compare(password, user.passwordHash))) return NextResponse.json({ error: "Nama pengguna atau kata sandi salah." }, { status: 401 })
    const token = await new SignJWT({ username: user.username }).setProtectedHeader({ alg: "HS256" }).setSubject(user.id).setIssuedAt().setExpirationTime("7d").sign(new TextEncoder().encode(secret))
    const response = NextResponse.redirect(new URL("/materi", request.url), 303)
    response.cookies.set("triks_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 })
    return response
  } catch { return NextResponse.json({ error: "Tidak dapat terhubung ke database." }, { status: 503 }) }
}
