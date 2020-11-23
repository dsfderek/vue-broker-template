import Vue from 'vue'
import Router from 'vue-router'
import MainLayout from '@main/view/layout/MainLayout'
import Page404 from '@main/view/layout/Page404'
import Demo from '@main/view/Demo'

// 重写push
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.use(Router)

var routerChildren = [];

const path = require('path');
const files = require.context('@/modules', true, /router.js$/);
files.keys().forEach(key => {
  path.basename(key, '.vue');
  var routerOther = (files(key).default || files(key));
  routerChildren.push(...routerOther)
})



export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: MainLayout,
      redirect: '/user-center/debits/dashboard',
      children: routerChildren,
    },
    {
      path: '/demo',
      component: Demo,
    },
    {
      path: '/account',
      component: resolve => require(['@/modules/account/Index'], resolve),
      children: [
        {
          path: 'register/:id?',
          component: resolve => require(['@/modules/account/view/Register'], resolve),
          meta: {
            noLogin: true
          }
        },
        {
          path: 'set-password',
          component: resolve => require(['@/modules/account/view/SetPassword'], resolve),
          meta: {
            noLogin: true
          }
        },
        // {
        //   // 子账号登录校验
        //   path: 'typeValidation',
        //   component: resolve => require(['@/modules/contol/view/user/TypeValidation'], resolve),
        //   meta:{
        //     noLogin: true
        //   }
        // },
        {
          path: 'link-failure',
          component: resolve => require(['@/modules/account/view/LinkFailure'], resolve),
          meta: {
            noLogin: true
          }
        },
        {
          path: 'forget',
          component: resolve => require(['@/modules/account/view/Forget'], resolve),
          meta: {
            noLogin: true
          }
        },
        {
          path: 'check-is-way',
          component: resolve => require(['@/modules/account/view/CheckIsWay'], resolve),
          meta: {
            noLogin: true
          }
        },
        {
          path: 'reset-password',
          component: resolve => require(['@/modules/account/view/ResetPassword'], resolve),
          meta: {
            noLogin: true
          },

        },
        {
          path: 'typeValidation',
          component: resolve => require(['@/modules/contol/view/user/TypeValidation'], resolve),
        },
      ]
    },
    {
      path: '/crm',
      component: resolve => require(['@/modules/account/Index'], resolve),
      children: [
        // 线上
        {
          path: 'onlineregister/:id?',
          component: resolve => require(['@/modules/account/view/CrmRegister'], resolve),
          meta: {
            noLogin: true
          }
        },
        // 通用
        {
          path: 'offlineregister/:id?',
          component: resolve => require(['@/modules/account/view/CrmRegister'], resolve),
          meta: {
            noLogin: true
          }
        }
      ]
    },
    {
      path: '/certifyRemind',
      component: resolve => require(['@main/view/layout/CertifyRemind'], resolve),
    },
    {
      path: '/subscribe-success',
      component: resolve => require(['@/modules/cashier/view/payment/SubscribeSuccess'], resolve),
    },
    {
      path: '*',
      component: Page404
      // component: resolve => require(['@/views/error/NotFound'], resolve)
    }
  ]
})
