const app = getApp()

Page({

    data: {
        $img: app.$img,
        allNum: 0,
        content: '',
        modalShow: false,
        discussList: [],
        info: {}
    },

    getContent(e) {
        this.setData({
            content: e.detail.value
        })
    },

    getDiscussList() {
        const {  id } = this.data
        let params = {
            id  
        }
        app.$api.consultClassroomComment(params).then(res => {
            const {
                data: discussList, rowSize: allNum
            } = res.data
            this.setData({
                allNum,
                discussList
            })
        })
    },

    sendMsg() {
        const self = this
        const { content, id } = this.data
        let params = {
            content,
            id,
            type: 2
        }
        this.setData({
            modalShow: false,
        })

        app.$api.consultClassroomCommentAdd(params).then(res => {
            // const {
            //     data: discussList
            // } = res.data
            // this.setData({
            //     discussList
            // })
            wx.showModal({
                title: '评论提交完成！',
                content: '评论内容需平台审核后发布',
                showCancel: false,
                // confirmColor: 'rgba(225, 103, 29, 1)',
                confirmText: '我知道了',
                success(res) {
                    self.getDiscussList()
                    // if (res.confirm) {
                    //     console.log('用户点击确定')
                    // } else if (res.cancel) {
                    //     console.log('用户点击取消')
                    // }
                }
            })
        })
    },

    // 点赞
    thumbsUp() {
        const { id, info } = this.data
        let params = {
            id,
            type: 1
        }
        if (info.flag === 0) {
            // 点赞
            app.$api.consultClassroomCommentAdd(params).then(res => {
            })
        }
        if (info.flag === 1) {
            // 取消点赞
            app.$api.consultClassroomCommentCancel(params).then(res => {
            })
        }
        info.flag = info.flag === 0 ? 1 : 0
        this.setData({
            info
        })
    },

    onLoad(options) {
        let { item } = options
        item = JSON.parse(item)
        const { id } = item
        this.setData({
            id,
            info: item
        })
        this.getDiscussList()
    },

    onReady() {

    },

    onShow() {

    },

    onHide() {

    },

    onUnload() {

    },

    onShareAppMessage() {

    },
    //输入评论
    inputDiscuss() {
        console.log('oo');
        this.setData({
            modalShow: true
        })
    },
    //关闭弹框
    closeModal() {
        console.log('关闭了');
        this.setData({
            modalShow: false
        })
    },
    panelModal() {
        return
    }
})