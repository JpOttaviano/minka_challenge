import {
  ProjectService,
  TransactionService,
  UserService,
} from '../../src/services'
import { DataManagerService } from '../../src/services/DataManagerService'
import { DOMAIN_OWNER_ID } from '../setup/constants'
import request from '../setup/server'

describe('Projects Controller', () => {
  describe('GET /projects', () => {
    it('should return a list of all projects', async () => {
      const testProject = await DataManagerService.createNewProject(
        {
          name: 'TestProject',
          description: 'This is a description',
          currency: {
            name: 'TestCurerency',
            symbol: 'TCR',
            value: 0.5,
          },
          initialSupply: 10000,
        },
        DOMAIN_OWNER_ID
      )

      const { body } = await request()
        .get('/projects?page=1&pagesize=20')
        .send()

      const { results } = body

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].id).toBe(testProject.id)
      expect(results[0].name).toBe('TestProject')
      expect(results[0].description).toBe('This is a description')
      expect(results[0].account.id).toBe(testProject.accountId)
      expect(results[0].account.userId).toBe(DOMAIN_OWNER_ID)
      expect(results[0].account.currency.name).toBe('TestCurerency')
    })
  })

  describe('POST /projects', () => {
    it('should create a new project', async () => {
      const referenceCurrency = await DataManagerService.createNewCurrency(
        {
          name: 'ReferenceCurrency',
          symbol: 'RCR',
          value: 1,
        },
        DOMAIN_OWNER_ID
      )

      const { body } = await request()
        .post('/projects')
        .send({
          name: 'TestProject',
          description: 'Created by test',
          userId: DOMAIN_OWNER_ID,
          currency: {
            name: 'ProjectCurrency',
            symbol: 'PCR',
            value: 0.5,
            referenceCurrencyId: referenceCurrency.id,
          },
          initialSupply: 8000,
        })

      const dbProject = await ProjectService.getProjectById(body.id)

      if (!dbProject) {
        throw new Error('Project not found')
      }

      expect(dbProject.id).toBe(body.id)
      expect(dbProject.name).toBe('TestProject')
      expect(dbProject.description).toBe('Created by test')
      expect(dbProject.accountId).toBe(body.accountId)
    })
  })

  describe('GET /projects/:id', () => {
    it('should return a specific project', async () => {
      const testProject = await DataManagerService.createNewProject(
        {
          name: 'TestProject',
          description: 'This is a description',
          currency: {
            name: 'TestCurerency',
            symbol: 'TCR',
            value: 0.5,
          },
          initialSupply: 10000,
        },
        DOMAIN_OWNER_ID
      )

      const { body } = await request()
        .get('/projects/' + testProject.id)
        .send()

      expect(body.id).toBe(testProject.id)
      expect(body.name).toBe('TestProject')
      expect(body.description).toBe('This is a description')
    })
  })

  describe('GET /projects/users/:id', () => {
    it('should return a list of all projects for a specific user', async () => {
      const testProject = await DataManagerService.createNewProject(
        {
          name: 'TestProject',
          description: 'This is a description',
          currency: {
            name: 'TestCurerency',
            symbol: 'TCR',
            value: 0.5,
          },
          initialSupply: 10000,
        },
        DOMAIN_OWNER_ID
      )

      const { body } = await request()
        .get('/projects/users/' + DOMAIN_OWNER_ID)
        .send()

      const { results } = body
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].id).toBe(testProject.id)
      expect(results[0].name).toBe('TestProject')
      expect(results[0].description).toBe('This is a description')
    })
  })

  describe('POST /projects/:id/invest', () => {
    it('should return a transaction when investing in a project', async () => {
      const referenceCurrency = await DataManagerService.createNewCurrency(
        {
          name: 'ReferenceCurrency',
          symbol: 'RCR',
          value: 1,
        },
        DOMAIN_OWNER_ID
      )

      const newUser = await UserService.createUser('Test User', '123456', [
        'MEMBER',
      ])

      const testProject = await DataManagerService.createNewProject(
        {
          name: 'TestProject',
          description: 'This is a description',
          currency: {
            name: 'TestCurerency',
            symbol: 'TCR',
            value: 0.5,
            referenceCurrencyId: referenceCurrency.id,
          },
          initialSupply: 10000,
        },
        newUser.id
      )
      const paymentAcccount = await DataManagerService.createNewAccount(
        {
          currencyId: referenceCurrency.id,
          initialBalance: 500,
        },
        DOMAIN_OWNER_ID,
        'PERSONAL'
      )

      const { body } = await request()
        .post(`/projects/${testProject.id}/invest`)
        .send({
          amount: 100,
        })

      const paymentTransaction =
        await TransactionService.getAllAccountTransactions(paymentAcccount.id)

      await UserService.deleteUser('Test User')

      expect(body.id).toBeDefined()
      expect(body.amount).toBe(100)
      // Check that payment is relative to value.
      expect(paymentTransaction[0].amount).toBe(50)
    })

    it('Should return an error when investing in a project with insufficient currency', async () => {
      const referenceCurrency = await DataManagerService.createNewCurrency(
        {
          name: 'ReferenceCurrency',
          symbol: 'RCR',
          value: 1,
        },
        DOMAIN_OWNER_ID
      )

      const newUser = await UserService.createUser('Test User', '123456', [
        'MEMBER',
      ])

      const testProject = await DataManagerService.createNewProject(
        {
          name: 'TestProject',
          description: 'This is a description',
          currency: {
            name: 'TestCurerency',
            symbol: 'TCR',
            value: 0.5,
            referenceCurrencyId: referenceCurrency.id,
          },
          initialSupply: 20,
        },
        newUser.id
      )
      await DataManagerService.createNewAccount(
        {
          currencyId: referenceCurrency.id,
          initialBalance: 500,
        },
        DOMAIN_OWNER_ID,
        'PERSONAL'
      )

      const { body } = await request()
        .post(`/projects/${testProject.id}/invest`)
        .send({
          amount: 100,
        })

      await UserService.deleteUser('Test User')

      expect(body.error).toBe('Project does not have enough currency.')
    })

    it('Should return an error when investing without enough payment currency', async () => {
      const referenceCurrency = await DataManagerService.createNewCurrency(
        {
          name: 'ReferenceCurrency',
          symbol: 'RCR',
          value: 1,
        },
        DOMAIN_OWNER_ID
      )

      const newUser = await UserService.createUser('Test User', '123456', [
        'MEMBER',
      ])

      const testProject = await DataManagerService.createNewProject(
        {
          name: 'TestProject',
          description: 'This is a description',
          currency: {
            name: 'TestCurerency',
            symbol: 'TCR',
            value: 0.5,
            referenceCurrencyId: referenceCurrency.id,
          },
          initialSupply: 500,
        },
        newUser.id
      )
      await DataManagerService.createNewAccount(
        {
          currencyId: referenceCurrency.id,
          initialBalance: 10,
        },
        DOMAIN_OWNER_ID,
        'PERSONAL'
      )

      const { body } = await request()
        .post(`/projects/${testProject.id}/invest`)
        .send({
          amount: 100,
        })

      await UserService.deleteUser('Test User')

      expect(body.error).toBe(
        'User does not have enough currency to invest in project.'
      )
    })
  })
})
