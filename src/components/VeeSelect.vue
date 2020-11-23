<template>
  <ValidationProvider :vid="vid" :name="$attrs.errorMessage?$attrs.errorMessage:$attrs.label" :rules="rules" v-slot="{ errors }">
    <el-form-item :label-width="$attrs['label-width'] || ''" :error="errors[0]" :label="$attrs.label+''" :rules="[{ required: $attrs.require}]">
      <el-select v-model="innerValue" v-bind="$attrs" v-on="$listeners" :style="{width: $attrs.innerWidth || ''}">
        <slot/>
      </el-select>
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
    rules: {
      type: [Object, String],
      default: ""
    },
    // must be included in props
    value: {
      type: null
    }
  },
  data: () => ({
    innerValue: ""
  }),
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit("input", newVal);
    },
    // Handles external model changes.
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
