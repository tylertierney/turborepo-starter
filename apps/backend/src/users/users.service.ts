import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { mockUser, UserEntity } from './user.entity'
import { ILike, Repository } from 'typeorm'
import { PaginationQueryDto } from '../shared/pagination/pagination-query.dto'
import { PaginatedResult } from '@repo/models'
import { paginate } from '../shared/pagination/pagination.util'
import { instanceToPlain } from 'class-transformer'

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.resetAndSeedDatabase()
  }

  private resetAndSeedDatabase = async () => {
    await this.usersRepository.clear()

    const users: UserEntity[] = Array(126).fill(null).map(mockUser)
    await this.usersRepository.save(users)

    this.logger.log(`Seeded ${users.length} users into the database.`)
  }

  async findAll(
    query: PaginationQueryDto,
    search?: string,
  ): Promise<PaginatedResult<UserEntity>> {
    const res = await paginate<UserEntity>(this.usersRepository, query, {
      where: [
        {
          firstName: ILike(`%${search}%`),
        },
        {
          lastName: ILike(`%${search}%`),
        },
        {
          email: ILike(`%${search}%`),
        },
      ],
      order: {
        createdAt: 'DESC',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        email: true,
        active: true,
      },
    })

    return res
  }

  findOne(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      // relations: {
      //   companies: true,
      // }
    })
  }
}
