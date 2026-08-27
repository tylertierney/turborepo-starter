import styles from './appointment-content.module.scss'
import { Appointment } from '@repo/models'
import { cn } from '@repo/ui'

export const AppointmentContent = (appt: Appointment) => {
  return (
    <ul className="text-nowrap">
      <li
        className={cn('flex justify-between items-center flex-wrap', styles.li)}
      >
        <span className={styles.span}>
          {appt.primaryProvider.firstName.slice(0, 1) +
            '. ' +
            appt.primaryProvider.lastName}
        </span>
        {appt.room && (
          <span
            className={cn('border rounded-sm px-1 text-[10px]', styles.span)}
            style={{ lineHeight: 1.75 }}
          >
            {appt.room.name}
          </span>
        )}
      </li>
      <li className={styles.li}>{appt.type.name}</li>
    </ul>
  )
}
