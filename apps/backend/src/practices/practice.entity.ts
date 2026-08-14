import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { UserEntity } from '../users/user.entity'
import { mockPractice } from '@repo/models'

@Entity()
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

  @CreateDateColumn()
  createdAt: Date = new Date()

  @Column()
  active: boolean = true

  @ManyToMany(() => UserEntity, user => user.practices, { cascade: true })
  @JoinTable({
    name: 'user_practices',
    joinColumn: {
      name: 'practice_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users!: UserEntity[]
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
