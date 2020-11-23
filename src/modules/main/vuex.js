import { utils } from "@utils/utils";
import { mainApi } from '@main/services';
import { SUPPERADMIN } from "@common/constant";
import { bamApi } from "@control/services";
import { message } from "@/common/reset-msg";

let currentMenuCode = ''
let leftMenuData = ''

try {
  if (localStorage.getItem("currentMenuCode")) {
    currentMenuCode = localStorage.getItem("currentMenuCode")
  }

  if (localStorage.getItem("leftMenuData")) {
    leftMenuData = JSON.parse(localStorage.getItem("leftMenuData"))
  }
} catch (error) { }

const state = {
  userInfo: {},
  leftMenuData: [],
  systemType: '',
  menuTitle: '',
  menuSelect: '',
  sideBarMenu: leftMenuData || [],
  currentMenuCode: currentMenuCode || '',
  currentMenuStatus: true,
  loginProtect: {}
};
const getters = {
  userInfo: state => state.userInfo,
  parentUserName: state => state.userInfo.masterAuthUserInfo.userName,
  userName: state => state.userInfo.userName,
  userId: state => state.userInfo.id,
  userCode: state => state.userInfo.userCode,
  mainUserCode: state => state.userInfo.masterAuthUserInfo.userCode,
  mainUserInfo: state => state.userInfo.masterAuthUserInfo,
  isSupperAdmin: state => {
    return state.userInfo.userCode === SUPPERADMIN
  },
  btnPerssionMap: state => {
    let returnPerssionMap = {};

    const leftMenuData = JSON.parse(localStorage.getItem("leftMenuData")) || [];

    leftMenuData.forEach((item, index) => {
      if (!item.children) {
        let tempPath = '/' + item.name;
        returnPerssionMap[tempPath] = item;
        return
      }
      if (item.children) {
        //页面路由
        item.children &&
          item.children.forEach((pageItem, index) => {
            let tempPath = '/' + item.path + '/' + pageItem.name;
            returnPerssionMap[tempPath] = pageItem;
          });
      }
    });
    return returnPerssionMap;
  },
  // // 打平的菜单，只有一个层级
  // flatMenu (state) {
  //   return utils.flatObject(state.menus).map(menu => ({
  //     ...menu,
  //     id: menu.id + ''
  //   }))
  // },
  // isSuperAdmin (state) {
  //   return state.userInfo.userType === 3
  //   // return state.userInfo && state.userInfo.roleVoList && state.userInfo.roleVoList.filter(r => r.roleCode === 'OP001').length === 1
  // },
  // categoryMap (state) {
  //   const map = {}
  //   state.categoryList.forEach(c => {
  //     map[c.value] = c.label
  //   })
  //   return map
  // },
  // isOp (state) {
  //   return state.userInfo.companyCode === 'oppein.com'
  // },
  // isJxs (state) {
  //   return state.userInfo.userType === 2
  // },
  // allAreasK (state) {
  //   const allAreasK = {}
  //   state.allAreas.forEach((item) => {
  //     allAreasK[item.id] = item.provinceName
  //   })
  //   return allAreasK
  // }
};
const mutations = {
  sideBarMenu(state, menuData) {
    state.sideBarMenu = menuData;
  },
  setUserInfo(state, obj) {
    state.userInfo = obj;
  },
  setleftMenuData(state, obj) {
    state.leftMenuData = obj;
  },
  switchSystemMutations(state, obj) {
    state.systemType = obj;
  },
  setMenuTitle(state, obj) {
    state.menuTitle = obj;
  },
  setMenuSelect(state, obj) {
    state.menuSelect = obj
  },
  currentMenuCode(state, obj) {
    state.currentMenuCode = obj
  },
  setMenuStatus(state, obj) {
    state.currentMenuStatus = obj
  },
  loginProtect(state, obj) {
    state.loginProtect = obj
  },
};
const actions = {
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      mainApi
        .mainQueryUserInfo(state.token)
        .then(response => {
          if (response.result) {
            const { obj } = response;
            if (obj) {
              // console.log("get info", obj);
              commit("setUserInfo", obj);
              localStorage.setItem('userCode', obj.userCode);
              utils.setLoginSuccess();
            }
            resolve(true);
          }
          resolve(false);
        })
        .catch(error => {
          resolve(false);
        });
    });
  },
  getMenuData({ commit, state }, data) {
    const apiName = data.type
    const toBarLink = data.toBarLink

    // 菜单接口异常，捕获错误
    try {

      return new Promise((resolve, reject) => {
        mainApi
          .getLeftMenuData(apiName)
          .then(response => {
            // console.log(response);
            const { obj } = response;
            if (!obj || !obj[0] || !obj[0].children) {
              console.log("菜单数据返回空");
              return;
            }
            let menuData = [...obj[0].children];
            menuData = mapMenuData(menuData);
            mapMenuChildren(menuData);
            commit("setleftMenuData", menuData);
            commit("sideBarMenu", menuData);
            localStorage.setItem("leftMenuData", JSON.stringify(menuData));
            // 存菜单类型
            localStorage.setItem("subSystemCode", apiName);
            commit("setMenuTitle", obj[0].name);
            localStorage.setItem("leftMenuTitle", obj[0].name);

            // 不同的端的默认页面路由
            var getMenuCode = (menuData, toBarLink) => {
              menuData.forEach(item => {
                if (item.name === toBarLink && !item.children) {
                  commit("currentMenuCode", item.code);
                  localStorage.setItem("currentMenuCode", item.code);
                  console.log('currentMenuCode================+++++++', item.code);
                  resolve()
                  // selfRouter.push("/" + toBarLink);
                }
                if (item.children && item.children.length > 0) {
                  item.children.forEach(i => {
                    const path = item.name + '/' + i.name
                    if (path === toBarLink) {
                      commit("currentMenuCode", i.code);
                      console.log('currentMenuCode================', i.code);
                      localStorage.setItem("currentMenuCode", i.code);
                      resolve()
                      // selfRouter.push("/" + toBarLink);
                    }
                  })
                }
              })
            }
            getMenuCode(menuData, toBarLink)
          })
          .catch(e => {
            message.error(e);
          });
      })

    } catch (error) {
      message.error(error);
    }
  },
  loginProtect({ commit, state }) {
    return new Promise((resolve, reject) => {
      bamApi.bamCustomerSecurityLogin()
        .then(response => {
          if (response.result) {
            const obj = response.obj
            if (obj.loginProtect && obj.loginProtect !== 0) {
              localStorage.setItem("loginProtect", obj.loginProtect)
              localStorage.setItem("loginProtectV", obj.loginProtect == 1 ? obj.telephone : obj.email)
            }
            resolve(obj);
          }
          resolve(false);
        })
        .catch(error => {
          resolve(false);
        });
    });
  },
  // loginProtect ({ commit, state }){
  //   return new Promise((resolve, reject) => {
  //     bamApi.bamCustomerSecurityLogin()
  //       .then(response => {
  //         if (response.result) {
  //           const { obj } = response;
  //           if (obj) {
  //             // console.log("get info", obj);
  //             // commit("setUserInfo", obj);
  //             // utils.setLoginSuccess();
  //           }
  //           resolve(true);
  //         }
  //         resolve(false);
  //       })
  //       .catch(error => {
  //         resolve(false);
  //       });
  //   });
  // }
};


function getMenuCode() { }


function mapMenuData(obj) {
  let newMenu = obj.map(item => {
    item.label = item.name;
    item.name = item.path;
    return item;
  });
  return newMenu;
}
function mapMenuChildren(obj) {
  obj.forEach(element => {
    if (element.children && element.children.length > 0) {
      element.children = mapMenuData(element.children);
      mapMenuChildren(element.children);
    }
  });
}

export default {
  state,
  actions,
  mutations,
  getters
};
