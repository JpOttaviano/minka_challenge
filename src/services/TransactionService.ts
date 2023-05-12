import { Transaction } from '../models'
import { CreateTransaction } from '../types/transactions'
import { CurrencyService } from './CurrencyService'

export class TransactionService {
  public static async getTransactionById(
    transactionId: string
  ): Promise<Transaction | null> {
    return await Transaction.findOne({
      where: {
        id: transactionId,
      },
    })
  }

  public static async getAllAccountTransactions(
    accountId: string
  ): Promise<Transaction[]> {
    return await Transaction.findAll({
      where: {
        accountId,
      },
    })
  }

  public static async createTransaction(
    transaction: CreateTransaction
  ): Promise<Transaction> {
    return await Transaction.create(transaction)
  }

  public static async createTransactions(
    transactions: CreateTransaction[]
  ): Promise<Transaction[]> {
    return await Transaction.bulkCreate(transactions)
  }
}
