import { randPastDate } from '@ngneat/falso'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm'
import { PracticeEntity } from '../practices/practice.entity.js'
import { mockUser, type UserRole } from '@repo/models'
import { ClinicEntity } from '../clinics/clinic.entity.js'

@Entity({ name: 'users' })
export class UserEntity {
  constructor(partial: Partial<UserEntity> = {}) {
    Object.assign(this, partial)
  }

  @PrimaryColumn()
  id!: string

  @Column()
  firstName: string = ''

  @Column()
  lastName: string = ''

  @Column({ unique: true })
  email: string = ''

  @Column({ nullable: true })
  phone!: string

  @Column({ nullable: true })
  image?: string

  @CreateDateColumn()
  createdAt: Date = new Date()

  @Column({ default: true })
  active: boolean = true

  @Column({
    type: 'simple-enum',
    enum: ['staff', 'provider', 'admin', 'owner'],
    default: 'staff',
  })
  role!: UserRole

  @ManyToMany(() => PracticeEntity, practice => practice.users)
  practices!: PracticeEntity[]

  @ManyToMany(() => ClinicEntity, clinic => clinic.users)
  clinics!: ClinicEntity[]
}

export const mockUserEntity = (
  partial: Partial<UserEntity> = {},
): UserEntity => {
  const temp = {
    ...mockUser(),
    createdAt: randPastDate(),
  }

  const res = new UserEntity()

  Object.assign(res, temp)
  Object.assign(res, partial)
  return res
}
