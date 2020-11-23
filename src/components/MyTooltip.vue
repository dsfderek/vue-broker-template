<template>
  <el-tooltip
    @mouseover.native="mouseOverEvent($event)"
    v-bind="$attrs"
    :popper-class="
      $attrs['popper-class'] ? $attrs['popper-class'] : 'my-tooltip-box'
    "
    :disabled="tooltipDisable"
  >
    <slot></slot>
  </el-tooltip>
</template>

<script>
export default {
  name: "my-tooltip",
  data() {
    return {
      tooltipDisable: true,
    };
  },
  mounted() {
    this.initTooltipDisable();
  },
  methods: {
    mouseOverEvent(event) {
      let ev = event || window.event;
      let target = ev.target;
      if (target.scrollWidth > target.offsetWidth) {
        this.tooltipDisable = false;
      } else {
        this.tooltipDisable = true;
      }
    },
    initTooltipDisable() {
      this.tooltipContent = this.disabled || true;
    },
  },
};
</script>

<style lang="scss">
.my-tooltip-box {
  max-width: 500px;
}
</style>