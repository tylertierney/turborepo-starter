import {
  type CSSProperties,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

interface ChipListProps<T> {
  items: T[]
  renderChip: (item: T) => ReactNode
  renderOverflow?: (count: number) => ReactNode
  gap?: number
  className?: string
  style?: CSSProperties
}

export function ChipList<T>({
  items,
  renderChip,
  renderOverflow = (count) => `+${count}`,
  gap = 2,
  className,
  style,
}: ChipListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measurementRef = useRef<HTMLDivElement>(null)

  const [visibleCount, setVisibleCount] = useState(items.length)

  // This is the candidate currently being measured.
  const [candidateCount, setCandidateCount] = useState(items.length)

  const hiddenCount = items.length - visibleCount
  const candidateHiddenCount = items.length - candidateCount

  /*
   * Keep the measurement container synchronized with the real
   * container's dimensions.
   */
  useLayoutEffect(() => {
    const container = containerRef.current
    const measurement = measurementRef.current

    if (!container || !measurement) {
      return
    }

    const calculate = () => {
      const rect = container.getBoundingClientRect()

      if (rect.width <= 0 || rect.height <= 0) {
        return
      }

      measurement.style.width = `${rect.width}px`
      measurement.style.height = `${rect.height}px`

      const children = Array.from(
        measurement.querySelectorAll<HTMLElement>('[data-chip]'),
      )

      const measurementRect = measurement.getBoundingClientRect()

      const fits = children.every((child) => {
        const rect = child.getBoundingClientRect()

        return (
          rect.left >= measurementRect.left &&
          rect.right <= measurementRect.right + 0.5 &&
          rect.top >= measurementRect.top &&
          rect.bottom <= measurementRect.bottom + 0.5
        )
      })

      if (fits) {
        // The candidate fits, so this is our final answer.
        setVisibleCount(candidateCount)
        return
      }

      // The candidate doesn't fit. Remove one chip and measure again.
      if (candidateCount > 0) {
        setCandidateCount((count) => count - 1)
      }
    }

    calculate()

    const observer = new ResizeObserver(calculate)
    observer.observe(container)

    return () => observer.disconnect()
  }, [candidateCount, items.length])

  /*
   * When the items themselves change, start over from the assumption
   * that everything fits.
   */
  useLayoutEffect(() => {
    setCandidateCount(items.length)
    setVisibleCount(items.length)
  }, [items])

  return (
    <>
      {/* Actual visible list */}
      <div
        ref={containerRef}
        className={className}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap,
          overflow: 'hidden',
          flexGrow: 1,
          ...style,
        }}
      >
        {items.slice(0, visibleCount).map((item, index) => (
          <span key={index} data-chip>
            {renderChip(item)}
          </span>
        ))}

        {hiddenCount > 0 && (
          <span data-chip>{renderOverflow(hiddenCount)}</span>
        )}
      </div>

      {/* React-rendered measurement copy */}
      <div
        ref={measurementRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          display: 'flex',
          flexWrap: 'wrap',
          gap,
          overflow: 'hidden',
        }}
      >
        {items.slice(0, candidateCount).map((item, index) => (
          <span key={index} data-chip>
            {renderChip(item)}
          </span>
        ))}

        {candidateHiddenCount > 0 && (
          <span data-chip>{renderOverflow(candidateHiddenCount)}</span>
        )}
      </div>
    </>
  )
}
