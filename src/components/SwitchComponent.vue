<template>
  <div>
    <el-switch
      :rowData="rowData"
      :flage="flage"
      :width="17"
      v-model="rowData[valueKey]"
      :active-value="activeValue"
      :inactive-value="inactiveValue"
      :validate-event="true"
      active-color="#55F0D9"
      inactive-color="#DBDEEA"
      :disabled="flage"
      @click.native="handleUpdate(rowData)"
      @change="typeUpdate(rowData)"
    ></el-switch>
    <template v-if="showText">
      <span class="switch-text" v-if="rowData[valueKey]===activeValue">{{activeText}}</span>
      <span class="switch-text" v-else>{{inactiveText}}</span>
    </template>
  </div>
</template>
<script>
  export default {
    props: {
      rowData: {
        type: [Object],
        default: ""
      },
      showText: {
        type: Boolean,
        default: () => true
      },
      flage: {
        type: Boolean,
        default: () => true
      },
      valueKey: {
        type: String,
        default: () => "status"
      },
      activeText: {
        type: String,
        default: () => "已启用"
      },
      inactiveText: {
        type: String,
        default: () => "已停用"
      },
      activeValue: {
        type: Number,
        default: () => 0
      },
      inactiveValue: {
        type: Number,
        default: () => 1
      }
    },
    data() {
      return {
        // activeValue: 0,
        // inactiveValue: 1
      };
    },
    created() {
      this.rowData[this.valueKey] = Number(this.rowData[this.valueKey]);
    },
    mounted(){
      if(this.flage){
        this.$nextTick(()=>{
          Array.from(document.querySelectorAll(".el-switch__input")).forEach(item=>{
            item.disabled  = false;
          })
        })
      }
    },
    methods: {
      //方法可传可不传,不需要操作就不需要传方法
      //0:启用-1:停用/点击事件
      handleUpdate(row) {
        this.$emit("switch", row);
      },
      //change事件
      typeUpdate(row) {
        this.$emit("switchUpdate", row);
      }
    },
    updated() {
      this.rowData[this.valueKey] = Number(this.rowData[this.valueKey]);
    }
  };
</script>
<style lang="scss" scoped>
  .switch-text {
    position: relative;
    top: 2px;
  }
</style>