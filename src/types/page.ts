export type PageResponse<T> = {
  results: T[]
  page: number
  total: number
  totalPages: number
}

export type PageRequest<T> = {
  page?: PageData
  filters: T
}

export type PageData = {
  page?: number
  size?: number
}

export type PageOrder = {
  direction?: OrderDirection
  field?: string
}

export type OrderDirection = 'desc' | 'asc'
