const app = getApp()
const proCount = app.$productCount

const nowTime = app.$d(new Date()).format('YYYY-MM-DD')

Page({
    data: {
        loadingStatu: false,
        $img: app.$img,
        nowTime,
        imgdDetail: {
            a: '/images/shopcart/icon-up.png',
            b: '/images/shopcart/icon-down.png',
        },
        cusImgRemark: {
            a: '/images/order/icon-gup.png',
            b: '/images/order/icon-gdown.png'
        },

        imgTit: {
            a: '/images/shop/icon-up2.png',
            b: '/images/shop/icon-down2.png',
        },

        // 控制备注显示
        remarkShow: true,

        // 展销活动显示隐藏
        exPropStatus: false,

        // 展销活动列表
        exTrueList: [],

        wordAddStatus: false,
        wordNoList: [{
            val: '无',
            cade: '',
        }],
        wordList: [
            {
                val: '厂印',
                cade: '厂印',
            },
            {
                val: '足金',
                cade: '足金',
            },
            {
                val: '足金999',
                cade: '足金999',
            },
            {
                val: '足金9999',
                cade: '足金9999',
            },
        ],
        wordPrev: '',

        startDate: `- - -`,
        endDate: `- - -`,

        lableName: false,

        newAddrStatus: false,
        params: {},

        orderRemarks: ``,

        tabList: [
            {
                text: '全部',
                val: '全部',
                checked: true,
            },
            {
                text: 'A店铺',
                val: 'A店铺',
                checked: false,
            },
            {
                text: 'B店铺',
                val: 'B店铺',
                checked: false,
            },
            {
                text: 'C店铺',
                val: 'C店铺',
                checked: false,
            }
        ],

        // 订单状态
        orderType: 1,

        // 订单类型
        orderTypeList: [
            {
                txt: `标准类型`,
                val: 1,
                checked: true
            },
            {
                txt: `展销类型`,
                val: 5,
                checked: false
            }
        ],

        // 展销活动列表
        exList: [{}, {}],

        // 当前选择展销单id
        exModalId: '',

        // 当前确定展销单id
        exhibitId: '',

        // 选中的分包店铺
        tabListIndex: 0,
        tabListItem: {},

        viewReasonStatus: false,
        blankTit: '退回原因',
        blankInfo: '',

        propShow: false, // 辅件弹窗
        auxiliariesList: [], // 辅件列表
    },

    // 打开辅件
    openAxu(e) {
        const { iindex, index, ix } = e.currentTarget.dataset
        const { list } = this.data
        let { auxiliariesList } = this.data
        auxiliariesList = list[iindex].proList[index].cartProperties[ix].auxiliariesList
        this.setData({
            propShow: true,
            auxiliariesList
        })
    },

    // 展示辅件弹窗
    showDialog() {
        const { canDo } = this.data
        canDo.dialog.propShow = true
        this.setData({
            canDo,
        })
    },

    // 隐藏辅件弹窗
    hideDialog() {
        this.setData({
            propShow: false,
            auxiliariesList: []
        })
    },


    // 切换店铺
    checkTabPanel(e) {
        const { index } = e.currentTarget.dataset
        let { tabList } = this.data
        tabList.forEach(item => item.checked = false)
        tabList[index].checked = true
        this.setData({
            tabListIndex: index,
            tabListItem: tabList[index],
            tabList,
        })
    },

    defTitChecked(e) {
        const { iindex } = e.currentTarget.dataset
        const { list } = this.data
        let item = list[iindex]
        list[iindex].checked = !item.checked
        this.setData({
            list,
        })
    },

    defDetailClick(e) {
        const { iindex, index } = e.currentTarget.dataset
        const { list } = this.data
        let item = list[iindex].proList[index]
        list[iindex].proList[index].checked = !item.checked
        this.setData({
            list,
        })
    },

    defCheckCartpf(e) {
        const { list } = this.data
        const { iindex, index, ix } = e.currentTarget.dataset
        if (list[iindex].proList[index].cartProperties[ix].checked) {
            list[iindex].proList[index].cartProperties[ix].checked = false
        } else {
            list.forEach(item => {
                item.proList.forEach(it => {
                    it.cartProperties.forEach(iit => {
                        iit.checked = false
                    })
                })
            })
            list[iindex].proList[index].cartProperties[ix].checked = true
        }
        this.setData({
            list
        })
    },

    // 点击切换1
    // defTitChecked(e) {
    //     const { tabListItem } = this.data
    //     const { iindex } = e.currentTarget.dataset
    //     tabListItem.cartCategoryFroms[iindex].checked = !tabListItem.cartCategoryFroms[iindex].checked
    //     this.setData({
    //         tabListItem
    //     })
    // },

    // 点击切换2
    // defDetailClick(e) {
    //     const { tabListItem } = this.data
    //     const { iindex, index } = e.currentTarget.dataset
    //     tabListItem.cartCategoryFroms[iindex].cartFroms[index].checked = !tabListItem.cartCategoryFroms[iindex].cartFroms[index].checked
    //     this.setData({
    //         tabListItem
    //     })
    // },

    // 点击切换3
    // defCheckCartpf(e) {
    //     const { tabListItem } = this.data
    //     const { iindex, index, ix } = e.currentTarget.dataset
    //     if (tabListItem.cartCategoryFroms[iindex].cartFroms[index].cartPropertyFroms[ix].checked) {
    //         tabListItem.cartCategoryFroms[iindex].cartFroms[index].cartPropertyFroms[ix].checked = false
    //     } else {
    //         tabListItem.cartCategoryFroms.forEach(item => {
    //             item.cartFroms.forEach(it => {
    //                 if (it.cartPropertyFroms) {
    //                     it.cartPropertyFroms.forEach(iit => {
    //                         iit.checked = false
    //                     })
    //                 }
    //             })
    //         })
    //         tabListItem.cartCategoryFroms[iindex].cartFroms[index].cartPropertyFroms[ix].checked = true
    //     }
    //     this.setData({
    //         tabListItem
    //     })
    // },


    // 点击切换1
    refDefTitChecked(e) {
        const { tabListItem } = this.data
        const { iindex } = e.currentTarget.dataset
        tabListItem.cartCategoryFroms[iindex].checked = !tabListItem.cartCategoryFroms[iindex].checked
        this.setData({
            tabListItem
        })
    },

    // 点击切换2
    refDefDetailClick(e) {
        const { tabListItem } = this.data
        const { iindex, index } = e.currentTarget.dataset
        tabListItem.cartCategoryFroms[iindex].orderProduct[index].checked = !tabListItem.cartCategoryFroms[iindex].orderProduct[index].checked
        this.setData({
            tabListItem
        })
    },

    // 点击切换3
    refDefCheckCartpf(e) {
        const { tabListItem } = this.data
        const { iindex, index, ix, item, item: { suit } } = e.currentTarget.dataset
        let itName = suit === 1 ? 'orderBigSinglePropertyFroms' : 'suitProdctPeyFroms'
        if (tabListItem.cartCategoryFroms[iindex].orderProduct[index][itName][ix].checked) {
            tabListItem.cartCategoryFroms[iindex].orderProduct[index][itName][ix].checked = false
        } else {
            tabListItem.cartCategoryFroms.forEach(item => {
                item.orderProduct.forEach(it => {
                    if (it[itName]) {
                        it[itName].forEach(iit => {
                            iit.checked = false
                        })
                    }
                })
            })
            tabListItem.cartCategoryFroms[iindex].orderProduct[index][itName][ix].checked = true
        }
        this.setData({
            tabListItem
        })
    },

    trueNoWord(e) {
        let data = e.currentTarget.dataset
        this.data.wordNoList[data.index].checked = !this.data.wordNoList[data.index].checked
        if (!data.item.checked) {
            this.data.wordList.forEach(item => {
                item.checked = false
                item.hide = true
            })
        } else {
            this.data.wordList.forEach(item => {
                item.hide = false
            })
        }
        this.setData({
            wordNoList: this.data.wordNoList,
            wordList: this.data.wordList
        })
    },

    trueWord(e) {
        let data = e.currentTarget.dataset
        this.data.wordList[data.index].checked = !this.data.wordList[data.index].checked
        this.setData({
            wordList: this.data.wordList
        })
    },

    wordClick(e) {
        let val = e.detail.value
        if (val.trim()) {
            this.data.wordList.push({
                val: val,
                code: val
            })
        }
        this.setData({
            wordList: this.data.wordList,
            wordAddStatus: false,
            wordPrev: ''
        })
    },

    longDelWord(e) {
        let self = this;
        let data = e.currentTarget.dataset
        const { item: { val } } = e.currentTarget.dataset
        if (val === '无' || val === '厂印' || val === '足金' || val === '足金999' || val === '足金9999') {
            app.$u.showToast('该字印为默认字印无法删除')
            return
        }
        app.$u.showModal(`确定删除字印"${data.item.val}"吗？`).then(e => {
            self.data.wordList.splice(data.index, 1)
            self.setData({
                wordList: self.data.wordList
            })
        })
    },

    wordAddClick() {
        this.setData({
            wordAddStatus: !this.data.wordAddStatus
        })
    },

    getRemark(e) {
        this.data.params.orderRemarks = e.detail.value
        this.setData({
            params: this.data.params
        })
    },

    lableNameChange(e) {
        console.log(e)
        this.setData({
            lableName: e.detail.value
        })
    },

    chooseAddress(e) {
        wx.navigateTo({
            url: '/pages/address/address?way=' + 'choose',
        })
    },

    startDateEv(e) {
        this.setData({
            startDate: e.detail.value
        })
    },

    endDateEv(e) {
        this.setData({
            endDate: e.detail.value
        })
    },

    getAddr() {
        if (wx.getStorageSync('chooseAddr')) {
            let data = wx.getStorageSync('chooseAddr')
            let params = {
                addressId: data.addrId,
            }
            this.setData({
                addr: wx.getStorageSync('chooseAddr'),
                params: Object.assign(this.data.params, params)
            })
        } else {
            app.$api.deliveryDefaultDelivery().then(res => {
                if (res.data) {
                    let data = res.data,
                        params = {
                            addressId: data.addrId,
                        }
                    this.setData({
                        addr: res.data,
                        params: Object.assign(this.data.params, params)
                    })
                }
            })
        }
    },

    // 获取存欠
    getAccountOrder() {
        app.$api.stockAccountOrder().then(res => {
            this.setData({
                acountOrder: res.data
            })
        })
    },

    orderDetailClick(e) {
        console.log(e)
        let data = e.currentTarget.dataset
        if (data.item && data.item.suit === 1) {
            this.data.result.cartFromss[data.index].checked = !this.data.result.cartFromss[data.index].checked
        } else if (data.item && data.item.suit === 2) {
            this.data.result.suitProductFroms[data.index].checked = !this.data.result.suitProductFroms[data.index].checked
        } else {
            this.data.result[data.index].checked = !this.data.result[data.index].checked
        }
        this.setData({
            result: this.data.result
        })
    },

    // 重新采购数据格式转换
    refOrderData(data) {
        const { lableName, tabListItem } = this.data
        let orderBigSpeedFroms = []
        tabListItem.cartCategoryFroms.forEach(it => {
            it.orderProduct.forEach(iit => {
                if (iit.suitProdctPeyFroms) {
                    orderBigSpeedFroms.push({
                        productNo: iit.productNo,
                        suit: iit.suit,
                        outSum: iit.suitSkuSun,
                        productRemarks: iit.productRemarks,
                    })
                }
                if (iit.orderBigSinglePropertyFroms) {
                    iit.orderBigSinglePropertyFroms.forEach(iiit => {
                        orderBigSpeedFroms.push({
                            productNo: iit.productNo,
                            skuNum: iiit.skuNum,
                            suit: iit.suit,
                            outSum: iiit.orderSum,
                            productRemarks: iiit.productRemarks,
                        })
                    })
                }
            })
        })
        this.setData({
            orderBigSpeedFroms
        })
    },



    // 处理数据
    hanldParams(params) {
        let { orderBigSpeedFroms } = params
        orderBigSpeedFroms = orderBigSpeedFroms.filter(item => item.outSum !== 0)
        params.orderBigSpeedFroms = orderBigSpeedFroms
        return params
    },

    valiData(params) {
        const { orderBigSpeedFroms } = params
        const noZero = orderBigSpeedFroms.some(item => item.outSum)
        if (!noZero) {
            app.$u.showToast('退货产品不能为空')
            return false
        }
        if (!this.valiExhibit(params)) {
            return false
        }
        return true
    },

    openModalRemark(e) {
        const { item: { productRemarks: blankInfo = '' } } = e.currentTarget.dataset
        this.setData({
            blankTit: `查看备注`,
            blankInfo,
            viewReasonStatus: true
        })
    },

    valiDataDefOrderTrue(params) {
        if (!this.valiExhibit(params)) {
            return false
        }
        return true
    },

    valiExhibit(params) {
        const { orderType, exhibitId } = params
        const { allCount: { allWeight }, exTrueList } = this.data
        if (orderType === 5 && !exhibitId) {
            app.$u.showToast('请选择展销活动')
            return false
        }
        // if (exTrueList[0] && exTrueList[0].totalWeight < allWeight) {
        //   app.$u.showToast('总克重不能大于可挑选克重')
        //   return false
        // }
        return true
    },

    // 购物车下单确认下单
    defOrderTrue(data) {
        const { lableName, orderType = this.getOrderType(), exhibitId } = this.data
        let idArr = [], classId = `1`;
        this.data.cId.forEach(item => {
            idArr.push({ cId: item })
        })
        let params = {
            marking: data.marking,
            orderComeTime: data.startDate !== '- - -' ? data.startDate : '',
            orderCidFroms: idArr,
            applet: 1,
            lableName: lableName ? 2 : 1,
            orderType,
        }
        if (orderType === 1) {
            params = { ...params, ...{ exhibitId: '' } }
            classId = `1`
        }
        if (orderType === 5) {
            params = { ...params, ...{ exhibitId } }
            classId = `4`
        }
        Object.assign(data.params, params)
        console.log(data.params)
        if (!this.valiDataDefOrderTrue(params)) {
            return
        }
        app.$u.showLoading()
        app.$api.orderOverAppletBigOrders(data.params).then(res => {
            // wx.hideLoading()
            // this.setData({
            //     loadingStatu: false
            // })
            app.$u.showToast('下单成功')
            setTimeout(() => {
                wx.redirectTo({
                    url: `/pages/order/order?classId=${classId}`,
                })
            }, 500)
        }).catach(err => {
            // this.setData({
            //     loadingStatu: false
            // }) 
        })
    },

    // 购物车客制单下单确认下单
    cusOrderTrue(data) {
        let idArr = []
        this.data.mId.forEach(item => {
            idArr.push({ cId: item })
        })
        let params = {
            marking: data.wordList.join(','),
            orderComeTime: data.startDate,
            deliveryTime: data.endDate,
            orderCidFroms: idArr
        }
        Object.assign(data.params, params)
        app.$u.showLoading()
        params = { orderF: JSON.stringify(this.data.params) }
        app.$api.orderOverKZOrders(params).then(res => {
            app.$u.showToast('下单成功')
            setTimeout(() => {
                wx.redirectTo({
                    url: '/pages/order/order?classId=2',
                })
            }, 500)
        })
    },

    // 标准单重新采购下单 tododown
    refDefOrderTrue(data) {
        this.refOrderData(data)
    },

    // 快速下单
    quickOrder(data) {
        this.quickOrderData(data)
    },

    // 客制单重新采购下单
    refCusOrderTrue(data) {
        let params = {
            marking: data.wordList.join(','),
            orderComeTime: data.startDate,
            deliveryTime: data.endDate,
            orderId: data.orderId
        }
        Object.assign(data.params, params)
        app.$u.showLoading()
        params = { orderf: JSON.stringify(this.data.params) }
        app.$api.orderMakeStand(params).then(res => {
            app.$u.showToast('下单成功')
            setTimeout(() => {
                wx.redirectTo({
                    url: '/pages/order/order?classId=2',
                })
            }, 800)
        })
    },

    createorderClick() {
        app.$u.showModal(`确认下单？`).then(ele => {
            this.createorder()
        })
    },

    // 点击确认下单
    createorder() {
        let params, data = this.data, orderStandProFroms = [], marking = []
        // if (this.data.startDate === '- - -') {
        //   app.$u.showToast('请选择来款日期')
        //   return
        // }
        this.data.startDate === '- - -' && (this.data.startDate = '');
        data.wordList.forEach(item => {
            if (item.checked) {
                marking.push(item.val)
            }
        })
        data.marking = marking.join(',')
        wx.showLoading()
        this.setData({
            loadingStatu: true
        })
        if (data.dataType === 'def') {
            this.defOrderTrue(data)
        }
        if (data.dataType === 'refDef') {
            this.refDefOrderTrue(data)
        }
    },

    // 购物车下单数据 todo
    getDefData(data) {
        let ids = data.ids.join(',')
        // ids = [198, 199, 200].join(',')
        app.$api.orderSureBigSuitOrdersApp({ ids }).then(res => {
            if (res.data) {
                const { list } = res.data
                proCount.setList(list)
                proCount.changeFormatTwo()
                // 计算全部产品信息
                proCount.countAllTwo()
                this.setData({
                    list: proCount.getList()
                })
            } else {
                this.setData({
                    list: []
                })
            }
        })
    },

    // 购物车客制单下单
    getCusData(data) {
        let result, cuffLick = '', cusStyleKey, cusStyle
        app.$api.orderSureKZOrders({ mId: data.mId }).then(res => {
            result = res.data
            result.forEach(item => {
                item.productImg = item.productImg.split(',')[0]
                cusStyle = JSON.parse(item.makeProductPers[0].innerLength)
                item.makeProductPers.forEach(it => {
                    it.checked = false
                    switch (cusStyle.name) {
                        case '戒指':
                            item.cusStyleKey = `圈号范围(#)`
                            it.cusStyleItem = {
                                name: cusStyle.name,
                                value: cusStyle.value
                            }
                            break;
                        case '项链':
                            item.cusStyleKey = `链长范围(#)`
                            it.cusStyleItem = {
                                name: cusStyle.name,
                                value: cusStyle.value
                            }
                            break;
                        case '手镯':
                            item.cusStyleKey = `内径范围(#)`
                            it.cusStyleItem = {
                                name: cusStyle.name,
                                value: cusStyle.value
                            }
                            break;
                        case '手环':
                            item.cusStyleKey = `内径范围(#)`
                            it.cusStyleItem = {
                                name: cusStyle.name,
                                value: cusStyle.value
                            }
                            break;
                        case '吊坠':
                            item.cusStyleKey = false
                            break;
                        case '金条':
                            item.cusStyleKey = false
                            break;
                    }
                })
                item.type = `${item.productCs ? item.productCs : ''}${item.productArt ? '、' + item.productArt : ''}${item.productDiscrity ? '、' + item.productDiscrity : ''}`
                item.checked = false
            })
            this.setData({
                result,
            })
        })
    },

    //  标准单重新采购todo
    getRefDefData(data) {
        let result, cuffLick = ''
        app.$api.onceAgainBuyOrders({ orderNo: data.orderNo }).then(res => {
            if (res.data) {
                proCount.setList(res.data)
                proCount.changeFormatOrder()
                // 计算全部产品信息
                proCount.countAllOrder()
                this.setData({
                    tabList: proCount.getList(),
                    tabListItem: proCount.getList()[0],
                    allCount: {
                        allCount: proCount.getList()[0].sum,
                        allWeight: proCount.getList()[0].allWeight,
                        allPrice: proCount.getList()[0].price
                    }
                })
            } else {
                this.setData({
                    list: []
                })
            }
        })
    },

    //  再来一单 重新采购 计算数量变化
    refCountAll() {
        const { tabList } = this.data
        proCount.setList(tabList)
        // 计算全部产品信息
        proCount.countAllOrder()
        this.setData({
            tabList: proCount.getList(),
            tabListItem: proCount.getList()[0],
            allCount: {
                allCount: proCount.getList()[0].sum,
                allWeight: parseFloat((proCount.getList()[0].allWeight).toFixed(2)),
                allPrice: proCount.getList()[0].price
            }
        })
    },

    cusReMarkClick(e) {
        if (this.data.dataType === 'refCus') {
            let data = e.currentTarget.dataset
            this.data.result[data.index].orderProtertyMakes[data.ix].checked = !this.data.result[data.index].orderProtertyMakes[data.ix].checked
            this.setData({
                result: this.data.result
            })
        } else {
            let data = e.currentTarget.dataset
            this.data.result[data.index].makeProductPers[data.ix].checked = !this.data.result[data.index].makeProductPers[data.ix].checked
            this.setData({
                result: this.data.result
            })
        }

    },

    clearAddr() {
        this.setData({
            addr: {}
        })
    },

    // 套装数字加减
    suit2Decrease(e) {
        const { tabListItem } = this.data
        const { iindex, index } = e.currentTarget.dataset
        let num = tabListItem.cartCategoryFroms[iindex].orderProduct[index].suitSkuSun
        num = num > 0 ? num - 1 : 0
        tabListItem.cartCategoryFroms[iindex].orderProduct[index].suitSkuSun = num
        this.setData({
            tabListItem
        })
        this.refCountAll()
    },

    suit2Increase(e) {
        const { tabListItem } = this.data
        const { iindex, index } = e.currentTarget.dataset
        let num = tabListItem.cartCategoryFroms[iindex].orderProduct[index].suitSkuSun
        num = num + 1
        tabListItem.cartCategoryFroms[iindex].orderProduct[index].suitSkuSun = num
        this.setData({
            tabListItem
        })
        this.refCountAll()
    },

    suit2Input(e) {
        const { tabListItem } = this.data
        const { iindex, index } = e.currentTarget.dataset
        let num = Number(e.detail.value) > 0 ? Number(e.detail.value) : 0
        tabListItem.cartCategoryFroms[iindex].orderProduct[index].suitSkuSun = num
        this.setData({
            tabListItem
        })
        this.refCountAll()
    },

    // 单品数字加减
    suit1Decrease(e) {
        const { tabListItem } = this.data
        const { iindex, index, ix } = e.currentTarget.dataset
        let num = tabListItem.cartCategoryFroms[iindex].orderProduct[index].orderBigSinglePropertyFroms[ix].orderSum
        if (num > 1) {
            num = num - 1
        } else {
            return
        }
        // num = num > 1 ? num - 1 : 1
        tabListItem.cartCategoryFroms[iindex].orderProduct[index].orderBigSinglePropertyFroms[ix].orderSum = num
        this.setData({
            tabListItem
        })
        this.refCountAll()
    },

    suit1Increase(e) {
        const { tabListItem } = this.data
        const { iindex, index, ix } = e.currentTarget.dataset
        let num = tabListItem.cartCategoryFroms[iindex].orderProduct[index].orderBigSinglePropertyFroms[ix].orderSum
        num = num + 1
        tabListItem.cartCategoryFroms[iindex].orderProduct[index].orderBigSinglePropertyFroms[ix].orderSum = num
        this.setData({
            tabListItem
        })
        this.refCountAll()
    },

    //产品详情跳转
    defGoOneDetail(e) {
        const { item: itemTrue } = e.currentTarget.dataset
        // console.log(itemTrue)
        if (itemTrue.suit === 1) {
            wx.navigateTo({
                url: '/pages/detail/detail?proNum=' + itemTrue.productNo,
            })
            // wx.navigateTo({
            //   url: `/pages/shopToDetail/shopToDetail?itemTrue=${JSON.stringify(itemTrue)}`
            // })
        }
        if (itemTrue.suit === 2) {
            // wx.navigateTo({
            //   url: `/pages/shopToDetailSuit/shopToDetailSuit?itemTrue=${JSON.stringify(itemTrue)}`
            // })
        }
    },
    
    // 单品购物车参数处理
    suit1HanldCartCount(item) {
        // 计算全部产品信息
        const { cId: cartId, id: perId, outSum: num } = item
        let params = {
            cartId,
            perId,
            num,
            suit: 1
        }
        // proCount.countShopAllOrder()
        return Promise.resolve()
    },

    // 单品数字减1
    suit1Decrease(e) {
        const { list } = this.data
        const { iindex, index, ix } = e.currentTarget.dataset
        const clickItem = list[iindex].proList[index].cartProperties[ix]
        let num = list[iindex].proList[index].cartProperties[ix].outSum
        if (num <= 1) {
            return
        }
        num = num - 1
        list[iindex].proList[index].cartProperties[ix].outSum = num
        list[iindex].proList[index].cartProperties.forEach(ielem => {
            ielem.allWeight = parseFloat(ielem.outSum * ielem.standardGold)
            ielem.allWeight = Math.round(parseFloat(ielem.allWeight) * 100) / 100
        })
        this.suit1HanldCartCount(clickItem)
        this.setData({
            list
        })
    },

    // 单品数字加1
    suit1Increase(e) {
        const { list } = this.data
        const { iindex, index, ix } = e.currentTarget.dataset
        const clickItem = list[iindex].proList[index].cartProperties[ix]
        let num = list[iindex].proList[index].cartProperties[ix].outSum
        num = num + 1
        list[iindex].proList[index].cartProperties[ix].outSum = num
        list[iindex].proList[index].cartProperties.forEach(ielem => {
            ielem.allWeight = parseFloat(ielem.outSum * ielem.standardGold)
            ielem.allWeight = Math.round(parseFloat(ielem.allWeight) * 100) / 100
        })
        this.suit1HanldCartCount(clickItem)
        this.setData({
            list
        })
    },

    suit1Input(e) {
        const { list } = this.data
        const { iindex, index, ix } = e.currentTarget.dataset
        const clickItem = list[iindex].proList[index].cartProperties[ix]
        let num = Number(e.detail.value) > 1 ? Number(e.detail.value) : 1
        list[iindex].proList[index].cartProperties[ix].outSum = num
        list[iindex].proList[index].cartProperties.forEach(ielem => {
            ielem.allWeight = parseFloat(ielem.outSum * ielem.standardGold)
            ielem.allWeight = Math.round(parseFloat(ielem.allWeight) * 100) / 100
        })
        this.suit1HanldCartCount(clickItem)
        this.setData({
            list
        })
    },

    // 删除单条
    delSingle(e) {
        const { list } = this.data
        const { iindex, index, ix } = e.currentTarget.dataset
        const clickItem = list[iindex].proList[index].cartProperties[ix]
        clickItem.outSum = 0
        app.$u.showModal('确定删掉选中产品吗').then(e => {
            this.suit1HanldCartCount(clickItem).then(res => {
                list[iindex].proList[index].cartProperties.splice(ix, 1)
                if (list[iindex].proList[index].cartProperties.length === 0) {
                    list[iindex].proList.splice(index, 1)
                }
                if (list[iindex].proList.length === 0) {
                    list.splice(iindex, 1)
                }
                this.setData({
                    list
                })
            })
        })
    },

    // 切换订单类型
    changeOrderTypeList(e) {
        const { index } = e.currentTarget.dataset
        const { orderTypeList } = this.data
        if (orderTypeList[index].checked) {
            return
        }
        orderTypeList.forEach(item => item.checked = !item.checked)
        this.setData({
            orderType: this.getOrderType(),
            orderTypeList
        })
    },

    // 根据订单状态数组拿到订单状态 
    getOrderType() {
        const { orderTypeList } = this.data
        return orderTypeList.find(item => item.checked).val
    },

    // 弹出展销弹窗
    openEx() {
        this.setData({
            exPropStatus: true,
            remarkShow: false
        })
    },

    // 点击确定选择展销单
    exModalTrue(e) {
        this.trueExId()
        this.setData({
            exPropStatus: false,
            remarkShow: true
        })
    },

    // 点击取消选择展销单
    exModalFalse(e) {
        this.setData({
            exPropStatus: false,
            remarkShow: true
        })
    },

    // 获取展销单id
    getExId(e) {
        const { exhibitId } = e.detail
        this.data.exModalId = exhibitId
        this.data.exTrueList = [e.detail]
    },

    // 确定展销单id
    trueExId(e) {
        const { exModalId: exhibitId, exTrueList } = this.data
        this.setData({
            exhibitId,
            exTrueList
        })
    },

    // 获取展销列表
    getExList() {
        app.$api.selectExhibitActive().then(res => {
            this.setData({
                exList: res.data
            })
        })
    },

    onShow() {
        let data
        if (this.data.dataType) {
            data = this.data.firstData
            switch (this.data.dataType) {
                case 'def':
                    this.getDefData(data)
                    break;
                case 'refDef':
                    this.getRefDefData(data)
                    break;
            }
        }

        // 获取展销单列表
        // this.getExList()

        // 获取存欠
        // this.getAccountOrder()

        // 得到地址
        this.getAddr()
    },

    onLoad(options) {
        if (options.data) {
            let data = JSON.parse(options.data)
            this.setData({
                firstData: data,
                allCount: data.allCount ? data.allCount : {},
                cId: data.ids ? data.ids : '',
                mId: data.mId ? data.mId : '',
                dataType: data.type,
                orderId: data.orderId ? data.orderId : null
            })
        }
    },

    onHide() {
        wx.removeStorageSync('chooseAddr')
        this.clearAddr()
    },

    onUnload() {
        wx.removeStorageSync('chooseAddr')
        this.clearAddr()
    }
})
