import { createHash } from 'node:crypto'
import { access, mkdir, readFile, rename, rm, writeFile, link } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const dataPath = resolve('src/data/products.json')
const publicRoot = resolve('public')
const imageRoot = resolve(publicRoot, 'images/products')
const allowedHosts = new Set(['cdn.imweb.me', 'cdn-optimized.imweb.me'])
const maxBytes = 25 * 1024 * 1024

function sourceUrl(value) {
  const url = new URL(value)
  if (url.protocol !== 'https:' || !allowedHosts.has(url.host) ||
      url.username || url.password || url.hash) throw new Error('지원하지 않는 URL: ' + value)
  return url.href
}

function segment(value) {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(value)) throw new Error('잘못된 ID: ' + value)
  return value
}

function colorFolder(variant) {
  const color = variant.color?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return [color || 'default', segment(variant.id)].join('-')
}

function diskPath(webPath) {
  if (!/^\/images\/products\/(?:[a-z0-9-]+\/)+[a-z0-9.-]+$/i.test(webPath)) {
    throw new Error('잘못된 localPath: ' + webPath)
  }
  const path = resolve(publicRoot, '.' + webPath)
  if (!path.startsWith(imageRoot + sep)) throw new Error('저장 범위를 벗어난 경로: ' + webPath)
  return path
}

function extension(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'png'
  if (bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) return 'jpg'
  if (/^GIF8[79]a$/.test(bytes.toString('ascii', 0, 6))) return 'gif'
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'webp'
  throw new Error('지원 이미지 형식이 아닙니다.')
}

async function download(url) {
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(30_000) })
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/') || !response.body) {
    throw new Error('이미지 응답 오류: ' + response.status + ' ' + url)
  }
  const chunks = []
  let length = 0
  for await (const chunk of response.body) {
    length += chunk.length
    if (length > maxBytes) throw new Error('25 MiB 초과: ' + url)
    chunks.push(chunk)
  }
  return Buffer.concat(chunks, length)
}

