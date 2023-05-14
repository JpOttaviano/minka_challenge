import { GET, POST, Path, PathParam, QueryParam } from 'typescript-rest'
import { BaseController } from './BaseController'
import { Currency } from '../models'
import { CreateCurrency, PageRequest, PageResponse } from '../types'
import { UnauthorizedError } from 'typescript-rest/dist/server/model/errors'
import { CurrencyService } from '../services'

@Path('/currencies')
export class CurrencyController extends BaseController {
  @POST
  public async createCurrency(body: CreateCurrency): Promise<Currency> {
    const { userId, roles } = this.getSession()
    if (!roles.includes('DOMAIN_OWNER')) {
      throw new UnauthorizedError('Only domain owners can create currencies')
    }
    const { name, symbol, referenceCurrencyId, value } = body
    return await CurrencyService.createCurrency(
      name,
      symbol,
      referenceCurrencyId,
      value
    )
  }

  @GET
  public async listCurrencies(
    @QueryParam('pageSize') pageSize?: number,
    @QueryParam('page') page?: number
  ): Promise<PageResponse<Currency>> {
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
    return await CurrencyService.getPaginatedCurrencies(searchInput)
  }

  @GET
  @Path('/:currencyId')
  public async getCurrencyById(
    @PathParam('currencyId') currencyId: string
  ): Promise<Currency | null> {
    const { roles } = this.getSession()
    if (!roles.includes('MEMBER')) {
      throw new UnauthorizedError('Only members can get currencies')
    }
    return await CurrencyService.getCurrencyById(currencyId)
  }
}
