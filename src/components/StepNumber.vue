<template>
  <ul class="step-num-box">
    <li class="step-list"
        v-for="(item, index) of stepArr"
        :key="index"
        :class="{'active': (index + 1) === currentStep, 'done': (index + 1) < currentStep}">
      <span class="step-icon">{{index + 1}}</span>
      <span class="step-text">{{item}}</span>
      <span class="step-line" v-if="index !== stepArr.length - 1">线条</span>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "step-number",
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
      },
    },
  }
</script>

<style lang="scss" scoped>
  .step-num-box {
    font-size: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .step-list {
      display: flex;
      flex-direction: row;
      align-items: center;
      .step-icon {
        background-color: #fff;
        color: #A3A9B7;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        border: 1px solid #DBDEEA;
        box-sizing: border-box;
      }
      .step-text {
        margin-left: 5px;
        color: #212A40;
        white-space: nowrap;
      }
      .step-line {
        width: 94px;
        height: 1px;
        background-color: #DBDEEA;
        overflow: hidden;
        margin: 0 8px;
      }
      &.active,
      &.done {
        .step-icon {
          border: 1px solid #3369FF;
          background-color: #3369FF;
          color: #fff;
        }
      }
      &.done {
        .step-line {
          background-color: #3369FF;
        }
      }
    }
  }
</style>