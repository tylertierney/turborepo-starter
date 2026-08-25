import { ComponentProps, ReactNode, useState } from 'react'
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Appointment } from '../../../models/dist/src/appointment'

type ItemWithStackIdx<T extends object> = T & {
  stackIndex: number
  sameStartIndex: number
  sameStartCount: number
}

const addStackIdxToAppts = <T extends { startsAt: number; endsAt: number }>(
  items: T[] = [],
  dangerzone = 10 * 60 * 1000, // 10 minutes
): ItemWithStackIdx<T>[] => {
  const sorted = items.toSorted((a, b) => a.startsAt - b.startsAt)

  if (!sorted.length) return []

  // First establish groups of appointments whose starts are
  // within `dangerzone` of one another.
  const groups: T[][] = []
  let currentGroup: T[] = [sorted[0]]

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i]
    const prev = sorted[i - 1]

    if (curr.startsAt - prev.startsAt <= dangerzone) {
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
        prevItem && prevItem.endsAt > curr.startsAt
          ? prevItem.stackIndex + 1
          : 0

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

// type Appointment = {
//   startsAt: number
//   endsAt: number
//   color?: string
//   headerColor?: string
//   borderColor?: string
// }

export type Plan = {
  title: string | ReactNode
  appointments: Array<
    Appointment & {
      startsAt: number
      endsAt: number
      color?: string
      headerColor?: string
      borderColor?: string
    }
  >
}

export type DayPlannerProps = {
  interval?: 5 | 10 | 15 | 30 | 60
  plans: Plan[]
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
      className={cn(
        `@container flex flex-col grow overflow-auto overscroll-none`,
        className,
      )}
      style={{ maxHeight: 'inherit' }}
    >
      <div
        className="flex h-10 shrink-0 sticky top-0 bg-background z-20"
        style={{ minWidth: `calc(${plans.length} * ${columnWidth})` }}
      >
        <div
          className={cn(
            'h-full p-1 flex items-center justify-end text-[11px] text-muted-foreground/70 border-b sticky left-0 bg-background',
            selectedInterval === 60 ? 'w-14' : 'w-18',
          )}
        >
          <Select
            value={selectedInterval}
            onValueChange={(i) => setSelectedInterval(i ?? 30)}
          >
            <SelectTrigger size="sm" className="h-4 w-14 px-1">
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
              {typeof plan.title === 'string' ? (
                <b>{plan.title}</b>
              ) : (
                plan.title
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className={`relative flex flex-col grow`}
        {...rest}
        style={{ minWidth: `calc(${plans.length} * ${columnWidth})` }}
      >
        <div className="relative w-full">
          {Array(intervals)
            .fill(null)
            .map((_, idx) => {
              return (
                <div key={idx} className="flex h-10 grow ">
                  <div
                    className={cn(
                      'h-full p-1 border-r sticky left-0 text-[11px] text-muted-foreground/70 bg-background z-10',
                      selectedInterval === 60 ? 'w-14' : 'w-18',
                    )}
                  >
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
              const appts = addStackIdxToAppts(
                plan.appointments,
                selectedInterval * 60 * 1000,
              )

              return appts.map((appt, idx) => {
                const top = (appt.startsAt / millisecondsInDay) * 100
                const duration = Math.abs(appt.endsAt - appt.startsAt)

                const height =
                  appt.startsAt + duration >= millisecondsInDay
                    ? ((millisecondsInDay - appt.startsAt) /
                        millisecondsInDay) *
                      100
                    : (duration / millisecondsInDay) * 100
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
                  <Dialog key={'dialog' + planIdx * appts.length + idx}>
                    <DialogTrigger
                      nativeButton={false}
                      render={
                        <div
                          className={cn(
                            'absolute rounded-sm border shadow-lg hover:z-10 flex flex-col overflow-hidden text-xs',
                            appt.color ? appt.color : 'bg-cyan-400',
                            appt.borderColor ? appt.borderColor : '',
                          )}
                          style={{
                            pointerEvents: 'all',
                            top: top + '%',
                            height: height + '%',
                            left,
                            width,
                          }}
                        >
                          <div
                            className={cn(
                              'h-2 w-full shrink-0',
                              appt.headerColor,
                            )}
                          ></div>
                          <div className="flex flex-col p-2">
                            {/* {Array(10)
                              .fill(null)
                              .map(() => (
                                <p>{randParagraph()}</p>
                              ))} */}
                            <p>
                              {appt.primaryProvider.firstName.slice(0, 1) +
                                '.' +
                                ' ' +
                                appt.primaryProvider.lastName}
                            </p>
                          </div>
                        </div>
                      }
                    />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Appointment Details</DialogTitle>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose
                          render={<Button variant="outline">Cancel</Button>}
                        />
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )
              })
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
