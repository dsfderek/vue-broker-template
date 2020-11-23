# 自定义级联菜单

### 参数说明

- selectedData

  编辑的时候用，方便回显数据，这是个一位数组

  ```js
  [
    //多条记录,如果是多条记录checkStatus这个字段不能少
    { name: "xxx", code: "xxx", checkStatus: "1", parentDeptCode: "xxx" }
  ];
  ```

- rules

  校验规则

- cascaderProps

  级联菜单 props 配置参数默认如下： { multiple: true, expandTrigger: "hover", checkStrictly: true }

  可以传入 cascaderProps 会自动合并配置

  ```js
  // currentNode 这个字段是用来标记级联菜单里面的节点数据，通过该字段可以获取选中的数据集格式
  deptCascaderProps: {
    value: "currentNode",
    label: "name",
    children: "children"
  },
  ```

- data

  级联菜单数据源

- isFormItem

  标记当前的级联菜单是在表单里面还是单独隔离的比如在过滤条件里等

### 使用方式

1. 引入 MyCascader

```js
import MyCascader from "@/components/MyCascader";
```

2. 在表单里面使用，v-model 对应的数据格式要求，如果是多选要节点要有 checkStatus，而且是完整的数组.
   selectedData:选中的数据集合，编辑时候用。必须是完整的链条集合

```html
<my-cascader
  require="true"
  rules="required"
  label="部门"
  placeholder="请选择组织部门"
  :selectedData="userInfo.departments"
  :cascaderProps="deptCascaderProps"
  :data="treeData"
  @changed="departmentChanged"
></my-cascader>
```

3. 选中后返回的数据格式,多选数据的时候返回的是个数组，里面包含了层级关系，在每个节点数据上面多了 checkStatus,parentDeptCode,单选的是返回单独的节点数据

```js
[
  {
    ...nodeItem, // 当前节点数据
    checkStatus: "0", //是否选中
    parentDeptCode: "xxx" // 父节点
  }
];
```
