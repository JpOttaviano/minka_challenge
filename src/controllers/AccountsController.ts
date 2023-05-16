import { POST, Path, GET, QueryParam, PathParam } from 'typescript-rest'
import { BaseController } from './BaseController'
import { PageRequest, PageResponse, TransactionResponse } from '../types'
import {
  AccountFilter,
  AccountResponse,
  CreateAccount,
  CreateTransfer,
} from '../types/accounts'
import { AccountService, DataManagerService } from '../services'
import { UnauthorizedError } from 'typescript-rest/dist/server/model/errors'
import { mapAccountResponse } from './mappers/accounts'
import { mapTransactionResponse } from './mappers/transactions'

@Path('/accounts')
export class AccountsController extends BaseController {
  @GET
  public async list(
    @QueryParam('pageSize') pageSize?: number,
    @QueryParam('page') page?: number
  ): Promise<PageResponse<AccountResponse>> {
    const { userId, roles } = this.getSession()
    if (!roles.includes('MEMBER') || !roles.includes('DOMAIN_OWNER')) {
      throw new UnauthorizedError('Resource not available')
    }
    const searchInput: PageRequest<AccountFilter> = {
      filters: {
        userId,
      },
      page: {
        size: pageSize,
        page,
      },
    }

    const pageResponse = await AccountService.getPaginatedAccountsByUserId(
      searchInput
    )
    const { results } = pageResponse
    return {
      ...pageResponse,
      results: results.map((account) => mapAccountResponse(account)),
    }
  }

  @POST
  public async createAccount(
    newAccount: CreateAccount
  ): Promise<AccountResponse> {
    const { userId, roles } = this.getSession()
    if (!roles.includes('MEMBER') || !roles.includes('DOMAIN_OWNER')) {
      throw new UnauthorizedError('Resource not available')
    }
    const account = await DataManagerService.createNewAccount(
      {
        ...newAccount,
        initialBalance: roles.includes('DOMAIN_OWNER')
          ? newAccount.initialBalance
          : 0,
      },
      userId
    )
    return mapAccountResponse(account)
  }

  @POST
  @Path('/transfer')
  public async transfer(
    newTransfer: CreateTransfer
  ): Promise<TransactionResponse> {
    const { userId, roles } = this.getSession()
    if (!roles.includes('MEMBER')) {
      throw new UnauthorizedError('Resource not available')
    }

    const { accountId, destinyAccountId, amount } = newTransfer
    const treansaction = await AccountService.transferCurrency(
      accountId,
      destinyAccountId,
      amount,
      userId
    )

    return mapTransactionResponse(treansaction)
  }

  @GET
  @Path('/:accountId')
  public async getAccountById(
    @PathParam('accountId') accountId: string
  ): Promise<AccountResponse | null> {
    const { userId } = this.getSession()
    const account = await AccountService.getAccountById(accountId, userId)
    return account ? mapAccountResponse(account) : null
  }
}
