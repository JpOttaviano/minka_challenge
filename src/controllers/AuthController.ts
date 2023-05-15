import { POST, Path, Errors } from 'typescript-rest'
import { generateAccessToken } from '../utils/crypto'
import { BaseController } from './BaseController'
import { UserService } from '../services'

@Path('/auth')
export class AuthController extends BaseController {
  @POST
  public async login(body: any): Promise<{ token: string }> {
    const { userName, password } = body
    if (!userName || !password) {
      throw new Errors.ForbiddenError('Missing Credentials')
    }
    const validatedUser = await UserService.validateUser(userName, password)
    const { roles, id: userId } = validatedUser
    const token = generateAccessToken({
      userId,
      roles,
    })
    return {
      token,
    }
  }

  @POST
  @Path('/register')
  public async register(body: any): Promise<{ token: string }> {
    const { userName, password } = body
    if (!userName || !password) {
      throw new Errors.ForbiddenError('Missing Credentials')
    }
    const createdUser = await UserService.createUser(userName, password, [
      'MEMBER',
    ])
    const { roles: createdUserRoles, id: userId } = createdUser
    const token = generateAccessToken({
      userId,
      roles: createdUserRoles,
    })
    return {
      token,
    }
  }
}
