import { Body, Controller, Post } from '@nestjs/common'
import { CreateAddressDto } from './create-address.dto.js'
import { AddressesService } from './addresses.service.js'

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(
    @Body()
    dto: CreateAddressDto,
  ) {
    return this.addressesService.create(dto)
  }
}
