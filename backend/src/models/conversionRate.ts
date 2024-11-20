import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/db';
import Currency from './currency';

// Define the ConversionRate model
class ConversionRate extends Model {
  public id!: number;
  public baseCurrencyId!: number;
  public targetCurrencyId!: number;
  public rate!: number;
}

// Define ConversionRate schema
ConversionRate.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    baseCurrencyId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Currency, key: 'id' } },
    targetCurrencyId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Currency, key: 'id' } },
    rate: { type: DataTypes.FLOAT, allowNull: false },
  },
  { sequelize, modelName: 'ConversionRate' },
);

// Define relationships
Currency.hasMany(ConversionRate, { foreignKey: 'baseCurrencyId', as: 'baseRates' });
Currency.hasMany(ConversionRate, { foreignKey: 'targetCurrencyId', as: 'targetRates' });
ConversionRate.belongsTo(Currency, { foreignKey: 'baseCurrencyId', as: 'baseCurrency' });
ConversionRate.belongsTo(Currency, { foreignKey: 'targetCurrencyId', as: 'targetCurrency' });

export default ConversionRate;
