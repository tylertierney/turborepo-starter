import { Button, ChipList, cn, Plan } from '@repo/ui'
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ComponentProps, Dispatch, SetStateAction } from 'react'
import { Badge } from './ui/badge'

export type MonthPlannerProps = {
  selectedDate: Date
  setSelectedDate: Dispatch<SetStateAction<Date>>
  plans: Plan[]
  onDayClick?: (date: Date) => void
  showWeekend?: boolean
}

export const MonthPlanner = ({
  selectedDate,
  setSelectedDate,
  plans = [],
  onDayClick,
  showWeekend = true,
  className,
  ...rest
}: MonthPlannerProps & ComponentProps<'div'>) => {
  const cols = showWeekend ? 7 : 5
  const rows = 6

  const start = startOfWeek(startOfMonth(selectedDate), {
    weekStartsOn: showWeekend ? 0 : 1,
  })

  const dates = Array.from({ length: 42 }, (_, idx) => addDays(start, idx))
    .filter(
      (date) => showWeekend || (date.getDay() !== 0 && date.getDay() !== 6),
    )
    .slice(0, rows * cols)

  const appts = plans.map(({ appointments }) => appointments).flat()

  const apptsByDay = dates.map((date) =>
    appts.filter(({ startsAt }) => isSameDay(startsAt, date)),
  )

  const summaries = apptsByDay.map((appts) => {
    const grouped = Object.groupBy(
      appts,
      ({ primaryProvider }) => primaryProvider.id,
    )

    const withLabels = Object.values(grouped).map((appointments) => {
      return {
        primaryProvider: appointments?.[0].primaryProvider,
        appointments,
      }
    })

    return withLabels.filter(
      ({ primaryProvider, appointments }) =>
        Boolean(primaryProvider) && Boolean(appointments),
    )
  })

  const datesWithSummaries = dates.map((d, idx) => ({
    date: d,
    summaries: summaries[idx],
  }))

  return (
    <div
      className={cn(
        '@container flex flex-col grow overflow-auto overscroll-none',
        className,
      )}
      style={{ maxHeight: 'inherit' }}
      {...rest}
    >
      <div className="flex justify-center items-center gap-4 my-6">
        <Button
          variant="outline"
          size="icon-sm"
          className={cn(className)}
          onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
        >
          <ChevronLeft />
        </Button>

        <h1>
          {format(selectedDate, 'MMMM')} '{format(selectedDate, 'yy')}
        </h1>
        <Button
          variant="outline"
          size="icon-sm"
          className={cn(className)}
          onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
        >
          <ChevronRight />
        </Button>
      </div>
      <div
        className="grid sticky top-0 bg-background border-b"
        style={{
          gridTemplateRows: 'repeat(1, 50px)',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 200px))`,
        }}
      >
        {(showWeekend
          ? ['S', 'M', 'T', 'W', 'Th', 'F', 'S']
          : ['M', 'T', 'W', 'Th', 'F']
        ).map((str, idx) => (
          <div
            key={str + idx}
            className="flex items-end justify-center pb-2 font-bold text-sm"
          >
            {str}
          </div>
        ))}
      </div>
      <div
        style={{
          gridTemplateRows: 'repeat(6, minmax(100px, 120px))',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 200px))`,
        }}
        className="grid"
      >
        {datesWithSummaries.map(({ date, summaries }, idx) => {
          const isToday = isSameDay(new Date(), date)
          return (
            <div
              key={date.toISOString()}
              className={cn(
                'border-b border-r overflow-hidden',
                idx % cols === 0 && 'border-l',
              )}
              onClick={() => onDayClick?.(date)}
            >
              <div
                className={cn(
                  'flex items-center justify-center mt-2 ml-2 text-sm size-8 rounded-full',
                  (date < startOfMonth(selectedDate) ||
                    date > endOfMonth(selectedDate)) &&
                    'text-muted-foreground',
                  isToday && 'bg-accent-foreground text-background',
                )}
              >
                {format(date, 'd')}
              </div>
              <div className="flex flex-wrap pt-1 px-1 gap-1">
                <ChipList
                  items={summaries
                    .filter(
                      ({ primaryProvider, appointments }) =>
                        Boolean(primaryProvider) &&
                        Boolean(appointments?.length),
                    )
                    .map(
                      ({ primaryProvider, appointments }) =>
                        `${primaryProvider?.firstName.slice(0, 1)}. ${primaryProvider?.lastName}: ${appointments?.length}`,
                    )}
                  renderChip={(str) => (
                    <Badge className="text-[10px]" variant="secondary">
                      {str}
                    </Badge>
                  )}
                  renderOverflow={(count) => (
                    <Badge className="text-[10px]" variant="secondary">
                      +{count}
                    </Badge>
                  )}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
