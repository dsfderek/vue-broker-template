<template>
  <div :class="isFold ? 'side-bar' : 'side-bar fold'" id="fold-box">
    <div class="side-bar-fold">
      <span v-if="isFold">{{
        leftMenuTitle == "" ? localStorageLeftMenuTitle : leftMenuTitle
      }}</span>
      <i
        :class="
          isFold
            ? 'iconfont icon-menu-close fold-line'
            : 'iconfont icon-menu-open fold-line'
        "
        @click="clickFold"
      ></i>
    </div>
    <div class="menu-line"></div>

    <el-menu
      :default-active="activeMenu"
      :collapse="!isFold"
      :unique-opened="true"
      :collapse-transition="false"
      mode="vertical"
      class="side-menu"
      @select="linkTo"
    >
      <div v-for="menu in sideBarMenu" :key="menu.name">
        <!-- 只有一个子集 -->
        <div v-if="!menu.children">
          <div @click="jumpRouter('/' + menu.path, menu.code)">
            <el-menu-item
              :index="'/' + menu.name"
              :class="{ 'is-active2': activeMenu === '/' + menu.name }"
            >
              <i :class="'iconfont ' + menu.icon"></i>
              <span slot="title">{{ menu.label }}</span>
            </el-menu-item>
          </div>
        </div>
        <!-- 有多个子集 -->
        <div v-else>
          <el-submenu :index="'/' + menu.name">
            <template slot="title">
              <i :class="'iconfont ' + menu.icon"></i>
              <span>{{ menu.label }}</span>
            </template>
            <el-menu-item-group>
              <div
                v-for="child in menu.children"
                :key="child.name"
                @click="
                  jumpRouter('/' + menu.name + '/' + child.name, child.code)
                "
              >
                <el-menu-item
                  :class="{
                    'is-active2':
                      activeMenu === '/' + menu.name + '/' + child.name,
                  }"
                  :index="'/' + menu.name + '/' + child.name"
                >
                  <i class="item-icon"></i>
                  <span slot="title">{{ child.label }}</span>
                </el-menu-item>
              </div>
            </el-menu-item-group>
          </el-submenu>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
