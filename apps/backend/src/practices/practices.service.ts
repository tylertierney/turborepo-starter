import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { PaginationQueryDto } from '../shared/pagination/pagination-query.dto.js'
import { PaginatedResult } from '@repo/models'
import { paginate } from '../shared/pagination/pagination.util.js'
import { mockPracticeEntity, PracticeEntity } from './practice.entity.js'

@Injectable()
export class PracticesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PracticesService.name)

  constructor(
    @InjectRepository(PracticeEntity)
    private practicesRepository: Repository<PracticeEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.resetAndSeedDatabase()
  }

  private resetAndSeedDatabase = async () => {
    await this.practicesRepository.clear()

    const practices: PracticeEntity[] = Array(26)
      .fill(null)
      .map(mockPracticeEntity)

    await this.practicesRepository.save(practices)

    this.logger.log(`Seeded ${practices.length} practices into the database.`)
  }

  async findAll(
    query: PaginationQueryDto,
    search?: string,
  ): Promise<PaginatedResult<PracticeEntity>> {
    const res = await paginate<PracticeEntity>(
      this.practicesRepository,
      query,
      {
        sortable: ['name', 'createdAt'],
        where: [
          {
            name: ILike(`%${search}%`),
          },
        ],
      },
    )

    const onlySelectedFields: PaginatedResult<PracticeEntity> = {
      ...res,
      data: res.data.map(p => {
        const fieldsToKeep = new Set<keyof PracticeEntity>([
          'id',
          'name',
          'image',
        ])
        return Object.fromEntries(
          Object.entries(p).filter(([key]) =>
            fieldsToKeep.has(key as keyof PracticeEntity),
          ),
        ) as PracticeEntity
      }),
    }

    return onlySelectedFields
  }

  async findOne(id: string): Promise<PracticeEntity | null> {
    return this.practicesRepository.findOneBy({ id })
  }
}
