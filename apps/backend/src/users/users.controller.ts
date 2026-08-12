import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger'
import { PaginationQueryDto } from '../shared/pagination/pagination-query.dto'
import { mockUser, UserEntity } from './user.entity'
import { PaginatedResult } from '@repo/models'

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
          const u = mockUser()
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
    // schema: {
    //   example: {
    //     data: Array(10).fill(null).map(mockUser),
    //     meta: {
    //       totalCount: 10,
    //       pageSize: 10,
    //       totalPages: 1,
    //       currentPage: 1,
    //       itemCount: 10,
    //     },
    //   },
    //   //  satisfies PaginatedResult<UserEntity>,
    // },
  })
  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search users by firstName, lastName, or email.',
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('search')
    search = '',
  ) {
    // const delay = (ms: number) =>
    //   new Promise(resolve => setTimeout(resolve, ms))
    // await delay(60000)

    return this.usersService.findAll(paginationQuery, search)

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
