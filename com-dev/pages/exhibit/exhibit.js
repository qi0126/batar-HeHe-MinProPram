const app = getApp()

Page({
  data: {
    startX: 0,
    startY: 0,
    list: [],
    imgSlide: {
      a: '/images/order/icon-down.png',
      b: '/images/order/icon-up.png'
    },
    searOrder: false,
    searTime: false,
    startDate: `开始日期`,
    endDate: `结束日期`,
    searValue: '',
    num: 1
  },
 
  touchstart(e) {
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      list: this.data.list
    })
  },

  touchmove(e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      startX = that.data.startX,
      startY = that.data.startY,
      touchMoveX = e.changedTouches[0].clientX,
      touchMoveY = e.changedTouches[0].clientY,
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.list.forEach(function (v, i) {
      v.isTouchMove = false
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX)
          v.isTouchMove = false
        else
          v.isTouchMove = true
      }
    })
    that.setData({
      list: that.data.list
    })
  },

  angle(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  del(e) {
    this.data.list.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      list: this.data.list
    })
  },

  // 搜索start
  searOrderSlide() {
    this.setData({
      searOrder: !this.data.searOrder,
      searTime: false
    })
  },

  searTimeSlide() {
    this.setData({
      searTime: !this.data.searTime,
      searOrder: false
    })
  },

  deleSear() {
    this.setData({
      searValue: ''
    })
  },

  search() {
    console.log(this.data.searValue)
  },

  startDateEv(e) {
    this.setData({
      startDate: e.detail.value
    })
  },

  endDateEv(e) {
    this.setData({
      endDate: e.detail.value
    })
  },

  searTimeTrue() {
    if (this.data.startDate === '开始日期') {
      app.$u.showToast('请输入开始日期')
      return
    }
    if (this.data.endDate === '结束日期') {
      app.$u.showToast('请输入结束日期')
      return
    }
    console.log(this.data.startDate, this.data.endDate)

  },

  change(e) {
    this.setData({
      searValue: e.detail.value
    })
  },
  // 搜索end

  addExhibit() {
    wx.navigateTo({
      url: '/pages/exhibitEdit/exhibitEdit',
    })
  },

  goExDetail(e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    if (this.data.way === 'choose') {
      wx.setStorageSync('chooseExhibit', item)
      wx.navigateBack({
        delta: 1,
      })
    }
  },

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
      this.data.list.forEach(item => {
        item.isTouchMove = false
      })
    })
  },

  loadMore() {
    this.setData({
      num: this.data.num + 1
    })
    this.getData(this.data.num)
  },
  
  getData(num) {
    app.$api.exhibitActiveList({ 'page': num, rows: 10 }).then(res => {
      this.setData({
        result: res.data,
        list: num == 1 ? res.data.data : this.data.list.concat(res.data.data),
      })
      try {
        if (this.data.list.length >= res.data.rowSize) {
          this.setData({
            loadMore: true
          })
        }
      } catch (err) { }
    })
  },

  onReachBottom() {
    this.loadMore()
  },

  onLoad(options) {
    if (options.way) {
      this.setData({
        way: 'choose'
      })
    }
  },
  
  onShow() {
    // app.$u.showLoading()
    // this.getData(1)
  }

})
