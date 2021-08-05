import $u from './util';
 
class Detail { 
  constructor() {
    this.hintDyn = {
      XL: 'length',
      SL: 'length', 
      SZ: 'diameterLength',
      JZ: 'ringHand',
    } 
    this.data = {}; 
    this.noDyn = false;
    this.dynList = {};
    this.intArr = [];
    this.oneSku = [];   
    this.oneItemSource = '';
    this.onItemTrue = '';
    this.onIndexTrue = '';
    this.intCoverList = [{ 
      text: '111', 
      val: 111,
      count: 0
    }, {
      text: 222,
      val: 222,
      count: 0
    }];
    // 参数详情
    this.detailList = [
      {
        name: '工费类型',
        value: '每克'
      }, 
      {
        name: '基本工费(￥)',
        value: 0
      },
      {
        name: '附加工费(￥)',
        value: 0
      },
    ],
      // 参数详情
      this.arrParamsList = [],
      // 获取参数集合
      this.countAllArr = [],
      // 总数集合
      this.allCountMap = {},

      // 修改状态
      this.backStatus = false,
      this.backData = {}
  }

  reset() {
    this.onItemTrue = ''
    this.detailList = [
      // {
      //   name: '标准克重(g)',
      //   value: 0
      // }, {
      //   name: '重量范围(g)',
      //   value: '0-0'
      // }, 
      {
        name: '工费类型',
        value: '每克'
      }, {
        name: '基本工费(￥)',
        value: 0
      },
      {
        name: '附加工费(￥)',
        value: 0
      },
      // {
      //   name: '出货重量',
      //   value: '约0'
      // },
      // {
      //   name: '备注',
      //   value: ''
      // }
    ]
    
  }

  // 判断是否选中全部
  judgeCondition() {
    let oneSkuLength = this.oneSku.length === 3
    let noDynStatus = this.oneSku.length === 2 && this.noDyn
    return (oneSkuLength || noDynStatus)
  }

  // 通过条件判断sku
  filterOneSku(cb, er) {
    let trueBtnStatus = ''
    let noDynStatus = this.oneSku.length === 2 && this.noDyn
    const { data, oneSku } = this
    const { name: dynName } = this.dynList
    data.sku.forEach((item, index) => {
      if (noDynStatus) {
        trueBtnStatus = oneSku[1] === item.weight
      } else {
        trueBtnStatus = (oneSku[1] === item.weight) && (oneSku[2] === item[dynName])
      }
      // 标准克重
      if ($u.compare(Object.values(item), oneSku) && item.conditi === oneSku[0] && trueBtnStatus) {
        cb(this, item, index)
      } else {
        er(this, item, index)
      }
    })
    this.data = data
  }

  filterOneSkuCb(self, item, index) {
    self.onIndexTrue = index
    self.onItemTrue = item
    // 分包赋值
    if (item.coverStatu) {
      item.coverNumList = JSON.parse(JSON.stringify(item.coverTrueList))
    } else {
      item.num = self.onItemTrue.countNum || 0
    }
    item.disabled = false
  }

  filterOneSkuEr(self, item) {
    item.disabled = true
  }

  // 获取oneSku todo
  getOneSku() {
    const { list } = this.data
    const { dynList, noDyn } = this
    let checkedIndex, oneSku = []
    list.conditList.forEach((item, index) => {
      if (item.checked) {
        oneSku[0] = item.name
      }
    })
    list.weightList.forEach((item, index) => {
      if (item.checked) {
        oneSku[1] = item.name
      }
    })
    if (!noDyn) {
      dynList.item.forEach((item, index) => {
        if (item.checked) {
          oneSku[2] = item.name
        }
      })
    }
    this.oneSku = oneSku.filter(item => item !== undefined)
    this.checkOnItemTrue()
  }

