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
