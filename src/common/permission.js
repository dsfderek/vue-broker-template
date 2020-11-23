import router from '../router'
import store from '../store'
import { utils } from '@/utils/utils'
// import { bamApi } from "@control/services";
// import { mainApi } from '@main/services';
// import { hostURL, casLoginUrl } from '@common/url-conf'

let jsessionId = utils.getUrlParams('JSESSIONID');
if (jsessionId != undefined) {
  // utils.clearCookie("JSESSIONID");
  // utils.setCookie("JSESSIONID", jsessionId, 1);
}

let channelType = utils.getUrlParams('channelType');
if (channelType) {
  localStorage.setItem('channelType', channelType);
}


router.onReady(() => {
  // console.log('enter onReady')
})


router.beforeEach(async (to, from, next) => {

  // 设置title
  let pathItem = store.getters.btnPerssionMap[to.path]
  // if (pathItem && pathItem.label) {
  //   document.title = '中软国际云服务-华夏云网-' + pathItem.label
  // } else {
  //   document.title = '中软国际云服务-华夏云网'
  // }
  document.title = '中软国际云服务-华夏云网';


  // console.log(' getIsLogin 2',store.state.main.currentMenuCode)

  // let isLocalStrageCurrentMenuCode = localStorage.getItem('currentMenuCode')
  // if((!isLocalStrageCurrentMenuCode ) && to.path){
  //   console.log(' enter')
  //   store.dispatch("getMenuData", {
  //     type: utils.getClientType(), //"customers",
  //     toBarLink: to.path.slice(1),
  //   }).then(()=>{
  //     console.log(' callback, to.path is ', to.path)
  //     next({
  //       path: to.path
  //     })
  //   })
  //   console.log(' return false')
  //   return 
  // }

  // console.log(' getIsLogin 3')

  const isLogin = utils.getIsLogin()
  if (isLogin !== 'TRUE' || !store.state.main.userInfo.userCode) {
    if (!to.meta.noLogin) {
      let flag = await store.dispatch('getInfo');
      if (flag === false) {
        // return;
      }


      const isMaster = store.state.main.userInfo.isMaster // 是否是子账号登录
      let loginProtectV
      let isLoginProtect = localStorage.getItem("isLoginProtect"); // 是否提交过登录保护，刷新页面不在进登录保护
      if (!isMaster) { // 子账号登录拉取登录保护
        let { loginProtect } = await store.dispatch('loginProtect');  // 拉取子账号登录保护保护类型 0 关闭 1 手机 2 邮箱
        // loginProtectV = 0
        loginProtectV = loginProtect
      }

      if (!isMaster && loginProtectV != 0 && isLoginProtect != "true") { // 是子账号 设置了的登录保护 没有提交过登录保护
        next({
          path: "/account/typeValidation",
          query: to.query
        })
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

router.afterEach(() => {

})

document.addEventListener('visibilitychange', function (e1, e2) { //浏览器切换事件
  if (store.state.main.userInfo.userCode && localStorage.getItem('userCode') != store.state.main.userInfo.userCode) {
    window.location.href = window.location.origin;
  }
});