  // 获取选中的sku
  checkOnItemTrue() {
    const { noDyn } = this
    // 获取当前选中sku最后的数值
    if (this.judgeCondition()) {
      this.filterOneSku(this.filterOneSkuCb, this.filterOneSkuEr)
      this.getDetailListTrue()
    } else {
      if (this.oneSku.length === 0 || this.oneSku.length === 1) {
        this.data.sku.forEach((item, index) => {
          if ($u.compare(Object.values(item), this.oneSku)) {
            item.disabled = false
          } else {
            item.disabled = true
          }
        })
      }
      if (this.oneSku.length === 2) {
        this.data.sku.forEach((item, index) => {
          let btnTrueStatus
          // 点击选中的是克重
          if (this.data.list.weightList.some(it => it.checked)) {
            btnTrueStatus = item.weight === this.oneSku[1]
          }
          // 点击选中的是链长
          if (!noDyn) {
            if (this.dynList.item.some(it => it.checked)) {
              btnTrueStatus = item[this.dynList.name] === this.oneSku[1]
            }
          }
          if ($u.compare(Object.values(item), this.oneSku) && btnTrueStatus) {
            item.disabled = false
          } else { 
            item.disabled = true
          }
        })
      }
      if (this.oneSku.length === 3) {
        this.data.sku.forEach((item, index) => {
          if ($u.compare(Object.values(item), this.oneSku) && item.weight === this.oneSku[1] && item[this.dynList.name] === this.oneSku[2]) {

            item.disabled = false
          } else {
            item.disabled = true
          }
        })
      }
    }
    this.getShowList()
  }
 
  // 改变页面数据的按钮状态
  getShowList() {
    // 筛选disabled的key
    const { dynList, onIndexTrue = 0, noDyn } = this
    const { sku, list } = this.data

    // 显示选中的克重集合的重量
    list.weightList.forEach(item => {
      item.weightNum = 0
      sku.forEach(it => {
        if (item.name === it.weight && it.weightNum) {
          item.weightNum = it.weightNum
        }
      })
    })

    list.conditList.forEach(item => {
      item.disabled = !sku.some(it => { return item.name === it.conditi && !it.disabled })
    })
    list.weightList.forEach(item => {
      const _info = sku.filter(v => item.name === v.weight);
      const { conditi } = _info[0];
      const { oneSku } = this;
      let tem = list.conditList.filter(v => v.name === oneSku[0]);
      if ( tem.length > 0 ) {
        item.disabled = typeof oneSku[0] === 'string' ? !(oneSku[0] === conditi) : false;
      } else {
        item.disabled = !sku.some(it => { return item.name === it.weight && !it.disabled })
      }
    })
    if (!noDyn) {
      dynList.item.forEach(item => {
        item.disabled = !sku.some(it => { return item.name === it[this.dynList.name] && !it.disabled })
      })
    }
    this.data.list = list
    this.changeDynList()
  }

  changeDynNameShow(dynName) {
    let arr = {
      length: `链长(cm)`,
      diameterLength: `圈口(cm)`,
      ringHand : `手寸(#)`
    }
    return arr[dynName]
  }

  // 获取参数栏目数据
  getDetailListTrue() {
    const { onItemTrue, dynList, noDyn } = this
    const { name: dynName } = dynList
    let moreWeightOne
    moreWeightOne = onItemTrue.weight_start && `${onItemTrue.weight_start}-${onItemTrue.weight_end}`
    let detailList = [{
      name: this.changeDynNameShow(dynName),
      value: onItemTrue[dynName] ? onItemTrue[dynName] : '暂无此规格'
    }, 
    // {
    //   name: '标准克重(g)',
    //   value: onItemTrue.weight
    // }, 
    // {
    //   name: '重量范围(g)',
    //   value: moreWeightOne ? moreWeightOne : `0-0`
    // }, 
    {
      name: '工费类型', 
      value: onItemTrue.fee_type === 1 ? '每克' : '每件',
    }, 
    {
      name: '基础工费(￥)',
        value: onItemTrue.conditi === "999" ? wx.getStorageSync('price999') : wx.getStorageSync('price9999'),
    },
    {
      name: '附加工费(￥)',
        value: onItemTrue.fee_type === 1 ? onItemTrue.addition_price : onItemTrue.fee_price,
    },
    // {
    //   name: '出货重量',
    //     value: `约${(onItemTrue.weight * onItemTrue.num).toFixed(2)}`
    // },
    // {
    //   name: '备注',
    //   value: onItemTrue.productRemarks ? onItemTrue.productRemarks : '',
    // }
    ]

    if (onItemTrue.fee_type !== 1 || !onItemTrue.addition_price) {
      // detailList.splice(4, 1)
    }
    if (!moreWeightOne) {
      detailList.splice(2, 1)
    }
    if (noDyn) {
      detailList.splice(0, 1)
    }
    this.detailList = detailList

    this.getSkuNumTrue()
  }

