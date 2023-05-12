import { DataTypes, Model } from 'sequelize'
import { database } from '../db'

export class Currency extends Model {
  public id!: number
  public name!: string
  public symbol!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Currency.init(
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
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'currencies',
    sequelize: database,
  }
)
