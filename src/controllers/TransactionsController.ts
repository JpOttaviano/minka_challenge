import { GET, POST, Path, QueryParam } from 'typescript-rest'
import { BaseController } from './BaseController'
import {
  PageRequest,
  PageResponse,
  TransactionFilter,
  TransactionResponse,
} from '../types'
import { UnauthorizedError } from 'typescript-rest/dist/server/model/errors'
import { TransactionService } from '../services'
import { parseQueryDate } from '../utils/dates'
import { mapTransactionResponse } from './mappers/transactions'

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
  ): Promise<PageResponse<TransactionResponse>> {
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

    const paginatedResult =
      await TransactionService.getPaginatedAccountTransactions(searchInput)
    const { results } = paginatedResult
    return {
      ...paginatedResult,
      results: results.map((transaction) =>
        mapTransactionResponse(transaction)
      ),
    }
  }
}