// import { utils } from "@/utils/utils";
export default {
  data() {
    return {
      isFold: true,
      // defaultActive: "0-0",
      menuData: [],
      // localStorageLeftMenuData: [],
      localStorageLeftMenuTitle: "",
      pathRouter: "",
      // leftMenuData:[]
    };
  },
  computed: {
    sideBarMenu: function () {
      return this.$store.state.main.sideBarMenu;
    },
    // leftMenuData: function() {
    //   return this.$store.state.main.leftMenuData;
    // },
    leftMenuTitle: function () {
      return this.$store.state.main.menuTitle;
    },
    // menuSelectActive() {
    //   return this.$store.state.main.menuSelect;
    // },
    ...mapState({
      userInfo: (state) => state.main.userInfo,
    }),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (path !== "/control/notAllow") {
        // const subSystemCode = localStorage.getItem("subSystemCode");
        // if (meta.subSystemCode && meta.subSystemCode !== subSystemCode) {
        //   this.$store.dispatch("getMenuData", {type:meta.subSystemCode});
        //   //this.$store.dispatch("getMenuData", meta.subSystemCode);
        // }
        this.$store.dispatch("getMenuData", { type: meta.subSystemCode });
        if (meta.parent) {
          return meta.parent;
        }
        return path;
      } else {
        return this.pathRouter;
      }
    },
  },
  mounted() {
    const className = document.querySelector(`#main-layout-content-wrap`).className;
    if (className == 'content-wrap fold') {
      this.isFold = false;
    } else {
      this.isFold = true;
    }
    // this.localStorageLeftMenuData = JSON.parse(
    //   localStorage.getItem("leftMenuData")
    // );
    this.localStorageLeftMenuTitle = localStorage.getItem("leftMenuTitle");
  },
  watch: {
    // menuSelectActive(newVal, oldVal) {
    //   this.autoActiveMenu(newVal);
    // }
  },
  methods: {
    clickFold() {
      if (this.isFold) {
        this.isFold = false;
      } else {
        this.isFold = true;
      }
      this.$emit("fold", this.isFold);
      this.$store.commit("setMenuStatus", this.isFold);
    },
    linkTo(index, indexPath) {
      // localStorage.setItem("defaultActive", index);
      // this.defaultActive = index;
    },
    jumpRouter(path, code) {
      this.pathRouter = path;
      this.$router.push(path);
      this.$store.commit("currentMenuCode", code);
      localStorage.setItem("currentMenuCode", code);
    },
    // defaultClick(activeMenu) {
    // let channelType = utils.getUrlParams('channelType');
    // let isLoginProtect = localStorage.getItem("isLoginProtect");

    // if(channelType === '3' && (!isLoginProtect || isLoginProtect === 'false')) {//开启手机或邮箱
    //     this.isOpenChildAccountProtect()
    // } else { //默认首页
    // }
    // },
    // autoActiveMenu(activeMenu) {
    //   if (activeMenu) {
    //     setTimeout(function() {
    //       if (document.all) {
    //         // IE浏览器
    //         document.getElementById(activeMenu).click();
    //       } else {
    //         // 其他浏览器
    //         var e = document.createEvent("MouseEvents");
    //         e.initEvent("click", true, true);
    //         document.getElementById(activeMenu) &&
    //           document.getElementById(activeMenu).dispatchEvent(e);
    //       }
    //     }, 0);
    //   }
    // }
    // async isOpenChildAccountProtect(){
    //   // const { result, obj } = await bamApi.bamCustomerSecuritySet("BCUSCLICUS22363090461016064")
    //   const { result, obj } = await bamApi.bamCustomerSecuritySet(this.userInfo.userCode)
    //   if(result){
    //     // loginProtect 0 关闭  1 手机  2 邮箱
    //     if(obj.loginProtect && obj.loginProtect !== 0){
    //       localStorage.setItem("loginProtect", obj.loginProtect)
    //       localStorage.setItem("loginProtectV", obj.loginProtect == 1 ? obj.telephone : obj.email)
    //       this.$router.push({
    //         path: "/account/typeValidation"
    //       });
    //     }
    //   }
    // },
  },
};
</script>
<style lang="scss" scoped>
.side-bar .el-menu-item.is-active2 {
  background: #ecf3ff !important;
  border-left: 3px solid #3369ff !important;
}
.side-bar .el-menu-item.is-active {
  background: none;
  border-left: 3px solid #fff;
}
.side-bar {
  width: 220px;
  box-shadow: 1px 0px 4px 0px rgba(33, 76, 217, 0.17);
  background: #ffffff;
  vertical-align: top;
  color: #1e2b4d;
  float: left;
  padding-bottom: 9999vh;
  margin-bottom: -9999vh;
  transform: translate3d(0, 0, 0);
  .side-bar-fold {
    height: 60px;
    margin: 0 24px;
    line-height: 60px;
    font-weight: bold;
    .fold-line {
      font-weight: normal;
      vertical-align: bottom;
      cursor: pointer;
      float: right;
    }
  }
  .menu-line {
    height: 1px;
    background: #e6eaf5;
    margin: 0 24px;
    margin-bottom: 10px;
  }
  .side-menu {
    margin-bottom: 10px;
    .iconfont {
      margin-right: 16px;
    }
  }
}

.side-bar.fold {
  width: 48px;
  overflow: hidden;
  transition: all 0.1s ease, 0.1s ease;
  .fold-line {
    position: absolute;
    left: 17px;
  }
  .menu-line {
    margin: 0 8px;
    margin-bottom: 10px;
  }
  .side-menu {
    .iconfont {
      margin-left: -8px;
      transition: all 0.1s ease, 0.1s ease;
    }
  }
}
</style>
<style lang="scss">
/*el-cover*/
.side-bar,
.side-bar.fold {
  .el-menu--collapse {
    width: 48px;
  }
}

.side-bar.fold {
  .el-submenu.is-active .el-submenu__title {
    background-color: #ecf3ff;
  }
  .el-menu--collapse .el-submenu .el-submenu__title .el-submenu__icon-arrow {
    display: none;
  }
}
</style>
