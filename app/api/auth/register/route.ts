import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { SignJWT } from "jose"
import { prisma } from "@/lib/prisma"
export async function POST(request: Request) {
  const form = await request.formData()
  const username = String(form.get("username") ?? "").trim()
  const password = String(form.get("password") ?? "")
  if (username.length < 3 || password.length < 8) return NextResponse.json({ error: "Nama pengguna minimal 3 karakter dan kata sandi minimal 8 karakter." }, { status: 400 })
  const secret = process.env.AUTH_SECRET
  if (!process.env.DATABASE_URL || !secret) return NextResponse.json({ error: "Basis data belum dikonfigurasi. Tambahkan DATABASE_URL dan AUTH_SECRET di pengaturan deployment." }, { status: 503 })
  try {
    const passwordHash = await hash(password, 12)
    const user = await prisma.user.create({ data: { username, passwordHash }, select: { id: true, username: true } })
    const token = await new SignJWT({ username: user.username }).setProtectedHeader({ alg: "HS256" }).setSubject(user.id).setIssuedAt().setExpirationTime("7d").sign(new TextEncoder().encode(secret))
    const response = NextResponse.redirect(new URL("/materi", request.url), 303)
    response.cookies.set("triks_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 })
    return response
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return NextResponse.json({ error: "Nama pengguna itu sudah digunakan." }, { status: 409 })
    return NextResponse.json({ error: "Pendaftaran gagal. Pastikan database sudah dimigrasikan." }, { status: 503 })
  }
}
