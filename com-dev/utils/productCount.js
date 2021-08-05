import $u from './util'

class proCount {
    constructor() {
        this.list = []
    }

    countAll() {
        const {
            list
        } = this
        list.forEach(item => {
            item.sum = 0
            item.price = 0
            item.allWeight = 0
            item.cartCategoryFroms.forEach(it => {
                it.sum = 0
                it.price = 0
                it.allWeight = 0
                it.cartFroms.forEach(iit => {
                    iit.sum = 0
                    iit.price = 0
                    iit.allWeight = 0
                    iit.suitWeight = 0
                    if (iit.cartPropertyFroms) {
                        iit.cartPropertyFroms.forEach(iiit => {
                            iiit.allWeight = parseFloat((parseFloat(iiit.standardGold) * iiit.outSum).toFixed(2))
                            iiit.price = parseFloat($u.countPrice(iiit.productCs, iiit.feeType, iiit.outSum, iiit.additionFee, iiit.basicFee, iiit.standardGold).toFixed(2))
                        })
                    }
                    if (iit.cartSuitFroms) {
                        iit.suitSum = iit.suitSum ? iit.suitSum : 0
                        iit.cartSuitFroms.forEach(iiit => {
                            iit.suitWeight += (iiit.weight * iit.suitSum)
                        })
                        iit.suitPrice = parseFloat($u.countSuitPrice(iit.cartSuitFroms[0].productCs, 1, 1, iit.suitPrice, iit.suitPrice, iit.suitWeight).toFixed(2))

                    }
                })
            })
        })

        list.forEach(item => {
            item.cartCategoryFroms.forEach(it => {
                it.cartFroms.forEach(iit => {
                    if (iit.cartPropertyFroms) {
                        iit.cartPropertyFroms.forEach(iiit => {
                            iit.sum += iiit.outSum
                            iit.allWeight += iiit.allWeight
                            iit.price += iiit.price
                            iit.allWeight = parseFloat(iit.allWeight.toFixed(2))
                        })
                    }
                    if (iit.cartSuitFroms) {
                        iit.sum += iit.suitSum
                        iit.price += iit.suitPrice
                        iit.allWeight += iit.suitWeight
                        iit.allWeight = parseFloat(iit.allWeight.toFixed(2))
                    }
                })
            })
        })
        list.forEach(item => {
            item.cartCategoryFroms.forEach(it => {
                it.cartFroms.forEach(iit => {
                    it.sum += iit.sum
                    it.price += iit.price
                    it.allWeight += iit.allWeight
                    it.allWeight = parseFloat(it.allWeight.toFixed(2))
                })
            })
        })
        list.forEach(item => {
            item.cartCategoryFroms.forEach(it => {
                item.sum += it.sum
                item.price += it.price
                item.allWeight += it.allWeight
                item.allWeight = parseFloat(item.allWeight.toFixed(2))
            })
        })
        list.forEach(item => {
            item.cartCategoryFroms.forEach(it => {
                it.sum = parseFloat(it.sum.toFixed(2))
                it.price = parseFloat(it.price.toFixed(2))
                it.allWeight = parseFloat(it.allWeight.toFixed(2))
            })
        })
        this.list = list
    }

    // 购物车
    countAllTwo() {
        var list = this.list
        list.forEach(item => {
            item.sum = 0
            item.price = 0
            item.allWeight = 0
            item.showTF = true
            item.proList.forEach(it => {
                it.closeEdit = true
                it.sum = 0
                it.price = 0
                it.allWeight = 0
                it.skuNumber = it.cartProperties.length + 1
                it.cartProperties.forEach(iit => {
                    iit.sum = 0
                    iit.price = 0
                    iit.singleWeight = 0
                    iit.allWeight = parseFloat((parseFloat(iit.standardGold) * iit.outSum).toFixed(2))
                    // iit.price = parseFloat($utils.countPrice(iit.productCS, iit.feeType, iit.outSum, iit.additionFee, iit.basicFee, iit.standardGold).toFixed(2))

                    it.sum += parseFloat(iit.outSum)
                    it.price += parseFloat(iit.price.toFixed(2))
                    it.allWeight  += parseFloat(iit.allWeight.toFixed(2))

                })
                it.sum = parseFloat(it.sum.toFixed(2))
                it.price = parseFloat(it.price.toFixed(2))
                it.allWeight = parseFloat(it.allWeight.toFixed(2))

                item.sum += it.sum
                item.price += it.price
                item.allWeight += it.allWeight
                item.sum = parseFloat(item.sum.toFixed(2))
                item.price = parseFloat(item.price.toFixed(2))
                item.allWeight = parseFloat(item.allWeight.toFixed(2))

            })
        })
        this.list = list
    }


