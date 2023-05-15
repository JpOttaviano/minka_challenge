import { AccountResponse } from './accounts'
import { CreateCurrency } from './currency'

export type CreateProject = {
  name: string
  description: string
  userId: string
  currency: CreateCurrency
  initialSupply: number
}

export type ProjectInvestment = {
  projectId: string
  amount: number
  userId: string
}

export type InvestIntent = {
  amount: number
}

export type ProjectFilter = {
  userId?: string
}

export type ProjectResponse = {
  id: string
  name: string
  description: string
  account: AccountResponse
}
