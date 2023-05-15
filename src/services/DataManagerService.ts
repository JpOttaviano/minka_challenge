import { NotFoundError } from 'typescript-rest/dist/server/model/errors'
import { Account, Currency, Project, Transaction } from '../models'
import { CreateCurrency, CreateProject, ProjectInvestment } from '../types'
import { CreateAccount } from '../types/accounts'
import { AccountService } from './AccountService'
import { CurrencyService } from './CurrencyService'
import { ProjectService } from './ProjectService'

export class DataManagerService {
  private static log(message: string): void {
    console.info(`[DataManagerService]: ${message}`)
  }

  public static async createNewCurrency(
    newCurrency: CreateCurrency,
    userId: string
  ): Promise<Currency> {
    const { name, symbol, referenceCurrencyId, value } = newCurrency

    if (!!referenceCurrencyId) {
      const referenceCurrency = await CurrencyService.getCurrencyById(
        referenceCurrencyId
      )
      if (!referenceCurrency) {
        throw new Error(
          `Reference currency ${referenceCurrencyId} does not exist`
        )
      }
    }

    return await CurrencyService.createCurrency(
      name,
      symbol,
      userId,
      referenceCurrencyId,
      value
    )
  }

  public static async createNewAccount(
    newAccount: CreateAccount,
    userId: string,
    type = 'PERSONAL'
  ): Promise<Account> {
    const { currencyId, initialBalance } = newAccount

    const currency = await CurrencyService.getCurrencyById(currencyId)
    if (!currency) {
      throw new NotFoundError(`Currency does not exist.`)
    }

    const existingAccount =
      await AccountService.getAccountByUserIdAndCurrencyId(userId, currencyId)

    if (!!existingAccount) {
      this.log(`The specified user already has an account for that currency.`)
      return existingAccount
    }

    return await AccountService.createAccount(
      userId,
      currencyId,
      type,
      initialBalance
    )
  }

  // Creates new Currency, Account and Project
  public static async createNewProject(
    newProject: CreateProject
  ): Promise<Project> {
    const { name, description, currency, userId, initialSupply } = newProject
    const { symbol } = currency

    // Validate requirements for initial supply ?

    // Check and create new currency
    const existingCurrency = await CurrencyService.getCurrencyBySymbol(symbol)

    if (!!existingCurrency) {
      throw new Error(`Currency ${symbol} already exists`)
    }

    const newCurrency = await this.createNewCurrency(currency, userId)

    // Create new account of new currency
    const newAccount = await this.createNewAccount(
      {
        currencyId: newCurrency.id,
        initialBalance: initialSupply,
      },
      userId,
      'PROJECT'
    )

    // Create new project
    return await ProjectService.createProject(name, description, newAccount.id)
  }

  // Validates investment eligibility and makes the exchanges.
  public static async investInProject(
    investmentIntent: ProjectInvestment
  ): Promise<Transaction> {
    const { userId, projectId, amount } = investmentIntent

    this.log(`Verifying accounts and balances...`)
    // check if project exists
    const project = await ProjectService.getProjectById(projectId)
    if (!project) {
      throw new NotFoundError(`Project does not exist.`)
    }
    const { account: projectAccount } = project
    const {
      currency: projectCurrency,
      balance: projectBalance,
      userId: projectUserId,
    } = projectAccount
    const {
      id: projectCurrencyId,
      referenceCurrencyId,
      value: referenceValue,
    } = projectCurrency

    // Check if project has sufficient balance
    if (projectBalance < amount) {
      throw new Error(`Project does not have enough currency.`)
    }

    // Check if user has an account for the payment currency and has enough balance
    const paymentUserAccount =
      await AccountService.getAccountByUserIdAndCurrencyId(
        userId,
        referenceCurrencyId
      )

    if (
      !paymentUserAccount ||
      paymentUserAccount.balance < amount * referenceValue
    ) {
      throw new Error(
        `User does not have enough currency to invest in project.`
      )
    }

    // Check if project owner has an account for the payment currency
    const projectOwnerPaymentAccount =
      await AccountService.getAccountByUserIdAndCurrencyId(
        projectUserId,
        referenceCurrencyId
      )
    if (!projectOwnerPaymentAccount) {
      // If the project was created correclty, this should never happen... just in case.
      throw new Error(
        `Project owner does not have an account for the payment currency.`
      )
    }

    // Check if user has an account for the projects currency
    let projectUsersAccount =
      await AccountService.getAccountByUserIdAndCurrencyId(
        userId,
        projectCurrencyId
      )
    if (!projectUsersAccount) {
      this.log(
        `User does not have an account for the projects currency. Creating one.`
      )
      projectUsersAccount = await this.createNewAccount(
        {
          currencyId: projectCurrencyId,
          initialBalance: 0,
        },
        userId,
        'PERSONAL'
      )
    }
    this.log(`Accounts and balances verified. Exchanging currencies...`)
    // Exchange payment
    await AccountService.transferCurrency(
      paymentUserAccount.id,
      projectOwnerPaymentAccount.id,
      amount * referenceValue,
      userId
    )

    // Exchange project currency
    const projectTransaction = await AccountService.transferCurrency(
      projectAccount.id,
      projectUsersAccount.id,
      amount,
      projectAccount.userId
    )
    this.log(`Investment completed.`)
    return projectTransaction
  }
}
