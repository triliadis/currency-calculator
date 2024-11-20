<template>
  <div>
    <!-- Main Admin Panel -->
    <h1 class="admin-title">ADMIN PANEL</h1>
    <div class="admin-panel">
      <h2 class="form-title">Available Currencies</h2>

      <div class="currency-columns">
        <div v-for="(column, index) in currencyColumns" :key="index" class="currency-column">
          <ul class="currency-list">
            <li v-for="currency in column" :key="currency.code" class="currency-item">
              <span class="currency-name">{{ currency.name }}</span>
              <span class="currency-code">({{ currency.code }})</span>
              <button class="delete-button" @click="openDeleteModal(currency.code)" aria-label="Delete Currency">
                🗑️
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Add Currency Form -->
      <form @submit.prevent="addCurrency" class="admin-form">
        <h2 class="form-title">Add Currency</h2>
        <div class="form-group">
          <label for="currency-code" class="label">Currency Code <span class="required">*</span></label>
          <input id="currency-code" v-model="currencyCode" placeholder="Enter currency code (e.g., USD)" class="input"
            :class="{ 'error-input': addCurrencyErrors.code }" maxlength="3" />
          <span v-if="addCurrencyErrors.code" class="error-message">{{ addCurrencyErrors.code }}</span>
        </div>

        <div class="form-group">
          <label for="currency-name" class="label">Currency Name <span class="required">*</span></label>
          <input id="currency-name" v-model="currencyName" placeholder="Enter currency name (e.g., Dollar)"
            class="input" :class="{ 'error-input': addCurrencyErrors.name }" />
          <span v-if="addCurrencyErrors.name" class="error-message">{{ addCurrencyErrors.name }}</span>
        </div>

        <button type="submit" class="action-button">Add Currency</button>
      </form>

      <!-- Update Conversion Rate Form -->
      <form @submit.prevent="updateConversionRate" class="admin-form">
        <h2 class="form-title">Update Conversion Rates</h2>
        <div class="form-group">
          <label for="base-currency" class="label">Base Currency <span class="required">*</span></label>
          <select id="base-currency" v-model="baseCurrency" class="input"
            :class="{ 'error-input': updateConversionErrors.baseCurrency }">
            <option disabled value="">Select base currency</option>
            <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
              {{ currency.name }} ({{ currency.code }})
            </option>
          </select>
          <span v-if="updateConversionErrors.baseCurrency" class="error-message">
            {{ updateConversionErrors.baseCurrency }}
          </span>
        </div>

        <div class="form-group">
          <label for="target-currency" class="label">Target Currency <span class="required">*</span></label>
          <select id="target-currency" v-model="targetCurrency" class="input"
            :class="{ 'error-input': updateConversionErrors.targetCurrency }">
            <option disabled value="">Select target currency</option>
            <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
              {{ currency.name }} ({{ currency.code }})
            </option>
          </select>
          <span v-if="updateConversionErrors.targetCurrency" class="error-message">
            {{ updateConversionErrors.targetCurrency }}
          </span>
        </div>

        <div class="form-group">
          <label for="rate" class="label">Conversion Rate <span class="required">*</span></label>
          <input id="rate" v-model="conversionRate" type="number" step="0.01" placeholder="Enter conversion rate"
            class="input" :class="{ 'error-input': updateConversionErrors.conversionRate }" />
          <span v-if="updateConversionErrors.conversionRate" class="error-message">
            {{ updateConversionErrors.conversionRate }}
          </span>
        </div>

        <button type="submit" class="action-button">Update Rate</button>
      </form>
    </div>

    <!-- Delete Modal -->
    <div v-if="isDeleteModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Confirm Delete</h3>
        <p>Are you sure you want to delete the currency <strong>{{ currencyToDelete }}</strong>?</p>
        <div class="modal-actions">
          <button class="modal-button confirm" @click="confirmDelete">Yes, Delete</button>
          <button class="modal-button cancel" @click="closeDeleteModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCurrencyStore } from '@/stores/currency';
import { useNotificationStore } from '@/stores/notification';

// Stores
const currencyStore = useCurrencyStore();
const notificationStore = useNotificationStore();

// State and Types
type Currency = { code: string; name: string };
const currencies = ref<Currency[]>([]);
const currencyColumns = ref<Currency[][]>([]);

const currencyCode = ref('');
const currencyName = ref('');
const baseCurrency = ref('');
const targetCurrency = ref('');
const conversionRate = ref<number | null>(null);

const addCurrencyErrors = ref<{ code: string; name: string }>({ code: '', name: '' });
const updateConversionErrors = ref<{ baseCurrency: string; targetCurrency: string; conversionRate: string }>({
  baseCurrency: '',
  targetCurrency: '',
  conversionRate: '',
});

// Delete Modal State
const isDeleteModalOpen = ref(false);
const currencyToDelete = ref<string | null>(null);

// Fetch currencies
const fetchCurrencies = async () => {
  try {
    await currencyStore.fetchCurrencies();
    currencies.value = currencyStore.currencies;
    splitCurrencies();
  } catch (error) {
    console.error('Failed to fetch currencies', error);
  }
};

// Split currencies into two columns
const splitCurrencies = () => {
  const middleIndex = Math.ceil(currencies.value.length / 2);
  currencyColumns.value = [currencies.value.slice(0, middleIndex), currencies.value.slice(middleIndex)];
};

