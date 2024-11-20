<template>
  <div v-if="notificationStore.isVisible" :class="['notification', notificationStore.type]">
    {{ notificationStore.message }}
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification';

// Access the notification store
const notificationStore = useNotificationStore();
</script>

<style scoped>
.notification {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0);
  color: white;
  padding: 1rem 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 2000;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  animation: fadeInOut 3s ease-in-out;
}

.notification.success {
  background-color: #28a745;
}

.notification.error {
  background-color: #dc3545;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }

  10% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  90% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
}
</style>
