import {
  randEmail,
  randFirstName,
  randLastName,
  randPassword,
  randPastDate,
  randUuid,
} from '@ngneat/falso'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  createdAt: Date | string
}

export const mockUser = (partial: Partial<User> = {}): User => ({
  id: randUuid(),
  firstName: randFirstName(),
  lastName: randLastName(),
  email: randEmail(),
  password: randPassword(),
  createdAt: randPastDate(),
  ...partial,
})
