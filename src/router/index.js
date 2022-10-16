import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/permission'
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    alwaysShow: true, // will always show the root menu
    name: 'article',
    meta: {
      title: '文章',
      icon: 'lock'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/article/page'),
        name: 'articleList',
        meta: {
          title: '文章列表'
        }
      },
      {
        path: 'add',
        component: () => import('@/views/article/add'),
        name: 'articleAdd',
        meta: {
          title: '添加文章'
        }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
