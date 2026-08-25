import {
  format,
  nextSaturday,
  nextSunday,
  previousSaturday,
  subDays,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ComponentProps, ReactNode } from 'react'
import { DateRange } from 'react-day-picker'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { DayPlanner, Plan } from '../day-planner/day-planner'
import { Appointment } from '@repo/models'

export type WeekPlannerProps = {
  dateRange: NonNullable<DateRange>
  setDateRange: (dateRange: NonNullable<DateRange>) => void
  plans: Plan[]
  appointmentContent?: (appt: Appointment) => ReactNode
}

export const WeekPlanner = ({
  dateRange,
  setDateRange,
  plans,
  appointmentContent,
  className = '',
  ...rest
}: WeekPlannerProps & ComponentProps<'div'>) => {
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
        <div className="flex items-center gap-4 my-2">
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
      <DayPlanner plans={plans} appointmentContent={appointmentContent} />
    </div>
  )
}
