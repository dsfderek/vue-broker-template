<template>
    <div class="main-layout">
    <top-bar></top-bar>
    <div class="body-content">
        <div class="content-wrap">
            <div class="verify-type vertify-header"><span>为了保障您的正常使用,建议进行实名验证</span></div>
            <div class="verify-type">
                <div class="verify-item"  @click="personAuth('changePersonalInfo')">
                    <div class="person-img img-box"></div>
                    <h3>个人认证</h3>
                    <p>需要填写您的个人身份证信息及上传身份证正反面照片，即可完成认证</p>
                </div>
                <div class="verify-item" @click="businessAuth">
                    <div class="business-img img-box"></div>
                    <h3>企业认证</h3>
                    <p>需要填写贵公司相关注册信息及法人代表身份证信息，即可完成认证</p>
                </div>
            </div>
            <div class="verify-type"><el-button type="text" class="noVertify">暂时先不认证</el-button></div>
            </div>
      
    </div>
  </div>
</template>

<script>
import TopBar from "@/modules/main/view/layout/TopBar";
export default {
    components: { TopBar },
    data(){
        return {
            
        }
    },
    created() {

    },
    mounted(){
        
    },
    methods:{
        //判断当前是否是未认证状态
        judgeIsUnCertify() {

        },
        businessAuth() {//企业跳转
            this.$router.push({
                path: "/user-center/account/business-authway"
            });
            
        },
        personAuth(type) {//个人跳转
            this.$router.push({
                path: "/user-center/account/certification/person-authway"
            });
        },
    }
}
</script>
<style lang="scss" scoped>
.main-layout {
  min-width: 1356px;
  // min-width: 1366px;
  .body-content {
    width: 100%;
    overflow: hidden;
    background: #f4f7fc;
    height: calc(100vh - 50px); //delete by zjj
    //min-height: 500px;
    .content-wrap {
      //overflow-y: auto;
      float: right;
      width: 100% ;
      height: 101%;
      background: #FFFFFF;
      .noVertify{
          text-decoration: underline;
          font-size: 14px;
      }
      .vertify-header{
          color: #212A40;
          font-size: 16px;
          font-weight: 700;
          padding-top: 120px!important;
      }
      .verify-type {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 25px;
        .verify-item {
            width: 280px;
            height: 360px;
            cursor: pointer;
            margin-right: 20px;
            border: 1.5px dashed #dbdeea;
            .img-box {
                width: 198px;
                height: 154px;
                margin: 50px 41px 35px;
            }
            .person-img {
                background: url("../../img/person_auth.png") no-repeat;
                background-size: cover;
            }
            .business-img {
                background: url("../../img/business_auth.png") no-repeat;
                background-size: cover;
            }
            h3 {
                margin-bottom: 16px;
                text-align: center;
            }
            p {
                padding: 0 30px;
                line-height: 18px;
                color: #6d7383;
            }
            &:hover {
                border-color: #3369ff;
            }
        }
      }
      
    }

    .main-page-scroll {
      height: 101%;
      overflow-y: auto;
    }
  }
}
</style>