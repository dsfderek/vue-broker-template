<template>
  <div class="step-ul">
    <!-- 成功 -->
    <div v-if="internalStatus == 'finish'" class="step-li" :class="isLast?'':'bottom2'">
      <div class="left">
        <i class="el-icon-check"></i>
      </div>
      <div ref="refRight" class="right">
        <span class="h1">{{title || ''}}</span>
        <span class="h2">{{description || ''}}</span>
        <div ref="refRight">
          <slot></slot>
        </div>
      </div>
    </div>
    <!-- 当前 -->
    <div v-else-if="internalStatus == 'process'" class="step-li" :class="isLast?'':'bottom'">
      <div class="left-pro"></div>
      <div ref="refRight" class="right">
        <span class="h1">{{title || ''}}</span>
        <span class="h2">{{description || ''}}</span>
        <div ref="refRight">
          <slot></slot>
        </div>
      </div>
    </div>
    <!-- 未完成 -->
    <div v-else class="step-li" :class="isLast?'':'bottom'">
      <div class="left-fai">
        <span class="icon-down"></span>
      </div>
      <div ref="refRight" class="right">
        <span class="h1">{{title || ''}}</span>
        <span class="h2">{{description || ''}}</span>
        <div ref="refRight">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    description: String,
    title: String,
  },
  data() {
    return {
      index: -1,
      // 成功状态
      finishStatus: "finish",
      // 当前状态
      processStatus: "process",
      // 未操作状态
      failedStatus: "failed",
      internalStatus: "",
    };
  },
  methods: {
    updateStatus(val) {
      if (val > this.index) {
        //结束步骤状态
        this.internalStatus = this.finishStatus;
      } else if (val === this.index && this.prevStatus !== "error") {
        //当前步骤状态
        this.internalStatus = this.processStatus;
      } else {
        // 未完成状态
        this.internalStatus = this.failedStatus;
      }
    },
  },
  mounted() {
    // 监听active
    const unwatch = this.$watch("index", (val) => {
      this.$watch("$parent.active", this.updateStatus, {
        immediate: true,
      });
      unwatch();
    });
  },
  // dom加载前添加该项给父组件，形成数组
  beforeCreate() {
    this.$parent.steps.push(this);
  },
  // dom销毁前移除
  beforeDestroy() {
    const steps = this.$parent.steps;
    console.log(steps);
    const index = steps.indexOf(this);
    if (index >= 0) {
      steps.splice(index, 1);
    }
  },
  computed: {
    // 判断当前是不是最后步骤
    isLast() {
      const parent = this.$parent;
      return parent.steps[parent.steps.length - 1] === this;
    },
  },
};
</script>

<style lang="scss" scoped>
.step-ul {
  position: relative;
  .bottom::after {
    content: "";
    display: block;
    height: calc(100% - 44px);
    width: 2px;
    background: #d6d8df;
    position: absolute;
    left: 11px;
    bottom: 10px;
  }
  .left-pro {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(51, 105, 255, 0.25);
    box-shadow: 0px 2px 10px 0px rgba(78, 124, 255, 0.18);
    position: relative;
  }
  .left-pro::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 11px;
    height: 11px;
    background: #3369ff;
    border: 0.3px solid #ffffff;
    border-radius: 50%;
  }
  .left-fai {
    width: 24px;
    height: 24px;
    background: #f4f7fc;
    border: 1px solid #dbdeea;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(163, 169, 183, 1);
    font-size: 16px;
    display: flex;
    flex-direction: column;
    .icon-down {
      display: block;
      width: 8px;
      height: 8px;
      border: 1.5px solid #a3a9b7;
      border-top: 0px;
      border-left: 0px;
      transform: rotate(45deg);
      position: absolute;
      top: 5px;
    }
  }
  .bottom2::after {
    background-color: #3369ff;
    content: "";
    display: block;
    height: calc(100% - 44px);
    width: 2px;
    position: absolute;
    left: 11px;
    bottom: 10px;
  }
  .step-li {
    display: flex;
    align-content: center;
    .left {
      width: 24px;
      height: 24px;
      background: #3369ff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      font-size: 16px;
      display: flex;
      flex-direction: column;
    }
    .right {
      margin-left: 20px;
      width: 100%;
      display: flex;
      margin-top: 4px;
      flex-direction: column;
      .h1 {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #1e2b4d;
      }
      .h2 {
        font-size: 12px;
        margin-top: 12px;
        font-family: Roboto-Regular, Roboto;
        color: #a3a9b7;
      }
    }
  }
}
</style>