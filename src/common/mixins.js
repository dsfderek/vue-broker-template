import {mainApi} from "@main/services";
import {pageParams} from "@common/constant";
import {utils} from "@utils/utils"

// 表格空白页面混入，集成功能：分页/过滤/查询/重置/排序
const blankPage = {
  data() {
    return {
      // 是否对数据进行缓存，以确保详情页回来的时候保留状态参数
      holdTableFilterFlag: false,
      // 日期范围数据对象
      filterDate: {},
      // 筛选参数，此处只是预留，需要在自己的业务页面进行处理
      filterParams: {},
      // 分页参数
      pageParams: JSON.parse(JSON.stringify(pageParams)),
      // 排序参数
      sortParams: {
        sort: "",
        order: ""
      },
      // 其他业务参数，此处只是预留，需要在自己的业务页面进行处理
      otherParams: {},
      table: {
        header: [],
        data: [],
        loading: true
      }
    };
  },
  beforeRouteLeave (to, from, next) {
    if(this.holdTableFilterFlag){
      this.mixSetTableFilter(to, from, next);
    }else{
      next();
    }
  },
  created() {
    if(this.holdTableFilterFlag){
      this.mixGetTableFilter();
    }
  },
  methods: {
    mixSetTableFilter(to, from, next) {
      let storageData = {
        path: from.path,
        filterParams: this.filterParams,
        pageParams: this.pageParams,
        sortParams: this.sortParams,
        otherParams: this.otherParams,
        filterDate: this.filterDate,
      };
      sessionStorage.setItem('table-filter', JSON.stringify(storageData));
      next();
    },
    mixGetTableFilter() {
      let filter = sessionStorage.getItem('table-filter');
      if(filter){
        filter = JSON.parse(filter);
      }
      if(filter && this.$route.path === filter.path){
        this.filterParams = filter.filterParams;
        this.pageParams = filter.pageParams;
        this.sortParams = filter.sortParams;
        this.otherParams = filter.otherParams;
        if(filter.filterDate) {
          this.filterDate = filter.filterDate;
        }
        sessionStorage.removeItem('table-filter');
      }
    },
    searchDataMixins(fn, page) {
      if (page) {
        page.pageNum = 1
      } else {
        this.pageParams.pageNum = 1
      }
      fn();
    },
    // 重置参数
    resetParams() {
      this.initPageParams();
      this.getTableListData();
    },
    // 获取请求参数
    groupParams(dataArr = ["filterParams", "pageParams", "sortParams", "otherParams"]) {
      let params = {};
      dataArr.forEach((key) => {
        if (this[key].pageSizes) {
          // 分页参数
          Object.assign(params, {
            pageConfig: {
              pageSize: this[key].pageSize,
              pageNum: this[key].pageNum,
            }
          });
        } else {
          Object.assign(params, this[key]);
        }
      });
      // 前后端一致性沟通后，后端确保null和空字符串相同
      // for (let key in params) {
      //   params[key] = params[key] === "" ? null : params[key];
      // }
      return params;
    },
    // 初始化页面
    initPageData() {
      this.initPageParams();
    },
    // 初始化页面参数
    initPageParams(dataArr = ["filterParams", "pageParams", "sortParams", "filterDate"]) {
      dataArr.forEach(dataKey => {
        if (dataKey === "pageParams") {
          this["pageParams"].pageNum = 1;
        } else {
          Object.keys(this[dataKey]).forEach(key => {
            this[dataKey][key] = "";
          });
        }
      });
    },
    // 每页条数改变事件
    handleSizeChange(size, pageConstant = 'pageParams', getFn = 'getTableListData') {
      this[pageConstant].pageNum = 1;
      this[pageConstant].pageSize = size;
      // 获取数据
      this[getFn]();
    },
    // 当前页改变事件
    handleCurrentPageChange(page, pageConstant = 'pageParams', getFn = 'getTableListData') {
      this[pageConstant].pageNum = page;
      // 获取数据
      this[getFn]();
    },
    // 排序改变事件
    sortChange({column, prop, order}) {
      // order=descending 降序 DESC
      // order=ascending 升序 DESC
      if (order) {
        this.sortParams.sort = prop;
        this.sortParams.order = order === "descending" ? "DESC" : "ASC";
      } else {
        this.sortParams.sort = "";
        this.sortParams.order = "";
      }
      this.getTableListData();
    },
    // 获取列表数据，此处只是预留，需要在自己的业务页面进行处理
    getTableListData() {
      console.log("请求参数:", this.groupParams());
      console.log("请在业务页面自行编写业务逻辑");
    }
  }
};
// 货币转千位
const unitFormatMix = {
  methods: {
    unitFormat(num = 0, precision = 2, separator = ',') {
      return utils.formatNumber(num, precision, separator);
    }
  }
};
// 货币转千位，返回Dom
const unitFormatDomMix = {
  methods: {
    /**
     * @param num 转换的数字
     * @param precision 保留有效小数位数
     * @param separator 千分位间隔字符
     * @param unit  输出单位
     * @param preClass  整数区的class
     * @param afterClass  小数区的class
     * @param preStyle  整数区的样式
     * @param afterStyle  小数区的样式
     * @returns {string}  返回dom
     */
    unitFormatDom({num = 0, precision = 2, separator = ',', unit = '￥', preClass = '', afterClass = '', preStyle = '', afterStyle = ''}) {
      let val = utils.formatNumber(num, precision, separator) + '';
      let preVal = val.slice(0, val.indexOf('.'));
      let afterVal = val.slice(val.indexOf('.'));
      if (precision !== 0) {
        return `<span class="${preClass}" style="${preStyle}">${unit || ''}${preVal}<span class="${afterClass}" style="${afterStyle}">${afterVal}</span></span>`
      } else {
        return `<span class="${preClass}" style="${preStyle}">${unit || ''}${val}</span>`;
      }
    }
  }
};
// 中间显示星号
const secretStarMix = {
  methods: {
    secretShowStar(showText = '', keepPrev = 0, keepAfter = 0) {
      return utils.secretShowStar(showText, keepPrev, keepAfter);
    }
  }
};
// 页面loading遮罩方法
const pageLoading = {
  data() {
    return {
      fullLoading: null
    };
  },
  methods: {
    showFullLoading(loadingText = "Loading") {
      if (this.fullLoading) {
        return;
      }
      this.fullLoading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    closeFullLoading() {
      if (this.fullLoading) {
        this.fullLoading.close();
        this.fullLoading = null;
      }
    }
  }
};
// 数据字典请求和解析并返回
const dictData = {
  methods: {
    queryDictListByCode(service, code) {
      return new Promise((resolve, reject) => {
        mainApi
          .mainGetDict(service, code)
          .then(res => {
            if (res && res.result) {
              let tmpObj = res.obj || [];
              let tempList = [];
              let tempMap = {};
              tmpObj.forEach((o, index) => {
                tempList.push({
                  label: o.dictLable,
                  value: o.dictValue
                });
                tempMap[o.dictValue] = o.dictLable;
              });
              resolve({
                list: tempList,
                map: tempMap
              });
            } else {
              resolve(null);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};
export {
  blankPage,
  unitFormatMix,
  unitFormatDomMix,
  secretStarMix,
  pageLoading,
  dictData,
};
