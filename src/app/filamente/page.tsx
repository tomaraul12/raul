import ProductsPage from '@/components/shop/ProductsPage'
import { getCategoryProducts } from '@/lib/catalog-server'

export const dynamic = 'force-dynamic'

export default async function FilamentePage() {
  const initialProducts = await getCategoryProducts('filamente-3d')

  return (
    <ProductsPage
      initialProducts={initialProducts}
      categorySlug="filamente-3d"
      title="Filamente 3D"
      subtitle="Peste 150 de variante premium. Partener oficial Depozitfilament.ro."
    />
  )
}
