import { Appointment } from '@repo/models'

export const AppointmentContent = (appt: Appointment) => {
  return (
    <ul>
      <li>
        {appt.primaryProvider.firstName.slice(0, 1) +
          '. ' +
          appt.primaryProvider.lastName}
      </li>
      <li>{appt.type.name}</li>
      {/* {appt.} */}
    </ul>
  )
}
