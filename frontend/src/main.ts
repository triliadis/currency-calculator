import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/main.css';

const app = createApp(App);
// Init pinia store
const pinia = createPinia();

app.use(pinia);
app.mount('#app');

