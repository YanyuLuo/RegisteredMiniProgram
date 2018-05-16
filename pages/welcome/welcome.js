// pages/welcome/welcome.js

const APP_ID = 'wxdb70cad8de4ed239';//输入小程序appid  
const APP_SECRET = '75d73d81347befa03e1c13bb4a5b6f4a';//输入小程序app_secret  
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key 

Page({
  data: {
    moveStartX: 0, //起始位置
    moveSendBtnLeft: 0, //发送按钮的left属性
    moveEndX: 0, //结束位置
    screenWidth: 0, //屏幕宽度
    moveable: true, //是否可滑动
    disabled: true,//验证码输入框是否可用,
    SendBtnColor: "#7f7f7f" ,//滑动按钮颜色
    logomiao:'../../images/welcome/logomiao.gif'
  },

  onLoad: function () {
    var that = this;
    // 获取屏幕宽度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenWidth: res.screenWidth
        })
      },
    })
  },
  
  //  开始移动
  moveSendBtnStart: function (e) {
    if (!this.data.moveable) {
      return;
    }
    //console.log("start");
   // console.log(e);
    this.setData({
      moveStartX: e.changedTouches["0"].clientX
    })
  },
  //移动发送按钮
  moveSendBtn: function (e) {
    if (!this.data.moveable) {
      return;
    }
    var that = this;
    // console.log(e.touches[0]);
    var left = ((e.touches[0].clientX - that.data.moveStartX) / (that.data.screenWidth / 750))
    //console.log(left)
    if (left <= 305.5) {
      this.setData({
        moveSendBtnLeft: left
      })
    } else {

      this.setData({
        moveSendBtnLeft: 305.5
      })
    }
  },
  // 结束移动
  moveSendBtnEnd: function (e) {
    
    var that = this;
    var left = ((e.changedTouches[0].clientX - that.data.moveStartX) / (that.data.screenWidth / 750))
    
    if (left < 305.5) {
      for (let i = left; i >= 0; i--) {

        that.setData({
          moveSendBtnLeft: i
        })
      }
    } else {
      
      that.setData({
        moveEndX: e.changedTouches[0].clientX,
        moveable: false,
        disabled: false,
        SendBtnColor: "#289adc"
      })
      
      this.getOpenIdTap();
    }
  },

  //结束移动后调用，获取openid并发送到后台校验
  getOpenIdTap: function () {
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          //获取openid接口  
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: APP_ID,
            secret: APP_SECRET,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: function (res) {
            //console.log(res.data)
            OPEN_ID = res.data.openid;//获取到的openid  
            SESSION_KEY = res.data.session_key;//获取到session_key  
            console.log(OPEN_ID)
            //把openid发到后台,loginCheck(OPEN_ID)
            that.loginCheck(OPEN_ID);
          }
        })
      }
    })
  }  ,

  //后台校验openid
  loginCheck: function (wxId){
    var that = this;
    wx.request({
      url: 'http://192.168.43.146:8080/digital/wxLoginNew',
      data: {
        wxId: wxId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if(res.data.length!=0){
          //说明用户已经注册，参数写入缓存，跳转即可
          
          wx.setStorage({
            key: 'userId',
            data: res.data[0].userId,
            success:function(res){
              console.log("存储成功："+res);
              that.toHome();
            }
          })
        }else{
          //说明还未注册，定向到注册界面
          wx.showModal({
            title: '提示',
            content: '您还未注册，现在前往注册界面吗？',
            success:function(res){
              if(res.confirm){
                that.toMyregister();
              }
            }
          })
          
        }
        //console.log(res.data.userName)
        //console.log(res.data)
        //that.setData({
         // aiai: res.data
        //})
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    })
  },

  toHome:function(){
    wx.switchTab({
      url: '../../pages/home/home',
      success:function(res){
        wx.showToast({
          title: '成功登录',
          icon:'success',
          duration:1500
        })
      }
    })
  },

  toMyregister:function(){
    wx.redirectTo({
      url: '../../pages/myregister/myregister?openid=' + OPEN_ID
    })
  }


})
