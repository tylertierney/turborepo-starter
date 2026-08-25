import { minutesToMilliseconds } from 'date-fns'
import { randFutureDate, randParagraph, randUuid } from '@ngneat/falso'
import { mockUser, User } from './user.js'

export type AppointmentColor =
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'taupe'
  | 'mauve'
  | 'mist'
  | 'olive'

export const appointmentColors: AppointmentColor[] = [
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'taupe',
  'mauve',
  'mist',
  'olive',
]

export const mockAppointmentColor = () =>
  appointmentColors[~~(Math.random() * appointmentColors.length)]

export const appointmentTypes = [
  'Comprehensive Exam',
  'Contact Lens Exam',
  'Follow-up',
  'Medical Eye Exam',
  'Urgent',
  'Optical',
]

export const mockAppointmentType = () =>
  appointmentTypes[~~(Math.random() * appointmentTypes.length)]

export type AppointmentType = (typeof appointmentTypes)[number]

export const appointmentStatuses = [
  'scheduled',
  'confirmed',
  'checked_in',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
]

export const mockAppointmentStatus = () =>
  appointmentStatuses[~~(Math.random() * appointmentStatuses.length)]

export type AppointmentStatus = (typeof appointmentStatuses)[number]

export type Appointment = {
  startsAt: Date
  endsAt: Date
  type: {
    name: string
    color: AppointmentColor
  }
  status: AppointmentStatus
  practiceId: string
  clinicId: string
  primaryProvider: User
  notes?: string
}

export const mockAppointment = (partial: Partial<Appointment>): Appointment => {
  const end = randFutureDate().getTime()
  const duration = ~~(
    Math.random() *
    Math.abs(minutesToMilliseconds(360) - minutesToMilliseconds(30))
  )
  const start = end - duration

  return {
    startsAt: new Date(start),
    endsAt: new Date(end),
    type: {
      name: mockAppointmentType(),
      color: mockAppointmentColor(),
    },
    status: mockAppointmentStatus(),
    practiceId: randUuid(),
    clinicId: randUuid(),
    notes: randParagraph(),
    primaryProvider: mockUser(),
    ...partial,
  }
}
