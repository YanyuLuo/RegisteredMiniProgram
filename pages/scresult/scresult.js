// pages/scresult/scresult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:'',
    plist:[],
    count:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      info: options.condi
    })

    var that = this;
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getsearch',
      data: {
        condi: options.condi
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        
        that.setData({
          plist: res.data,
          count: res.data.length
        })
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    })


  },

  seeDetail: function (e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    var path = "../../pages/actdetinfo/actdetinfo?actId=" + that.data.plist[index].actId;
    wx.navigateTo({
      url: path
    });
  }
  
})