const app = getApp()
const orderF = app.$orderFun
const proCount = app.$productCount

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderNo: '',
        orderDetailsData: {},
        orderProductData: [],
    },

    //获取订单详情
    getData() {
        let params = {
            orderNo: this.data.orderNo
        }
        app.$api.selectBigGuestOrderDetailInfoApp(params).then(res => {
            const { data } = res
            //   proCount.setList(data.cartStoreFroms)
            //   proCount.changeFormatOrder()
            //   // 计算全部产品信息
            //   proCount.countAllOrder()

            const { list, orders: orderDetailsData } = res.data
            proCount.setList(list)
            proCount.changeFormatOrderTwo()
            proCount.changeFormatTwo()
            // 计算全部产品信息
            proCount.countAllTwo()
            this.setData({
                list: proCount.getList()
            })

            // let endOrderTotalMoney = 0
            // data.cartStoreFroms.forEach(ielem => {
            //     endOrderTotalMoney += ielem.price
            // })
            // //结果保贸两位小数
            // endOrderTotalMoney = Math.round(parseFloat(endOrderTotalMoney) * 100) / 100
            // data.endOrderTotalMoney = endOrderTotalMoney
            // data.orderStatus = data.clientOrderStatus
            this.setData({
                orderDetailsData,
                // tabList: proCount.getList(),
                // tabListItem: proCount.getList()[0],
                // orderProductData: proCount.getList()[0].cartCategoryFroms,
            })

            // console.log('详情数据11', this.data.tabList);
            // console.log('详情数据22', this.data.tabListItem);
            console.log('详情数据33', this.data)

        })
    },

    // 取消订单
    cancelOrderClick(e) {
        let param = e.currentTarget.dataset.orderno;
        let self = this
        app.$u.showModal('确定取消订单吗').then(e => {
            app.$api.cancelBigGuestOrderIpad({
                orderNo: param
            }).then(res => {
                app.$u.showToast('操作成功')
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1,
                    })
                }, 800)
            })
        })
    },

    //重新下单
    reOrderFun(e) {
        let params = {
            orderNo: this.data.orderNo,
            type: 'refDef'
        }
        wx.navigateTo({
            url: `/pages/shopOrderDetail/shopOrderDetail?data=${JSON.stringify(params)}`,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderNo: options.orderNo
        });
        this.getData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})