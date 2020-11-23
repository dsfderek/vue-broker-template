<template>
  <div class="main-layout">
    <top-bar></top-bar>
    <div class="body-content" v-if="!$route.meta.noSideBar">
      <div :class="isFold ? 'content-wrap' : 'content-wrap fold'" id="main-layout-content-wrap">
        <router-view id="main-page-scroll-id" class="main-page-scroll"></router-view>
      </div>
      <side-bar @fold="changeHandle"></side-bar>
    </div>
    <div class="body-content" v-else>
      <router-view></router-view>
    </div>
    <contact></contact>
  </div>
</template>

<script>
import TopBar from "@/modules/main/view/layout/TopBar";
import SideBar from "@/modules/main/view/layout/SideBar";
import Contact from "@components/Contact";

export default {
  components: {
    Contact,
    TopBar, SideBar },
  data() {
    return {
      isFold: true
    };
  },
  created() {},
  methods: {
    changeHandle(val) {
      this.isFold = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.main-layout {
  min-width: 1366px;
  .body-content {
    width: 100%;
    overflow: hidden;
    background: #f4f7fc;
    height: calc(100vh - 50px);
    .content-wrap {
      float: right;
      width: calc(100% - 220px);
      height: 100%;
    }
    .content-wrap.fold {
      float: right;
      width: calc(100% - 48px);
      transition: all 0.1s ease, 0.1s ease;
    }
    .main-page-scroll {
      height: 100%;
      overflow-y: auto;
    }
  }
}
</style>
