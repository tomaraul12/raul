import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

const databasePort = 19876
const sitePort = 19877
const categories = {
  'componente-electronice': { id: 'category-components', name: 'Componente Electronice' },
  'filamente-3d': { id: 'category-filaments', name: 'Filamente 3D' },
  accesorii: { id: 'category-accessories', name: 'Piese Imprimante 3D' },
}
const mockProducts = Object.entries(categories).map(([slug, category], index) => ({
  id: ['11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', '33333333-3333-4333-8333-333333333333'][index],
  name: ['Senzor pentru proiecte Arduino', 'Filament PETG verde 1,75 mm', 'Hotend imprimantă 3D'][index],
  description: 'Produs fictiv folosit doar în testele de integrare.',
  price: 42,
  sale_price: null,
  stock: 5,
  sku: 'SEO-TEST-' + index,
  images: [],
  category_id: category.id,
  is_active: true,
  featured: false,
  attributes: {},
  categories: { name: category.name, slug },
}))

const database = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://127.0.0.1:${databasePort}`)
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  if (url.pathname === '/rest/v1/categories') {
    const slug = (url.searchParams.get('slug') ?? '').replace(/^eq\./, '')
    res.end(JSON.stringify(categories[slug] ?? null))
    return
  }
  if (url.pathname === '/rest/v1/products') {
    const categoryId = (url.searchParams.get('category_id') ?? '').replace(/^eq\./, '')
    res.end(JSON.stringify(categoryId ? mockProducts.filter(p => p.category_id === categoryId) : mockProducts))
    return
  }
  res.statusCode = 404
  res.end('{}')
})

await new Promise(resolve => database.listen(databasePort, '127.0.0.1', resolve))
let app
let output = ''
try {
  app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(sitePort)], {
    env: { ...process.env, NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${databasePort}` },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  app.stdout.on('data', data => { output += data.toString() })
  app.stderr.on('data', data => { output += data.toString() })

  const site = `http://127.0.0.1:${sitePort}`
  let ready = false
  for (let i = 0; i < 60; i++) {
    if (app.exitCode !== null) throw new Error('Next.js exited early: ' + output)
    try { if ((await fetch(site + '/')).ok) { ready = true; break } } catch { /* starting */ }
    await sleep(500)
  }
  assert.ok(ready, 'Next.js did not start: ' + output)

  for (const [pathname, index] of [['/componente', 0], ['/filamente', 1], ['/accesorii', 2]]) {
    const response = await fetch(site + pathname)
    assert.equal(response.status, 200, pathname + ' should return HTTP 200')
    const html = await response.text()
    const id = mockProducts[index].id
    assert.ok(html.includes(`href="/product/${id}"`), pathname + ' missing server-rendered product link')
    assert.ok(html.includes(mockProducts[index].name), pathname + ' missing product name')
    console.log('PASS ' + pathname + ': product hyperlink present without executing JavaScript')
  }

  const home = await (await fetch(site + '/')).text()
  assert.match(home, /<link\s+rel="canonical"\s+href="https:\/\/www\.technestprototyping\.ro\/"/)
  console.log('PASS homepage: canonical is set')

  const robots = await (await fetch(site + '/robots.txt')).text()
  assert.match(robots, /Allow: \/contact/)
  assert.match(robots, /Disallow: \/cont(?:\r?\n|$)/)
  console.log('PASS robots.txt: public contact allowed; account remains disallowed')

  const alias = await fetch(site + '/piese-imprimante-3d', { redirect: 'manual' })
  assert.equal(alias.status, 308)
  assert.equal(alias.headers.get('location'), '/accesorii')
  console.log('PASS old accessories route redirects permanently to /accesorii')

  console.log('All SEO smoke tests passed with a simulated Supabase API.')
} catch (error) {
  console.error(error)
  console.error(output.slice(-5000))
  process.exitCode = 1
} finally {
  app?.kill('SIGTERM')
  await new Promise(resolve => database.close(resolve))
}
