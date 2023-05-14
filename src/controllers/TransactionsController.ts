import { GET, POST, Path, PathParam, QueryParam } from 'typescript-rest'
import { BaseController } from './BaseController'
import {
  CreateTransaction,
  PageRequest,
  PageResponse,
  TransactionFilter,
} from '../types'
import { Transaction } from '../models'
import { UnauthorizedError } from 'typescript-rest/dist/server/model/errors'
import { TransactionService } from '../services'
import { parseQueryDate } from '../utils/dates'

@Path('/transactions')
export class TransactionsController extends BaseController {
  /**
   * Get a list of transactions for a given account
   * @param accountId
   * @param pageSize
   * @param page
   */
  @GET
  public async list(
    @QueryParam('accountId') accountId: string,
    @QueryParam('from') from?: string,
    @QueryParam('to') to?: string,
    @QueryParam('pageSize') pageSize?: number,
    @QueryParam('page') page?: number
  ): Promise<PageResponse<Transaction>> {
    const { userId, roles } = this.getSession()

    if (!roles.includes('MEMBER')) {
      throw new UnauthorizedError('Resource not available')
    }

    const searchInput: PageRequest<TransactionFilter> = {
      filters: {
        accountId,
        from: parseQueryDate(from),
        to: parseQueryDate(to),
        userId,
      },
      page: {
        size: pageSize,
        page,
      },
    }

    return await TransactionService.getPaginatedAccountTransactions(searchInput)
  }
}
