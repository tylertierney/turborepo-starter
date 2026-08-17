import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { AddressEntity } from '../addresses/address.entity.js'
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

  // @Column({ name: 'practiceId' })
  // practiceId!: string

  // @ManyToOne(() => PracticeEntity, practice => practice.clinics)
  // @JoinColumn()
  // practice!: PracticeEntity

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
  // const address = mockAddressEntity()
  // const temp: ClinicEntity = {
  //   users: [],
  //   id: randUuid(),
  //   name: address.street1.replace(/\d/g, ''),
  //   address,
  //   practiceId: randUuid(),
  //   image: `https://picsum.photos/seed/${randUuid()}/60/60`,
  // }
  const temp = mockClinic()

  return {
    ...temp,
    practice: {
      ...mockPractice(),
      users: [],
      createdAt: new Date(),
    },
    users: [],
    ...partial,
  }
}
