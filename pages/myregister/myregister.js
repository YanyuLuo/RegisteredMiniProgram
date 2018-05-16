// pages/myregister/myregister.jsj
var app = getApp()
// var step = 1 // 当前操作的step  
var maxTime = 10
var currentTime = maxTime //倒计时的事件（单位：s）  
var interval = null
var hintMsg = null // 提示  

var check = require("../../utils/check.js")
var webUtils = require("../../utils/registerWebUtil.js")
var step_g = 1

var phoneNum = null, identifyCode = null, password = null, rePassword = null;
//identifyCode为用户输入的验证码
var myopenid = null;
var ispasscheck=false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:true,
    btnstate:'default',
    step: step_g,
    time: currentTime,
    openid:'',
    checkCode:'',//从服务器得到的验证码
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    step_g = 1
    this.setData({
      //设置openid参数
      openid: options.openid
    })
    myopenid = options.openid;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    currentTime = maxTime
    if (interval != null) {
      clearInterval(interval)
    }
  },

  /**
   * 验证码获取点击事件
   */
  sendCheckCode: function () {
    var that = this
    if (step_g == 1) {
      if (firstStep()) {
        step_g = 2
        interval = setInterval(function () {
          currentTime--;
          that.setData({
            time: currentTime
          })
          
          if (currentTime <= 0) {
            clearInterval(interval)
            currentTime = -1
          }
        }, 1000)
        console.log(interval+' time')

        //差一句调用wx中的网络请求的API，完成电话号码的提交submitPhoneNum(phoneNum)
        
        wx.request({
          url: 'http://192.168.43.146:8080/digital/smsDealTest',
          data: {
            phone: phoneNum
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          //设计是传过来验证码字符串
          success: function (res) {
            that.setData({
              checkCode:res.data
            })
            console.log("成功请求验证码")
            console.log(that.data.checkCode)
          },
          fail: function (res) {
            console.log(".....CheckCodefail.....");
          }
        })
        //
      }
    }else if(step_g==2){
      if (currentTime < 0) {
        var that = this
        currentTime = maxTime
        interval = setInterval(function () {
          currentTime--
          that.setData({
            time: currentTime
          })

          if (currentTime <= 0) {
            currentTime = -1
            clearInterval(interval)
          }
        }, 1000)
        console.log(interval + ' time2')
      }

    }
  },

  /**
  * 注册按钮点击事件
  */
  firstLogin: function () {
    //进行验证码提交认证
    //this.secondStep()
    //
    var that = this
    if (identifyCode == this.data.checkCode) {
      //验证码通过，拿手机号，openid注册
      wx.request({
        url: 'http://192.168.43.146:8080/digital/insertuser',
        data: {
          userPhone: phoneNum,
          wxId: myopenid
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("执行插入后：" + res.data)
          ispasscheck = res.data
          console.log(ispasscheck)
          //
          if (ispasscheck) {
            clearInterval(interval)
            wx.showModal({
              title: '提示',
              content: '注册成功，是否现在登录？',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户单击确定')
                  wx.navigateTo({
                    url: '../../pages/welcome/welcome'
                  })
                }
              }
            })

          } else {
            console.log("未完成注册")
          }
          //
        },
        fail: function (res) {
          console.log(".....CheckCodefail.....");
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '验证码错误！',
      })
      return false;
    }
    

    
  },

  input_phoneNum: function (e) {
    phoneNum = e.detail.value
  },
  

  /**
   * 验证码不为空使得按钮可用
   */
  accountInput: function (e) {
    identifyCode = e.detail.value
    var content = e.detail.value;
    console.log(content);
    if (content != '') {
      this.setData({ disabled: false, btnstate: "primary", account: content });
    } else {
      this.setData({ disabled: true, btnstate: "default" });
    }
  },
  
  /*
  secondStep:function(){
    var that = this
    if (identifyCode == this.data.checkCode){
      //验证码通过，拿手机号，openid注册
      wx.request({
        url: 'http://192.168.43.146:8080/digital/insertuser',
        data: {
          userPhone: phoneNum,
          wxId: myopenid
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("执行插入后："+res.data)
          ispasscheck=res.data
          console.log(ispasscheck)
        },
        fail: function (res) {
          console.log(".....CheckCodefail.....");
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '验证码错误！',
      })
      return false;
    }
  }
  */

})
function firstStep() { // 提交电话号码，获取［验证码］  
  if (!check.checkPhoneNum(phoneNum)) {
    hintMsg = "请输入正确的电话号码!"
    return false
  }

  if (webUtils.submitPhoneNum(phoneNum)) {
    hintMsg = null
    return true
  }
  hintMsg = "提交错误，请稍后重试!"
  return false
}

/*
function secondStep() { // 提交［验证码］  
  if (!check.checkIsNotNull(identifyCode)) {
    hintMsg = "请输入验证码!"
    return false
  }

  if (webUtils.submitIdentifyCode(identifyCode)) {
    hintMsg = null
    return true
  }
  hintMsg = "提交错误，请稍后重试!"
  return false
}
*/
