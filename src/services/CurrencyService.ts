import { Currency } from '../models'

export class CurrencyService {
  public static async getCurrencyBySymbol(
    symbol: string
  ): Promise<Currency | null> {
    return await Currency.findOne({
      where: {
        symbol,
      },
    })
  }

  public static async createCurrency(
    name: string,
    symbol: string
  ): Promise<Currency> {}
}
