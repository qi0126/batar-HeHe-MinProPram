let WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp()
Page({
    data: {

    },

    // 获取预告详情
    advanceNoticeAppGet(id) {
        let params = {
            id
        }
        app.$api.advanceNoticeAppGet(params).then(res => {
            const { val } = res.data
            WxParse.wxParse('article', 'html', val, this, 0);
        })
    },

    bannerAppRich(id) {
        let params = { 
            id
        }
        app.$api.bannerAppGet(params).then(res => {
            const { banner: { hrefUrl} } = res.data
            WxParse.wxParse('article', 'html', hrefUrl, this, 0);
        })     
    },

    brandReferRich(id) {
        let params = {
            id
        }
        app.$api.brandReferGet(params).then(res => {
            const { val } = res.data
            WxParse.wxParse('article', 'html', val, this, 0);
        })  
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

    onReady() {
    },

    onLoad(options) {
        const { id, way } = options
        // 轮播图
        if (way === `banner`) {
            this.bannerAppRich(id)
        }
        // 推广栏
        if (way === `advanceNotice`) {
            this.advanceNoticeAppGet(id)
        }
        // 品牌资讯
        if (way === `brandRefer`) {
            this.brandReferRich(id)
        }
        // 资讯课堂
        if (way === `consultClassroom`) {
            this.consultClassroomRich(id)
        }
    },

    onShareAppMessage() {

    }
})