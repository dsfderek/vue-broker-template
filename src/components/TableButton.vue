<template>
  <el-tooltip :disabled="disabled" :content="content" :placement="placement">
    <el-button
      type="text"
      @click="clientEvent"
    >
      <i class="iconfont" :class="iconClass"></i>
    </el-button>
  </el-tooltip>
</template>

<script>
  export default {
    name: "table-button",
    props: {
      content: {
        type: String,
        default: () => '查看'
      },
      placement: {
        type: String,
        default: () => 'top-end'
      },
      disabled: {
        type: Boolean,
        default: () => false
      },
      iconClass: {
        type: String,
        default: () => 'icon-table-view'
      }
    },
    methods: {
      clientEvent() {
        this.$emit('click');
      }
    }
  }
</script>

<style scoped>

</style>