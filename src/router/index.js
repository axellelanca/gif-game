// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import PseudoForm from '@/components/PseudoForm.vue';
import AnotherComponent from '@/components/AnotherComponent.vue';

const routes = [
  {
    path: '/',
    name: 'PseudoForm',
    component: PseudoForm
  },
  {
    path: '/another',
    name: 'AnotherComponent',
    component: AnotherComponent
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
