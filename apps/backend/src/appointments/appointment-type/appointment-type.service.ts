import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AppointmentTypeEntity } from './appointment-type.entity.js'
import { Repository } from 'typeorm'

@Injectable()
export class AppointmentTypeService {
  constructor(
    @InjectRepository(AppointmentTypeEntity)
    private appointmentTypesRepository: Repository<AppointmentTypeEntity>,
  ) {}

  findAll() {
    return this.appointmentTypesRepository.find()
  }
}
