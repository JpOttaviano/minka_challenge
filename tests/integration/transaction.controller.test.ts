import { AccountService } from '../../src/services'
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

describe('Transactions Controller', () => {
  describe('GET /transactions', () => {
    it('should return a list of transactions for a specific account', async () => {
      const originAccount = await DataManagerService.createNewAccount(
        {
          currencyId,
          initialBalance: 10000,
        },
        DOMAIN_OWNER_ID,
        'PERSONAL'
      )

      const destiniyAccount = await DataManagerService.createNewAccount(
        {
          currencyId,
          initialBalance: 500,
        },
        DOMAIN_OWNER_ID,
        'PERSONAL'
      )

      await AccountService.transferCurrency(
        originAccount.id,
        destiniyAccount.id,
        250,
        DOMAIN_OWNER_ID
      )

      await AccountService.transferCurrency(
        originAccount.id,
        destiniyAccount.id,
        500,
        DOMAIN_OWNER_ID
      )

      await AccountService.transferCurrency(
        originAccount.id,
        destiniyAccount.id,
        100,
        DOMAIN_OWNER_ID
      )

      await AccountService.transferCurrency(
        destiniyAccount.id,
        originAccount.id,
        545,
        DOMAIN_OWNER_ID
      )

      const { body } = await request()
        .get(`/transactions?accountId=${originAccount.id}`)
        .send()

      const { results } = body
      expect(results.length).toBe(4)
      expect(results[0]).toHaveProperty('id')
      expect(results[0]).toHaveProperty('accountId')
      expect(results[0]).toHaveProperty('destinyAccountId')
      expect(results[0]).toHaveProperty('amount')
      expect(results[0]).toHaveProperty('date')
    })
  })
})
