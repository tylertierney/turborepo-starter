import { ComponentProps, useState } from 'react'
import { cn } from '../../lib/utils'
import {
  addMinutes,
  differenceInMilliseconds,
  format,
  startOfDay,
} from 'date-fns'
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

  const columnWidth = `max(${100 / plans.length + '%'}, 240px)`

  return (
    <div
      className={cn(`flex flex-col grow`, className)}
      style={{ maxHeight: 'inherit' }}
    >
      <div className="flex h-10 shrink-0">
        <div className="h-full p-1 flex items-center justify-end w-18 text-[11px] text-muted-foreground/70">
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
              className="flex justify-center shrink-0"
              style={{
                width: columnWidth,
              }}
            >
              <b>{plan.title}</b>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`relative border-t flex flex-col grow overflow-y-auto`}
        {...rest}
      >
        <div className="relative w-full">
          {Array(intervals)
            .fill(null)
            .map((_, idx) => {
              return (
                <div className="flex h-10 grow border-b shrink-0">
                  <div className="h-full p-1 border-r w-18 text-[11px] text-muted-foreground/70">
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
                        className="flex flex-col "
                        style={{
                          width: columnWidth,
                        }}
                      >
                        <div className="flex h-[50%] border-dashed border-b"></div>
                        <div className="flex h-[50%]"></div>
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
            }}
          >
            {plans.map((plan, planIdx) => {
              return (
                <div
                  key={planIdx}
                  className="absolute last-of-type:border-0"
                  style={{
                    width: columnWidth,
                    // left: planIdx * (100 / plans.length) + '%',
                    left: `calc(${planIdx} * ${columnWidth})`,
                    top: 0,
                    height: '100%',
                  }}
                >
                  {plan.appointments.map((appt, idx) => {
                    const top = (appt.start / millisecondsInDay) * 100
                    const duration = Math.abs(appt.end - appt.start)
                    const height = (duration / millisecondsInDay) * 100

                    return (
                      <div
                        key={planIdx * plan.appointments.length + idx}
                        className={cn(
                          'absolute w-[96%] left-[2%] rounded-sm',
                          appt.color ?? 'bg-cyan-400/20',
                        )}
                        style={{
                          top: top + '%',
                          height: height + '%',
                          // top: '10%',
                          // width: '96%',
                          // left: '4%',
                          // borderRadius: '6px',
                          // width: (planIdx + 1) * (100 / plans.length) + '%',
                          // left: planIdx * (100 / plans.length) + '%',
                        }}
                      >
                        hi
                      </div>
                    )
                  })}
                </div>
              )
              // return plan.appointments.map((appt, idx) => {
              //   return (
              //     <div
              //       key={planIdx * plan.appointments.length + idx}
              //       className="absolute bg-orange-200"
              //       style={{
              //         top: 0,
              //         width: (planIdx + 1) * (100 / plans.length) + '%',
              //         left: planIdx * (100 / plans.length) + '%',
              //       }}
              //     >
              //       hi
              //     </div>
              //   )
              // })
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
