import { ApiProperty } from '@nestjs/swagger'
import {
  appointmentTypes,
  type AppointmentColor,
  appointmentColors,
} from '@repo/models'

export class CreateAppointmentTypeDto {
  @ApiProperty({
    examples: appointmentTypes,
  })
  name!: string

  @ApiProperty({
    type: 'string',
    examples: appointmentColors,
  })
  color!: AppointmentColor
}
