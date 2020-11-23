<template>
  <ValidationProvider :vid="vid" :name="$attrs.errorMessage?$attrs.errorMessage:$attrs.label" :rules="rules" v-slot="{ errors }">
    <el-form-item :error="errors[0]" :label="$attrs.label+''" :rules="[{ required: $attrs.require}]">
      <el-input 
        v-bind="$attrs" 
        :type="!showPassword?'password':'text'" 
        :style="{width: $attrs.innerWidth || ''}"
        @blur="veeBlurEvent($event)"
        v-model="innerValue"
      >
        <!-- <i 
          slot="suffix" 
          @click.native="showHideEyeIcon()" 
          :class="showPassword?'el-input__icon iconfont icon-view pwd-icon':'el-input__icon iconfont icon-view-off pwd-icon'"
        ></i> -->
      </el-input>
      <i  @click="showHideEyeIcon" class="iclass" :style="shows($attrs.innerWidth)" :class="showPassword?'el-input__icon iconfont icon-view pwd-icon':'el-input__icon iconfont icon-view-off pwd-icon'"></i>
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
      }
    },
    data: () => ({
      innerValue: "",
      showPassword:false,
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
      },
      showHideEyeIcon() {
        console.log('this.showPassword is '+this.showPassword);
        this.showPassword = !this.showPassword;
        return false;
      },
      shows(val){
       // debugger
        let a=val.split('px')[0]
       return{
         left:a-30+'px'
       } 

      }
    }
  };
</script>
<style lang="scss">
.pwd-icon{
  color:#6D7383
}
.iclass{
position: absolute;
top: 2px;
cursor: pointer;
}
</style>


