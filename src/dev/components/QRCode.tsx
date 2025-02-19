import { farcasterIcon } from './icons.js'

export type QRCodeProps = {
  url: string
}

export async function QRCode(props: QRCodeProps) {
  const { url } = props

  // 1. Create QR code
  const { create } = await import('qrcode')
  const arr = Array.prototype.slice.call(
    create(url, { errorCorrectionLevel: 'H' }).modules.data,
    0,
  )
  const sqrt = Math.sqrt(arr.length)
  const matrix = arr.reduce(
    (rows, key, index) =>
      (index % sqrt === 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    [],
  )

  // 2. Add corners
  const logoMargin = 10
  const logoSize = 60
  const size = 250

  const dots = []
  const cellSize = size / matrix.length
  const qrList = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ] as const
  for (const item of qrList) {
    const x1 = (matrix.length - 7) * cellSize * item.x
    const y1 = (matrix.length - 7) * cellSize * item.y
    for (let i = 0; i < 3; i++) {
      const className = i % 2 !== 0 ? 'light' : 'dark'
      const height = cellSize * (7 - i * 2)
      const rx = (i - 2) * -5 + (i === 0 ? 2 : 0)
      const ry = (i - 2) * -5 + (i === 0 ? 2 : 0)
      const width = cellSize * (7 - i * 2)
      const x = x1 + cellSize * i
      const y = y1 + cellSize * i
      const props = { class: className, height, rx, ry, width, x, y }
      const dot = <rect {...props} />
      dots.push(dot)
    }
  }

  // 3. Add dots
  const clearArenaSize = Math.floor((logoSize + logoMargin * 2) / cellSize)
  const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2
  const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1

  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i]
    for (let j = 0; j < row.length; j++) {
      if (matrix[i][j]) {
        if (
          !(
            (i < 7 && j < 7) ||
            (i > matrix.length - 8 && j < 7) ||
            (i < 7 && j > matrix.length - 8)
          )
        ) {
          if (
            !(
              i > matrixMiddleStart &&
              i < matrixMiddleEnd &&
              j > matrixMiddleStart &&
              j < matrixMiddleEnd
            )
          ) {
            const cx = i * cellSize + cellSize / 2
            const cy = j * cellSize + cellSize / 2
            const r = cellSize / 3
            const props = { cx, cy, r }
            dots.push(<circle {...props} class="dark" />)
          }
        }
      }
    }
  }

  // 4. Render
  const logoWrapperSize = logoSize + logoMargin * 2

  return (
    <div
      class="border border-gray-100 p-3 w-fit"
      style={{ borderRadius: '1.5rem' }}
    >
      <div
        class="relative"
        style={{
          height: `${size}px`,
          userSelect: 'none',
          width: `${size}px`,
        }}
      >
        <div
          class="flex items-center justify-center absolute"
          style={{ inset: '0' }}
        >
          <div
            class="flex items-center justify-center rounded-lg"
            style={{
              backgroundColor: '#7866BB',
              color: 'white',
              height: `${logoSize - logoMargin}px`,
              width: `${logoSize - logoMargin}px`,
            }}
          >
            {farcasterIcon}
          </div>
        </div>

        <svg height={size} style={{ all: 'revert' }} width={size}>
          <title>QR Code</title>
          <defs>
            <clipPath id="clip-wrapper">
              <rect height={logoWrapperSize} width={logoWrapperSize} />
            </clipPath>
            <clipPath id="clip-logo">
              <rect height={logoSize} width={logoSize} />
            </clipPath>
          </defs>
          <rect fill="transparent" height={size} width={size} />
          {dots}
        </svg>
      </div>
    </div>
  )
}
