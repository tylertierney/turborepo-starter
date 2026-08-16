import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AddressEntity } from './address.entity.js'
import { AddressesService } from './addresses.service.js'
import { AddressesController } from './addresses.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  providers: [AddressesService],
  controllers: [AddressesController],
  exports: [],
})
export class AddressesModule {}
