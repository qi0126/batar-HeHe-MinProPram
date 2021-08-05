const app = getApp()

Page({
  data: {
    imgStatus: {
      noSelect: '/images/me/grayCircle.png',
      select: '/images/me/yellowCircle.png'
    },
    result: {},
    status: 'add',
    popuStatus: true,
    isDefault: 'N',
    animationData: {}
  },
  //设置默认
  defAddClick() {
    if (this.data.isDefault === 'Y') {
      this.setData({
        isDefault: 'N'
      })
    } else {
      this.setData({
        isDefault: 'Y'
      })
    }
  },
  //提交
  formSubmit(e) {
    let val = e.detail.value, goWay, params = {}, responseTit = '', isDefault = { isDefault: this.data.isDefault }
    if (this.data.city) {
      Object.assign(params, this.data.city, val, isDefault)
    } else {
      Object.assign(params, this.data.result, val, isDefault)
    }
    if (this.data.status === 'add') {
      goWay = 'deliveryCreateDelivery',
        responseTit = '添加成功'
    } else if (this.data.status === 'update') {
      params.addrId = this.data.result.addrId
      goWay = 'deliveryUpdateDelivery'
      responseTit = '修改成功'
    }
    if (!params.receiver) {
      app.$u.showToast('请输入联系人')
    }
    if (!app.$v.verifyMobile(params.telephone)) {
      app.$u.showToast('请输入正确格式的手机号')
      return
    }
    if (!params.province) {
      app.$u.showToast('请选择地址')
    }

    app.$u.showLoading()
    app.$api[goWay](params).then(res => {
      wx.showToast({
        title: responseTit,
        icon: 'none',
        mask: true,
        success() {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 800)
        }
      })
    })
  },

  //选择省市区
  popuShow(e) {
    let self = this
    this.setData({
      popuStatus: false,
    })
    setTimeout(() => {
      self.animation.height(178).step()
      self.setData({
        animationData: self.animation.export()
      })
    }, 0)
  },
  //确定选中省市区
  popConfirm(e) {
    let city = e.detail.params
    this.setData({
      city
    })
  },

  // editAddress() {
  //   wx.navigateTo({
  //     url: '/pages/editAddress/editAddress',
  //   })
  // },

  onLoad(options) {
    if (options.item) {
      this.data.result = JSON.parse(options.item)
      this.data.isDefault = this.data.result.isDefault
      this.setData({
        status: 'update',
        isDefault: this.data.isDefault,
        result: this.data.result
      })
      wx.setNavigationBarTitle({
        title: '编辑地址',
      })
    }
  },

  onReady() {
    this.animation = wx.createAnimation()
  }

})
