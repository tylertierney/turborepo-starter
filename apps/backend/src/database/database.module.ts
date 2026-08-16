import { Module } from '@nestjs/common'
import { DatabaseSeederService } from './database-seeder.service.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../users/user.entity.js'
import { PracticeEntity } from '../practices/practice.entity.js'
import { ClinicEntity } from '../clinics/clinic.entity.js'
import { AddressEntity } from '../addresses/address.entity.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PracticeEntity,
      ClinicEntity,
      AddressEntity,
    ]),
  ],
  providers: [DatabaseSeederService],
})
export class DatabaseModule {}
