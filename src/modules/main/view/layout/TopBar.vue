<template>
  <div class="site-nav">
    <div class="nav-bd-l">
      <ul>
        <li class="site-nav-menu">
          <a class="site-nav-link" @click="gotoIndex">
            <img :src="logo" class="site-nav-logo" />
          </a>
        </li>
      </ul>
    </div>
    <div class="nav-bd-r">
      <!-- <el-badge :max="999" :value="unReadMsgNum" :hidden="unReadMsgNum==0" class="is-dot"> -->
      <el-badge :is-dot="unReadMsgNumStatus" class="is-dot">
        <span class="iconfont icon-xinxi" @click="handleToStation"></span>
      </el-badge>
    </div>
    <div v-if="userName" class="nav-bd-r" @mouseover="getInitData">
      <el-dropdown trigger="hover">
        <div
          v-if="mainUserCode == userCode"
          class="site-nav-subname"
          :title="parentUserName"
        >
          <div>{{ parentUserName }}</div>
        </div>
        <div
          v-else
          class="site-nav-subname sub"
          :title="parentUserName + '/' + userName"
        >
          <div>{{ parentUserName }}</div>
          <div>{{ userName }}</div>
        </div>
        <el-dropdown-menu
          slot="dropdown"
          :class="[mainUserCode != userCode ? 'parentDown' : 'personDown']"
        >
          <div class="customMenuTop">
            <div class="amount" @click="gotToIndex('customers')">
              <div>
                <span class="preventClick">余额</span>
              </div>
              <div>
                <el-button type="text" @click.stop.prevent="goCharge"
                  >立即充值</el-button
                >
              </div>
            </div>
            <div class="amountMoney" v-if="mainUserCode == userCode">
              <span class="preventClick">¥{{ unitFormat(amount) }}</span>
            </div>
            <div class="amountMoney" v-else>
              <span class="preventClick">***</span>
            </div>
          </div>
          <div class="menuList">
            <el-dropdown-item @click.native="baseInfoPath('customers')">
              <div class="baseInfoRow">
                <span>基本信息</span>
                <span
                  v-if="mainUserCode == userCode"
                  :class="[
                    userInfo.authStatus == '0' ? 'authState' : 'unAuthState',
                  ]"
                >
                  <img
                    src="../../img/certify.png"
                    alt
                    class="tipPicture"
                    v-if="certifyText == '已实名认证'"
                  />
                  <img
                    src="../../img/unCertify.png"
                    alt
                    class="tipPicture"
                    v-else
                  />
                  <span @click.stop.prevent="goCertify('customers')">
                    {{ certifyText }}
                  </span>
                </span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item @click.native="switchSystem('BAM')"
              >访问控制服务</el-dropdown-item
            >
            <el-dropdown-item
              v-if="mainUserCode == userCode"
              @click.native="goToUnPaidOrder('customers')"
            >
              <div class="paidOrder">
                <span>待支付订单</span>
                <span class="paidNum">{{ parOrder }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item
              v-if="mainUserCode == userCode"
              @click.native="gotToRenewManage('customers')"
              >产品续费</el-dropdown-item
            >
          </div>
          <div class="menuBottom">
            <span
              class="modifyPwd"
              v-if="mainUserCode == userCode"
              @click="modifyPsw('customers')"
              >修改密码</span
            >
            <el-button type="text" @click="logout()" class="exitLogin"
              >退出</el-button
            >
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="nav-bd-r nav-r user-photo">
      <img src="../../img/user.png" alt class="userImg" />
    </div>
    <ul class="nav-bd-r nav-r nav-list">
      <li
        v-for="item in topNav"
        :class="!item.active ? 'top-nav-btn' : 'top-nav-btn active'"
        @click="linkTo(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { utils } from "@/utils/utils";
import { workerOrderUrl, PORTAL_URL, casUrl } from "@common/url-conf";
import { consoleApi } from "@/modules/console/overview/services";
import { debitsApi } from "@user-center/debits/service";
import { unitFormatMix } from "@common/mixins";
import { statisticsApi } from "@user-center/news/service";
import { accountApi } from "@user-center/account/services";
export default {
  name: "TopBar",
  mixins: [unitFormatMix],
  data() {
    return {
      parOrder: 0,
      amount: "0.00",
      getBalanceFlag: true,
      getUnpaidFlag: true,
      getAuthStatusFlag: true,
      authStatusTime: null,
      getUnpaidTime: null,
      getCurTime: null,
      certifyText: "",
      clientTypeMap: {
        customers: "1",
        BAM: "3",
      },
      unReadMsgNum: 0,
      logo: casUrl + "/cas/custom/img/logo-white.png",
      unReadMsgNumStatus: false,
      topNav: [
        {
          label: "云市场",
          name: "app-service",
          active: false,
        },
        {
          label: "工单",
          name: "workorder",
          active: false,
        },
        {
          label: "控制台",
          name: "resource",
          active: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["userName", "parentUserName", "mainUserCode", "userCode"]),
    ...mapState({
      userInfo: (state) => state.main.userInfo,
      isDot: (state) => state.news.isDot,
    }),
  },
  watch: {
    isDot(newVal, oldVal) {
      this.unReadMsgNumStatus = newVal;
    },
    $route(to, from) {
      let str = to.fullPath;
      let arr = str.split("/");
      let s = arr[1];
      if (s != "console") {
        this.topNav.forEach((item) => {
          item.active = false;
        });
      }
    },
  },
  created() {
    let str = this.$route.path;
    this.topNav.forEach((item) => {
      if (str.indexOf("/" + item.name) != -1 && item.name != "workorder") {
        item.active = true;
      } else {
        item.active = false;
      }
      if (str.indexOf("/overview") != -1 && item.name == "resource") {
        item.active = true;
      }
    });
  },
  mounted() {
    /*
    if (this.$route.query.JSESSIONID != undefined) {
      let that = this;
      setTimeout(function(){
        utils.setCookie(
          "JSESSIONID",
          that.$route.query.JSESSIONID,
          1
        );
      },3000)
    }
    */
    this.websocketInit();
    this.queryMsgNumByModule();
  },
  methods: {
    // 站内信条数
    async queryMsgNumByModule() {
      const data = {
        oneMsgType: "100", // oneMsgType：  customer 客户端 100    channel 渠道端 200   operation 运营端 300
      };
      const { result, obj } = await statisticsApi.queryMsgNumByModule(data);
      if (result) {
        this.unReadMsgNum = obj.unreadMsgNum;
        if (obj.unreadMsgNum == 0) {
          this.unReadMsgNumStatus = false;
        } else {
          this.unReadMsgNumStatus = true;
        }
        this.$store.commit("news/timelyMsg", this.unReadMsgNumStatus);
      }
    },
    websocketInit() {
      this.$websocket.websocketReconnect(this.userInfo.userCode, (data) => {
        const { msgType } = JSON.parse(data.body);
        if (msgType.length === 6) {
          setTimeout(() => {
            this.queryMsgNumByModule();
          }, 500);
        }
      });
    },
    handleToStation() {
      this.$store
        .dispatch("getMenuData", {
          type: "customers",
          toBarLink: "user-center/news/station",
        })
        .then(() => {
          this.$router.push("/user-center/news/station");
        });
    },
    login() {
      utils.setLogin();
    },
    logout() {
      utils.setLogout();
    },
    gotoIndex() {
      let JSESSIONID = utils.getCookie("JSESSIONID");
      window.open(`${PORTAL_URL}?JSESSIONID=${JSESSIONID}&channelType=5`);
    },
    // 获取余额和获取未支付订单数量以及认证状态
    getInitData() {
      if (this.parentUserName == this.userName) {
        this.getBalanceDetail();
        this.getUnpaidNum();
        this.getCertifyStatus();
      }
    },
    //获取认证状态
    getCertifyStatus() {
      if (!this.getAuthStatusFlag) {
        return;
      }
      if (this.authStatusTime) {
        let getNowTime = new Date().getTime();
        if (Number(getNowTime) - Number(this.authStatusTime) <= 1000) {
          return;
        }
      }
      accountApi
        .clientQueryBaseInfo(this.userInfo.userCode)
        .then((res) => {
          this.getAuthStatusFlag = true;
          this.authStatusTime = new Date().getTime();
          if (res.result) {
            if (res.obj.authStatus == "0") {
              this.certifyText = "已实名认证";
            } else {
              this.certifyText = "未实名认证";
            }
          }
        })
        .catch((err) => {
          this.getAuthStatusFlag = true;
          this.authStatusTime = new Date().getTime();
        });
    },
    // 获取待支付订单数量
    getUnpaidNum() {
      if (!this.getUnpaidFlag) {
        return;
      }
      if (this.getUnpaidTime) {
        let getNowTime = new Date().getTime();
        if (Number(getNowTime) - Number(this.getUnpaidTime) <= 1000) {
          return;
        }
      }
      debitsApi
        .queryUnPaidOrders()
        .then((res) => {
          this.getUnpaidFlag = true;
          this.getUnpaidTime = new Date().getTime();
          if (res && res.result) {
            this.parOrder = res.obj.total || 0;
          }
        })
        .catch((err) => {
          this.getUnpaidFlag = true;
          this.getUnpaidTime = new Date().getTime();
        });
    },
    // 获取余额
    getBalanceDetail() {
      if (!this.getBalanceFlag) {
        return;
      }
      if (this.getCurTime) {
        let getNowTime = new Date().getTime();
        if (Number(getNowTime) - Number(this.getCurTime) <= 1000) {
          return;
        }
      }
      //保持当前请求唯一避免重复请求
      this.getBalanceFlag = false;
      // 获取余额
      debitsApi
        .queryFinancialAccount(this.mainUserCode)
        .then((res) => {
          this.getBalanceFlag = true;
          this.getCurTime = new Date().getTime();
          if (res && res.result) {
            this.amount = res.obj.cashAmount;
          }
        })
        .catch((err) => {
          this.getBalanceFlag = true;
          this.getCurTime = new Date().getTime();
        });
    },
    baseInfoPath(type) {
      localStorage.setItem("channelType", this.clientTypeMap[type]);
      this.$store
        .dispatch("getMenuData", {
          type: type,
          toBarLink: "user-center/account/base-info",
        })
        .then(() => {
          this.$router.push("/user-center/account/base-info");
        });
    },
    switchSystem(type) {
      localStorage.setItem("channelType", this.clientTypeMap[type]);
      this.$store
        .dispatch("getMenuData", { type: type, toBarLink: "control/user" })
        .then(() => {
          this.$router.push("/control/user");
        });
    },
    //去认证
    goCertify(type) {
      if (this.userInfo.authStatus != "0") {
        localStorage.setItem("channelType", this.clientTypeMap[type]);
        this.$store
          .dispatch("getMenuData", {
            type: type,
            toBarLink: "user-center/account/certification",
          })
          .then(() => {
            this.$router.push("/user-center/account/certification");
          });
      }
    },
    modifyPsw(type) {
      this.$router.push({
        path: "/main/account",
      });
    },
    linkTo(val) {
      if (val.name == "workorder") {
        val.active = false;
      } else {
        val.active = true;
        this.topNav.forEach((item) => {
          if (val.name != item.name) {
            item.active = false;
          }
        });
      }

      switch (val.name) {
        case "app-service":
          this.$router.push("/console/app-service/goods");
          break;
        case "workorder":
          let JSESSIONID = utils.getCookie("JSESSIONID");
          let channelType = localStorage.getItem("channelType");
          window.open(
            `${workerOrderUrl}?entrySource=2&JSESSIONID=${JSESSIONID}&channelType=${channelType}`
          );
          break;
        case "resource":
          this.$router.push("/console");
          break;
      }
    },
    // 充值
    goCharge() {
      this.$store
        .dispatch("getMenuData", {
          type: "customers",
          toBarLink: "user-center/debits/recharge",
        })
        .then(() => {
          this.$router.push("/user-center/debits/recharge");
        });
    },
    //待支付工单
    payOrderEvent() {
      consoleApi.queryOrderNum().then((res) => {
        if (res.result && res.obj) {
          this.payOrder = res.obj.total;
        } else {
          Message.error(res.info);
        }
      });
    },
    // 跳转到待支付订单
    goToUnPaidOrder(type) {
      localStorage.setItem("channelType", this.clientTypeMap[type]);
      this.$store
        .dispatch("getMenuData", {
          type: type,
          toBarLink: "user-center/order/mine",
        })
        .then(() => {
          this.$router.push({
            path: "/user-center/order/mine",
            query: {
              unpaid: "0",
            },
          });
        });
    },
    // 跳转续费
    gotToRenewManage(type) {
      localStorage.setItem("channelType", this.clientTypeMap[type]);
      this.$store
        .dispatch("getMenuData", {
          type: type,
          toBarLink: "user-center/order/renew",
        })
        .then(() => {
          this.$router.push({
            path: "/user-center/order/renew",
          });
        });
    },
    // 跳转总览
    gotToIndex(type) {
      localStorage.setItem("channelType", this.clientTypeMap[type]);
      this.$store
        .dispatch("getMenuData", {
          type: type,
          toBarLink: "user-center/debits/dashboard",
        })
        .then(() => {
          this.$router.push({
            path: "/user-center/debits/dashboard",
          });
        });
    },
  },
};
</script>
<style lang="scss" src="@main/css/top-bar.scss"></style>
<style lang="scss" scoped>
.site-nav {
  .user-photo {
    margin-right: 0px;
    padding-top: 11px;
    .userImg {
      width: 28px;
      height: 28px;
    }
  }
  .site-nav-subname {
    color: #fff;
    text-align: center;
    > div {
      overflow: hidden;
      max-width: 180px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .site-nav-subname.sub {
    padding-top: 7px;
    padding-bottom: 7px;
    > div {
      &:first-of-type {
        line-height: 130%;
      }
      &:last-of-type {
        line-height: 130%;
        color: #80a6f6;
      }
    }
  }
  .top-nav-btn {
    color: #fff;
    opacity: 0.7;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
  }
  .top-nav-btn.active {
    opacity: 1;
  }
  .nav-r {
    display: flex;
    justify-content: flex-start;
    align-content: center;
  }
  .nav-list {
    > li {
      margin: auto 10px;
    }
  }
}

.customMenuTop {
  padding: 0px 13px 5px 13px;
  border-bottom: solid 1px #dbdeea;
  .amount {
    display: flex;
    justify-content: space-between;
    line-height: 30px;
    color: #6d7383;
    font-size: 12px;
    .preventClick {
      pointer-events: none;
    }
  }
  .amountMoney {
    color: #212a40;
    font-weight: 700;
    font-size: 16px;
    .preventClick {
      pointer-events: none;
    }
  }
}
.menuList {
  margin-top: 5px;
  li {
    line-height: 30px;
    color: #212a40;
  }
  .paidOrder {
    display: flex;
    position: relative;
    .paidNum {
      position: absolute;
      right: 0px;
      border-radius: 50%;
      background: #fd6845;
      top: 5px;
      height: 18px;
      width: 18px;
      text-align: center;
      vertical-align: middle;
      line-height: 19px;
      color: white;
    }
  }
  .baseInfoRow {
    display: flex;
    justify-content: space-between;
    .tipPicture {
      width: 14px;
      height: 16px;
      padding-bottom: 2px;
    }
    .authState {
      color: #00b3b0;
    }
    .unAuthState {
      color: #fd6845;
    }
  }
}
.parentDown {
  width: 184px;
}
.personDown {
  width: 184px;
}
.menuBottom {
  border-top: solid 1px #dbdeea;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
  padding: 0 13px 0 13px;
  font-size: 12px;
  .modifyPwd {
    cursor: pointer;
  }
  .exitLogin {
    color: #a3a9b7;
  }
}
.icon-xinxi {
  color: #fff;
  cursor: pointer;
}
.el-badge {
  vertical-align: top;
}
/deep/ .is-dot {
  .el-badge__content.is-fixed {
    top: 19px !important;
  }
}

/deep/ .el-badge__content.is-dot {
  height: 6px;
  width: 6px;
}
</style>
