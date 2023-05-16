import { Account } from '../../models'
import { AccountResponse } from '../../types/accounts'
import { mapCurrencyResponse } from './currencies'

export function mapAccountResponse(account: Account): AccountResponse {
  const { id, balance, type, currency, userId, currencyId } = account

  return {
    id,
    balance,
    type,
    userId,
    ...(currency
      ? { currency: mapCurrencyResponse(currency) }
      : { currencyId }),
  }
}
