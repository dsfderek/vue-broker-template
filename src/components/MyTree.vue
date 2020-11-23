<template>
  <div class="organization-tree-comp" :style="oStyle">
    <el-input v-if="showSearch" class="search" placeholder="请输入组织名称" v-model="searchKey"></el-input>
    <el-tree
      v-if="treeData.length"
      :node-key="treeDescription.uniqueId"
      :props="treeDescription"
      :data="treeData"
      :indent="indent"
      :load="loadTreeData"
      :lazy="isLazy"
      :show-checkbox="showCheckbox"
      :expand-on-click-node="clickExpand"
      :default-expanded-keys="defaultExpandedKeys"
      :current-node-key="currentNodeKey"
      highlight-current
      check-on-click-node
      :filter-node-method="filterNodeByKey"
      @node-click="nodeClick"
      @current-change="currentChange"
      ref="myCustomTree"
      class="org-tree-content"
    >
      <span class="custom-tree-node" :style="customTreeStyle(node)" slot-scope="{ node, data }">
        <span v-if="searchKey" v-html="formatSearchValue(node.label)"></span>
        <span v-else class="node-name" :style="nodeNameStyle(node)">{{node.label }}</span>
        <slot name="canAdd"></slot>
        <el-button
          v-if="canAdd && showAddBtn && data.parentCount < maxLevel"
          class="add"
          type="text"
          size="mini"
          @click.stop="addOrg(data, node)"
        >
          <i class="iconfont icon-add"></i>
        </el-button>
      </span>
    </el-tree>
  </div>
</template>

<script>
/**
 * 层与层之间的缩进
 */
