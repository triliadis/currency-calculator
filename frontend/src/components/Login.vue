<template>
  <div class="modal">
    <div class="modal-content">
      <button class="close-button" @click="uiStore.toggleLoginModal">X</button>
      <h2 class="modal-title">Login</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <input v-model="username" placeholder="Username" class="input" :class="{ 'error-input': errors.username }" />
        <span v-if="errors.username" class="error-message">{{ errors.username }}</span>

        <input v-model="password" type="password" placeholder="Password" class="input"
          :class="{ 'error-input': errors.password }" />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>

        <button type="submit" class="button">Login</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
import { useNotificationStore } from '@/stores/notification';

export default {
  setup() {
    // Access the ui, auth and notification stores
    const authStore = useAuthStore();
    const uiStore = useUiStore();
    const notificationStore = useNotificationStore();

    const username = ref('');
    const password = ref('');
    const errors = ref<{ username: string; password: string }>({
      username: '',
      password: '',
    });

    const validateInputs = () => {
      let isValid = true;
      if (username.value.trim().length < 5) {
        errors.value.username = 'Username must be at least 5 characters long.';
        isValid = false;
      } else {
        errors.value.username = '';
      }

      if (password.value.trim().length < 5) {
        errors.value.password = 'Password must be at least 5 characters long.';
        isValid = false;
      } else {
        errors.value.password = '';
      }

      return isValid;
    };

    const handleLogin = async () => {
      if (!validateInputs()) return; // Skip if inputs are invalid
      try {
        // Login the user and close the modal is successful
        await authStore.login(username.value, password.value);
        notificationStore.show('Logged in successfully!', 'success')
        uiStore.toggleLoginModal();
      } catch (error: any) {
        errors.value.password = error.response?.data?.message || error.response?.data;
        console.error('Login failed:', error);
      }
    };

    return {
      username,
      password,
      errors,
      handleLogin,
      uiStore
    };
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  position: relative;
  text-align: center;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  color: #888;
  cursor: pointer;
}

.close-button:hover {
  color: #333;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
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

.input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.2);
}

.button {
  width: 100%;
  max-width: 300px;
  padding: 0.75rem;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-sizing: border-box;
}

.button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 12px;
  text-align: left;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
}

.error-input {
  border-color: red;
}
</style>
