import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('./components/landing/LandingPage.vue'),
  },
  {
    path: '/operator',
    name: 'operator',
    component: () => import('./components/operator/OperatorGame.vue'),
  },
  {
    path: '/con',
    name: 'con',
    component: () => import('./components/thecon/ConGame.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
