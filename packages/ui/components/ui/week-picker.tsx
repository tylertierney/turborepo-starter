import { Calendar } from './calendar'
import { DateRange, isDateRange } from 'react-day-picker'
import { endOfWeek, format, startOfWeek } from 'date-fns'
import { ComponentProps } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '../../lib/utils'
import { Button } from './button'
import { ChevronDownIcon } from 'lucide-react'

export type WeekPickerProps = {
  date: Date | NonNullable<DateRange>
  setDateRange: (range: NonNullable<DateRange>) => void
  // includeWeekends?: boolean
}

export const WeekPicker = ({
  date = new Date(),
  setDateRange,
  // includeWeekends = true,
  className = '',
  children,
  ...rest
}: WeekPickerProps & ComponentProps<typeof Button>) => {
  let selectedWeek: DateRange

  if (isDateRange(date)) {
    if (date.from && date.to) {
      const diff = Math.abs(date.to.getTime() - date.from.getTime())
      const mid = diff / 2 + date.from.getTime()
      const start = startOfWeek(new Date(mid))

      const end = endOfWeek(new Date(mid))

      selectedWeek = { from: start, to: end }
    } else {
      selectedWeek = { from: undefined, to: undefined }
    }
  } else {
    const start = startOfWeek(new Date(date))
    const end = endOfWeek(new Date(date))
    selectedWeek = { from: start, to: end }
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={'outline'}
            data-empty={!date}
            className={cn(
              ' text-left font-normal data-[empty=true]:text-muted-foreground',
              className,
            )}
            {...rest}
          >
            {children || (
              <>
                {date ? (
                  `${format(selectedWeek?.from || new Date(Date.now()), 'eee M/d/yy')} - ${format(selectedWeek?.to || new Date(Date.now()), 'eee M/d/yy')}`
                ) : (
                  <span>Pick a date</span>
                )}
                <ChevronDownIcon data-icon="inline-end" />
              </>
            )}
          </Button>
        }
      />
      <PopoverContent>
        <Calendar
          mode="single"
          modifiers={{
            selected: selectedWeek,
          }}
          modifiersClassNames={{ selected: 'bg-blue-500' }}
          onSelect={(d) => {
            if (!d) return
            setDateRange({
              from: startOfWeek(new Date(d)),
              to: endOfWeek(new Date(d)),
            })
          }}
        />
        <Button
          onClick={() =>
            setDateRange({
              from: startOfWeek(new Date(Date.now())),
              to: endOfWeek(new Date(Date.now())),
            })
          }
        >
          This Week
        </Button>
      </PopoverContent>
    </Popover>
  )
}
