<template>
  <div class="page-box template-box">
    <ValidationObserver ref="passwordForm" v-slot="{ passes }">
      <el-form label-position="left" ref="form" label-width="220px">
        <bread-crumb :breads="breadsData.breads" :title="breadsData.title">
          <template slot="action">
            <el-button @click="goBack">取消</el-button>
            <el-button
              ref="submit"
              type="primary"
              @click="passes(submitPassword)"
              >确认</el-button
            >
          </template>
        </bread-crumb>
        <div class="page-content">
          <div class="page-content-title">
            为了确认是您本人操作，请完成以下验证
          </div>
          <el-form-item label="已验证手机" v-if="!isEmailCheck">
            <span style="width: 330px; display: inline-block">
              <span>+86</span>
              <span>{{
                ruleForm.telphone.substr(0, 3) +
                "****" +
                ruleForm.telphone.substr(7)
              }}</span>
            </span>
            <el-button
              type="text"
              class="emailCheck"
              v-if="isExistEmail"
              @click="changeCheckedWay"
              >通过已验证邮箱验证</el-button
            >
          </el-form-item>
          <el-form-item label="已验证邮箱" v-else>
            <span style="width: 330px; display: inline-block">{{
              ruleForm.email.substr(0, 3) + "****" + ruleForm.email.substr(7)
            }}</span>
            <el-button type="text" class="emailCheck" @click="changeCheckedWay"
              >通过已验证手机验证</el-button
            >
          </el-form-item>
          <div v-if="!isEmailCheck" class="emailWay">
            <vee-input
              label="短信验证码"
              rules="required|max:32"
              innerWidth="320px"
              placeholder="请输入验证码"
              v-model="ruleForm.telVertifyCode"
            >
            </vee-input>
            <el-button class="getCode" @click="getMsgCode" v-if="msgCodeNo"
              >获取验证码</el-button
            >
            <el-button class="getCode" disabled v-if="!msgCodeNo"
              >{{ codeTime }}秒后重新获取</el-button
            >
            <span class="emailCode">没收到短信验证码</span>
            <el-tooltip placement="top">
              <div slot="content">
                1、网络通讯异常可能会造成邮件丢失，请重新获取或稍后再试。<br />
                2、请核实邮箱是否正常使用，并检查垃圾邮箱夹。<br />
                3、如果您手机和邮箱均不可使用，请您联系人工客服400-060-0160获取帮助。
              </div>
              <el-button type="text" class="help">
                <i class="iconfont icon-help"></i>
              </el-button>
            </el-tooltip>
          </div>
          <div v-else class="emailWay">
            <vee-input
              label="邮箱验证码"
              rules="required|max:32"
              innerWidth="320px"
              placeholder="请输入验证码"
              v-model="ruleForm.emailVertifyCode"
            >
            </vee-input>
            <el-button class="getCode" v-if="emailCodeNo" @click="getEmailCode"
              >获取验证码</el-button
            >
            <el-button class="getCode" disabled v-if="!emailCodeNo"
              >{{ codeTime }}秒后重新获取</el-button
            >
            <span class="emailCode">没收到邮箱验证码</span>
            <el-tooltip placement="top">
              <div slot="content">
                1、网络通讯异常可能会造成邮件丢失，请重新获取或稍后再试。<br />
                2、请核实邮箱是否正常使用，并检查垃圾邮箱夹。<br />
                3、如果您手机和邮箱均不可使用，请您联系人工客服400-060-0160获取帮助。
              </div>
              <el-button type="text" class="help">
                <i class="iconfont icon-help"></i>
              </el-button>
            </el-tooltip>
          </div>
          <vee-password-input
            innerWidth="320px"
            v-model="ruleForm.oldPassword"
            rules="required"
            label="原密码"
            vid="password"
          />
          <vee-password-input
            innerWidth="320px"
            v-model="ruleForm.newPassword"
            rules="required|checkPassword"
            vid="newPassword"
            type="password"
            label="新密码"
          />
          <vee-password-input
            innerWidth="320px"
            v-model="ruleForm.confirmation"
            type="password"
            rules="required|confirmed:newPassword"
            label="确认密码"
          />
        </div>
      </el-form>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver } from "vee-validate";
