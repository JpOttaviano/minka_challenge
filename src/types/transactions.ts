export type CreateTransaction = {
  currencyId: string
  amount: number
  date: Date
  accountId: string
  destinyAccountId: string
}

export type TransactionFilter = {
  userId: string
  accountId: string
  from?: Date
  to?: Date
}
