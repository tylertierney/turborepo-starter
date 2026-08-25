import { addDays } from 'date-fns'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AppointmentEntity } from './appointment.entity.js'
import { Between, Repository } from 'typeorm'
import { RequestContext } from '../context/request-context.service.js'

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private appointmentsRepository: Repository<AppointmentEntity>,
    // private readonly requestContext: RequestContext,
  ) {}

  findAllByStartDate(startDate: Date, endDate?: Date) {
    // const { practiceId } = this.requestContext

    return this.appointmentsRepository.find({
      where: {
        // practiceId,
        startsAt: Between(startDate, endDate || addDays(startDate, 1)),
      },
      relations: {
        type: true,
        primaryProvider: true,
        clinic: true,
        room: true,
      },
    })
  }
}
