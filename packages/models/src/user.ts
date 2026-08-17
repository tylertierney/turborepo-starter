import {
  randEmail,
  randFirstName,
  randLastName,
  randNumber,
  randPassword,
  randPastDate,
  randUuid,
} from '@ngneat/falso'

export type UserRole = 'staff' | 'provider' | 'admin' | 'owner'

export type User = {
  id: string
  userNumber: number
  firstName: string
  lastName: string
  email: string
  password: string
  createdAt: Date | string
  role: UserRole
}

export const mockUser = (partial: Partial<User> = {}): User => ({
  id: randUuid(),
  userNumber: randNumber(),
  firstName: randFirstName(),
  lastName: randLastName(),
  email: randEmail(),
  password: randPassword(),
  createdAt: randPastDate(),
  role: (['staff', 'provider', 'admin', 'owner'] satisfies UserRole[])[
    ~~(Math.random() * 4)
  ],
  ...partial,
})
