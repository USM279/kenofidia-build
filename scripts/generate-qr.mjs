import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const outDir = 'public/media/qr'
const targets = [
  { prefix: 'kenofidia-site-qr', url: 'https://kenofidia-build.vercel.app' },
]

const VERSION = 4
const SIZE = 17 + VERSION * 4
const DATA_CODEWORDS = 48
const ECC_CODEWORDS_PER_BLOCK = 26
const BLOCKS = 2
const ECL_FORMAT_BITS = 3 // Quartile

const textEncoder = new TextEncoder()

function makeMatrix() {
  return {
    modules: Array.from({ length: SIZE }, () => Array(SIZE).fill(false)),
    reserved: Array.from({ length: SIZE }, () => Array(SIZE).fill(false)),
  }
}

function setModule(qr, x, y, value, reserve = true) {
  qr.modules[y][x] = value
  if (reserve) qr.reserved[y][x] = true
}

function drawFinder(qr, x, y) {
  for (let dy = -1; dy <= 7; dy++) {
    for (let dx = -1; dx <= 7; dx++) {
      const xx = x + dx
      const yy = y + dy
      if (xx < 0 || xx >= SIZE || yy < 0 || yy >= SIZE) continue
      const isFinder =
        dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 &&
        (dx === 0 || dx === 6 || dy === 0 || dy === 6 ||
          (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4))
      setModule(qr, xx, yy, isFinder)
    }
  }
}

function drawAlignment(qr, cx, cy) {
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const dist = Math.max(Math.abs(dx), Math.abs(dy))
      setModule(qr, cx + dx, cy + dy, dist !== 1)
    }
  }
}

function drawFunctionPatterns(qr) {
  drawFinder(qr, 0, 0)
  drawFinder(qr, SIZE - 7, 0)
  drawFinder(qr, 0, SIZE - 7)

  for (let i = 8; i < SIZE - 8; i++) {
    const bit = i % 2 === 0
    setModule(qr, 6, i, bit)
    setModule(qr, i, 6, bit)
  }

  drawAlignment(qr, 26, 26)

  for (let i = 0; i < 8; i++) {
    setModule(qr, 8, i, false)
    setModule(qr, i, 8, false)
    setModule(qr, SIZE - 1 - i, 8, false)
    setModule(qr, 8, SIZE - 1 - i, false)
  }
  setModule(qr, 8, 8, false)
  setModule(qr, 8, SIZE - 8, true)
}

function appendBits(bits, value, length) {
  for (let i = length - 1; i >= 0; i--) bits.push(((value >>> i) & 1) !== 0)
}

function makeDataCodewords(input) {
  const bytes = Array.from(textEncoder.encode(input))
  const bits = []

  appendBits(bits, 0b0100, 4)
  appendBits(bits, bytes.length, 8)
  for (const byte of bytes) appendBits(bits, byte, 8)

  const capacityBits = DATA_CODEWORDS * 8
  const terminator = Math.min(4, capacityBits - bits.length)
  appendBits(bits, 0, terminator)
  while (bits.length % 8 !== 0) bits.push(false)

  const data = []
  for (let i = 0; i < bits.length; i += 8) {
    let value = 0
    for (let j = 0; j < 8; j++) value = (value << 1) | (bits[i + j] ? 1 : 0)
    data.push(value)
  }

  for (let pad = 0xec; data.length < DATA_CODEWORDS; pad ^= 0xec ^ 0x11) data.push(pad)
  return data
}

const EXP = Array(512).fill(0)
const LOG = Array(256).fill(0)
let value = 1
for (let i = 0; i < 255; i++) {
  EXP[i] = value
  LOG[value] = i
  value <<= 1
  if (value & 0x100) value ^= 0x11d
}
for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]

function gfMul(a, b) {
  if (a === 0 || b === 0) return 0
  return EXP[LOG[a] + LOG[b]]
}

function rsGenerator(degree) {
  let poly = [1]
  for (let i = 0; i < degree; i++) {
    const next = Array(poly.length + 1).fill(0)
    const root = EXP[i]
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j]
      next[j + 1] ^= gfMul(poly[j], root)
    }
    poly = next
  }
  return poly
}

