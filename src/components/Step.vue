<template>
  <div class="custom-step-wrap">
    <div :class="currentStep > 0?'steps-one active':'steps-one'">
      <span class="step-icon-wrap">
        <i :class="currentStep==1?'iconfont icon-step-right':'iconfont icon-step-done'"></i>
      </span>
      <span class="text">{{stepArr[0]}}</span>
    </div>
    <ul class="steps-others">
      <li v-for="index in (stepArr.length-1)" :class="currentStep > index?'active':'un-active'">
        <div v-if="currentStep-1 > index" class="text-box">
          <span class="step-icon-wrap">
            <i class="iconfont icon-step-done"></i>
          </span>
          <span class="text">{{stepArr[index]}}</span>
        </div>
        <p v-if="currentStep-1 > index" class="line"></p>
        <div v-if="currentStep-1 == index" class="text-box">
          <span class="step-icon-wrap">
            <i class="iconfont icon-step-right"></i>
          </span>
          <span class="text">{{stepArr[index]}}</span>
        </div>
        <p v-if="currentStep-1 == index" class="line"></p>
        <div v-if="currentStep-1 < index" class="text-box">
          <span class="step-icon-wrap-left">
            <i class="iconfont icon-step-left"></i>
          </span>
          <span class="text">{{stepArr[index]}}</span>
        </div>
        <p v-if="currentStep-1 < index" class="line gray-line"></p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "step",
  props: {
    // step列表，例如['基础配置','网络配置','高级配置','完成']
    stepArr: {
      type: Array,
      default: () => []
    },
    // 当前步骤，从1开始
    currentStep: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {};
  },

  created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.custom-step-wrap {
  overflow: hidden;
  position: relative;
  margin: 12px 20px;
  .iconfont {
    font-size: 26px;
    line-height: 26px;
    background: #f4f7fc;
  }

  .step-icon-wrap {
    height: 26px;
    width: 26px;
    line-height: 26px;
    background: #3369ff;
    display: inline-block;
    border-radius: 50%;
  }
  .step-icon-wrap-left {
    height: 24px;
    width: 24px;
    line-height: 24px;
    display: inline-block;
    border-radius: 50%;
    background: rgba(244, 247, 252, 1);
    border: 1px solid rgba(219, 222, 234, 1);
  }

  .step-icon-wrap .icon-step-right {
    background-color: #3369ff;
    color: #fff;
    font-size: 12px;
  }
  .step-icon-wrap-left .icon-step-left {
    color: #a3a9b7;
    font-size: 12px;
    background-color: rgba(244, 247, 252, 1);
  }

  .icon-step-done {
    color: #3369ff;
  }
  .steps-one {
    position: absolute;
    top: 0px;
    .icon-step-right {
      margin-left: 7px;
    }
  }
  .steps-others {
    display: flex;
    li:first-child {
      width: 308px;
      .line {
        margin-left: 88px;
        margin-right: 86px;
        border-bottom: 2px solid #3369ff;
        margin-top: 3px;
      }
      .gray-line {
        border-bottom: 2px solid #d6d8df;
      }
    }
    li {
      /*flex: auto;*/
      text-align: end;
      width: 222px;
      .line {
        border-bottom: 2px solid #3369ff;
      }
      .gray-line {
        border-bottom: 2px solid #d6d8df;
      }
    }

    .text-box {
      float: right;
      width: 110px;
      text-align: center;
    }
    .line {
      vertical-align: middle;
      height: 12px;
      margin-right: 81px;
      border-bottom: 2px solid #3369ff;
      margin-top: 3px;
    }
  }

  .number {
    display: inline-block;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    font-size: 18px;
    color: #fff;
    font-weight: 400;
    margin-right: 2px;
    background-color: #ccc;
  }

  .active {
    .number {
      background-color: #00bcc8;
    }
    .text {
    }
  }
  .text {
    padding-left: 4px;
    color: #999;
    font-size: 14px;
    font-size: 12px;
    color: rgba(33, 42, 64, 1);
    vertical-align: bottom;
    line-height: 24px;
    margin-right: 10px;
  }
}
</style>