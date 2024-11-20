import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  // Tracks the visibility of modals
  state: () => ({ isLoginModalVisible: false, isRegisterModalVisible: false }),
  actions: {
    toggleLoginModal() {
      this.isLoginModalVisible = !this.isLoginModalVisible;
    },
    toggleRegisterModal() {
      this.isRegisterModalVisible = !this.isRegisterModalVisible;
    },
    closeModals() {
      this.isLoginModalVisible = false;
      this.isRegisterModalVisible = false;
    },
  },
});
