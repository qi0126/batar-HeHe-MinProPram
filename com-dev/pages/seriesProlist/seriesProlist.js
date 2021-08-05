const app = getApp()

Page({
    data: {
        // searchData:[],//搜索条件
        $img: app.$img,
        list: [],
        imgUrls: [],
        color: 'rgba(167, 28, 32, .2)',
        colorActive: 'rgba(167, 28, 32, 1)',
        autoplay: true,
        interval: 5000,
        duration: 1000,
        scrollTop: 0,
        floorstatus: false,
        animationData: {},
        params: {}, //筛选传进来的参数
        productStatus: false, //是否有产品
        num: 1, //下拉加载页码
        menuList: [
            // {
            //     id: 86467,
            //     name: "全部"
            // }, {
            //     id: 86467,
            //     name: "风尚金系列"
            // }, {
            //     id: 86467,
            //     name: "MIX系列"
            // }, {
            //     id: 86467,
            //     name: "品牌展示"
            // }, {
            //     id: 86467,
            //     name: "品牌简介"
            // }
        ],
        info: {},
        result: {
            rowSize: 0
        },
        searchParams: {
            search: ''
        },
        loadMore: false
    },

    //顶部筛选
    clickMenu(e) {
        const {
            searchParams
        } = this.data
        const {
            id,
            name,
            code
        } = e.detail
        searchParams.search = code
        this.setData({
            searchParams
        })
        this.getData(1)
    },

    //进入购物车
    goShoppingCart() {
        wx.switchTab({
            url: '/pages/shop/shop',
        })
    },

    //进入筛选页
    goSearch() {
        wx.navigateTo({
            url: '/pages/proList/proListSearch/proListSearch?way=seriesProlist',
        })
    },


    goDetail(e) {
        const {
            item
        } = e.currentTarget.dataset
        let params = {
            proNum: item.batarNum
        }
        app.$api.produceInfo(params).then(res => {
            const {
                oneItemsCode
            } = res.data.pro
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
        const {
            item,
            index,
            iindex
        } = e.currentTarget.dataset

        app.$api.produceClick({
            proNum: item.batarNum
        }).then(res => {
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

    // 点击更多 todo
    goMoreSeries(e) {
        const {
            seriesOne
        } = this.data
        const {
            item
        } = e.currentTarget.dataset
        if (item.name === '新品' || item.name === '热销') {
            wx.navigateTo({
                url: `/pages/moreSeries/moreSeries?series=${item.name}`,
            })
            return
        }
        if (seriesOne === '臻品') {
            wx.navigateTo({
                url: `/pages/moreSeries/moreSeries?series=${seriesOne}&tit=${item.name}`,
            })
            return
        }
        if (seriesOne === '硬金') {
            wx.navigateTo({
                url: `/pages/moreSeries/moreSeries?series=${item.gold}&tit=${item.one}`,
            })
            return
        }
        if (seriesOne !== '热销' && seriesOne !== '臻品' && seriesOne !== '硬金') {
            wx.navigateTo({
                url: `/pages/moreSeries/moreSeries?series=${seriesOne}&tit=${item.make}`,
            })
            return
        }
    },

    backTop(e) {
        let self = this
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 500
        })
        this.animation.opacity(0).step()
        this.setData({
            animationData: this.animation.export()
        })
        setTimeout(() => {
            self.animation.opacity(.5).step()
            self.setData({
                animationData: self.animation.export()
            })
        }, 100)
    },

    getSeriesList(callback) {
        callback('热销')
    },

    onPageScroll(e) {
        if (e.scrollTop > 500) {
            this.setData({
                scrollTopEnd: e.scrollTop,
                floorstatus: true
            });
        } else {
            this.setData({
                floorstatus: false
            });
        }
    },

    onPullDownRefresh(e) {
        this.getData(1)
    },

    onReachBottom(e) {
        this.loadMore()
    },

    loadMore() {
        this.setData({
            num: this.data.num + 1
        })
        this.getData(this.data.num)
    },

    getData(num) {
        let searStatus = false,
            params = {
                page: num,
                rows: 30,
            }
        if (this.data.params) {
            Object.assign(params, this.data.params)
        }
        if (this.data.searchParams) {
            Object.assign(params, this.data.searchParams)
        }
        wx.showNavigationBarLoading()
        app.$api.getSeriesList(params).then(res => {
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
                result: res.data,
                num: num,
                list: num === 1 ? res.data.data : this.data.list.concat(res.data.data),
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
            // wx.setNavigationBarTitle({
            //     title: `搜索结果(${this.data.result.rowSize}条)`
            // })
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

    // 获取二级系列
    getSeriesTopList() {
        const {
            info: {
                id,
                name
            }
        } = this.data
        let params = {
            id
        }
        app.$api.getSeries(params).then(res => {
            const {
                list: menuList
            } = res.data
            menuList.forEach(item => {
                item.code = item.name
            })
            menuList.unshift({
                id: "",
                name: "全部",
                code: name,
            })
            this.setData({
                menuList
            })
        })
    },

    onLoad(options) {
        console.log(options)
        let {
            item
        } = options
        item = JSON.parse(item)
        const { name } = item
        const { searchParams } = this.data
        searchParams.search = name
        this.setData({
            info: item,
            searchParams
        })
        wx.setNavigationBarTitle({
            title: name,
        })
        this.getSeriesTopList()
    },

    onShow() {
        if (this.data.searchData != undefined) {
            this.setData({
                params: this.data.searchData
            })
        }
        this.getData(1)
    },

    onPageScroll(e) {
        if (e.scrollTop > 500) {
            this.setData({
                scrollTopEnd: e.scrollTop,
                floorstatus: true
            });
        } else {
            this.setData({
                floorstatus: false
            });
        }
    },

    onReady() {
        this.animation = wx.createAnimation({
            duration: 100
        })
    },

    onHide() {},

    onUnload() {}

})