import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import '@fortawesome/fontawesome-free/css/all.css';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App);

app.use(createPinia());

app.mount('#app');
