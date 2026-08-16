import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { mockUserEntity, UserEntity } from './user.entity.js'
import { Repository } from 'typeorm'
import { PaginationQueryDto } from '../shared/pagination/pagination-query.dto.js'
import { PaginatedResult } from '@repo/models'
import { paginate } from '../shared/pagination/pagination.util.js'
import {
  mockPracticeEntity,
  PracticeEntity,
} from '../practices/practice.entity.js'

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(PracticeEntity)
    private practicesRepository: Repository<PracticeEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.resetAndSeedDatabase()
  }

  private resetAndSeedDatabase = async () => {
    await this.practicesRepository.clear()
    await this.usersRepository.clear()

    const users: UserEntity[] = Array(214).fill(null).map(mockUserEntity)
    const practices = Array(42).fill(null).map(mockPracticeEntity)

    const savedUsers = await this.usersRepository.save(users)
    const savedPractices = await this.practicesRepository.save(practices)

    const usersWithPractices: UserEntity[] = savedUsers.map(u => {
      const smallAmountOfRandomPractices = savedPractices.filter(
        () => Math.random() < 0.1,
      )

      return {
        ...u,
        practices: smallAmountOfRandomPractices,
      }
    })

    await this.usersRepository.save(usersWithPractices)

    this.logger.log(`Seeded ${users.length} users into the database.`)
  }

  async findAll(
    query: PaginationQueryDto,
    search?: string,
  ): Promise<PaginatedResult<UserEntity>> {
    const qb = this.usersRepository.createQueryBuilder('user')

    if (search) {
      qb.andWhere(
        `(user.firstName LIKE :search
        OR user.lastName LIKE :search
        OR user.email LIKE :search)`,
        { search: `%${search}%` },
      )
    }

    return paginate(qb, query, {
      sortable: ['firstName', 'lastName', 'email', 'createdAt'],
    })
  }

  findOne(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    })
  }
}
