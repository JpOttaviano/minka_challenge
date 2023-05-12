import { NotFoundError } from 'typescript-rest/dist/server/model/errors'
import { User, Currency, Account } from '../models'

export class AccountService {
  public async getAccountById(
    accountId: number,
    userId?: number
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

  public async getAccountsByUserId(userId: number): Promise<Account[]> {
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

  public async createAccount(
    userId: number,
    currencyId: number
  ): Promise<Account> {
    return await Account.create({
      userId,
      currencyId,
      balance: 0,
    })
  }

  public async updateAccountBalance(
    accountId: number,
    userId: number,
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
}
