import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppointmentTypeEntity } from './appointment-type/appointment-type.entity.js'
import { AppointmentTypeService } from './appointment-type/appointment-type.service.js'
import { AppointmentEntity } from './appointment.entity.js'
import { AppointmentsService } from './appointments.service.js'
import { AppointmentsController } from './appointments.controller.js'
import { ClinicRoomEntity } from './clinic-room/clinic-room.entity.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AppointmentTypeEntity,
      AppointmentEntity,
      ClinicRoomEntity,
    ]),
  ],
  providers: [AppointmentTypeService, AppointmentsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
