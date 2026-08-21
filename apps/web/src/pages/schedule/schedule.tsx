import {
  Button,
  DatePicker,
  DayPlanner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui'
import { isSameDay } from 'date-fns'
import { millisecondsInHour } from 'date-fns/constants'
import { useState } from 'react'

export const Schedule = () => {
  const today = new Date()

  const [selectedDate, setSelectedDate] = useState(today)

  return (
    <Tabs className="w-full h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] @container">
      <div className="flex items-center h-14 px-4 gap-4 overflow-x-auto">
        <div className="flex gap-1">
          <Button
            size="default"
            disabled={isSameDay(today, selectedDate)}

            onClick={() => setSelectedDate(today)}
          >
            Today
          </Button>
          <DatePicker
            date={selectedDate}
            setDate={(d) => setSelectedDate(d as Date)}
          />
        </div>

        <TabsList variant="default">
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
        </TabsList>
      </div>
      <div className="flex h-full overflow-y-hidden">
        <TabsContent
          className="flex flex-col max-h-[calc(100dvh-8rem)]"
          value="day"
        >
          <DayPlanner
            plans={[
              {
                title: 'Tyler',
                appointments: [
                  {
                    start: millisecondsInHour * 1,
                    end: millisecondsInHour * 2.5,
                    color: 'bg-green-400',
                  },
                  {
                    start: millisecondsInHour * 1.5,
                    end: millisecondsInHour * 3,
                    color: 'bg-green-400',
                  },
                  {
                    start: millisecondsInHour * 2.75,
                    end: millisecondsInHour * 3.5,
                    color: 'bg-green-400',
                  },
                  {
                    start: millisecondsInHour * 2.75,
                    end: millisecondsInHour * 3.5,
                    color: 'bg-green-400',
                  },
                  {
                    start: millisecondsInHour * 2.75,
                    end: millisecondsInHour * 5,
                    color: 'bg-green-400',
                  },
                  {
                    start: millisecondsInHour * 9,
                    end: millisecondsInHour * 10,
                    color: 'bg-green-400',
                  },
                ],
              },
              {
                title: 'Karen',
                appointments: [
                  {
                    start: millisecondsInHour * 3,
                    end: millisecondsInHour * 8.5,
                    color: 'bg-purple-500/50',
                  },
                  {
                    start: millisecondsInHour * 10,
                    end: millisecondsInHour * 10.5,
                    color: 'bg-purple-500/50',
                  },
                  {
                    start: millisecondsInHour * 13,
                    end: millisecondsInHour * 15.5,
                    color: 'bg-purple-500/50',
                  },
                ],
              },
              {
                title: 'Bunni',
                appointments: [
                  {
                    start: millisecondsInHour * 7.5,
                    end: millisecondsInHour * 8.5,
                  },
                ],
              },
            ]}
          />
        </TabsContent>
      </div>
    </Tabs>
  )
}
