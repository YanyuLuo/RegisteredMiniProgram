// pages/myinfodetail/myinfodetail.js
var userId = null

Page({

  data: {
    subBtnType:'default',
    subBtnDis:true,
    plist:[
      {
        userName:'测试',
        userType:'学生',
        userTypeId:'2014444555666',
        userUnit:'经济管理学院',
        userClass:'14信管2班',
        userEmail:'v252@163.com',
        userPhone:'17800002654',
        pubPermission:'1',
        fingerPrint:'1'
      }
    ]
  },

  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        userId = res.data;
        //
        wx.request({
          url: 'http://192.168.43.146:8080/digital/getwxuserinfo',
          data: {
            userId:res.data
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' 
          },
          success: function (res) {
            that.setData({
              plist: res.data
            })
          },
          fail: function (res) {
            console.log(".....getWxUserInfoFail.....");
          }
        })
        //
      },
    })
    
  },
  
  
  formSubmit: function (e) {
    console.log('submit事件：' + e.detail.value)
    console.log(e.detail.value)
    var flag = 1;
    var that = this;
    if (e.detail.value.inputUserName==''){
      flag = 0;
    }
    if (e.detail.value.inputUserType == '') {
      flag = 0;
    }
    if (e.detail.value.inputUserTypeId == '') {
      flag = 0;
    }
    if (e.detail.value.inputUserUnit == '') {
      flag = 0;
    }
    if (e.detail.value.inputUserClass == '') {
      flag = 0;
    }
    if (e.detail.value.inputUserEmail == '') {
      flag = 0;
    }
    if(flag==1){
      //
      wx.request({
        url: 'http://192.168.43.146:8080/digital/subwxuserinfoupdate',
        data: {
          userId:userId,
          userName: e.detail.value.inputUserName,
          userType: e.detail.value.inputUserType,
          userTypeId: e.detail.value.inputUserTypeId,
          userUnit: e.detail.value.inputUserUnit,
          userClass: e.detail.value.inputUserClass,
          userEmail: e.detail.value.inputUserEmail
          
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data) {
            wx.showModal({
              title: '提示',
              content: '信息已成功更新！',
              success:function(res){
                that.setData({
                  subBtnType: 'default',
                  subBtnDis: true
                })
              }
            })
          }
        },
        fail: function (res) {
          console.log(".....UpdateInfoFail.....");
        }
      })
    //
    }else{
      wx.showModal({
        title: '提示',
        content: '修改完善的所有信息中不能有空值！',
      })
    }
    
  },
  editinfo:function(){
    this.setData({
      subBtnType: 'primary',
      subBtnDis: false
    })
  },
  onPullDownRefresh: function (){
    var that = this;
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getwxuserinfo',
      data: {
        userId: userId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          plist: res.data,
          subBtnType: 'default',
          subBtnDis: true
        })
      },
      fail: function (res) {
        console.log(".....getWxUserInfoFail.....");
      }
    })
  }
  
})