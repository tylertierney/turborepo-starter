import { randPassword, randPastDate, randUser } from '@ngneat/falso'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { PracticeEntity } from '../practices/practice.entity'

@Entity()
export class UserEntity {
  constructor(partial: Partial<UserEntity> = {}) {
    Object.assign(this, partial)
  }
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  firstName: string = ''

  @Column()
  lastName: string = ''

  @Column({ unique: true })
  email: string = ''

  @Column()
  password!: string

  @CreateDateColumn()
  createdAt: Date = new Date()

  @Column()
  active: boolean = true

  @ManyToMany(() => PracticeEntity, practice => practice.users)
  practices!: PracticeEntity[]
}

export const mockUserEntity = (
  partial: Partial<UserEntity> = {},
): UserEntity => {
  const temp = {
    ...randUser(),
    password: randPassword(),
    active: true,
    createdAt: randPastDate(),
  }

  const res = new UserEntity()

  Object.assign(res, temp)
  Object.assign(res, partial)
  return res
}
