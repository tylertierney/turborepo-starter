import { ComponentProps, useState } from 'react'
import { cn } from '../../lib/utils'
import { addMinutes, format, startOfDay } from 'date-fns'
import { Clock } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '../ui/select'
import { millisecondsInDay } from 'date-fns/constants'

type ItemWithStackIdx<T extends object> = T & {
  stackIndex: number
  sameStartIndex: number
  sameStartCount: number
}

const addStackIdxToAppts = <T extends { start: number; end: number }>(
  items: T[] = [],
  dangerzone = 10 * 60 * 1000, // 10 minutes
): ItemWithStackIdx<T>[] => {
  const sorted = items.toSorted((a, b) => a.start - b.start)

  if (!sorted.length) return []

  // First establish groups of appointments whose starts are
  // within `dangerzone` of one another.
  const groups: T[][] = []
  let currentGroup: T[] = [sorted[0]]

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i]
    const prev = sorted[i - 1]

    if (curr.start - prev.start <= dangerzone) {
      currentGroup.push(curr)
    } else {
      groups.push(currentGroup)
      currentGroup = [curr]
    }
  }

  groups.push(currentGroup)

  // Flatten the groups while preserving the existing stack behavior.
  const result: ItemWithStackIdx<T>[] = []

  for (const group of groups) {
    const sameStartCount = group.length

    for (
      let sameStartIndex = 0;
      sameStartIndex < group.length;
      sameStartIndex++
    ) {
      const curr = group[sameStartIndex]
      const prevItem = result.at(-1)

      const stackIndex =
        prevItem && prevItem.end > curr.start ? prevItem.stackIndex + 1 : 0

      result.push({
        ...curr,
        stackIndex,
        sameStartIndex,
        sameStartCount,
      })
    }
  }

  return result
}

type Interval = 5 | 10 | 15 | 30 | 60

const intervalOpts: Interval[] = [5, 10, 15, 30, 60]

const minutesInADay = 60 * 24

type Appointment = {
  start: number
  end: number
  color?: string
}

export type DayPlannerProps = {
  interval?: 5 | 10 | 15 | 30 | 60
  plans: Array<{ title: string; appointments: Appointment[] }>
}

export const DayPlanner = ({
  interval = 30,
  plans = [],
  className,
  ...rest
}: DayPlannerProps & ComponentProps<'div'>) => {
  const [selectedInterval, setSelectedInterval] = useState<Interval>(interval)
  const intervals = minutesInADay / selectedInterval

  const columnWidth = `max(${100 / plans.length + '%'}, 200px)`

  return (
    <div
      className={cn(`flex flex-col grow overflow-auto`, className)}
      style={{ maxHeight: 'inherit' }}
    >
      <div className="flex h-10 shrink-0 sticky top-0 bg-background z-20">
        <div className="h-full p-1 flex items-center justify-end w-18 text-[11px] text-muted-foreground/70 border-b sticky left-0 bg-background">
          <Select
            value={selectedInterval}
            onValueChange={(i) => setSelectedInterval(i ?? 30)}
          >
            <SelectTrigger size="sm" className="h-4 w-12 px-1">
              <Clock />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Interval</SelectLabel>
                {intervalOpts.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex grow items-center">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="flex items-end pb-1 justify-center shrink-0 border-b h-full bg-background"
              style={{
                width: columnWidth,
              }}
            >
              <b>{plan.title}</b>
            </div>
          ))}
        </div>
      </div>

      <div className={`relative flex flex-col grow`} {...rest}>
        <div className="relative w-full">
          {Array(intervals)
            .fill(null)
            .map((_, idx) => {
              return (
                <div className="flex h-10 grow ">
                  <div className="h-full p-1 border-r w-18 sticky left-0 text-[11px] text-muted-foreground/70 bg-background z-10">
                    {format(
                      addMinutes(
                        startOfDay(new Date()),
                        idx * selectedInterval,
                      ),
                      selectedInterval === 60 ? 'h a' : 'h:mm a',
                    )}
                  </div>
                  <div className="flex h-full grow">
                    {plans.map((plan, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col grow shrink-0"
                        style={{
                          width: columnWidth,
                        }}
                      >
                        <div
                          className="flex h-[50%] border-dashed border-b"
                          onClick={() => console.log('hi')}
                        ></div>
                        <div className="flex h-[50%] border-b"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          <div
            className="absolute top-0 left-18 w-[calc(100%-72px)]"
            style={{
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            {plans.map((plan, planIdx) => {
              const appts = addStackIdxToAppts(plan.appointments)

              return appts.map((appt, idx) => {
                const top = (appt.start / millisecondsInDay) * 100
                const duration = Math.abs(appt.end - appt.start)
                const height = (duration / millisecondsInDay) * 100
                const stackIdx = appt.stackIndex

                const STACK_OFFSET = 16

                const sameStart = appt.sameStartCount > 1

                const left = sameStart
                  ? `calc(${planIdx} * ${columnWidth} + 8px + ((${columnWidth} - 8px) / ${appt.sameStartCount}) * ${appt.sameStartIndex})`
                  : `calc(${planIdx} * ${columnWidth} + 8px + ${stackIdx * STACK_OFFSET}px)`

                const width = sameStart
                  ? `calc((${columnWidth} - 8px) / ${appt.sameStartCount})`
                  : `calc(${columnWidth} - 8px - ${stackIdx * STACK_OFFSET}px)`

                return (
                  <div
                    key={planIdx * appts.length + idx}
                    className={cn(
                      'absolute rounded-sm border shadow-lg hover:z-10',
                      appt.color ?? 'bg-cyan-400/20',
                    )}
                    style={{
                      pointerEvents: 'all',
                      top: top + '%',
                      height: height + '%',
                      left,
                      width,
                    }}
                  ></div>
                )
              })
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
