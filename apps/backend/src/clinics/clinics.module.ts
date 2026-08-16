import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClinicEntity } from './clinic.entity.js'
import { ClinicsService } from './clinics.service.js'
import { ClinicsController } from './clinics.controller.js'
import { AddressEntity } from '../addresses/address.entity.js'

@Module({
  imports: [TypeOrmModule.forFeature([ClinicEntity, AddressEntity])],
  providers: [ClinicsService],
  controllers: [ClinicsController],
  exports: [],
})
export class ClinicsModule {}
