import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AppointmentTypeEntity } from './appointment-type.entity.js'
import { Repository } from 'typeorm'
import { RequestContext } from '../../context/request-context.service.js'

@Injectable()
export class AppointmentTypeService {
  constructor(
    @InjectRepository(AppointmentTypeEntity)
    private appointmentTypesRepository: Repository<AppointmentTypeEntity>,
    private readonly requestContext: RequestContext,
  ) {}

  findAll() {
    const { practiceId } = this.requestContext

    return this.appointmentTypesRepository.find({
      where: {
        practiceId,
      },
    })
  }
}
