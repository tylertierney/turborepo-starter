import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user.entity.js'
import { UsersService } from './users.service.js'
import { UsersController } from './users.controller.js'
import { PracticeEntity } from '../practices/practice.entity.js'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PracticeEntity])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
