import { Button, cn } from '@repo/ui'
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

export type MonthPlannerProps = {
  selectedDate: Date
  setSelectedDate: Dispatch<SetStateAction<Date>>
  showWeekend?: boolean
}

export const MonthPlanner = ({
  selectedDate,
  setSelectedDate,
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

  return (
    <div className={cn('@container flex flex-col', className)} {...rest}>
      <div className="flex justify-center items-center gap-4 my-6">
        <Button
          variant="outline"
          size="icon-sm"
          className={cn(className)}
          onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
        >
          <ChevronLeft />
        </Button>

        <h1>{format(selectedDate, 'MMMM')}</h1>
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
        style={{
          gridTemplateRows: 'repeat(6, minmax(100px, 120px))',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 200px))`,
        }}
        className="grid"
      >
        {dates.map((date, idx) => {
          const isToday = isSameDay(new Date(), date)
          return (
            <div
              key={date.toISOString()}
              className={cn(
                'border-b border-r p-2',
                idx % cols === 0 && 'border-l',
                idx < cols && 'border-t',
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center text-sm size-8 rounded-full',
                  (date < startOfMonth(selectedDate) ||
                    date > endOfMonth(selectedDate)) &&
                    'text-muted-foreground',
                  isToday && 'bg-accent-foreground text-background',
                )}
              >
                {format(date, 'd')}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
