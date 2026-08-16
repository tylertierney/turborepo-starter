import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import {
  AddressEntity,
  mockAddressEntity,
} from '../addresses/address.entity.js'
import { randUuid } from '@ngneat/falso'
import { PracticeEntity } from '../practices/practice.entity.js'

@Entity({ name: 'clinics' })
export class ClinicEntity {
  constructor(partial: Partial<ClinicEntity> = {}) {
    Object.assign(this, partial)
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name: string = ''

  @ManyToOne(() => PracticeEntity, practice => practice.id)
  practiceId!: string

  @ManyToOne(() => AddressEntity, { cascade: true })
  address!: AddressEntity
}

export const mockClinicEntity = (
  partial: Partial<ClinicEntity> = {},
): ClinicEntity => {
  const address = mockAddressEntity()
  const temp: ClinicEntity = {
    id: randUuid(),
    name: address.street1.replace(/\d/g, ''),
    address,
    practiceId: randUuid(),
  }

  return {
    ...temp,
    ...partial,
  }
}
