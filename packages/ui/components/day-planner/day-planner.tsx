import styles from './day-planner.module.scss'
import { ComponentProps, FC, Fragment, ReactNode } from 'react'
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
import { useStateWithLocalStorage } from '../../hooks/use-state-with-local-storage'

// export type DayPlannerAppointment<T,> = T & {
//   /**
//        * Milliseconds from start of day
//        */
//       startsAt: number
//       /**
//        * Milliseconds from start of day
//        */
//       endsAt: number
//       color?: string
//       headerColor?: string
//       borderColor?: string
// }

export type DayPlannerAppointment = Appointment & {
  /**
   * Milliseconds from start of day
   */
  relativeStartsAt: number
  /**
   * Milliseconds from start of day
   */
  relativeEndsAt: number
  color?: string
  headerColor?: string
  borderColor?: string
}

type ItemWithStackIdx<T extends object> = T & {
  stackIndex: number
  sameStartIndex: number
  sameStartCount: number
}

const addStackIdxToAppts = <
  T extends { relativeStartsAt: number; relativeEndsAt: number },
>(
  items: T[] = [],
  dangerzone = 10 * 60 * 1000, // 10 minutes
): ItemWithStackIdx<T>[] => {
  const sorted = items.toSorted(
    (a, b) => a.relativeStartsAt - b.relativeStartsAt,
  )

  if (!sorted.length) return []

  // First establish groups of appointments whose starts are
  // within `dangerzone` of one another.
  const groups: T[][] = []
  let currentGroup: T[] = [sorted[0]]

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i]
    const prev = sorted[i - 1]

    if (curr.relativeStartsAt - prev.relativeStartsAt <= dangerzone) {
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
        prevItem && prevItem.relativeEndsAt > curr.relativeStartsAt
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

export type Plan = {
  currentDay?: boolean
  title: string | ReactNode
  appointments: DayPlannerAppointment[]
}

export type DayPlannerProps = {
  interval?: 5 | 10 | 15 | 30 | 60
  plans: Plan[]
  appointmentContent?: FC<Appointment>
}

export const DayPlanner = ({
  interval = 30,
  plans = [],
  className,
  appointmentContent: AppointmentContent,
  ...rest
}: DayPlannerProps & ComponentProps<'div'>) => {
  const [selectedInterval, setSelectedInterval] =
    useStateWithLocalStorage<Interval>('day-planner-interval', interval)
  const intervals = minutesInADay / selectedInterval

  const columnWidth = `max(${100 / plans.length + '%'}, 200px)`

  return (
    <div
      className={cn(
        `@container flex flex-col grow overflow-auto overscroll-none`,
        className,
      )}
      style={{
        maxHeight: 'inherit',
        // scrollSnapType: 'x proximity'
      }}
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
              className={cn(
                'flex items-end pb-1 justify-center shrink-0 border-b h-full bg-background',
                plan.currentDay && 'border-b-blue-400 border-b-2',
              )}
              style={{
                width: columnWidth,
                scrollSnapAlign: 'center',
                // scrollInitialTarget: 'nearest',
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
                <div key={idx} className="flex h-10">
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
                    {plans.map((_, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col grow shrink-0 border-r border-r-muted"
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
            className={cn(
              'absolute top-0 w-[calc(100%-72px)]',
              selectedInterval === 60 ? 'left-14' : 'left-18',
            )}
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

              return (
                <Fragment key={planIdx}>
                  {plan.currentDay && (
                    <div
                      className={cn(
                        'bg-blue-400 rounded-full',
                        styles.currentTimeIndicator,
                      )}
                      style={{
                        position: 'absolute',
                        top:
                          ((new Date(Date.now()).getTime() -
                            startOfDay(new Date(Date.now())).getTime()) /
                            millisecondsInDay) *
                            100 +
                          '%',
                        left: `calc(${planIdx} * ${columnWidth})`,
                        width: columnWidth,
                        height: '2px',
                        pointerEvents: 'all',
                        zIndex: 1,
                      }}
                    >
                      <div
                        className="bg-blue-400 rounded-full"

                        style={{
                          height: '10px',
                          width: '10px',
                          marginTop: '-4px',
                          marginLeft: '-6px',
                        }}
                      ></div>
                      <div
                        className={cn(
                          'bg-foreground text-background text-[11px] px-1 rounded-xs',
                          styles.tooltip,
                        )}
                        style={{
                          marginTop: '-2.3rem',
                          left: 0,
                          width: 'fit-content',
                        }}
                      >
                        {format(new Date(Date.now()), 'EEE h:mm aa')}
                      </div>
                    </div>
                  )}

                  {appts.map((appt, idx) => {
                    const top =
                      (appt.relativeStartsAt / millisecondsInDay) * 100
                    const duration = Math.abs(
                      appt.relativeEndsAt - appt.relativeStartsAt,
                    )

                    const height =
                      appt.relativeStartsAt + duration >= millisecondsInDay
                        ? ((millisecondsInDay - appt.relativeStartsAt) /
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
                      : `calc(${columnWidth} - 16px - ${stackIdx * STACK_OFFSET}px)`

                    return (
                      <Dialog key={'dialog' + planIdx * appts.length + idx}>
                        <DialogTrigger
                          nativeButton={false}
                          render={
                            <div
                              className={cn(
                                'absolute rounded-sm border shadow-lg hover:z-10 flex flex-col overflow-hidden text-[11px]',
                                appt.color ? appt.color : 'bg-cyan-200',
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

                              <span
                                className={cn(
                                  'text-background text-[9px] h-5 relative font-bold text-nowrap rounded-br self-start pl-1 pr-2',
                                  appt.headerColor,
                                )}
                                style={{ marginTop: '-10px' }}
                              >
                                {format(
                                  new Date(
                                    startOfDay(new Date()).getTime() +
                                      appt.relativeStartsAt,
                                  ),
                                  'h:mm a',
                                )}
                              </span>

                              <div className="flex flex-col px-1">
                                {AppointmentContent && (
                                  <AppointmentContent {...appt} />
                                )}
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
                  })}
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
