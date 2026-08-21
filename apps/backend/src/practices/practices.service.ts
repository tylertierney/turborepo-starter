import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PaginationQueryDto } from '../shared/pagination/pagination-query.dto.js'
import { type PaginatedResult, type UserRole } from '@repo/models'
import { paginate } from '../shared/pagination/pagination.util.js'
import { PracticeEntity } from './practice.entity.js'
import { UserEntity } from '../users/user.entity.js'
import { ClinicEntity } from '../clinics/clinic.entity.js'

@Injectable()
export class PracticesService {
  constructor(
    @InjectRepository(PracticeEntity)
    private practicesRepository: Repository<PracticeEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(ClinicEntity)
    private clinicsRepository: Repository<ClinicEntity>,
  ) {}

  async findAll(
    query: PaginationQueryDto,
    search?: string,
  ): Promise<PaginatedResult<PracticeEntity>> {
    const qb = this.practicesRepository.createQueryBuilder('practice')

    if (search) {
      qb.andWhere(
        `(practice.name ILIKE :search
        OR practice.url ILIKE :search)`,
        { search: `%${search}%` },
      )
    }

    return paginate(qb, query, { sortable: ['name', 'url', 'createdAt'] })
  }

  async findOne(id: string): Promise<PracticeEntity | null> {
    return this.practicesRepository.findOneBy({ id })
  }

  async findUsersByPractice(
    practiceId: string,
    query: PaginationQueryDto,
    search?: string,
    role?: UserRole,
  ) {
    // await new Promise(resolve => setTimeout(resolve, 3_000))
    // throw new NotFoundException('something went wrong')

    const qb = this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.practices', 'practice')
      .where('practice.id = :practiceId', { practiceId })
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.createdAt',
        'user.active',
        'user.phone',
        'user.role',
        'user.image',
      ])

    if (role) {
      qb.andWhere(`(user.role = :role)`, { role })
    }

    if (search) {
      qb.andWhere(
        `(user.firstName ILIKE :search
        OR user.lastName ILIKE :search)`,
        { search: `%${search}%` },
      )
    }

    return paginate(qb, query, {
      sortable: ['firstName', 'lastName', 'createdAt', 'role'],
    })
  }

  async findClinicsByPractice(practiceId: string) {
    const [data, totalCount] = await this.clinicsRepository.findAndCount({
      where: {
        practice: {
          id: practiceId,
        },
      },
      relations: {
        address: true,
      },
    })

    return { data, meta: { totalCount } } as PaginatedResult<ClinicEntity>
  }
}
