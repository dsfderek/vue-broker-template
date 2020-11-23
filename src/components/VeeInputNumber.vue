<template>
  <ValidationProvider :vid="vid" :name="$attrs.label" :rules="rules" v-slot="{ errors }">
    <el-form-item
      :error="errors[0]"
      :label="$attrs.label+''"
      :rules="[{ required: $attrs.require}]"
      class="input-number-form-item"
    >
      <el-input-number v-bind="$attrs" v-model="innerValue"></el-input-number>
    </el-form-item>
  </ValidationProvider>
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
    trimDisable: {
      type: Boolean,
      default: () => true
    },
    rules: {
      type: [Object, String],
      default: ""
    },
    value: {
      type: String | Number
    }
  },
  data() {
    return {
      innerValue: ""
    };
  },
  watch: {
    innerValue(newVal) {
      this.$emit("input", newVal);
    },
    value(newVal) {
      this.innerValue = newVal;
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  }
};
</script>
<style lang="scss" scoped>
.input-number-form-item {
}
</style>
