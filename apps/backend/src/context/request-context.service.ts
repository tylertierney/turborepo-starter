import { Injectable, Scope } from '@nestjs/common'

export type RequestContextData = {
  userId: string
  practiceId: string
}

@Injectable({ scope: Scope.REQUEST })
export class RequestContext {
  private data?: RequestContextData

  set(data: RequestContextData) {
    this.data = data
  }

  get userId() {
    if (!this.data) {
      throw new Error('Request context has not been initialized')
    }

    return this.data.userId
  }

  get practiceId() {
    if (!this.data) {
      throw new Error('Request context has not been initialized')
    }

    return this.data.practiceId
  }
}
