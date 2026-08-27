import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ClinicRoomEntity } from './clinic-room.entity.js'
import { Repository } from 'typeorm'

@Injectable()
export class ClinicRoomService {
  constructor(
    @InjectRepository(ClinicRoomEntity)
    private clinicRoomRepository: Repository<ClinicRoomEntity>,
  ) {}

  findAll() {
    return this.clinicRoomRepository.find()
  }
}
