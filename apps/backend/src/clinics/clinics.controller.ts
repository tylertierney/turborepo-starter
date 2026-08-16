import { Body, Controller, Post } from '@nestjs/common'
import { CreateClinicDto } from './create-clinic.dto.js'
import { ClinicsService } from './clinics.service.js'

@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Post()
  create(
    @Body()
    dto: CreateClinicDto,
  ) {
    return this.clinicsService.create(dto)
  }
}
