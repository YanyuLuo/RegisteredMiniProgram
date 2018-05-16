// pages/mypubinfo/mypubinfo.js
Page({

  data: {
    info: '',
    plist: [],
    count: 0,
    userId:'',
  },

  
  onLoad: function (options) {
    var that = this;
    
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        that.setData({
          userId:res.data
        })
        wx.request({
          url: 'http://192.168.43.146:8080/digital/getinfobypubid',
          data: {
            userId: res.data
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
            console.log(".....getInfoByPubIdfail.....");
          }
        })
      },
    })

    
  },

  onPullDownRefresh: function () {
    var that = this
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getinfobypubid',
      data: {
        userId: res.data
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
        console.log(".....getinfobypubidRefreshfail.....");
      }
    })
  },

  newone:function(){
    wx.navigateTo({
      url: '../../pages/pubact/pubact',
    })
  },

  //长按事件
  seeDetail: function (e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    var path = "../../pages/actdetinfo/actdetinfo?actId=" + that.data.plist[index].actId;
    wx.navigateTo({
      url: path
    });
  },
  
  //点击事件
  seeName: function (e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    var path = "../../pages/mypubinfodetail/mypubinfodetail?actId=" + that.data.plist[index].actId;
    wx.navigateTo({
      url: path
    });
  },

  
  
})