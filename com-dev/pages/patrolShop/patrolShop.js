const app = getApp()
Page({

    data: {
        currentIndex: 0,
        orderstatus: 0,
        list: [
   
        ]
    },

    navClick(e) {
        const { index: currentIndex, orderstatus } = e.currentTarget.dataset
        this.setData({
            currentIndex: parseInt(currentIndex),
            orderstatus   
        })
        this.getList()
    },
    
    getList() {
        let { orderstatus: statu } = this.data
        let params = {
            statu
        }
        app.$api.planList(params).then(res => {
            const { data: list } = res
            list.forEach(item => {
                item.predictStartTime = app.$d(item.predictStartTime).format('YYYY/MM/DD')
                item.predictEndTime = app.$d(item.predictEndTime).format('YYYY/MM/DD')
                item.esUserName = item.esUserName ? JSON.parse(item.esUserName): ''
            })
            this.setData({
                list
            })
        })
    },

    onLoad(options) {

    },

    onReady() {

    },

    onShow() {
        this.getList()
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


})