import { User } from '../../src/models'
import { UserService } from '../../src/services'
import request from '../setup/server'

describe('Transactions Controller', () => {
  describe('POST /auth', () => {
    it('should validate user credentials', async () => {
      const { body } = await request().post(`/auth`).send({
        userName: 'DomainOwner',
        password: 'ownerPassword',
      })

      expect(body).toHaveProperty('token')
    })

    it('should throw an error if credentials are invalid', async () => {
      const { body } = await request().post(`/auth`).send({
        userName: 'DomainOwner',
        password: 'invalidPassword',
      })

      expect(body.error).toBe('Invalid credentials')
    })
  })

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const { body } = await request().post(`/auth/register`).send({
        userName: 'NewUser',
        password: 'newUserPassword',
      })

      await UserService.deleteUser('NewUser')
      expect(body).toHaveProperty('token')
    })

    it('should return an error if user already exists', async () => {
      await UserService.createUser('NewUser', 'newUserPassword', ['MEMBER'])
      const { body } = await request().post(`/auth/register`).send({
        userName: 'NewUser',
        password: 'newUserPassword',
      })

      await UserService.deleteUser('NewUser')

      expect(body.error).toBe('User already exists')
    })
  })
})
