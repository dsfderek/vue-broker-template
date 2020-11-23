
<template>
  <div class="my-page-tabs">
    <div class="tabs-nav">
      <div v-for="(tab,index) in navList" :key="index" class="page-tab">
        <div v-if="index === 0" :class="tab.active ? 'tabs-item-l is-active' : 'tabs-item-l'"></div>
        <div v-if="index !== 0 && tab.active" class="tabs-item-m active"></div>
        <div
          v-if="index !== 0 && !tab.active"
          :class="navList[index-1].active ? 'tabs-item-m is-active' : 'tabs-item-m'"
        ></div>
        <div :class="tab.active ? 'tabs-item is-active' : 'tabs-item'" @click="handleChange(index)">
          <span>{{tab.label}} <slot name="tabs-item-slot" :tabItemSlot="index"></slot></span>
        </div>
        <div
          v-if="index === navList.length - 1"
          :class="tab.active ? 'tabs-item-r is-active' : 'tabs-item-r'"
        ></div>
      </div>
    </div>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>
 
<script>
export default {
  name: "my-tabs",
  model: {
    prop: "value",
    event: "set-value",
  },
  data() {
    return {
      //将pane的标题保存到数组中
      navList: [],
      //保存父组件的value到currentValue变量中，以便在本地维护
      currentValue: this.value,
    };
  },
  props: {
    //接收父组件的value
    value: {
      type: [String],
      // default: () => ''
    },
  },
  methods: {
    //使用$children遍历子组件，得到所有的pane子组件
    getTabs: function () {
      return this.$children.filter(function (item) {
        return item.$options.name === "my-tab-pane";
      });
    },
    //更新tabs
    updateNav() {
      this.navList = [];
      //设置对this的引用，在function回调里，this指向的并不是Vue实例
      var _this = this;
      //遍历每一个pane组件后，把它的label和name提取出来，构成一个Object并添加navList数组中
      this.getTabs().forEach(function (pane, index) {
        _this.navList.push({
          label: pane.label,
          name: pane.name || index,
          active: pane.show,
          index: index
        });
        //如果没有设置name，默认设置为索引值
        if (!pane.name) {
          pane.name = index;
        }
        //设置第一个pane为当前显示的tab
        if (index === 0) {
          if (!_this.currentValue) {
            _this.currentValue = pane.name || index;
          }
        }
      });

      this.updateStatus();
    },
    //更新每个子组件pane状态
    updateStatus() {
      //给tabs赋值为所有子组件
      var tabs = this.getTabs();
      var _this = this;
      this.navList.forEach((item, i) => {
        if (item.name == _this.currentValue) {
          item.active = true;
          // this.$emit("tab-click", item);
        } else {
          item.active = false;
        }
      });
      //显示当前选中的tab对应的pane组件，隐藏没有选中的
      tabs.forEach(function (tab) {
        //设置每个子组件中show
        return (tab.show = tab.name === _this.currentValue);
      });
    },
    //点击tab标题触发，改变选中tab的索引
    handleChange: function (index) {
      this.navList.forEach((item, i) => {
        if (index === i) {
          item.active = true;
        } else {
          item.active = false;
        }
      });

      var nav = this.navList[index];
      var name = nav.name;
      //改变当前选中的tab，触发watch
      this.currentValue = name;
      this.$emit("set-value", name);
      //实现子组件与父组件通信,更新value
      this.$emit("tab-click", nav);
      //触发一个自定义事件，供父级使用
      this.$emit("on-click", name);
    },
  },
  watch: {
    value: function (val) {
      this.currentValue = val;
    },
    currentValue: function () {
      //tab发生变化时，更新pane的显示状态
      this.updateStatus();
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.my-page-tabs {
  min-height: calc(100% - 130px);
  background-color: #fff;
  -webkit-box-shadow: 0px 2px 8px 0px rgba(33, 76, 217, 0.2);
  box-shadow: 0px 2px 8px 0px rgba(33, 76, 217, 0.2);
  border-radius: 0 4px 4px 4px;
  margin: 52px 20px 20px 20px;
  position: relative;
  .tabs-nav {
    position: absolute;
    top: -40px;
    left: -8px;
    width: 100%;
    .page-tab {
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      cursor: pointer;
      float: left;
      > div {
        float: left;
      }
      .tabs-item-l {
        width: 12px;
        height: 40px;
        background: url("../../assets/imgs/tabs/default-left.png") no-repeat;
      }
      .tabs-item-l.is-active {
        width: 12px;
        height: 40px;
        background: url("../../assets/imgs/tabs/active-left.png") no-repeat;
      }
      .tabs-item {
        background: url("../../assets/imgs/tabs/default-bg.png");
        padding: 0 20px;
        > span {
          vertical-align: sub;
        }
      }
      .tabs-item.is-active {
        background: url("../../assets/imgs/tabs/active-bg.png");
        font-weight: bold;
      }
      .tabs-item-r {
        width: 26px;
        height: 40px;
        background: url("../../assets/imgs/tabs/default-right.png") no-repeat;
      }
      .tabs-item-r.is-active {
        width: 26px;
        height: 40px;
        background: url("../../assets/imgs/tabs/active-right.png") no-repeat;
      }
      .tabs-item-m {
        width: 32px;
        height: 40px;
        background: url("../../assets/imgs/tabs/default-middle.png") no-repeat;
      }
      .tabs-item-m.is-active {
        width: 32px;
        height: 40px;
        background: url("../../assets/imgs/tabs/active-middle.png") no-repeat;
      }
      .tabs-item-m.active {
        width: 32px;
        height: 40px;
        background: url("../../assets/imgs/tabs/active-default-middle.png") no-repeat;
      }
    }
  }
  .tab-content {
    height: calc(100vh - 180px);
    overflow-y: auto;
    padding: 20px;
  }
}
</style>