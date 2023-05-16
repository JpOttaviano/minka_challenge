import { Currency } from '../models'
import { CurrencyResponse } from './currency'

export type CreateAccount = {
  currencyId: string
  initialBalance?: number
}

export type AccountFilter = {
  userId: string
}

export type CreateTransfer = {
  accountId: string
  destinyAccountId: string
  amount: number
}

export type AccountResponse = {
  id: string
  balance: number
  type: string
  userId: string
  currencyId?: string
  currency?: CurrencyResponse
}