import VeePasswordInput from "@components/VeePasswordInput";
import { mainApi } from "@main/services";
import { utils } from "@/utils/utils";
import { sha256_digest } from "@utils/sha256";
import { mapGetters } from "vuex";
import { TIME_COUNT } from "@common/url-conf";
import { pageLoading } from "@common/mixins";
export default {
  components: {
    ValidationObserver,
    VeePasswordInput,
  },
  name: "index",
  props: ["baseInfo"],
  mixins: [pageLoading],
  data() {
    return {
      breadsData: {
        breads: [],
        title: "修改密码",
      },
      isEmailCheck: false,
      codeTime: null,
      timer: null,
      msgCodeNo: true,
      emailCodeNo: true,
      ruleForm: {
        telphone: "",
        email: "",
        confirmation: "",
        newPassword: "",
        emailVertifyCode: "",
        telVertifyCode: "",
        oldPassword: "",
      },
      customerCode: "",
      isExistEmail: false,
    };
  },

  mounted() {
    this.getCustomerCode();
  },
  computed: {
    ...mapGetters(["userCode"]),
  },
  methods: {
    //改变验证方式
    changeCheckedWay() {
      this.clearTimer();
      this.msgCodeNo = true;
      this.emailCodeNo = true;
      this.isEmailCheck = !this.isEmailCheck;
    },
    //清除定时器
    clearTimer() {
      if (this.timer) {
        setInterval(this.timer);
        this.timer = null;
      }
    },
    getCustomerCode() {
      this.showFullLoading();
      mainApi
        .mainQueryUserInfo()
        .then((res) => {
          if (res.result) {
            this.customerCode = res.obj.userCode;
            this.ruleForm.telphone = res.obj.mobile;
            this.ruleForm.email = res.obj.email;
            if (this.ruleForm.email == null || this.ruleForm.email == "") {
              this.isExistEmail = false;
            } else {
              this.isExistEmail = true;
            }
          }
        })
        .finally(() => {
          this.closeFullLoading();
        });
    },
    async submitPassword() {
      //校验成功发送请求
      this.sendCodeClient();
      // this.$router.push({
      //   path: '/modify_password'
      // })
    },
    getMsgCode() {
      let param = {
        // telephone: this.ruleForm.telphone,
        sceneType: "12",
      };
      this.showFullLoading();
      mainApi
        .clientTelMsgCode(param)
        .then((res) => {
          if (res.result) {
            this.getCode();
          }
        })
        .finally(() => {
          this.closeFullLoading();
        });
    },
    //验证码校验
    sendCodeClient() {
      this.updatePsw();
    },
    // 更新密码
    updatePsw() {
      let param = {
        customerCode: this.customerCode,
        password: sha256_digest(this.ruleForm.newPassword),
        oldPassword: sha256_digest(this.ruleForm.oldPassword),
        sceneType: "12",
        token: this.isEmailCheck ? "0" : "1",
      };
      if (this.isEmailCheck) {
        param.email = this.ruleForm.email;
        param.verifyCode = this.ruleForm.emailVertifyCode;
      } else {
        param.telephone = this.ruleForm.telphone;
        param.verifyCode = this.ruleForm.telVertifyCode;
      }
      this.showFullLoading();
      mainApi
        .updatePassWord(param)
        .then((res) => {
          if (res.result) {
            this.$message.success("修改成功");
            setTimeout(() => {
              utils.setLogout();
            }, 2000);
          }
        })
        .finally(() => {
          this.closeFullLoading();
        });
    },
    // 返回
    goBack() {
      //门户channelType都有【5，6，7，8，9，10】
      let channelTypeArr = ["5", "6", "7", "8", "9", "10"];
      //如果是从门户跳转到修改密码，返回需要返回到门户页面
      if (channelTypeArr.includes(this.$route.query.channelType)) {
        //获取门户链接
        let url = decodeURI(this.$route.query.path);
        window.location.href = url;
      } else {
        this.$router.go(-1);
      }
    },
    // 获取邮箱验证码
    getEmailCode() {
      let param = {
        // email: this.ruleForm.email,
        sceneType: "12",
      };
      this.showFullLoading();
      mainApi
        .clientSendCode(param)
        .then((res) => {
          if (res.result) {
            this.getCode();
          }
        })
        .finally(() => {
          this.closeFullLoading();
        });
    },
    // 获取验证码定时器
    getCode() {
      let _this = this;
      if (!_this.timer) {
        _this.codeTime = TIME_COUNT;
        _this.msgCodeNo = false;
        _this.emailCodeNo = false;
        _this.timer = setInterval(() => {
          if (_this.codeTime > 0 && _this.codeTime <= TIME_COUNT) {
            _this.codeTime--;
          } else {
            _this.msgCodeNo = true;
            _this.emailCodeNo = true;
            clearInterval(_this.timer);
            _this.timer = null;
          }
        }, 1000);
      }
    },
  },
};
</script>

<style  lang="scss" scoped>
.page-content {
  padding-left: calc((100% - 823px) / 2);
  .page-content-title {
    color: #212a40;
    font-weight: bold;
    margin-bottom: 30px;
  }
  .emailCheck {
    text-decoration: underline;
  }
  .emailWay {
    display: flex;
    .help {
      color: #6d7383;
      height: 28px;
      line-height: 18px;
    }
    .getCode {
      margin-left: 10px;
      height: 28px;
      margin-top: 2px;
    }
    .emailCode {
      line-height: 30px;
      color: #a3a9b7;
      font-size: 12px;
      text-align: right;
      padding-left: 20px;
    }
  }
}
</style>