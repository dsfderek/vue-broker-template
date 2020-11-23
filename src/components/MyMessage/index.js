import Vue from 'vue';
import myMessage from './MyMessage';

const MyMessageBox = Vue.extend(myMessage);

MyMessageBox.install = (options) => {
  if (!options) {
    return null;
  }

  if(document.querySelector('.my-message-box-outer')){
    return null;
  }
  const instance = new MyMessageBox({
    data: options
  }).$mount();

  document.body.appendChild(instance.$el);

  Vue.nextTick(() => {
    instance.visible = true;
  });
  return instance;
};

// 导出组件
export default MyMessageBox;
