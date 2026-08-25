import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
import { Calendar } from './calendar'
import { ChevronDownIcon } from 'lucide-react'
import { format, isSameDay } from 'date-fns'
import { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

type DatePickerProps = {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export const DatePicker = ({
  date,
  setDate,
  className,
  children,
  ...rest
}: DatePickerProps & ComponentProps<'button'>) => {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={'outline'}
            data-empty={!date}
            className={cn(
              'justify-between text-left font-normal data-[empty=true]:text-muted-foreground',
              className,
            )}
            {...rest}
          >
            {children || (
              <>
                {date ? (
                  format(date, 'eeee MM/dd/yyyy')
                ) : (
                  <span>Pick a date</span>
                )}
                <ChevronDownIcon data-icon="inline-end" />
              </>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (!date) {
              setDate(selectedDate)
              return
            }

            if (!selectedDate) return

            if (isSameDay(new Date(date), new Date(selectedDate))) return
            setDate(selectedDate)
          }}
        />
        <div className="flex flex-col p-4">
          <Button onClick={() => setDate(new Date())}>Today</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
