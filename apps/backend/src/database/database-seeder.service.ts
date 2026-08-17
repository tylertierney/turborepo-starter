import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ClinicEntity, mockClinicEntity } from '../clinics/clinic.entity.js'
import { Repository } from 'typeorm'
import {
  mockPracticeEntity,
  PracticeEntity,
} from '../practices/practice.entity.js'
import { mockUserEntity, UserEntity } from '../users/user.entity.js'
import { randNumber } from '@ngneat/falso'
import { AddressEntity } from '../addresses/address.entity.js'

@Injectable()
export class DatabaseSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeederService.name)

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    @InjectRepository(PracticeEntity)
    private readonly practicesRepository: Repository<PracticeEntity>,

    @InjectRepository(ClinicEntity)
    private readonly clinicsRepository: Repository<ClinicEntity>,

    @InjectRepository(AddressEntity)
    private readonly addressesRepository: Repository<AddressEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.resetAndSeedDatabase()
  }

  private resetAndSeedDatabase = async () => {
    await this.practicesRepository.clear()
    await this.usersRepository.clear()
    await this.clinicsRepository.clear()
    await this.addressesRepository.clear()

    // const users: UserEntity[] = Array(randNumber({ min: 200, max: 300 }))
    //   .fill(null)
    //   .map(mockUserEntity)

    const practices = Array(randNumber({ min: 40, max: 60 }))
      .fill(null)
      .map(() => {
        const practice = mockPracticeEntity()
        return {
          ...practice,
        }
      })

    const savedPractices = await this.practicesRepository.save(practices)

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

    const users = savedClinics
      .map(c => {
        return Array(randNumber({ min: 6, max: 20 }))
          .fill(null)
          .map(() => {
            const user = mockUserEntity({
              clinics: [c],
              practices: [c.practice],
            })
            return user
          })
      })
      .flat()

    await this.usersRepository.save(users)

    // const clinics = practices
    //   .map(({ id: practiceId }) =>
    //     Array(randNumber({ min: 1, max: 5 }))
    //       .fill(null)
    //       .map(() => mockClinicEntity({ practiceId })),
    //   )
    //   .flat()

    // await this.clinicsRepository.save(clinics)

    // const savedUsers = await this.usersRepository.save(users)

    // const usersWithPractices: UserEntity[] = savedUsers.map(u => {
    //   const smallAmountOfRandomPractices = savedPractices.filter(
    //     () => Math.random() < 0.1,
    //   )

    //   return {
    //     ...u,
    //     practices: smallAmountOfRandomPractices,
    //   }
    // })

    // await this.usersRepository.save(usersWithPractices)

    // this.logger.log(
    //   `Seeded ${savedPractices.length} practices into the database.`,
    // )
  }
}
