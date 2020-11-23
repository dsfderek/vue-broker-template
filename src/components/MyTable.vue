<template>
  <el-table
    v-loading="$attrs.loading"
    v-bind="$attrs"
    v-on="$listeners"
    :ref="$attrs.ref?$attrs.ref:'myTableRef'"
  >
    <slot></slot>
    <template slot="empty" v-if="!$attrs.loading">
      <slot name="myEmpty">
        <img :style="{'margin-top':emptyTop+'px'}" src="@/assets/imgs/no-data-table.png">
        <p>暂无数据</p>
      </slot>
    </template>
  </el-table>
</template>

<script>
  export default {
    name: "my-table",
    props: {
      emptyTop: {
        type: Number,
        default: () => 120
      },
    },
    methods: {}
  }
</script>
