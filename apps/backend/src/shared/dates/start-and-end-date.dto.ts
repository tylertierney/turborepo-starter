import { IsDate, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { addDays, startOfDay } from 'date-fns'

export class StartAndEndDateDto {
  @ApiProperty({
    description: 'Start time (date string) for filtering.',
    example: startOfDay(new Date(Date.now())),
  })
  @Type(() => Date)
  @IsDate()
  startsAt: Date = new Date(Date.now())

  @ApiProperty({
    description: 'End time (date string) for filtering.',
    example: addDays(new Date(Date.now()), 30),
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endsAt?: Date = new Date(Date.now())
}
