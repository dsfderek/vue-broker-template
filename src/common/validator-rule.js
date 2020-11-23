import Vue from "vue";
import {extend, ValidationProvider, localize} from "vee-validate";
import {required, confirmed} from "vee-validate/dist/rules";
import * as rules from "vee-validate/dist/rules";
import en from "vee-validate/dist/locale/en.json";

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});
localize("en", en);

// 邮箱:全模块统一，修改知会全体前后端
extend("email", value => {
  // let re = /^([a-zA-Z0-9]+[_|\-|\.]?)+@([a-zA-Z0-9]+[_|\-|\.]?)+([a-zA-Z0-9]{1,})+\.[a-zA-Z]{2,}$/;
  // let re = /^[a-zA-Z0-9_-|\.|\-]+@[a-zA-Z0-9_-|\.|\-]+(\.[a-zA-Z]+)+$/;
  let re = /^([a-zA-Z]|[0-9])(\w|\-|\.)+@(([a-zA-Z0-9]|\-|\.)*([a-zA-Z0-9]|\-))+\.[a-zA-Z]{2,}$/;
  if (!re.test(value)) {
    return "请输入正确的{_field_}";
  } else if (value.length > 50) {
    return "{_field_}不能超过50个字符";
  } else {
    return true;
  }
});
// 两次输入密码不一致
extend("confirmed", {
  ...confirmed,
  message: "两次密码输入不一致"
});
//输入框不为空
extend("required", {
  ...required,
  message: "请输入{_field_}"
});

// 复选框必选
extend("requiredChoiced", {
  ...required,
  message: "请勾选用户协议"
});
// 复选框必选(自定义的文案)
extend("requiredCheckbox", {
  ...required,
  message: "请确认勾选"
});
//下拉框不为空
extend("selected", {
  ...required,
  message: "请选择{_field_}"
});
//复选框不为空
extend("checked", {
  ...required,
  message: "请勾选{_field_}"
});

//数字和字母
extend("alpha_num", {
  ...required,
  message: "只能输入数字和字母"
});

//最大
extend("max", {
  validate(value, args) {
    return value.length <= args.length;
  },
  params: ["length"],
  message: "长度不能超过 {length} 个字符"
});

//上传文件不能为空
extend("file", {
  ...required,
  message: "请上传{_field_}"
});
// 字段最大字符，提示里面还有字段label，maxHasLabel:20
extend("maxHasLabel", {
  validate(value, args) {
    return value.length <= args.length;
  },
  params: ["length"],
  message: "{_field_}不能超过{length}个字符"
});

// 区间范围 只能输入区间的字母或数字
extend("section", {
  validate(value, args) {
    let temp = args.section.split("-");
    if (value.length >= temp[0] && value.length <= temp[1]) {
      return /^[0-9a-zA-Z]*$/g.test(value);
    }
    return false;
  },
  params: ["section"],
  message: "请输入{section}位数字或字母"
});

//3.自定义
extend("num", value => {
  let re = /^[0-9]+$/;
  if (re.test(value)) {
    return true;
  }
  return "只能输入数字";
});
//3.银行卡号纯数字
extend("cardNum", value => {
  let re = /^[a-zA-Z0-9]+$/;
  if (re.test(value)) {
    return true;
  }
  return "{_field_}格式不正确";
});
//大于1的正整数
extend("nums", value => {
  let re = /^\+?[1-9]\d*$/;
  if (re.test(value)) {
    return true;
  }
  return "只能输入大于0的正整数";
});
//数字和大写字母
extend("numbersCaps", value => {
  let re = /^[A-Z0-9]+$/;
  if (re.test(value)) {
    return true;
  }
  return "只能输入数字或者数字和大写字母";
});
//手机号
extend("mobile", value => {
  let re = /^1[3456789]\d{9}$/;
  if (re.test(value)) {
    return true;
  }
  return "请输入正确的手机号码";
});
//手机号2
extend("mobiles", value => {
  let re = /^1[3456789]\d{9}$/;
  if (re.test(value)) {
    return true;
  }
  return "请输入有效的手机号码";
});
//菜单编码,MENU+6位数字
extend("menuCode", value => {
  let re = /^MENU\d{6}$/;
  if (re.test(value)) {
    return true;
  }
  return "{_field_}格式错误";
});

//菜单顺序，仅1-8位正整数
extend("menuOrder", value => {
  let re = /^[1-9]\d{0,7}$/;
  if (re.test(value)) {
    return true;
  }
  return "{_field_}格式错误";
});

