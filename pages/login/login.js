// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:true,
    btnstate:"default",
    account:"",
    password:"",
    flag:true,
    pwiconsrc:"/images/nosee.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  accountInput:function(e){
    var content = e.detail.value;
    console.log(content);
    if(content != ''){
      this.setData({ disabled: false,btnstate:"primary",account:content});
    }else{
      this.setData({disabled:true,btnstate:"default"});
    }
  },
  pwdBlur:function(e){
    var pw = e.detail.value;
    if(pw != ''){
      this.setData({password:pw});
    }
    
  },
  login:function(){
    wx.showModal({
      title: '提示',
      content: '这是一个模拟弹窗，提示登录是否成功',
      success:function(res){
        if(res.confirm){
          console.log('用户单击确定')
        }
      }
    })
  },
  tapName:function(e){
    //console.log(this)
    if(this.data.flag==true){
      this.setData({ flag: false, pwiconsrc: "/images/see.png"});
    }
    else if (this.data.flag == false){
      this.setData({ flag: true, pwiconsrc: "/images/nosee.png" });
    }
  }
})