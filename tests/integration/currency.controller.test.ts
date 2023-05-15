import { CurrencyService } from '../../src/services'
import { DataManagerService } from '../../src/services/DataManagerService'
import { DOMAIN_OWNER_ID } from '../setup/constants'
import request from '../setup/server'

let currencyId: string

beforeEach(async () => {
  const newCurrency = await DataManagerService.createNewCurrency(
    {
      name: 'TestCurerency',
      symbol: 'TCR',
      value: 0.5,
    },
    DOMAIN_OWNER_ID
  )
  currencyId = newCurrency.id
})

describe('Currencies Controller', () => {
  describe('GET /currencies', () => {
    it('should return a list of all currencies', async () => {
      const { body } = await request().get('/currencies').send()

      const { results } = body
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].name).toBe('TestCurerency')
      expect(results[0].symbol).toBe('TCR')
      expect(results[0].value).toBe(0.5)
    })
  })

  describe('GET /currencies/:id', () => {
    it('should return a specific currency', async () => {
      const { body } = await request().get(`/currencies/${currencyId}`).send()

      const { id, name, symbol, value } = body

      expect(id).toBe(currencyId)
      expect(name).toBe('TestCurerency')
      expect(symbol).toBe('TCR')
      expect(value).toBe(0.5)
    })
  })

  describe('POST /currencies', () => {
    it('should create a new currency', async () => {
      const { body } = await request().post(`/currencies`).send({
        name: 'SentCurrency',
        symbol: 'SCR',
        value: 5,
        referenceCurrencyId: currencyId,
      })

      const dbCurrency = await CurrencyService.getCurrencyById(body.id)

      if (!dbCurrency) {
        throw new Error('Currency not found')
      }

      expect(dbCurrency.name).toBe('SentCurrency')
      expect(dbCurrency.symbol).toBe('SCR')
      expect(dbCurrency.value).toBe(5)
      expect(dbCurrency.referenceCurrencyId).toBe(currencyId)
    })
  })
})
