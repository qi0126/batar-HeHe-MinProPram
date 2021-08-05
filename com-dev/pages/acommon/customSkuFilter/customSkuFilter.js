// import mock from './mode.js'
// import mock from './modeXL.js'
import customDetailSku from '../../../utils/customDetailSku.js'
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
    skuObj: {
      type: Object,
      value: ``,
      observer(newVal, oldVal, changePath) {
        // 监听数据变动
        if(this.df) {
          this.df.initList(newVal)
          const proObj = this.df.getThis()
          proObj.trueCusToms = newVal
          this.df.clickedConditi(proObj.conditiList[0])
          this.setData({
            proObj
          })
          this.emitData()
        }
      } 
    },
    showCusTxt: {
      type: Boolean,
      value: true 
    }

  },

  lifetimes: {
    attached() {
      this.initData()
    },
 
    detached() {
    },
  },

  data: {
    proObj: {
      weightList: [],
      conditiList: [],
      diameterList: [],
      ringhandList: [],
      lengthList: [],
    },

    cusTomsData: {
      cusTomsName: `克重`,
      cusTomsProp: false,
      cusTomsPropTit: `选择内径`,
      placeholder: `请输入您想要的克重`,
      scopeName: `可定制克重范围：`,
      scopeList: [`12-12`, `12-12`, `12-12`],
      inputValue: ``
    },

    chainProp: false,
    chainPropTit: '链长说明详情', // 链长弹窗

    // 链长范围
    chainScopeList: [{
      name: `小于13`,
      value: `40-43`
    }, {
      name: `13-20`,
      value: `44-48`
    }, {
      name: `20-30`,
      value: `45-50`
    }, {
      name: `30-40`,
      value: `48-52`
    }, {
      name: `50-60`,
      value: `52-58`
    }, {
      name: `60-70`,
      value: `55-62`
    }, {
      name: `70-80`,
      value: `56-63`
    }, {
      name: `80-90`,
      value: `60-68`
    }, {
      name: `90-100`,
      value: `62-68`
    }, {
      name: `110-120`,
      value: `65-70`
    }, {
      name: `130-150`,
      value: `68-75`
    }, {
      name: `大于150`,
      value: `备注自定义`
    }],

  },

  methods: {
    initData() {
      const { propsData, mode } = this.data
      this.df = new customDetailSku(propsData)
      if (mode) {
        this.backFun()
        return 
      } 
      this.generateList()
    },

    // 处理数据回填
    backFun() {
      const { propsData } = this.data
      Object.assign(this.df, propsData)
      const proObj = this.df.getThis()
      this.setData({
        proObj
      })
      this.emitData()
    },

    generateList() {
      const { skuObj } = this.data
      this.df.initList(skuObj)
      const proObj = this.df.getThis()
      this.df.clickedConditi(proObj.conditiList[0])
      this.setData({
        proObj
      })
    },

    conditiClick(e) {
      const proObj = this.df.getThis()
      const { item } = e.currentTarget.dataset
      this.df.clickedConditi(item)
      this.setData({
        proObj
      })
      this.emitData()
    },

    weightClick(e) {
      const proObj = this.df.getThis()
      const { item } = e.currentTarget.dataset
      this.df.clickedWeight(item)
      this.setData({
        proObj
      })
      this.emitData()
    },

    diameterClick(e) {
      const proObj = this.df.getThis()
      const { item } = e.currentTarget.dataset
      this.df.clickedDiameter(item)
      this.setData({
        proObj
      })
      this.emitData()
    },

    ringhandClick(e) {
      const proObj = this.df.getThis()
      const { item } = e.currentTarget.dataset
      this.df.clickedRinghand(item)
      this.setData({
        proObj
      })
      this.emitData()
    },

    lengthClick(e) {
      const proObj = this.df.getThis()
      const { item } = e.currentTarget.dataset
      this.df.clickedLength(item)
      this.setData({
        proObj
      })
      this.emitData()
    },

    setCoustomWeight(e) {
      const { item } = e.currentTarget.dataset
      const { customWeight: { scopeList } } = this.df.getThis()
      this.data.cusTomsData = {
        cusTomsFun: `setWeightList`,
        cusTomsPropTit: `选择克重`,
        placeholder: `请输入您想要的克重`,
        scopeName: `可定制克重范围：`,
        inputValue: ``,
        scopeList
      },
        this.show()
    },

    setCoustomDiameter(e) {
      const { item } = e.currentTarget.dataset
      const { customDiameter: { scopeList } } = this.df.getThis()
      this.data.cusTomsData = {
        cusTomsFun: `setDiameterList`,
        cusTomsPropTit: `选择圈口`,
        placeholder: `请输入您想要的圈口`,
        scopeName: `可定制圈口范围：`,
        inputValue: ``,
        scopeList
      },
        this.show()
    },

    setCoustomRinghand(e) {
      const { item } = e.currentTarget.dataset
      const { customRinghand: { scopeList } } = this.df.getThis()
      this.data.cusTomsData = {
        cusTomsFun: `setRinghandList`,
        cusTomsPropTit: `选择手寸`,
        placeholder: `请输入您想要的手寸`,
        scopeName: `可定制手寸范围：`,
        inputValue: ``,
        scopeList,
      },
        this.show()
    },

    setCoustomLength(e) {
      const { item } = e.currentTarget.dataset
      // this.show()
    },

    coustomLengthShow() {
      this.setData({
        chainProp: true
      })
    },

    valiInputData() {
      if (!this.valiInput()) {
        app.$u.showToast('请输入范围区间的值')
        return false
      }
      return true
    },

    valiInput() {
      let { cusTomsData: { inputValue, scopeList }  } = this.data
      inputValue = parseFloat(inputValue)
      let arr = scopeList
      return arr.map(item => item.split('-')).find(item => inputValue >= parseFloat(item[0]) && inputValue <= parseFloat(item[1]))
    },
    
    getCusToms(e) {
      const { cusTomsData } = this.data
      cusTomsData.inputValue = e.detail.value
    },

    show() {
      const { cusTomsData } = this.data
      const proObj = this.df.getThis()
      cusTomsData.cusTomsProp = true
      this.setData({
        cusTomsData: this.data.cusTomsData
      })
      this.triggerEvent('showProp', proObj)
    },

    hide() {
      const { cusTomsData } = this.data
      const proObj = this.df.getThis()
      cusTomsData.cusTomsProp = false
      this.setData({
        cusTomsData: this.data.cusTomsData
      })
      this.triggerEvent('hideProp', proObj)
    },

    cusSubmit() {
      let { cusTomsData: { inputValue, scopeList, cusTomsFun } } = this.data
      const proObj = this.df.getThis()
      if (!this.valiInputData()) {
        return
      }
      this.df[cusTomsFun](inputValue)
      this.setData({
        proObj
      })
      this.hide()
    },

    cusCancel(e) {
      this.hide()
    }, 
    
    closeChainProp(e) {
      this.setData({
        chainProp: false
      })
    },

    // emit
    emitData() {
      const { proObj } = this.data
      this.triggerEvent('emitCusTomSku', proObj )
    }


  }
})
