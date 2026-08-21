import {
  randEmail,
  randFirstName,
  randLastName,
  randNumber,
  randPassword,
  randPastDate,
  randPhoneNumber,
  randUuid,
} from '@ngneat/falso'
import { UserRole } from './role.js'

export type User = {
  id: string
  userNumber: number
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  image?: string
  createdAt: Date | string
  role: UserRole
}

export const mockUser = (partial: Partial<User> = {}): User => ({
  id: randUuid(),
  userNumber: randNumber(),
  firstName: randFirstName(),
  lastName: randLastName(),
  email: randEmail(),
  phone: randPhoneNumber(),
  password: randPassword(),
  image:
    Math.random() > 0.6
      ? `https://picsum.photos/seed/${randUuid()}/60/60`
      : undefined,
  createdAt: randPastDate(),
  role: (['staff', 'provider', 'admin', 'owner'] satisfies UserRole[])[
    ~~(Math.random() * 4)
  ],
  ...partial,
})
