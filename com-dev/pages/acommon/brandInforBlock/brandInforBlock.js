const app = getApp()

Component({
    options: {
        addGlobalClass: true,
    },

    properties: {

    },

    pageLifetimes: {
        show() {
            this.brandReferSearch()
        },
        hide() {

        },
        resize(size) {

        }
    },

    data: {
        date: "",
        allNum: 0,
        page: 1,
        rows: 20,
        searchParams: {},
        brandReferLists: [],
        $img: app.$img
    },

    methods: {
        goSearch() {
            wx.navigateTo({
                url: `/pages/brandReferSearch/brandReferSearch`,
            })
        },

        //
      cancelFun(){
        this.setData({
          date:'',
          searchParams:{}
        })
        this.getBrandReferLists()
      },

        goTime(e) {
            let { searchParams } = this.data
            const date = e.detail.value
            // searchParams = { ...searchParams,
            //     ...{
            //         year: date.split('-')[0],
            //         month: date.split('-')[1],
            //     }
            // }
            searchParams = {
                year: date.split('-')[0],
                month: date.split('-')[1],
            }
            this.setData({
                date,
                searchParams
            })
            this.getBrandReferLists()
        },

        getBrandReferLists() {
            const {
                searchParams,
                page,
                rows
            } = this.data
            let params = {
                page,
                rows
            }
            params = { ...params,
                ...searchParams
            }
            app.$api.brandReferLists(params).then(res => {
                const {
                    data,
                    rowSize: allNum
                } = res.data
                data.forEach(item => {
                    item.createTime = app.$d(item.createTime).format('YYYY-MM-DD')
                })
                this.setData({
                    allNum,
                    brandReferLists: page === 1 ? data : this.data.brandReferLists.concat(data),
                })
                if (this.data.brandReferLists && this.data.brandReferLists.length >= res.data.rowSize) {
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

        // 前往品牌咨询
        goBrandRefer(e) {
            const {
                item: {
                    id
                }
            } = e.currentTarget.dataset
            wx.navigateTo({
                url: `/pages/textContent/textContent?id=${id}&way=brandRefer`
            })
        },

        // 品牌咨询搜索
        brandReferSearch() {
            const searchParams = wx.getStorageSync('brandReferSearParams')
            if (searchParams) {
                this.setData({
                    searchParams
                })
                wx.removeStorageSync('brandReferSearParams')
            }
            this.getBrandReferLists()
        },

        loadMore() {
            const {
                page
            } = this.data
            this.setData({
                page: page + 1
            })
            this.getBrandReferLists()
        },
    }
})