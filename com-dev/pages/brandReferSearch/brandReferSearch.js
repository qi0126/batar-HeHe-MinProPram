const app = getApp()
Page({

    data: {
        $img: app.$img,
        $simg: app.$simg,
        inputValue: '',
        searchHistory: [],//历史记录
        themeKeyWord: [],//热门关键字
    },

    onLoad: function (options) {

    },

    onShow: function () {
        //获取历史记录
        this.getHistory();
        // this.getSeriesThemeList();
    },

    //主题进入产品列表
    goThemeProductList(e) {
        let params = {
            theme: e.currentTarget.dataset.searchname
        }
        wx.navigateTo({
            url: '/pages/proList/proList/proList?params=' + JSON.stringify(params),
        })
    },


    //选择搜索关键字 knowledge
    goSearch(e) {
        let { inputValue } = this.data
            let params = {
                search: inputValue
            }
            wx.navigateBack({
                delta: 1,
            })
            wx.setStorageSync('brandReferSearParams', params)
        this.saveKeyWord('searHistoryBrandReferSearch', inputValue, 8)
    },

    //历史搜索
    historySearch(e) {
        let { inputValue } = this.data
        let params = {
            search: e.currentTarget.dataset.searchname
        }
        wx.navigateBack({
            delta: 1,
        })
        wx.setStorageSync('brandReferSearParams', params)
    },

    change(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },

    //关闭按钮
    closeFun() {
        this.setData({
            inputValue: ''
        });
    },

    confirmFun(e) {
        console.log('回车');
        this.goSearch()
        // wx.navigateTo({
        //   url: `/pages/search/searchIndex/searchIndex?keyword=${keyword}`,
        // })
    },

    saveKeyWord(getValue, searValue, num) {
        // 没有重复交换位置处理
        function exchange() {
            searHistory.splice(index, 1)
        }

        // 没有重复处理
        function next() {
            searHistory.unshift(searValue)
            if (searHistory.length >= num) {
                searHistory.length = num
            }
            wx.setStorageSync(getValue, searHistory)
        }

        num = num ? num : 8
        let searHistory = [], index = 0
        if (!wx.getStorageSync(getValue) && searValue.trim() !== "") {
            searHistory.unshift(searValue)
            wx.setStorageSync(getValue, searHistory)
        } else {
            searHistory = wx.getStorageSync(getValue)
            if (searHistory.indexOf(searValue) === -1 && searValue.trim() !== "") {
                next()
            }
            if (searHistory.indexOf(searValue) !== -1 && searValue.trim() !== "") {
                index = searHistory.indexOf(searValue)
                exchange()
                next()
            }
        }
    },

    //获取历史记录
    getHistory() {
        this.setData({
            searchHistory: wx.getStorageSync('searHistoryBrandReferSearch')
        })
    },
    //删除历史记录
    delFun() {
        app.$u.showModal('确认清空历史记录吗').then(res => {
            this.setData({
                searHistory: []
            })
            wx.setStorageSync('searHistoryBrandReferSearch', []);
            this.getHistory();
        })
    },


})