  // 获取选中的参数
  getSkuNumTrue() {
    const { onItemTrue } = this
    this.arrCountParams = { skunum: onItemTrue.skunum, totalSum: onItemTrue.num, fee_type: onItemTrue.fee_type, weight: onItemTrue.weight, price: onItemTrue.price, addition_price: onItemTrue.addition_price, productRemarks: onItemTrue.productRemarks, weightScope: `${onItemTrue.weight_start}-${onItemTrue.weight_end}`, coverNumList: onItemTrue.coverNumList }
    this.getParams()
  }

  getParams() { //todo
    let arrParamsList = [], countAllArr = []
    if (this.onItemTrue.coverStatu) {
      this.data.sku.forEach(item => {
        if (item.coverNumList && item.coverNumList.length > 0) {
          item.coverNumList.forEach(it => {
            if (it.val > 0) {
              arrParamsList.push({
                skuNum: item.skunum,
                totalSum: it.count,
                weight: item.weight,
                coverShop: it.text,
                productRemarks: item.productRemarks
              })
              countAllArr.push({
                conditi: item.conditi,
                skunum: item.skunum,
                totalSum: it.count,
                fee_type: item.fee_type,
                weight: item.weight,
                price: item.price,
                coverShop: it.text,
                addition_price: item.addition_price,
                fee_price: item.fee_price,
                productRemarks: item.productRemarks,
              })
            }
          })
        }
      })
    } else {
      this.data.sku.forEach(item => {
        if (item.num) {
          arrParamsList.push({
            skuNum: item.skunum,
            totalSum: item.num,
            weight: item.weight,
            productRemarks: item.productRemarks
          })
          countAllArr.push({
            conditi: item.conditi,
            skunum: item.skunum,
            totalSum: item.num,
            fee_type: item.fee_type,
            weight: item.weight,
            price: item.price,
            addition_price: item.addition_price,
            fee_price: item.fee_price,
            productRemarks: item.productRemarks,
          })
        }
      })
    }
    this.arrParamsList = arrParamsList
    this.countAllArr = countAllArr
    this.countAll()
    this.changeWeightNum()
  }

  // 计算总数
  countAll() {
    let allCount = 0,
      allWeight = 0,
      allPrice = 0,
      allWeightStart = 0,
      allWeightEnd = 0
    
    // 计算总数量 总工费 自定义圈号
    this.countAllArr.forEach(item => {
      if (item.addition_price === undefined) {
        item.addition_price = 0
      }
      if (item.totalSum !== 0) {
        allCount += item.totalSum
        allWeight += (item.weight * item.totalSum)
        allPrice += $u.countPrice(item.conditi, item.fee_type, item.totalSum, item.addition_price, item.fee_price, item.weight)
      }
    })

    this.allCountMap = {
      allCount,
      allWeight: allWeight.toFixed(2),
      allPrice: allPrice.toFixed(2)
    }
  }

  // 改变 克重数字
  changeWeightNum() {
    const { data, onIndexTrue, countAllArr } = this
    // 对比原sku值与选中的数据
    if (data.sku[onIndexTrue].coverStatu) { // 分包克重
      data.sku.forEach((item, index) => {
        item.weightNum = 0
        countAllArr.forEach(it => {
          if (item.weight === it.weight) {
            item.weightNum += it.totalSum
          }
        })
      })
    } else {
      data.sku.forEach((item, index) => {
        item.weightNum = 0
        countAllArr.forEach(it => {
          if (item.weight === it.weight) {
            item.weightNum += it.totalSum
          }
        })
      })
    }
    this.data = data
    this.getShowList()
  }

