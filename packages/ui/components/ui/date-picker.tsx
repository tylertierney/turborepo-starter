import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
import { Calendar } from './calendar'
import { ChevronDownIcon } from 'lucide-react'
import { format } from 'date-fns'

type DatePickerProps = {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export const DatePicker = ({ date, setDate }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={'outline'}
            data-empty={!date}
            className="w-32 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            {date ? format(date, 'P') : <span>Pick a date</span>}
            <ChevronDownIcon data-icon="inline-end" />
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          // defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  )
}
