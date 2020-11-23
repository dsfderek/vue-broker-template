import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { websocketWebUrl } from "@common/url-conf";


import { utils } from '@/utils/utils'

let JSESSIONID = utils.getUrlParams('JSESSIONID') || utils.getCookie("JSESSIONID");

// console.log("JSESSIONID", JSESSIONID);

var stompClient = null;

//强制关闭浏览器  调用websocket.close（）,进行正常关闭
window.onunload = function () {
  websocket.disconnect()
}
let number = 1;
const websocket = {
  websocketReconnect: (userCode, callback) => {
    let url = `${websocketWebUrl}/ws/endpoint?token=${JSESSIONID}`; //连接地址
    // 建立连接对象（还未发起连接）
    let socket = new SockJS(url);
    // 获取 STOMP 子协议的客户端对象
    stompClient = Stomp.over(socket);
    // 向服务器发起websocket连接并发送CONNECT帧
    stompClient.connect(
      {}, //可添加客户端的认证信息
      function connectCallback () {

        //连接成功的回调函数
        //订阅频道
        // stompClient.subscribe("/topic/getResponse", function (data) {
        //   if (data) {
        //     // console.log("subscribe data", data);
        //   }
        // });
        // console.log("订阅消息");
        stompClient.subscribe(
          "/user/" + userCode + "/queue/getResponse",
          callback
        );
        stompClient.heartbeat.outgoing = 20000; //若使用STOMP 1.1 版本，默认开启了心跳检测机制（默认值都是10000ms）
        stompClient.heartbeat.incoming = 0; //客户端不从服务端接收心跳包
      },
      function errorCallBack (error) {
        //连接失败时再次调用函数
        number += 1;
        if (number <= 10) {
          websocket.websocketReconnect();
        } else {
          websocket.disconnect()
        }
        console.log("error", error);
      }
    )
  },
  //关闭双通道
  disconnect: () => {
    if (stompClient != null) {
      stompClient.disconnect();
    }
    console.log("Disconnected");
  }

}


export default websocket
