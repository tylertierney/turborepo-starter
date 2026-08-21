import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common'
import { InvitationsService } from './invitations.service.js'
import { AllowAnonymous } from '@thallesp/nestjs-better-auth'
import { AcceptInvitationDto } from './accept-invitation.dto.js'

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @AllowAnonymous()
  @Get('/')
  async findAll() {
    return this.invitationsService.findAll()
  }

  @AllowAnonymous()
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const invite = await this.invitationsService.findOne(id)

    if (!invite) {
      throw new NotFoundException(`No invitation was found`)
    }

    return invite
  }

  @AllowAnonymous()
  @Post(':id/accept')
  async acceptInvitation(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() acceptInvitationDto: AcceptInvitationDto,
  ) {
    return this.invitationsService.accept(id, acceptInvitationDto)
  }
}
