import {
  randBetweenDate,
  randFirstName,
  randUser,
  randUuid,
} from '@ngneat/falso'
import { Address, mockAddress } from './address.js'
import { mockPractice, Practice } from './practice.js'

export const sexes = ['M', 'F'] as const
export type Sex = (typeof sexes)[number]

export const randSex = () => sexes[~~(Math.random() * sexes.length)]

export type Patient = {
  id: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  phone: string
  preferredName: string
  sex: Sex
  genderIdentity?: string
  dateOfBirth: Date
  deceasedAt?: Date
  preferredLanguage: string
  address: Address
  practice: Practice
}

export const mockPatient = (partial: Partial<Patient> = {}): Patient => {
  const p = randUser()
  return {
    id: randUuid(),
    firstName: p.firstName,
    middleName: randFirstName(),
    lastName: p.lastName,
    email: p.email,
    phone: p.phone,
    preferredName: Math.random() < 0.1 ? randFirstName() : '',
    sex: randSex(),
    genderIdentity: undefined,
    dateOfBirth: randBetweenDate({
      from: new Date('1/1/1960'),
      to: new Date('1/1/2020'),
    }),
    deceasedAt: undefined,
    preferredLanguage: 'English',
    address: mockAddress(),
    practice: mockPractice(),
    ...partial,
  }
}
