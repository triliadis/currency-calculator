import { Request, Response } from 'express';
import Joi from 'joi';
import Currency from '../models/currency';
import ConversionRate from '../models/conversionRate';

// Joi schemas for validation
const currencySchema = Joi.object({
  code: Joi.string().length(3).uppercase().required(),
  name: Joi.string().min(3).required(),
});

const conversionRateSchema = Joi.object({
  baseCode: Joi.string().length(3).uppercase().required(),
  targetCode: Joi.string().length(3).uppercase().required(),
  rate: Joi.number().positive().required(),
});

const convertCurrencySchema = Joi.object({
  baseCode: Joi.string().length(3).uppercase().required(),
  targetCode: Joi.string().length(3).uppercase().required(),
  amount: Joi.number().positive().required(),
});

// Add currency endpoint
export const addCurrency = async (req: Request, res: Response) => {
  const { code, name } = req.body;

  // Validate inputs
  const { error } = currencySchema.validate({ code, name });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Check if currency exists
    const existingCurrency = await Currency.findOne({ where: { code } });
    if (existingCurrency) {
      return res.status(409).json({ message: 'Currency code already exists' });
    }

    // Create new currency
    const currency = await Currency.create({ code, name });
    res.status(201).json(currency);
  } catch (error: any) {
    const errorMessage = error?.errors?.[0]?.message || 'An unexpected error occurred';
    res.status(500).json({ message: errorMessage, details: error });
  }
};

// Add or update conversion rate endpoint
export const addConversionRate = async (req: Request, res: Response) => {
  const { baseCode, targetCode, rate } = req.body;

  // Validate inputs
  const { error } = conversionRateSchema.validate({ baseCode, targetCode, rate });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Check if base and target currencies exist
    const baseCurrency = await Currency.findOne({ where: { code: baseCode } });
    const targetCurrency = await Currency.findOne({ where: { code: targetCode } });

    if (!baseCurrency || !targetCurrency) {
      return res.status(404).json({ message: 'Invalid currency codes' });
    }

    // Check if the conversion rate already exists
    const existingRate = await ConversionRate.findOne({ where: { baseCurrencyId: baseCurrency.id, targetCurrencyId: targetCurrency.id } });

    // Update the existing rate if it exists
    if (existingRate) {
      existingRate.rate = rate;
      await existingRate.save();
      return res.status(200).json({ message: 'Conversion rate updated', existingRate });
    }

    // Create a new conversion rate if it doesn't exist
    const conversionRate = await ConversionRate.create({ baseCurrencyId: baseCurrency.id, targetCurrencyId: targetCurrency.id, rate });

    res.status(201).json(conversionRate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add conversion rate', error });
  }
};

// Convert currency endpoint
export const convertCurrency = async (req: Request, res: Response) => {
  const { baseCode, targetCode, amount } = req.body;

  // Validate inputs
  const { error } = convertCurrencySchema.validate({ baseCode, targetCode, amount });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Check if base and target currencies exist
    const baseCurrency = await Currency.findOne({ where: { code: baseCode } });
    const targetCurrency = await Currency.findOne({ where: { code: targetCode } });

    if (!baseCurrency || !targetCurrency) {
      return res.status(404).json({ message: 'Invalid currency codes' });
    }

    // Check if the conversion rate between the currencies exists
    const conversionRate = await ConversionRate.findOne({ where: { baseCurrencyId: baseCurrency.id, targetCurrencyId: targetCurrency.id } });

    if (!conversionRate) {
      return res.status(404).json({ message: `No conversion rate found from '${baseCode}' to '${targetCode}'. Please add the conversion rate.` });
    }

    // Perform the currency conversion
    const convertedAmount = amount * conversionRate.rate;

    // Return the result
    res.json({ convertedAmount });
  } catch (error) {
    console.error('Error converting currency:', error);
    res.status(500).json({ message: 'Error converting currency. Please try again later.', error });
  }
};

// Get all currencies endpoint
export const getAllCurrencies = async (req: Request, res: Response) => {
  try {
    const currencies = await Currency.findAll();
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch currencies', error });
  }
};

// Delete currency endpoint
export const deleteCurrency = async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    // Find the currency
    const currency = await Currency.findOne({ where: { code } });

    if (!currency) {
      return res.status(404).json({ message: 'Currency not found' });
    }

    // Delete the currency
    await currency.destroy();
    res.status(200).json({ message: `Currency '${code}' deleted successfully` });
  } catch (error) {
    console.error('Error deleting currency:', error);
    res.status(500).json({ message: 'Failed to delete currency', error });
  }
};
