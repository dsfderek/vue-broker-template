<template>
  <div class="contact-box">
    <div class="contact-top" :class="{'not-show': !showGoTop}" @click="goTop">
      <img width="16" height="16" src="@/assets/imgs/arrow-up-large.png">
    </div>
    <div v-popover:contactPopover class="contact-service popover-icon-content">
      <i class="iconfont icon-contact-service"></i>
    </div>
    <el-popover
      ref="contactPopover"
      placement="left"
      trigger="hover"
      popper-class="popover-radius2"
    >
      <div class="contact-popover">
        <div style="font-size: 14px; color: #212A40;">客服热线<b class="contact-tel">400-060-0160</b></div>
        <div style="margin-top: 8px; font-size: 12px; color: #6D7383;">周一至周五：9:00~18:00</div>
      </div>
    </el-popover>
    <div v-popover:onlinePopover class="online-service popover-icon-content" @click="autoServer">
      <i class="iconfont icon-online-service"></i>
    </div>
    <el-popover
      ref="onlinePopover"
      placement="left"
      trigger="hover"
      popper-class="popover-radius2"
    >
      <div class="contact-popover">
        <div style="font-size: 14px; color: #212A40;display: flex; align-items: end;">
          <span style="cursor: pointer;" @click="autoServer">在线客服</span>
          <span style="font-size: 12px; color: #6D7383;margin-left: 10px;">周一至周五：9:00~18:00</span>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
  import {onlineServiceUrl, onlineServiceStr} from '@common/url-conf';
  import {mapGetters} from 'vuex';
  import {Base64} from 'js-base64'

  export default {
    name: "contact",
    data() {
      return {
        scrollTimer: null,
        showGoTop: false,
        mainClass: '.main-page-scroll', // 外层滚动条
        innerClass: '.page-content', // 内层滚动条
      };
    },
    mounted() {
      window.addEventListener("scroll", this.handleScroll, true);
    },
    computed: {
      // 从store中获取当前用户和主账户
      ...mapGetters(["userInfo", 'mainUserInfo']),
    },
    watch: {
      '$route.fullPath'(newVal, oldVal) {
        this.showGoTop = false;
      }
    },
    methods: {
      // 智能客服
      autoServer() {
        if (this.userInfo) {
          let loginName = this.userInfo.userName || '';
          let userCode = this.userInfo.userCode || '';
          let type = ""; // 客户类型：客户域（0主客户|子客户为空）|2渠道客户（主账号2，子账号0）
          if (this.userInfo.userCode === this.mainUserInfo.userCode) {
            // 当前登陆用户code与主账号用户code一致，则是主账号登陆
            type = '0';
          }
          let platform = "BECP"; // 2020.9.9,屈：门户/客户/渠道/工单，都是一致的，写死
          let userInfoParams = {
            "userCode": userCode,
            "loginName": loginName,
            "customerType": type,
          };
          let usrInfoKey = JSON.stringify(userInfoParams);
          let usrInfoKeyStr = Base64.encode(usrInfoKey);
          let sysNum = onlineServiceStr; // 放在url-conf.js中，目前仅两个环境：1.生产，2.其他
          let url = `${onlineServiceUrl}/chat/pc/index.html?sysNum=${sysNum}&params=${usrInfoKeyStr}&platform=${platform}`;
          window.open(url, "_blank");
        }
      },
      // 绑定滚动条
      handleScroll(event) {
        let ev = event || window.event;
        if (!ev.target.classList || !ev.target.classList.contains('page-content')) {
          return;
        }
        let docHeight = document.body.offsetHeight;
        let contentHeight = docHeight - 120;
        if (ev.target.scrollTop > contentHeight) {
          this.showGoTop = true;
        } else {
          this.showGoTop = false;
        }
      },
      goTop() {
        // 外层滚动条
        let mainScrollTop = document.querySelector(this.mainClass) ? document.querySelector(this.mainClass).scrollTop : 0;
        // 内层滚动条
        let innerScrollTop = document.querySelector(this.innerClass) ? document.querySelector(this.innerClass).scrollTop : 0;
        if (mainScrollTop > 0) {
          document.querySelector(this.mainClass).scrollTop = 0;
        }
        if (innerScrollTop > 0 && !this.scrollTimer) {
          this.scrollTimer = setInterval(() => {
            document.querySelector(this.innerClass).scrollTop = Math.max(document.querySelector(this.innerClass).scrollTop - 20, 0);
            if (document.querySelector(this.innerClass).scrollTop === 0) {
              clearInterval(this.scrollTimer);
              this.scrollTimer = null;
            }
          }, 10)
        }
      }
    },
    destroyed() {
      if (this.scrollTimer) {
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
      }
      window.removeEventListener("scroll", this.handleScroll);
    }
  };
</script>

<style lang="scss" scoped>
  .contact-box {
    position: fixed;
    width: 30px;
    right: 4px;
    bottom: 50px;
    display: flex;
    flex-direction: column;
    border-radius: 15px;
    background-color: #3369FF;
    box-shadow: 0 2px 6px 0 rgba(33, 76, 217, 0.26);

    .contact-top,
    .contact-service,
    .online-service {
      border-radius: 15px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
      height: 30px;
      transition: 0.5s;

      .iconfont {
        color: #fff;
        font-size: 16px;

        &.icon-arrow-up-large {
          font-size: 11px;
        }
      }

      &:hover {
        background-color: #214CD9;
      }
    }

    .popover-icon-content {
      &.focusing {
        outline: none !important;
      }
    }

    .contact-top {
      overflow: hidden;
      height: 30px;
      margin-bottom: 10px;

      &.not-show {
        height: 0;
        margin-bottom: 0;
      }
    }
  }

  .contact-popover {
    white-space: nowrap;
    padding: 10px 16px;

    .contact-tel {
      font-family: "Microsoft YaHei";
      font-size: 16px;
      padding-left: 10px;
    }
  }
</style>
<style lang="scss">
  .popover-radius2{
    border-radius: 2px !important;
  }
</style>
