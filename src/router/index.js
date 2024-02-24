import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: "/cargo-positioning"
    },
    {
      path: '/cargo-positioning',
      name: 'CargoPositioning',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/CargoPositioning/index.vue')
    }
  ]
})

export default router
