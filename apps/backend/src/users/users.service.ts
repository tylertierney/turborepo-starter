import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { mockUser, UserEntity } from './user.entity'
import { ILike, Repository } from 'typeorm'
import { PaginationQuery } from './users.controller'

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
    query?: PaginationQuery & { search?: string },
  ): Promise<{ users: UserEntity[]; totalCount: number }> {
    const { page = 0, pageSize = 10, search = '' } = query || {}

    const [users, totalCount] = await this.usersRepository.findAndCount({
      // relations: {
      //   companies: true,
      // }
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
      take: pageSize,
      skip: page * pageSize,
    })

    return { users, totalCount }
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
