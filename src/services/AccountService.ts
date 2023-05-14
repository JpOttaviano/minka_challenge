import {
  NotFoundError,
  UnauthorizedError,
} from 'typescript-rest/dist/server/model/errors'
import { User, Currency, Account, Transaction } from '../models'
import { AccountType } from '../models/types/Accounts'
import { PageRequest, PageResponse } from '../types'
import { TransactionService } from './TransactionService'
import { AccountFilter } from '../types/accounts'
import { SearchService } from './SearchService'

export class AccountService {
  public static async getAccountById(
    accountId: string,
    userId?: string
  ): Promise<Account | null> {
    const whereClause = {
      id: accountId,
      ...(userId && { userId }),
    }

    return await Account.findOne({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: Currency,
          as: 'currency',
        },
      ],
    })
  }

  public static async getAccountByAccountIdAndUserId(
    accountId: string,
    userId: string
  ): Promise<Account | null> {
    return await Account.findOne({
      where: {
        id: accountId,
        userId,
      },
    })
  }

  public static async getAccountsByUserId(userId: string): Promise<Account[]> {
    return await Account.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: Currency,
          as: 'currency',
        },
      ],
    })
  }

  public static async getPaginatedAccountsByUserId(
    search: PageRequest<AccountFilter>
  ): Promise<PageResponse<Account>> {
    const { filters, page = SearchService.DEFAULT_PAGE } = search
    const pageSize = SearchService.getPageSize(page.size)
    const { userId } = filters

    const where = {
      userId,
    }

    const { count, rows } = await Account.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: SearchService.getOffset(page),
      include: [
        {
          model: Currency,
          as: 'currency',
        },
      ],
    })

    return SearchService.getPageResponse(rows, count, page)
  }

  public static async getAccountByUserIdAndCurrencyId(
    userId: string,
    currencyId: string
  ): Promise<Account | null> {
    return await Account.findOne({
      where: {
        userId,
        currencyId,
      },
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: Currency,
          as: 'currency',
        },
      ],
    })
  }

  public static async createAccount(
    userId: string,
    currencyId: string,
    type: AccountType,
    initialBalance = 0
  ): Promise<Account> {
    return await Account.create({
      userId,
      type,
      currencyId,
      balance: initialBalance,
    })
  }

  public static async updateAccountBalance(
    accountId: string,
    userId: string,
    newBalance: number
  ): Promise<void> {
    const account = await this.getAccountById(accountId, userId)

    if (!account) {
      throw new NotFoundError('Account not found')
    }

    await account.update({
      balance: newBalance,
    })
  }

  public static async transferCurrency(
    originAccountId: string,
    destinationAccountId: string,
    amount: number,
    userId: string
  ): Promise<Transaction> {
    const originAccount = await this.getAccountById(originAccountId)
    const destinationAccount = await this.getAccountById(destinationAccountId)

    if (!originAccount || !destinationAccount) {
      throw new NotFoundError('Account not found')
    }

    if (originAccount.userId !== userId) {
      throw new UnauthorizedError(
        'You are not authorized to perform this action'
      )
    }

    const { currencyId, balance: originBalance } = originAccount
    const { balance: destinationAccountBalance } = destinationAccount
    if (originBalance < amount) {
      throw new Error('Insufficient funds')
    }

    if (currencyId !== destinationAccount.currencyId) {
      throw new Error('Accounts must have the same currency')
    }

    // Create Transaction
    const transaction = await TransactionService.createTransaction({
      accountId: originAccountId,
      amount,
      currencyId,
      destinyAccountId: destinationAccountId,
      date: new Date(),
    })

    // Update balances
    await originAccount.update({
      balance: originBalance - amount,
    })

    await destinationAccount.update({
      balance: destinationAccountBalance + amount,
    })

    return transaction
  }
}
