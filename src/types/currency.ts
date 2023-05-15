export type CreateCurrency = {
  name: string
  symbol: string
  value: number
  referenceCurrencyId?: string
}

export type CurrencyResponse = {
  id: string
  name: string
  symbol: string
  referenceCurrency?: CurrencyResponse
  value: number
}
