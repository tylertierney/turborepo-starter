import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { AppointmentTypeEntity } from './appointment-type/appointment-type.entity.js'
import { PracticeEntity } from '../practices/practice.entity.js'
import { ClinicEntity } from '../clinics/clinic.entity.js'
import { UserEntity } from '../users/user.entity.js'
import { ClinicRoomEntity } from '../clinic-room/clinic-room.entity.js'
import { type AppointmentStatus, appointmentStatuses } from '@repo/models'
import { PatientEntity } from '../patients/patient.entity.js'

@Entity({ name: 'appointments' })
export class AppointmentEntity {
  constructor(partial: Partial<AppointmentEntity> = {}) {
    Object.assign(this, partial)
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => AppointmentTypeEntity, { nullable: false })
  type!: AppointmentTypeEntity

  @ManyToOne(() => ClinicRoomEntity)
  room?: ClinicRoomEntity

  @Column()
  name: string = ''

  @Column()
  description: string = ''

  @Column({ type: 'timestamptz' })
  startsAt!: Date

  @Column({ type: 'timestamptz' })
  endsAt!: Date

  @Column({ type: 'uuid' })
  @JoinColumn({ name: 'practiceId' })
  practiceId!: string

  @ManyToOne(() => PracticeEntity, {
    nullable: false,
  })
  practice!: PracticeEntity

  @Column({ type: 'uuid' })
  @JoinColumn({ name: 'clinicId' })
  clinicId!: string

  @ManyToOne(() => ClinicEntity, {
    nullable: false,
  })
  clinic!: ClinicEntity

  @ManyToOne(() => UserEntity, {
    nullable: false,
  })
  primaryProvider!: UserEntity

  @Column({
    type: 'simple-enum',
    enum: appointmentStatuses,
    default: 'scheduled',
  })
  status!: AppointmentStatus

  @ManyToOne(() => PatientEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  patient!: PatientEntity
}
