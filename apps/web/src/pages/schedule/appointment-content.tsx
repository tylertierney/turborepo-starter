import styles from './appointment-content.module.scss'
import { Badge, cn, DayPlannerAppointment } from '@repo/ui'
import { getIconFromApptStatus } from './appointment-dialog'
import { snakeCaseToReadable } from '../../utils/utils'

export const AppointmentContent = (appt: DayPlannerAppointment) => {
  const { primaryProvider, status, room, type } = appt
  return (
    <ul
      className="text-nowrap"
      style={{
        maxWidth: '1000px',
      }}
    >
      <li
        className={cn('flex justify-between items-center flex-wrap', styles.li)}
      >
        <span className={styles.span}>
          {primaryProvider.firstName.slice(0, 1) +
            '. ' +
            primaryProvider.lastName}
        </span>
        <div className="flex items-center flex-wrap">
          <Badge className="text-[10px] px-1 rounded-sm" variant="outline">
            {getIconFromApptStatus(status)}
            {snakeCaseToReadable(status)}
          </Badge>
          {room && (
            <span
              className={cn('border rounded-sm px-1 text-[10px]', styles.span)}
              style={{ lineHeight: 1.75 }}
            >
              {room.name}
            </span>
          )}
        </div>
      </li>
      <li className={styles.li}>{type?.name}</li>
    </ul>
  )
}
