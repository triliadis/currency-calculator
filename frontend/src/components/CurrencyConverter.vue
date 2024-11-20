<template>
  <div class="currency-converter">
    <form class="converter-form" @submit.prevent="convertCurrency">
      <h1 class="title">Convert Currency</h1>
      <div class="form-group">
        <!-- Base currency selector -->
        <label for="base-currency" class="label">From:</label>
        <select id="base-currency" v-model="baseCurrency" class="select" aria-label="Base Currency">
          <option disabled value="">Select a currency</option>
          <option v-for="currency in currencyStore.currencies" :key="currency.code" :value="currency.code">
            {{ currency.name }} ({{ currency.code }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <!-- Target currency selector -->
        <label for="target-currency" class="label">To:</label>
        <select id="target-currency" v-model="targetCurrency" class="select" aria-label="Target Currency">
          <option disabled value="">Select a currency</option>
          <option v-for="currency in currencyStore.currencies" :key="currency.code" :value="currency.code">
            {{ currency.name }} ({{ currency.code }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="amount" class="label">Amount:</label>
        <input id="amount" v-model="amount" type="number" placeholder="Enter amount" class="input"
          aria-label="Amount to convert" :class="{ 'error-input': amountError }" />
        <span v-if="amountError" class="error-message">{{ amountError }}</span>
      </div>

      <button type="submit" class="convert-button">Convert</button>
    </form>

    <!-- Conversion Result -->
    <div v-if="conversionResult !== null" class="result">
      <p>
        Converted Amount: <strong>{{ conversionResult }}</strong>
      </p>
    </div>

    <div v-else-if="conversionError" class="error">
      <p>{{ conversionError }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useCurrencyStore } from '@/stores/currency';

export default {
  setup() {
    // Access the Pinia currency store
    const currencyStore = useCurrencyStore();

    // Form state
    const baseCurrency = ref('');
    const targetCurrency = ref('');
    const amount = ref(1); // Default amount set to 1
    const conversionResult = ref(null);
    const conversionError = ref('');
    const amountError = ref('');

    // Fetch available currencies on component mount
    onMounted(async () => {
      try {
        await currencyStore.fetchCurrencies();
        if (currencyStore.currencies.length) {
          baseCurrency.value = currencyStore.currencies[0].code;
          targetCurrency.value =
            currencyStore.currencies[1]?.code || currencyStore.currencies[0].code;
        }
      } catch (error) {
        console.error('Error fetching currencies:', error);
        conversionError.value = 'Failed to load currencies. Please try again.';
      }
    });

    const convertCurrency = async () => {
      // Clear previous results and errors
      conversionError.value = '';
      conversionResult.value = null;
      amountError.value = '';

      if (amount.value <= 0) {
        amountError.value = 'Amount must be greater than zero.';
        return;
      }

      if (baseCurrency.value === targetCurrency.value) {
        conversionError.value = 'Cannot convert the same currency.';
        return;
      }

      try {
        // Call the conversion API through the Pinia store
        const result = await currencyStore.convertCurrency(baseCurrency.value, targetCurrency.value, amount.value);
        conversionResult.value = result.convertedAmount.toFixed(2);
      } catch (error: any) {
        console.error('Failed to convert currency:', error);
        conversionError.value = 'Failed to convert currency. ' + error.response?.data?.message;
      }
    };

    return {
      currencyStore,
      baseCurrency,
      targetCurrency,
      amount,
      conversionResult,
      conversionError,
      amountError,
      convertCurrency,
    };
  },
};
</script>

<style scoped>
.currency-converter {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: auto;
}

.loading {
  font-size: 18px;
  color: #555;
}

.converter-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
  width: 100%;
  max-width: 300px;
}

.select {
  padding: 0.75rem;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  max-width: 300px;
  text-align: left;
}

.select option {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
}

.input {
  padding: 0.75rem;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
}

.convert-button {
  padding: 0.75rem;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 300px;
}

.convert-button:hover {
  background-color: #0056b3;
}

.result {
  margin-top: 1.5rem;
  font-size: 18px;
  color: #333;
  text-align: center;
}

.error {
  margin-top: 1.5rem;
  font-size: 16px;
  color: #dc3545;
  text-align: center;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 0.25rem;
  max-width: 300px;
}

.error-input {
  border-color: #dc3545;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .currency-converter {
    padding: 1.5rem;
  }

  .converter-form {
    gap: 1rem;
  }
}
</style>
