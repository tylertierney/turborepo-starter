import { mockAddress } from '@repo/models'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'addresses' })
export class AddressEntity {
  constructor(partial: Partial<AddressEntity> = {}) {
    Object.assign(this, partial)
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  street1: string = ''

  @Column({ nullable: true })
  street2?: string

  @Column()
  city: string = ''

  @Column()
  state: string = ''

  @Column()
  postalCode: string = ''
}

export const mockAddressEntity = (
  partial: Partial<AddressEntity> = {},
): AddressEntity => {
  const temp = mockAddress()
  // return {
  //   ...temp,
  //   ...partial,
  //   id: undefined,
  // }

  return new AddressEntity({
    street1: temp.street1,
    street2: temp.street2,
    city: temp.city,
    state: temp.state,
    postalCode: temp.postalCode,
    ...partial,
  })
}
