const app = getApp()

Page({
  data: {
    imgStatus: {
      noSelect: '/images/me/grayCircle.png',
      select: '/images/me/yellowCircle.png'
    },
    list: []
  },

  // 设置默认
  setDefault(e) {
    const data = e.currentTarget.dataset;
    let params, result
    result = data.item
    const { addrId, address, city, createTime, district, isDefault, province, receiver, telephone, updateTime} = result
    if (isDefault === 'Y') {
      return
    }
    params = {
      addrId,
      address,
      city,
      createTime,
      district,
      isDefault: isDefault === 'Y'?'N':'Y',
      province,
      receiver,
      telephone,
      updateTime,
    }

    app.$api.deliveryUpdateDelivery(params).then(res => {
      app.$u.showToast('更改成功')
      if (this.data.list.length > 1) {
        this.data.list.forEach(item => {
          item.isDefault = "N"
        })
      }
      this.data.list[data.index].isDefault = params.isDefault
      this.setData({
        list: this.data.list
      })
    })
  },


  // del(e) {
  //   this.data.list.splice(e.currentTarget.dataset.index, 1)
  //   this.setData({
  //     list: this.data.list
  //   })
  // },
  
  //地址切换事件
  backOrderDetail(e) {
    let item = e.currentTarget.dataset.item
    if (this.data.way === 'choose') {
      wx.setStorageSync('chooseAddr', item)
      wx.navigateBack({
        delta: 1,
      })
    }
  },

  //新建地址
  addAddress() {
    wx.navigateTo({
      url: '/pages/editAddress/editAddress',
    })
  },

  //编辑地址
  editAddress(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/editAddress/editAddress?item=' + JSON.stringify(item),
    })
  },

  //删除
  deleAddress(e) {
    let data = e.currentTarget.dataset, self = this
    app.$u.showModal('确定删除地址吗？').then(e => {
      app.$api.deliveryDeleteDelivery({ addrId: data.item.addrId }).then(res => {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
        })
        self.data.list.splice(data.index, 1)
        self.setData({
          list: this.data.list
        })
      })
    }).catch(err => {

    })
  },

  //获取地址列表
  getData() {
    app.$api.deliveryDeliveryInfo().then(res => {
      if (res.data.length !== 0) {
        this.setData({
          noList: true
        })
      } else {
        this.setData({
          noList: false
        })
      }
      this.setData({
        list: res.data
      })
    })
  },

  onLoad(options) {
    if (options.way) {
      this.setData({
        way: 'choose'
      })
    }
  },

  onShow() {
    this.getData()
  }

})
