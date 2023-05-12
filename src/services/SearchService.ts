import { Order } from 'sequelize'

import { PageData, PageResponse, PageOrder } from '../types'

const DEFAULT_SEARCH_ORDER_FIELD = 'updatedAt'
const DEFAULT_SEARCH_ORDER_DIRECTION = 'desc'

export class SearchService {
  public static DEFAULT_PAGE_SIZE = 20
  public static MAX_PAGE_SIZE = 500
  public static DEFAULT_PAGE: PageData = {
    page: 1,
    size: SearchService.DEFAULT_PAGE_SIZE,
  }

  public static getPageResponse<T>(
    results: T[],
    total: number,
    pageData?: PageData
  ): PageResponse<T> {
    const { size = this.DEFAULT_PAGE_SIZE, page = 1 } = pageData || {}

    return {
      total,
      totalPages: Math.max(Math.ceil(total / size), 1),
      page,
      results,
    }
  }

  public static getOrder(
    order: PageOrder = {},
    defaultField = DEFAULT_SEARCH_ORDER_FIELD,
    defaultDirection = DEFAULT_SEARCH_ORDER_DIRECTION
  ): Order | undefined {
    const { field = defaultField, direction = defaultDirection } = order
    const sDirection =
      direction === 'desc' ? 'DESC NULLS LAST' : 'ASC NULLS FIRST'

    return [[field, sDirection]]
  }

  public static getPageSize(size: number = this.DEFAULT_PAGE_SIZE): number {
    return Math.min(size, this.MAX_PAGE_SIZE)
  }

  public static getOffset(pageData: PageData = this.DEFAULT_PAGE): number {
    const { size = this.DEFAULT_PAGE_SIZE, page = 1 } = pageData
    return size * (page - 1)
  }

  public static singlePage<T>(list: Array<T>): PageResponse<T> {
    return {
      total: list.length,
      totalPages: 1,
      page: 1,
      results: list,
    }
  }

  public static emptyPage<T>(page = 1): PageResponse<T> {
    return {
      total: 0,
      totalPages: 1,
      page,
      results: [],
    }
  }
}
