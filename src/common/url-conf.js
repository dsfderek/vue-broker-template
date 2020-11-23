let baseUrl = "/broker";
let onlineServiceUrl='http://121.36.72.118'; // 智齿客服地址
let onlineServiceStr='b40389185a1648b6aace261c1861585b'; // 智齿客服字符串
let msgUrl = "/broker-message-manage";
let userUrl = "/broker-auth-service";
let protoUrl = "/broker-protocol-service";
let clientUrl = "/broker-customer-client";
let bamUrl = "/broker-bam-service";
let productUrl = "/broker-product-service";
let orderUrl = "/broker-order-manage";
let contractUrl = "/broker-contract-service";
let financeUrl = "/broker-finance-service";
let portalUrl = '/broker-portal-service';
let paymentUrl = "/broker-payment-service";
let consoleUrl = "/broker-custconsole-service";
let marketplaceUrl = "/broker-marketplace-service";
let crmUrl = "/broker-crm-service";
let statisticsUrl = "/statistics";
let localpurchaseUrl = "/broker-localpurchase-service"; // ecs 订购
let hostURL = "http://clientui-dev.newtest.huaxiacloud.com";
let workerOrderUrl = "http://workorderui-dev.newtest.huaxiacloud.com/order/manager/mine";
let workerOrderServiceUrl = "/broker-workorder-service";
let PORTAL_URL = 'http://portal-ui-dev.newtest.huaxiacloud.com';
let MARKET_URL = 'http://marketui-dev.newtest.huaxiacloud.com'; //云市场门户
let verificationCode = 'http://devbrokercas.newtest.huaxiacloud.com/cas/verifycode?math=';
let TIME_COUNT = 120;

let casUrl = "http://devbrokercas.newtest.huaxiacloud.com"; // 获取验证码地址
let casLoginUrl = "http://devbrokerzuul.newtest.huaxiacloud.com"; // 登陆地址
let websocketWebUrl = "http://devbrokergateway.newtest.huaxiacloud.com";

if (window.location.hostname == "clientui-dev.newtest.huaxiacloud.com") {
  // 开发环境地址
  casLoginUrl = "http://devbrokerzuul.newtest.huaxiacloud.com";
  casUrl = "http://devbrokercas.newtest.huaxiacloud.com";
  hostURL = "http://clientui-dev.newtest.huaxiacloud.com";
  workerOrderUrl = "http://workorderui-dev.newtest.huaxiacloud.com/order/manager/mine";
  PORTAL_URL = 'http://portal-ui-dev.newtest.huaxiacloud.com';
  MARKET_URL = 'http://marketui-dev.newtest.huaxiacloud.com';
  verificationCode = 'http://devbrokercas.newtest.huaxiacloud.com/cas/verifycode?math=';
  websocketWebUrl = "http://devbrokergateway.newtest.huaxiacloud.com";
  onlineServiceStr = 'b40389185a1648b6aace261c1861585b';
} else if (window.location.hostname == "clientui-test.newtest.huaxiacloud.com"
) {
  // 测试环境地址
  casLoginUrl = "http://testzuul.newtest.huaxiacloud.com";
  hostURL = "http://clientui-test.newtest.huaxiacloud.com";
  casUrl = "http://testcas.newtest.huaxiacloud.com";
  workerOrderUrl = "http://workorderui-test.newtest.huaxiacloud.com/order/manager/mine";
  PORTAL_URL = 'http://portal-ui-test.newtest.huaxiacloud.com';
  MARKET_URL = 'http://marketui-test.newtest.huaxiacloud.com';
  verificationCode = 'http://testcas.newtest.huaxiacloud.com/cas/verifycode?math=';
  websocketWebUrl = "http://testbrokergateway.newtest.huaxiacloud.com";
  onlineServiceStr = 'b40389185a1648b6aace261c1861585b';
} else if (
  window.location.hostname == "clientui-patch.newtest.huaxiacloud.com"
) {
  // 补丁测试环境地址
  casLoginUrl = "https://patchbrokerzuul.newtest.huaxiacloud.com";
  hostURL = "https://clientui-patch.newtest.huaxiacloud.com";
  casUrl = "https://patchbrokercas.newtest.huaxiacloud.com";
  workerOrderUrl = "https://workorderui-patch.newtest.huaxiacloud.com/order/manager/mine";
  PORTAL_URL = 'https://portalui-patch.newtest.huaxiacloud.com';
  MARKET_URL = 'https://marketui-patch.newtest.huaxiacloud.com';
  verificationCode = 'https://patchbrokercas.newtest.huaxiacloud.com/cas/verifycode?math=';
  websocketWebUrl = "https://patchbrokergateway.newtest.huaxiacloud.com";
  onlineServiceStr = 'b40389185a1648b6aace261c1861585b';
} else if (
  window.location.hostname == "console.huaxiacloud.com"
) {
  // 生产环境地址
  casLoginUrl = "https://apigateway.huaxiacloud.com";
  hostURL = "https://console.huaxiacloud.com";
  casUrl = "https://login.huaxiacloud.com";
  workerOrderUrl = "https://brokerworkorderui.huaxiacloud.com/order/manager/mine";
  PORTAL_URL = 'https://huaxiacloud.com';
  MARKET_URL = 'https://marketplace.huaxiacloud.com'; //todo  等尹创给了生产地址替换
  verificationCode = 'https://login.huaxiacloud.com/cas/verifycode?math=';
  websocketWebUrl = "https://wsgateway.huaxiacloud.com";
  onlineServiceStr = 'cc9c1e99a63843bb9c583cdf5c099d54';
  onlineServiceUrl='http://121.36.39.118'; // 智齿客服地址
}
export {
  baseUrl,
  onlineServiceUrl,
  onlineServiceStr,
  msgUrl,
  clientUrl,
  protoUrl,
  userUrl,
  casLoginUrl,
  casUrl,
  bamUrl,
  productUrl,
  orderUrl,
  financeUrl,
  portalUrl,
  hostURL,
  contractUrl,
  statisticsUrl,
  paymentUrl,
  consoleUrl,
  marketplaceUrl,
  TIME_COUNT,
  workerOrderUrl,
  workerOrderServiceUrl,
  PORTAL_URL,
  MARKET_URL,
  verificationCode,
  websocketWebUrl,
  localpurchaseUrl,
  crmUrl
};
