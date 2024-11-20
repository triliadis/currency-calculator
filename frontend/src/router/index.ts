import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import CurrencyConverter from '@/components/CurrencyConverter.vue';

const routes = [
  { path: '/', component: CurrencyConverter }, // Default route
  { path: '/login', component: Login }, // Login page
  { path: '/convert', component: CurrencyConverter }, // Currency converter page
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
