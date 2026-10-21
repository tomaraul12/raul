import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Filamente 3D PLA, PETG, TPU și ABS în Timișoara",
  description: "Descoperă filamente 3D PLA, PETG, TPU și ABS la TechNest Timișoara. Compară materiale și culori pentru imprimanta ta. Comenzi online și livrare în România.",
  alternates: { canonical: "/filamente" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
