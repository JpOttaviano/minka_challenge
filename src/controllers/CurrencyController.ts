import { GET, POST, Path, PathParam, QueryParam } from 'typescript-rest'
import { BaseController } from './BaseController'
import {
  CreateCurrency,
  CurrencyResponse,
  PageRequest,
  PageResponse,
} from '../types'
import { UnauthorizedError } from 'typescript-rest/dist/server/model/errors'
import { CurrencyService } from '../services'
import { mapCurrencyResponse } from './mappers/currencies'

@Path('/currencies')
export class CurrencyController extends BaseController {
  @POST
  public async createCurrency(body: CreateCurrency): Promise<CurrencyResponse> {
    const { userId, roles } = this.getSession()
    if (!roles.includes('DOMAIN_OWNER')) {
      throw new UnauthorizedError('Only domain owner can create currencies')
    }
    const { name, symbol, referenceCurrencyId, value } = body
    const currency = await CurrencyService.createCurrency(
      name,
      symbol,
      userId,
      referenceCurrencyId,
      value
    )
    return mapCurrencyResponse(currency)
  }

  @GET
  public async listCurrencies(
    @QueryParam('pageSize') pageSize?: number,
    @QueryParam('page') page?: number
  ): Promise<PageResponse<CurrencyResponse>> {
    const { roles } = this.getSession()
    if (!roles.includes('MEMBER')) {
      throw new UnauthorizedError('Only members can list currencies')
    }

    const searchInput: PageRequest<{}> = {
      filters: {},
      page: {
        size: pageSize,
        page,
      },
    }
    const pagreResponse = await CurrencyService.getPaginatedCurrencies(
      searchInput
    )
    const { results } = pagreResponse
    return {
      ...pagreResponse,
      results: results.map(mapCurrencyResponse),
    }
  }

  @GET
  @Path('/:currencyId')
  public async getCurrencyById(
    @PathParam('currencyId') currencyId: string
  ): Promise<CurrencyResponse | null> {
    const { roles } = this.getSession()
    if (!roles.includes('MEMBER')) {
      throw new UnauthorizedError('Only members can get currencies')
    }
    const currency = await CurrencyService.getCurrencyById(currencyId)
    if (!currency) {
      return null
    }

    return mapCurrencyResponse(currency)
  }
}
