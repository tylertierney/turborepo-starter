import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { type PaginatedResult, type UserRole } from '@repo/models'
import { Repository } from 'typeorm'
import { PaginationQueryDto } from '../shared/pagination/pagination-query.dto.js'
import { paginate } from '../shared/pagination/pagination.util.js'
import { UserEntity } from './user.entity.js'
import { RequestContext } from '../context/request-context.service.js'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly requestContext: RequestContext,
  ) {}

  async findAll(
    query: PaginationQueryDto,
    search?: string,
    role?: UserRole,
  ): Promise<PaginatedResult<UserEntity>> {
    const { practiceId } = this.requestContext
    // const delay = new Promise(resolve => {
    //   setTimeout(() => resolve('resolved'), 3_000)
    // })
    // await delay

    const qb = this.usersRepository.createQueryBuilder('user')

    qb.andWhere(`(user.practiceId = :practiceId)`, { practiceId })

    if (role) {
      qb.andWhere(`(user.role = :role)`, { role })
    }

    if (search) {
      qb.andWhere(
        `(user.firstName ILIKE :search
        OR user.email ILIKE :search
        OR user.lastName ILIKE :search)`,
        { search: `%${search}%` },
      )
    }

    const res = await paginate(qb, query, {
      sortable: ['firstName', 'lastName', 'createdAt', 'email'],
    })
    return res
  }

  findOne(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      relations: {
        practice: true,
      },
    })
  }
}
