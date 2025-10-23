import { Card } from "@/components/ui/card"

interface LEDPanelPreviewProps {
  cols: number
  rows: number
  pixelSize?: number
  elements?: Array<{
    x: number
    y: number
    width: number
    height: number
    color: string
    opacity?: number
  }>
  showGrid?: boolean
  zoom?: number
}

export default function LEDPanelPreview({
  cols,
  rows,
  pixelSize = 8,
  elements = [],
  showGrid = true,
  zoom = 1,
}: LEDPanelPreviewProps) {
  const totalWidth = cols * pixelSize * zoom
  const totalHeight = rows * pixelSize * zoom
  const dotSize = pixelSize * zoom

  // Create LED dots grid
  const dots = Array.from({ length: rows }).map((_, row) =>
    Array.from({ length: cols }).map((_, col) => ({
      row,
      col,
      x: col * dotSize,
      y: row * dotSize,
    })),
  )

  // Get color for a specific LED position
  const getLEDColor = (row: number, col: number): string => {
    for (const element of elements) {
      const elementStartCol = Math.floor(element.x / pixelSize)
      const elementStartRow = Math.floor(element.y / pixelSize)
      const elementEndCol = Math.ceil((element.x + element.width) / pixelSize)
      const elementEndRow = Math.ceil((element.y + element.height) / pixelSize)

      if (col >= elementStartCol && col < elementEndCol && row >= elementStartRow && row < elementEndRow) {
        return element.color
      }
    }
    return "#1a1a1a"
  }

  return (
    <Card className="p-4 border-primary/20 bg-card/50 backdrop-blur overflow-auto">
      <div className="flex items-center justify-center">
        <div
          className="relative bg-black rounded-lg border-2 border-primary/30"
          style={{
            width: `${totalWidth}px`,
            height: `${totalHeight}px`,
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: `${Math.max(1, zoom * 0.5)}px`,
            padding: `${Math.max(2, zoom)}px`,
          }}
        >
          {dots.map((row, rowIdx) =>
            row.map((dot, colIdx) => (
              <div
                key={`${rowIdx}-${colIdx}`}
                className="rounded-full transition-all duration-200 hover:scale-110 cursor-pointer"
                style={{
                  width: `${dotSize - Math.max(1, zoom * 0.5) * 2}px`,
                  height: `${dotSize - Math.max(1, zoom * 0.5) * 2}px`,
                  backgroundColor: getLEDColor(rowIdx, colIdx),
                  boxShadow: `0 0 ${Math.max(2, zoom * 2)}px ${getLEDColor(rowIdx, colIdx)}`,
                  opacity: 0.9,
                }}
                title={`LED [${rowIdx}, ${colIdx}]`}
              />
            )),
          )}

          {/* Grid overlay */}
          {showGrid && (
            <svg
              className="absolute inset-0 pointer-events-none"
              width={totalWidth}
              height={totalHeight}
              style={{ opacity: 0.1 }}
            >
              {Array.from({ length: cols + 1 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * dotSize}
                  y1={0}
                  x2={i * dotSize}
                  y2={totalHeight}
                  stroke="white"
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: rows + 1 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={i * dotSize}
                  x2={totalWidth}
                  y2={i * dotSize}
                  stroke="white"
                  strokeWidth="1"
                />
              ))}
            </svg>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>
          {cols}x{rows} Panel ({cols * rows} LEDs) • {totalWidth}x{totalHeight}px
        </p>
      </div>
    </Card>
  )
}
