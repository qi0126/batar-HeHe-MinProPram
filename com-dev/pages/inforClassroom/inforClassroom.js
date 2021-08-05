const app = getApp()

Page({
    data: {
        allNum: 0,
        page: 1,
        rows: 20,
        searchParams: {},
        consultClassroomList: []
    },

    goSearch() { 
        wx.navigateTo({
            url: `/pages/classroomSearch/classroomSearch`
        })
    },

    getConsultClassroomLists() {
        const { searchParams, page, rows  } = this.data
        let params = {
            page,
            rows
        }
        params = { ...params, ...searchParams }
        app.$api.consultClassroomLists(params).then(res => {
            const {
                data, 
                rowSize: allNum
            } = res.data
            this.setData({
                allNum,
                consultClassroomList: page === 1 ? data : this.data.consultClassroomList.concat(data),
            })
            if (this.data.consultClassroomList && this.data.consultClassroomList.length >= res.data.rowSize) {
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

    // 资讯课堂详情
    goConsultClassroomDetail(e) {
        const item = e.detail
        wx.navigateTo({
            url: `/pages/inforClassroomDetail/inforClassroomDetail?item=${JSON.stringify(item)}`
        })
    },

    //进入评论
    goDiscuss(e) {
        const item = e.detail
        wx.navigateTo({
            url: `/pages/discuss/discuss?item=${JSON.stringify(item)}`
        })
    },

    // 点赞
    consultClassroomLike(e) {
        console.log(e)
        const { consultClassroomList } = this.data
        const { id, flag } = e.detail
        const { index } = e.currentTarget.dataset
        const currentLike = consultClassroomList[index].flag
        const currentLikeNum = consultClassroomList[index].like
        let params = {
            id,
            type: 1
        }
        if (currentLike === 0) {
            consultClassroomList[index].like = currentLikeNum + 1
            // 点赞
            app.$api.consultClassroomCommentAdd(params).then(res => {
            })
        }
        if (currentLike === 1) {
            consultClassroomList[index].like = currentLikeNum - 1
            // 取消点赞
            app.$api.consultClassroomCommentCancel(params).then(res => {
            })
        }
        consultClassroomList[index].flag = currentLike === 0 ? 1 : 0
        console.log(consultClassroomList)
        this.setData({
            consultClassroomList
        })
    },

    onReachBottom(e) {
        this.loadMore()
    },

    loadMore() {
        const { page } = this.data
        this.setData({
            page: page + 1
        })
        this.getConsultClassroomLists()
    },

    onLoad(options) { 
        // console.log(options)
        // let { params } = options
        // if (!params) {
        //     return 
        // }
        // params = JSON.parse(params)
        // this.setData({
        //     searchParams: params
        // })
    },

    onShow() {
        const searchParams = wx.getStorageSync('infoClassroomSearParams')
        if (searchParams) {
            this.setData({
                searchParams
            })
            wx.removeStorageSync('infoClassroomSearParams')
        }
        this.getConsultClassroomLists()
    }

})
