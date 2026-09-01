import { AppointmentStatus } from '@repo/models'
import { Badge, Button, cn, DayPlannerAppointment } from '@repo/ui'
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  CircleCheckBig,
  ClockIcon,
  MapPin,
  XIcon,
} from 'lucide-react'
import { ComponentProps, ReactNode, useState } from 'react'
import { snakeCaseToReadable } from '../../utils/utils'
import { differenceInYears, format } from 'date-fns'
import { Link } from 'react-router'

const Datapoint = ({
  label = '',
  value = '',
  className = '',
  ...rest
}: { label: string; value: string | ReactNode } & ComponentProps<'div'>) => {
  return (
    <div className={cn('flex flex-col gap-0.5', className)} {...rest}>
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      {typeof value === 'string' ? <span>{value}</span> : value}
    </div>
  )
}

export const getIconFromApptStatus = (status: AppointmentStatus): ReactNode => {
  switch (status) {
    case 'scheduled':
      return <ClockIcon />
    case 'confirmed':
      return <ClockIcon className="text-green-700 dark:text-green-200" />
    case 'checked_in':
      return <Check />
    case 'in_progress':
      return <Circle className="text-orange-400 fill-orange-400" />
    case 'completed':
      return <CircleCheckBig className="text-green-700 dark:text-green-200" />
    case 'cancelled':
      return <XIcon className="text-red-700 dark:text-red-400" />
    default:
      return null
  }
}

export const AppointmentDialog = (appt: DayPlannerAppointment) => {
  const {
    primaryProvider,
    status,
    room,
    type,
    patient,
    startsAt,
    endsAt,
    clinic,
  } = appt

  const [patientInfoExpanded, setPatientInfoExpanded] = useState(false)

  const dob = new Date(patient.dateOfBirth)
  const age = differenceInYears(new Date(), dob)
  const dobValue =
    dob.toLocaleDateString('en-us', {
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    }) + ` (age ${age})`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <Datapoint
          label="Time"
          value={format(startsAt, 'h:mm a') + ' - ' + format(endsAt, 'h:mm a')}
        />
        <div className="flex items-center gap-2">
          <Badge className="rounded-sm" variant="secondary">
            {getIconFromApptStatus(status)}
            {snakeCaseToReadable(status)}
          </Badge>
          {room && (
            <Badge variant="outline" className={cn('border rounded-sm px-1')}>
              {room.name}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between">
        <Datapoint
          label="Provider"
          value={
            <b>
              {primaryProvider.firstName} {primaryProvider.lastName}
            </b>
          }
        />

        {clinic && (
          <Datapoint
            label="Location"
            value={
              <span className="flex items-center gap-1">
                <MapPin size="16" />
                <span>{clinic?.name || 'N/A'}</span>
              </span>
            }
          />
        )}
      </div>
      <Datapoint
        label="Appointment Type"
        value={
          <span className="flex items-center gap-2">
            <Circle
              className={`size-4 fill-${type.color}-500 stroke-${type.color}-700`}
            />
            {type.name}
          </span>
        }
      />

      <div className="flex flex-col border rounded">
        <div className="flex flex-col p-2 gap-3">
          <div className="flex justify-between">
            <Datapoint
              label="Patient"
              value={
                <Link
                  to={`patients/${patient.id}`}
                  className="flex items-center gap-1"
                >
                  <span className="border-b">
                    <b>{patient.preferredName || patient.firstName}</b>{' '}
                    <b>{patient.lastName}</b>
                  </span>
                  <ArrowUpRight className="size-4 mb-1" />
                </Link>
              }
            />
            <Datapoint label="Sex" value={patient.sex} />
            <Datapoint label="DOB" value={dobValue} />
          </div>
          {patientInfoExpanded && (
            <>
              <Datapoint
                label="Phone"
                value={<a href={`tel:${patient.phone}`}>{patient.phone}</a>}
              />
              <Datapoint
                label="Email"
                value={<a href={`mailto:${patient.email}`}>{patient.email}</a>}
              />
              {patient.address && (
                <Datapoint
                  label="Address"
                  value={
                    <div className="flex flex-col">
                      <span>{patient.address?.street1}</span>
                    </div>
                  }
                />
              )}
            </>
          )}
        </div>
        <Button
          variant="link"
          className="text-link decoration-0"
          onClick={() => setPatientInfoExpanded((prev) => !prev)}
        >
          View {patientInfoExpanded ? 'Less' : 'More'}{' '}
          {patientInfoExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
    </div>
  )
}
