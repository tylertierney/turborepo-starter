import { ApiProperty } from '@nestjs/swagger'
import { type UserRole, userRoles } from '@repo/models'
import { IsEmail, IsIn, IsString, Length } from 'class-validator'

export class CreateInvitationDto {
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
    example: 'johndoe@email.com',
    minLength: 1,
    maxLength: 50,
  })
  @IsEmail()
  email!: string

  @ApiProperty({
    description: `User's role in the system`,
    example: userRoles,
  })
  @IsIn(userRoles)
  role!: UserRole
}
