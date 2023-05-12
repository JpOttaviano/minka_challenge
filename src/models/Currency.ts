import { DataTypes, Model } from 'sequelize'
import { database } from '../db'

export class Currency extends Model {
  public id!: string
  public name!: string
  public symbol!: string
  public referenceCurrencyId!: string
  public referenceCurrency!: Currency
  public value!: number
  // Userid ?
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Currency.init(
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
    symbol: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    referenceCurrencyId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'reference_currency_id',
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: 'currencies',
    sequelize: database,
  }
)

Currency.belongsTo(Currency, {
  foreignKey: 'reference_currency_id',
  as: 'referenceCurrency',
})
