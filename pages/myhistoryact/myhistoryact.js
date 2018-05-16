// pages/myhistoryact/myhistoryact.js
var userId = null;

Page({
  data: {
    plist: [],
    flag: false,
    count: 0
  },

  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        userId = res.data;
        wx.request({
          url: 'http://192.168.43.146:8080/digital/getwxhistoryact',
          data: {
            userId: userId
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
            console.log("....getwxhistoryactfail.....");
          }
        })
      },
    })


  },

  onPullDownRefresh: function () {
    var that = this;
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getwxhistoryact',
      data: {
        userId: userId
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
        console.log(".....getwxhistoryactfail.....");
      }
    })
  },

  onReachBottom: function () {
    var that = this;
    that.setData({
      flag: true
    });
  },

  seeDetail: function (e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    var path = "../../pages/actdetinfo/actdetinfo?actId=" + that.data.plist[index].actId;
    wx.navigateTo({
      url: path
    });
  },


})