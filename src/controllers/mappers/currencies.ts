import { Currency } from '../../models'
import { CurrencyResponse } from '../../types'

export function mapCurrencyResponse(currency: Currency): CurrencyResponse {
  const { id, name, symbol, value, referenceCurrency } = currency

  return {
    id,
    name,
    symbol,
    value,
    ...(referenceCurrency && {
      referenceCurrency: mapCurrencyResponse(referenceCurrency),
    }),
  }
}
