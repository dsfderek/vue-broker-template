import axios from "axios";
import router from "../router";
import { baseUrl } from "@common/url-conf";
import { MessageBox } from "element-ui";
import { message } from "@/common/reset-msg";
import { utils } from "@/utils/utils";
import LoadingUtils from "./LoadingUtils";
// 超时时间
axios.defaults.timeout = 15000;
axios.defaults.baseURL = baseUrl;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;
// http请求拦截器
// const CancelToken = axios.CancelToken;
const pending = [];
let loading;
axios.interceptors.request.use(
  config => {
    // config.headers['Content-Type'] = 'application/json';

    // 适配后端接口规范，根据数据类型处理POST请求
    /*if (/^(post)|(put)|(delete)$/i.test(config.method)) {
      if (typeof config.data === 'string') {
        // application/x-www-form-urlencoded请求时，需用qs模块序列化参数：qs.stringify(data);qs模块为axios必须模块，无需额外引入
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      } else {
        config.headers['Content-Type'] = 'application/json'
      }
    }*/
    config.headers["Content-Type"] = "application/json";
    const currentMenuCode = localStorage.getItem("currentMenuCode");
    config.headers["systemCode"] = currentMenuCode;
    // todo 客户管理客户端暂时固定死header的用户信息
    // config.headers['user'] = 'dx12345678';
    if (config.method == "get") {
      config.params = {
        _: Date.now(),
        ...config.params
      };
    }
    // config.cancelToken = new CancelToken(function executor(c) {
    //   pending.push(c);
    // });
    // loading = Loading.service({
    //     fullscreen: true
    // });

    // if (config.headers.notRepeatService && config.headers.showLoading !== false) {
    //   LoadingUtils.showLoading(config.headers.loadingTarget);
    // }

    return config;
  },
  error => {
    // loading.close();
    // message.error({
    //   message: i18n.t('msg.errTimeout')
    // })

    if (config.headers.showLoading !== false) {
      LoadingUtils.hideLoading();
    }
    return Promise.reject(error);
  }
);

// http响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.config.headers.showLoading !== false) {
      LoadingUtils.hideLoading();
    }
    LoadingUtils.hideLoading();
    switch (response.data.retCode) {
      case "0101":
        utils.setLogin();
        // while (pending.length > 0) {
        //   pending.pop()('请求中断');
        // }
        break;
      case "0184":
      case "0186":
      
        // while (pending.length > 0) {
        //   pending.pop()('请求中断');
        // }
        
        if (!hasElmessageError() && !hasMessageBox()) {
          MessageBox.alert(
            "您的账号已在别处登录，如非本人操作，建议尽快修改密码",
            "提示",
            {
              confirmButtonText: "确定",
              showClose: false,
              type: "warning",
              callback: action => {
                utils.setLogout(response.data.obj);
              }
            }
          );
        }
        break;
      case "0147":
      case "0146":
        if (!hasElmessageError() && !hasMessageBox()) {
          MessageBox.alert("登录信息已过期，请重新登录", "提示", {
            confirmButtonText: "确定",
            showClose: false,
            type: "warning",
            callback: action => {
              utils.setLogout(response.data.obj);
            }
          });
        }
        break;
      default:
        return response;
    }
  },
  error => {
    //判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
    if (error.config.headers.showLoading !== false) {
      LoadingUtils.hideLoading();
    }
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          //返回 401 清除token信息并跳转到登录页面
          router.push({
            path: "/control/notAllow"
          });
          break;
        case 409:
          //返回 409 参数含有 sql html 等非法字符
          message.error("输入内容不合法，请重新输入！");
          break;
      }
    }
    return Promise.reject(error);
  }
);

function hasMessageBox() {
  let res = document.getElementsByClassName("el-message-box");
  return res.length > 0;
}

function hasElmessageError() {
  let res = document.getElementsByClassName("el-message--error");
  return res.length > 0;
}

function showErrorMessage(response) {
  if (document.getElementsByClassName("el-message").length === 0) {
    if (
      response &&
      response.data &&
      response.data.retCode &&
      response.data.retCode !== "0101" &&
      response.data.retCode !== "BAM020007" &&
      response.data.retCode !== "BCONT339" && 
      response.data.retCode !== "BFS80016"
    ) {
      message.error(response.data.info || "系统错误，请稍后重试");
      return;
    }
    if (!response) {
      message.error("系统异常，请稍后重试");
    }
  }
}

export function get(url, params = {}, headers = {}, option = {}) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: "GET",
      headers,
      params,
      ...option
    }).then(
      response => {
        if (!response.data.result) {
          showErrorMessage(response);
        }
        resolve(response.data);
      },
      err => {
        if (err.response && err.response.status != "401") {
          showErrorMessage();
        }
        reject(err);
      }
    );
  });
}

export function post(url, data = {}, headers = {}, option = {}) {
  if (headers.notRepeatService) {
    //新增或修改的post请求,首先get获取
    LoadingUtils.showLoading();
    return new Promise((resolve, reject) => {
      axios({
        url:
          headers.notRepeatService +
          "/notRepeat/getNotRepeatToken?key=" +
          Date.now(),
        method: "GET"
      }).then(
        response1 => {
          if (response1.data.result) {
            axios({
              url: url,
              method: "POST",
              headers: Object.assign(headers, {
                notRepeat: response1.data.obj
              }),
              data,
              ...option
            }).then(
              response => {
                LoadingUtils.hideLoading();
                if (!response.data.result) {
                  showErrorMessage(response);
                }
                resolve(response.data);
              },
              err => {
                LoadingUtils.hideLoading();
                if (err.response && err.response.status != "401") {
                  showErrorMessage();
                }
                reject(err);
              }
            );
          }
        },
        err => {
          LoadingUtils.hideLoading();
          if (err.response && err.response.status != "401") {
            showErrorMessage();
          }
          reject(err);
        }
      );
    });
  } else {
    //普通的post请求
    return new Promise((resolve, reject) => {
      axios({
        url: url,
        method: "POST",
        headers,
        data,
        ...option
      }).then(
        response => {
          if (!response.data.result) {
            showErrorMessage(response);
          }
          resolve(response.data);
        },
        err => {
          if (err.response && err.response.status != "401") {
            showErrorMessage();
          }
          reject(err);
        }
      );
    });
  }
}

export default axios;
