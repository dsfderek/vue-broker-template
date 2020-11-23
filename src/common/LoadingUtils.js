// import _ from 'lodash';
import {
  Loading
} from 'element-ui'

//loading对象
let loading;

// //防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
// 基础实现
function debounce(fn, delay = 500) {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, delay);
  }
}



//当前正在请求的数量
let needLoadingRequestCount = 0;

const LoadingUtils = {

  toHideLoading: debounce(() => {
    if (loading) {
      loading.close();
      loading = null;
    }
  }, 300),

  //显示loading
  showLoading: (target) => {
    // 后面这个判断很重要，因为关闭时加了抖动，此时loading对象可能还存在，
    // 但needLoadingRequestCount已经变成0.避免这种情况下会重新创建个loading
    if (needLoadingRequestCount === 0 && !loading) {
      loading = Loading.service({
        lock: true,
        text: "Loading...",
        background: 'rgba(0, 0, 0, 0.5)',
        // background: 'rgba(255, 255, 255, 0.5)',
        target: target || "#body-container" // content-wrap
      });
    }
    needLoadingRequestCount++;
  },

  //隐藏loading
  hideLoading: () => {
    needLoadingRequestCount--;
    needLoadingRequestCount = Math.max(needLoadingRequestCount, 0); //做个保护
    if (needLoadingRequestCount === 0) {
      //关闭loading
      LoadingUtils.toHideLoading();
    }
  }

}



export default LoadingUtils
