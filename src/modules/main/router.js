export default [
  // {
  //   // 消息管理
  //   path: '/demo',
  //   component: resolve => require(['./view/Demo'], resolve),
  //   //redirect: '/message/dashboard',
  //   children: [
  //     {
  //       // 消息管理-看板
  //       path: '/demo',
  //       component: resolve => require(['./view/Demo'], resolve),
  //     }
  //   ]
  // },
  // {
  //   // 401
  //   path: '/notAllow',
  //   component: resolve => require(['./view/layout/Page401'], resolve),
  //   children: [
  //     {
  //       // 401
  //       path: '/notAllow',
  //       component: resolve => require(['./view/layout/Page401'], resolve),
  //     }
  //   ]
  // },
  // {
  //   //欢迎回来
  //   path: '/',
  //   component: resolve =>require(['./view/home/Index'],resolve),
  //   redirect:'/user-center/debits/dashboard',
  //   meta: {
  //     noSideBar: true,
  //     subSystemCode: "customers"
  //   }
  // },
  {
    //修改密码
    path: '/main/account',
    component: resolve =>require(['./view/account/Index'],resolve),
    meta: {
      noSideBar: true
    }
  },
  {
    // 修改密码成功
    path: 'modify_password',
    component: resolve => require(['./view/account/ModifyPassword'],resolve),
    meta: {
      parent: "/main/account"
    }
  },
]

