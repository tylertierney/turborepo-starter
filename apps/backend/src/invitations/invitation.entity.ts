import { mockUser, userRoles, type UserRole } from '@repo/models'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { PracticeEntity } from '../practices/practice.entity.js'

@Entity({ name: 'invitations' })
export class InvitationEntity {
  constructor(partial: Partial<InvitationEntity> = {}) {
    Object.assign(this, partial)
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  firstName: string = ''

  @Column()
  lastName: string = ''

  @Column()
  email: string = ''

  @Column({
    type: 'simple-enum',
    enum: ['staff', 'provider', 'admin', 'owner'],
    default: 'staff',
  })
  role!: UserRole

  @Column({ type: 'uuid' })
  practiceId!: string

  @ManyToOne(() => PracticeEntity, { nullable: false, onDelete: 'CASCADE' })
  practice!: PracticeEntity

  @Column({ type: 'timestamp', nullable: true })
  consumedAt!: Date | null

  @Column({ type: 'timestamp', nullable: true })
  expiresAt!: Date

  @BeforeInsert()
  setExpirationDate() {
    const future = new Date()
    future.setDate(future.getDate() + 7)
    this.expiresAt = future
  }

  @CreateDateColumn()
  createdAt!: Date
}

export const mockInvitationEntity = (
  partial: Partial<InvitationEntity> = {},
): InvitationEntity => {
  const u = mockUser()

  return new InvitationEntity({
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    role: userRoles[~~(Math.random() * userRoles.length)],
    ...partial,
  })
}
