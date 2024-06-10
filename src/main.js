// src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

app.use(router);
app.use(store);

store.dispatch('initializeStore').then(() => {
  store.dispatch('connectWebSocket');
  app.mount('#app');
});
