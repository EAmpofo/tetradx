import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Cookie from 'js-cookie';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true },
    children: [
        {
            path: '',
            name: 'Index',
            redirect: "/dashboard/referrals"
        },
      {
        path: 'referrals',
        name: 'Referrals',
        component: () => import('../views/Referrals.vue')
      },
        {
            path: 'labs',
            name: 'Labs',
            component: () => import('../views/Labs.vue')
        }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, _from, next) => {
    const token = Cookie.get('authToken');

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
