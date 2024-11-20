import { defineStore } from 'pinia';
import axios from 'axios';

export const useCurrencyStore = defineStore('currency', {
  // Tracks available currencies
  state: () => ({
    currencies: [] as Array<{ id: number; code: string; name: string }>,
  }),
  actions: {
    // Fetches all available currencies from the backend and updates the store
    async fetchCurrencies() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_CURRENCY_ENDPOINT}/currencies`);
        this.currencies = response.data;
      } catch (error) {
        console.error('Failed to fetch currencies:', error);
      }
    },
    // Adds a new currency to the backend and updates the store
    async addCurrency(currency: { code: string; name: string }) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_CURRENCY_ENDPOINT}/add-currency`, currency, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.currencies.push(response.data);
      } catch (error: any) {
        throw error;
      }
    },
    // Adds or updates an exchange rate in the backend and updates the store
    async addExchangeRate(baseCode: string, targetCode: string, rate: number) {
      try {
        await axios.post(
          `${import.meta.env.VITE_CURRENCY_ENDPOINT}/add-rate`,
          { baseCode, targetCode, rate },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
        );
      } catch (error) {
        console.error('Failed to add exchange rate:', error);
        throw error;
      }
    },
    // Converts an amount from one baseCon currency to targetCode currency
    async convertCurrency(baseCode: string, targetCode: string, amount: number) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_CURRENCY_ENDPOINT}/convert`, { baseCode, targetCode, amount });
        return response.data;
      } catch (error) {
        console.error('Failed to convert currency:', error);
        throw error;
      }
    },
    async deleteCurrency(code: string) {
      try {
        await axios.delete(`${import.meta.env.VITE_CURRENCY_ENDPOINT}/delete/${code}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } catch (error) {
        throw error;
      }
    },
  },
});
