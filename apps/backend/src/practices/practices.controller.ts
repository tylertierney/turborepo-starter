import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common'
import { PracticesService } from './practices.service.js'
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger'
import { mockPracticeEntity, PracticeEntity } from './practice.entity.js'
import { PaginationQueryDto } from '../shared/pagination/pagination-query.dto.js'
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const practice = await this.practicesService.findOne(id)
    if (!practice) {
      throw new NotFoundException(`Practice with ID ${id} not found`)
    }
    return practice
  }

  @Get(':id/users')
  findUsersByPractice(
    @Param('id') id: string,
    @Query(new ValidationPipe({ transform: true }))
    paginationQuery: PaginationQueryDto,
    @Query('search')
    search = '',
  ) {
    return this.practicesService.findUsersByPractice(
      id,
      paginationQuery,
      search,
    )
  }

  @Get(':id/clinics')
  findClinicsByPractice(@Param('id') id: string) {
    console.log(id)
    return this.practicesService.findClinicsByPractice(id)
  }
}
