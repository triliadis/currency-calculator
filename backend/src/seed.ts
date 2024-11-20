import sequelize from './utils/db'; // Import database connection
import Currency from './models/currency';
import ConversionRate from './models/conversionRate';

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // force: true drops existing tables and recreates them

    const existingCurrencies = await Currency.count();
    if (existingCurrencies > 0) {
      console.log('Data already exists. Skipping seeding.');
      return;
    }

    // Seed currencies
    const currencies = await Currency.bulkCreate([
      { code: 'USD', name: 'US Dollar' },
      { code: 'EUR', name: 'Euro' },
      { code: 'JPY', name: 'Japanese Yen' },
      { code: 'GBP', name: 'British Pound' },
      { code: 'CHF', name: 'Swiss Franc' },
      { code: 'CAD', name: 'Canadian Dollar' },
    ]);

    // helper map to assign ids to currencies e.g. {"USD":1,"EUR":2,"JPY":3,"GBP":4,"CHF":5,"CAD":6}
    const currencyMap = Object.fromEntries(currencies.map((currency) => [currency.code, currency.id]));

    // Seed ConversionRate data
    await ConversionRate.bulkCreate([
      // USD rates
      { baseCurrencyId: currencyMap['USD'], targetCurrencyId: currencyMap['EUR'], rate: 0.9465 },
      { baseCurrencyId: currencyMap['USD'], targetCurrencyId: currencyMap['JPY'], rate: 155.51 },
      { baseCurrencyId: currencyMap['USD'], targetCurrencyId: currencyMap['GBP'], rate: 0.7851 },
      { baseCurrencyId: currencyMap['USD'], targetCurrencyId: currencyMap['CHF'], rate: 0.886 },
      { baseCurrencyId: currencyMap['USD'], targetCurrencyId: currencyMap['CAD'], rate: 1.4 },
      // EUR rates
      { baseCurrencyId: currencyMap['EUR'], targetCurrencyId: currencyMap['USD'], rate: 1.0566 },
      { baseCurrencyId: currencyMap['EUR'], targetCurrencyId: currencyMap['JPY'], rate: 164.52 },
      { baseCurrencyId: currencyMap['EUR'], targetCurrencyId: currencyMap['GBP'], rate: 0.8329 },
      { baseCurrencyId: currencyMap['EUR'], targetCurrencyId: currencyMap['CHF'], rate: 0.937 },
      { baseCurrencyId: currencyMap['EUR'], targetCurrencyId: currencyMap['CAD'], rate: 1.4807 },
      // JPY rates
      { baseCurrencyId: currencyMap['JPY'], targetCurrencyId: currencyMap['USD'], rate: 0.0064 },
      { baseCurrencyId: currencyMap['JPY'], targetCurrencyId: currencyMap['EUR'], rate: 0.0061 },
      { baseCurrencyId: currencyMap['JPY'], targetCurrencyId: currencyMap['GBP'], rate: 0.0051 },
      { baseCurrencyId: currencyMap['JPY'], targetCurrencyId: currencyMap['CHF'], rate: 0.0057 },
      { baseCurrencyId: currencyMap['JPY'], targetCurrencyId: currencyMap['CAD'], rate: 0.009 },
      // GBP rates
      { baseCurrencyId: currencyMap['GBP'], targetCurrencyId: currencyMap['USD'], rate: 1.2743 },
      { baseCurrencyId: currencyMap['GBP'], targetCurrencyId: currencyMap['EUR'], rate: 1.2006 },
      { baseCurrencyId: currencyMap['GBP'], targetCurrencyId: currencyMap['JPY'], rate: 197.32 },
      { baseCurrencyId: currencyMap['GBP'], targetCurrencyId: currencyMap['CHF'], rate: 1.1245 },
      { baseCurrencyId: currencyMap['GBP'], targetCurrencyId: currencyMap['CAD'], rate: 1.7777 },
      // CHF rates
      { baseCurrencyId: currencyMap['CHF'], targetCurrencyId: currencyMap['USD'], rate: 1.1287 },
      { baseCurrencyId: currencyMap['CHF'], targetCurrencyId: currencyMap['EUR'], rate: 1.0672 },
      { baseCurrencyId: currencyMap['CHF'], targetCurrencyId: currencyMap['JPY'], rate: 175.57 },
      { baseCurrencyId: currencyMap['CHF'], targetCurrencyId: currencyMap['GBP'], rate: 0.8889 },
      { baseCurrencyId: currencyMap['CHF'], targetCurrencyId: currencyMap['CAD'], rate: 1.5802 },
      // CAD rates
      { baseCurrencyId: currencyMap['CAD'], targetCurrencyId: currencyMap['USD'], rate: 0.7143 },
      { baseCurrencyId: currencyMap['CAD'], targetCurrencyId: currencyMap['EUR'], rate: 0.6753 },
      { baseCurrencyId: currencyMap['CAD'], targetCurrencyId: currencyMap['JPY'], rate: 111.1 },
      { baseCurrencyId: currencyMap['CAD'], targetCurrencyId: currencyMap['GBP'], rate: 0.5625 },
      { baseCurrencyId: currencyMap['CAD'], targetCurrencyId: currencyMap['CHF'], rate: 0.6328 },
    ]);
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

// Run the seeding process
seedDatabase();
