<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="cancelEvent"
    width="505px"
  >
    <ValidationObserver ref="observer" v-slot="{ passes }">
      <el-form label-position="left" label-width="87px">
        <vee-input
          clearable
          require="true"
          rules="required|max:50"
          label="收件人"
          v-model="addressForm.addressee"
          placeholder="输入收件人名称"
          innerWidth="230px"
        ></vee-input>
        <vee-input
          clearable
          require="true"
          rules="required|max:20|telephone"
          label="联系电话"
          v-model="addressForm.receivingPhone"
          placeholder="输入联系电话"
          innerWidth="230px"
        ></vee-input>
        <el-form-item label="收件地址" style="margin-bottom: 0px;" required>
          <el-col :span="7">
            <vee-select
              clearable
              rules="selected"
              v-model="addressForm.provinceCode"
              label=""
              errorMessage="省"
              placeholder="省"
              label-width="0px"
              @change="addressChangeEvent('province')"
            >
              <el-option
                v-for="item of addressDict.provinceList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </vee-select>
          </el-col>
          <el-col :span="7" :offset="1">
            <vee-select
              clearable
              rules="selected"
              v-model="addressForm.cityCode"
              label=""
              errorMessage="市"
              placeholder="市"
              @change="addressChangeEvent('city')"
              label-width="0px"
            >
              <el-option
                v-for="item of addressDict.cityList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </vee-select>
          </el-col>
          <el-col :span="8" :offset="1">
            <vee-select
              clearable
              rules="selected"
              v-model="addressForm.areaCode"
              label=""
              errorMessage="区"
              placeholder="区"
              label-width="0px"
              @change.native="addressChangeEvent('area')"
            >
              <el-option
                v-for="item of addressDict.areaList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </vee-select>
          </el-col>
        </el-form-item>
        <vee-input
          label=""
          clearable
          rules="required|max:150"
          errorMessage="详细地址"
          v-model="addressForm.receivingAddress"
          placeholder="输入详细地址"
        ></vee-input>
        <vee-input
          label="邮编"
          clearable
          rules="zipCode|max:10"
          v-model="addressForm.receivingZipCode"
          placeholder="输入邮政编码"
          innerWidth="232px"
        ></vee-input>
        <el-form-item label-width="0" style="margin-bottom: 0;">
          <div style="text-align: center">
            <el-button @click="cancelEvent">取消</el-button>
            <el-button @click="passes(saveEvent)" type="primary">{{type === 'operation'?'保存':'保存并使用'}}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </ValidationObserver>
  </el-dialog>
</template>

<script>
  import {ValidationObserver} from "vee-validate";
  import {pageLoading, dictData} from '@common/mixins'
  import {clientUrl} from "@common/url-conf";
  import {accountApi} from "@user-center/account/services";

  export default {
    name: "operation-address",
    mixins: [pageLoading, dictData],
    props: {
      type: {
        type: String,
        default: 'use', // use其他模块使用|operation收件地址管理使用
      },
      title: {
        type: String,
        default: '新建'
      },
      rowData: {
        type: Object,
        default: () => null
      }
    },
    components: {
      ValidationObserver
    },
    data() {
      return {
        dialogVisible: true,
        addressDict: {
          provinceList: [],
          provinceMap: {},
          cityList: [],
          cityMap: {},
          areaList: [],
          areaMap: {},
        },
        addressForm: {
          id: '',
          addressee: '',
          receivingPhone: '',
          receivingAddress: '',
          receivingZipCode: '',
          isDefault: '',
          province: '',
          provinceCode: '',
          city: '',
          cityCode: '',
          area: '',
          areaCode: ''
        }
      }
    },
    mounted() {
      if (this.rowData) {
        this.addressForm = this.rowData;
        this.addressDict.provinceList = [
          {
            label: this.addressForm.province,
            value: this.addressForm.provinceCode,
          }
        ];
        this.addressDict.cityList = [
          {
            label: this.addressForm.city,
            value: this.addressForm.cityCode,
          }
        ];
        this.addressDict.areaList = [
          {
            label: this.addressForm.area,
            value: this.addressForm.areaCode,
          }
        ]
      }
      this.initAddressCascade();
    },
    methods: {
      initAddressCascade() {
        this.getAddressList('province', '00');
        if (this.addressForm.provinceCode) {
          this.getAddressList('city', this.addressForm.provinceCode);
        }
        if (this.addressForm.cityCode) {
          this.getAddressList('area', this.addressForm.cityCode);
        }
      },
      // 地址级联改变事件 province|city|area
      addressChangeEvent(type) {
        if (type === 'province') {
          // 省份切换
          this.addressForm.cityCode = '';
          this.addressForm.areaCode = '';
          this.addressDict[`cityList`] = [];
          this.addressDict[`areaList`] = [];
          if (this.addressForm.provinceCode) {
            this.getAddressList('city', this.addressForm.provinceCode);
          }
        } else if (type === 'city') {
          // 市切换
          this.addressForm.areaCode = '';
          this.addressDict[`areaList`] = [];
          if (this.addressForm.cityCode) {
            this.getAddressList('area', this.addressForm.cityCode);
          }
        }
      },
      getAddressList(type = 'province', code = '00') {
        // 获取模板审核状态数据字典
        this.queryDictListByCode(clientUrl, code).then(res => {
          this.addressDict[`${type}List`] = res.list;
          this.addressDict[`${type}Map`] = res.map;
        });
      },
      cancelEvent() {
        this.$emit('close-dialog', 'cancel');
      },
      saveEvent() {
        this.showFullLoading();
        let postFrom = {
          id: this.addressForm.id,
          addressee: this.addressForm.addressee,
          receivingPhone: this.addressForm.receivingPhone,
          receivingAddress: this.addressForm.receivingAddress,
          receivingZipCode: this.addressForm.receivingZipCode,
          provinceCode: this.addressForm.provinceCode,
          cityCode: this.addressForm.cityCode,
          areaCode: this.addressForm.areaCode,
          province: this.addressDict.provinceMap[this.addressForm.provinceCode],
          city: this.addressDict.cityMap[this.addressForm.cityCode],
          area: this.addressDict.areaMap[this.addressForm.areaCode],
          version: this.addressForm.version || 0,
        };
        if (this.addressForm.id) {
          accountApi.clientUpdateAddress(postFrom, {
            notRepeatService: clientUrl
          }).then(res => {
            this.closeFullLoading();
            if (res && res.result) {
              this.$message.success('修改成功');
              this.$emit('close-dialog', 'save', res.obj);
            }
          }).catch((err) => {
            this.closeFullLoading();
          })
        } else {
          accountApi.clientAddAddress(postFrom, {
            notRepeatService: clientUrl
          }).then(res => {
            this.closeFullLoading();
            if (res && res.result) {
              this.$message.success('新建成功');
              this.$emit('close-dialog', 'save', res.obj);
            }
          }).catch((err) => {
            this.closeFullLoading();
          })
        }
      },
    }
  }
</script>

<style scoped>

</style>