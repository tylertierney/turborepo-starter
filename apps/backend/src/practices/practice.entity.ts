import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { UserEntity } from '../users/user.entity.js'
import { mockPractice } from '@repo/models'

@Entity({ name: 'practices' })
export class PracticeEntity {
  constructor(partial: Partial<PracticeEntity> = {}) {
    Object.assign(this, partial)
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name: string = ''

  @Column()
  image!: string

  @Column()
  url!: string

  @CreateDateColumn()
  createdAt: Date = new Date()

  @Column()
  active: boolean = true

  @OneToMany(() => UserEntity, user => user.practice)
  users!: UserEntity[]

  // @OneToMany(() => ClinicEntity, clinic => clinic.practice)
  // clinics!: ClinicEntity[]

  // @ManyToMany(() => ClinicEntity, clinic => clinic.practiceId)
  // clinics!: ClinicEntity[]
}

export const mockPracticeEntity = (
  partial: Partial<PracticeEntity> = {},
): PracticeEntity => {
  const temp = {
    ...mockPractice(),
    active: true,
  }

  const res = new PracticeEntity()

  Object.assign(res, temp)
  Object.assign(res, partial)
  return res
}
