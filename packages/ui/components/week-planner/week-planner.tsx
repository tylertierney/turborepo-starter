import {
  format,
  nextSaturday,
  nextSunday,
  previousSaturday,
  subDays,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ComponentProps } from 'react'
import { DateRange } from 'react-day-picker'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { DayPlanner, Plan } from '../day-planner/day-planner'

export type WeekPlannerProps = {
  dateRange: NonNullable<DateRange>
  setDateRange: (dateRange: NonNullable<DateRange>) => void
  plans: Plan[]
}

export const WeekPlanner = ({
  dateRange,
  setDateRange,
  plans,
  className = '',
  ...rest
}: WeekPlannerProps & ComponentProps<'div'>) => {
  console.log(plans)
  return (
    <div
      className={cn(
        'flex flex-col grow overflow-auto overscroll-none',
        className,
      )}
      style={{ maxHeight: 'inherit' }}
      {...rest}
    >
      <div className="flex justify-center items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon-sm"
            className={cn(className)}
            onClick={() =>
              setDateRange({
                from: subDays(dateRange.from || new Date(Date.now()), 7),
                to: previousSaturday(dateRange.to || new Date(Date.now())),
              })
            }
          >
            <ChevronLeft />
          </Button>

          <h1>
            {format(dateRange?.from || new Date(Date.now()), 'eee. MMM d')}
            &nbsp;-&nbsp;
            {format(dateRange?.to || new Date(Date.now()), 'eee. MMM d')}
          </h1>
          <Button
            variant="outline"
            size="icon-sm"
            className={cn(className)}
            onClick={() =>
              setDateRange({
                from: nextSunday(dateRange.from || new Date(Date.now())),
                to: nextSaturday(dateRange.to || new Date(Date.now())),
              })
            }
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <DayPlanner plans={plans} />
    </div>
  )
}
