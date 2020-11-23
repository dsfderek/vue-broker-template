<template>
  <div class="two-select-container">
    <ValidationProvider :vid="vid" :name="$attrs.errorMessageOne?$attrs.errorMessageOne:$attrs.label" :rules="rules" v-slot="{ errors }">
      <el-form-item class="form-item-row" :error="errors[0]" :label="$attrs.label+''" :rules="[{ required: $attrs.require}]">
        <el-select v-model="innerValue" @change="$attrs.changeOne" v-bind="$attrs" v-on="$listeners">
          <slot name="left" />
        </el-select>
      </el-form-item>
    </ValidationProvider>
    <ValidationProvider class="second-valid-container" :name="$attrs.errorMessageTwo?$attrs.errorMessageTwo:$attrs.label" :rules="rules" v-slot="{ errors }">
      <el-form-item class="form-item-row" :error="errors[0]"  :rules="[{ required: $attrs.require}]">
        <el-select v-model="innerValue2" @change="$attrs.changeTwo" v-bind="$attrs" v-on="$listeners">
          <slot name="right"/>
        </el-select>
      </el-form-item>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";

export default {
  components: {
    ValidationProvider
  },
  props: {
    vid: {
      type: String
    },
    rules: {
      type: [Object, String],
      default: ""
    },
    // must be included in props
    value: {
      type: null
    },
    value2: {
      type: null
    }
  },
  data: () => ({
    innerValue: "",
    innerValue2: ""
  }),
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit("input", newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal;
    },
    // Handles internal model changes.
    innerValue2(newVal) {
      this.$emit("input", newVal);
    },
    // Handles external model changes.
    value2(newVal) {
      this.innerValue2 = newVal;
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }

    if (this.value2) {
      this.innerValue2 = this.value2;
    }
  }
};
</script>


<style lang="scss">
.two-select-container {
  display: flex;
  justify-content: flex-start;
  .second-valid-container {
    .el-form-item__content{
      margin-left:10px !important;
    }
  }
}
</style>