  // 改变自定义规格数字
  changeDynList() {
    const { onIndexTrue, data, dynList, countAllArr, oneSku, noDyn } = this
    if (noDyn) {
      return
    }
    let dataTrue = [], aarr2 = [], trueClick2 = [], oneSkuFour = oneSku.slice(0, 2)
    if (oneSku.length >= 2) {
      data.sku.forEach((item, index) => {
        if ($u.compare(Object.values(item), oneSkuFour) && item.weight === oneSku[1]) {
          dataTrue.push(item)
        }
      })
      aarr2 = dataTrue.map(item => {
        return {
          name: item[dynList.name],
          num: item.num || 0
        }
      })
      aarr2 = $u.unique(aarr2)
      aarr2.forEach(item => {
        if (item.num !== 0) {
          trueClick2.push({
            name: item.name,
            num: item.num
          })
        }
      })
      dynList.item.forEach(item => {
        item.num = 0
      })
      dynList.item.forEach(item => {
        trueClick2.forEach(it => {
          if (item.name === it.name) {
            item.num = it.num
          }
        })
      })
      this.dynList = dynList
    }
  }

  // 获取备注
  chageRemark(val) {
    const { onIndexTrue, data } = this
    data.sku[onIndexTrue].productRemarks = val
    this.data = data
    this.getSkuNumTrue()
  }

  // 切换成色 清除数据
  clearDynList() {
    const { onItemTrue, dynList, data, noDyn } = this

    // 重置重量列表数据
    data.list.weightList.forEach(item => {
      item.checked = false
      item.weightNum = 0
    })

    data.sku.forEach((item, index) => {
      item.weightNum = 0
      item.num = 0
      item.countNum = 0
      item.productRemarks = ''
    })

    if (!noDyn) {
      dynList.item.forEach(item => {
        item.checked = false
        item.num = 0
      })
      if (onItemTrue && onItemTrue.coverStatu) {
        dynList.item.forEach(item => {
          item.coverNumList = []
        })
      }
    }
    if (onItemTrue) {
      data.sku.coverTrueList && data.sku.coverTrueList.forEach(item => {
        item.count = 0
      })
    }

    this.arrParamsList = []
    this.dynList = dynList
    this.data = data
  }

  // 清空总数
  clearCount() {
    this.allCountMap = {}
  }

  // 改变自定义规格
  setDynList(dynList) {
    this.dynList = dynList
  }

  // 初始化
  getIntArr(init) {
    this.initArr = init
  }

  // 筛选出sku
  filterSku() {
    return this.initArr
  }

  // 取出重复的sku
  repetSourceSku(data) {
    data = $u.unique(data.sku)
  }

  // 给没有值的动态参数赋空值 删除全部为空的动态参数 获取动态参数
  changeDynDataNull(data) {
    let arr = [],
      aarr = {},
      key,
      dynEmpy = false
    Object.keys(this.hintDyn).forEach(item => {
      if (this.oneItemSource === item) {
        key = this.hintDyn[item]
      }
    })
    if (key) {
      data.sku.forEach(item => {
        if (item[key] === undefined) {
          item[key] = ''
        }
      })
      aarr.name = key
      aarr.item = data.sku.map(item => {
        return {
          name: item[key],
          coverNumList: []
        }
      })
      aarr.item = $u.repetName(aarr.item)
      dynEmpy = data.sku.some(item => item[key] !== "")
    }
    if (!dynEmpy) {
      data.sku.forEach(item => {
        delete item[key]
      })
    }

    this.noDyn = !dynEmpy
    this.data = data
    this.dynList = aarr
  }

