const app = getApp()

Page({
  data: {

  },

  formSubmit(e) {
    let params = e.detail.value
    if (params.password !== params.passwordt) {
      wx.showToast({
        title: '两次密码输入不同',
        icon: 'none'
      })
      return 
    }
    delete params.passwordt
    app.$api.accountChangePassword(params).then(res => {
      wx.showToast({
        title: '密码修改成功',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1500)
    })
  },

  onLoad(options) {
    const classId = options.classId
  },

})
