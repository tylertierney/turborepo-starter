import { randFirstName, randPastDate, randUser } from '@ngneat/falso'
import { randSex, type Sex, sexes } from '@repo/models'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'patients' })
export class PatientEntity {
  constructor(partial: Partial<PatientEntity>) {
    Object.assign(this, partial)
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  firstName: string = ''

  @Column({ nullable: true })
  middleName: string = ''

  @Column()
  lastName: string = ''

  @Column()
  preferredName: string = ''

  @Column({
    type: 'simple-enum',
    enum: sexes,
    default: 'F',
    nullable: false,
  })
  sex!: Sex

  @Column()
  dateOfBirth!: Date
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
