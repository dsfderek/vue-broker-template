<template>
  <div class="page-box template-box">
  
      <bread-crumb :breads="breadsData.breads" :title="breadsData.title">

      </bread-crumb>
      <div class="page-content">
        <div class="welcome">
          <div > <img src='@/assets/imgs/welcome.png'></div>
          <div class="user"> 密码修改成功,<el-button type="text" @click="login" class="login">请登录</el-button></div>
        </div>
    </div>
  </div>
</template>

<script>

import { utils } from "@/utils/utils";
export default {

  name: "index",

  
  data() {
    
    
    return {
      breadsData: {
        breads: [],
        title: "修改密码"
      },
     
      
    };
  },
 
  mounted() {
    
  },

  methods: {
   login() {
     utils.setLogout();
   }
  }
};
</script>

<style  lang="scss">
.welcome{
    display: flex;
    height: 100%;
    flex-direction: column;
    padding-top:50px;
    align-items: center;
    .user{
      color: #212A40;
      font-size: 14px;
      line-height: 60px;
      .login{
        text-decoration: underline;
      }
    }
}

</style>