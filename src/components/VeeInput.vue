<template>
  <ValidationProvider :vid="vid" :mode="mode" :name="$attrs.errorMessage?$attrs.errorMessage:$attrs.label" :rules="rules" v-slot="{ errors }" ref="validateProviderRef">
    <el-form-item :label-width="$attrs['label-width'] || ''" :error="errors[0]" :label="$attrs.label+''" :rules="[{ required: $attrs.require}]">
      <el-input v-bind="$attrs" :type="$attrs.type" clearable
                v-on="$listeners"
                :style="{width: $attrs.innerWidth || ''}"
                @blur="veeBlurEvent($event)"
                v-model="innerValue">
        <slot name="before" slot="prepend"></slot>
      </el-input>
      <slot name="innerAfter"></slot>
    </el-form-item>
  </ValidationProvider>
</template>

<script>
  import {ValidationProvider} from "vee-validate";

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
      // must be included in props
      value: {
        type: null
      },
      // 校验触发模式：aggressive[input,blur],lazy[change]
      // 参考vee-validate.js的822行，4种触发方式
      mode: {
        type: String,
        default: 'lazy'
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
    },
    methods: {
      veeBlurEvent(event) {
        if (this.trimDisable && this.innerValue) {
          this.innerValue = this.innerValue.toString().trim();
        }
        this.$refs.validateProviderRef.validate();
      }
    }
  };
</script>
