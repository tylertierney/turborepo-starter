import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AddressEntity } from './address.entity.js'
import { Repository } from 'typeorm'
import { CreateAddressDto } from './create-address.dto.js'

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressesRepository: Repository<AddressEntity>,
  ) {}

  async create(dto: CreateAddressDto) {
    const address = this.addressesRepository.create(dto)

    return this.addressesRepository.save(address)
  }
}