//连接地址:http://* | https://*
extend("httpUrl", value => {
  let re = /^(http|https):\/\/([\w.]+\/?)\S/;
  if (re.test(value)) {
    return true;
  }
  return "{_field_}格式错误";
});

//邮编：10位以内纯数字
extend("zipCode", value => {
  let re = /^[0-9]{0,}$/;
  if (re.test(value)) {
    return true;
  }
  return "{_field_}格式错误";
});
//账号不支持中文 只能以字母开头 长度为8-32个字符 至少包含英文字母、数字或特殊字符(-_)中的两种
extend("eNameNum", value => {
  //let re = /(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,12}/;
  // 以字母开头
  let regA = /^[a-zA-Z].*?$/;
  let regInclude = /^[_\-0-9a-zA-Z]{0,}$/;
  let regB = /^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z_\-][A-Za-z_\-0-9]{0,}$/;
  if (!regA.test(value)) {
    return "{_field_}必须以字母开头";
  } else if (!regInclude.test(value)) {
    return "{_field_}只能包含字母、数字、-、_";
  } else if (value.length < 8 || value.length > 32) {
    return "{_field_}长度必须在8-32位";
  } else if (!regB.test(value)) {
    return "{_field_}必须包含字母、数字、-、_的任意两种";
  } else {
    return true;
  }
});


//账号不支持中文 只能以字母开头 字母或者是数字组合
extend("eLetterNum", value => {
  let reg = /^[a-zA-Z][a-zA-Z0-9]*$/
  if (reg.test(value)) {
    return true;
  }
  return "请输入正确的{_field_}(由字母开头，数字组合)";
});


//由中文字符、英文字母、数字、中划线、下划线/.
extend("mixedInput", value => {
  let re = /^[\u4e00-\u9fa5_a-zA-Z0-9-_.]+$/;
  if (re.test(value)) {
    return true;
  }
  return "请输入正确的{_field_}(由中文字符、英文字母、数字、中划线、下划线和点组成)";
});

//不能以 =+-@开头
extend("start", value => {
  let re = /^[\+|\-|\=|\@].*$/;
  if (!re.test(value)) {
    return true;
  }
  return "{_field_}格式不正确";
});
//8-32位带大小写，数字，特殊字符任意两种
extend("checkPassword", value => {
  let re = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,32}$/; //请求大家不要覆盖我的代码了
  //let re = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,32}$/;
  if (re.test(value)) {
    return true
  }
  return "请输入8-32个字符,至少包含大小写字母、数字和特殊字符中的两种";
})

//中文
extend("notChinese", value => {
  let re = /^[^\u4e00-\u9fa5]+$/;
  if (re.test(value)) {
    return true;
  }
  return "不能包含中文";
});

//真实姓名/由中文字符、英文字母
extend("checkName", value => {
  let re = /^[\u4e00-\u9fa5_a-zA-Z ]+$/;
  if (re.test(value)) {
    return true;
  }
  return "请输入正确的{_field_}";
});
//身份证号码/15或18位，15位时全为数字，18位前17位为数字，最后一位可能为数字或字符X或x
extend("checkCard", value => {
  let re = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|[a-z]|[A-Z])$)/;
  if (re.test(value)) {
    return true;
  }
  return "请输入正确的{_field_}";
});
//企业名称 不能纯数字
extend("notNum", value => {
  let re = /^[0-9]+$/;
  if (!re.test(value)) {
    return true;
  }
  return "{_field_}格式不正确";
});

extend("inputError", value => {
  return "账号不存在！";
});

