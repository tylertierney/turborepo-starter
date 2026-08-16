import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PracticeEntity } from './practice.entity.js'
import { PracticesService } from './practices.service.js'
import { PracticesController } from './practices.controler.js'
import { UserEntity } from '../users/user.entity.js'

@Module({
  imports: [TypeOrmModule.forFeature([PracticeEntity, UserEntity])],
  providers: [PracticesService],
  controllers: [PracticesController],
  exports: [],
})
export class PracticesModule {}
