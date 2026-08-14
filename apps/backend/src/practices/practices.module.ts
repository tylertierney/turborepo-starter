import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PracticeEntity } from './practice.entity.js'
import { PracticesService } from './practices.service.js'
import { PracticesController } from './practices.controler.js'

@Module({
  imports: [TypeOrmModule.forFeature([PracticeEntity])],
  providers: [PracticesService],
  controllers: [PracticesController],
  exports: [],
})
export class PracticesModule {}
