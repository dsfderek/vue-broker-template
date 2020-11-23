<template>
  <div v-if="isFormItem">
    <ValidationProvider
      class="my-cascader"
      :vid="vid"
      :name="$attrs.label"
      :rules="rules"
      v-slot="{ errors }"
    >
      <el-form-item
        :error="errors[0]"
        :label="$attrs.label + ''"
        :rules="[{ required: $attrs.require }]"
      >
        <el-cascader
          ref="cascader"
          v-model="modelValue"
          v-bind="$attrs"
          :options="cascaderOptions"
          :props="props"
          collapse-tags
          clearable
          @change="nodeChanged"
          @visible-change="visibleChanged"
        ></el-cascader>
      </el-form-item>
    </ValidationProvider>
  </div>
  <div v-else>
    <el-cascader
      ref="cascader"
      v-model="modelValue"
      v-bind="$attrs"
      :options="cascaderOptions"
      :props="props"
      collapse-tags
      clearable
      @change="nodeChanged"
      @visible-change="visibleChanged"
    ></el-cascader>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";

const RECURSIONFIELD = "children";
export default {
  name: "VeeCascader",
  components: {
    ValidationProvider
  },
  props: {
    vid: {
      type: String
    },
    rules: {
      type: [Object, String],
      default: ""
    },
    /**
     * 标记是否是作为表单组件使用
     */
    isFormItem: {
      type: Boolean,
      default: () => true
    },
    // /**
    //  * 提示
    //  */
    // placeholder: {
    //   type: String,
    //   default: () => "请选择"
    // },
    /**
     * 回显的数据
     */
    selectedData: {
      type: Array,
      default: () => []
    },
    /**
     * 级联菜单配置参数
     */
    cascaderProps: {
      type: Object
    },
    /**
     * 级联菜单原始数据
     */
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      hasChanged: false,
      cascaderOptions: [],
      modelValue: [],
      props: {
        multiple: true,
        expandTrigger: "hover",
        checkStrictly: true,
        value: "currentNode"
      }
    };
  },
  created() {
    //value 值牵扯到显示等相关问题，不能覆盖修改
    this.props = Object.assign({}, this.props, this.cascaderProps, {
      value: "currentNode"
    });
    let temp = [...this.selectedData];
    this.formatModelValue(temp);
  },
  watch: {
    data(newVal) {
      this.formatSourceData(newVal);
    },
    selectedData(newVal) {
      let temp = [...newVal];
      this.formatModelValue(temp);
    }
  },
  methods: {
    formatModelValue(selectItems) {
      if (!selectItems.length) {
        return;
      }
      //转换数据
      let cascaderModelData = this.formatDataToCascader(selectItems);
      if (this.props.multiple) {
        this.modelValue = cascaderModelData.map(item => {
          return item.map(t => {
            return JSON.stringify(t);
          });
        });
      } else {
        this.modelValue = cascaderModelData.map(item => {
          return JSON.stringify(item);
        });
      }
      // console.log("选中的值", this.modelValue);
    },
    formatDataToCascader(dbData) {
      let items = [];
      let cascaderData = [];
      if (this.props.multiple) {
        items = dbData.filter(item => item.checkStatus === "1");
        items.forEach(item => {
          let linkList = [item];
          this.splitData(dbData, item, linkList);
          cascaderData.push(linkList);
        });
        cascaderData = cascaderData.map(depts => {
          depts = depts.map(item => {
            // 这个顺序不能改，否则就乱了
            let { code, parentDeptCode, name } = item;
            return {
              code,
              pcode: parentDeptCode,
              name
            };
          });
          return depts;
        });
      } else {
        cascaderData = dbData;
        cascaderData = cascaderData.map(item => {
          let { code, parentDeptCode, name } = item;
          return {
            code,
            pcode: parentDeptCode,
            name
          };
        });
      }
      return cascaderData;
    },
    splitData(dbData, item, linkList) {
      if (item.parentDeptCode !== "0") {
        let parentNode = dbData.find(t => t.code === item.parentDeptCode);
        if (parentNode) {
          linkList.unshift(parentNode);
          this.splitData(dbData, parentNode, linkList);
        }
      }
    },
    /**
     * 格式化数据源
     */
    formatSourceData(data) {
      this.formatData(data);
      this.cascaderOptions = data;
    },
    //格式化数据添加currentNode节点
    formatData(data) {
      if (!data || !data.length) {
        return;
      }
      data.forEach(item => {
        const temp = { code: item.code, pcode: item.pcode, name: item.name };
        item.currentNode = JSON.stringify(temp);
        if (item.children) {
          this.formatData(item.children);
        }
      });
    },
    nodeChanged(data) {
      this.hasChanged = true;
      if (!data.length) {
        this.$emit("clear");
        this.$emit("changed", []);
        return;
      }
      this.visibleChanged(false);
    },
    visibleChanged(flag) {
      //隐藏级联菜单 flag是false  ,如果打开并没有修改数据不需要下面的步骤
      if (flag || !this.hasChanged) {
        return;
      }
      this.hasChanged = false;
      let formatToDbData = this.formatSelectData();
      this.$emit("changed", formatToDbData);
    },
    /**
     * 格式化选中的数据
     */
    formatSelectData() {
      let lastItemToArr = [],
        noRepeatData = [];
      if (this.props.multiple) {
        let arr = this.modelValue.reduce((pre, cur) => {
          lastItemToArr.push(cur[cur.length - 1]);
          pre = [...pre, ...cur];
          return pre;
        }, []);
        noRepeatData = [...new Set(arr)];
      } else {
        lastItemToArr = this.modelValue.slice(-1);
        noRepeatData = this.modelValue;
      }
      noRepeatData = noRepeatData.map(item => {
        let temp = JSON.parse(item);
        Object.assign(temp, { checkStatus: "0", parentDeptCode: temp.pcode });
        if (lastItemToArr.find(t => t === item)) {
          temp.checkStatus = "1";
        }
        return temp;
      });
      return noRepeatData;
    }
  }
};
</script>
<style lang="scss" scoped>
.my-cascader {
  >>> .el-cascader--mini {
    width: 100%;
  }
}
</style>