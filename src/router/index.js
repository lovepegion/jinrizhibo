import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: () => import('@/views/main/main'),
  },
  {
    path: '/product',
    component: () => import('@/components/layout/ContentLayout'),
    meta: {},
    children: [
      {
        path: 'make',
        component: () => import('@/views/works/make'),
        meta: { requiresAuth: true }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/works/detail'),
      },
    ],
  },
  {
    path: '/company',
    component: () => import('@/components/layout/ContentLayout'),
    meta: {},
    children: [
      {
        path: 'cert',
        component: () => import('@/views/user/company-cert'),
        meta: { requiresAuth: true }
      },
    ],
  },
  {
    path: '/usercenter',
    component: () => import('@/components/layout/ContentLayout'),
    meta: {},
    children: [
      {
        path: '',
        component: () => import('@/views/usercenter/index'),
        meta: { requiresAuth: true }
      },
    ],
  },
  {
    path: '/user',
    component: () => import('@/components/layout/UserLayout'),
    children: [
      {
        path: 'register',
        component: () => import('@/views/user/register'),
      },
      {
        path: 'login',
        component: () => import('@/views/user/login'),
      },
      {
        path: 'reset-pwd',
        component: () => import('@/views/user/reset-pwd'),
      },
    ],
  },
  {
    path: '/warning',
    component: () => import('@/views/warn/warn.vue')
  },
  // 下架页面
  {
    path: '/downshelf',
    component: () => import('@/views/downShelf/downShelf.vue')
  }
]

export const router = new Router({
  mode: 'history',
  routes: routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.userInfo.token) {
    store.commit('SET_USERINFO', {})
    next('/user/login')
  }
  const title = '今日智播'
  // 路由发生变化修改页面title
  document.title = to.meta.title ? `${title} - ${to.meta.title}` : title
  next()
})

export default router