const LEVELINDENT = 12;
const CURRENT_SELECT_NODE = "MYTREE_CURRENT_SELECTED_NODE";
const TREE_LOAD_COMPLETE = "tree-load-complete";
export default {
  name: "MyCustomTree",
  props: {
    treeDescription: {
      type: Object,
      required: true
    },
    filterKey: {
      type: String
    },
    /**
     * 是否懒加载子节点
     */
    isLazy: {
      type: Boolean,
      default: () => false
    },
    treeData: {
      type: Array
    },
    /**
     * 是否显示checkbox
     */
    showCheckbox: {
      type: Boolean,
      default: () => false
    },
    clickExpand: {
      type: Boolean,
      default: () => true
    },
    /**
     * 是否显示搜索框
     */
    showSearch: {
      type: Boolean,
      default: () => false
    },
    /**
     * 是否显示添加按钮
     */
    showAddBtn: {
      type: Boolean,
      default: () => false
    },
    /**
     * 加载子节点下面的数据
     */
    loadChildData: {
      type: Function
    },
    /**
     * 该值大于0会覆盖最大层级设置
     */
    residueLevelCount: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      /**
       * 最大层级
       */
      maxLevel: 5,
      //搜索关键字
      searchKey: "",
      indent: LEVELINDENT,
      oStyle: {},
      data: [],
      treeStyle: {},
      parentData: [],
      currentNodeKey: "",
      // 默认展开的节点
      defaultExpandedKeys: [],
      // 是否缓存被选中节点
      isCacheSelectNode: false,
      // 这个涉及到权限
      canAdd: true
    };
  },
  created() {
    if (this.residueLevelCount) {
      this.maxLevel = this.residueLevelCount;
    }
    // console.log("当前树最大层级", this.maxLevel);
    this.data = this.treeData || [];
  },
  watch: {
    treeData(newVal, oldVal) {
      if (newVal.length && !oldVal.length) {
        this.initDefaultExpandedKeys();
        this.$nextTick(() => {
          let len = document.querySelectorAll("#tree_AddBtn").length;
          this.canAdd = len > 0;
        });
      }
    },
    searchKey(val) {
      this.canFilter = true;
      this.$refs.myCustomTree.filter(val);
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   let ppHeight = this.$parent.$el.offsetHeight;
    //   let pHeight = this.$el.parentNode.offsetHeight;
    //   let oTreeHeight = pHeight - (ppHeight - pHeight) / 2;
    //   this.oStyle = {
    //     height: `${pHeight}px`
    //   };
    //   const top = this.showSearch ? 10 : 0;
    //   this.treeStyle = {
    //     marginTop: `${top}px`,
    //     height: `calc(100% - ${28 + top}px)`
    //   };
    // });
  },
  methods: {
    initDefaultExpandedKeys() {
      let rootNodeData = this.treeData[0];
      let defaultExpandKey = rootNodeData[this.treeDescription.uniqueId];
      let preSelectedNodeCode = this.restorePreSelectNode();
      if (preSelectedNodeCode) {
        defaultExpandKey = preSelectedNodeCode;
      }
      this.currentNodeKey = defaultExpandKey;
      this.defaultExpandedKeys = [defaultExpandKey];
      if (preSelectedNodeCode) {
        this.$nextTick(() => {
          let node = this.$refs.myCustomTree.getNode(preSelectedNodeCode);
          this.$emit(TREE_LOAD_COMPLETE, node.data);
        });
      } else {
        this.$emit(TREE_LOAD_COMPLETE, rootNodeData);
      }
    },
    formatSearchValue(curNodeLabel) {
      let replaceReg = new RegExp(this.searchKey, "g");
      let replaceString =
        '<strong style="color:#000000;">' + this.searchKey + "</strong>";
      // 开始替换
      curNodeLabel = curNodeLabel.replace(replaceReg, replaceString);
      return `${curNodeLabel}`;
    },
    customTreeStyle(node) {
      return {
        // width: `calc(100% - ${18 * (node.level - 1) + 10}px)`
        //24是图标大小
        width: `${286 - this.indent * (node.level - 1) - 24}px`
      };
    },
    nodeNameStyle(node) {
      return {
        width: `calc(100% - 34px)`
      };
    },
    /**
     * 设置选中节点
     */
    setCurrentNode(data) {
      this.$refs.myCustomTree.setCurrentNode(data);
    },
    /**
     * 点击展开节点
     */
    nodeExpand(data, node) {
      if (node.level > this.maxLevel) {
        return;
      }
      this.setCurrentNode(data);
    },
    /**
     * 点击收起节点
     */
    nodeCollapse(data, node) {
      this.setCurrentNode(data);
    },
    /**
     * 点击节点加载数据
     */
    async loadTreeData(node, resolve) {
      // 懒加载需要根节点
      if (this.isLazy) {
        if (!this.treeData.length) {
          return resolve([]);
        }
      }
      console.log("loadTreeData", node);
      // 首次加载也会进入，展示树的第一层
      if (node.level === 0) {
        this.parentData = this.treeData;
        //获取树的第一级结构
        return resolve(this.treeData);
      }
      if (node.level > this.maxLevel) return resolve([]);
      const {
        data: { code }
      } = node;
      //如果是懒加载点击节点会进入此方法
      if (!this.loadChildData) {
        throw new Error("懒加载子节点数据必须提供loadChildData方法实现");
      }
      let isExecCallback = false;
      await this.loadChildData(code, childData => {
        isExecCallback = true;
        resolve(childData || []);
      });
      if (!isExecCallback) {
        throw new Error("调用loadChildData方法后需要执行回调");
      }
    },
    /**
     * 根据组织名称过滤
     */
    filterNodeByKey(value, data, node) {
      if (!value) return true;
      if (!this.filterKey) {
        throw new Error("请设置搜索关键字对应的key");
      }
      return data[this.filterKey].indexOf(value) !== -1;
    },
    /**
     * 添加节点事件
     */
    addOrg(data, node) {
      if (node.parentCount > this.maxLevel) {
        return;
      }
      this.$emit("add-child", data);
    },
    /**
     * 添加节点
     */
    insertChildNode(parentData, childData) {
      if (!parentData.children) {
        this.$set(parentData, "children", []);
      }
      if (!parentData.children) {
        this.$refs.myCustomTree.append(childData, parentData);
      } else {
        let orderNum = childData.orderNum;
        let sameLevalChildren = parentData.children.filter(
          item => item.orderNum === orderNum
        );
        if (sameLevalChildren.length) {
          //找到同级节点最后一个节点插入后面
          //找到同级节点最后一个
          let lastOne = sameLevalChildren.slice(-1)[0];
          this.$refs.myCustomTree.insertAfter(childData, lastOne);
        } else {
          // 到这里说明没有同级节点
          let item = parentData.children.find(item => item.orderNum > orderNum);
          if (item) {
            this.$refs.myCustomTree.insertBefore(childData, item);
          } else {
            this.$refs.myCustomTree.append(childData, parentData);
          }
        }
      }

      let node = this.$refs.myCustomTree.getNode(parentData);
      node.loaded = false;
      node.expand();
    },
    /**
     * 更新节点数据
     */
    updateChildNode(parentData, childData) {
      //TODO: 更新节点数据
      console.log(parentData, childData);
      //删除旧的树旧节点
      this.removeChildNode(parentData, childData);
      //对新节点再做排序插入
      this.insertChildNode(parentData, childData);
    },
    /**
     * 删除节点
     */
    removeChildNode(parentData, childData) {
      this.$refs.myCustomTree.remove(childData);
    },
    /**
     * 获取选择的部门列表
     */
    getCheckedNodes() {
      return this.$refs.myCustomTree.getCheckedNodes();
    },
    /**
     * 节点被点击
     */
    nodeClick(data, node) {
      this.currentNodeKey = data.code;
      this.$emit("nodeClick", data, node);
    },
    // 切换选中的节点
    currentChange(data, node) {
      this.$emit("currentChange", data, node);
    },
    //存储当前选中节点
    storeCurrentNode() {
      window.sessionStorage.setItem(CURRENT_SELECT_NODE, this.currentNodeKey);
    },
    //还原当前选中节点
    restorePreSelectNode() {
      let code = window.sessionStorage.getItem(CURRENT_SELECT_NODE);
      window.sessionStorage.removeItem(CURRENT_SELECT_NODE);
      return code;
    },
    // 修改缓存标志
    modifyCacheFlag() {
      this.isCacheSelectNode = !this.isCacheSelectNode;
    }
  },
  beforeDestroy() {
    if (this.isCacheSelectNode) {
      this.storeCurrentNode();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
/*文本格式化，超出范围，显示省略号*/
@mixin text-overflow($width: 100%) {
  width: $width;
}
.organization-tree-comp {
  width: 286px;
  padding-top: 20px;
  .search {
    padding: 0 20px;
    margin-bottom: 5px;
  }
  .org-tree-content {
    width: 286px;
  }
  >>> .el-tree-node {
    width: 286px;
  }
  >>> .el-tree-node__expand-icon {
    margin-left: 12px;
  }
  //这个展开图标不能修改
  >>> .el-tree-node__expand-icon {
    color: $menu-icon-arrow;
  }
  >>> .el-tree-node__expand-icon.is-leaf {
    color: transparent;
    cursor: default;
  }
  >>> .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: $active-bg-color;
    border-left: 2px solid $border-left-selected;
  }
  // >>> .el-tree-node__content > .el-tree-node__expand-icon {
  //   padding: 0px;
  //   margin-right: 6px;
  // }
  >>> .el-tree-node__content {
    height: 30px;
    line-height: 30px;
    width: 100%;
  }
  .custom-tree-node {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .node-name {
      display: block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .add {
      flex: 1 0 auto;
      display: none;
      height: 30px;
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
    }
    &:hover {
      .node-name {
        @include text-overflow(calc(100% - 30px));
      }
      .add {
        display: block;
      }
    }
  }
}
</style>
