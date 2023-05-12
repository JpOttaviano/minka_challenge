import { DataTypes, Model } from 'sequelize'
import { User } from './User'
import { database } from '../db'
import { Currency } from './Currency'

export class Account extends Model {
  public id!: number
  public userId!: number
  public user!: User
  public name!: string
  public currencyId!: number
  public currency!: Currency
  public balance!: number
  //account type ? personal / project
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    currencyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'currency_id',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
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
