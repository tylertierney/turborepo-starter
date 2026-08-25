import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ClinicEntity, mockClinicEntity } from '../clinics/clinic.entity.js'
import { DataSource, Repository } from 'typeorm'
import {
  mockPracticeEntity,
  PracticeEntity,
} from '../practices/practice.entity.js'
import { mockUserEntity, UserEntity } from '../users/user.entity.js'
import {
  randFutureDate,
  randNumber,
  randParagraph,
  randSentence,
} from '@ngneat/falso'
import { AddressEntity } from '../addresses/address.entity.js'
import { auth } from '../auth.js'
import { InvitationEntity } from '../invitations/invitation.entity.js'
import { hoursToMilliseconds } from 'date-fns'
import { AppointmentEntity } from '../appointments/appointment.entity.js'
import { appointmentTypes, mockAppointmentType } from '@repo/models'
import {
  AppointmentTypeEntity,
  mockAppointmentTypeEntity,
} from '../appointments/appointment-type/appointment-type.entity.js'

@Injectable()
export class DatabaseSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeederService.name)

  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    @InjectRepository(PracticeEntity)
    private readonly practicesRepository: Repository<PracticeEntity>,

    @InjectRepository(ClinicEntity)
    private readonly clinicsRepository: Repository<ClinicEntity>,

    @InjectRepository(InvitationEntity)
    private readonly invitationsRepository: Repository<InvitationEntity>,

    @InjectRepository(AddressEntity)
    private readonly addressesRepository: Repository<AddressEntity>,

    @InjectRepository(AppointmentTypeEntity)
    private readonly appointmentTypeRepository: Repository<AppointmentTypeEntity>,

    @InjectRepository(AppointmentEntity)
    private readonly appointmentsRepository: Repository<AppointmentEntity>,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV === 'development') {
      await this.resetAndSeedDatabase()
    }
  }

  private resetAndSeedDatabase = async () => {
    await this.dataSource.synchronize(true)
    await this.dataSource.query(`
      TRUNCATE TABLE
        "auth"."session",
        "auth"."account",
        "auth"."verification",
        "auth"."user"
      CASCADE
    `)

    // test practice + clinic + user
    const testPractice = await this.practicesRepository.save({
      active: true,
      name: 'Tampa Eye',
      image: 'https://tampaeye.com/wp-content/uploads/2024/06/logo-cropped.png',
      url: 'https://tampaeye.com',
    })

    const testClinic = await this.clinicsRepository.save({
      name: 'Carrolwood',
      address: {
        city: 'Tampa',
        state: 'Florida',
        street1: '123 Main St',
        postalCode: '33604',
      },
      practice: testPractice,
      image: mockClinicEntity().image,
    })

    const authTestUser = await auth.api.signUpEmail({
      body: {
        email: 'johndoe@email.com',
        name: 'John Doe',
        password: 'password',
      },
    })

    const testUser = await this.usersRepository.save({
      id: authTestUser.user.id,
      firstName: 'John',
      lastName: 'Doe',
      active: true,
      clinics: [testClinic],
      practice: testPractice,
      email: 'johndoe@email.com',
      role: 'owner',
      phone: '123 867 5309',
      practiceId: testPractice.id,
    })

    // await this.invitationsRepository.save({
    //   email: 'tytierney@yahoo.com',
    //   firstName: 'Tyler',
    //   lastName: 'Tierney',
    //   practiceId: testPractice.id,
    //   role: 'owner',
    // })

    //

    const practices = Array(randNumber({ min: 1, max: 1 }))
      .fill(null)
      .map(() => {
        const practice = mockPracticeEntity()
        return {
          ...practice,
        }
      })

    const savedPractices = await this.practicesRepository.save(practices)

    await this.invitationsRepository.save({
      email: 'tytierney@yahoo.com',
      firstName: 'Tyler',
      lastName: 'Tierney',
      practiceId: savedPractices[0].id,
      role: 'owner',
    })

    const clinics = savedPractices
      .map(p => {
        return Array(randNumber({ min: 1, max: 5 }))
          .fill(null)
          .map(() => {
            const clinic = mockClinicEntity({ practice: p })
            return clinic
          })
      })
      .flat()

    const savedClinics = await this.clinicsRepository.save(clinics)

    const practiceMap: Record<string, ClinicEntity[]> = {}
    for (const c of savedClinics) {
      if (c.practice.id in practiceMap) {
        practiceMap[c.practice.id].push(c)
      } else {
        practiceMap[c.practice.id] = [c]
      }
    }

    let fakeUsers: UserEntity[] = []
    for (const clinics of Object.values(practiceMap)) {
      const owners = Array(randNumber({ min: 1, max: 3 }))
        .fill(null)
        .map(() => {
          return mockUserEntity({
            role: 'owner',
            clinics,
            practice: clinics[0].practice,
          })
        })

      const admins = Array(randNumber({ min: 1, max: 4 }))
        .fill(null)
        .map(() => {
          return mockUserEntity({
            role: 'admin',
            clinics,
            practice: clinics[0].practice,
          })
        })

      const providers = clinics
        .map(c =>
          Array(randNumber({ min: 2, max: 6 }))
            .fill(null)
            .map(() => {
              return mockUserEntity({
                role: 'provider',
                clinics: [c],
                practice: clinics[0].practice,
              })
            }),
        )
        .flat()

      const staff = clinics
        .map(c =>
          Array(randNumber({ min: 4, max: 10 }))
            .fill(null)
            .map(() => {
              return mockUserEntity({
                role: 'staff',
                clinics: [c],
                practice: clinics[0].practice,
              })
            }),
        )
        .flat()

      fakeUsers = [...fakeUsers, ...owners, ...admins, ...providers, ...staff]
    }

    const users = await this.usersRepository.save(fakeUsers)

    // for (const user of users) {
    //   await auth.api.signUpEmail({
    //     body: {
    //       name: user.firstName + ' ' + user.lastName,
    //       email: user.email,
    //       password: 'password',
    //     },
    //   })
    // }

    ////////////// Generate appointments

    const apptTypes = savedPractices
      .map(practice => {
        return appointmentTypes.map(t => {
          return mockAppointmentTypeEntity({
            name: t,
            practice,
          })
        })
      })
      .flat()

    const savedApptTypes = await this.appointmentTypeRepository.save(apptTypes)

    const finalSavedClinics = await this.clinicsRepository.find({
      relations: {
        practice: true,
        users: true,
      },
    })

    const appts = finalSavedClinics
      .map(({ id: clinicId, practice, users }) =>
        Array(200)
          .fill(null)
          .map(() => {
            const startTime = randFutureDate()
            const endTime =
              startTime.getTime() +
              randNumber({
                min: hoursToMilliseconds(1),
                max: hoursToMilliseconds(4),
              })

            // return new Date(startTime, new Date(endTime))
            return { startsAt: new Date(startTime), endsAt: new Date(endTime) }
          })
          .map(({ startsAt, endsAt }) => {
            return new AppointmentEntity({
              primaryProvider: users[~~(Math.random() * users.length)],
              practiceId: practice.id,
              clinicId,
              startsAt,
              endsAt,
              name: randSentence(),
              description: randParagraph(),
              type: savedApptTypes[~~(Math.random() * savedApptTypes.length)],
            })
          }),
      )
      .flat()

    await this.appointmentsRepository.save(appts)
  }
}
