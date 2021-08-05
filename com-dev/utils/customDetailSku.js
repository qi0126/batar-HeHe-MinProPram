class CustomDetailSku {
  constructor(obj) {
    this.propsData = obj
    this.skuList = []
    this.conditiList = []
    this.weightList = []
    this.diameterList = []
    this.lengthList = []
    this.ringhandList = []
    this.clickedObj = {}
    this.trueSkuList = []
    this.falseSkuList = []
    this.customWeight = {
      scopeList: []
    }
    this.customDiameter = {
      scopeList: []
    }
    this.customRinghand = {
      scopeList: []
    }
    this.customLength = {
      scopeList: []
    }
    this.utils = {
      valiObj(obj) {
        return Object.prototype.toString.call(obj) === "[object Object]"
      },

      // 数组的差集
      excludeList(arr, arr1) {
        let resArr = []
        for (let item of arr1) {
          item.isTrue = false
          for (let it of arr) {
            if (JSON.stringify(item) === JSON.stringify(it)) {
              item.isTrue = true
            }
          }
        }
        resArr = arr1.filter(item => !item.isTrue)
        for (let item of arr1) {
          delete item.isTrue
        }
        return resArr
      },

      // 对象的差集
      diffSet(obj, obj1) {
        let deffSetObj = {}
        for (let key in obj) {
          for (let key1 in obj1) {
            if (obj[key] === obj1[key]) {
              deffSetObj[key] = obj[key]
            }
          }
        }
        return deffSetObj
      },

      // 对象数组去重
      unique(arr) {
        let obj = {}
        for (let item of arr) {
          obj[JSON.stringify(item)] = item
        }
        return Object.keys(obj).map(item => JSON.parse(item))
      },

      // 对比两个对象
      compareObj(obj, obj1) {
        let arr = [],
          length = Object.keys(obj).length > Object.keys(obj1).length ? Object.keys(obj).length : Object.keys(obj1).length
        for (let key in obj) {
          if (key in obj1 && obj1[key] === obj[key]) {
            arr.push(key)
          }
        }
        return arr.length === length
      },

      verifyNumber(value) {
        if (/^\d+(\.?)\d+$/.test(value)) {
          return true;
        } else {
          return false;
        }
      },

      valiScope(value) {
        if (/^(\d+(\.?)\d+)(\-{1})(\d+(\.?)\d+)$/.test(value)) {
          return true;
        } else {
          return false;
        }
      },

      valiComma(value) {
        if (/^((\d+(\.?)\d+)(\,{1}))+(\d+(\.?)\d+)$/.test(value)) {
          return true;
        } else {
          return false;
        }
      },

    }
  }

  filterCustom(options, attr) {
    let obj = {
      scopeList: [],
      single: [],
    }
    attr = options[attr]
    if (this.utils.verifyNumber(attr)) {
      obj.single.push(attr)
    }
    if (this.utils.valiScope(attr)) {
      obj.scopeList.push(attr)
    }
    if (this.utils.valiComma(attr)) {
      obj.single = obj.single.concat(attr.split(','))
    }
    obj.single = [...new Set(obj.single)].map(item => {
      return {
        txt: item,
        checked: false,
      }
    })
    return obj
  }

  initRinghandList(options) {
    const {
      scopeList,
      single
    } = this.filterCustom(options, `ringHand`)
    this.customRinghand.scopeList = scopeList
    this.ringhandList = single
  }

  initConditiList(options) {
    const {
      conditi
    } = options
    if (!conditi) {
      return
    }
    let arr = []
    arr = conditi.split(',').map(item => {
      return {
        txt: item,
        checked: false,
      }
    })
    arr = arr.filter(item => item.txt)
    this.conditiList = arr
  }

  initWeightList(options) {
    const {
      scopeList,
      single
    } = this.filterCustom(options, `weight`)
    this.customWeight.scopeList = scopeList
    this.weightList = single
  }

  initDiameterList(options) {
    const {
      scopeList,
      single
    } = this.filterCustom(options, `diameterLength`)
    this.customDiameter.scopeList = scopeList
    this.diameterList = single
  }

  initLengthList(options) {
    const {
      scopeList,
      single
    } = this.filterCustom(options, `length`)
    this.customLength.scopeList = scopeList
    this.lengthList = single
  }

  initSkuList() {
    this.skuList = this.propsData.customSpeciList
  }

  initList(options) {
    if (!this.utils.valiObj(options)) {
      return
    }
    this.initSkuList()
    this.changeSkuList()
    this.initConditiList(options)
    this.initWeightList(options)
    this.initDiameterList(options)
    this.initLengthList(options)
    this.initRinghandList(options)
  }

  getAttr(obj, str) {
    if (!this.utils.valiObj(obj)) {
      return
    }
    if (typeof str !== 'string') {
      return
    }
    let attr = ``
    for (let key in obj) {
      if (key === str) {
        attr = obj[key]
      }
    }
    return attr
  }

  changeSkuList() {
    this.skuList.forEach(item => {
      if (item.extend_attr) {
        item.extend_attrs = JSON.parse(item.extend_attr)
        item.diameterLength = this.getAttr(item.extend_attrs, `diameterLength`)
        item.length = this.getAttr(item.extend_attrs, `length`)
        item.ringHand = this.getAttr(item.extend_attrs, `ringHand`)
      }
    })
  }

  // 通过checked判断选中
  getClieckdObj() {
    const clickedObj = this.clickedObj
    const conditiChecked = this.conditiList.find(item => item.checked)
    const weightListChecked = this.weightList.find(item => item.checked)
    const diameterChecked = this.diameterList.find(item => item.checked)
    const ringhandChecked = this.ringhandList.find(item => item.checked)
    const lengthChecked = this.lengthList.find(item => item.checked)
    clickedObj.conditi = conditiChecked ? conditiChecked.txt : ""
    clickedObj.weight = weightListChecked ? weightListChecked.txt : ""
    clickedObj.diameterLength = diameterChecked ? diameterChecked.txt : ""
    clickedObj.ringHand = ringhandChecked ? ringhandChecked.txt : ""
    clickedObj.length = lengthChecked ? lengthChecked.txt : ""
    for (let key in clickedObj) {
      if (!clickedObj[key]) {
        delete clickedObj[key]
      }
    }
  }

  // 点击成色
  clickedConditi(options) {
    this.conditiList.forEach(item => {
      item.checked = false
      if (item.txt === options.txt) {
        item.checked = !options.checked
      }
    })
    this.getClieckdObj()
  }

  // 点击克重
  clickedWeight(options) {
    this.weightList.forEach(item => {
      item.checked = false
      if (item.txt === options.txt) {
        item.checked = !options.checked
      }
    })
    this.getClieckdObj()
  }

  // 点击手镯
  clickedDiameter(options) {
    this.diameterList.forEach(item => {
      item.checked = false
      if (item.txt === options.txt) {
        item.checked = !options.checked
      }
    })
    this.getClieckdObj()
  }

  // 点击项链
  clickedLength(options) {
    this.lengthList.forEach(item => {
      item.checked = false
      if (item.txt === options.txt) {
        item.checked = !options.checked
      }
    })
    this.getClieckdObj()
  }

  // 点击戒指
  clickedRinghand(options) {
    this.ringhandList.forEach(item => {
      item.checked = false
      if (item.txt === options.txt) {
        item.checked = !options.checked
      }
    })
    this.getClieckdObj()
  }

  // 插入数据验证
  valiSet(options, list) {
    if (list.some(item => item.txt === options)) {
      return false
    }
    return true
  }

  setWeightList(options) {
    if (!this.valiSet(options, this.weightList)) {
      return
    }
    this.weightList.push({
      txt: options,
      checked: false,
    })
  }

  setDiameterList(options) {
    if (!this.valiSet(options, this.diameterList)) {
      return
    }
    this.diameterList.push({
      txt: options,
      checked: false,
    })
  }

  setLengthList(options) {
    if (!this.valiSet(options, this.lengthList)) {
      return
    }
    this.lengthList.push({
      txt: options,
      checked: false,
    })
  }

  setRinghandList(options) {
    if (!this.valiSet(options, this.ringhandList)) {
      return
    }
    this.ringhandList.push({
      txt: options,
      checked: false,
    })
  }


  getThis() {
    return this
  }

}

export default CustomDetailSku