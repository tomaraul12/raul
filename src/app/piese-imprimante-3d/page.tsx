import ProductsPage from '@/components/shop/ProductsPage'
import { getCategoryProducts } from '@/lib/catalog-server'

export const dynamic = 'force-dynamic'

export default async function PieseImprimante3DPage() {
  const initialProducts = await getCategoryProducts('piese-imprimante-3d')

  return (
    <ProductsPage
      initialProducts={initialProducts}
      categorySlug="piese-imprimante-3d"
      title="Piese Imprimante 3D"
      subtitle="Componente și piese de schimb pentru imprimante 3D: duze, hotend-uri, curele, rulmenți și altele."
    />
  )
}
