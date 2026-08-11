import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { UsersService } from './users.service'

export type PaginationQuery = {
  page: number
  pageSize: number
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 10,
    @Query('q') search = '',
  ) {
    // const delay = (ms: number) =>
    //   new Promise(resolve => setTimeout(resolve, ms))
    // await delay(2000)

    return this.usersService.findAll({ page, pageSize, search })

    // throw new InternalServerErrorException('ahhhhhh!')
    // return { users: [], totalCount: 0 }
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
