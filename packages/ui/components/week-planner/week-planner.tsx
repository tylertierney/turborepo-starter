import {
  format,
  nextSaturday,
  nextSunday,
  previousSaturday,
  subDays,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ComponentProps, FC } from 'react'
import { DateRange } from 'react-day-picker'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import {
  DayPlanner,
  DayPlannerAppointment,
  Plan,
} from '../day-planner/day-planner'

export type WeekPlannerProps = {
  dateRange: NonNullable<DateRange>
  setDateRange: (dateRange: NonNullable<DateRange>) => void
  plans: Plan[]
  appointmentContent?: FC<DayPlannerAppointment>
  appointmentDialog?: FC<DayPlannerAppointment>
}

export const WeekPlanner = ({
  dateRange,
  setDateRange,
  plans,
  appointmentContent: AppointmentContent,
  appointmentDialog: AppointmentDialog,
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
      <DayPlanner
        plans={plans}
        appointmentContent={AppointmentContent}
        appointmentDialog={AppointmentDialog}
      />
    </div>
  )
}
