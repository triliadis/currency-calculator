<template>
  <div class="modal">
    <div class="modal-content">
      <button class="close-button" @click="uiStore.toggleRegisterModal">X</button>
      <h2 class="modal-title">Register</h2>
      <form @submit.prevent="handleRegister" class="register-form">
        <input v-model="username" placeholder="Username" class="input" :class="{ 'error-input': errors.username }" />
        <span v-if="errors.username" class="error-message">{{ errors.username }}</span>

        <input v-model="password" type="password" placeholder="Password" class="input"
          :class="{ 'error-input': errors.password }" @input="checkPasswordStrength" />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>

        <!-- Password Strength Indicator -->
        <div class="password-strength" v-if="password">
          <span>Password Strength: {{ strengthText }}</span>
          <div class="strength-bar">
            <div class="segment" v-for="(segment, index) in 5" :key="index"
              :class="{ active: index < activeSegments, ['level-' + activeSegments]: index < activeSegments }">
            </div>
          </div>
        </div>

        <button type="submit" class="button">Register</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import zxcvbn from 'zxcvbn'; // Import zxcvbn
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
import { useNotificationStore } from '@/stores/notification';

export default {
  setup() {
    // Access auth, ui and notification stores
    const authStore = useAuthStore();
    const uiStore = useUiStore();
    const notificationStore = useNotificationStore();

    const username = ref('');
    const password = ref('');
    const errors = ref<{ username: string; password: string }>({
      username: '',
      password: '',
    });

    const strengthText = ref('Very Weak');
    const activeSegments = ref(1); // Number of active segments (1 to 5)

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
      } else if (activeSegments.value < 3) {
        // Prevent if password strength is less than "Fair"
        errors.value.password = 'Password must be at least "Fair" strength.';
        isValid = false;
      } else {
        errors.value.password = '';
      }

      return isValid;
    };

    const checkPasswordStrength = () => {
      const result = zxcvbn(password.value); // Use zxcvbn to analyze the password
      const score = result.score; // Score is a value between 0 and 4

      // Update the UI based on the score
      switch (score) {
        case 0:
          strengthText.value = 'Very Weak';
          activeSegments.value = 1;
          break;
        case 1:
          strengthText.value = 'Weak';
          activeSegments.value = 2;
          break;
        case 2:
          strengthText.value = 'Fair';
          activeSegments.value = 3;
          break;
        case 3:
          strengthText.value = 'Good';
          activeSegments.value = 4;
          break;
        case 4:
          strengthText.value = 'Strong';
          activeSegments.value = 5;
          break;
        default:
          strengthText.value = 'Very Weak';
          activeSegments.value = 1;
      }
    };

    const handleRegister = async () => {
      if (!validateInputs()) return; // Skip if inputs are invalid
      try {
        // Register new user and login automatically if successful
        await authStore.register(username.value, password.value);
        await authStore.login(username.value, password.value);
        uiStore.toggleRegisterModal(); // Close modal on successful registration
        notificationStore.show('Registration successful!', 'success')
        username.value = '';
        password.value = '';
      } catch (error: any) {
        errors.value.password =
          error?.response?.data?.message || 'Registration failed.';
        console.error('Registration failed:', error);
      }
    };

    return {
      username,
      password,
      errors,
      handleRegister,
      uiStore,
      strengthText,
      activeSegments,
      checkPasswordStrength,
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

.register-form {
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

.password-strength {
  text-align: left;
  margin-top: 0.5rem;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
}

.strength-bar {
  display: flex;
  gap: 4px;
  margin-top: 0.25rem;
}

.segment {
  flex: 1;
  height: 8px;
  background-color: #ddd;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.segment.active {
  background-color: red;
}

.strength-bar .segment.level-1 {
  background-color: red;
}

.strength-bar .segment.level-2 {
  background-color: orange;
}

.strength-bar .segment.level-3 {
  background-color: yellow;
}

.strength-bar .segment.level-4 {
  background-color: lightgreen;
}

.strength-bar .segment.level-5 {
  background-color: green;
}
</style>