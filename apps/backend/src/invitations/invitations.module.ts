import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvitationEntity } from './invitation.entity.js'
import { InvitationsService } from './invitations.service.js'
import { InvitationsController } from './invitations.controller.js'
import { UserEntity } from '../users/user.entity.js'

@Module({
  imports: [TypeOrmModule.forFeature([InvitationEntity, UserEntity])],
  providers: [InvitationsService],
  controllers: [InvitationsController],
  exports: [],
})
export class InvitationsModule {}
