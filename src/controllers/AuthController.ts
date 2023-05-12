import { POST, Path, Errors } from 'typescript-rest'
import { generateAccessToken } from '../utils/crypto'
import { BaseController } from './BaseController'
import { UserService } from '../services'

@Path('/auth')
export class AuthController extends BaseController {
  @POST
  public async login(body: any): Promise<{ token: string }> {
    const { userId, password } = body
    if (!userId || !password) {
      throw new Errors.ForbiddenError('Missing Credentials')
    }
    const validatedUser = await UserService.validateUser(userId, password)
    const { roles } = validatedUser
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
    const { userId, password } = body
    if (!userId || !password) {
      throw new Errors.ForbiddenError('Missing Credentials')
    }
    const createdUser = await UserService.createUser(userId, password, [
      'MEMBER',
    ])
    const { roles: createdUserRoles } = createdUser
    const token = generateAccessToken({
      userId,
      roles: createdUserRoles,
    })
    return {
      token,
    }
  }
}
