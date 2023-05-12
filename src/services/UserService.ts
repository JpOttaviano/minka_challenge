import {
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from 'typescript-rest/dist/server/model/errors'
import { User } from '../models'
import { encrypt, decrypt } from '../utils/crypto'

export class UserService {
  private static async getUserByUserName(
    usernName: string
  ): Promise<User | null> {
    return await User.findOne({
      where: {
        name: usernName,
      },
    })
  }

  public static async createUser(
    userName: string,
    password: string,
    roles: string[]
  ): Promise<User> {
    const token = encrypt(password)
    const matchingUser = await this.getUserByUserName(userName)

    if (!!matchingUser) {
      throw new UnprocessableEntityError('User already exists')
    }

    return await User.create({
      name: userName,
      token,
      roles,
    })
  }

  public static async validateUser(
    userName: string,
    password: string
  ): Promise<User> {
    const foundUser = await this.getUserByUserName(userName)

    if (!foundUser) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const decryptedPassword = decrypt(foundUser.token)

    if (decryptedPassword !== password) {
      throw new UnauthorizedError('Invalid credentials')
    }

    return foundUser
  }
}
