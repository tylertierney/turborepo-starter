import { Controller, Get } from '@nestjs/common'
import { AppointmentTypeService } from './appointment-type.service.js'

@Controller('appointment-types')
export class AppointmentTypesController {
  constructor(private appointmentTypesService: AppointmentTypeService) {}

  @Get()
  async findAll() {
    return this.appointmentTypesService.findAll()
  }
}
