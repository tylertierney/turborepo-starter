import { Controller, Get, Query, ValidationPipe } from '@nestjs/common'
import { PracticesService } from './practices.service'
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger'
import { mockPracticeEntity, PracticeEntity } from './practice.entity'
import { PaginationQueryDto } from '../shared/pagination/pagination-query.dto'
import { PaginatedResult } from '@repo/models'

@Controller('practices')
export class PracticesController {
  constructor(private readonly practicesService: PracticesService) {}

  @ApiOkResponse({
    description: 'List of practices',
    example: {
      data: Array(10)
        .fill(null)
        .map(() => {
          const u = mockPracticeEntity()
          return {
            name: u.name,
          }
        }),
      meta: {
        totalCount: 10,
        pageSize: 10,
        totalPages: 1,
        currentPage: 1,
        itemCount: 10,
      },
    } satisfies PaginatedResult<Pick<PracticeEntity, 'name'>>,
  })
  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search practices by name.',
  })
  async findall(
    @Query(new ValidationPipe({ transform: true }))
    paginationQuery: PaginationQueryDto,
    @Query('search')
    search = '',
  ) {
    return this.practicesService.findAll(paginationQuery, search)
  }
}
