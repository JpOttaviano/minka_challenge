import { Transaction } from '../../models'
import { TransactionResponse } from '../../types'

export function mapTransactionResponse(
  transaction: Transaction
): TransactionResponse {
  const { id, amount, date, accountId, destinyAccountId } = transaction

  return {
    id,
    amount,
    date,
    accountId,
    destinyAccountId,
  }
}
