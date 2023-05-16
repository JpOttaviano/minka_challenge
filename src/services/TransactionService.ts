import { NotFoundError } from 'typescript-rest/dist/server/model/errors'
import { Transaction } from '../models'
import { PageRequest, PageResponse } from '../types'
import { CreateTransaction, TransactionFilter } from '../types/transactions'
import { SearchService } from './SearchService'
import { Op } from 'sequelize'
import { AccountService } from './AccountService'

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

  public static async getPaginatedAccountTransactions(
    search: PageRequest<TransactionFilter>
  ): Promise<PageResponse<Transaction>> {
    const { filters, page = SearchService.DEFAULT_PAGE } = search
    const pageSize = SearchService.getPageSize(page.size)
    const { userId, accountId, from, to } = filters

    if (!accountId) {
      throw new NotFoundError('AccountId is required')
    }

    const matchingAccount = await AccountService.getAccountByAccountIdAndUserId(
      accountId,
      userId
    )

    if (!matchingAccount) {
      throw new NotFoundError('Account not found')
    }

    const where: any = {
      [Op.or]: [{ accountId }, { destinyAccountId: accountId }],
    }

    if (from || to) {
      const dateFiltering: any = {}
      if (from) {
        dateFiltering[Op.gte] = from
      }
      if (to) {
        to.setHours(23, 59, 59, 999)
        dateFiltering[Op.lte] = to
      }
      where['date'] = dateFiltering
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: SearchService.getOffset(page),
    })

    return SearchService.getPageResponse(rows, count, page)
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
