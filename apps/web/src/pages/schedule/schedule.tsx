import {
  Button,
  Checkbox,
  DatePicker,
  DayPlanner,
  Label,
  MonthPlanner,
  Multiselect,
  PingingDot,
  Plan,
  WeekPicker,
  WeekPlanner,
  cn,
  useStateWithLocalStorage,
} from '@repo/ui'
import { useState } from 'react'
import { Appointment, User } from '@repo/models'
import { useTheme } from '../../context/ThemeProvider'
import {
  eachDayOfInterval,
  endOfDay,
  endOfWeek,
  format,
  isSameDay,
  nextDay,
  previousDay,
  startOfDay,
  startOfWeek,
} from 'date-fns'
import { ChevronDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api'
import { AppointmentContent } from './appointment-content'

type View = 'day' | 'week' | 'month'

export const Schedule = () => {
  const today = new Date(Date.now())

  const [showWeekend, setShowWeekend] = useStateWithLocalStorage(
    'calendar-show-weekend',
    false,
  )

  const [selectedDate, setSelectedDate] = useState(today)
  const [view, setView] = useStateWithLocalStorage<View>('calendar-view', 'day')
  const [selectedUsers, setSelectedUsers] = useStateWithLocalStorage<string[]>(
    'selected-user-calendars',
    [],
  )

  const selectedDateRange: { from: Date; to: Date } = {
    from: startOfWeek(selectedDate),
    to: endOfWeek(selectedDate),
  }

  const viewedDateRange: { from: Date; to: Date } = showWeekend
    ? selectedDateRange
    : {
        from: nextDay(selectedDateRange.from, 1),
        to: previousDay(selectedDateRange.to, 5),
      }

  const { theme } = useTheme()

  const { data: users } = useQuery({
    queryKey: ['users-for-appointments-filtering'],
    queryFn: async () => {
      const { data: res } = await api.get('api/users?pageSize=499')
      const { data } = res
      return (Array.isArray(data) ? data : []) as User[]
    },
  })

  const { data: appointments } = useQuery({
    queryKey: [
      `appointments`,
      selectedDateRange.from.toISOString(),
      selectedDateRange.to.toISOString(),
      selectedUsers.join(','),
    ],
    queryFn: async () => {
      const query = new URLSearchParams()

      if (view === 'day') {
        query.set('startsAt', startOfDay(selectedDate).toISOString())
        query.set('endsAt', endOfDay(selectedDate).toISOString())
      } else {
        query.set('startsAt', viewedDateRange.from.toISOString())
        query.set('endsAt', viewedDateRange.to.toISOString())
      }

      if (selectedUsers.length) {
        query.set('users', selectedUsers.join(','))
      }

      const { data } = await api.get<Appointment[]>(
        `api/appointments?${query.toString()}`,
      )
      return (data || []).map((a) => ({
        ...a,
        startsAt: new Date(a.startsAt),
        endsAt: new Date(a.endsAt),
      }))
    },
    placeholderData: (prev) => prev,
  })

  const datesArr =
    view === 'day'
      ? [selectedDate]
      : eachDayOfInterval({
          start: viewedDateRange.from,
          end: viewedDateRange.to,
        })

  const apptsByDay = datesArr.map((d) => {
    return {
      date: d,
      appointments: (appointments || []).filter(({ startsAt }) => {
        return isSameDay(new Date(startsAt), d)
      }),
    }
  })

  const plans: Plan[] = apptsByDay.map(({ date, appointments }) => {
    const currentDay = isSameDay(date, new Date(Date.now()))
    return {
      title: (
        <div className="flex items-center gap-2">
          {currentDay && <PingingDot className="text-blue-400 self-center" />}
          <b>{format(date, 'EEEE')}</b>{' '}
          <span className="text-muted-foreground text-xs text-nowrap mt-0.5">
            {format(date, 'MMM d')}
          </span>
        </div>
      ),
      currentDay,
      appointments: appointments.map((a) => {
        const bg =
          theme === 'light'
            ? `bg-${a.type.color}-100`
            : `bg-${a.type.color}-900`
        const header =
          theme === 'light'
            ? `bg-${a.type.color}-700`
            : `bg-${a.type.color}-400`
        const borderColor = `border-${a.type.color}-700`

        return {
          ...a,
          relativeStartsAt:
            a.startsAt.getTime() - startOfDay(a.startsAt).getTime(),
          relativeEndsAt: a.endsAt.getTime() - startOfDay(a.startsAt).getTime(),
          color: bg,
          headerColor: header,
          borderColor,
        }
      }),
    }
  })

  return (
    <>
      <div className="flex items-center w-full h-14 px-4 gap-4 overflow-x-auto">
        <div className="flex gap-1">
          {view === 'day' ? (
            <DatePicker
              date={selectedDate}
              setDate={(d) => setSelectedDate(d as Date)}
            >
              {format(selectedDate || new Date(Date.now()), 'eee. MMM d')}
              <ChevronDown />
            </DatePicker>
          ) : (
            <WeekPicker
              size="sm"
              date={viewedDateRange}
              setDateRange={({ from }) =>
                setSelectedDate(from ? from : new Date(Date.now()))
              }
            >
              W/o {format(selectedDate || new Date(Date.now()), 'MMM d yyyy')}
              <ChevronDown />
            </WeekPicker>
          )}
        </div>

        <nav className="flex p-0.5 bg-input/30 rounded-lg gap-1">
          {(['day', 'week', 'month'] as View[]).map((str) => (
            <Button
              key={str}
              size="sm"
              variant={view === str ? 'outline' : 'ghost'}
              className={cn(
                'p-1.5 font-bold rounded-lg',
                view === str ? '' : 'text-muted-foreground border-transparent',
              )}
              onClick={() => setView(str)}
            >
              {str[0].toUpperCase() + str.slice(1)}
            </Button>
          ))}
        </nav>
        {view !== 'day' && (
          <div className="flex gap-2">
            <Checkbox
              checked={showWeekend}
              onCheckedChange={setShowWeekend}
              id="weekends-checkbox"
              name="weekends-checkbox"
            />
            <Label className="mt-0.5" htmlFor="weekends-checkbox">
              Weekends
            </Label>
          </div>
        )}
        <Multiselect
          triggerLabel="Users"
          options={(users ?? []).map(({ firstName, lastName, id }) => ({
            id,
            label: firstName + ' ' + lastName,
          }))}
          heading="Users"
          placeholder={`Find a user's calendar`}
          value={selectedUsers}
          setValue={setSelectedUsers}
        />
      </div>
      <div className="flex h-full w-full overflow-y-hidden">
        <div className="flex flex-col w-full max-h-[calc(100dvh-8rem)]">
          <DayPlanner
            className={cn(view !== 'day' && 'hidden')}
            plans={plans}
            appointmentContent={AppointmentContent}
          />
          <WeekPlanner
            dateRange={viewedDateRange}
            className={cn(view !== 'week' && 'hidden')}
            setDateRange={(range) => {
              setSelectedDate(
                nextDay(startOfWeek(range.from || new Date(Date.now())), 1),
              )
            }}
            plans={plans}
            appointmentContent={AppointmentContent}
          />
          <MonthPlanner
            className={cn(view !== 'month' && 'hidden')}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            showWeekend={showWeekend}
          />
        </div>
      </div>
    </>
  )
}
