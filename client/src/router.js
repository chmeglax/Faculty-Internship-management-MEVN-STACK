import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import AuthLayout from '@/layouts/Auth'
import MainLayout from '@/layouts/Main'
import StudenLayout from '@/layouts/Student'
import store from '@/store'

const router = createRouter({
  //base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  history: createWebHashHistory(),
  routes: [
    {
      path: '/admin',
      name: 'home',
      // VB:REPLACE-NEXT-LINE:ROUTER-REDIRECT
      redirect: '/admin/enseignants',
      component: MainLayout,
      meta: {
        authRequired: true,
        hidden: true,
      },
      children: [
        // VB:REPLACE-START:ROUTER-CONFIG
        {
          path: '/admin/organismes',
          meta: { title: 'Organismes' },
          component: () => import('./views/organismes'),
        },
        {
          path: '/admin/enseignants',
          meta: { title: 'Enseignant' },
          component: () => import('./views/teachers'),
        }, {
          path: '/admin/sujets',
          meta: { title: 'Sujets' },
          component: () => import('./views/sujets'),
        },
        // VB:REPLACE-END:ROUTER-CONFIG
      ],
    },
    {
      path: '/student',
      name: 'homeS',
      // VB:REPLACE-NEXT-LINE:ROUTER-REDIRECT
      redirect: '/student/organismes',
      component: StudenLayout,
      meta: {
        authSRequired: true,
        hidden: true,
      },
      children: [
        {
          path: '/student/organismes',
          meta: { title: 'student' },
          component: () => import('./views/student/organismes'),
        },
        {
          path: '/student/proposition',
          meta: { title: 'proposition' },
          component: () => import('./views/student/proposition'),
        },
        {
          path: '/student/proposition/ajouter',
          meta: { title: 'Ajouter une proposition' },
          component: () => import('./views/student/proposition/addProposition'),
        },
        // VB:REPLACE-END:ROUTER-CONFIG
      ],
    },
    //teacher System Pages
    {
      path: '/auth',
      component: AuthLayout,
      redirect: 'auth/login',
      children: [
        {
          path: '/auth/404',
          name: 'route404',
          meta: {
            title: 'Error 404',
          },
          component: () => import('./views/auth/404'),
        },
        {
          path: '/auth/500',
          meta: {
            title: 'Error 500',
          },
          component: () => import('./views/auth/500'),
        },
        {
          path: '/auth/login',
          name: 'login',
          meta: {
            title: 'Sign In',
          },
          component: () => import('./views/auth/login'),
        },
        {
          path: '/auth/register',
          meta: {
            title: 'Sign Up',
          },
          component: () => import('./views/auth/register'),
        },
        {
          path: '/auth/forgot-password',
          meta: {
            title: 'Forgot Password',
          },
          component: () => import('./views/auth/forgot-password'),
        },
        {
          path: '/auth/lockscreen',
          meta: {
            title: 'Lockscreen',
          },
          component: () => import('./views/auth/lockscreen'),
        },
      ],
    },
    // student system Pages
    {
      path: '/authstudent',
      component: AuthLayout,
      redirect: 'authstudent/login',
      children: [
        {
          path: '/authstudent/404',
          name: 'route404S',
          meta: {
            title: 'Error 404',
          },
          component: () => import('./views/authstudent/404'),
        },
        {
          path: '/auth/500',
          meta: {
            title: 'Error 500',
          },
          component: () => import('./views/authstudent/500'),
        },
        {
          path: '/authstudent/login',
          name: 'loginStudent',
          meta: {
            title: 'Sign In',
          },
          component: () => import('./views/authstudent/login'),
        },
        {
          path: '/authstudent/register',
          meta: {
            title: 'Sign Up',
          },
          component: () => import('./views/authstudent/register'),
        },
        {
          path: '/authstudent/forgot-password',
          meta: {
            title: 'Forgot Password',
          },
          component: () => import('./views/authstudent/forgot-password'),
        },
        {
          path: '/authstudent/lockscreen',
          meta: {
            title: 'Lockscreen',
          },
          component: () => import('./views/authstudent/lockscreen'),
        },
      ],
    },
    // Redirect to 404
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'route404S' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  setTimeout(() => {
    NProgress.done()
  }, 300)
  console.log("from", from)
  console.log("to", to)
  console.log("authorized", store.state.user.authorized)
  console.log("authorizedStudent", store.state.user.authorizedStudent)
  if (to.matched.some(record => record.meta.authSRequired)) {

    if (!store.state.user.authorizedStudent) {
      console.log("1")

      next({
        path: '/authstudent/login',
        query: { redirect: to.fullPath },
      })
    } else {
      console.log("2")
      next()
    }
  } else {
    if (to.matched.some(record => record.meta.authRequired)) {

      if (!store.state.user.authorized) {
        console.log("3")

        next({
          path: '/auth/login',
          query: { redirect: to.fullPath },
        })
      } else {
        console.log("4")
        next()
      }
    } else {
      console.log("5")

      next()
    }

  }

})

export default router
