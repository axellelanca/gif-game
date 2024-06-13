// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";
import PseudoForm from "@/components/PseudoForm.vue";
import HomeSession from "@/components/HomeSession.vue";
import GifSelectorComponent from "@/components/GifSelectorComponent.vue";
import ChoosePhrase from "@/components/ChoosePhrase.vue";
import VoteComponent from '@/components/VoteComponent.vue'; 


const routes = [
  {
    path: "/",
    name: "PseudoForm",
    component: PseudoForm,
  },
  {
    path: "/session",
    name: "HomeSession",
    component: HomeSession,
  },
  {
    path: "/choose",
    name: "ChoosePhrase",
    component: ChoosePhrase,
  },
  {
    path: "/gifs",
    name: "ChooseGifs",
    component: GifSelectorComponent,
  },
  {
    path: '/vote', // Ajouter une nouvelle route pour VoteComponent
    name: 'VoteComponent',
    component: VoteComponent
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
