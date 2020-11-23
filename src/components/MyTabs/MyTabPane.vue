
<template>
  <div v-if="show">
    <slot></slot>
  </div>
</template>
 
<script>
export default {
  name: "my-tab-pane",
  data() {
    return {
      show: true,
    };
  },
  props: {
    //设置pane的标识
    name: {
      type: String,
    },
    //label是设置标题
    label: {
      type: String,
      default: "",
    },
  },
  methods: {
    updateNav: function () {
      //$parent 父链，通知父组件（tabs）进行更新。
      this.$parent.updateNav();
    },
  },
  //监听label
  watch: {
    label() {
      this.updateNav();
    },
  },

  mounted() {
    //初始化tabs
    this.updateNav();
  },
};
</script>
<style lang="scss" scoped>
</style>