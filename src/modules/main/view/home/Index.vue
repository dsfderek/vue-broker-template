<template>
  <div class="page-box template-box">
    <bread-crumb :breads="breadsData.breads" :title="breadsData.title"></bread-crumb>
      <div class="page-content">
        <div class="welcome">
          <div > <img src='@/assets/imgs/welcome.png'></div>
          <div class="user"> 欢迎回来,{{userName}}</div>
        </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
  export default {
    computed: {
    ...mapGetters(['userName']),
  },
    name: "index",
    data(){
      return {
        breadsData: {
          breads: [],
          title: "首页"
        },
      }
    },
    
    mounted(){
    },
    methods:{
      
    }
  }
</script>

<style scoped lang="scss">
.welcome{
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .user{
      color: #212A40;
      font-size: 14px;
      line-height: 60px;
    }
}
</style>