import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'
import { fromNodeHeaders } from 'better-auth/node'

import { auth } from '../auth.js'
import { UsersService } from '../users/users.service.js'
import { RequestContext } from './request-context.service.js'

@Injectable({ scope: Scope.REQUEST })
export class RequestContextGuard implements CanActivate {
  constructor(
    private readonly requestContext: RequestContext,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    })

    if (!session) {
      return true
    }

    const user = await this.usersService.findOne(session.user.id)

    if (!user) {
      throw new UnauthorizedException(
        'Authenticated user does not have an application user',
      )
    }

    this.requestContext.set({
      userId: user.id,
      practiceId: user.practice.id,
    })

    return true
  }
}