    countAllOrder() {
        const {
            list
        } = this
        list.forEach(item => {
            item.sum = 0
            item.price = 0
            item.allWeight = 0
            item.cartCategoryFroms.forEach(it => {
                it.sum = 0
                it.price = 0
                it.allWeight = 0
                it.orderProduct.forEach(iit => {
                    iit.sum = 0
                    iit.price = 0
                    iit.allWeight = 0
                    if (iit.orderBigSinglePropertyFroms) {
                        iit.orderBigSinglePropertyFroms.forEach(iiit => {
                            iiit.allWeight = parseFloat((parseFloat(iiit.standardGold) * iiit.orderSum).toFixed(2))
                            iiit.price = parseFloat($u.countPrice(iiit.productCS, iiit.feeType, iiit.orderSum, iiit.additionFee, iiit.feePrice, iiit.standardGold).toFixed(2))
                            iit.sum += iiit.orderSum
                            iit.allWeight += iiit.allWeight
                            iit.allWeight = parseFloat(iit.allWeight.toFixed(2))
                            iit.price += iiit.price
                        })
                    }
                    if (iit.suitProdctPeyFroms) {
                        iit.suitSkuSun = iit.suitSkuSun ? iit.suitSkuSun : 0
                        iit.suitWeights = iit.suitWeight ? iit.suitWeight * iit.suitSkuSun : 0
                        iit.suitSkuPrice = $u.countSuitPrice(iit.productCs, iit.feeType, iit.suitSkuSun, iit.suitSkuPrice, iit.suitSkuPrice, iit.suitWeight)

                        iit.sum += iit.suitSkuSun
                        iit.allWeight += iit.suitWeights
                        iit.price += iit.suitSkuPrice
                        iit.allWeight = parseFloat(iit.allWeight.toFixed(2))
                    }
                    it.sum += iit.sum
                    it.price += iit.price
                    it.allWeight += iit.allWeight
                    it.allWeight = parseFloat(it.allWeight.toFixed(2))
                })
                it.sum = parseFloat(it.sum.toFixed(2))
                it.price = parseFloat(it.price.toFixed(2))

                item.sum += it.sum
                item.price += it.price
                item.allWeight += it.allWeight
                item.allWeight = parseFloat(item.allWeight.toFixed(2))
            })
        })
        this.list = list
    }

    //购物车统计所有
    countShopAllOrder() {
        const {
            list
        } = this
        list.forEach(item => {
            item.sum = 0
            item.price = 0
            item.allWeight = 0
            item.cartCategoryFroms.forEach(it => {
                it.sum = 0
                it.price = 0
                it.allWeight = 0
                it.cartFroms.forEach(iit => {
                    iit.sum = 0
                    iit.price = 0
                    iit.allWeight = 0
                    if (iit.cartPropertyFroms) {
                        iit.cartPropertyFroms.forEach(iiit => {
                            iiit.allWeight = parseFloat((parseFloat(iiit.standardGold) * iiit.outSum).toFixed(2))
                            iiit.price = parseFloat($u.countPrice(iit.productCS, iiit.feeType, iiit.outSum, iiit.additionFee, iiit.feePrice, iiit.standardGold).toFixed(2))
                            iit.sum += iiit.outSum
                            iit.allWeight += iiit.allWeight
                            iit.allWeight = parseFloat(iit.allWeight.toFixed(2))
                            iit.price += iiit.price
                        })
                    }
                    it.sum += iit.sum
                    it.price += iit.price
                    it.allWeight += iit.allWeight
                    it.allWeight = parseFloat(it.allWeight.toFixed(2))
                })
                it.sum = parseFloat(it.sum.toFixed(2))
                it.price = parseFloat(it.price.toFixed(2))
                item.sum += it.sum
                item.price += it.price
                item.allWeight += it.allWeight
                item.allWeight = parseFloat(item.allWeight.toFixed(2))
            })
        })
        this.list = list
    }

    // 改变格式
    changeFormatTwo() {
        var list = this.list
        list.forEach(item => {
            item.checked = true
            item.show = true
            item.proList.forEach(it => {
                it.checked = true
                it.show = true
                it.countNum = 0
                it.onekeys = {
                    length: false,
                    diameterLength: false,
                    ringHand: false,
                    faceWidth: false,
                }
                // it.onekey1 = ''
                it.cartProperties.forEach(iit => {
                    iit.checked = false
                    iit.show = true
                    it.countNum += iit.outSum
                    // console.log(iit.accessory)
                    iit.accessory = iit.accessory ? JSON.parse(iit.accessory): []
                    if (iit.accessory.length > 0) {
                        iit.auxTF = true
                        iit.auxiliariesList = iit.accessory
                        item.splitTF = true
                        iit.auxiliariesList.forEach(ielem => {
                            if (ielem.type === 2) {
                                item.splitTF = false
                            }
                        })
                    } else {
                        item.splitTF = false
                        iit.auxTF = false
                    }
                    if (iit.productCZ) {
                        iit.productCZ = iit.productCZ.split('_').join('、')
                        if (iit.productCZ.slice(iit.productCZ.length - 1) === '、') {
                            iit.productCZ = iit.productCZ.slice(0, iit.productCZ.length - 1)
                        }
                        // iit.productCZ = $utils.changeItemSpec(iit.productCZ)
                    }
                    //扩展属性开始
                    iit.extendAttr = iit.extendAttr ? JSON.parse(iit.extendAttr) : {}
                    iit.productCS = iit.productCs ? iit.productCs : iit.productCS
                })
                it.cartProperties[0].checked = true
                if (it.cartProperties.some(iit => iit.extendAttr.length)) {
                    it.onekeys.length =  true
                }
                if (it.cartProperties.some(iit => iit.extendAttr.diameterLength)) {
                    it.onekeys.diameterLength =  true
                }
                if (it.cartProperties.some(iit => iit.extendAttr.ringHand)) {
                    it.onekeys.ringHand =  true
                }
                if (it.cartProperties.some(iit => iit.extendAttr.faceWidth)) {
                    it.onekeys.faceWidth =  true
                }
            })
        })
        this.list = list
    }

