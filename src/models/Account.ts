import { DataTypes, Model } from 'sequelize'
import { User } from './User'
import { database } from '../db'
import { Currency } from './Currency'
import { AccountType } from './types/Accounts'

export class Account extends Model {
  public id!: string
  public userId!: string
  public user!: User
  public currencyId!: string
  public currency!: Currency
  public balance!: number
  public type!: AccountType
  //account type ? personal / project
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Account.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    currencyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'currency_id',
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'accounts',
    sequelize: database,
  }
)

Account.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
})

Account.belongsTo(Currency, {
  foreignKey: 'currency_id',
  as: 'currency',
})
