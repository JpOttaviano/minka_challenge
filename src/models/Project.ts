import { DataTypes, Model } from 'sequelize'
import { Account } from './Account'
import { database } from '../db'

export class Project extends Model {
  public id!: number
  public name!: string
  public description!: string
  public accountId!: number
  public account!: Account
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'account_id',
    },
  },
  {
    tableName: 'projects',
    sequelize: database,
  }
)

Project.belongsTo(Account, {
  foreignKey: 'account_id',
  as: 'account',
})
