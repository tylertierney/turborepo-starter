import {
  Controller,
  Get,
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
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 0,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 10,
  ) {
    return this.usersService.findAll({ page, pageSize })
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
