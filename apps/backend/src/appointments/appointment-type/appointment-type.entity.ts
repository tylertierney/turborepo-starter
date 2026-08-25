import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { PracticeEntity } from '../../practices/practice.entity.js'
import {
  type AppointmentColor,
  appointmentColors,
  mockAppointmentColor,
  mockAppointmentType,
} from '@repo/models'
import { randSentence } from '@ngneat/falso'

@Entity({ name: 'appointment_types' })
export class AppointmentTypeEntity {
  constructor(partial: Partial<AppointmentTypeEntity> = {}) {
    Object.assign(this, partial)
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid' })
  @JoinColumn({ name: 'practiceId' })
  practiceId!: string

  @ManyToOne(() => PracticeEntity, {
    nullable: false,
  })
  practice!: PracticeEntity

  @Column()
  name: string = ''

  @Column({
    type: 'simple-enum',
    enum: appointmentColors,
    default: 'blue' satisfies AppointmentColor,
  })
  color!: AppointmentColor
}

export const mockAppointmentTypeEntity = (
  partial: Partial<AppointmentTypeEntity>,
): AppointmentTypeEntity => {
  return new AppointmentTypeEntity({
    name: mockAppointmentType(),
    color: mockAppointmentColor(),
    ...partial,
  })
}