extend("registeredTransfinite", value => {
  return "已注册三次，无法继续注册！";
});
//企业名称 不能纯特殊字符
extend("notSpec", value => {
  let re1 = /^[A-Za-z]+$/;
  let re2 = /^[0-9]+$/;
  let re3 = /^[\u4e00-\u9fa5]+$/;
  let reSpc = /^[~！!@#$￥%\…\…&*()（）^_\-+《》|——\\<>?？/\[\]{};：,，.。·]+$/;
  if (reSpc.test(value)) {
    if (re1.test(value) && reSpc.test(value)) {
      return true;
    } else if (re2.test(value) && reSpc.test(value)) {
      return true;
    } else if (re3.test(value) && reSpc.test(value)) {
      return true;
    } else if (re1.test(value) && re2.test(value) && reSpc.test(value)) {
      return true;
    } else if (re1.test(value) && re3.test(value) && reSpc.test(value)) {
      return true;
    } else if (re2.test(value) && re3.test(value) && reSpc.test(value)) {
      return true;
    } else if (re1.test(value) && re2.test(value) && re3.test(value) && reSpc.test(value)) {
      return true;
    } else {
      return "{_field_}格式不正确";
    }
  } else {
    return true;
  }

});
// 只能输入数字和字母
extend("attrtNum", value => {
  let re = /^[a-zA-Z0-9]{1,100}$/;
  if (re.test(value)) {
    return true;
  }
  return "请输入正确的{_field_}(由数字、字母组成)";
});
// 联系电话  同时校验手机号和座机号
extend("telephone", value => {
  // let re = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/im;
  let re = /^[\(\)\s0-9-\+]{4,20}$/;
  if (re.test(value)) {
    return true;
  }
  return "请输入正确的联系电话";
  // return "请输入正确的{_field_}(手机或座机，如 130******** 或 010-********)";
});
// 金额 有效位数传参，默认2位
extend("money", {
  validate(value, args = [2, 0, 99999999.99]) {
    // args[0] 保留位数
    // args[1] 最小值
    // args[2] 最大值
    let digit = args[0] || 2;
    let minNum = args[1] || 0;
    let maxNum = args[2] || 99999999.99;
    if (isNaN(Number(value))) {
      return `请输入${minNum}~${maxNum}的数字`;
    }
    let re = new RegExp(`^(0|([1-9][0-9]*)|([0]\.[0-9]{1,2})|([1-9][0-9]*\.[0-9]{1,${digit}}))$`);
    if (digit == '0') {
      re = new RegExp(`^[1-9][0-9]*$`);
    }
    if (re.test(value)) {
      if (parseFloat(value) < minNum || parseFloat(value) > maxNum) {
        return `请输入${minNum}~${maxNum}的数字`;
      } else {
        return true;
      }
    } else {
      let valStr = value + '';
      if (valStr.indexOf('.') !== -1 && valStr.slice(valStr.indexOf('.') + 1).length > digit) {
        return `仅支持输入小数点后两位有效数字`;
      }
      return `请输入${minNum}~${maxNum}的数字`;
    }
  }
});
// 金额-充值自用
extend("rechargeMoney", {
  validate(value, args = [2, 0, 99999999.99]) {
    // args[0] 保留位数
    // args[1] 最小值
    // args[2] 最大值
    let digit = args[0] || 2;
    let minNum = args[1] || 0;
    let maxNum = args[2] || 99999999.99;
    if (isNaN(Number(value))) {
      return `请输入${minNum}~${maxNum}的数字`;
    }
    let re = new RegExp(`^(0|([1-9][0-9]*)|([0]\.[0-9]{1,2})|([1-9][0-9]*\.[0-9]{1,${digit}}))$`);
    if (digit == '0') {
      re = new RegExp(`^[1-9][0-9]*$`);
    }
    if (re.test(value)) {
      if (parseFloat(value) > maxNum) {
        return `单笔充值最大限额${maxNum}，超出请多次充值`;
      }else if(parseFloat(value) < minNum){
        return `请输入${minNum}~${maxNum}的数字`;
      } else {
        return true;
      }
    } else {
      let valStr = value + '';
      if (valStr.indexOf('.') !== -1 && valStr.slice(valStr.indexOf('.') + 1).length > digit) {
        return `仅支持输入小数点后两位有效数字`;
      }
      return `请输入${minNum}~${maxNum}的数字`;
    }
  }
});
// 最大数字
extend("maxNum", {
  validate(value = 0, args = 0) {
    if (!value || isNaN(value)) {
      return "{_field_}格式不正确";
    }
    if (parseFloat(value) > parseFloat(args)) {
      return `{_field_}不能超过${args}`;
    }
    return true;
  },
});
// 最小数字
extend("minNum", {
  validate(value = 0, args = 0) {
    if (!value || isNaN(value)) {
      return "{_field_}格式不正确";
    }
    if (parseFloat(value) < parseFloat(args)) {
      return `{_field_}不能低于${args}`;
    }
    return true;
  },
});
//下拨金额判断
extend("grantAmount", {
  validate(value, args) {
    if (Number(args.value) <= 0) {
      return "当前无可下拨金额"
    }
    return true;
  },
  params: ["value"],
});
//支行名称：仅支持中文
extend("subBankName", value => {
  let re = /^[\u4e00-\u9fa5]+$/;
  if (re.test(value)) {
    return true;
  }
  return "请输入正确{_field_}";
});
Vue.component("ValidationProvider", ValidationProvider);