    // 改变格式
    changeFormat() {
        const {
            list
        } = this
        list.forEach(item => {
            item.checked = true
            item.cartCategoryFroms.forEach(it => {
                it.checked = true
                it.cartFroms.forEach(iit => {
                    iit.checked = false
                    if (iit.productCZ) {
                        iit.productCZ = iit.productCZ.split('_').join('、')
                        if (iit.productCZ.slice(iit.productCZ.length - 1) === '、') {
                            iit.productCZ = iit.productCZ.slice(0, iit.productCZ.length - 1)
                        }
                        iit.productCZ = $u.changeItemSpec(iit.productCZ)
                    }
                    iit.styleKey = ``
                    iit.cartPropertyFroms && iit.cartPropertyFroms.forEach(iiit => {
                        iiit.checked = false
                        iiit.extendAttr = JSON.parse(iiit.extendAttr)
                        if (iiit.extendAttr.diameterLength) {
                            iit.styleKey = 'diameterLength'
                        }
                        if (iiit.extendAttr.length) {
                            iit.styleKey = 'length'
                        }
                        if (iiit.extendAttr.ringHand) {
                            iit.styleKey = 'ringHand'
                        }
                    })
                    iit.cartSuitFroms && iit.cartSuitFroms.forEach(iiit => {
                        iiit.extendAttr = JSON.parse(iiit.extendAttr)
                        iiit.productPey = $u.changeItemSpec(`${iiit.productCs}、${iiit.pait}、${iiit.carFlower}`)
                    })

                })
            })
        })
        this.list = list
    }
    
    changeFormatOrderTwo() {
        var list = this.list
        list.forEach(item => {
            item.proList.forEach(it => {
                it.proName = it.productName
                it.proNo = it.productNo
                it.prourl = it.productImg
                if (it.orderPeoductPerties) {
                    it.orderPeoductPerties.forEach(iit => {
                        iit.outSum = iit.orderSum
                    })
                    it.cartProperties = it.orderPeoductPerties
                }
            })
        })
        this.list = list
    }

    changeFormatOrder() {
        let {
            list
        } = this
        let listArr = []
        list.forEach(item => {
            if (item.storeId === -12) {
                listArr.unshift(item)
            } else {
                listArr.push(item)
            }
        })
        list = listArr
        try {
            list.forEach(item => {
                item.checked = false
                item.cartCategoryFroms.forEach(it => {
                    it.checked = true
                    it.orderProduct.forEach(iit => {
                        iit.checked = false
                        if (iit.productPey) {
                            iit.productPey = iit.productPey.split('_').join('、')
                            if (iit.productPey.slice(iit.productPey.length - 1) === '、') {
                                iit.productPey = iit.productPey.slice(0, iit.productPey.length - 1)
                            }
                            iit.productPey = $u.changeItemSpec(iit.productPey)
                        }
                        iit.styleKey = ``
                        iit.orderBigSinglePropertyFroms && iit.orderBigSinglePropertyFroms.forEach(iiit => {
                            iiit.checked = false
                            iiit.extendAttr = iiit.extendAttr && JSON.parse(iiit.extendAttr)
                            if (iiit.extendAttr.diameterLength) {
                                iit.styleKey = 'diameterLength'
                            }
                            if (iiit.extendAttr.length) {
                                iit.styleKey = 'length'
                            }
                            if (iiit.extendAttr.ringHand) {
                                iit.styleKey = 'ringHand'
                            }
                        })
                        if (iit.suitProdctPeyFroms) {
                            iit.suitProdctPeyFroms.forEach(iiit => {
                                iiit.checked = false
                                iiit.productPey = $u.changeItemSpec(`${iit.productCs}、${iiit.pait}、${iiit.craft}`)
                                if (iiit.extendAttr) {
                                    iiit.extendAttr = JSON.parse(iiit.extendAttr)
                                    if (iiit.extendAttr.diameterLength) {
                                        iit.styleKey = 'diameterLength'
                                    }
                                    if (iiit.extendAttr.length) {
                                        iit.styleKey = 'length'
                                    }
                                    if (iiit.extendAttr.ringHand) {
                                        iit.styleKey = 'ringHand'
                                    }
                                }
                            })
                        }
                    })
                })
            })
            list[0].checked = true
        } catch (err) {
            console.log(err)
        }
        this.list = list
    }

    // 设置list
    setList(options) {
        if (!Array.isArray(options)) {
            console.error('请传入数组')
            return
        }
        this.list = options
    }

    // 获取计算的总数
    getList() {
        return this.list
    }


}


export default new proCount()