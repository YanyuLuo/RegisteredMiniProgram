// pages/lookmap/lookmap.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    controls: [{
      id: 1,
      iconPath: '/images/mapinfo/dingwei.png',
      position: {
        left: 10,
        top: 500 - 50,
        width: 40,
        height: 40
      },
      clickable: true
    }],
    circles: [],
    lat: 0,
    lng: 0,
    mapfirstlat: 0,
    mapfirstlng: 0,
    actId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mapCtx = wx.createMapContext('map102')
    //接收参数
    
    this.setData({
      actId: options.actId
    })
    
    var that = this;
    //设置地图初始位置
    wx.getLocation({
       
      success: function (res) {
        that.setData({
          mapfirstlat: res.latitude,
          mapfirstlng: res.longitude
        })
        
      },
    })
    

    //发起请求，标记点
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getmkbyid',
      data: {
        id: options.actId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          markers: res.data
        })
      },
      fail: function (res) {
        console.log(".....MarkerDataByID fail.....");
      }
    })
    //第二个请求
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getccbyid',
      data: {
        id: that.data.actId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          circles: res.data
        })
      },
      fail: function (res) {
        console.log(".....CircleDataById fail.....");
      }
    })

    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  nowLocation: function () {
    var that = this
    //console.log(this.data.markers[0].latitude)
    that.setData({
      lat: this.data.markers[0].latitude,
      lng: this.data.markers[0].longitude
    })
    
    wx.openLocation({
      latitude: this.data.lat,
      longitude: this.data.lng,
      name: '点击按钮进行导航'
    })
  },
  tocenter: function () {
    this.mapCtx.moveToLocation()
  },
  regionchange(e) {
    //console.log(e.type)
  },
  markertap(e) {
    //console.log(e.markerId)
  }

})