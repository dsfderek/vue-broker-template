import {baseUrl, msgUrl,userUrl,clientUrl} from '@/common/url-conf';
import { get, post } from '@/common/axios';

export const mainApi = {
  mainQueryUserInfo: p => post(clientUrl+'/customer/information/findCustomerByHeader'),
  customerQueryList: (p) => post('/broker-hwcloud-manage/api/hwCustomerQuery/customerQueryList',{
    "appKey":"EW89G9HMK22SDT8S4OGK",
    "appSecrect":"qCSorv0hMHofxz4YAECZDfcMoGHhuTTrd5XyLSso",
    "indirectPartnerId": "05cf4cee390010de0f46c01ca2e16720",
    "limit":100,
    "offset":0
  }),
  msgQueryTMsgAppManageEntityList: (p) => post('/broker-message-manage/msg/tmsgtaskmanage/getMsgTaskList',p),
  mainGetInfo: p => post(baseUrl + '/api/user/addFormId', p),
  mainGetDict: (service, code, data) => post(`${service || msgUrl}/dict/findByCode?dictCode=${code}`, data),
  // 获取重复提交token
  mainGetNotRepeatToken: (p, service) => get(`${service || msgUrl}/notRepeat/getNotRepeatToken`, p),


  //修改密码
  //----张豆豆start----
  //更新密码
  updatePassWord: p => post( `${clientUrl}/customer/information/updatePassword`, p),
  //邮箱发送验证码
  clientSendCode: p => post(`${clientUrl}/customer/information/sendMailSecurityCode`, p),
  //手机短信发送验证码
  clientTelMsgCode: p => post(`${clientUrl}/customer/information/sendPhoneSecurityCode`, p),
  // 验证码校验
  clientVerifiyCode:  p => post(`${clientUrl}/customer/information/customerAuthentication`, p),
  //----张豆豆end------

  //----潘越start----
  //获取顶部菜单
  userTopMenu: () => post(`${userUrl}/resource/getUserResource/0/test/root`),
  //获取菜单数据
  getLeftMenuData: (p) => post(`${userUrl}/resource/queryCustomerSideMenuList?subSystemCode=${p}`),
  //----潘越end------
};
