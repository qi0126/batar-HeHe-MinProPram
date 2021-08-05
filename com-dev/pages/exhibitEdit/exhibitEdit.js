const app = getApp()
 
Page({
  data: {
    imgStatus: {
      a: '/images/address/icon-not.png',
      b: '/images/address/icon-on.png'
    },
    result: {},
    startTime: `- - -`,
    endTime: `- - -`, 
  },

  startTimeChange (e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  endTimeChange (e) {
    this.setData({
      endTime: e.detail.value
    })
  },

  formSubmit(e) {
    let params = e.detail.value
    Object.assign(params, { startTime: this.data.startTime, endTime: this.data.endTime })
    if (!params.exhibitName) {
      app.$u.showToast('请填写展销名称')
      return
    }
    if (!params.exhibitAdr) {
      app.$u.showToast('请填写展销地址')
      return
    }
    if(!params.startTime) {
      app.$u.showToast('请填写展销开始时间')      
      return 
    }
    if (!params.endTime) {
      app.$u.showToast('请填写展销开始时间')
      return
    }
    app.$u.showLoading()
    app.$api.insertExhibitActive({ exhibitA: JSON.stringify(params) }).then(res => {
      app.$u.showToast('申请成功')
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 800)
    })
  },

  onLoad(options) {
    if (options.item) {
      this.data.result = JSON.parse(options.item)
      this.data.isDefault = this.data.result.isDefault
      this.setData({
        status: 'update',
        isDefault: this.data.isDefault,
        result: this.data.result
      })
    }
  },

  onReady() {
    this.animation = wx.createAnimation()
  }

})
