// pages/pubact/pubact.js
var userId=null

Page({

  data: {
    startDate:'2018-04-27',
    startTime:'15:48',
    endDate: '2018-04-27',
    endTime:'20:09',
    lat:'',
    lng:''
  },

  onLoad: function (options) {
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        userId = res.data
      },
    })
  },

 bindStartDateChange:function(e){
   this.setData({
     startDate:e.detail.value
   })
 },
 bindStartTimeChange: function (e) {
   this.setData({
     startTime: e.detail.value
   })
 },
 bindEndDateChange: function (e) {
   this.setData({
     endDate: e.detail.value
   })
 },
 bindEndTimeChange: function (e) {
   this.setData({
     endTime: e.detail.value
   })
 },
 formSubmit:function(e){
   console.log('submit事件：'+e.detail.value)
   console.log(e.detail.value)
   var sdt = e.detail.value.sdate +' '+e.detail.value.stime
   var edt = e.detail.value.edate+' '+e.detail.value.etime
   var that = this;
   
   wx.request({
     url: 'http://192.168.43.146:8080/digital/insertAct',
     data: {
      actName:e.detail.value.inputname,
      actStartTime:sdt,
      actEndTime:edt,
      actLat: e.detail.value.inputlat,
      actLng: e.detail.value.inputlng,
      actRad: e.detail.value.inputrad,
      actLocation: e.detail.value.inputplace,
      actContent: e.detail.value.textarea,
      actTheme: e.detail.value.inputtheme,
      actSubId:userId

     },
     method: 'POST',
     header: {
       'content-type': 'application/json' // 默认值
     },
     success: function (res) {
       if(res.data){
         wx.showModal({
           title: '提示',
           content: '活动已成功提交，请等待审核',
           success:function(res){
            wx.switchTab({
              url: '../../pages/home/home',
            })
           }
         })
       }
     },
     fail: function (res) {
       console.log(".....insertActfail.....");
     }
   })
   
 },
 formReset:function(){
   console.log('reset事件')
 },
 xuandian:function(){
   var that = this
  wx.chooseLocation({
    success: function(res) {
      console.log("点击了看图")
      that.setData({
        lat:res.latitude,
        lng:res.longitude
      })
    },
  })
 }

  
})