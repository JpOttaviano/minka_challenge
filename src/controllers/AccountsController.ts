import { POST, Path, GET, QueryParam, PathParam } from 'typescript-rest'
import { BaseController } from './BaseController'
import { PageRequest, PageResponse } from '../types'
import { Account, Transaction } from '../models'
import { AccountFilter, CreateAccount, CreateTransfer } from '../types/accounts'
import { AccountService } from '../services'
import { UnauthorizedError } from 'typescript-rest/dist/server/model/errors'

@Path('/accounts')
export class AccountsController extends BaseController {
  @GET
  public async list(
    @QueryParam('pageSize') pageSize?: number,
    @QueryParam('page') page?: number
  ): Promise<PageResponse<Account>> {
    const { userId } = this.getSession()
    const searchInput: PageRequest<AccountFilter> = {
      filters: {
        userId,
      },
      page: {
        size: pageSize,
        page,
      },
    }

    return await AccountService.getPaginatedAccountsByUserId(searchInput)
  }

  @POST
  public async createAccount(newAccount: CreateAccount): Promise<Account> {
    const { userId } = this.getSession()
    const { currencyId, initialBalance } = newAccount
    return await AccountService.createAccount(
      userId,
      currencyId,
      'PERSONAL',
      initialBalance
    )
  }

  @POST
  @Path('/transfer')
  public async transfer(newTransfer: CreateTransfer): Promise<Transaction> {
    const { userId, roles } = this.getSession()
    if (!roles.includes('MEMBER')) {
      throw new UnauthorizedError('Resource not available')
    }

    const { accountId, destinyAccountId, amount } = newTransfer
    return await AccountService.transferCurrency(
      accountId,
      destinyAccountId,
      amount,
      userId
    )
  }

  @GET
  @Path('/:accountId')
  public async getAccountById(
    @PathParam('accountId') accountId: string
  ): Promise<Account | null> {
    const { userId } = this.getSession()
    return await AccountService.getAccountById(accountId, userId)
  }
}
