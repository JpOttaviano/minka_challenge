import { DataTypes, Model } from 'sequelize'
import { Account } from './Account'
import { database } from '../db'

export class Project extends Model {
  public id!: string
  public name!: string
  public description!: string
  public accountId!: string
  public account!: Account
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.UUID,
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
