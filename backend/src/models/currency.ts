import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/db';

// Define the Currency model
class Currency extends Model {
  public id!: number;
  public code!: string;
  public name!: string;
}

// Define Currency schema
Currency.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: 'Currency' },
);

export default Currency;
