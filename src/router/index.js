import { createRouter, createWebHistory } from 'vue-router';
import PseudoForm from '@/components/PseudoForm.vue';
import HomeSession from '@/components/HomeSession.vue';
import ChoosePhrase from '@/components/ChoosePhrase.vue';

const routes = [
  {
    path: '/',
    name: 'PseudoForm',
    component: PseudoForm
  },
  {
    path: '/session',
    name: 'HomeSession',
    component: HomeSession
  },
  {
    path: '/choose',
    name: 'ChoosePhrase',
    component: ChoosePhrase
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