function rsRemainder(data, degree) {
  const gen = rsGenerator(degree)
  const message = data.concat(Array(degree).fill(0))
  for (let i = 0; i < data.length; i++) {
    const factor = message[i]
    if (factor === 0) continue
    for (let j = 0; j < gen.length; j++) message[i + j] ^= gfMul(gen[j], factor)
  }
  return message.slice(message.length - degree)
}

function makeFinalCodewords(data) {
  const blockSize = DATA_CODEWORDS / BLOCKS
  const blocks = []
  for (let i = 0; i < BLOCKS; i++) {
    const blockData = data.slice(i * blockSize, (i + 1) * blockSize)
    blocks.push({ data: blockData, ecc: rsRemainder(blockData, ECC_CODEWORDS_PER_BLOCK) })
  }

  const result = []
  for (let i = 0; i < blockSize; i++) for (const block of blocks) result.push(block.data[i])
  for (let i = 0; i < ECC_CODEWORDS_PER_BLOCK; i++) for (const block of blocks) result.push(block.ecc[i])
  return result
}

function maskBit(mask, x, y) {
  switch (mask) {
    case 0: return (x + y) % 2 === 0
    case 1: return y % 2 === 0
    case 2: return x % 3 === 0
    case 3: return (x + y) % 3 === 0
    case 4: return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0
    case 5: return ((x * y) % 2) + ((x * y) % 3) === 0
    case 6: return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0
    case 7: return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0
    default: return false
  }
}

function placeData(qr, codewords, mask) {
  const bits = []
  for (const codeword of codewords) appendBits(bits, codeword, 8)

  let bitIndex = 0
  let upward = true
  for (let right = SIZE - 1; right >= 1; right -= 2) {
    if (right === 6) right--
    for (let vert = 0; vert < SIZE; vert++) {
      const y = upward ? SIZE - 1 - vert : vert
      for (let j = 0; j < 2; j++) {
        const x = right - j
        if (qr.reserved[y][x]) continue
        const bit = bitIndex < bits.length ? bits[bitIndex++] : false
        qr.modules[y][x] = bit !== maskBit(mask, x, y)
      }
    }
    upward = !upward
  }
}

function bchFormatBits(data) {
  let rem = data << 10
  for (let i = 14; i >= 10; i--) {
    if (((rem >>> i) & 1) !== 0) rem ^= 0x537 << (i - 10)
  }
  return ((data << 10) | rem) ^ 0x5412
}

function drawFormatBits(qr, mask) {
  const bits = bchFormatBits((ECL_FORMAT_BITS << 3) | mask)
  for (let i = 0; i <= 5; i++) setModule(qr, 8, i, ((bits >>> i) & 1) !== 0)
  setModule(qr, 8, 7, ((bits >>> 6) & 1) !== 0)
  setModule(qr, 8, 8, ((bits >>> 7) & 1) !== 0)
  setModule(qr, 7, 8, ((bits >>> 8) & 1) !== 0)
  for (let i = 9; i < 15; i++) setModule(qr, 14 - i, 8, ((bits >>> i) & 1) !== 0)

  for (let i = 0; i < 8; i++) setModule(qr, SIZE - 1 - i, 8, ((bits >>> i) & 1) !== 0)
  for (let i = 8; i < 15; i++) setModule(qr, 8, SIZE - 15 + i, ((bits >>> i) & 1) !== 0)
  setModule(qr, 8, SIZE - 8, true)
}

