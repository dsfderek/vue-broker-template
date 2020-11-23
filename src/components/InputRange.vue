<template>
  <div
    class="input-range"
    :class="{'focus':focusFlag, 'error': !validPass}"
    @mouseenter="hoverFlag = true"
    @mouseleave="hoverFlag = false"
  >
    <div class="input-range-item">
      <input
        :placeholder="startPlaceholder"
        @input="inputEvent('range1')"
        @focus="focusFlag = true"
        @blur="focusFlag = false"
        @change="changeEvent('range1')"
        v-model="range1"
      ></input>
    </div>
    <span class="input-range-sep">{{rangeSeparator}}</span>
    <div class="input-range-item">
      <input
        :placeholder="endPlaceholder"
        @input="inputEvent('range2')"
        @focus="focusFlag = true"
        @blur="focusFlag = false"
        @change="changeEvent('range2')"
        v-model="range2"
      ></input>
    </div>
    <span
      v-if="(focusFlag || hoverFlag) && (range1 || range2)"
      @click="clearInputValue"
      class="close-input-range iconfont icon-close"
    ></span>
    <span v-if="!validPass" class="error-tip">{{errorMsg}}</span>
  </div>
</template>

<script>
  export default {
    name: "input-range",
    model: {
      prop: 'rangeData',
      event: 'set-range-data'
    },
    props: {
      'startPlaceholder': {
        type: String,
        default: () => '请输入开始值'
      },
      'endPlaceholder': {
        type: String,
        default: () => '请输入结束值'
      },
      'startError': {
        type: String,
        default: () => '开始值'
      },
      'endError': {
        type: String,
        default: () => '结束值'
      },
      'rangeSeparator': {
        type: String,
        default: () => '~'
      },
      'rangeData': {
        default: () => ''
      },
      'min': {
        type: Number,
        default: () => undefined
      },
      'max': {
        type: Number,
        default: () => undefined
      }
    },
    data() {
      return {
        range1: '',
        range2: '',
        validPass: true,
        errorMsg: '',
        focusFlag: false,
        hoverFlag: false,
      }
    },
    watch: {
      rangeData(newVal, oldVal) {
        if (!newVal) {
          this.range1 = '';
          this.range2 = '';
          this.validPass = true;
        } else {//if (Array.isArray(newVal.constructor()))
          this.range1 = newVal[0] || '';
          this.range2 = newVal[1] || '';
          this.validateRange();
        }
      },
    },
    mounted() {
    },
    methods: {
      clearInputValue() {
        this.range1 = '';
        this.range2 = '';
        this.validPass = true;
        this.errorMsg = '';
      },
      validateRange() {
        if (this.range1 !== '' && this.range2 !== '') {
          // 两个都非空才进行校验
          if (this.range1 - 0 > this.range2 - 0) {
            this.errorMsg = `${this.startError}不能大于${this.endError}`;
            this.validPass = false;
            return;
          } else {
            this.validPass = true;
          }
        } else {
          // 有一个或者两个为空，校验通过
          this.validPass = true;
        }
        if (this.min !== undefined && this.min !== null && this.min !== '') {
          if (this.range1 !== '' && this.range1 - 0 < this.min) {
            this.errorMsg = `只能输入大于${this.min - 1}的数字`;
            this.validPass = false;
            return;
          }
          if (this.range2 !== '' && this.range2 - 0 < this.min) {
            this.errorMsg = `只能输入大于${this.min - 1}的数字`;
            this.validPass = false;
            return;
          }
        }
        if (this.max !== undefined && this.max !== null && this.max !== '') {
          if (this.range1 !== '' && this.range1 - 0 > this.max) {
            this.errorMsg = `只能输入小于${this.max + 1}的数字`;
            this.validPass = false;
            return;
          }
          if (this.range2 !== '' && this.range2 - 0 > this.max) {
            this.errorMsg = `只能输入小于${this.max + 1}的数字`;
            this.validPass = false;
            return;
          }
        }
      },
      inputEvent(type) {
        this[type] = this[type].replace(/[^\d]/g, '');
        let res = [this.range1, this.range2];
        this.$emit('set-range-data', res);
        this.validateRange();
      },
      getValid() {
        return this.validPass;
      },
      changeEvent(type) {
        let res = [this.range1, this.range2];
        this.$emit('change', res);
      }
    }
  }
</script>

<style lang="scss">
  .input-range {
    padding: 0 30px 0 15px;
    position: relative;
    border: 1px solid #DCDFE6;
    display: flex;
    flex-direction: row;
    height: 28px;
    width: 100%;
    transition: 0.3s;
    &:hover{
      border: 1px solid #c0c4cc;
    }
    &.error{
      border: 1px solid #FD6845;
      background-color: #ffefe8;
    }
    &.focus {
      border: 1px solid #409EFF;
    }
    /*&.error {
      border: 1px solid #FD6845;
      input,
      .input-range-sep {
        background-color: #ffefe8;
      }
    }*/
    .error-tip {
      position: absolute;
      top: 100%;
      font-size: 12px;
      margin-top: 2px;
      color: #FD6845;
      left: 0;
    }
    .input-range-item {
      flex: 1;
      input {
        border: none;
        height: 26px;
        width: 100%;
        background-color: transparent;
      }
    }
    .input-range-sep {
      width: 10px;
      flex: none;
      line-height: 28px;
      text-align: center;
      margin: 0 10px;
    }
    .close-input-range {
      position: absolute;
      right: 0;
      width: 30px;
      text-align: center;
      line-height: 28px;
      cursor: pointer;
      color: #909399;
      font-size: 18px;
    }
  }
</style>