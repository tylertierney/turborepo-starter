import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm'
import {
  AddressEntity,
  mockAddressEntity,
} from '../addresses/address.entity.js'
import { PracticeEntity } from '../practices/practice.entity.js'
import { UserEntity } from '../users/user.entity.js'
import { mockClinic } from '@repo/models'
import { ClinicRoomEntity } from '../clinic-room/clinic-room.entity.js'

@Entity({ name: 'clinics' })
export class ClinicEntity {
  constructor(partial: Partial<ClinicEntity> = {}) {
    Object.assign(this, partial)
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name: string = ''

  @ManyToOne(() => PracticeEntity, {
    nullable: false,
  })
  practice!: PracticeEntity

  @ManyToOne(() => AddressEntity, { cascade: true })
  address!: AddressEntity

  @Column()
  image?: string

  @ManyToMany(() => UserEntity, user => user.clinics, { cascade: true })
  @JoinTable({
    name: 'users_clinics',
    joinColumn: {
      name: 'clinic_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users!: UserEntity[]

  @OneToMany(() => ClinicRoomEntity, clinicRoom => clinicRoom.clinic, {
    cascade: true,
  })
  rooms!: Relation<ClinicRoomEntity[]>
}

export const mockClinicEntity = (
  partial: Partial<ClinicEntity> = {},
): ClinicEntity => {
  const temp = mockClinic()

  // return {
  //   ...temp,
  //   practice: {
  //     ...mockPractice(),
  //     users: [],
  //     createdAt: new Date(),
  //   },
  //   users: [],
  //   ...partial,
  // }

  return new ClinicEntity({
    name: temp.name,
    image: temp.image,
    address: mockAddressEntity(),
    users: [],
    rooms: [],
    ...partial,
  })
}