function penaltyScore(modules) {
  let penalty = 0
  for (let y = 0; y < SIZE; y++) {
    let runColor = modules[y][0]
    let runLen = 1
    for (let x = 1; x < SIZE; x++) {
      if (modules[y][x] === runColor) runLen++
      else {
        if (runLen >= 5) penalty += runLen - 2
        runColor = modules[y][x]
        runLen = 1
      }
    }
    if (runLen >= 5) penalty += runLen - 2
  }
  for (let x = 0; x < SIZE; x++) {
    let runColor = modules[0][x]
    let runLen = 1
    for (let y = 1; y < SIZE; y++) {
      if (modules[y][x] === runColor) runLen++
      else {
        if (runLen >= 5) penalty += runLen - 2
        runColor = modules[y][x]
        runLen = 1
      }
    }
    if (runLen >= 5) penalty += runLen - 2
  }
  for (let y = 0; y < SIZE - 1; y++) {
    for (let x = 0; x < SIZE - 1; x++) {
      const c = modules[y][x]
      if (c === modules[y][x + 1] && c === modules[y + 1][x] && c === modules[y + 1][x + 1]) penalty += 3
    }
  }
  const patternA = [true, false, true, true, true, false, true, false, false, false, false]
  const patternB = [false, false, false, false, true, false, true, true, true, false, true]
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x <= SIZE - 11; x++) {
      const slice = modules[y].slice(x, x + 11)
      if (slice.every((v, i) => v === patternA[i]) || slice.every((v, i) => v === patternB[i])) penalty += 40
    }
  }
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y <= SIZE - 11; y++) {
      const slice = Array.from({ length: 11 }, (_, i) => modules[y + i][x])
      if (slice.every((v, i) => v === patternA[i]) || slice.every((v, i) => v === patternB[i])) penalty += 40
    }
  }
  const dark = modules.flat().filter(Boolean).length
  penalty += Math.floor(Math.abs(dark * 20 - SIZE * SIZE * 10) / (SIZE * SIZE)) * 10
  return penalty
}

function makeQr(input) {
  const data = makeDataCodewords(input)
  const codewords = makeFinalCodewords(data)

  let best = null
  for (let mask = 0; mask < 8; mask++) {
    const qr = makeMatrix()
    drawFunctionPatterns(qr)
    placeData(qr, codewords, mask)
    drawFormatBits(qr, mask)
    const penalty = penaltyScore(qr.modules)
    if (!best || penalty < best.penalty) best = { qr, penalty, mask }
  }
  return best.qr.modules
}

function svg(modules, { transparent = false, dark = '#000', light = '#fff' } = {}) {
  const q = 4
  const total = SIZE + q * 2
  const paths = []
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (modules[y][x]) paths.push(`M${x + q},${y + q}h1v1h-1z`)
    }
  }
  const bg = transparent ? '' : `<rect width="100%" height="100%" fill="${light}"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges">${bg}<path fill="${dark}" d="${paths.join('')}"/></svg>\n`
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(buffer) {
  let c = 0xffffffff
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type)
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])))
  return Buffer.concat([length, typeBuffer, data, crc])
}

function png(modules, file, { width = 1024, transparent = false, inverted = false } = {}) {
  const q = 4
  const cells = SIZE + q * 2
  const scale = Math.floor(width / cells)
  const imageSize = cells * scale
  const dark = inverted ? [255, 255, 255, 255] : [0, 0, 0, 255]
  const light = transparent ? [255, 255, 255, 0] : inverted ? [0, 0, 0, 255] : [255, 255, 255, 255]

  const rows = []
  for (let y = 0; y < imageSize; y++) {
    const row = Buffer.alloc(1 + imageSize * 4)
    row[0] = 0
    const cellY = Math.floor(y / scale) - q
    for (let x = 0; x < imageSize; x++) {
      const cellX = Math.floor(x / scale) - q
      const on = cellX >= 0 && cellX < SIZE && cellY >= 0 && cellY < SIZE && modules[cellY][cellX]
      const color = on ? dark : light
      const offset = 1 + x * 4
      row[offset] = color[0]
      row[offset + 1] = color[1]
      row[offset + 2] = color[2]
      row[offset + 3] = color[3]
    }
    rows.push(row)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(imageSize, 0)
  ihdr.writeUInt32BE(imageSize, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const pngBuffer = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ])
  writeFileSync(file, pngBuffer)
}

mkdirSync(outDir, { recursive: true })

for (const { prefix, url } of targets) {
  const modules = makeQr(url)

  writeFileSync(`${outDir}/${prefix}.svg`, svg(modules))
  writeFileSync(`${outDir}/${prefix}-transparent.svg`, svg(modules, { transparent: true }))
  png(modules, `${outDir}/${prefix}-1024.png`, { width: 1024 })
  png(modules, `${outDir}/${prefix}-print-2048.png`, { width: 2048 })
  png(modules, `${outDir}/${prefix}-transparent-2048.png`, { width: 2048, transparent: true })
  png(modules, `${outDir}/${prefix}-inverted-2048.png`, { width: 2048, inverted: true })
  writeFileSync(`${outDir}/${prefix}-url.txt`, `${url}\n`)

  console.log(`Generated QR assets for ${url}`)
}