// Validate Add Currency Form
const validateAddCurrencyForm = () => {
  let isValid = true;
  if (!currencyCode.value.trim()) {
    addCurrencyErrors.value.code = 'Currency code is required.';
    isValid = false;
  } else if (currencyCode.value.trim().length !== 3) {
    addCurrencyErrors.value.code = 'Currency code must be exactly 3 characters.';
    isValid = false;
  } else {
    addCurrencyErrors.value.code = '';
  }

  if (!currencyName.value.trim()) {
    addCurrencyErrors.value.name = 'Currency name is required.';
    isValid = false;
  } else if (currencyName.value.trim().length < 3) {
    addCurrencyErrors.value.name = 'Currency name must be at least 3 characters.';
    isValid = false;
  } else {
    addCurrencyErrors.value.name = '';
  }

  return isValid;
};

// Add Currency
const addCurrency = async () => {
  if (!validateAddCurrencyForm()) return;
  try {
    await currencyStore.addCurrency({ code: currencyCode.value.toUpperCase(), name: currencyName.value });
    currencyCode.value = '';
    currencyName.value = '';
    notificationStore.show('Currency added successfully!', 'success');
    fetchCurrencies();
  } catch (error: any) {
    notificationStore.show(`Failed to add currency: ${error?.response?.data?.message}`, 'error', 5000);
    console.error('Failed to add currency', error);
  }
};

// Validate Update Conversion Rate Form
const validateUpdateConversionRateForm = () => {
  let isValid = true;
  if (!baseCurrency.value) {
    updateConversionErrors.value.baseCurrency = 'Base currency is required.';
    isValid = false;
  } else {
    updateConversionErrors.value.baseCurrency = '';
  }

  if (!targetCurrency.value) {
    updateConversionErrors.value.targetCurrency = 'Target currency is required.';
    isValid = false;
  } else if (baseCurrency.value === targetCurrency.value) {
    updateConversionErrors.value.targetCurrency = 'Base and target currencies must be different.';
    isValid = false;
  } else {
    updateConversionErrors.value.targetCurrency = '';
  }

  if (!conversionRate.value || conversionRate.value <= 0) {
    updateConversionErrors.value.conversionRate = 'Conversion rate must be a positive number.';
    isValid = false;
  } else {
    updateConversionErrors.value.conversionRate = '';
  }

  return isValid;
};

// Update Conversion Rate
const updateConversionRate = async () => {
  if (!validateUpdateConversionRateForm()) return;
  try {
    await currencyStore.addExchangeRate(baseCurrency.value, targetCurrency.value, conversionRate.value ?? 0);
    baseCurrency.value = '';
    targetCurrency.value = '';
    conversionRate.value = null;
    notificationStore.show('Conversion rate updated successfully!', 'success');
  } catch (error: any) {
    notificationStore.show(`Failed to update conversion rate: ${error?.response?.data?.message}`, 'error', 5000);
    console.error('Failed to update conversion rate', error);
  }
};

// Delete Modal Logic
const openDeleteModal = (currencyCode: string) => {
  currencyToDelete.value = currencyCode;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  currencyToDelete.value = null;
  isDeleteModalOpen.value = false;
};

const confirmDelete = async () => {
  if (!currencyToDelete.value) return;
  try {
    await currencyStore.deleteCurrency(currencyToDelete.value);
    notificationStore.show(`Currency ${currencyToDelete.value} deleted successfully!`, 'success');
    fetchCurrencies();
  } catch (error: any) {
    notificationStore.show(`Failed to delete currency: ${error?.response?.data?.message}`, 'error', 5000);
  } finally {
    closeDeleteModal();
  }
};

// On Mounted
onMounted(fetchCurrencies);
</script>


<style scoped>
.admin-title {
  font-size: 28px;
  font-weight: bold;
  color: #007bff;
  text-align: center;
}

.admin-panel {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  max-width: 900px;
  margin: auto;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
}

.description {
  font-size: 14px;
  color: #555;
  text-align: center;
  margin-bottom: 2rem;
}

.currency-columns {
  display: flex;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  margin-bottom: 2rem;
}

.currency-column {
  flex: 1;
}

.currency-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.currency-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  transition: transform 0.2s, box-shadow 0.2s;
}

.currency-item:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-section {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
}

.admin-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-title {
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.label {
  font-weight: bold;
  color: #333;
}

.input,
.select,
.action-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

.input:focus,
.select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.2);
}

.action-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: #0056b3;
}

.forms-container {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
}

.form-container {
  flex: 1;
}

.conversion-rate-title,
.add-currency-title {
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
  text-align: center;
  margin-bottom: 1rem;
}

.required {
  color: #dc3545;
  font-weight: bold;
  margin-left: 2px;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 0.25rem;
}

.error-input {
  border-color: #dc3545;
}

.delete-button {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 18px;
  margin-left: 10px;
}

.delete-button:hover {
  color: #a71d2a;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-button {
  padding: 0.75rem 1.5rem;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-button.confirm {
  background-color: #dc3545;
  color: #fff;
}

.modal-button.confirm:hover {
  background-color: #a71d2a;
}

.modal-button.cancel {
  background-color: #6c757d;
  color: #fff;
}

.modal-button.cancel:hover {
  background-color: #495057;
}
</style>
