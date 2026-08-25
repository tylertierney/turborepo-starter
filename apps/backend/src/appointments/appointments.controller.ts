import { Controller, Get, Query, ValidationPipe } from '@nestjs/common'
import { AppointmentsService } from './appointments.service.js'
import { StartAndEndDateDto } from '../shared/dates/start-and-end-date.dto.js'
import { ApiOkResponse } from '@nestjs/swagger'
import { AllowAnonymous } from '@thallesp/nestjs-better-auth'

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @AllowAnonymous()
  @ApiOkResponse({
    description: 'Get appointments between startsAt and endsAt',
  })
  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: StartAndEndDateDto,
  ) {
    return this.appointmentsService.findAllByStartDate(
      query.startsAt,
      query.endsAt,
    )
  }
}
