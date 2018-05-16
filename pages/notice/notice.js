// pages/notice/notice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    winWidth:0,
    winHeight:0,
    preplist:[],
    nowlist:[],
    overlist:[],
    searchCondition:'',
    searchLogo:'../../images/notice/searlogo.png',
    searchBtn:'../../images/notice/s.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.ff!=null){
      this.setData({
        currentTab:1
      })
    }
    var page = this;
    wx.getSystemInfo({
      success: function(res) {
        page.setData({winWidth:res.windowWidth});
        page.setData({winHeight:res.windowHeight});
      },
    })


    var that = this;
    //第一次请求
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getpreplist',
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          preplist: res.data
        })
      },
      fail: function (res) {
        console.log(".....PrepListFail.....");
      }
    })

    //第二次请求

    wx.request({
      url: 'http://192.168.43.146:8080/digital/getnowlist',
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          nowlist: res.data
        })
      },
      fail: function (res) {
        console.log(".....NowListFail.....");
      }
    })

    //第三次请求
   
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getoverlist',
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          overlist: res.data
        })
      },
      fail: function (res) {
        console.log(".....OverListFail.....");
      }
    })

   //
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  onPullDownRefresh(){
    var that = this;
    //第一次请求
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getpreplist',
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          preplist: res.data
        })
      },
      fail: function (res) {
        console.log(".....PrepListFail.....");
      }
    })

    //第二次请求

    wx.request({
      url: 'http://192.168.43.146:8080/digital/getnowlist',
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          nowlist: res.data
        })
      },
      fail: function (res) {
        console.log(".....NowListFail.....");
      }
    })

    //第三次请求

    wx.request({
      url: 'http://192.168.43.146:8080/digital/getoverlist',
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          overlist: res.data
        })
      },
      fail: function (res) {
        console.log(".....OverListFail.....");
      }
    })
  },

  switchNav:function(e){
    var id = e.currentTarget.id;
    this.setData({
      currentTab:id
    });
  },
  seePrepDetail: function (e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    var path = "../../pages/actdetinfo/actdetinfo?actId=" + that.data.preplist[index].actId;
    wx.navigateTo({
      url: path
    });
  },
  seeNowDetail: function (e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    var path = "../../pages/actdetinfo/actdetinfo?actId=" + that.data.nowlist[index].actId;
    wx.navigateTo({
      url: path
    });
  },
  seeOverDetail: function (e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    var path = "../../pages/actdetinfo/actdetinfo?actId=" + that.data.overlist[index].actId;
    wx.navigateTo({
      url: path
    });
  },
  searchInfo: function (e) {
    this.setData({
      searchCondition : e.detail.value
    })
  },
  doSearch:function(){
   
    var info = this.data.searchCondition;
    if(info!=null){
      //带参跳转
      var path = '../../pages/scresult/scresult?condi='+info
      wx.navigateTo({
        url: path,
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请输入搜索条件~',
      })
    }
  }

})