async function storeImage(path, bytes, existingPath) {
  try {
    const existing = await readFile(path)
    if (!existing.equals(bytes)) throw new Error('기존 파일과 내용이 다릅니다: ' + path)
    return
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  if (existingPath) {
    try {
      await link(existingPath, path)
      return
    } catch (error) {
      if (!['EXDEV', 'EPERM', 'ENOSYS', 'EOPNOTSUPP'].includes(error.code)) throw error
    }
  }
  await writeFile(path, bytes, { flag: 'wx' })
}

const raw = await readFile(dataPath, 'utf8')
const products = JSON.parse(raw.replace(/^\uFEFF/, ''))
const entries = products.flatMap(product => product.variants.flatMap(variant => {
  const folder = '/images/products/' + segment(product.id) + '/' + colorFolder(variant)
  const { representative, additional, detail } = variant.images
  return [
    { role: 'representative', assets: [representative] },
    { role: 'additional', assets: additional },
    { role: 'detail', assets: detail },
  ].flatMap(({ role, assets }) => assets.map((asset, index) => ({
    asset, folder, role, index, variantId: variant.id,
  })))
}))
const args = process.argv.slice(2)
const mode = args[0] ?? '--audit'
if (!((mode === '--audit' && args.length <= 1) ||
      (mode === '--apply' && args.length === 2))) {
  throw new Error('node scripts/product-images.mjs --audit | --apply approved-image-urls.json')
}
const mistakes = []
const missingRepresentatives = []
const urls = new Set()
const counts = { representative: 0, additional: 0, detail: 0 }
let linked = 0

for (const { asset, role, variantId } of entries) {
  try {
    if (asset.localPath !== null) {
      const bytes = await readFile(diskPath(asset.localPath))
      extension(bytes)
      linked++
    }
    if (asset.sourceUrl !== null) {
      urls.add(sourceUrl(asset.sourceUrl))
      counts[role]++
    } else if (role === 'representative' && asset.localPath === null) {
      missingRepresentatives.push(variantId)
    }
  } catch (error) {
    mistakes.push({ variantId, role, error: error.message })
  }
}

console.log(JSON.stringify({
  products: products.length,
  variants: products.reduce((sum, product) => sum + product.variants.length, 0),
  sourceReferences: counts,
  distinctSourceUrls: urls.size,
  duplicateReferences: Object.values(counts).reduce((sum, count) => sum + count, 0) - urls.size,
  linked,
  missingRepresentativeCount: missingRepresentatives.length,
  missingRepresentatives,
  pathOrUrlErrors: mistakes,
}, null, 2))

if (mistakes.length) throw new Error('경로 또는 URL 오류를 먼저 수정하세요.')
if (mode === '--apply') {
  const approvedInput = JSON.parse((await readFile(resolve(args[1]), 'utf8')).replace(/^\uFEFF/, ''))
  if (!Array.isArray(approvedInput) || !approvedInput.length) throw new Error('허락받은 URL 배열이 필요합니다.')
  const approved = new Set(approvedInput.map(sourceUrl))
  for (const url of approved) {
    if (!urls.has(url)) throw new Error('상품 JSON에 없는 URL: ' + url)
  }
  const byUrl = new Map()
  for (const entry of entries) {
    if (!entry.asset.sourceUrl) continue
    const url = sourceUrl(entry.asset.sourceUrl)
    if (!approved.has(url)) continue
    if (!byUrl.has(url)) byUrl.set(url, [])
    byUrl.get(url).push(entry)
  }

  const byFolderAndHash = new Map()
  const firstByHash = new Map()
  for (const matching of byUrl.values()) {
    for (const { asset, folder } of matching) {
      if (!asset.localPath?.startsWith(folder + '/')) continue
      const path = diskPath(asset.localPath)
      const hash = createHash('sha256').update(await readFile(path)).digest('hex')
      byFolderAndHash.set(folder + '/' + hash, asset.localPath)
      if (!firstByHash.has(hash)) firstByHash.set(hash, path)
    }
  }
  let updated = 0
  for (const [url, matching] of byUrl) {
    // One request at a time, with a pause between requests.
    await delay(750)
    const bytes = await download(url)
    const hash = createHash('sha256').update(bytes).digest('hex')
    const ext = extension(bytes)
    for (const { asset, folder, role, index } of matching) {
      const key = folder + '/' + hash
      let webPath = byFolderAndHash.get(key)
      if (!webPath) {
        const ordinal = String(index + 1).padStart(2, '0')
        webPath = folder + '/' + role + '-' + ordinal + '-' + hash.slice(0, 12) + '.' + ext
        const path = diskPath(webPath)
        await mkdir(dirname(path), { recursive: true })
        await storeImage(path, bytes, firstByHash.get(hash))
        byFolderAndHash.set(key, webPath)
        if (!firstByHash.has(hash)) firstByHash.set(hash, path)
      }
      await access(diskPath(webPath))
      if (asset.localPath !== webPath || asset.usage !== 'approved') updated++
      asset.localPath = webPath
      asset.usage = 'approved'
    }
  }
  if (updated) {
    if (await readFile(dataPath, 'utf8') !== raw) throw new Error('실행 중 상품 JSON이 변경됐습니다.')
    const tempPath = dataPath + '.' + process.pid + '.tmp'
    try {
      await writeFile(tempPath, JSON.stringify(products, null, 2) + '\n', { flag: 'wx' })
      await rename(tempPath, dataPath)
    } finally {
      await rm(tempPath, { force: true })
    }
  }
  console.log(JSON.stringify({ approvedUrls: byUrl.size, updatedImageReferences: updated,
    uniqueImageContents: firstByHash.size, colorFolderFiles: byFolderAndHash.size }, null, 2))
}
