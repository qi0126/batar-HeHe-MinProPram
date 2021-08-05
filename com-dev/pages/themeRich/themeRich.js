let WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp()
Page({
    data: {
        $img: app.$img,
        info: {},
        id: '',
        allNum: 0,
        searchParams: {},
        loadMore: false,
        list: [],
        page: 1,
        rows: 30,
    }, 

    goDetail(e) {
        const { item } = e.currentTarget.dataset
        let params = {
            proNum: item.batarNum
        }
        app.$api.produceInfo(params).then(res => {
            const { oneItemsCode } = res.data.pro
            if (oneItemsCode === 'TZ' || oneItemsCode === 'D-JZ') {
                wx.navigateTo({
                    url: '/pages/detailSuit/detailSuit?proNum=' + item.batarNum,
                })
            } else {
                wx.navigateTo({
                    url: '/pages/detail/detail?proNum=' + item.batarNum,
                })
            }
        })

    },


    slideCollect(e) {
        let data = e.currentTarget.dataset
        const { item, index, iindex } = e.currentTarget.dataset

        app.$api.produceClick({ proNum: item.batarNum }).then(res => {
            if (this.data.list[index].isColl === 0) {
                this.data.list[index].isColl = 1
            } else if (this.data.list[index].isColl === 1) {
                this.data.list[index].isColl = 0
            }
            this.setData({
                list: this.data.list
            })
        })
    },

    getThemeRich(id) {
        let params = {
            id
        }
        app.$api.getTheme(params).then(res => {
            const { value } = res.data
            WxParse.wxParse('article', 'html', value, this, 0);
        })
    },


    getList() {
        const { searchParams, page, rows, info: { name: search } } = this.data  
        let searStatus = false,
            params = {
                page,
                rows,
                search
            }
        params = { ...params, ...searchParams }
        wx.showNavigationBarLoading()
        app.$api.getThemeList(params).then(res => {
            wx.hideNavigationBarLoading()
            wx.hideLoading();
            if (!res.data) {
                this.setData({
                    loadMore: true,
                    productStatus: true
                })
                return
            }
            if (res.data.data) {
                res.data.data.map(item => {
                    item.gold = `${item.min}~${item.max}`
                    if (item.min === item.max) {
                        item.gold = item.min
                    }
                    if (item.min === 0 && item.max === 0) {
                        item.gold = `${item.startWeight}~${item.endWeight}`
                    }

                    return item
                })
            } else {
                this.setData({
                    loadMore: true,
                    productStatus: true
                })
                return
            }
            this.setData({
                allNum: res.data.rowSize ? res.data.rowSize : 0,
                result: res.data,
                list: page === 1 ? res.data.data : this.data.list.concat(res.data.data),
            })
            if (this.data.list && this.data.list.length >= res.data.rowSize) {
                this.setData({
                    loadMore: true
                })
            } else {
                this.setData({
                    loadMore: false
                })
            }
            wx.setNavigationBarTitle({
                title: `搜索结果(${this.data.result.rowSize}条)`
            })
            // console.log('aaa:',this.data.list)
            if (this.data.list.length == 0) {
                this.setData({
                    productStatus: true
                })
            } else {
                this.setData({
                    productStatus: false
                })
            }

        })
    },

    loadMore() {
        const { page } = this.data
        this.setData({
            page: page + 1
        })
        this.getList()
    },

    onReachBottom(e) {
        this.loadMore()
    },

    onShow() {
        this.getList()    
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
        this.getThemeRich(id)
    },

    onShareAppMessage() {

    }
})