import { Model, ModelStatic } from 'sequelize'

import { Project, Transaction, Account, Currency } from '../../src/models'

async function clearDb(): Promise<number[]> {
  const MODELS_TO_CLEAR: ModelStatic<Model>[] = [
    Project,
    Transaction,
    Account,
    Currency,
  ]
  const modelstoClearPromise = Object.values(MODELS_TO_CLEAR).map(
    (model): Promise<number> =>
      model.destroy({
        where: {},
        force: true,
      })
  )
  return await Promise.all(modelstoClearPromise)
}

jest.setTimeout(30000)

beforeEach(async () => {
  // Doesn't clear implementations, only spys
  jest.clearAllMocks()
  return await clearDb()
})
