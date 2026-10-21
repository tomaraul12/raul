import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Piese și accesorii pentru imprimante 3D",
  description: "Caută piese pentru imprimante 3D la TechNest Timișoara: duze, hotend-uri și consumabile. Verifică modelele compatibile și comandă online.",
  alternates: { canonical: "/accesorii" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
