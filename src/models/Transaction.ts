import { DataTypes, Model } from 'sequelize'
import { Account } from './Account'
import { Currency } from './Currency'
import { database } from '../db'

export class Transaction extends Model {
  public id!: number
  public accountId!: number
  public account!: Account
  public currencyId!: number
  public currency!: Currency
  public amount!: number
  public date!: Date
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'account_id',
    },
    currencyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'currency_id',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'transactions',
    sequelize: database,
  }
)

Transaction.belongsTo(Account, {
  foreignKey: 'account_id',
  as: 'account',
})

Transaction.belongsTo(Currency, {
  foreignKey: 'currency_id',
  as: 'currency',
})
