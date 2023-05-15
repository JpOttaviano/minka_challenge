import { AccountService, TransactionService } from '../../src/services'
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

describe('Accounts Controller', () => {
  describe('GET /accounts', () => {
    it('should return a list of users accounts', async () => {
      await DataManagerService.createNewAccount(
        {
          currencyId,
          initialBalance: 250,
        },
        DOMAIN_OWNER_ID,
        'PERSONAL'
      )
      const { body } = await request()
        .get('/accounts?page=0&pagesize=20')
        .send()

      const { results } = body
      expect(results.length).toBeGreaterThan(0)
      expect(results[0]).toHaveProperty('id')
      expect(results[0]).toHaveProperty('userId')
      expect(results[0]).toHaveProperty('currencyId')
      expect(results[0]).toHaveProperty('balance')
    })
  })

  describe('GET /accounts/:id', () => {
    it('should return a single account', async () => {
      const newAccount = await DataManagerService.createNewAccount(
        {
          currencyId,
          initialBalance: 250,
        },
        DOMAIN_OWNER_ID,
        'PERSONAL'
      )

      const { body } = await request().get(`/accounts/${newAccount.id}`).send()

      const { id, balance, userId } = body

      expect(id).toBe(newAccount.id)
      expect(balance).toBe(250)
      expect(userId).toBe(DOMAIN_OWNER_ID)
    })
  })

  describe('POST /accounts', () => {
    it('should create an account', async () => {
      const { body } = await request().post(`/accounts`).send({
        currencyId,
        initialBalance: 785,
      })

      const dbAccount = await AccountService.getAccountById(body.id)

      if (!dbAccount) {
        throw new Error('Account not found')
      }

      expect(dbAccount.id).toBe(body.id)
      expect(dbAccount.balance).toBe(785)
      expect(dbAccount.userId).toBe(DOMAIN_OWNER_ID)
      expect(dbAccount.currencyId).toBe(currencyId)
    })
  })

  describe('POST /accounts/transfer', () => {
    it('should transfer between 2 accounts', async () => {
      const originAccount = await DataManagerService.createNewAccount(
        {
          currencyId,
          initialBalance: 500,
        },
        DOMAIN_OWNER_ID,
        'PERSONAL'
      )

      const destiniyAccount = await DataManagerService.createNewAccount(
        {
          currencyId,
          initialBalance: 250,
        },
        DOMAIN_OWNER_ID,
        'PERSONAL'
      )

      const { body } = await request().post(`/accounts/transfer`).send({
        accountId: originAccount.id,
        destinyAccountId: destiniyAccount.id,
        amount: 250,
      })

      const dbOriginAccount = await AccountService.getAccountById(
        originAccount.id
      )
      const dbDestinyAccount = await AccountService.getAccountById(
        destiniyAccount.id
      )

      const dbTransaction = await TransactionService.getTransactionById(body.id)

      if (!dbOriginAccount || !dbDestinyAccount || !dbTransaction) {
        throw new Error('Account or transaction not found')
      }

      expect(dbOriginAccount.balance).toBe(250)
      expect(dbDestinyAccount.balance).toBe(500)

      expect(dbTransaction.date).toBe(body.date)
      expect(dbTransaction.amount).toBe(250)
    })
  })
})