  // 数据转换
  changeDataPort(data) {
    const { pro } = data
    data.sku = pro.proSpecList
    this.oneItemSource = pro.oneItemsCode
    data.sku.forEach(item => {
      item.price = item.fee_price
      item.countNum = 0
      if (item.extend_attr) {
        for (let i in JSON.parse(item.extend_attr)) {
            item[i] = JSON.parse(item.extend_attr)[i]
            item.coverStatu = false
            item.coverTrueList = []
            item.coverList = this.intCoverList
            item.productRemarks = ''
        }
      } else {
        item.extend_attr = {}
      }
    })
  }

  // 储存原始列表
  getListSource() {
    const { data } = this
    let oneSku = this.data.oneSku
    let conditList = [],
      weightList = []
    data.sku.forEach(item => {
      conditList.push(item.conditi)
      weightList.push(item.weight)
    })
    conditList = [...new Set(conditList)].map(item => { return { name: item } })
    weightList = [...new Set(weightList)].map(item => { return { name: item } })
    data.list = {
      conditList,
      weightList
    }
    this.data = data
  }

  // 转换初始数值
  changeInit(data, backData) {
    this.changeDataPort(data) // 数据转换
    backData && this.switchBackData(data, backData)
    backData && this.backOneTimeTrue(data, backData)
    this.repetSourceSku(data) // 去除重复的sku
    this.changeDynDataNull(data) // 给没有值的动态参数赋空值 删除全部为空的动态参数 获取动态参数
    this.getListSource(data)
    this.data = data
    backData && this.setDefConditList()
    backData && this.setDefWeightList()
    backData && this.setDefDynList()
    console.log(this.data)

    // console.log(data, backData)
  }
  
  // 根据回填数据 给源sku赋值(edit)
  switchBackData(data, backData) {
    this.backStatus = true
    this.backData = JSON.parse(JSON.stringify(backData)) 
    data.sku.forEach(item => {
      backData.cartProperties.forEach(it => {
        if (item.skunum === it.skuNum) {
          item.countNum = it.outSum
          item.weightNum = it.outSum
          item.num = it.outSum
          item.disabled = false
          item.productRemarks = it.productRemarks
        }
      })
    })
  }

  // 确定选中sku
  backOneTimeTrue(data){
    const { backData } = this
    this.onItemTrue = data.sku.filter(item => item.skunum === backData.cartProperties[0].skuNum)[0]
  }

  // 给成色列表赋值(edit)
  setDefConditList() {
    const { backData, data, onItemTrue } = this
    data.list.conditList.forEach(item => {
      if (item.name === onItemTrue.conditi) {
        item.checked = true
      }
    })
    this.data = data
  }

  // 给克重列表赋值(edit)
  setDefWeightList() {
    const { backData, data, onItemTrue } = this
    data.list.weightList.forEach(item => {
      if (item.name === onItemTrue.weight) {
        item.checked = true
      }
    })
    this.data = data 
  }

  // 给链长列表赋值(edit) 
  setDefDynList() {
    const { backData, data, dynList, onItemTrue, oneItemSource, hintDyn, noDyn } = this
    if (noDyn) {
      return 
    }
    dynList.item.forEach(item => {
      if (item.name === onItemTrue[hintDyn[oneItemSource]]) {
        item.checked = true
      }
    })
    this.data = data 
  }

  // 获取被选中的Sku
  getOneSkuTrue() {
    return this.oneSku
  }

  // 获取被选中的sku
  getOnItemTrue() {
    return this.onItemTrue
  }

  // 获取选中的sku下标
  getOnIndexTrue() {
    return this.onIndexTrue
  }

  // 获取result
  getData() {
    return this.data
  }

  // 获取自定义规格
  getDynList() {
    return this.dynList
  }

  // 获取参数详情
  getDetailList() {
    return this.detailList
  }

  // 获取选中的计算集合
  getAllCountMap() {
    return this.allCountMap
  }

  // 获取选中的集合
  getArrParamsList() {
    return this.arrParamsList
  }
}



export default new Detail()