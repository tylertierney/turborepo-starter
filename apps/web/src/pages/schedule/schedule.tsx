import styles from './schedule.module.scss'
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
import { Appointment, appointmentStatuses, User } from '@repo/models'
import { useTheme } from '../../context/ThemeProvider'
import {
  addDays,
  eachDayOfInterval,
  endOfDay,
  endOfWeek,
  format,
  isSameDay,
  nextDay,
  previousDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api'
import { AppointmentContent } from './appointment-content'
import { AppointmentDialog } from './appointment-dialog'
import { snakeCaseToReadable } from '../../utils/utils'

type View = 'day' | 'week' | 'month'

type ScheduleFilter = {
  users: string[]
  appointmentTypes: string[]
  statuses: string[]
}

export const Schedule = () => {
  const today = new Date(Date.now())

  const [showWeekend, setShowWeekend] = useStateWithLocalStorage(
    'calendar-show-weekend',
    false,
  )

  const [selectedDate, setSelectedDate] = useState(today)
  const [view, setView] = useStateWithLocalStorage<View>('calendar-view', 'day')

  const [filters, setFilters] = useStateWithLocalStorage<ScheduleFilter>(
    'schedule-filters',
    {
      users: [],
      appointmentTypes: [],
      statuses: [],
    },
  )

  const {
    users: selectedUsers,
    appointmentTypes: selectedAppointmentTypes,
    statuses: selectedStatuses,
  } = filters

  // const [selectedUsers, setSelectedUsers] = useStateWithLocalStorage<string[]>(
  //   'selected-user-calendars',
  //   [],
  // )

  const startOfVisibleMonthRange = startOfWeek(startOfMonth(selectedDate), {
    weekStartsOn: showWeekend ? 0 : 1,
  })

  let selectedDateRange: { from: Date; to: Date }

  if (view === 'week' || view === 'day') {
    selectedDateRange = {
      from: startOfWeek(selectedDate),
      to: endOfWeek(selectedDate),
    }
  } else {
    selectedDateRange = {
      from: startOfVisibleMonthRange,
      to: addDays(startOfVisibleMonthRange, 42),
    }
  }

  let viewedDateRange = selectedDateRange
  if (view === 'week') {
    if (!showWeekend) {
      viewedDateRange = {
        from: nextDay(selectedDateRange.from, 1),
        to: previousDay(selectedDateRange.to, 5),
      }
    }
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

  const { data: appointmentTypes } = useQuery({
    queryKey: ['appointment-types-for-appointments-filtering'],
    queryFn: async () => {
      const { data } = await api.get('api/appointment-types')

      return (Array.isArray(data) ? data : []) as Array<{
        name: string
        color: string
        id: string
      }>
    },
  })

  const { data: appointments, isFetching } = useQuery({
    queryKey: [
      `appointments`,
      selectedDate.toISOString(),
      selectedDateRange.from.toISOString(),
      selectedDateRange.to.toISOString(),
      filters,
      showWeekend,
    ],
    queryFn: async () => {
      const query = new URLSearchParams()

      if (view === 'day') {
        query.set('startsAt', startOfDay(selectedDate).toISOString())
        query.set('endsAt', endOfDay(selectedDate).toISOString())
      } else if (view === 'week') {
        query.set('startsAt', viewedDateRange.from.toISOString())
        query.set('endsAt', viewedDateRange.to.toISOString())
      } else {
        query.set('startsAt', selectedDateRange.from.toISOString())
        query.set('endsAt', selectedDateRange.to.toISOString())
      }

      if (filters.users.length) {
        query.set('users', filters.users.join(','))
      }

      if (filters.appointmentTypes.length) {
        query.set('types', filters.appointmentTypes.join(','))
      }

      if (filters.statuses.length) {
        query.set('statuses', filters.statuses.join(','))
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
        <div
          className={cn(
            'flex items-center gap-2 text-sm',
            view === 'day' && 'min-w-55 justify-between',
          )}
        >
          {view === 'day' && (
            <Button
              variant="outline"
              size="icon-xs"

              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            >
              <ChevronLeft />
            </Button>
          )}
          <div className="flex items-center gap-2">
            {currentDay && (
              <PingingDot
                className="text-blue-400 self-center"
                style={{ width: '16px' }}
              />
            )}
            <b>{format(date, 'EEEE')}</b>{' '}
            <span className="text-muted-foreground text-xs text-nowrap mt-0.5">
              {format(date, 'MMM d')}
            </span>
          </div>
          {view === 'day' && (
            <Button
              variant="outline"
              size="icon-xs"

              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            >
              <ChevronRight />
            </Button>
          )}
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
      <div
        className={cn(
          'flex items-center w-full h-14 px-4 gap-4 overflow-x-auto',
          styles.schedule,
          isFetching && styles.isFetching,
        )}
      >
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
          setValue={(cb) => {
            if (typeof cb === 'function') {
              const users = cb(selectedUsers)
              setFilters((prev) => ({ ...prev, users }))
            } else {
              const users = cb
              setFilters((prev) => ({ ...prev, users }))
            }
          }}
        />
        <Multiselect
          triggerLabel="Type"
          options={(appointmentTypes ?? []).map(({ name, id }) => ({
            id,
            label: name,
          }))}
          heading="Appointment Type"
          placeholder={`Filter appointment types`}
          value={selectedAppointmentTypes}
          setValue={(cb) => {
            if (typeof cb === 'function') {
              const types = cb(selectedAppointmentTypes)
              setFilters((prev) => ({ ...prev, appointmentTypes: types }))
            } else {
              const types = cb
              setFilters((prev) => ({ ...prev, appointmentTypes: types }))
            }
          }}
        />
        {/* <Multiselect
          triggerLabel="Status"
          options={(appointmentStatuses ?? []).map((status, idx) => ({
            id: String(idx),
            label: snakeCaseToReadable(status),
          }))}
          heading="Appointment Status"
          placeholder={`Filter by status`}
          value={selectedStatuses.map((s) =>
            String(appointmentStatuses.findIndex((v) => v === s) as number),
          )}
          setValue={(cb) => {
            if (typeof cb === 'function') {
              const statuses = cb(selectedStatuses)
              setFilters((prev) => ({
                ...prev,
                statuses: statuses.map(
                  (id) => appointmentStatuses[parseInt(id, 10)] as string,
                ),
              }))
            } else {
              const statuses = cb
              setFilters((prev) => ({
                ...prev,
                statuses: statuses.map(
                  (id) => appointmentStatuses[parseInt(id, 10)] as string,
                ),
              }))
            }
          }}
        /> */}
      </div>
      <div className="flex h-full w-full overflow-y-hidden">
        <div
          className="flex flex-col w-full max-h-[calc(100dvh-8rem)]"
          // style={{ marginTop: '-4px', paddingTop: '4px' }}
        >
          <DayPlanner
            className={cn(view !== 'day' && 'hidden')}
            plans={plans}
            appointmentContent={AppointmentContent}
            appointmentDialog={AppointmentDialog}
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
            appointmentDialog={AppointmentDialog}
          />
          <MonthPlanner
            className={cn(view !== 'month' && 'hidden')}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            showWeekend={showWeekend}
            plans={plans}
            onDayClick={(d) => {
              setSelectedDate(d)
              setView('day')
            }}
          />
        </div>
      </div>
    </>
  )
}
