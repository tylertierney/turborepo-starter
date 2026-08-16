import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateClinicDto } from './create-clinic.dto.js'
import { ClinicEntity } from './clinic.entity.js'

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(ClinicEntity)
    private clinicsRepository: Repository<ClinicEntity>,
  ) {}

  async create(dto: CreateClinicDto) {
    const clinic = this.clinicsRepository.create(dto)

    return this.clinicsRepository.save(clinic)
  }
}
