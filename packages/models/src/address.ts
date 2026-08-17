import { randAddress, randNumber, randState, randUuid } from '@ngneat/falso'

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

export type Address = {
  id: string
  street1: string
  street2?: string
  city: string
  state: string
  postalCode: string
}

export const mockAddress = (partial: Partial<Address> = {}): Address => {
  const random = randAddress()
  return {
    id: randUuid(),
    street1: random.street,
    street2: randStreet2(),
    city: random.city,
    state: randState(),
    postalCode: random.zipCode,
    ...partial,
  }
}
