import { addDays } from 'date-fns'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AppointmentEntity } from './appointment.entity.js'
import { Between, In, Repository } from 'typeorm'
import { RequestContext } from '../context/request-context.service.js'

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private appointmentsRepository: Repository<AppointmentEntity>,
    private readonly requestContext: RequestContext,
  ) {}

  findAllByStartDate({
    startsAt,
    endsAt,
    userIds,
    appointmentTypeIds,
    statuses,
  }: {
    startsAt: Date
    endsAt?: Date
    userIds?: string[]
    appointmentTypeIds?: string[]
    statuses?: string[]
  }) {
    const { practiceId } = this.requestContext

    return this.appointmentsRepository.find({
      where: {
        practiceId,
        startsAt: Between(startsAt, endsAt || addDays(startsAt, 1)),
        ...(userIds?.length
          ? {
              primaryProvider: {
                id: In(userIds),
              },
            }
          : {}),
        ...(appointmentTypeIds?.length
          ? {
              type: {
                id: In(appointmentTypeIds),
              },
            }
          : {}),
        ...(statuses?.length
          ? {
              status: In(statuses),
            }
          : {}),
      },
      relations: {
        type: true,
        primaryProvider: true,
        clinic: true,
        room: true,
        patient: true,
      },
    })
  }
}
