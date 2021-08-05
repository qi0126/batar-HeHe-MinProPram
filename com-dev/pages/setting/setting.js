const app = getApp()

Page({
  data: {

  },

  formSubmit(e){
    let params = e.detail.value
    wx.showLoading()
    app.$api.accountUpdateInfo(params).then(res => {

    })
  },

  getData() {
    app.$api.accountMyinfo().then(res => {
      this.setData({
        result: res.data
      })
    }) 
  },

  goChangePassWord() {
    wx.navigateTo({
      url: '/pages/changePassWord/changePassWord',
    })
  },

  onLoad(options) {
    const classId = options.classId
  },

  onShow() {
    this.getData()
  }

})
