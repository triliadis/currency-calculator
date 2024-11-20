<template>
  <main class="main">
    <Notification />
    <div class="auth-section">
      <!-- Show Login and Register buttons if not authenticated -->
      <div v-if="!authStore.isAuthenticated" class="auth-buttons">
        <button class="login-button" @click="uiStore.toggleLoginModal">Login</button>
        <button class="register-button" @click="uiStore.toggleRegisterModal">Register</button>
      </div>

      <!-- Show Logout button if authenticated -->
      <div v-else>
        <button class="logout-button" @click="logout">Logout</button>
      </div>
    </div>

    <!-- Swagger Documentation -->
    <div class="api-docs-link">
      <a href="http://localhost:5000/api-docs" target="_blank" class="swagger-link">API Documentation</a>
    </div>

    <div class="app-header">
      <img alt="Currency Logo" class="logo" src="./assets/logo.png" />
      <h1 class="title">Currency Calculator</h1>
    </div>

    <!-- Container for Converter and Admin Panel -->
    <div class="content-container">
      <CurrencyConverter class="currency-converter" />
      <Admin v-if="authStore.isAuthenticated" class="admin-panel" />
    </div>

    <!-- Login Modal -->
    <div v-if="uiStore.isLoginModalVisible" class="modal-overlay" @click.self="uiStore.toggleLoginModal">
      <div class="modal-content">
        <Login />
        <button class="close-button" @click="uiStore.toggleLoginModal">X</button>
      </div>
    </div>

    <!-- Register Modal -->
    <div v-if="uiStore.isRegisterModalVisible" class="modal-overlay" @click.self="uiStore.toggleRegisterModal">
      <div class="modal-content">
        <Register />
        <button class="close-button" @click="uiStore.toggleRegisterModal">X</button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import { useUiStore } from './stores/ui';
import { useNotificationStore } from './stores/notification';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import CurrencyConverter from './components/CurrencyConverter.vue';
import Admin from './components/Admin.vue';
import Notification from './components/Notification.vue';

// Access the ui, auth and notification stores
const authStore = useAuthStore();
const uiStore = useUiStore();
const notificationStore = useNotificationStore();

const logout = () => {
  authStore.logout();
  uiStore.closeModals();
  notificationStore.show('You have been logged out successfully!', 'success'); // Trigger notification
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.auth-section {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  z-index: 1000;
}

.auth-buttons,
.logout-button {
  display: flex;
  align-items: center;
}

.login-button,
.register-button,
.logout-button {
  padding: 0.75rem 1.5rem;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button {
  background-color: #007bff;
  color: #fff;
  margin-right: 1rem;
}

.login-button:hover {
  background-color: #0056b3;
}

.register-button {
  background-color: #28a745;
  color: #fff;
}

.register-button:hover {
  background-color: #218838;
}

.logout-button {
  background-color: #dc3545;
  color: #fff;
}

.logout-button:hover {
  background-color: #c82333;
}

.app-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 80px;
  height: auto;
  margin-bottom: 1rem;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #007bff;
}

.content-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  margin-bottom: 2rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 400px;
  position: relative;
}

.close-button {
  background: none;
  border: none;
  color: #888;
  font-size: 18px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}

.close-button:hover {
  color: #333;
}

.api-docs-link {
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.swagger-link {
  font-size: 14px;
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.swagger-link:hover {
  color: #0056b3;
}

@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>
