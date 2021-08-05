let WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp()

const $prodm = app.$m.detailSuit
 
Page({
    data: {
        $img: app.$img,
        imgUrls: [],
        indicatorDots: true,
        color: 'rgba(167, 28, 32, .2)',
        colorActive: 'rgba(167, 28, 32, 1)',
        autoplay: true,
        interval: 5000,
        duration: 1000,
        isStopBodyScroll: false,

        noSku: false,
        isDJ: false,
        tagStatus: true,
        defTagTit: '添加标签',
        tagPlace: '请输入想要添加的标签',
        tagVal: '',

        blankTit: '标签指南',
        blankInfo: '您可以为这款产品定义自己的名称，方便您今后搜索和辨识。',

        countNum: 0, //数量
        allSkuParams: {}, // 全部sku信息
        arrCount: [], // 各个sku重量数量价格
        allCount: 0, // 全部数量
        allWeight: 0, // 全部重量
        allPrice: 0, // 全部价格
        isUpdata: 0, // 1新建 1更新

        shopCount: 0, // 购物车总数

        defReMark: true,
        defRemarkTit: '添加备注',
        defPlace: '请输入想要添加的备注',
        defReMarkVal: '',

        singleStatu: true, // 单个购买

        video: "",  // 视频
        coverimg: "",  // 视频封面
        coverimgShow: true, // 视频封面默认显示

        flag: true,//拨打业务员电话
        clerkName: '',//绑定业务员姓名
        clerkPhoneNum: '',//绑定业务员电话
        
        popuStatus: false, // 加入购物车弹窗
        animationData: {}, // 弹窗动画
        textMessage: '',//富文本内容
    },

    playVideo() {
        this.slideVideo.play()
        this.setData({
            coverimgShow: false
        })
    },

    clearCountAll() {
        this.setData({
            allCount: 0,
            allWeight: 0,
            allPrice: 0
        })
    },

    // 关闭加入弹窗
    closePopupSku(e) {
        this.setData({
            popuStatus: false,
            isStopBodyScroll: false
        })
    },

    // 展示加入弹窗
    popuShow() {
        let self = this
        this.setData({
            popuStatus: true,
            num: 1,
            remark: ``,
            // weightSE: this.data.weightSE
        })
        setTimeout(() => {
            self.animation.height('260rpx').step()
            self.setData({
                isStopBodyScroll: true,
                animationData: self.animation.export()
            })
        }, 0)
    },

    valiCount() {
        const { conditOneList } = this.data
        if (conditOneList.filter(item => item.countNum).length === 0) {
            app.$u.showToast(`请选择产品数量`)
            return false
        }
        return true
    },

    // 点击加入购物车todo
    clickAddCart() {
        if (!this.valiCount()) {
            return
        }
        this.popuShow()
    },

    //  预览
    preImgs(e) {
        let preImgs = []

        preImgs = this.data.result.pic.map(item => {
            return `${app.$img}${item}`
        })

        wx.previewImage({
            urls: preImgs
        })
    },

    //拨打电话
    clerkPhone() {
        // app.$api.queryMyClerk().then(res => {
        // let clerkName = res.data.clerkName ? res.data.area + res.data.clerkName : ''
        let clerkName = '百泰首饰'
        // let clerkPhoneNum = res.data.telephone ? res.data.telephone : ''
        let clerkPhoneNum = '400-931-0588'
        this.setData({
            flag: false,
            clerkName,
            clerkPhoneNum,
        })
        // })
    },

    //拨打业务员电话弹出层
    hideModal() {
        this.setData({
            flag: true,
        })
    },
    //拨打业务员电话
    openClerk() {
        wx.makePhoneCall({
            phoneNumber: this.data.clerkPhoneNum,
            success() {
                console.log('成功拨打客服电话')
            }
        })
    },

    valiGoDetail(options) {
        const { proNum = '', statu = '' } = options
        if (!proNum || !statu) {
            return false
        }
        if (statu === '0') {
            return false
        }
        return true
    },

    goDetail(e) {
        const { item, item: { proNum } } = e.currentTarget.dataset
        if (!this.valiGoDetail(item)) {
            return
        }
        wx.navigateTo({
            url: `/pages/detail/detail?proNum=${proNum}`,
        })
    },

    // 标签显示
    tagClick(e) {
        let data = e.currentTarget.dataset
        this.setData({
            tagVal: this.data.tagVal ? this.data.tagVal : '',
            tagStatus: false,
        })
    },

    // 标签确定 
    tagConfirm(e) {
        let detail = e.detail
        let params = {
            proNum: this.data.pro.proNumber,
            desc: detail.reMark,
        }
        if (detail.reMark.toString().length > 20) {
            app.$u.showToast(`最多输入20位`)
            return
        }
        app.$api.produceAddDesc(params).then(res => {
            this.setData({
                tagVal: detail.reMark,
            })
        })
        this.setData({
            tagStatus: true,
        })
    },

    // 标签问题
    tagQuesClick() {
        this.setData({
            tagsDetailStatus: true
        })
    },

    // 整套购买减数量
    decrease() {
        this.setData({
            countNum: this.data.countNum === 0 ? 0 : Number(this.data.countNum) - 1
        })
        this.getAllParams()
        this.countAll()
    },

    // 整套购买加数量
    increase() {
        this.setData({
            countNum: Number(this.data.countNum) + 1
        })
        this.getAllParams()
        this.countAll()
    },

    // 整套购买输入框
    inputConfirm(e) {
        this.setData({
            countNum: e.detail.value > 0 ? parseInt(e.detail.value) : 0
        })
        this.getAllParams()
        this.countAll()
    },

    // 单个购买减数量
    singleDecrease(e) {
        const { item, index } = e.currentTarget.dataset
        const { conditOneList } = this.data
        conditOneList[index].countNum = conditOneList[index].countNum === 0 ? 0 : conditOneList[index].countNum - 1
        this.setData({
            conditOneList
        })
        // this.getAllParams()
        this.singleCountAll()
    },

    // 单个购买加数量
    singleIncrease(e) {
        const { item, index } = e.currentTarget.dataset
        const { conditOneList } = this.data
        conditOneList[index].countNum = conditOneList[index].countNum + 1
        this.setData({
            conditOneList
        })
        // this.getAllParams()
        this.singleCountAll()
    },

    // 单个购买输入框
    singleInputConfirm(e) {
        const { item, index } = e.currentTarget.dataset
        const { conditOneList } = this.data
        conditOneList[index].countNum = Number(e.detail.value)
        this.setData({
            conditOneList
        })
        // this.getAllParams()
        this.singleCountAll()
    },

    getAllParams() {
        let arr = [], arrCount = [], allSkuParams
        this.data.conditTwoList.forEach(item => {
            arr.push({
                skuNum: item.skuNum,
                diameterLength: item.diameter,
                weight: item.weight
            })
        })
        arrCount = JSON.parse(JSON.stringify(this.data.conditTwoList))
        allSkuParams = {
            totalSum: this.data.countNum,
            productRemarks: this.data.reMark,
            skuNums: arr
        }
        this.setData({
            arrCount,
            allSkuParams
        })
    },

    // 单个购买点击备注
    singleDefRemark(e) {
        const { item, index: remarkIndex } = e.currentTarget.dataset
        const { conditOneList } = this.data
        this.setData({
            defReMark: false,
            remarkIndex,
            defReMarkVal: conditOneList[remarkIndex].reMark
        })
    },

    // def备注显示
    defRemark(e) {
        let data = e.currentTarget.dataset
        this.setData({
            defReMark: false,
        })
    },

    // def备注确定
    defRemarkConfirm(e) {
        let detail = e.detail
        const { singleStatu, conditOneList, remarkIndex, defReMarkVal } = this.data
        this.setData({
            reMark: detail.reMark,
            defReMark: true,
            defReMarkVal: detail.reMark
        })
        if (singleStatu) {
            conditOneList[remarkIndex].reMark = detail.reMark
            this.setData({
                conditOneList
            })
        }
    },

    // 切换购买方式 todo
    changeMode() {
        const { singleStatu } = this.data
        this.setData({
            singleStatu: !singleStatu
        })
        this.clearCountAll()
        this.getData()
    },

    // 加入购物车
    addTrolley() {
        const { singleStatu } = this.data
        if (singleStatu) {
            this.singleAddTrolley()
        } else {
            this.allAddTrolley()
        }
    },


    goShop() {
        wx.switchTab({
            url: '/pages/shop/shop',
        })
    },

    // 获取标准款参数
    getParams() {
        let { conditOneList } = this.data
        let params = {
            proNo,
            suit: 1,
            isUpdata: 1,
        }
        let singleCartFroms = [{
            skuNum,
            totalSum,
            weight,
        }]
        params = { ...params, ...{ singleCartFroms } }
        this.setData({
            params
        })
    },

    // 单个购买加入购物车
    singleAddTrolley() {
        const { conditOneList, pro, pro: { oneItemsCode: oneCode, oneItemsCodeName: one, proNumber: suitNumAll } } = this.data

        let params = {
            oneCode,
            one,
            isUpdata: 1,
            suit: 1,
            suitNumAll,
            singleCartFroms: []
        }

        conditOneList.forEach(item => {
            if (item.countNum) {
                params.singleCartFroms.push({
                    accessory: JSON.stringify(item.auxiliariesList.filter(item => item.checked)),
                    proNo: item.proNum,
                    skuNum: item.skuNum,
                    totalSum: item.countNum,
                    weight: item.weight,
                    productRemarks: item.productRemarks
                })
            }
        })

        if (params.singleCartFroms.length === 0) {
            app.$u.showToast('请选择要加入的数量')
            return
        }

        app.$u.showModal(`确定加入购物车？`).then(ele => {
            app.$u.showLoading()
            app.$api.addBigSingleCartApp(params).then(res => {
                app.$u.showToast('加入购物车成功')
                this.closePopupSku();
                // this.setData({
                //     shopCount: shopCount += num
                // })
            })
            // this.setData({
            //     shopCount: this.data.shopCount += this.data.allCount
            // })
        })
    },

    // 整套购买加入购物车
    allAddTrolley() {
        const { allSkuParams: singleCartFroms, defReMarkVal: productRemarks, pro: { proNumber: proNo }, countNum } = this.data
        // Object.assign(allSkuParams, { productRemarks: defReMarkVal })
        let troParams = {
            // proWeed: `${this.data.conditStatus ? 9999 : 999}`,
            proNo,
            suit: 2,
            suitSum: countNum,
            productRemarks,
            isUpdata: 1
        }
        if (this.data.countNum === 0) {
            app.$u.showToast('请选择要加入的数量')
            return
        }
        app.$u.showModal(`确定加入购物车？`).then(ele => {
            app.$u.showLoading()
            app.$api.addBigSingleCart(troParams).then(res => {
                app.$u.showToast('加入购物车成功')
                this.setData({
                    shopCount: this.data.shopCount += this.data.allCount
                })
            })
        })
    },

    // 计算总数 
    countAll(e) {
        const { countNum: allCount, specProduct, conditOneList } = this.data
        let allPrice = 0
        const { price, weight, skuList } = specProduct[0]
        conditOneList.forEach(item => {
            item.allPrice = app.$u.countPrice(item.condit, item.feeType, allCount, item.price, item.piecePrice, item.weight)
        })
        this.setData({
            allCount,
            allWeight: (allCount * weight).toFixed(2),
            allPrice
        })
    },

    // 单个购买计算总数
    singleCountAll(e) {
        let allCount = 0,
            allWeight = 0,
            allPrice = 0
        const { conditOneList } = this.data
        conditOneList.forEach(item => {
            if (item.countNum) {
                allCount += item.countNum
                allWeight += (item.weight * item.countNum)
                item.singlePrice = app.$u.countPrice(item.condit, item.fee, item.countNum, item.additionPrice, item.feePrice, item.weight)
                allPrice += item.singlePrice
            }
        })
        this.setData({
            allCount,
            allWeight: allWeight.toFixed(2),
            allPrice: allPrice.toFixed(2)
        })
    },

    goShop() {
        wx.switchTab({
            url: '/pages/shop/shop',
        })
    },

    reset() {
        app.$u.showModal('确定重置数据吗').then(res => {
            this.setData({
                allCount: 0,
                allWeight: 0,
                allPrice: 0,
                countNum: 0,
                defReMarkVal: ``,
                reMark: ``,
            })
        })
    },

    getTag(data) {
        // if (res.data.pro.nameDesc) {
        //   this.setData({
        //     tagVal: res.data.nameDesc
        //   })
        // }
        const { alias } = data.pro
        this.setData({
            tagVal: alias ? alias : ''
        })
    },

    // goDetail(e) {
    //   const { item } = e.currentTarget.dataset
    //   let params = {
    //     proNum: item.batarNum
    //   }
    //   app.$api.produceInfo(params).then(res => {
    //     const { oneItemsCode } = res.data.pro
    //     if (oneItemsCode === 'TZ') {
    //       wx.navigateTo({
    //         url: '/pages/detailSuit/detailSuit?proNum=' + item.batarNum,
    //       })
    //     } else {
    //       wx.navigateTo({
    //         url: '/pages/detail/detail?proNum=' + item.batarNum,
    //       }) 
    //     }
    //   })
    // },
    getOnePrice(pro) {
        const { conditi, addition_price, fee_price, weight, fee_type } = pro.proSpecList[0]
        let onePrice = app.$u.countSuitPrice(conditi, fee_type, 1, addition_price, fee_price, weight)
        return onePrice
    },

    //加入收藏
    slideCollect() {
        let { proNum, propsDataSku } = this.data
        app.$api.produceClick({ proNum: proNum }).then(res => {
            if (res.code === 200) {
                if (propsDataSku.isColl === 0) {
                    propsDataSku.isColl = 1
                } else if (propsDataSku.isColl === 1) {
                    propsDataSku.isColl = 0
                }
                this.setData({
                    propsDataSku,
                })
            }
        })
    },

    // 单行辅件的展示隐藏
    changeAuxWrap(e) {
        const { conditOneList } = this.data
        const { index } = e.currentTarget.dataset
        conditOneList[index].axuChecked = !conditOneList[index].axuChecked
        this.setData({
            conditOneList
        })
    },

    // 单行备注的展示隐藏
    changeRemarkWrap(e) {
        const { conditOneList } = this.data
        const { index } = e.currentTarget.dataset
        conditOneList[index].remarkChecked = !conditOneList[index].remarkChecked
        console.log(conditOneList)
        this.setData({
            conditOneList
        })
    },

    // 辅件
    changeAux(e) {
        const { conditOneList } = this.data
        const { index, ix } = e.currentTarget.dataset
        conditOneList[index].auxiliariesList[ix].checked = !conditOneList[index].auxiliariesList[ix].checked
        console.log(conditOneList)
        this.setData({
            conditOneList
        })
    },

    // 改变备注
    changeRemark(e) {
        const { conditOneList } = this.data
        const { index } = e.currentTarget.dataset
        conditOneList[index].productRemarks = e.detail.value
        console.log(conditOneList)
        this.setData({
            conditOneList
        })
    },

    getData() {
        // GSKXQ0100001
        // GSKTZ0252
        // app.$api.produceInfo({ proNum: `tz-12369`}).then(res => {
        app.$api.produceInfo({ proNum: this.data.proNum }).then(res => {
            // 获取标签
            let { SpecProduct: specProduct, SpecProduct: [{ skuList: skuList }], pro, pro: { oneItemsCode }, video, coverimg } = res.data
            let isDj = false
            this.getTag(res.data)
            // skuList = skuList.filter(item => item.statu === "1" && item.skuNum)
            // skuList = skuList.filter(item => item.statu === "1")
            skuList.forEach(item => {
                item.axuChecked = false
                item.remarkChecked = true
                if (item.auxiliariesList) {
                    item.auxiliariesList.forEach(item => {
                        item.checked = true
                    })
                }
                item.price = item.price ? item.price : 0
                item.basePrice = parseInt(item.condit) ? wx.getStorageSync('price999') : wx.getStorageSync('price9999')
                item.piecePrice = item.piecePrice ? item.piecePrice : 0
                item.countNum = 0
                item.productRemarks = ''
                item.spec = app.$u.changeItemSpec(`${item.condit}、${item.effect}、${item.carFlower}`)
                item.extend = JSON.parse(item.extend)
            })
            pro.onePrice = parseFloat(this.getOnePrice(pro).toFixed(2))
            if (pro.oneItemsCode === "D-JZ") {
                isDj = true
            }
            this.setData({
                conditOneList: skuList,
                conditTwoList: skuList,
                noSku: skuList.filter(item => item.skuNum).length === 0 ? true : false,
                specProduct,
                pro,
                video,
                coverimg,
                propsDataSku: pro,
                isDj,
                textMessage: res.data.pro.text
            })
       
            this.slideVideo = wx.createVideoContext("slideVideo")
            WxParse.wxParse('article', 'html', res.data.pro.text, this, 0);
        })
    },

    onReady() {
        this.animation = wx.createAnimation()
    },

    onLoad(options) {
        if (options.proNum) {
            this.setData({
                proNum: options.proNum
            })
            this.getData()
        }
    },

})