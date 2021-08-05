let CryptoJS = require('../utils/aes.js').CryptoJS
import $u from '../utils/util.js'

// 改版后的拦截规则 全部逻辑根据http状态码判断
// 说明详细地址 http://192.168.16.20/dev-document/dev-doc/blob/master/docs/HTTP%E7%8A%B6%E6%80%81%E7%A0%81%E8%AF%B4%E6%98%8E.md
class InterceptorsStatus {
    constructor(options) {
        const status = options.statusCode;
        this.info = options;
        this.statusMap = new Map()
            .set(200, "requestSuccess")
            .set(401, "noPermissions")
            .set(403, "noLogin")
            .set(404, "interfaceNotFound")
            .set(405, "functionError")
            .set(406, "paramsError")
            .set(500, "serverError");
        if (this.statusMap.has(status)) {
            this[this.statusMap.get(status)]();
        }
    }

    // 业务完成
    requestSuccess() {
        // console.log("接口调用成功");
    }

    // 无权限
    noPermissions() {
        $u.showToast("接口无权限")
    }

    // 未登录
    noLogin() {
        setTimeout(() => {
            wx.reLaunch({
                url: '/pages/login/login'
            })
        }, 800)
    }

    // 接口不存在
    interfaceNotFound() {
        Message.error("接口不存在");
    }

    // 请求方式错误
    functionError() {
        $u.showToast("请求方式错误")
    }

    // 参数错误
    paramsError() {
        $u.showToast(this.info.data)
    }

    // 服务器错误
    serverError() {
        $u.showToast("服务器错误")
    }
}


