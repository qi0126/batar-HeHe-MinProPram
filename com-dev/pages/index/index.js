const app = getApp()

const widthRadio = wx.getStorageSync('deviceInfo').widthRadio

Page({
    data: {
        schoolIndex: '1',
        picTop: 1160, //图片分享top
        videoTop: 800, //视频分享top
        scrollTop: 0, //页面滚动的位置
        $img: app.$img,
        imgUrls: [],
        indicatorDots: true,
        color: '#DBDBDB',
        colorActive: '#24B73A',
        // autoplay: true,
        titAutoplay: true,
        interval: 3000,
        duration: 1000,
        seriesList: [], //系列数据
        advanceNoticeList: [], // 预告栏列表
        selectionBuseiness: {}, //选中的一级系列
        secondarySeries: [], //二级系列数据
        themeList: [], //主题数据
        posterImgList: ['/images/index/poster1.jpg', '/images/index/poster2.jpg', '/images/index/poster3.jpg'], //海报图片
        newInfoTranslate: 0, // 每次偏移量
        newInfoWeight: 0, // 文字宽度
        newInfoTime: 0,
        newMsg: '', // 新信息
        brandReferList: [], // 品牌咨询活动
        consultClassroomList: [], // 咨询课堂
        kowledgeClassroomList: [], // 知识课堂
        isTouchedImg: false,
    },

  swiperFun(event){
    let currentIndex = event.detail.current;
    let prevIndex = currentIndex === 0 ? 0 : currentIndex - 1
    let nextIndex = currentIndex === this.data.imgUrls.length - 1 ? currentIndex : currentIndex + 1
    console.log('轮播', currentIndex);
    // let prevItem = this.data.imgUrls[prevIndex]
    // let nextItem = this.data.imgUrls[nextIndex]
    // console.log('上', prevIndex)
    // console.log('下', nextItem)
    // if (prevItem.type === 2){
    //   let videoContextPrev = wx.createVideoContext(`video${prevItem}`);
    //   videoContextPrev.stop();
    //   console.log('进来1', videoContextPrev);
    // }

    // if (nextItem.type === 2){
    //   let videoContextNext = wx.createVideoContext(`video${nextIndex}`);
    //   videoContextNext.stop();
    //   console.log('进来2', videoContextNext);
    // }
    // let item = this.data.imgUrls[currentIndex]
    // if (item.type === 2){
    //   let videoContext = wx.createVideoContext(`video${currentIndex}`);
    //   videoContext.pause();
    //   console.log('进来3');
    // }

    this.data.imgUrls.forEach((item,index) => {
      if (item.type === 2){
        let videoContext = wx.createVideoContext(`video${index}`);
        videoContext.pause();
      }
    })


  },

    hideTouchedImg() {
        this.setData({
            isTouchedImg: false 
        })
        this.previewDoc()
    },

    //进入品牌展示
    goBrand() {
        app.currentTab = 2
        console.log('进入品牌', app.currentTab);
        wx.switchTab({
            url: `/pages/brand/brand?currentTab=2`,
        })
    },

    //更多资讯
    moreInfor() {
        wx.switchTab({
            url: `/pages/brand/brand?currentTab=2`,
        })
    },
    
    // 品牌咨询
    goBrandReferMore() {
        app.currentTab = 5
        wx.switchTab({
            url: `/pages/brand/brand?currentTab=5`,
        })
    },

    previewDocBefore(e) {
        const { item: preDocItem } = e.currentTarget.dataset
        this.setData({
            isTouchedImg: true,
            preDocItem
        })
    },

    previewDoc() {
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


    //系列进入产品列表
    goSeriesProductList(e) {
        let params = {
            seriesSubclass: e.currentTarget.dataset.item.themeName
        }
        wx.navigateTo({
            url: '/pages/proList/proList/proList?params=' + JSON.stringify(params),
        })
    },

    //主题进入产品列表
    goThemeProductList(e) {
        let params = {
            theme: e.currentTarget.dataset.item.buseiness.themeName
        }
        wx.navigateTo({
            url: '/pages/proList/proList/proList?params=' + JSON.stringify(params),
        })
    },

    //探索更多
    moreFun() {
        wx.navigateTo({
            url: '/pages/proList/proList/proList',
        })
    },


    //点击搜索
    goSearchPage() {
        wx.navigateTo({
            url: '/pages/search/search',
        })
    },

    goDetail(proNum) {
        let params = {
            proNum
        }
        app.$api.produceInfo(params).then(res => {
            const {
                oneItemsCode, proNumber
            } = res.data.pro
            if (oneItemsCode === 'TZ' || oneItemsCode === 'D-JZ') {
                wx.navigateTo({
                    url: '/pages/detailSuit/detailSuit?proNum=' + proNumber,
                })
            } else {
                wx.navigateTo({
                    url: '/pages/detail/detail?proNum=' + proNumber,
                })
            }
        })
    },

    //点击轮播
    bannerClick(e) {
        let {
            item,
            item: {
                type,
                id,
                hrefUrl
            }
        } = e.currentTarget.dataset
        console.log(item)
        // return
        switch (type) {
            case 1:
                this.goDetail(hrefUrl)
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                wx.navigateTo({
                    url: `/pages/textContent/textContent?id=${id}&way=banner`
                })
                break;
        }
    },

    // 点击系列
    seriesItemClick(e) {
        const {
            item
        } = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/seriesProlist/seriesProlist?item=${JSON.stringify(item)}`
        })
    },

    // 点击主题
    themeClick(e) {
        const {
            item
        } = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/themeRich/themeRich?item=${JSON.stringify(item)}`
        })
    },

    //获取系列数据
    getSeriesList() {
        let params = {
            page: 1,
            rows: 100
        }
        app.$api.listSeries(params).then(res => {
            const { data: seriesList} = res.data
            this.setData({
                seriesList
            })
        })
    },

    //获取主题数据
    getThemeList() {
        let params = {
            page: 1,
            rows: 100
        }
        app.$api.listTheme(params).then(res => {
            const { data: themeList } = res.data
            this.setData({
                themeList,
            })
        })
    },


    //组装二级系列数据
    assembleSecondarySeries(data) {
        // console.log('系列数据', data);
        if (data.list != undefined) {
            this.setData({
                secondarySeries: data.list,
                selectionBuseiness: data.buseiness
            })
        } else {
            this.setData({
                secondarySeries: [data.buseiness]
            })
        }

        this.setData({
            selectionBuseiness: data.buseiness
        })
    },

    onPullDownRefresh() {
        this.getData()
    },


    // 验证自动登录
    getAppLogin(code) {
        return new Promise((reslove, reject) => {
            wx.login({
                success(e) {
                    const params = {
                        code: e.code,
                        companyCode: app.$companyCode
                    }
                    app.$api.wxAppLogin(params).then(res => {
                        if (res.code === 205) {
                            wx.redirectTo({
                                url: '/pages/login/login',
                            })
                        }
                        wx.setStorageSync('accessToken', res.data)
                        reslove(res.data)
                    }).catch(err => {
                        reject(err)
                    })
                }
            })
        })
    },

    //获取轮播数据
    getBanner() {
        app.$api.appBannerList().then(res => {
            const {
                data: imgUrls
            } = res.data
            imgUrls.forEach(item => {
                // item.mobileImgUrl = app.$img + item.imgUrl
            })
            this.setData({
                imgUrls
            })
        })
    },

    // 执行信息循环
    loopMsg() {
        this.loopMsgs = setTimeout(() => {
            const {
                newInfoTranslate,
                newInfoWeight
            } = this.data
            // console.log(newInfoWeight / 2 , newInfoTranslate)
            if (newInfoWeight/2 + 160 < -newInfoTranslate) {
                this.setData({
                    newInfoTranslate: 0
                })
            }
            this.setData({
                newInfoTranslate: this.data.newInfoTranslate - 2
            })
            this.loopMsg()
        }, 100)
    },

    advanceNoticeAppList() {
        let params = {
            page: 1,
            rows: 100
        }
        app.$api.advanceNoticeAppList(params).then(res => {
            const {
                data: advanceNoticeList
            } = res.data
            this.setData({
                advanceNoticeList
            })
        })
    },

    getAppMsgNotice() {
        let params = {
            page: 1,
            rows: 100
        }
        app.$api.appMsgNotice(params).then(res => {
            const {
                content: newMsg
            } = res.data
            this.setData({
                newMsg
            })
            this.getNewInfoWeight()
        })
    },

    getNewInfoWeight()　 {
        // 执行信息循环的高度
        const query = wx.createSelectorQuery()
        query.select('#newInfo').boundingClientRect()
        query.exec(res => {
            console.log(res)
            this.setData({
                newInfoWeight: res[0] ? res[0].width : 0
            })
        })
    },

    getBrandReferList() {
        let params = {}
        app.$api.brandReferList(params).then(res => {
            const {
                data: brandReferList
            } = res.data
            brandReferList.forEach(item => {
                item.createTime = app.$d(item.createTime).format('YYYY-MM-DD')
            })
            this.setData({
                brandReferList
            })
        })
    },

    getConsultClassroomList() {
        let params = {
            page: 1,
            rows: 100
        }
        app.$api.consultClassroomList(params).then(res => {
            const {
                data: consultClassroomList
            } = res.data
            this.setData({
                consultClassroomList
            })
        })
    },

    getKowledgeClassroomList() {
        let params = {
            page: 1,
            rows: 100
        }
        app.$api.knowledgeClassroomList(params).then(res => {
            const {
                data: kowledgeClassroomList
            } = res.data
            this.setData({
                kowledgeClassroomList
            })
        })
    },

    getData() {
        this.getBanner() // 获取banner
        this.getSeriesList() // 获取系列
        this.getThemeList() // 获取主题
        this.advanceNoticeAppList() // 获取预告列表
        this.getAppMsgNotice() // 获取最新消息通知
        this.getBrandReferList() // 获取品牌咨询
        this.getConsultClassroomList() // 获取咨询课堂
        this.getKowledgeClassroomList() // 获取知识课堂
    },

    onLoad(options) {
        if (options.scrollTop) {
            this.setData({
                scrollTop: options.scrollTop
            })
        }
        wx.pageScrollTo({
            scrollTop: this.data.scrollTop,
            duration: 0
        })

    },

    onShow() {
        wx.login({
          complete: (res) => {
              console.log(res)
          },
        })
        this.loopMsg() // 循环执行信息
        this.getData() // 需要实时刷新的数据
        // this.getAppLogin().then(res => {
        //     this.getData() // 需要实时刷新的数据
        // })
    },

    onReady() {

    },

    onHide() {
        clearTimeout(this.loopMsgs)
    },

    onUnload() {
        clearTimeout(this.loopMsgs)
    },

    onShareAppMessage(res) {
        console.log('分享按钮', res.target.id);
        let scrolltop = 0;
        if (res.target.id == 'videoID') {
            scrolltop = this.data.videoTop;
        } else if (res.target.id == 'picID') {
            scrolltop = this.data.picTop;
        }

        return {
            // title:'小视频',
            path: `/pages/index/index?scrollTop=${scrolltop}`
        }
    },

    //选择课堂
    selectClassroom(e) {
        this.setData({
            schoolIndex: e.currentTarget.dataset.index
        })
    },

    //更多课堂
    moreClassroom() {
        wx.navigateTo({
            url: `/pages/inforClassroom/inforClassroom`,
        })
    },

    //跟多知识
    moreKnowledge() {
        wx.navigateTo({
            url: `/pages/knowledgeClassroom/knowledgeClassroom`,
        })
    },

    //进入评论
    goDiscuss(e) {
        const item = e.detail
        wx.navigateTo({
            url: `/pages/discuss/discuss?item=${JSON.stringify(item)}`
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
    consultClassroomLike(e) {
        console.log(e)
        const { consultClassroomList  } = this.data
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
        // console.log(consultClassroomList)
        this.setData({
            consultClassroomList
        })
    },

    //查看文本详情
    gowxParseDetail(e) {
        const {
            item: {
                id
            }
        } = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/textContent/textContent?id=${id}&way=advanceNotice`
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
    }


})