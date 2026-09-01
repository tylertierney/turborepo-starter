import { randFirstName, randPastDate, randUser } from '@ngneat/falso'
import { randSex, type Sex, sexes } from '@repo/models'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { AddressEntity } from '../addresses/address.entity.js'
import { PracticeEntity } from '../practices/practice.entity.js'

@Entity({ name: 'patients' })
export class PatientEntity {
  constructor(partial: Partial<PatientEntity>) {
    Object.assign(this, partial)
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  firstName: string = ''

  @Column({ type: 'varchar', nullable: true })
  middleName: string | null = null

  @Column()
  lastName: string = ''

  @Column({ type: 'varchar', nullable: true })
  email: string | null = null

  @Column({ type: 'varchar', nullable: true })
  phone: string | null = null

  @Column({ type: 'varchar', nullable: true })
  preferredName: string | null = null

  @Column({
    type: 'simple-enum',
    enum: sexes,
    nullable: true,
  })
  sex: Sex | null = null

  @Column({ type: 'varchar', nullable: true })
  genderIdentity: string | null = null

  @Column({ type: 'date' })
  dateOfBirth!: Date

  @Column({ type: 'timestamptz', nullable: true })
  deceasedAt: Date | null = null

  @Column({ type: 'varchar', nullable: true })
  preferredLanguage: string | null = null

  @ManyToOne(() => AddressEntity, { cascade: true, nullable: true })
  address: AddressEntity | null = null

  @Column()
  @JoinColumn()
  practiceId!: string

  @ManyToOne(() => PracticeEntity)
  practice!: PracticeEntity

  @CreateDateColumn()
  createdAt: Date = new Date()
}

export const mockPatientEntity = (
  partial: Partial<PatientEntity> = {},
): PatientEntity => {
  const u = randUser()

  const res = new PatientEntity({
    firstName: u.firstName,
    middleName: randFirstName(),
    lastName: u.lastName,
    preferredName: Math.random() < 0.06 ? randFirstName() : '',
    sex: randSex(),
    dateOfBirth: randPastDate({ years: 21 }),
    ...partial,
  })

  return res
}
