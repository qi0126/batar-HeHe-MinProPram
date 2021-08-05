let WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp()

import mode from '../../mode/mode.js'
import modeJZ from '../../mode/modeJZ.js'
import modeXL from '../../mode/modeXL.js'
import dialog from '../../utils/detailDialog.js'

const $prodm = modeJZ

Page({
    data: {
        remark: '',//备注信息
        imgStatus: {
            a: '/images/shopcart/icon-on.png',
            b: '/images/shopcart/icon-not.png',
        },
        $img: app.$img,
        imgUrls: [],
        indicatorDots: true,
        color: 'rgba(167, 28, 32, .2)',
        colorActive: 'rgba(167, 28, 32, 1)',
        autoplay: false,
        interval: 5000, 
        duration: 300,

        // 标签
        tagStatus: true,
        defRemarkTit: '添加标签',
        defPlace: '请输入想要添加的标签',
        blankTit: '标签指南',
        blankInfo: '您可以为这款产品定义自己的名称，方便您今后搜索和辨识。',
        tagVal: '',
        defStyle: '',
        defCountNum: 0,
        tagsDetailStatus: false,

        popuStatus: false,
        animationData: {},
        isStopBodyScroll: false,
        mode: `1`,  // 1为标准规格 2为自定义规格
        modeIndex: 0, // 可做规格

        propsDataSku: ``,  // sku
        propsDataSkuCustom: ``, // 自定义sku
        propsCusTomsDataSkuModal: {
            propsData: ``
        }, // 自定义弹窗sku
        customsSkuObj: ``, // 选中的自定义规格
        propsDataSkuModal: ``, // 弹窗上的sku
        num: 1,
        trueSku: {},
        trueCusToms: ``,  // 自定义选中
        showInputStatus: 0, // 0都不显示  1显示输入框 2显示链长

        params: {}, // 方法
        shopCount: 0, // 购物车数量
        weightSE: null,//克重范围字符

        video: "",  // 视频
        coverimg: "",  // 视频封面
        coverimgShow: true, // 视频封面默认显示

        canDo: {
            dialog: {
                propShow: false
            },
            select: {}
        },
        tabList: [
            {
                txt: `标准规格`,
                val: `1`,
                checked: true,
                show: true,
            },
            // {
            //   txt: `可做规格`,
            //   val: `2`,
            //   checked: false,
            //   show: true,
            // }
        ],
        detailList: [],//详情
        sumPrice: 0,//总工费

        flag: true,//拨打业务员电话
        clerkName: '',//绑定业务员姓名
        clerkPhoneNum: '',//绑定业务员电话
        textMessage: '',//富文本内容
    },

    playVideo() {
        this.slideVideo.play()
        this.setData({
            coverimgShow: false
        })
    },

    chainScopeDetail() {
        this.setData({
            chainProp: true
        })
    },

    changeModeOn(e) {
        const { index, item: { val: mode } } = e.currentTarget.dataset
        const { tabList } = this.data
        tabList.forEach(item => {
            item.checked = false
        })
        tabList[index].checked = true
        this.setData({
            tabList,
            mode
        })
    },

    closePopupSku(e) {
        this.setData({
            popuStatus: false,
            isStopBodyScroll: false
        })
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
            proNum: this.data.proNum,
            desc: detail.reMark ? detail.reMark : "",
        }
        if (detail.reMark.toString().length > 20) {
            app.$u.showToast(`最多输入20位`)
            return
        }
        app.$api.produceAddDesc(params).then(res => {
            this.setData({
                tagVal: detail.reMark ? detail.reMark : "",
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

    defIsShowInput() {
        let { propsDataSkuModal: { propsData: { oneItemsCode }, clickedObj } } = this.data
        return {
            oneItemsCode,
            clickedObj
        }
    },

    cusIsShowInput() {
        let { propsCusTomsDataSkuModal: { propsData: { oneItemsCode }, clickedObj } } = this.data
        return {
            oneItemsCode,
            clickedObj
        }
    },

    // 是否显示备注和输入框
    isShowInput() {
        const { mode } = this.data
        let oneItemsCode, clickedObj
        if (mode === `1`) {
            oneItemsCode = this.defIsShowInput().oneItemsCode
            clickedObj = this.defIsShowInput().clickedObj
        }
        if (mode === `2`) {
            oneItemsCode = this.cusIsShowInput().oneItemsCode
            clickedObj = this.cusIsShowInput().clickedObj
        }
        let showInputStatus = 1
        this.setData({
            showInputStatus
        })
    },

    // 减数量
    decrease() {
        let { num } = this.data
        if (!num) {
            app.$u.showToast(`请先选择规格参数`)
            return
        }
        num = Number(num) <= 1 ? 1 : Number(num) - 1
        this.setData({
            num
        })
        this.countAll()
        this.getParams()
    },

    // 加数量
    increase() {
        let { num } = this.data
        if (!num) {
            app.$u.showToast(`请先选择规格参数`)
            return
        }
        num = Number(num) + 1
        this.setData({
            num
        })
        this.countAll()
        this.getParams()
    },

    // 输入框
    inputConfirm(e) {
        this.setData({
            num: e.detail.value
        })
        this.countAll()
        this.getParams()
    },

    // // 获取备注
    // getRemark(e) {
    //   let { trueSku } = this.data
    //   this.setData({
    //     remark: e.detail.value
    //   })
    //   this.getParams()
    // },

    getRemarkFun(e) {
        console.log(e.detail.value);
        this.setData({
            remark: e.detail.value
        })
    },

    defCountAll() {
        const { trueSku: { weight }, num, trueSku } = this.data
        let sumPrice = 0
        let detailList = []
        if (trueSku.conditi) {
            sumPrice = app.$u.countPrice(trueSku.conditi, trueSku.fee_type, num, trueSku.addition_price, trueSku.fee_price, trueSku.weight)
            if (trueSku.fee_type) {
                detailList =
                    [
                        {
                            name: '工费类型',
                            value: trueSku.fee_type === 1 ? '每克' : '每件',
                        },
                        // {
                        //     name: '基础工费(￥)',
                        //     // value: trueSku.conditi === "999" ? wx.getStorageSync('price999') : wx.getStorageSync('price9999')
                        //     value: 4
                        // },
                        {
                            name: '',
                            value: ''
                        },
                        {
                            name: '预计附加工费(￥)',
                            value: trueSku.fee_type === 1 ? trueSku.addition_price : trueSku.fee_price
                        }
                    ]
            } else {
                detailList = []
            }
        }

        let allCount = parseFloat((weight * num).toFixed(2))
        this.setData({
            allCount,
            sumPrice,
            detailList
        })
    },

    cusCountAll() {
        const { num, propsCusTomsDataSkuModal: { clickedObj: { weight } } } = this.data
        let allCount = parseFloat((weight * num).toFixed(2))
        this.setData({
            allCount
        })
    },

    countAll() {
        const { mode } = this.data
        if (mode === `1`) {
            this.defCountAll()
        }
        if (mode === `2`) {
            this.cusCountAll()
        }
    },

    getAttr(obj, str) {
        let attr = ``
        for (let key in obj) {
            if (key === str) {
                attr = obj[key]
            }
        }
        return attr
    },

    changeSku(options) {
        if (!options || !options.extend_attr) {
            return options
        }
        if (options.extend_attr) {
            options.extend_attrs = JSON.parse(options.extend_attr)
            options.diameterLength = this.getAttr(options.extend_attrs, `diameterLength`)
            options.faceWidth = this.getAttr(options.extend_attrs, `faceWidth`)
            options.length = this.getAttr(options.extend_attrs, `length`)
            options.ringHand = this.getAttr(options.extend_attrs, `ringHand`)
        }
        return options
    },

    cusGetSku() {
        const { trueCusToms: { id, errorRange, feeType, price }, propsDataSku: { proId, id: saleId }, propsCusTomsDataSkuModal: { propsData: { oneItemsCode }, clickedObj: { conditi, weight, ringHand, length, diameterLength } } } = this.data
        let params = {
            id,
            proId,
            conditi,
            weight,
            errorRange,
            ringHand,
            feeType,
            price,
            saleId,
            length,
            diameterLength
        }
        app.$api.produceAddDesc(params).then(res => {
            let trueSku = this.changeSku(res.data)
            this.data.trueSku = trueSku || {}
            this.getParams()
            this.addTrolley()
        })
    },
 
    // 获取标准款参数
    getParams() {
        if (JSON.stringify(this.data.trueSku) === JSON.stringify({})) {
            // app.$u.showToast(``)
            return
        }
        let accessory = []
        let { trueSku: { skunum: skuNum, weight }, propsDataSkuModal: { auxiliariesList = [] }, num: totalSum, remark: productRemarks, propsDataSku: { proNumber: proNo, oneItemsCode: oneCode, oneItemsCodeName: one, } } = this.data
        accessory = JSON.stringify(auxiliariesList.filter(item => item.checked))
        let params = {
            oneCode,
            one,
            isUpdata: 1,
            suit: 1,
        }

        let singleCartFroms = [{
            accessory,
            proNo,
            skuNum,
            totalSum,
            weight,
            productRemarks
        }]

        params = { ...params, ...{ singleCartFroms } }
        this.setData({
            params
        })
    },

    createdParams() {
        const { mode } = this.data
        if (mode === `1`) {
            this.deAddTrolley()
        }
        if (mode === `2`) {
            this.cusGetSku()
        }
    },

    valiCusStatus() {
        const { propsCusTomsDataSkuModal, mode } = this.data
        if (!propsCusTomsDataSkuModal.propsData && mode === `2`) {
            app.$u.showToast(`请选择可做规格`)
            return false
        }
        return true
    },

    // 点击加入购物车todo
    clickAddCart() {
        if (!this.valiCusStatus()) {
            return
        }
        this.popuShow()
    },

    deAddTrolley() {
        this.getParams()
        this.addTrolley()
    },

    // 验证加入购物车
    valiData() {
        const { params } = this.data
        if (JSON.stringify(params) === JSON.stringify({})) {
            app.$u.showToast(`请选择产品规格`)
            return
        }
        const { params: { singleCartFroms: [{ skuNum }] } } = this.data
        if (!skuNum) {
            app.$u.showToast(`请选择产品规格`)
            return false
        }
        return true
    },

    // 加入购物车 todo
    addTrolley() {
        if (!this.valiData()) {
            return
        }
        const { params, num } = this.data
        let { shopCount } = this.data
        if (parseInt(num) === 0) {
            app.$u.showToast('数量不能为0，请重新输入！')
            return
        }

        app.$u.showModal(`确定加入购物车？`).then(ele => {
            app.$u.showLoading()
            app.$api.addBigSingleCartApp(params).then(res => {
                app.$u.showToast('加入购物车成功')
                this.closePopupSku();
                this.setData({
                    shopCount: shopCount += num,
                    remark: ''
                })
            })
        })
    },

    goShop() {
        wx.switchTab({
            url: '/pages/shop/shop',
        })
    },

    reset() {
        app.$u.showModal('确认重置数据吗？').then(res => {
            this.getData()
            this.resetData()
        })
    },

    // 重置数据
    resetData() {
        this.setData({
            arrParamsList: [],
            allCount: 0,
            allWeight: 0,
            allPrice: 0,
            shopCount: 0,
            onItemTrue: {}
        })
    },

    getTag(data) {
        const { alias } = data.pro
        this.setData({
            tagVal: alias ? alias : ''
        })
    },

    // justTabList(options) {
    //   let { tabList } = this.data
    //   if(options.length !== 0) {
    //     return 
    //   }
    //   tabList[1].show = false
    //   this.setData({
    //     tabList
    //   })
    // },

    getDetail() {
        // xl-00223
        // ghfgnh 项链
        // danscns20190703 圈口
        // sjy-jz-010 戒指
        // 111-test-sale001
        // app.$api.produceInfo({ proNum: 'sjy-jz-010' }).then(res => {
        app.$api.produceInfo({ proNum: this.data.proNum }).then(res => {
            // let res = $prodm
            const { pro, pro: { customSpeciList }, coverimg = '', video = '' } = res.data
            this.selectDialog = new dialog(pro)
            this.selectDialog.getCanDo()
            this.showDialog()

            // 得到产品标签
            this.getTag(res.data)

            // 控制是否显示可做规格
            // this.justTabList(customSpeciList)

            this.setData({
                video,
                coverimg,
                propsDataSku: pro,
                canDo: this.selectDialog.getCanDo(),
                textMessage: pro.text
            })
            this.slideVideo = wx.createVideoContext("slideVideo")
            WxParse.wxParse('article', 'html', pro.text, this, 0);
        })
    },

    //加入收藏
    slideCollect(e) {
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


    getData() {
        this.getDetail()
    },

    // 获取标准规格sku
    getSkuFilter(e) {
        const detail = e.detail
        this.setData({
            trueSku: detail.trueSkuList.length === 1 ? detail.trueSkuList[0] : {},
            propsDataSkuModal: detail
        })
        this.countAll()
    },

    // 获取标准规格弹窗sku
    getSkuFilterModal(e) {
        const detail = e.detail
        this.setData({
            trueSku: detail.trueSkuList.length === 1 ? detail.trueSkuList[0] : {},
            propsDataSkuModal: detail
        })
        this.countAll()
        this.isShowInput()
    },

    // 获取自定义规格弹窗sku
    getCusTomSkuFilterModal(e) {
        const detail = e.detail
        const { trueCusToms = `` } = detail
        this.setData({
            trueCusToms,
            propsCusTomsDataSkuModal: detail
        })
        this.countAll()
        this.isShowInput()
    },

    // 获取自定义规格sku
    getCusTomSkuFilter(e) {
        this.setData({
            propsCusTomsDataSkuModal: e.detail
        })
    },

    // 选择可做规格
    chooseSpec(e) {
        const { index } = e.currentTarget.dataset
        if (index === 0) {
            this.selectDialog.clickedWeight()
        }
        if (index === 1) {
            this.selectDialog.clickedOther()
        }
        // this.countAll();
        this.showDialog()
    },

    // 点击规格选项
    dialogSpecClick(e) {
        const { item, index } = e.currentTarget.dataset
        const canDo = this.selectDialog.selectcloseDialog(index).getCanDo()
        const { trueSku: customsSkuObj } = canDo
        this.setData({
            customsSkuObj,
            canDo
        })
    },

    // 展示规格弹窗
    showDialog() {
        const { canDo } = this.data
        canDo.dialog.propShow = true
        this.setData({
            canDo,
        })
    },

    // 隐藏规格弹窗
    hideDialog() {
        const { canDo } = this.data
        canDo.dialog.propShow = false
        this.setData({
            canDo,
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
    initDialog() {
        this.setData({
            canDo: this.selectDialog.getCanDo()
        })
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
 
    popuShow() {
        let self = this
        this.setData({
            popuStatus: true,
            num: 1,
            // remark: ``,
            weightSE: this.data.weightSE
        })
        setTimeout(() => {
            self.animation.height('260rpx').step()
            self.setData({
                isStopBodyScroll: true,
                animationData: self.animation.export()
            })
        }, 0)
    },
    //点击规格
    popuShowTwo() {
        let self = this
        this.setData({
            popuStatus: true,
            num: 1,
            remark: ``
        })
        setTimeout(() => {
            self.animation.height('260rpx').step()
            self.setData({
                isStopBodyScroll: true,
                animationData: self.animation.export()
            })
        }, 0)
    },

    onReady() {
        this.animation = wx.createAnimation()
    },

    onLoad(options) {
        // this.getData()

        if (options.proNum) {
            this.setData({
                proNum: options.proNum
            })
            this.getData()
        }
    },

})