import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import mainStore from "@main/vuex";
import contol from "@/modules/contol/vuex";
import news from "@/modules/user-center/news/vuex";
import ecs from "@/modules/console/ecs/vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    main: mainStore,
    contol,
    news,
    ecs
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      reducer: state => ({
        default: {
          //userInfo: state.default.userInfo,
          // menus: state.default.menus,
          // menuTabs: state.default.menuTabs,
          // selectedTab: state.default.selectedTab,
          // noMenuTabsMap: state.default.noMenuTabsMap,
          // allAreas: state.default.allAreas
        }
      })
    })
  ]
});

export default store;
