const app = getApp()
const proCount = app.$productCount

Component({

    properties: {
        list: {
            type: Array,
            value: []
        }
    },

    data: {
        imgStatus: {
            a: '/images/shop/icon-on.png',
            b: '/images/shop/icon-not.png',
        },
        imgdDetail: {
            a: '/images/shop/icon-up.png',
            b: '/images/shop/icon-down.png',
        },
        imgTit: {
            a: '/images/shop/icon-up2.png',
            b: '/images/shop/icon-down2.png',
        },
        $img: app.$img,

        propShow: false, // 辅件弹窗
        auxiliariesList: [], // 辅件列表
    },

 
    methods: {
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

        deleDef(e) {
            const { iiindex, iindex, index, item: { id: cartId, cartProperties = [], suit } } = e.currentTarget.dataset
            const { list } = this.data
            let self = this
            let cartDelFroms = [{
                suit,
                cartId,
                cartPerId: cartProperties.map(item => { return { perId: item.id } })
            }]
            let params = {
                cartDelFroms,
            }
            app.$u.showModal('确定删掉选中产品吗').then(e => {
                app.$api.delectBigSigleCart(params).then(res => {
                    app.$u.showToast('删除成功')
                    self.getDefData()
                })
            }).catch(err => {
                this.data.list.forEach(item => {
                    item.isTouchMove = false
                })
            })
        },

        clickDef(e) {
            this.setData({
                currentTab: Number(e.currentTarget.dataset.current)
            });
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

        // 标准款编辑 
        defEdit(e) {
            let status = e.currentTarget.dataset.status
            this.setData({
                defEdit: !this.data.defEdit
            })
            this.defclearCheckbox()
            this.cusclearCheckbox()
        },

        // 标准款清空checkbox
        defclearCheckbox() {
            const { list } = this.data
            if (list) {
                list.forEach(item => {
                    item.proList.forEach(it => {
                        it.checkbox = false
                    })
                })
            }
            this.setData({
                defAllCount: {
                    allCount: 0,
                    allWeight: 0,
                    allPrice: 0
                },
                defCheckBox: [],
                defCheckAll: false,
                list
            })
        },


        //清空购物车
        delAllSku() {
            app.$u.showModal(`确定清空购物车？`).then(ele => {
                this.setData({
                    defAllCount: {
                        allCount: 0,
                        allWeight: 0,
                        allPrice: 0
                    },
                    list: [],
                })
            })
        },

        //控制全选状态
        controlAllCheck() {
            let res = true
            this.data.list.forEach(item => {
                item.proList.forEach(one => {
                    if (!(one.checkbox)) {
                        res = false
                    }
                })
            })

            if (res) {
                this.setData({
                    defCheckAll: true
                })
            } else {
                this.setData({
                    defCheckAll: false
                })
            }
        },

        //单个选择控制全选
        relationControlCheck() {

        },

        // 点击标题checkbox
        defTitCheckbox(e) {
            const { list } = this.data
            const { iindex } = e.currentTarget.dataset
            list[iindex].checkbox = !list[iindex].checkbox
            if (list[iindex].checkbox) {
                list[iindex].proList.forEach(item => {
                    item.checkbox = true
                })
            } else {
                list[iindex].proList.forEach(item => {
                    item.checkbox = false
                })
            }
            this.setData({
                list
            })
            this.controlAllCheck()
            this.defGetCheckbox()
        },

        // 点击列表checkbox
        defCheckbox(e) {
            const { list } = this.data
            const { iindex, index, ix } = e.currentTarget.dataset
            list[iindex].proList[index].checkbox = !list[iindex].proList[index].checkbox
            let res = true;
            list[iindex].proList.forEach(item => {
                if (!(item.checkbox)) {
                    res = false;
                }
            })

            if (res) {
                list[iindex].proList[index].checkbox = true
            } else {
                list[iindex].proList[index].checkbox = false
            }

            this.controlAllCheck()

            this.setData({
                list
            })

            this.defGetCheckbox()
        },

        // 全选
        checkboxAll(e) {
            const { list } = this.data
            let { defCheckAll } = this.data
            defCheckAll = !defCheckAll
            console.log(defCheckAll)
            list.forEach(item => {
                item.checkbox = defCheckAll
                item.proList.forEach(it => {
                    it.checkbox = defCheckAll
                    it.cartProperties.forEach(iit => {
                        iit.checkbox = defCheckAll
                    })
                })
            })
            this.setData({
                defCheckAll,
                list
            })
            this.defGetCheckbox()
        },

        // 获取选中值
        defGetCheckbox() {
            proCount.setList(this.data.list)
            proCount.countAllTwo()
            this.setData({
                list: proCount.getList()
            })
            const { list } = this.data
            let { defCheckBox } = this.data
            let defCheckBoxArr = []
            defCheckBox = []
            let allCount = 0,
                allWeight = 0,
                allPrice = 0
            list.forEach(item => {
                item.proList.forEach(it => {
                    if (it.checkbox) {
                        defCheckBox.push(it.id)
                        defCheckBoxArr.push(it)
                    }
                })
            })
            defCheckBoxArr.forEach(item => {
                allCount += item.sum
                allWeight += item.allWeight
                allPrice += item.price
            })
            console.log(allWeight, defCheckBoxArr)
            this.setData({
                defAllCount: {
                    allCount,
                    allWeight: parseFloat(allWeight.toFixed(2)),
                    allPrice: parseFloat(allPrice.toFixed(2))
                },
                defCheckBox
            })
        },

        defDel(e) {
            if (this.data.defCheckBox.length === 0) {
                return
            }
            const params = this.data.defCheckBox.join(','),
                self = this
            app.$u.showModal('确定删掉选中产品吗').then(e => {
                app.$api.deleteCarts({
                    ids: params
                }).then(res => {
                    app.$u.showToast('删除成功')
                    self.data.result.forEach((item, index) => {
                        if (item.checkbox) {
                            item.hide = true
                        }
                    })
                    self.setData({
                        defAllCount: {},
                        defEdit: false,
                        result: self.data.result
                    })
                    this.defGetCheckbox()
                    this.getData()
                })
            })
        },

        //跳转订单详情
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
    }
})
