import { randPassword, randUser } from '@ngneat/falso'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class UserEntity {
  constructor(partial: Partial<UserEntity> = {}) {
    Object.assign(this, partial)
  }

  @PrimaryGeneratedColumn('uuid')
  id: string = ''

  @Column()
  firstName: string = ''

  @Column()
  lastName: string = ''

  @Column({ unique: true })
  email: string = ''

  @Column()
  password: string = ''

  @CreateDateColumn()
  createdAt: Date = new Date()
}

export const mockUser = (partial: Partial<UserEntity> = {}): UserEntity => {
  const temp = { ...randUser(), password: randPassword() }

  const res = new UserEntity()

  Object.assign(res, temp)
  Object.assign(res, partial)
  return res
}
