import ProductsPage from '@/components/shop/ProductsPage'
import { getCategoryProducts } from '@/lib/catalog-server'

export const dynamic = 'force-dynamic'

export default async function ComponentePage() {
  const initialProducts = await getCategoryProducts('componente-electronice')

  return (
    <ProductsPage
      initialProducts={initialProducts}
      categorySlug="componente-electronice"
      title="Componente Electronice"
      subtitle="Arduino, Raspberry Pi, senzori și module de calitate superioară."
    />
  )
}
