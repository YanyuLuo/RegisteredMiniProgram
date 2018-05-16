// pages/mapinfo/mapinfo.js
Page({
  data: {
    markers: [],
    controls: [{
      id: 1,
      iconPath: '/images/mapinfo/dingwei.png',
      position: {
        left: 10,
        top: 300 - 50,
        width: 40,
        height: 40
      },
      clickable: true
    }],
    circles:[{
      latitude: 30.269550,
      longitude: 120.183600,
      radius:100,
      color: '#6fa8dc',
      strokeWidth:2,
      fillColor:'#73BAC06A'
    }, {
      latitude: 30.295550,
      longitude: 120.183600,
      radius: 1000,
      color: '#6fa8dc',
      strokeWidth: 2,
      fillColor: '#73BAC06A'
    }
    ],
    lat:0,
    lng:0,
    mapfirstlat:0,
    mapfirstlng:0,
    actId:0
  },

  onLoad:function(){
    this.mapCtx = wx.createMapContext('map101')
    var that = this;
   
    wx.getLocation({
      type: 'gcj02', 
      success: function (res) {
        that.setData({
          mapfirstlat: res.latitude,
          mapfirstlng: res.longitude
        })
      },
    })

    //发起第一个请求，写死Markers
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getmkdata',
      data: {
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
        console.log(".....MarkerData fail.....");
      }
    })
    //发起第二个请求，写死Circles
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getccdata',
      data: {
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
        console.log(".....CircleData fail.....");
      }
    })


  },

  onPullDownRefresh(){
    var that = this;
    //发起第一个请求，写死Markers
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getmkdata',
      data: {
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
        console.log(".....MarkerData fail.....");
      }
    })
    console.log("refresh")
    //发起第二个请求，写死Circles
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getccdata',
      data: {
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
        console.log(".....CircleData fail.....");
      }
    })
  },
  
  regionchange(e) {
    //console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
    var i=0;
    for (i = 0; i < this.data.markers.length;i++){
      if (this.data.markers[i].id == e.markerId){
        this.setData({
          lat: this.data.markers[i].latitude,
          lng: this.data.markers[i].longitude,
          actId: this.data.markers[i].id
        })
      }
    }
    
  },
  controltap(e) {
    console.log(e.controlId)
    
  },

  nowLocation:function(){
    var that = this
    //console.log(this.data)
    if(this.data.lat!=0){
      wx.openLocation({
        latitude: this.data.lat,
        longitude: this.data.lng,
        name: '点击按钮进行导航'
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '亲，先选一个点吧(>^ω^<)喵',
      })
    }
    
  },
  //选一个点，获取这个点的活动id，跳转到actdetinfo
  chooseMyLocation:function(){
    var that = this
    //console.log(this.data)
    if (this.data.actId != 0) {
      var path = '../../pages/actdetinfo/actdetinfo?actId=' + this.data.actId
      wx.navigateTo({
        url: path,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '亲，先选一个点吧(>^ω^<)喵',
      })
    }
  },
  tocenter:function(){
    this.mapCtx.moveToLocation()
  }
  
  
  
})