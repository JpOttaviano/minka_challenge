import { ContextRequest } from 'typescript-rest'
import { Request } from 'express-jwt'
import { BadRequestError } from 'typescript-rest/dist/server/model/errors'

type CustomRequest = Request & {
  decoded: {
    userId: number
    roles: string[]
  }
}

export class BaseController {
  @ContextRequest
  protected readonly request: CustomRequest

  protected getSession(): {
    userId: any
    roles: string[]
  } {
    const { userId, roles } = this.request.decoded
    if (!userId) {
      throw new BadRequestError('User not found')
    }

    return {
      userId,
      roles,
    }
  }
}
