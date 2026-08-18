import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import {
  AddressEntity,
  mockAddressEntity,
} from '../addresses/address.entity.js'
import { PracticeEntity } from '../practices/practice.entity.js'
import { UserEntity } from '../users/user.entity.js'
import { mockClinic, mockPractice } from '@repo/models'

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
    ...partial,
  })
}
