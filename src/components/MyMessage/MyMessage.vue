<template>
  <div v-if="visible" class="my-message-box-outer">
    <div class="my-message-box-inner" :style="calcWidth()">
      <div class="my-message-tile">
        <span class="my-message-tile-text">{{ title }}</span>
        <i v-if="showClose" class="iconfont icon-close" @click="closeMe()"></i>
      </div>
      <div class="my-message-content">
        <div class="my-message-content-lev1">
          <span v-if="!hideIcon" class="my-message-content-type iconfont" :class="setIconClass()"></span>
          <div v-html="content"></div>
        </div>
        <div class="my-message-content-lev2">
          <div v-html="subContent"></div>
        </div>
      </div>
      <div class="my-message-btn">
        <template v-for="item of btn">
          <el-button
            :loading="(item.loading ? item.loading.flag : false)"
            :key="item.index"
            :type="item.type || ''"
            size="mini"
            @click="item.fn()"
          >{{ item.text }}</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MyMessage",
    data() {
      return {
        visible: false,
        width: "300px",
        type: "info", // success,warning,error,info,wait
        content: "", // 一级内容内容
        subContent: "", // 二级内容
        title: "提示", // 弹框标题
        hideIcon: false, // 是否隐藏前面的ICON
        closeCallBakFn: null, // 点击弹框关闭按钮，如果有该方法则回调该方法
        btn: [
          {
            type: "", // 按钮样式
            text: "", // 按钮文本
            loading: false,
            fn: () => {
              // 点击事件处理
            }
          }
        ],
        showClose:true // 是否显示右上角关闭按钮
      };
    },
    created() {},
    mounted() {},
    beforeDestroy() {},
    methods: {
      closeMe() {
        this.visible = false;
        if(this.closeCallBakFn && typeof this.closeCallBakFn === 'function'){
          this.closeCallBakFn();
        }
      },
      setIconClass() {
        return `icon-tip-${this.type}`;
      },
      calcWidth() {
        if (this.width) {
          return {
            width: this.width
          };
        } else {
          return null;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .my-message-box-outer {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    .my-message-box-inner {
      width: 300px;
      background: #fff;
      .my-message-tile {
        background: #fff;
        padding: 24px 0 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .my-message-tile-text {
          font-size: 14px;
          color: #212A40;
          font-weight: bold;
        }
        .iconfont.icon-close {
          font-size: 20px;
          position: relative;
          top: -14px;
          right: 11px;
          cursor: pointer;
          &:hover {
            color: #3369ff;
          }
        }
      }
      .my-message-content {
        margin: 20px;
        text-align: left;
        .my-message-content-lev1 {
          color: #212a40;
          font-size: 12px;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          line-height: 24px;
          .my-message-content-type {
            width: 18px;
            height: 24px;
            margin-right: 8px;
            flex: none;
          }
        }
        .my-message-content-lev2 {
          color: #666666;
          line-height: 20px;
          margin-top: 20px;
          font-size: 12px;
          margin-left: 24px;
        }
      }
      .my-message-btn {
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
