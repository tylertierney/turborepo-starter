import { IsString, Length } from 'class-validator'

export class CreateClinicDto {
  @IsString()
  @Length(1, 100)
  name!: string
}
