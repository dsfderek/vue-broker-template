<template>
  <div>
    <div class="page-table">
      <my-table
        :loading="table.loading"
        class="blank-table"
        :data="table.data"
        @sort-change="sortChange"
        :highlight-current-row="type === 'view'"
        @current-change="handleCurrentChange"
        style="width: 100%"
      >
        <template v-for="(header, index) of table.header">
          <el-table-column
            :prop="header.field"
            :key="index"
            :label="header.label"
            :width="header.width || ''"
            :align="header.align || 'left'"
            :sortable="header.sortable"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="header.field === 'action'">
                <table-button
                  content="修改"
                  icon-class="icon-table-edit"
                  @click="editRowEvent(scope.row)">
                </table-button>
                <table-button
                  content="删除"
                  icon-class="icon-table-del"
                  @click="deleteRowEvent(scope.row)">
                </table-button>
              </template>
              <!-- 如果有列需要特殊处理，此处增加v-else-if即可 -->
              <template v-else-if="header.field === 'isDefault'">
                <template v-if="type === 'operation'">
                  <switch-component
                    valueKey="isDefault"
                    :rowData="scope.row"
                    :activeValue="0"
                    activeText="默认地址"
                    inactiveText="设为默认"
                    :inactiveValue="1"
                    @switch="switchAddressDefaultEvent"
                  ></switch-component>
                </template>
                <template v-else>
                  <span>{{scope.row.isDefault === '0' ? (type === 'operation'?'默认地址':'是' ): '否'}}</span>
                </template>
              </template>
              <template v-else-if="header.field === 'receivingAddress'">
                <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}{{scope.row.receivingAddress}}</span>
              </template>
              <template v-else>
                <span class="white-space-pre">{{scope.row[header.field] || ''}}</span>
              </template>
            </template>
          </el-table-column>
        </template>
      </my-table>
    </div>
    <div class="page-paging" v-if="pageParams.total && pageParams.total > 0">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="pageParams.pageNum"
        :page-sizes="pageParams.pageSizes"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {blankPage, pageLoading} from "@common/mixins";
  import TableButton from "@components/TableButton";
  import MyTable from "@components/MyTable";
  import {accountApi} from "@user-center/account/services"
  import SwitchComponent from "@components/SwitchComponent";

  export default {
    components: {
      SwitchComponent,
      MyTable,
      TableButton
    },
    name: "customer-address-list",
    mixins: [blankPage, pageLoading],
    props: {
      type: {
        type: String,
        default: 'view', //view查看模式，其他模块引用|operation编辑模式，仅收件地址管理引用
      }
    },
    data() {
      return {
        filterParams: {},
        otherParams: {},
        // 表格
        table: {
          // 表头
          header: [
            {
              field: 'addressee',	// 列key
              label: '收件人'			// 列头显示文本
            },
            {
              field: 'receivingPhone',
              label: '联系电话'
            },
            {
              field: 'receivingAddress',
              label: '收件地址',
            },
            {
              field: 'receivingZipCode',
              label: '邮编',
            },
            {
              field: 'isDefault',
              label: '是否默认地址',
            },
          ],
          headerOp: [
            {
              field: 'addressee',	// 列key
              label: '收件人'			// 列头显示文本
            },
            {
              field: 'receivingPhone',
              label: '联系电话'
            },
            {
              field: 'receivingAddress',
              label: '收件地址',
            },
            {
              field: 'receivingZipCode',
              label: '邮编',
            },
            {
              field: 'isDefault',
              label: '是否默认地址',
            },
            {
              field: 'action',
              label: '操作',
              width: '100px'			// 操作列一般固定宽度
            }
          ],
          // 数据
          data: [],
          loading: true
        }
      }
    },
    mounted() {
      this.initTableHeader();
      this.getTableListData();
    },
    methods: {
      // 行改变时调用，type为view的时候监听
      handleCurrentChange(row) {
        this.$emit('selectedRowData', row);
      },
      initTableHeader() {
        if (this.type === 'operation') {
          this.table.header = this.table.headerOp;
        }
      },
      // 设置为默认地址
      switchAddressDefaultEvent(row) {
        let status = row.isDefault;
        if (status == '0') {
          return false;
        }
        const MyMessageBox = this.$MyMessageBox({
          type: 'info',
          content: '确认设为默认地址？',
          btn: [{
            'text': '取消',
            fn: () => {
              MyMessageBox.visible = false;
            }
          }, {
            'type': 'primary',
            'text': '确认',
            fn: () => {
              MyMessageBox.visible = false;
              this.showFullLoading();
              accountApi.clientSetDefaultAddress({
                id: row.id,
                version: row.version || 0,
              }).then(res => {
                if (res && res.result) {
                  this.$message.success('默认地址设置成功');
                  this.getTableListData();
                }
              }).finally(() => {
                this.closeFullLoading();
              })
            }
          }]
        });
      },
      // 操作- 删除
      deleteRowEvent(row) {
        const MyMessageBox = this.$MyMessageBox({
          type: 'error',
          content: '确认删除当前收件地址吗？',
          btn: [{
            'text': '取消',
            fn: () => {
              MyMessageBox.visible = false;
            }
          }, {
            'type': 'primary',
            'text': '确认',
            fn: () => {
              MyMessageBox.visible = false;
              this.showFullLoading();
              accountApi.clientDeleteAddress(row.id, row.version || 0).then(res => {
                if (res && res.result) {
                  this.$message.success('删除成功');
                  if (this.table.data.length === 1) {
                    this.pageParams.pageNum = 1;
                  }
                  this.getTableListData();
                }
              }).finally(() => {
                this.closeFullLoading();
              });
            }
          }]
        });
      },
      // 操作- 修改
      editRowEvent(row) {
        this.$emit('editRow', row);
      },
      getTableListData() {
        this.table.loading = true;
        accountApi.clientGetAddressList(this.groupParams()).then(res => {
          this.table.loading = false;
          if (res && res.result) {
            this.table.data = res.obj.data;
            this.pageParams.total = res.obj.total;
          } else {
            this.table.data = [];
            this.pageParams.total = 0;
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>