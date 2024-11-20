import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  // Tracks notification message and visibility
  state: () => ({ message: '' as string, isVisible: false as boolean, type: 'success' as 'success' | 'error' }),
  actions: {
    show(message: string, notificationType: 'success' | 'error' = 'success', duration = 3000) {
      this.message = message;
      this.type = notificationType;
      this.isVisible = true;

      // Automatically hide the notification after set duration
      setTimeout(() => {
        this.hide();
      }, duration);
    },
    // Hide the notification
    hide() {
      this.isVisible = false;
    },
  },
});
