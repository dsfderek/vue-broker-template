<template>
  <div class="page-box template-box">
    <bread-crumb :breads="breadsData.breads" :title="breadsData.title" />
    <step :stepArr="['基础配置','网络配置','高级配置','完成']" :currentStep="2"></step>
  <div class="page-content">
    <ValidationObserver ref="observer" v-slot="{ passes }">
      <el-form label-position="left" ref="form" label-width="120px">
        <vee-input require="true" v-model="email" rules="required|email" errorMessage="啦啦啦" label="邮箱"/>
        <vee-password-input v-model="password" rules="required" label="密码1" vid="password"/>
        <vee-input v-model="confirmation" type="password" rules="required|confirmed:password" label="确认密码" />
        <vee-select require="true" rules="required" label="下拉框" v-model="subject">
          <el-option label="None" value></el-option>
          <el-option label="Subject 1" value="s1"></el-option>
          <el-option label="Subject 2" value="s2"></el-option>
        </vee-select>
        <vee-checkbox require="true" rules="required|length:2" name="Drinks" v-model="choices" label="饮料">
          <el-checkbox label="Coffee"></el-checkbox>
          <el-checkbox label="Tea"></el-checkbox>
          <el-checkbox label="Soda"></el-checkbox>
        </vee-checkbox>
        <vee-radio require="true" rules="required" name="性别" v-model="choices" label="性别">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
          <el-radio label="无性别"></el-radio>
        </vee-radio>
        <vee-date-picker require="true" v-model="date" rules="selected" name="创建时间"></vee-date-picker>
        <el-form-item  label="消费时间：" class="export-date">
            <ValidationProvider rules="required" name="起始日期" v-slot="{ errors }">
                <el-date-picker   clearable v-model="startDate" type="date" placeholder="起始日期" value-format="yyyy-MM-dd" ></el-date-picker>
                <span class="time-invalid-error1">{{ errors[0] }}</span>
            </ValidationProvider>
            <span class="notifyFilter">-</span>
            <ValidationProvider rules="required" name="结束日期" v-slot="{ errors }">
                <el-date-picker   clearable v-model="endDate" type="date" placeholder="结束日期" value-format="yyyy-MM-dd" ></el-date-picker>
                <span class="time-invalid-error2">{{ errors[0] }}</span>
            </ValidationProvider>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium">默认 </el-button>
          <el-button type="primary" size="small">默认 </el-button>
          <el-button type="primary" size="mini" @click="search()">默认</el-button>
          <el-button type="primary" disabled size="mini">禁用</el-button>
        </el-form-item>
        <el-form-item>
          <div class="demo-input-suffix" style="width:200px;">
            slot 方式：
            <el-input
              placeholder="请选择日期"
              v-model="input22">
              <i slot="suffix" class="el-input__icon  el-icon-search"></i>
            </el-input>
            <el-input
              placeholder="请输入内容"
              v-model="input23">
              <i slot="prefix" class="el-input__icon el-icon-date"></i>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="passes(onSubmit)">创建</el-button>
          <el-button type="primary" size="medium" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </ValidationObserver>
  </div>
  </div>
</template>

<script>
import { ValidationObserver } from "vee-validate";
import Step from "@components/Step";
import VeePasswordInput from "@components/VeePasswordInput";
import { mainApi } from '@main/services';

export default {
  name: "EForm",
  components: {
    ValidationObserver,
    Step,
    VeePasswordInput
  },
  data: () => ({
    breadsData: {
      breads: [],
      title: 'vee-demo'
    },
    email: "",
    password: "",
    confirmation: "",
    subject: "",
    choices: [],
    date:'',
    endDate:'',
    startDate:'',
    searchInput:'',
    input22:'',
    input23:'',
  }),
  methods: {
    search() {
      mainApi.customerQueryList().then(res => {});
      console.log("xx")
    },
    onSubmit() {
      console.log("Form submitted yay!");
    },
    resetForm() {
      this.email = "";
      this.password = "";
      this.confirmation = "";
      this.subject = "";
      this.choices = [];
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    }
  }
};
</script>
<style lang="scss">
</style>