//  加密aes  
let crypto = {

    Encrypt: (word) => {
        var key = CryptoJS.enc.Utf8.parse("acdwessdbatar123");
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },

    decrypt: (word) => {
        var key = CryptoJS.enc.Utf8.parse("acdwessdbatar123");
        var decrypt = CryptoJS.AES.decrypt(word, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    }
}

class Api {
    constructor() {
        const environment = 'product'; // dev = 开发 | test = 测试 | demo = 演示环境 | product = 生产环境
        switch (environment) {
            case 'dev':
                // this.baseUrl = 'https://front.batar.cn/';
                this.baseUrl = 'http://192.168.16.9:8091/';
                this.$img = 'https://img.batar.cn/';
                break;
            case 'test':
                this.baseUrl = 'http://192.168.16.8:8241/';
                // this.baseUrl = 'http://192.168.33.82:8081/';
                this.$img = 'https://demo.img.batar.cn/';
                break;
            case 'demo':
                this.baseUrl = 'https://demo.oms.f.batar.cn/';
                this.$img = 'https://demo.img.batar.cn/';
                break;
            case 'product':
                this.baseUrl = 'https://hh.f.ezgold.cn/';
                this.$img = 'https://image.szsjysy.com/';
                break;
        }

        this.interceptObj = (options) => {
            let obj = {
                200: `hanld200`,
                203: `hanld203`,
                205: `hanld205`,
                def: `hanldDef`
            }
            return $u.switchs(options, obj, `hanldDef`)
        }

        this.resposeData = {}
    }

    // 公用请求头方法
    setHeader(form) {
        let addHeader = {
            accessToken: wx.getStorageSync('accessToken') && crypto.Encrypt(`${new Date().getTime()},${wx.getStorageSync('accessToken')}`),
            clientType: 'HH_QT_WXAPP'
        }
        let obj = {
            'Content-type': `application/x-www-form-urlencoded`
        }
        if (form) {
            addHeader = Object.assign(addHeader, obj)
        }
        return addHeader
    }

    // 公用拦截
    intercept(res, resolve, reject) {
        new InterceptorsStatus(res)
        wx.hideLoading()
        wx.stopPullDownRefresh()
        const {
            code,
            data
        } = res.data
        this.resposeData = res.data
        this[this.interceptObj(code)](resolve, reject)
    }

    // 公用拦截200
    hanld200(resolve) {
        resolve(this.resposeData)
    }

    // 公用拦截203
    hanld203(resolve, reject) {
        const {
            msg
        } = this.resposeData
        reject(this.resposeData)
        $u.showToast(msg)
        setTimeout(() => {
            // wx.navigateTo({
            //     url: '/pages/login/login',
            // })
            wx.reLaunch({
                url: '/pages/login/login'
            })
        }, 800)
    }

    // 公用拦截204
    hanld205(resolve, reject) {
        resolve(this.resposeData)
    }

    // 公用拦截其他状态码
    hanldDef(resolve, reject) {
        const {
            msg
        } = this.resposeData
        reject(this.resposeData)
        $u.showToast(msg)
    }

    get(url, params, needToken) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                data: params,
                header: this.setHeader(),
                success(res) {
                    api.intercept(res, resolve, reject)
                },
            })
        })
    }

    getLoop(url, params, needToken) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                data: params,
                header: this.setHeader(),
                success(res) {
                    wx.hideLoading()
                    const {
                        code
                    } = res.data
                    code === 200 && resolve(res.data)
                }
            })
        })
    }

    post(url, params, needToken) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                method: 'POST',
                data: params,
                header: this.setHeader(true),
                success(res) {
                    api.intercept(res, resolve, reject)
                }
            })
        })
    }

    postJson(url, params, needToken) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                method: 'POST',
                data: params,
                header: this.setHeader(),
                success(res) {
                    api.intercept(res, resolve, reject)
                }
            })
        })
    }

    updataAvatar(url, params) {
        return new Promise((resolve, reject) => {
            wx.chooseImage({
                count: 1,
                success(res) {
                    let tempFilePaths = res.tempFilePaths
                    wx.uploadFile({
                        url: this.baseUrl + url,
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: params,
                        header: this.setHeader(),
                        success(res) {
                            res = JSON.parse(res.data)
                            resolve(res)
                        },
                        fail() {
                            wx.showToast({
                                icon: 'none',
                                title: '上传失败',
                            })
                        }
                    })
                }
            })
        })
    }

    /**
     * Api列表 
     */

    // 上传图片
    commonUploadImg(params) {
        return api.updataAvatar('uploadImg', params)
    }

    // 海生 todo
    // 添加购物车
    addCarts(params) {
        return api.post('cart/addCarts', params)
    }

    // 修改购物车数量
    cartUpdataGuestCartNumber(params) {
        return api.get('cart/updataGuestCartNumber', params)
    }

    // 和合加入购物车
    addBigSingleCart(params) {
        return api.postJson('cart/addBigSingleCart', params)
    }

    // 和合加入购物车套装
    tzaddBigSingleCart(params) {
        return api.postJson('cart/TZaddBigSingleCart', params)
    }

    // 和合查询购物车
    findBigAppletCarts(params) {
        return api.get('cart/findBigAppletCarts', params)
    }

    // 和合查询购物车
    findBigAppletCartsApp(params) {
        return api.get('cart/findBigAppletCartsApp', params)
    }

    // 和合删除购物车
    delectBigSigleCart(params) {
        return api.postJson('cart/delectBigSigleCart', params)
    }

    // 购物车回填
    findBigSuitCartInfoById(params) {
        return api.get('cart/findBigSuitCartInfoById', params)
    }

    // 查询购物车
    findAppletCarts(params) {
        return api.get('cart/findAppletCarts', params)
    }

    // 购物车下单到确认页面
    orderSureBigSuitOrders(params) {
        return api.postJson('order/sureBigSuitOrders', params)
    }

    // 购物车下单到确认页面
    orderSureBigSuitOrdersApp(params) {
        return api.postJson('order/sureBigSuitOrdersApp', params)
    }

    // 购物车删除
    delectBigSigleCart(params) {
        return api.postJson('cart/delectBigSigleCart', params)
    }

    // 重新采购确认下单


    // 和合百泰小程序购物车下单
    orderOverAppletBigOrders(params) {
        return api.postJson('order/overAppletBigOrders', params)
    }

    // 和合百泰小程序查询订单模块
    orderFindBigOrderListInfo(params) {
        return api.get('order/findBigOrderListInfo', params)
    }

    // 小程序查询订单详情
    selectBigGuestOrderDetailInfo(params) {
        return api.get('order/selectBigGuestOrderDetailInfo', params)
    }

    // 小程序查询订单详情
    selectBigGuestOrderDetailInfoApp(params) {
        return api.get('order/selectBigGuestOrderDetailInfoApp', params)
    }


    // 小程序取消订单
    cancelBigGuestOrderIpad(params) {
        return api.get('order/cancelBigGuestOrderIpad', params)
    }

    // 小程序再次购买确认页面
    onceAgainSureBigOrders(params) {
        return api.get('order/onceAgainSureBigOrders', params)
    }

    // 小程序再次下单页面
    onceAgainBuyBigOrders(params) {
        return api.post('order/onceAgainBuyBigOrders', params)
    }

    // 小程序快速下单确认页面
    sureSpeedBigOrderStand(params) {
        return api.postJson('order/sureSpeedBigOrderStand', params)
    }

    // 小程序快速下单
    overSpeedBigOrders(params) {
        return api.postJson('order/overSpeedBigOrders', params)
    }

    // 来货单列表
    selectBigBillOrderList(params) {
        return api.get('order/selectBigBillOrderList', params)
    }

    // 来货单详情
    selectBigBillOrderDetailInfo(params) {
        return api.get('order/selectBigBillOrderDetailInfo', params)
    }

    // // 和合查询单品
    // findSuitCartById(params) {
    //   return api.get('cart/findSuitCartById', params)
    // }

    // 和合确认下单页面
    sureSuitOrders(params) {
        return api.get('order/sureSuitOrders', params)
    }

    // 和合购物车下单
    overAppletOrders(params) {
        return api.get('order/overAppletOrders', params)
    }

    // 和合删除购物车
    deleteSuitCarts(params) {
        return api.get('cart/deleteSuitCarts', params)
    }

    // 和合重新采购
    onceAgainBuySuitOrders(params) {
        return api.post('order/onceAgainBuySuitOrders', params)
    }

    // 查询购物车
    findCarts(params) {
        return api.get('cart/findCarts', params)
    }

    // 修改
    cartUpdataMakeCarts(params) {
        return api.post('cart/updataMakeCarts', params)
    }

    // 删除购物车
    deleteCarts(params) {
        return api.get('cart/deleteCarts', params)
    }

    // 删除购物车产品属性
    deleteCartProperty(params) {
        return api.post('cart/deleteCartProperty', params)
    }

    // 客制单购物车添加
    addMakeCarts(params) {
        return api.post('cart/addMakeCarts', params)
    }

    // 客制单购物车查询
    findMakeCarts(params) {
        return api.get('cart/findMakeCarts', params)
    }

    // 删除购物车客制单数据
    deleteMakeCartByIds(params) {
        return api.post('cart/deleteMakeCartByIds', params)
    }

    // 删除购物车客制单的产品属性数据
    deleteMakeProducPerById(params) {
        return api.post('cart/deleteMakeProducPerById', params)
    }

    // 标准单快速单
    cartSureOrdersSpeed(params) {
        return api.post('order/sureOrdersSpeed', params)
    }

    // 标准单购物车进入确认下单
    orderSureOrders(params) {
        return api.post('order/sureOrders', params)
    }

    // 克制单购物车进入确认下单
    orderSureKZOrders(params) {
        return api.post('order/sureKZOrders', params)
    }

    // 查询购物车单条数据
    cartFindCartById(params) {
        return api.get('cart/findCartById', params)
    }

    // 查询克制单购物车单条数据
    cartFindCartMakeById(params) {
        return api.get('cart/findCartMakeById', params)
    }

    // 标准购物车创建订单
    orderOverOrders(params) {
        return api.post('/order/overOrders', params)
    }

    // 客制单购物车创建订单
    orderOverKZOrders(params) {
        return api.post('order/overKZOrders', params)
    }

    // 快速下单创建订单
    orderSpeedOrderStand(params) {
        return api.post('order/speedOrderStand', params)
    }

    // 采购单查询
    orderFindOrderDetailByUserId(params) {
        return api.post('order/findOrderDetailByUserId', params)
    }

    // 克制单查询
    orderFindOrderMakeDetailByMap(params) {
        return api.post('order/findOrderMakeDetailByMap', params)
    }

    // 标准单订单详情
    selectOrderDetailByOrderNo(params) {
        return api.post('order/selectOrderDetailByOrderNo', params, false)
    }

    // 克制单订单详情（新单）
    selectOrderMakeDetailByOrderNo(params) {
        return api.post('order/selectOrderMakeDetailByOrderNo', params, false)
    }

    // 克制单订单详情(原单)
    selectOrderMakeDetail(params) {
        return api.post('order/selectOrderMakeDetail', params)
    }

    // 采购单删除订单
    deleteOrders(params) {
        return api.post('order/deleteBigGuestOrder', params)
    }

    // 定值单删除订单 
    deleteOrdersMake(params) {
        return api.post('order/deleteOrdersMake', params)
    }

    // 取消订单
    orderCancelOrderStatus(params) {
        return api.post('order/cancelOrderStatus', params)
    }

    // 克制单取消订单
    cancelOrdersMake(params) {
        return api.post('order/cancelOrdersMake', params)
    }

    // 克制单确认订单
    operateOrderMake(params) {
        return api.post('order/operateOrderMake', params)
    }

    // 再来一单 标准单
    oneAgaentOrders(params) {
        return api.post('order/oneAgaentOrders', params)
    }

    // 再来一单 克制单
    oneAgaentOrderMake(params) {
        return api.post('order/oneAgaentOrderMake', params)
    }

    // 重新采购 标准单
    onceAgainBuyOrders(params) {
        return api.post('order/onceAgainSureBigOrders', params)
    }

    // 重新采购 克制单
    onceAgainBuyOrdersMake(params) {
        return api.post('order/onceAgainBuyOrdersMake', params)
    }

    // 重新采购下单 克制单
    orderMakeStand(params) {
        return api.post('order/orderMakeStand', params)
    }

    // 白怡波
    selectOrderDetailActiveByOrderNo(params) {
        return api.post('order/selectOrderDetailActiveByOrderNo', params)
    }

    // 基本工费
    accountBaseWagePrice(params) {
        return api.get('stock/account/baseWagePrice', params)
    }

    // 申请退货
    addOReturnOrders(params) {
        return api.post('returnOrder/addOReturnOrders', params)
    }

    // 退货列表
    returnOrdersList(params) {
        return api.post('returnOrder/findReorderByStaAndComId', params)
    }

    // 退货详情
    returnOrdersFrom(params) {
        return api.get('returnOrder/ReturnOrdersFrom', params)
    }

    // 取消退货
    cancelReturnOrders(params) {
        return api.get('returnOrder/cancelReturnOrders', params)
    }

    // 重新退货
    newReturnOrder(params) {
        return api.get('returnOrder/newReturnOrder', params)
    }

    // 夏文浩
    // 和合首页
    prosIndex(params) {
        return api.post('pro/s/index', params)
    }

    // 和合首页系列列表
    proSeriesList(params) {
        return api.get('pro/seriesList', params)
    }

    // 首页产品
    // proIndex(params) {
    //   return api.post('pro/index', params)
    // }

    // 产品详情
    proInfo(params) {
        return api.get('pro/info', params)
    }

    // 首页分类
    proCode(params) {
        return api.get('code/index', params)
    }

    // banner
    proBanner(params) {
        return api.get('pro/banner', params)
    }

    //主题系列
    getProductTheme() {
        return api.post('app/produce/theme', {})
    }

    // 点击收藏
    collClick(params) {
        return api.get('coll/click', params)
    }

    // 我的收藏
    collList(params) {
        return api.get('coll/list', params)
    }

    // 标准单
    codeStandard(params) {
        return api.get('code/standard', params)
    }

    // 标准单搜索
    proStandard(params) {
        return api.post('pro/standard', params)
    }

    // 客制单
    codeGuest(params) {
        return api.get('code/guest', params)
    }

    // 陈祥林 todo
    // 热销列表-(4)
    produceHotSale(params) {
        return api.post('app/produce/hotSale', params)
    }

    // 查询热销更多
    produceHotSaleList(params) {
        return api.post('app/produce/hotSaleList', params)
    }

    // 获取新品列表
    produceNewSaleList(params) {
        return api.post('app/produce/newSaleList', params)
    }

    // 查询臻品列表(-4)
    themeSeriesSaleList(params) {
        return api.post('app/produce/themeSeriesSaleList', params)
    }

    // 查询硬金列表
    produceSGold(params) {
        return api.post('app/produce/s/gold', params)
    }

    // 查询其他品类列表
    produceSIndex(params) {
        return api.post('app/produce/s/index', params)
    }
    // 获取产品列表
    produceIndex(params) {
        // return api.post('app/produce/index', params)
        return api.post('app/produce/hotSaleList', params)
    }

    produceCodeList(params) {
        return api.get('app/produce/codeList', params)
    }

    // 获取页面一级系列列表
    produceFindSeries(params) {
        return api.get('app/produce/findSeries', params)
    }

    // 产品详情
    produceInfo(params) {
        return api.get('app/produce/info', params)
    }

    // 获取收藏列表
    produceList(params) {
        return api.get('app/produce/list', params)
    }

    // 新增或删除收藏
    produceClick(params) {
        return api.get('app/produce/click', params)
    }

    // 新增或删除收藏
    produceCount(params) {
        return api.get('app/produce/count', params)
    }

    // 查询快速下单产品列表
    produceStandard(params) {
        return api.post('app/produce/standard', params)
    }

    // 查询快速下单-标准单产品条件列表
    produceStandards(params) {
        return api.get('app/produce/standards', params)
    }

    // 查询快速下单-定制单产品条件列表
    produceGuest(params) {
        return api.get('app/produce/guest', params)
    }

    // 获取下拉品类接口
    produceOne(params) {
        return api.get('app/produce/one', params)
    }

    // 根据一级系列获取二级系列
    produceFindTwoSeriess(params) {
        return api.get('app/produce/findTwoSeriess', params)
    }

    // 据条件查询对应的产品数据(二级系列页面)
    produceGetListseriesSubclass(params) {
        return api.post('app/produce/getListseriesSubclass', params)
    }

    // 新增-修改标签名称
    produceAddDesc(params) {
        return api.post('app/produce/addDesc', params)
    }

    // 郭志刚
    // 用户登录
    accountLogin(params) {
        return api.post('account/login', params)
    }

    // 用户退出
    accountLogout(params) {
        return api.get('account/logout', params)
    }

    // 查看用户信息
    accountMyinfo(params) {
        return api.get('account/getinfo', params)
    }

    // 修改当前用户信息
    accountUpdateInfo(params) {
        return api.post('account/updateInfo', params)
    }

    // 修改头像
    companyUpdateLogo(params) {
        return api.get('company/updateLogo', params)
    }

    // 修改密码
    accountChangePassword(params) {
        return api.post('account/changePassword', params)
    }

    // 收货地址 
    deliveryDeliveryInfo(params) {
        return api.get('delivery/deliveryInfo', params)
    }

    // 查询默认收获地址
    deliveryDefaultDelivery(params) {
        return api.get('delivery/defaultDelivery', params)
    }

    // 根据id查询地址
    deliveryQueryDelivery(params) {
        return api.get('delivery/queryDelivery', params)
    }

    // 创建收获地址
    deliveryCreateDelivery(params) {
        return api.post('delivery/createDelivery', params)
    }

    // 修改收货地址
    deliveryUpdateDelivery(params) {
        return api.post('delivery/updateDelivery', params)
    }

    // 删除地址
    deliveryDeleteDelivery(params) {
        return api.get('delivery/deleteDelivery', params)
    }

    // 查看自己公司信息
    companySimpleinfo(params) {
        return api.get('company/simpleinfo', params)
    }

    // 修改公司信息
    companyUpdateMyCompany(params) {
        return api.post('company/updateMyCompany', params)
    }

    // 查看公司职员帐号
    accountSub(params) {
        return api.post('account/sub', params)
    }

    // 编辑公司职员帐号信息
    accountUpdateSub(params) {
        return api.post('account/updateSub', params)
    }

    // 创建职员帐号(子帐号)
    accountCreateSub(params) {
        return api.post('account/createSub', params)
    }

    // 查看公司角色列表
    companyQueryRoles(params) {
        return api.post('company/queryRoles', params)
    }

    // 创建订单获取id
    companyQuerySubsidiaryId(params) {
        return api.get('company/querySubsidiaryId', params)
    }

    // 查看未读消息数
    msgUnreadCount(params) {
        return api.getLoop('msg/unreadCount', params, false)
    }

    // 查看消息
    msgQueryMsg(params) {
        return api.post('msg/queryMsg', params)
    }

    // 查看消息的筛选条件
    msgFiltrate(params) {
        return api.post('msg/filtrate', params)
    }

    // 点击消息改变状态
    msgSetRead(params) {
        return api.get('msg/setRead', params)
    }

    // 删除消息
    msgDelMsg(params) {
        return api.get('msg/delMsg', params)
    }

    // 批量删除消息
    msgDelMsgBatch(params) {
        return api.get('msg/delMsgBatch', params)
    }

    // 微信小程序自动登录
    wxAppLogin(params) {
        // return api.get('wx/appLogin', params, false)
        return api.get('wx/appLogin', params)
    }

    // 微信小程序绑定用户
    wxWxBinding(params) {
        // return api.get('wx/wxBinding', params, false)
        return api.get('wx/wxBinding', params)
    }

    // 微信小程序切换账号
    wxWxSwitch(params) {
        // return api.get('wx/switch', params, false)
        return api.get('wx/switch', params)
    }

    // 白怡波
    // 申请退货
    addOReturnOrders(params) {
        return api.post('returnOrder/addOReturnOrders', params)
    }

    // 确认下单页面存欠
    stockAccountOrder(params) {
        return api.get('stock/account/currentaccountByPhone', params)
    }


    // 退货列表
    returnOrdersList(params) {
        return api.post('order/selectBackOrderInfo', params)
    }

    // 退货详情
    returnOrdersFrom(params) {
        return api.get('order/selectBackOrderInfoDetail', params)
    }

    // 取消退货
    cancelReturnOrders(params) {
        return api.get('returnOrder/cancelReturnOrders', params)
    }

    // 重新退货
    newReturnOrder(params) {
        return api.get('returnOrder/newReturnOrder', params)
    }

    // 展销活动列表
    exhibitActiveList(params) {
        return api.post('exhibitActive/exhibitActiveList', params)
    }

    // 展销活动列表（展销单选择）
    exhibitActivePass(params) {
        return api.get('exhibitActive/exhibitActivePass', params)
    }

    // 删除展销活动
    deleteByExhibitId(params) {
        return api.get('exhibitActive/deleteByExhibitId', params)
    }

    // 申请展销活动
    insertExhibitActive(params) {
        return api.post('exhibitActive/insertExhibitActive', params)
    }

    // 根据展销活动查询展销单
    findExhibitOrderDeail(params) {
        return api.get('exhibitActive/findExhibitOrderDeail', params)
    }

    // 新增—客户展销单
    addexhibitorder(params) {
        return api.get('exhibitActive/addexhibitorder', params)
    }

    // 展销单列表
    findReorderByStaAndComId(params) {
        return api.get('exhibitActive/findReorderByStaAndComId', params)
    }

    // 展销单表单
    exhibitorderFrom(params) {
        return api.get('exhibitActive/ExhibitorderFrom', params)
    }

    // 默认最新的展销活动
    findExhibitActiveNew(params) {
        return api.get('exhibitActive/findExhibitActiveNew', params)
    }

    // 取消展销单
    cancelExhibitorder(params) {
        return api.get('exhibitActive/cancelExhibitorder', params)
    }

    // 展销单
    getExhibitActiveDeail(params) {
        return api.get('exhibitActive/getExhibitActiveDeail', params)
    }

    // 获取展销活动列表
    selectExhibitActive(params) {
        return api.get('order/selectExhibitActive', params)
    }

    // 可做规格转变为标准规格(小程序)
    produceAddSpec(params) {
        return api.postJson('app/produce/addSpec', params)
    }

    // 获取推广设置列表
    promoteList(params) {
        return api.get('app/produce/promoteList', params)
    }

    // 门店查询业务员信息
    queryMyClerk(params) {
        return api.get('account/queryMyClerk', params)
    }

    // 获取预告列表
    advanceNoticeAppList(params) {
        return api.post('advanceNoticeApp/list', params)
    }

    // 获取预告详情
    advanceNoticeAppGet(params) {
        return api.post('advanceNoticeApp/get', params)
    }

    // banner列表
    appBannerList(params) {
        return api.get('bannerApp/appBannerList', params)
    }

    // banner 富文本
    bannerAppGet(params) {
        return api.post('bannerApp/get', params)
    }

    // 获取消息通知
    appMsgNotice(params) {
        return api.get('msgNoticeApp/appMsgNotice', params)
    }

    // 根据id获取品牌资讯接口
    brandReferGet(params) {
        return api.post('AppBrandRefer/get', params)
    }

    // 获取品牌资讯列表--首页查询五条数据
    brandReferList(params) {
        return api.post('AppBrandRefer/list', params)
    }

    // 获取品牌资讯列表--更多数据
    brandReferLists(params) {
        return api.post('AppBrandRefer/lists', params)
    }

    // 根据id获取资讯课堂接口
    consultClassroomGet(params) {
        return api.post('consultClassroomApp/get', params)
    }

    // 根据id获取资讯课堂管理评论列表接口
    consultClassroomComment(params) {
        return api.post('consultClassroomApp/getComment', params)
    }

    // 获取资讯课堂列表
    consultClassroomList(params) {
        return api.post('consultClassroomApp/list', params)
    }

    // 获取资讯课堂列表--更多数据
    consultClassroomLists(params) {
        return api.post('consultClassroomApp/lists', params)
    }

    // 获取资讯课堂列表--新增评论
    consultClassroomCommentAdd(params) {
        return api.post('consultClassroomApp/commentAdd', params)
    }

    // 获取资讯课堂列表--取消点赞
    consultClassroomCommentCancel(params) {
        return api.post('consultClassroomApp/commentCancel', params)
    }

    // 根据id获取知识课堂接口
    knowledgeClassroomGet(params) {
        return api.post('knowledgeClassroomApp/get', params)
    }

    // 根据id获取知识课堂管理评论列表接口
    knowledgeClassroomLabel(params) {
        return api.post('knowledgeClassroomApp/getLabel', params)
    }

    // 获取知识课堂列表
    knowledgeClassroomList(params) {
        return api.post('knowledgeClassroomApp/list', params)
    }

    // 获取知识课堂列表--更多数据
    knowledgeClassroomLists(params) {
        return api.post('knowledgeClassroomApp/lists', params)
    }

    //  根据id获取系列接口
    getSeries(params) {
        return api.post('themeSeriesApp/getSeries', params)
    }

    //  根据系列查询对应的产品接口
    getSeriesList(params) {
        return api.post('themeSeriesApp/getSeriesList', params)
    }

    //  根据id获取主题推广接口
    getTheme(params) {
        return api.post('themeSeriesApp/getTheme', params)
    }

    //  根据主题查询对应的产品接口
    getThemeList(params) {
        return api.post('themeSeriesApp/getThemeList', params)
    }

    //  获取系列推广产品列表
    listSeries(params) {
        return api.post('themeSeriesApp/listSeries', params)
    }

    //  获取主题推广列表
    listTheme(params) {
        return api.post('themeSeriesApp/listTheme', params)
    }

    // 巡店列表
    planList(params) {
        return api.post('shopPlanApp/planList', params)
    }

    // 巡店详情
    patrolDetail(params) {
        return api.post('shopPlanApp/getReport', params)
    }

    // 提交反馈
    saveFeedback(params) {
        return api.post('shopPlanApp/saveFeedback', params)
    }

    // 添加购物车
    addBigSingleCartApp(params) {
        return api.postJson('cart/addBigSingleCartApp', params)
    }
}





let api = new Api()

export default api