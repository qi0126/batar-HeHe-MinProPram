class DetailDialog {
  constructor(options) {
    this.canDo = {
      select: [
        {
          txt: `可做克重(g)`,
          checked: true,
          show: true,
          className: `c9`,
        }
      ],
      mapSpec: {},
      reverseMapSpec: {},
      dialog: {
        txt: `可做克重(g)`,
        specIndex: 0,
        list: [{
          txt: ``,
          disabled: false,
          checked: true
        }]
      },
      weightList: [],
      ringHandList: [],
      diameterList: [],
      trueChoose: [],
      trueSku: ``
    }
    this.proData = options
    this.init(options)
  }

  init(options) {
    this.genetateSelect(options)
    this.generateWeight(options)
    this.generateRingHand(options)
    this.generateDiameter(options)
    this.genetateMapSpec(options)
  }

  // 生成可做规格映射
  genetateMapSpec(options) {
    const { oneItemsCode, customSpeciList } = options
    let { select, weightList, ringHandList, diameterList } = this.canDo
    let mapSpec = {}, reserveMapSpec = {}
    if (oneItemsCode === `JZ`) {
      for (let item of customSpeciList) {
        mapSpec[item.weight] = item.ringHand
        reserveMapSpec[item.ringHand] = item.weight
      }
    }
    if (oneItemsCode === `SZ`) {
      for (let item of customSpeciList) {
        mapSpec[item.weight] = item.diameterLength
        reserveMapSpec[item.diameterLength] = item.weight
      }
    }
    this.canDo = { ...this.canDo, ...{ mapSpec }, ...{ reserveMapSpec } }
  }

  // 生成select
  genetateSelect(options) {
    let { select } = this.canDo
    const { oneItemsCode } = options
    select[1] = {
      txt: ``,
      checked: true,
      show: true,
      className: `c9`,
    }
    if (oneItemsCode === `JZ`) {
      select[1] = {
        txt: `可做手寸(#)`,
        checked: true,
        show: true,
        className: `c9`,
      }
    }
    if (oneItemsCode === `SZ`) {
      select[1] = {
        txt: `可做圈口(cm)`,
        checked: true,
        show: true,
        className: `c9`,
      }
    }
    this.canDo.select = select
  }

  generateWeight(options) {
    let { customSpeciList } = options
    let arr = [];
    arr = customSpeciList.filter(item => item.weight).map(item => {
      const { weight: txt, weightType: type } = item
      return {
        txt,
        type,
        disabled: false,
        checked: false
      }
    })
    this.canDo.weightList = arr
  }

  generateRingHand(options) {
    let { customSpeciList } = options
    let arr = [];
    arr = customSpeciList.filter(item => item.ringHand).map(item => {
      const { ringHand: txt, type } = item
      return {
        txt,
        type,
        disabled: false,
        checked: false
      }
    })
    this.canDo.ringHandList = arr
  }

  generateDiameter(options) {
    let { customSpeciList } = options
    let arr = [];
    arr = customSpeciList.filter(item => item.diameterLength).map(item => {
      const { diameterLength: txt, type } = item
      return {
        txt,
        type,
        disabled: false,
        checked: false
      }
    })
    this.canDo.diameterList = arr
  }

  // 点击克重
  clickedWeight() {
    let { select, dialog, weightList: list } = this.canDo
    const { specIndex } = dialog
    let { proData } = this
    dialog = {
      txt: `可做克重(g)`,
      specIndex: 0,
      list
    }
    select.forEach(item => {
      item.className = `c3`
    })
    this.canDo.dialog = dialog
    this.checkedClass()
  }

  // 点击其他属性
  clickedOther() {
    let { select, dialog, ringHandList, diameterList } = this.canDo
    const { specIndex } = dialog
    let { proData } = this
    const { oneItemsCode } = proData
    if (oneItemsCode === `JZ`) {
      dialog = {
        txt: `可做手寸(#)`,
        specIndex: 1,
        list: ringHandList
      }
    }
    if (oneItemsCode === `SZ`) {
      dialog = {
        txt: `可做圈口(cm)`,
        specIndex: 1,
        list: diameterList
      }
    }
    select.forEach(item => {
      item.className = `c3`
    })
    this.canDo.dialog = dialog
    this.checkedClass()
  }

  // 筛选出选中的sku
  filterSku() {
    const { customSpeciList, oneItemsCode } = this.proData
    const { trueChoose } = this.canDo
    let trueSku = ``
    customSpeciList.forEach(item => {
      if (item.weight === trueChoose[0]) {
        trueSku = item
      }
    })
    if (oneItemsCode === `JZ`) {
      customSpeciList.forEach(item => {
        if (item.weight === trueChoose[0] && item.ringHand === trueChoose[1]) {
          trueSku = item
        }
      })
    }
    if (oneItemsCode === `SZ`) {
      customSpeciList.forEach(item => {
        if (item.weight === trueChoose[0] && item.diameterLength === trueChoose[1]) {
          trueSku = item
        }
      })
    }
    this.canDo.trueSku = trueSku
  }

  // 自定义规格联动
  specLink(index) {
    let { select, dialog, reserveMapSpec, mapSpec } = this.canDo
    const { specIndex } = dialog
    let trueChoose = [];
    if (specIndex === 0) {
      select[0].txt = dialog.list[index].txt
      select[1].txt = mapSpec[dialog.list[index].txt]
    }
    if (specIndex === 1) {
      select[1].txt = dialog.list[index].txt
      select[0].txt = reserveMapSpec[dialog.list[index].txt]
    }
    trueChoose = trueChoose.concat([select[0].txt, select[1].txt]).filter(item => item)
    this.canDo.select = select
    this.canDo.trueChoose = trueChoose
  }

  // 控制选中样式
  checkedClass() {
    const { select, dialog, trueChoose } = this.canDo
    const { specIndex } = dialog
    dialog.list.forEach(item => {
      item.checked = false
      if (item.txt === trueChoose[specIndex]) {
        item.checked = true
      }
    })
    this.canDo.dialog = dialog
  }

  // 点击确定 关闭弹窗
  selectcloseDialog(index) {
    let { select, dialog } = this.canDo
    const { specIndex } = dialog
    let { proData } = this
    dialog.propShow = false
    this.canDo.dialog = dialog
    this.specLink(index)
    this.filterSku()
    return this
  }

  getCanDo() {
    return this.canDo
  }


}

export default DetailDialog