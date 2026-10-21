import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Printare 3D la comandă în Timișoara",
  description: "Servicii de printare 3D la comandă în Timișoara: prototipuri și piese personalizate. Trimite fișierul 3D și solicită o ofertă adaptată proiectului.",
  alternates: { canonical: "/print3d" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
