import { createClient } from '@supabase/supabase-js'
import type { Product } from '@/types'

// Acelasi acces public ca in magazin: niciodata cheia service role.
export async function getCategoryProducts(categorySlug: string): Promise<Product[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null

  try {
    const sb = createClient(url, key, { auth: { persistSession: false } })
    const { data: category, error: categoryError } = await sb
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle()
    if (categoryError || !category) return null

    const { data, error } = await sb
      .from('products')
      .select('*, categories(name, slug)')
      .eq('category_id', category.id)
      .eq('is_active', true)
    if (error) return null

    return (data ?? []) as Product[]
  } catch (error) {
    console.error('Could not render category products:', categorySlug, error)
    return null
  }
}
