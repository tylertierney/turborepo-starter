import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common'
import { UsersService } from './users.service.js'
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger'
import { PaginationQueryDto } from '../shared/pagination/pagination-query.dto.js'
import { mockUserEntity, UserEntity } from './user.entity.js'
import { PaginatedResult, type UserRole, userRoles } from '@repo/models'

export type PaginationQuery = {
  page: number
  pageSize: number
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    description: 'List of users',
    example: {
      data: Array(10)
        .fill(null)
        .map(() => {
          const u = mockUserEntity()
          return {
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            createdAt: u.createdAt,
            email: u.email,
            active: u.active,
          }
        }),
      meta: {
        totalCount: 10,
        pageSize: 10,
        totalPages: 1,
        currentPage: 1,
        itemCount: 10,
      },
    } satisfies PaginatedResult<
      Pick<
        UserEntity,
        'id' | 'firstName' | 'lastName' | 'createdAt' | 'email' | 'active'
      >
    >,
  })
  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search users by firstName, lastName, or email.',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    type: String,
    enum: userRoles,
    description: 'Filter users by role.',
  })
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    paginationQuery: PaginationQueryDto,
    @Query('search')
    search = '',
    @Query('role')
    role: UserRole,
  ) {
    // const delay = (ms: number) =>
    //   new Promise(resolve => setTimeout(resolve, ms))
    // await delay(60000)

    return this.usersService.findAll(paginationQuery, search, role)

    // throw new InternalServerErrorException('ahhhhhh!')
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id)
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user
  }
}
