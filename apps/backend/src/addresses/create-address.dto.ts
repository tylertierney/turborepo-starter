import { IsOptional, IsString, Length, Matches } from 'class-validator'

export class CreateAddressDto {
  @IsString()
  @Length(1, 100)
  street1!: string

  @IsOptional()
  @IsString()
  @Length(1, 100)
  street2?: string

  @IsString()
  @Length(1, 100)
  city!: string

  @IsString()
  @Length(2, 50)
  state!: string

  @IsString()
  @Matches(/^\d{5}(-\d{4})?$/)
  postalCode!: string
}
