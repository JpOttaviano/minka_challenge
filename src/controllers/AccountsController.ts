import { POST, Path, Errors } from 'typescript-rest'
import { generateAccessToken } from '../utils/crypto'
import { BaseController } from './BaseController'

@Path('/auth')
export class AuthController extends BaseController {
  @POST
  public async login(body: any): Promise<{ token: string }> {
    const { user, authorities } = body
    if (!user || !authorities) {
      throw new Errors.ForbiddenError('User not found')
    }
    const token = generateAccessToken({
      user,
      authorities,
    })
    return {
      token,
    }
  }
}
