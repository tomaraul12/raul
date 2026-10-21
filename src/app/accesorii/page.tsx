export const dynamic = 'force-dynamic'

import ProductsPage from '@/components/shop/ProductsPage'
import { getCategoryProducts } from '@/lib/catalog-server'

export default async function AccesoriiPage() {
  const initialProducts = await getCategoryProducts('accesorii')

  return (
    <ProductsPage
      initialProducts={initialProducts}
      categorySlug="accesorii"
      title="Piese Imprimante 3D"
      subtitle="Piese de schimb și consumabile pentru imprimante 3D."
    />
  )
}
