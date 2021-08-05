const app = getApp()

Page({
  data: {
    orderStatus: '1',//订单状态
    classId: '',//订单类型1、采购 2、来货 3、退货 4、展销
    page: 1,
    rows: 10,
    list: [],
    loadMore: true
  },

  //进入产品详情
  // goOrderDetail(e) {
  //   let data = e.currentTarget.dataset
  //   switch (this.data.classId) {
  //     case '1':
  //       if (this.data.orderStatus === '2') {
  //         wx.navigateTo({
  //           url: `/pages/orderDetail/orderDetail?orderNo=${data.item.orderNo}&orderType=${data.item.orderType}`,
  //         })
  //       } else {
  //         wx.navigateTo({
  //           url: `/pages/orderDetail/orderDetail?orderNo=${data.item.orderNo}&orderType=${data.item.orderType}`,
  //         })
  //       }
  //       break;
  //     case '2':
  //       wx.navigateTo({
  //         url: `/pages/orderDetailMake/orderDetailMake?orderNo=${data.item.orderNo}`,
  //       })
  //       break;
  //     case '3':
  //       wx.navigateTo({
  //         url: `/pages/orderDetailback/orderDetailback?orderId=${data.item.id}`,
  //       })
  //       break;
  //     case '4':
  //       wx.navigateTo({
  //         url: `/pages/orderDetailExhibit/orderDetailExhibit?orderNo=${data.item.orderNo}`,
  //       })
  //       break;
  //   }
  // },

   //进入产品详情
  goOrderDetail(item) {
    //采购、展销单详情
    wx.navigateTo({
      url: `/pages/orderDetails/orderDetails?orderNo=${item.detail}`,
    })

  },

  // 取消订单
  cancelOrderClick(item) {
    let self = this
    app.$u.showModal('确定取消订单吗').then(e => {
      app.$api.cancelBigGuestOrderIpad({
        orderNo: item.detail
      }).then(res => {
        app.$u.showToast('操作成功')
        setTimeout(() => {
          self.getData()
        }, 800)
      })
    })
  },



  //订单状态选择
  changeStatusClick(e) {
    let status = e.currentTarget.dataset.status
    this.setData({
      page: 1,
      orderStatus: status,
    })
    this.getData()
  },


  // 采购单
  getDetailData() {
    const { page, rows, orderStatus, list } = this.data
    let params = {
      orderStatus,
      orderType: 1
    }

    if (page && rows) {
      Object.assign(params, {
        page,
        rows
      })
    }
    app.$u.showLoading()
    app.$api.orderFindBigOrderListInfo(params).then(res => {
      if (res.data) {

        res.data.data.forEach(item => {
          item.orderStatus = item.clientOrderStatus
        })

        this.setData({
          result: res.data,
          list: page === 1 ? res.data.data : list.concat(res.data.data),
        })
      }
      if (this.data.list.length <= res.data.rowSize) {
        this.setData({
          loadMore: true
        })
      } else {
        this.setData({
          loadMore: false
        })
      }
    })
  },

  //客制单(暂无)
  getMakeData(orderNo, startTime, endTime) {
    wx.setNavigationBarTitle({
      title: '客制单',
    })
    let params = {
      orderStatus: this.data.orderStatus,
    }
    if (orderNo) {
      Object.assign(params, {
        orderNo
      })
    }
    if (startTime && endTime) {
      Object.assign(params, {
        startTime,
        endTime
      })
    }
    app.$u.showLoading()
    app.$api.orderFindOrderMakeDetailByMap(params).then(res => {
      wx.hideLoading()
      if (res.data) {
        res.data.forEach(item => {
          item.type = '客制订单'
        })
      }
      this.setData({
        result: res.data ? res.data : []
      })
    })
  },

  //退货单(暂无)
  getBackData(orderNo, startTime, endTime) {
    wx.setNavigationBarTitle({
      title: '退货单',
    })
    let orderStatus
    if (this.data.orderStatus === '3') {
      orderStatus = '4'
    } else if (this.data.orderStatus === '4') {
      orderStatus = '3'
    } else {
      orderStatus = this.data.orderStatus
    }
    let params = {
      orderStatus
    }
    if (orderNo) {
      Object.assign(params, {
        orderNo
      })
    }
    if (startTime && endTime) {
      Object.assign(params, {
        startTime,
        endTime
      })
    }
    app.$u.showLoading()
    app.$api.returnOrdersList(params).then(res => {
      wx.hideLoading()
      if (res.data) {
        res.data.forEach(item => {
          item.orderTotalWeight = item.ordertotalweight
          item.orderCreateTime = app.$d(item.date).format('YYYY-MM-DD HH:mm:ss')
          item.type = '退货订单'
        })
      }
      this.setData({
        result: res.data ? res.data : []
      })
    })
  },

  //展销单(暂无)
  getSaleData(orderNo) {
    const { page, rows, orderStatus, list } = this.data
    let params = {
      orderStatus,
      orderType: 5
    }

    if (page && rows) {
      Object.assign(params, {
        page,
        rows
      })
    }
    app.$u.showLoading()
    app.$api.orderFindBigOrderListInfo(params).then(res => {
      if (res.data) {

        res.data.data.forEach(item => {
          item.orderStatus = item.clientOrderStatus
        })
        this.setData({
          result: res.data,
          list: page === 1 ? res.data.data : list.concat(res.data.data),
        })
      }
      if (this.data.list.length <= res.data.rowSize) {
        this.setData({
          loadMore: true
        })
      } else {
        this.setData({
          loadMore: false
        })
      }
    })
  },

  loadMore() {
    let { page } = this.data
    page = page + 1
    this.setData({
      page
    })
    this.getData()
  },

  onReachBottom(e) {
    this.loadMore()
  },

  getData() {
    switch (this.data.classId) {
      case '1':
        this.getDetailData()
        break;
      case '2':
        this.getMakeData()//暂无
        break;
      case '3':
        this.getBackData()//暂无
        break
      case '4':
        this.getSaleData()//暂无
        break
    }
  },

  onLoad(options) {
    const { classId = 1, orderStatus = 1} = options
    if (classId) {
      this.setData({
        classId: classId.toString(),
        orderStatus: orderStatus.toString()
      })
    }
    this.getData()
  },

  onShow() {
    this.getData()
  }

})