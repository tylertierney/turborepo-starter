import { randUuid } from '@ngneat/falso'
import { Address, mockAddress } from './address.js'

export type Clinic = {
  id: string
  name: string
  practiceId: string
  address: Address
  image?: string
  users?: []
}

export const mockClinic = (partial: Partial<Clinic> = {}): Clinic => {
  const address = mockAddress()

  return {
    id: randUuid(),
    name: address.street1.replace(/\d/g, ''),
    address,
    practiceId: randUuid(),
    image: `https://picsum.photos/seed/${randUuid()}/60/60`,
    ...partial,
  }
}
