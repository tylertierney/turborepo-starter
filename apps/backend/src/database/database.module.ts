import { Module } from '@nestjs/common'
import { DatabaseSeederService } from './database-seeder.service.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../users/user.entity.js'
import { PracticeEntity } from '../practices/practice.entity.js'
import { ClinicEntity } from '../clinics/clinic.entity.js'
import { AddressEntity } from '../addresses/address.entity.js'
import { InvitationEntity } from '../invitations/invitation.entity.js'
import { AppointmentTypeEntity } from '../appointments/appointment-type/appointment-type.entity.js'
import { AppointmentEntity } from '../appointments/appointment.entity.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PracticeEntity,
      ClinicEntity,
      AddressEntity,
      InvitationEntity,
      AppointmentTypeEntity,
      AppointmentEntity,
    ]),
  ],
  providers: [DatabaseSeederService],
})
export class DatabaseModule {}
