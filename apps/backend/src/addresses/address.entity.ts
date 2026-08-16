import { randAddress, randNumber, randState, randUuid } from '@ngneat/falso'
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

const randStreet2 = () => {
  if (Math.random() < 0.15) {
    const opts = ['Apt', 'Unit', 'Suite', 'Ste']
    return (
      opts[~~(Math.random() * opts.length)] +
      ' ' +
      randNumber({ min: 1, max: 999 })
    )
  }

  return ''
}

export const mockAddressEntity = (
  partial: Partial<AddressEntity> = {},
): AddressEntity => {
  const random = randAddress()

  const temp: AddressEntity = {
    id: randUuid(),
    street1: random.street,
    street2: randStreet2(),
    city: random.city,
    state: randState(),
    postalCode: random.zipCode,
  }
  return {
    ...temp,
    ...partial,
  }
}

// const randState = () => {
//   const states = [
//     'Alabama',
//     'Alaska',
//     'Arizona',
//     'Arkansas',
//     'Colorado',
//     'Connecticut',
//     'Delaware',
//     'Florida',
//     'Georgia',
//     'Hawaii',
//     'Idaho',
//     'Illinois',
//     'Indiana',
//     "Iowa"
//   ]

//   return states[~~Math.random() * states.length]
// }
