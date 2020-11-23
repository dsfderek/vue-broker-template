<template>
  <ValidationProvider :vid="vid" :name="$attrs.label" :rules="rules" v-slot="{ errors }">
    <el-form-item
      :error="errors[0]"
      :label="$attrs.label+''"
      :rules="[{ required: $attrs.require}]"
      class="switch-select"
    >
      <switch-component :rowData="switchData" @switch="switchChange" :flage="false"></switch-component>
    </el-form-item>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import SwitchComponent from "@/components/SwitchComponent";
export default {
  components: {
    ValidationProvider,
    SwitchComponent
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
      innerValue: "",
      switchData: {
        status: this.value
      }
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
  },
  methods: {
    switchChange(data) {
      this.switchData.status = data.status;
      this.$emit("input", `${data.status}`);
    }
  }
};
</script>
<style lang="scss" scoped>
.switch-select {
  >>> .el-form-item__content {
    display: flex;
  }
  .select {
    margin-left: 20px;
  }
}
</style>
