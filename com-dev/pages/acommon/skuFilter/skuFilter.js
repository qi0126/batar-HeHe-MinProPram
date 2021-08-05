// import mock from './mode.js'
// import mock from './modeXL.js'

// import mock from './modeJZ.js'
import detailSku from '../../../utils/detailSku.js'
// const propsData = mock.data.pro
const app = getApp()

Component({

    properties: {
        propsData: {
            type: Object,
            value: {
                proSpecList: []
            }
        },
        mode: {
            type: String,
            value: ``
        },
        weightSE: {
            type: String,
            value: null
        },
    },

    lifetimes: {
        attached() {
            this.initData()
        },

        detached() {},
    },

    data: {
        $img: app.$img,
        proObj: {
            weightList: [],
            conditiList: [],
            diameterList: [],
            ringhandList: [],
            lengthList: [],
            auxiliariesList: []
        },

    },

    methods: {
        initData() {
            const {
                propsData,
                mode
            } = this.data
            this.df = new detailSku(propsData)
            if (mode) {
                this.backFun()
                return
            }
            this.generateList()
        },

        // 处理数据回填
        backFun() {
            const {
                propsData
            } = this.data
            Object.assign(this.df, propsData)
            const proObj = this.df.getThis()
            let weightSE
            proObj.skuList.forEach(ielem => {
                if (ielem.weight === proObj.clickedObj.weight && ielem.conditi === proObj.clickedObj.conditi) {
                    weightSE = `${ielem.weight_start}-${ielem.weight_end}g`
                }
            })

            weightSE = weightSE ? weightSE : null
            this.setData({
                proObj,
                weightSE
            })
            this.emitData()
        },

        generateList() {
            this.df.initList()
            const proObj = this.df.getThis()
            this.df.clickedConditi(proObj.conditiList[0])
            this.setData({
                proObj
            })
            this.emitData()
        },

        conditiClick(e) {
            const proObj = this.df.getThis()
            const {
                item
            } = e.currentTarget.dataset
            this.df.clickedConditi(item)
            this.setData({
                proObj
            })
            this.emitData()
        },

        // 点击表面工艺
        effeClick(e) {
            const proObj = this.df.getThis()
            const {
                item
            } = e.currentTarget.dataset
            this.df.clickedEffe(item)
            this.setData({
                proObj
            })
            this.emitData()
        },

        // 点击车花
        carClick(e) {
            const proObj = this.df.getThis()
            const {
                item
            } = e.currentTarget.dataset
            this.df.clickedCar(item)
            this.setData({
                proObj
            })
            this.emitData()
        },

        weightClick(e) {
            const proObj = this.df.getThis()
            const {
                item
            } = e.currentTarget.dataset
            this.df.clickedWeight(item)
            let weightSE
            proObj.skuList.forEach(ielem => {
                if (ielem.weight === proObj.clickedObj.weight && ielem.conditi === proObj.clickedObj.conditi) {
                    weightSE = `${ielem.weight_start}-${ielem.weight_end}g`
                }
            })

            weightSE = weightSE ? weightSE : null
            console.log('weightSE:', weightSE)
            this.setData({
                proObj,
                weightSE
            })
            this.emitData()
        },
        
        // 点击面宽
        faceWidthClick(e) {
            const proObj = this.df.getThis()
            const {
                item
            } = e.currentTarget.dataset
            this.df.clickedFaceWidth(item)
            this.setData({
                proObj
            })
            this.emitData()
        },

        // 点击内径
        diameterClick(e) {
            const proObj = this.df.getThis()
            const {
                item
            } = e.currentTarget.dataset
            this.df.clickedDiameter(item)
            this.setData({
                proObj
            })
            this.emitData()
        },

        ringhandClick(e) {
            const proObj = this.df.getThis()
            const {
                item
            } = e.currentTarget.dataset
            this.df.clickedRinghand(item)
            this.setData({
                proObj
            })
            this.emitData()
        },

        lengthClick(e) {
            const proObj = this.df.getThis()
            const {
                item
            } = e.currentTarget.dataset
            this.df.clickedLength(item)
            this.setData({
                proObj
            })
            this.emitData()
        },

        refStatusFunc() {
            const proObj = this.df.getThis()
            this.df.refStatusFunc()
            this.setData({
                proObj
            })
            this.emitData()
        },

        changeAux(e) {
            const { proObj } = this.data
            const { item, index } = e.currentTarget.dataset
            proObj.auxiliariesList[index].checked = !proObj.auxiliariesList[index].checked
            console.log(proObj.auxiliariesList)
            this.setData({
                proObj
            })
            this.emitData()
        },

        // emit
        emitData() {
            this.trueSku()
            const {
                proObj
            } = this.data
            // console.log(proObj)
            this.triggerEvent('emitSku', proObj)
        },

        // 判断是否确定选中了一条sku
        trueSku() {
            const {
                proObj, proObj: { trueSkuList, trueSkuList: [{ auxiliariesList }] }
            } = this.data
            if (trueSkuList.length === 1) {
                proObj.auxiliariesList = auxiliariesList
            }else {
                proObj.auxiliariesList = []
            }
            this.setData({
                proObj
            })
        }

    }
})