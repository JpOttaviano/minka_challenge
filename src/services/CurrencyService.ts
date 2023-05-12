import { Currency } from '../models'
import { PageRequest, PageResponse } from '../types'
import { SearchService } from './SearchService'

export class CurrencyService {
  public static async getCurrencyById(
    currencyId: string
  ): Promise<Currency | null> {
    return await Currency.findOne({
      where: {
        id: currencyId,
      },
    })
  }

  public static async getCurrencyBySymbol(
    symbol: string
  ): Promise<Currency | null> {
    return await Currency.findOne({
      where: {
        symbol,
      },
    })
  }

  public static async getPaginatedCurrencies(
    search: PageRequest<{}>
  ): Promise<PageResponse<Currency>> {
    const { page = SearchService.DEFAULT_PAGE } = search
    const pageSize = SearchService.getPageSize(page.size)

    const { count, rows } = await Currency.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: SearchService.getOffset(page),
    })

    return SearchService.getPageResponse(rows, count, page)
  }

  public static async createCurrency(
    name: string,
    symbol: string,
    referenceCurrencyId?: string,
    value?: number
  ): Promise<Currency> {
    const existingCurrency = await CurrencyService.getCurrencyBySymbol(symbol)

    if (existingCurrency) {
      throw new Error(`Currency ${symbol} already exists`)
    }

    console.info(`Creating currency ${symbol}`)
    return await Currency.create({
      name,
      symbol,
      referenceCurrencyId,
      value,
    })
  }
}
