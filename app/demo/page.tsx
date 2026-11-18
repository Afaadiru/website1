"use client"

import { LiquidNavbar, NimbusIcons, LiquidNavItem } from "@/components/ui/liquid-glass-navbar"

// Menu navigasi untuk website belajar
const learnNavItems: LiquidNavItem[] = [
  { label: "Beranda", icon: NimbusIcons.home, fx: "glow", href: "/" },
  { label: "Kursus", icon: NimbusIcons.globe, fx: "spin", href: "/courses" },
  { label: "Eksplorasi", icon: NimbusIcons.plane, fx: "plane", href: "/explore" },
  { label: "Progress", icon: NimbusIcons.drop, fx: "drop", href: "/progress" },
  { label: "Profil", icon: NimbusIcons.user, fx: "wave", href: "/profile" },
]

export default function Demo() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        padding: "0 16px",
        background: "#DCEBF5",
      }}
    >
      {/* Light mode (untuk background terang) */}
      <LiquidNavbar
        tone="light"
        defaultActive={0}
        sound={false}
        items={learnNavItems}
        onChange={(index, item) => {
          console.log(`Navigasi ke: ${item.label}`)
        }}
      />

      {/* Dark mode (untuk background gelap) */}
      <div
        style={{
          background: "#0B132B",
          borderRadius: 999,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <LiquidNavbar
          tone="dark"
          defaultActive={0}
          sound={false}
          items={learnNavItems}
        />
      </div>

      <span
        style={{
          font: "500 12px/1 ui-sans-serif, -apple-system, 'Segoe UI', system-ui, sans-serif",
          color: "rgba(11,19,43,.5)",
        }}
      >
        Website Belajar · Liquid Glass Navbar
      </span>
    </div>
  )
}

