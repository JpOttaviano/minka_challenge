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
