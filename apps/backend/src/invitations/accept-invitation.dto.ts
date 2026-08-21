import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class AcceptInvitationDto {
  @ApiProperty({
    example: 'John',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  firstName!: string

  @ApiProperty({
    example: 'Doe',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  lastName!: string

  @ApiProperty({
    minLength: 8,
    maxLength: 256,
  })
  @IsString()
  @Length(8, 256)
  password!: string
}
