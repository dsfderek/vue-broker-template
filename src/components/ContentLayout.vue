<template>
  <div class="content-layout">
    <template v-if="mode=== 'lr'">
      <div class="page-content-lr-layout page-box">
        <div class="left page-content" :style="leftStyle">
          <slot name="left" />
        </div>
        <div class="right page-content" :style="rightStyle">
          <slot name="right" />
        </div>
      </div>
    </template>
    <template v-else>
      <div ref="customContent">
        <slot name="custom"></slot>
      </div>
      <div class="page-content-tb-layout page-box" :style="{height:tbHeight}">
        <div class="page-content top" :style="topStyle">
          <slot name="top" />
        </div>
        <div class="page-content bottom" :style="bottomStyle">
          <slot name="bottom" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "ContentLayout",
  props: {
    /**
     * 布局模式，默认左右布局
     * lr:左右布局
     * tb:上下布局
     */
    mode: {
      type: String,
      default: () => "lr"
    },
    leftWidth: {
      type: Number | String,
      default: () => 286
    },
    topHeight: {
      type: Number | String,
      default: () => 252
    }
  },
  data() {
    return {
      // 108 是topBar高度+面包屑高度
      defaultTbHeight: 108,
      tbHeight: `calc(100vh - ${this.defaultTbHeight}px)`
    };
  },
  computed: {
    leftStyle() {
      return {
        width: `${this.leftWidth}px`,
        minWidth: `${this.leftWidth}px`
      };
    },
    rightStyle() {
      return {
        width: `calc(100% - ${this.leftWidth}px)`
      };
    },
    topStyle() {
      return {
        height: `${this.topHeight}px`,
        minHeight: `${this.topHeight}px`,
        marginBottom: 0
      };
    },
    bottomStyle() {
      return {
        height: `calc(100% - 32px)`,
        minHeight: `0px`,
        marginTop: `12px`
      };
    }
  },
  mounted() {
    this.$nextTick(() => {
      let customContentHeight =
        (this.$refs.customContent && this.$refs.customContent.clientHeight) ||
        0;
      this.tbHeight = `calc(100vh - ${this.defaultTbHeight +
        customContentHeight}px)`;
    });
  }
};
</script>

<style lang="scss" scoped>
.content-layout {
  .page-content-lr-layout {
    width: 100%;
    display: flex;
    .left {
      // width: 286px;
      // min-width: 286px;
      padding: 0;
      margin: 20px 0 20px 20px;
    }
    .right {
      // width: calc(100% - 286px);
      margin: 20px 20px 20px 12px;
      padding: 20px;
    }
  }
  .page-content-tb-layout {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    .top {
    }
    .bottom {
    }
  }
}
</style>
