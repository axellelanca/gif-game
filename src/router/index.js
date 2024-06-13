// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";
import PseudoForm from "@/components/PseudoForm.vue";
import HomeSession from "@/components/HomeSession.vue";
import GifSelectorComponent from "@/components/GifSelectorComponent.vue";

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
    path: "/gifs",
    name: "",
    component: GifSelectorComponent,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
