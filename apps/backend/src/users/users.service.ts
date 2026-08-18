import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginatedResult } from '@repo/models'
import { Repository } from 'typeorm'
import { PaginationQueryDto } from '../shared/pagination/pagination-query.dto.js'
import { paginate } from '../shared/pagination/pagination.util.js'
import { UserEntity } from './user.entity.js'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(
    query: PaginationQueryDto,
    search?: string,
  ): Promise<PaginatedResult<UserEntity>> {
    const delay = new Promise(resolve => {
      setTimeout(() => resolve('resolved'), 3_000)
    })
    await delay

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
