import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
/* 直接import('路径')路由的懒加载
访问到某一个路由的时候再去加载当前的文件 */
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/components/login-one.vue')
  },
  {
    path: '/home',
    component: () => import('@/components/Home-two.vue'),
    // redirect: '/welcoment',
    children: [
      {
        path: '/welcoment',
        component: () => import('@/components/welcoment-one')
      },
      {
        path: '/users',
        component: () => import('@/components/User/Users-one')
      },
      {
        path: '/rights',
        component: () => import('@/components/power/Rights-one.vue')
      },
      {
        path: '/roles',
        component: () => import('@/components/power/Roles-two')
      },
      {
        path: '/categories',
        component: () => import('@/components/goods/Cate-one')
      }

    ]
  }

]
const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  // to表示访问的路径
  // from代表从哪个路径跳转来
  // next是一个函数 表示放行
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
