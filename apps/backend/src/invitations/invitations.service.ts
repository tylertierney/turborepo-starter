import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InvitationEntity } from './invitation.entity.js'
import { Repository } from 'typeorm'
import { CreateInvitationDto } from './create-invitation.dto.js'
import { AcceptInvitationDto } from './accept-invitation.dto.js'
import { auth } from '../auth.js'
import { UserEntity } from '../users/user.entity.js'

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(InvitationEntity)
    private invitationsRepository: Repository<InvitationEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  create(practiceId: string, dto: CreateInvitationDto) {
    return this.invitationsRepository.create({
      ...dto,
      practiceId,
    })
  }

  findAll(): Promise<InvitationEntity[]> {
    return this.invitationsRepository.find()
  }

  findOne(id: string): Promise<InvitationEntity | null> {
    return this.invitationsRepository.findOne({
      where: {
        id,
      },
      relations: {
        practice: true,
      },
    })
  }

  async accept(id: string, dto: AcceptInvitationDto) {
    const invitation = await this.invitationsRepository.findOne({
      where: {
        id,
        consumedAt: undefined,
      },
      relations: {
        practice: true,
      },
    })

    if (!invitation) {
      throw new NotFoundException(`Invitation with ID ${id} not found.`)
    }

    const authUser = await auth.api.signUpEmail({
      body: {
        email: invitation.email,
        name: dto.firstName + ' ' + dto.lastName,
        password: dto.password,
      },
    })

    if (!authUser) {
      throw new InternalServerErrorException(
        'Something went wrong while creating a user.',
      )
    }

    const user = await this.usersRepository.save({
      id: authUser.user.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: invitation.email,
      role: invitation.role,
      practiceId: invitation.practiceId,
      practice: invitation.practice,
    })

    if (!user) {
      throw new InternalServerErrorException(
        'Something went wrong while creating a user.',
      )
    }

    await this.invitationsRepository.update(
      {
        id,
      },
      {
        consumedAt: new Date(),
      },
    )
  }
}
