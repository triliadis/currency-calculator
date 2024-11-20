import express from 'express';
import dotenv from 'dotenv';
import sequelize from './utils/db';
import authRoutes from './routes/authRoutes';
import currencyRoutes from './routes/currencyRoutes';
import cors from 'cors';
import { setupSwagger } from './utils/swagger';

dotenv.config(); // Load env variables

const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); // Allow requests from the frontend
app.use(express.json()); // Parse incoming requests

// Route for authentication (login, register)
app.use('/api/auth', authRoutes);

// Route for currency-related operations (conversion rates, add currency, etc.)
app.use('/api/currency', currencyRoutes);

// Set up Swagger documentation
setupSwagger(app);

// Sync database
sequelize
  .sync()
  .then(() => console.log('Database synced successfully'))
  .catch((error) => console.error('Failed to sync database:', error));

export default app;
