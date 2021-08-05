const app = getApp()

Page({
  data: {
    logo: '',
    $img: app.$img,
    userName:'',
    flag: true,//拨打业务员电话
    clerkName: '百泰首饰',//绑定业务员姓名
    clerkPhoneNum: '400-931-0588',//绑定业务员电话
  }, 

  //巡店记录
  goPatrolShop(){
    // console.log('巡店');
    wx.navigateTo({
      url: `/pages/patrolShop/patrolShop`
    })
  },

  //联系我们
  clerkPhone() {
    // app.$api.queryMyClerk().then(res => {
      // let clerkName = res.data.clerkName ? res.data.area + res.data.clerkName : ''
      // let clerkPhoneNum = res.data.telephone ? res.data.telephone : ''
      this.setData({
        flag: false,
        })
    // })
  },

  //隐藏电话组件
  hideModal(item){
    this.setData({
      flag: item.detail
    })
  },


  photo() { 
    app.$api.commonUploadImg({ uploadType : 5}).then(res => {
      app.$api.companyUpdateLogo({ logoUrl: res.data}).then(rs => {
        this.getData()
      })
    })
  }, 
 
  getData() {
    // app.$api.companySimpleinfo().then(res => {
    //   this.setData({
    //     result: res.data
    //   })
    // })
  }, 
  //获取微信用户信息
  getUserInfo() {
    // 必须是在用户已经授权的情况下调用
    let self =  this
    wx.getUserInfo({
      success: function (res) {
        self.setData({
          logo: res.userInfo.avatarUrl,
          userName: res.userInfo.nickName
        })
      }
    })
  },
  goOrder(e) {
    const { item, orderstatus} = e.currentTarget.dataset
    // if(item === '2') {
    //   wx.navigateTo({
    //     url: `/pages/orderCome/orderCome?classId=${item}`,
    //   })
    //   return 
    // }
    // if (item === '3') {
    //   wx.navigateTo({
    //     url: `/pages/orderReturn/orderReturn?classId=${item}`,
    //   })
    //   return
    // }
    wx.navigateTo({
      url: `/pages/order/order?classId=${item}&orderStatus=${orderstatus}`,
    })
  },

  goCollect() {
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  },

  goAddress() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },

  goAccount() {
    wx.navigateTo({
      url: '/pages/account/accout',
    })
  },

  goSetting() {
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
  },

  goExhibit() {
    wx.navigateTo({
      url: '/pages/exhibit/exhibit',
    })
  },

  goLogin() {
    app.$u.showModal(`确定要退出切换账号？`).then(ele => {
      let params = {
        accessToken: wx.getStorageSync('accessToken')
      }
      app.$u.showLoading()
      app.$api.wxWxSwitch(params).then(res => {
        wx.removeStorageSync('accessToken')
        wx.navigateTo({
          url: '/pages/login/login',
        })
      })
    })
  },

  onLoad(options) {
  
  },

  onShow() {
    this.getData()
    this.getUserInfo()
  }

})
