const app = getApp()

Page({
    data: {
        allNum: 0,
        page: 1,
        rows: 20,
        searchParams: {
            label: ''
        },
        kowledgeClassroomList: [],
        kowledgeClassroomLabelList: [],
        isTouchedImg: false
    },


    hideTouchedImg() {
        this.setData({
            isTouchedImg: false
        })
        this.previewDoc()
    },

    previewDocBefore(e) {
        const { item: preDocItem } = e.currentTarget.dataset
        this.setData({
            isTouchedImg: true,
            preDocItem
        })
    },

    goSearch() {
        wx.navigateTo({
            url: `/pages/knowledgeSearch/knowledgeSearch`
        })
    },

    getList() {
        const { page, rows, searchParams } = this.data
        let params = {
            page,
            rows
        }
        params = { ...params, ...searchParams }
        app.$api.knowledgeClassroomLists(params).then(res => {
            const {
                data,
                rowSize: allNum
            } = res.data
            this.setData({
                allNum,
                kowledgeClassroomList: page === 1 ? data : this.data.kowledgeClassroomList.concat(data),
            })
            if (this.data.kowledgeClassroomList && this.data.kowledgeClassroomList.length >= res.data.rowSize) {
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

    labelCheck(e) {
     
        const { kowledgeClassroomLabelList  } = this.data
        const { index } = e.currentTarget.dataset
        kowledgeClassroomLabelList.forEach((item,num) => {
          if (num !== index){
            item.checked = false
          }
        })
        kowledgeClassroomLabelList[index].checked = !kowledgeClassroomLabelList[index].checked 
        this.setData({
            page: 1,
            kowledgeClassroomLabelList
        })
        this.getLabelList()
    },

    getLabelList() {
        let { searchParams, kowledgeClassroomLabelList } = this.data
        searchParams = {
            label: kowledgeClassroomLabelList.filter(item => item.checked).map(item => item.content).join(',')
        }
        this.setData({
            searchParams
        })
        this.getList()
    },

    getKnowledgeClassroomLabel() {
        app.$api.knowledgeClassroomLabel().then(res => {
            const {
                data: kowledgeClassroomLabelList,
            } = res
            this.setData({
                kowledgeClassroomLabelList
            })
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
        this.getList()
    },

    previewDoc(e) {
        const { preDocItem: { url } } = this.data
        app.$u.showLoading()
        wx.downloadFile({
            url: `${app.$img}${url}`,
            success: res => {
                const filePath = res.tempFilePath
                wx.openDocument({
                    filePath: filePath,
                    fileType: app.$u.getExtension(url),
                    success: res => {
                        console.log('打开文档成功', res)
                    },
                    fail: res => {
                        wx.showToast({
                            icon: 'none',
                            title: '上传失败',
                        })
                        app.$u.showToast(`不支持的文档类型`)
                    },
                    complete: res => {
                        wx.hideLoading()
                    }
                })
            }
        })
    },


    onLoad(options) {
        this.getKnowledgeClassroomLabel()
    },

    onShow() {
        let { searchParams } = this.data
        const searchParamsNav = wx.getStorageSync('knowledgeSearParams')
        if (searchParamsNav) {
            searchParams = { ...searchParams, ...searchParamsNav}
            this.setData({
                searchParams
            })
            wx.removeStorageSync('knowledgeSearParams')
        } 
        this.getList()
    }

})
