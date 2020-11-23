<template>
  <div class="bread-crumb-outer">
    <div class="bread-left">
      <div class="bread-title">{{title}} <slot name="icon"></slot></div>
      <div class="bread-crumb-inner">
        <template v-for="(bread, index) of breads">
                    <span
                      :key="index"
                      @click="goRoute(bread)"
                      :class="{
                            'high-light': (index !== 0 && index === breads.length - 1),
                            'click-able': bread.path
                        }"
                    >{{bread.title}}</span>
          <span class="bread-space" v-if="index !== breads.length - 1">/</span>
        </template>
      </div>
    </div>
    <div class="bread-right">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "bread-crumb",
    props: {
      breads: {
        type: Array,
        default: () => {
          return [];
          /*return [
            {
              title: "消息管理",
            }, {
              title: "模板管理",
              path: '/message/template',
              query: {}
            }, {
              title: "新建模板",
            }
          ]*/
        }
      },
      title: {
        type: String,
        default: () => ""
      }
    },
    methods: {
      goRoute(bread) {
        if (bread.path) {
          this.$router.push({
            path: bread.path,
            query: bread.query
          });
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bread-crumb-outer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 58px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 3px 0px rgba(33, 76, 217, 0.2);
    padding: 0 20px;
    .bread-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      .bread-title {
        font-size: 16px;
        font-weight: bold;
        color: #1E2B4D;
      }
      .bread-crumb-inner {
        margin-left: 24px;
        color: #6D7383;
        .high-light {
          color: #212A40;
        }
        .click-able {
          cursor: pointer;
        }
        .bread-space {
          margin: 0 8px;
        }
      }
    }
    .bread-right {

    }
  }
</style>
