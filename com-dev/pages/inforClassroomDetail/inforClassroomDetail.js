let WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp()
Page({
    data: {
        info: {},
        id: ''
    },

    consultClassroomRich(id) {
        let params = {
            id
        }
        app.$api.consultClassroomGet(params).then(res => {
            const { val } = res.data
            WxParse.wxParse('article', 'html', val, this, 0);
        })
    },

    //进入评论
    goDiscuss(e) {
        const { info } = this.data
        wx.navigateTo({
            url: `/pages/discuss/discuss?item=${JSON.stringify(info)}`
        })
    },

    // 资讯课堂详情
    goConsultClassroomDetail(e) {
        const item = e.detail
        wx.navigateTo({
            url: `/pages/inforClassroomDetail/inforClassroomDetail?item=${JSON.stringify(item)}`
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

    onReady() {
    },

    onLoad(options) {
        let { item } = options
        item = JSON.parse(item)
        const { id } = item
        this.setData({
            info: item,
            id
        })
        this.consultClassroomRich(id)
    },

    onShareAppMessage() {

    }
})