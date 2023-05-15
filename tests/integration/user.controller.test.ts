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
  })

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const { body } = await request().post(`/auth/register`).send({
        userName: 'NewUser',
        password: 'newUserPassword',
      })

      expect(body).toHaveProperty('token')
    })
  })
})
