const app = getApp()
Page({

    data: {
        shopTF: true,
        hiddenmodalput: false, //弹窗一
        modalTxtOne: '选择陪同巡店人',
        userList: [],
        userSList: [],
        starNum: 5,
        modalTxtTwo: '选择陪同巡店人',
        modelInputPhol: '请描述店铺市场周边情况',
        modalTFTwo: false,
        shopReportData: {},
    },

  openImg(e){
    let oneindex = e.currentTarget.dataset.oneindex;
    let twoindex = e.currentTarget.dataset.twoindex;
    let imgs = this.data.shopReportData.reportDataList[oneindex].datalist[twoindex].imgList
    wx.previewImage({
      current: e.currentTarget.dataset.item, // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },


    goFeedback() {
        let self = this;
        this.setData({
            modalShow: true
        })
        setTimeout(() => {
            self.animation.height(560).step()
            self.setData({
                animationData: self.animation.export()
            })
        }, 0)
    },

    saveFeedback() {
        const { shopReportData } = this.data
        shopReportData.storeStatus = 1
        this.setData({
            shopReportData 
        })
    },

    onLoad(options) {
        let { item } = options
        item = JSON.parse(item)
        const { planId, storeStatus } = item
        const params = {
            id: planId,
        }
        app.$api.patrolDetail(params).then(res => {
  
                if (res.code === 200) {
                    let shopReportData = res.data
                    shopReportData.esUserNameD = shopReportData.esUserName ? JSON.parse(shopReportData.esUserName) : ''
                    let shopTF;
                    if (shopReportData.isStoreStatus === 0) {
                        shopTF = 0
                    } else {
                        shopTF = 1
                        shopReportData.storeStatus = storeStatus
                        shopReportData.storeStartTime = app.$d(shopReportData.storeStartTime).format('YYYY-MM-DD')
                        shopReportData.storeEndTime = app.$d(shopReportData.storeEndTime).format('YYYY-MM-DD')
                        shopReportData.reportDataList.forEach(ielem => {
                          ielem.datalist.forEach(jelem => {
                            jelem.imgList = jelem.img.length > 0 ? jelem.img.split(",") : []
                            jelem.contentD = jelem.content.slice(0, 17)
                          })
                        })
                    }
                    this.setData({
                        shopReportData,
                        shopTF,
                    })
                } else {
                    app.$u.showToast(res.message)
                }
            },
            err => {
                app.$u.showToast(res.message)
            })
    },

    onReady() {
        this.animation = wx.createAnimation()
    },

    onShow() {

    },


    onHide() {

    },

    onUnload() {

    },

    onPullDownRefresh() {

    },

    onReachBottom() {

    },


    onShareAppMessage() {

    },

    //更多打开弹窗
    toast1Tap(e) {
        wx.showToast({
            title: e.currentTarget.dataset.txt,
            icon: "none",
            duration: 2000
        })
    },

})