<template>
  <div class="page-box template-box">
    <bread-crumb :breads="breadsData.breads" :title="breadsData.title">
      <template slot="action">
      </template>
    </bread-crumb>
    <div class="page-content">
      <div class="page-filter">
        <div class="filter-item-box">
        </div>
      </div>
      <div class="page-table">
        <div class='box'>
            <div class="photo">
              <img src="../../img/401.png" alt="">
            </div>
            <div class="title">
              您的权限不足，无法访问该功能
            </div>
            <div class="text">
              请联系您的管理员为您开通权限
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        breadsData: {
          breads: [],
          title: ''
        },
      }
    },
    mounted() {
     const loading = this.$loading();
      loading.close();
    },
    methods: {
     
    }
  }
</script>

<style lang="scss" scoped>
.box{
  margin-top:82px;
  .photo{
    display: flex;
    justify-content:center;
  }
  .title{
    text-align: center;
    font-size:14px;
    color:#212A40;
  }
  .text{
    color:#A3A9B7;
    font-size:12px;
    text-align: center;
    margin-top:12px;
    font-weight:400;
  }
}
</style>
