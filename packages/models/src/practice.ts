import {
  randCity,
  randDirection,
  randLastName,
  randPastDate,
  randState,
  randUrl,
  randUuid,
} from '@ngneat/falso'
import { User } from './user.js'

export const randPracticeName = () => {
  const getPrefix = () => {
    const opts = [randCity(), randDirection(), randState(), randLastName()]
    return opts[~~(Math.random() * opts.length)]
  }

  const getSuffix = () => {
    const opts = [
      'Eye Care',
      'Optometry',
      'Eye Specialists',
      'Eye',
      'Eye Center',
      'Optical',
      'Eye Institute',
    ]
    return opts[~~(Math.random() * opts.length)]
  }

  return getPrefix() + ' ' + getSuffix()
}

export type Practice = {
  id: string
  name: string
  image: string
  url: string
  createdAt: Date | string
  active: boolean
  users: User[]
}

export const mockPractice = (partial: Partial<Practice> = {}): Practice => ({
  id: randUuid(),
  name: randPracticeName(),
  image: `https://picsum.photos/seed/${randUuid()}/60/60`,
  url: randUrl(),
  active: true,
  createdAt: randPastDate(),
  users: [],
  ...partial,
})
