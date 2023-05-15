import { ProjectService } from '../../src/services'
import { DataManagerService } from '../../src/services/DataManagerService'
import { DOMAIN_OWNER_ID } from '../setup/constants'
import request from '../setup/server'

describe('Projects Controller', () => {
  describe('GET /projects', () => {
    it('should return a list of all projects', async () => {
      const testProject = await DataManagerService.createNewProject({
        name: 'TestProject',
        description: 'This is a description',
        userId: DOMAIN_OWNER_ID,
        currency: {
          name: 'TestCurerency',
          symbol: 'TCR',
          value: 0.5,
        },
        initialSupply: 10000,
      })

      const { body } = await request()
        .get('/projects?page=0&pagesize=20')
        .send()

      const { results } = body

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].id).toBe(testProject.id)
      expect(results[0].name).toBe('TestProject')
      expect(results[0].description).toBe('This is a description')
      expect(results[0].userId).toBe(DOMAIN_OWNER_ID)
      expect(results[0].currency.name).toBe('TestCurerency')
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
      expect(dbProject.accountId).toBe(body.account.id)
    })
  })

  describe('GET /projects/:id', () => {
    it('should return a specific project', async () => {
      const testProject = await DataManagerService.createNewProject({
        name: 'TestProject',
        description: 'This is a description',
        userId: DOMAIN_OWNER_ID,
        currency: {
          name: 'TestCurerency',
          symbol: 'TCR',
          value: 0.5,
        },
        initialSupply: 10000,
      })

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
      const testProject = await DataManagerService.createNewProject({
        name: 'TestProject',
        description: 'This is a description',
        userId: DOMAIN_OWNER_ID,
        currency: {
          name: 'TestCurerency',
          symbol: 'TCR',
          value: 0.5,
        },
        initialSupply: 10000,
      })

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
})
