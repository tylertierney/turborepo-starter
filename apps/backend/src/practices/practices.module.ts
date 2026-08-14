import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PracticeEntity } from './practice.entity'
import { PracticesService } from './practices.service'
import { PracticesController } from './practices.controler'

@Module({
  imports: [TypeOrmModule.forFeature([PracticeEntity])],
  providers: [PracticesService],
  controllers: [PracticesController],
  exports: [],
})
export class PracticesModule {}
