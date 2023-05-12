import { AccountType } from '../models'

export type CreateAccount = {
  currencyId: string
  initialBalance?: number
}

export type AccountFilter = {
  userId: string
}
