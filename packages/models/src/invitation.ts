import {
  randEmail,
  randFirstName,
  randFutureDate,
  randLastName,
  randPastDate,
  randUuid,
} from '@ngneat/falso'
import { Practice } from './practice.js'
import { mockUserRole, type UserRole } from './role.js'

export type Invitation = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  practiceId: string
  practice?: Practice
  consumedAt: Date | null
  expiresAt: Date
  createdAt: Date
}

export const mockInvitation = (
  partial: Partial<Invitation> = {},
): Invitation => {
  return {
    id: randUuid(),
    firstName: randFirstName(),
    lastName: randLastName(),
    email: randEmail(),
    role: mockUserRole(),
    practiceId: randUuid(),
    consumedAt: null,
    expiresAt: randFutureDate(),
    createdAt: randPastDate(),
    ...partial,
  }
}
