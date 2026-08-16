import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PracticeEntity } from './practice.entity.js'
import { PracticesService } from './practices.service.js'
import { PracticesController } from './practices.controller.js'
import { UserEntity } from '../users/user.entity.js'
import { ClinicEntity } from '../clinics/clinic.entity.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([PracticeEntity, UserEntity, ClinicEntity]),
  ],
  providers: [PracticesService],
  controllers: [PracticesController],
  exports: [],
})
export class PracticesModule {}
