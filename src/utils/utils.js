import {Message} from 'element-ui'

const IS_LOGIN_IN = 'IS_LOGIN_IN';
import {casLoginUrl} from "@common/url-conf";

export default class Utils {
  /**
   * 通过传入的children字段名，将多层级的对象打平为一个数组
   * @param {T} source
   * @param {string} children
   * @returns {T[]}
   * 例如  [{id: 1, children: [{id: 2}]}] => [{id: 1}, {id: 2}]
   */
  flatObject(source, children = 'children') {
    const re = []
    const clone = JSON.parse(JSON.stringify(source))
    this.flatObjectDo(clone, children, re)
    return re
  }

  /**
   * 数组转树
   * @param source
   * @param parentIdVal
   * @param id
   * @param parentId
   * @returns {*}
   */
  list2Tree(source, parentIdVal = undefined, id = 'id', parentId = 'parentId', max = 3, currentLevel = 1) {
    const target = source.filter((s) => s[parentId] === parentIdVal)
    target.forEach((t) => {
      if (currentLevel < max) {
        const children = this.list2Tree(source, t[id], id, parentId, max, currentLevel + 1)
        if (children.length) {
          t.children = children
        }
      }
    })
    return target
  }

  treeDataTranslate(data, id = 'id', pid = 'parentId') {
    var res = []
    var temp = {}
    for (var i = 0; i < data.length; i++) {
      temp[data[i][id]] = data[i]
    }
    for (var k = 0; k < data.length; k++) {
      if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
        if (!temp[data[k][pid]]['children']) {
          temp[data[k][pid]]['children'] = []
        }
        if (!temp[data[k][pid]]['_level']) {
          temp[data[k][pid]]['_level'] = 1
        }
        data[k]['_level'] = temp[data[k][pid]]._level + 1
        temp[data[k][pid]]['children'].push(data[k])
      } else {
        res.push(data[k])
      }
    }
    return res
  }

  // 日期判断
  isDate(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]'
  }

  isObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }

  // 空对象判断
  isEmptyObject(obj) {
    return Object.keys(obj).length <= 0
  }

  //
  delEmptyProp(obj = {}) {
    for (const key of Object.keys(obj)) {
      if (this.isObj(obj[key])) {
        this.delEmptyProp(obj[key])
      }
      if (obj[key] === null || obj[key] === undefined || obj[key] === '' || (this.isObj(obj[key]) && this.isEmptyObject(obj[key]))) {
        delete obj[key]
      }
    }
    return obj
  }

  // 对象转为数组
  objToArr(obj = {}, labelField = 'label', valueField = 'value', disNull = false) {
    const arr = []
    for (const key of Object.keys(obj)) {
      if (!(disNull && !(obj[key]))) {
        arr.push({
          [labelField]: key,
          [valueField]: obj[key]
        })
      }
    }
    return arr
  }

  // 反转对象的key-value
  reverse(source) {
    const re = {}
    for (const key of Object.keys(source)) {
      re[source[key]] = key
    }
    return re
  }

  flatObjectDo(source, children, re, parentId) {
    source.forEach((s) => {
      if (parentId) {
        s.parentId = parentId
      }
      re.push(s)
      if (s[children]) {
        this.flatObjectDo(s[children], children, re, s.id)
        delete s[children]
      }
    })
  }

  /**
   * 分组
   * @param array
   * @param f
   * @returns [[],[]]
   */
  groupBy(array, f) {
    let groups = {}
    array.forEach(function (o) {
      let group = JSON.stringify(f(o))
      groups[group] = groups[group] || []
      groups[group].push(o)
    })
    return Object.keys(groups).map(function (group) {
      return groups[group]
    })
  }

  deepCopy(obj) {
    // 只拷贝对象
    if (typeof obj !== 'object') return obj
    // 根据obj的类型判断是新建一个数组还是一个对象
    let newObj = obj instanceof Array ? [] : {}
    for (let key in obj) {
      // 遍历obj,并且判断是obj的属性才拷贝
      if (obj.hasOwnProperty(key)) {
        // 判断属性值的类型，如果是对象递归调用深拷贝
        newObj[key] = typeof obj[key] === 'object' ? this.deepCopy(obj[key]) : obj[key]
      }
    }
    return newObj
  }

  getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
    })
  }

  /**
   * 判断是否IE浏览器，为IE返回true
   * @returns {boolean}
   */
  isIE() {
    let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    let isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    return (isIE || isEdge || isIE11)
  }

  _webDownLoadFileConfirm(fileName, blob) {
    if (!this.isIE()) {
      // 非IE下载
      const elink = document.createElement('a');
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, fileName);
    }
  }

  // 下载文件
  webDownLoadFile(fileName, blob) {
    if (!fileName || !blob) {
      return false;
    }
    if (!blob.type) {
      Message.error("下载失败");
      return false;
    }
    if (blob.size === 0) {
      Message.error("暂无数据，不能导出");
      return;
    }
    if (blob.type === 'application/json') {
      let reader = new FileReader();
      reader.readAsText(blob, 'utf-8');
      reader.onload = () => {
        let result = JSON.parse(reader.result);
        if (result.result) {
          this._webDownLoadFileConfirm(fileName, blob);
        } else {
          Message.error(result.info || '下载失败');
        }
      }
    } else {
      this._webDownLoadFileConfirm(fileName, blob);
    }
  }

  /**
   * 将数字转为千位显示111,111.21
   * @param num 数字
   * @param precision 保留小数位
   * @param separator 分割，默认是,
   * @returns {*}
   */
  formatNumber(num, precision, separator) {
    let parts;
    // 判断是否为数字
    if (!isNaN(parseFloat(num)) && isFinite(num)) {
      // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
      // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
      // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
      // 的值变成了 12312312.123456713
      num = Number(num);
      // 处理小数点位数
      num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
      // 分离数字的小数部分和整数部分
      parts = num.split('.');
      // 整数部分加[separator]分隔, 借用一个著名的正则表达式
      parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));
      return parts.join('.');
    }
    return num;
  }

  setCookie(c_name, value, expiredays) {
    // expiredays为天数
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays * 24 * 60 * 60 * 1000);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString() + "; path=/");
  }

  // cookie存取删
  getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return (arr[2]);
    else
      return null;
  }

  // 清除cookie
  clearCookie(name) {
    // this.setCookie(name, "", -1);
  }

  getIsLogin() {
    return localStorage.getItem(IS_LOGIN_IN);
  }

  setLoginSuccess() {
    localStorage.setItem(IS_LOGIN_IN, 'TRUE');
  }

  setLogin() {
    localStorage.setItem(IS_LOGIN_IN, 'FALSE');
    localStorage.removeItem("loginProtect")
    localStorage.removeItem("loginProtectV")
    localStorage.removeItem("isLoginProtect")
    if (localStorage.getItem('channelType') === '3') {
      window.location.href = casLoginUrl + "/login/bam";
    } else {
      window.location.href = casLoginUrl + "/login/custom";
    }
    localStorage.removeItem("channelType")
  }

  setLogout(logoutUrl) {
    localStorage.setItem(IS_LOGIN_IN, 'FALSE');
    localStorage.removeItem("loginProtect")
    localStorage.removeItem("currentMenuCode")
    localStorage.removeItem("loginProtectV")
    localStorage.removeItem("isLoginProtect")

    if(logoutUrl) {
      window.location.href = logoutUrl;
    } else {
      if (localStorage.getItem('channelType') === '3') {
        window.location.href = casLoginUrl + "/logout/bam";
      } else {
        window.location.href = casLoginUrl + "/logout/custom";
      }
    }
    // this.clearCookie("JSESSIONID");
    localStorage.removeItem("channelType")
  }

  setItem(k, v) {
    localStorage.setItem(k, v);
  }

  getItem(item) {
    let val = localStorage.getItem(item);
    return val;
  }

  deleteItem(item) {
    localStorage.removeItem(item);
  }

  clearItems() {
    localStorage.clear();
  }

  getUrlParams(queryName) {
    var reg = new RegExp("(^|&)" + queryName + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURI(r[2]);
    } else {
      return null;
    }
  }

  clearObj = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  }

  add0(m){
    return m<10?'0'+m:m
  }
  getNowDate(){
    var time = new Date();   // 程序计时的月从0开始取值后+1
    var m = time.getMonth() + 1;
    var t = time.getFullYear() + "-" + this.add0(m) + "-"
    + this.add0(time.getDate())+ " " + this.add0(time.getHours()) + ":"
    + this.add0(time.getMinutes()) + ":" + this.add0(time.getSeconds());
    return t
  }

  /*
  * 隐秘显示星号*：前后保留，中间显示星号
  * showText: 需要显示的文本
  * keepPrev：前面需要保留的位数
  * keepAfter：后面需要保留的位数
  * */
  secretShowStar(showText = '', keepPrev = 0, keepAfter = 0) {
    let res = showText + '';
    if (res.length === 0) {
      return '';
    }
    if (keepPrev - 0 + keepAfter >= res.length) {
      // 需要保留的位数小于了显示文本的总长度
      return showText;
    } else {
      // 需要保留的位数大于了显示文本的总长度，即将前后保留，中间显示星号
      let tempRes = '';
      tempRes += res.slice(0, keepPrev);
      tempRes += new Array(res.slice(keepPrev, res.length - keepAfter).length + 1).join('*');
      tempRes += res.slice(res.length - keepAfter);
      return tempRes;
    }
  }

  /**
   * 显示位数，前补位
   * @param str 需要前补位的字符串
   * @param digit 需要保留的位数
   * @param seat  补位占位符
   */
  showTheDigits(str = '', digit = 2, seat = '0') {
    if ((str + '').length >= digit) {
      return str;
    }
    while ((str + '').length < digit) {
      str = seat + '' + str;
    }
    return str;
  }

  _eval (fn) {
    var Fn = Function;
    return new Fn('return ' + fn)();
  }

  getClientType() {
    const clientTypeMap = {
      "user-center":"customers",
      "control":"BAM",
      "console":'applicationService',
      "applicationService":'applicationService',
    };

    let tempArray = window.location.href.split('/')
    if(tempArray.length > 3) {
      tempArray = tempArray[3];
      if(clientTypeMap[tempArray]) {
        return clientTypeMap[tempArray];
      } 
      console.log('client path is error, return empty')
      return 'applicationService';
    }
    console.log('client path is error, return empty')
    return 'applicationService';
  }

}

export const utils = new Utils();
