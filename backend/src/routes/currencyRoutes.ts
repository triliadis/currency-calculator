import express from 'express';
import {
  addCurrency,
  addConversionRate,
  convertCurrency,
  getAllCurrencies,
  deleteCurrency,
} from '../controllers/currencyController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Currency
 *   description: Endpoints for managing currencies
 */

/**
 * @swagger
 * /api/currency/add-currency:
 *   post:
 *     summary: Add a new currency
 *     tags: [Currency]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: USD
 *               name:
 *                 type: string
 *                 example: US Dollar
 *     responses:
 *       201:
 *         description: Currency added successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/add-currency', authMiddleware, addCurrency);

/**
 * @swagger
 * /api/currency/add-rate:
 *   post:
 *     summary: Add or update a conversion rate
 *     tags: [Currency]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               baseCode:
 *                 type: string
 *                 example: USD
 *               targetCode:
 *                 type: string
 *                 example: EUR
 *               rate:
 *                 type: number
 *                 example: 0.85
 *     responses:
 *       201:
 *         description: Conversion rate added successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/add-rate', authMiddleware, addConversionRate);

/**
 * @swagger
 * /api/currency/convert:
 *   post:
 *     summary: Convert an amount between currencies
 *     tags: [Currency]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               baseCode:
 *                 type: string
 *                 example: USD
 *               targetCode:
 *                 type: string
 *                 example: EUR
 *               amount:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Conversion result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 convertedAmount:
 *                   type: number
 *                   example: 85
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */
router.post('/convert', convertCurrency);

/**
 * @swagger
 * /api/currency/currencies:
 *   get:
 *     summary: Retrieve all currencies
 *     tags: [Currency]
 *     responses:
 *       200:
 *         description: List of all currencies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: USD
 *                   name:
 *                     type: string
 *                     example: US Dollar
 *       500:
 *         description: Internal server error
 */
router.get('/currencies', getAllCurrencies);

/**
 * @swagger
 * /api/currency/delete/{code}:
 *   delete:
 *     summary: Delete a currency
 *     tags: [Currency]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Currency code to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Currency deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Currency not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:code', authMiddleware, deleteCurrency);

export default router;
