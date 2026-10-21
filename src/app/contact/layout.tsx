import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact și magazin în Timișoara",
  description: "Contactează TechNest Prototyping din Timișoara pentru componente electronice, filamente și printare 3D. Magazin: 3 August 1919 nr. 21, telefon 0754 545 800.",
  alternates: { canonical: "/contact" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
