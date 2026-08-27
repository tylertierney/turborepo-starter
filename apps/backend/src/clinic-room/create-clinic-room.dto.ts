import { ApiProperty } from '@nestjs/swagger'

export class CreateClinicRoomDto {
  @ApiProperty({
    examples: ['Room A', 'Lane 1'],
  })
  name!: string
}
