import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm'
import { ClinicEntity } from '../clinics/clinic.entity.js'

@Entity({ name: 'clinic_rooms' })
export class ClinicRoomEntity {
  constructor(partial: Partial<ClinicRoomEntity> = {}) {
    Object.assign(this, partial)
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid' })
  clinicId!: string

  @ManyToOne(() => ClinicEntity, clinic => clinic.rooms, {
    nullable: false,
  })
  clinic!: Relation<ClinicEntity>

  @Column()
  name: string = ''
}

export const mockClinicRoomName = (): string => {
  const prefix = ['Room', 'Lane'][~~(Math.random() * 2)]
  const suffix = Array(10)
    .fill(null)
    .map((_, idx) => {
      if (Math.random() < 0.5) return String.fromCharCode(65 + idx)

      return idx
    })[~~(Math.random() * 10)]

  return prefix + ' ' + suffix
}

// export const mockClinicRoomEntity = (
//   partial: Partial<ClinicRoomEntity>,
// ): ClinicRoomEntity => {
//   return new ClinicRoomEntity({
//     name: mockClinicRoomName(),
//     ...partial,
//   })
// }
