const app = getApp()

const $prodm = app.$m.proDetail
const df = app.$detailFilter

// console.log(df.filterSku())
  
function removeRepeat(arr, key, key1) {
  arr.sort((a, b) => {
    return b.num - a.num 
  })
  let key1Jude = true 
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      key1Jude = key1 ? arr[i][key1] === arr[j][key1] : true
      if (arr[i][key] === arr[j][key] && key1Jude) {
        arr.splice(j, 1);
        j = j - 1;  // 关键，因为splice()删除元素之后，会使得数组长度减小，此时如果没有j=j-1的话，会导致相同id项在重复两次以上之后无法进行去重，且会错误删除id没有重复的项。
      }
    } 
  } 
}

Page({
  data: {
    imgStatus: {
      a: '/images/shopcart/icon-on.png',
      b: '/images/shopcart/icon-not.png',
    },

    $img: app.$img,
    imgUrls: [],
    indicatorDots: true,
    color: 'rgba(167, 28, 32, .2)',
    colorActive: 'rgba(167, 28, 32, 1)',
    autoplay: true,
    interval: 5000,
    duration: 1000,

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

    // cover分包
    coverTotal: 0,
    coverStatu: false,
    coverShow: true,
    coverList: [{
      text: 111,
      val: 111,
      count: 0
    }, {
      text: 222,
      val: 222,
      count: 0
    }],
    coverTrueList: [],
    globalVal: '',

    checkedIndex: [], // 选中产品属性下标  
    countNum: 0, //数量
    dynList: {
      name: '',
      item: []
    }, // 动态获取参数 
    oneSku: [], // 单个sku参数
    allSku: [], // 所有的sku 
    allSkuParams: [], // 全部sku信息
    arrCount: [], // 各个sku重量数量价格 
    allCount: 0, // 全部数量
    allWeight: 0, // 全部重量
    allPrice: 0, // 全部价格
    isUpdata: 0, // 0新建 1更新

    arrParamsList: [], // 参数集合

    shopCount: 0, // 购物车总数
    noDyn: false, // 没有自定义规格
    detailOneList: [], // 可选参数为1
    detailList: [ // 参数详情
      //   { 
      //   name: '圈号(#)',
      //   value: 0
      // },
      {
        name: '标准克重(g)',
        value: 0
      }, {
        name: '重量范围(g)',
        value: '0-0'
      }, {
        name: '工费类型',
        value: '每克'
      },
      // {
      //   name: '出货重量',
      //   value: '约0'
      // },
      {
        name: '备注',
        value: ''
      }
    ],
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
      desc: detail.reMark,
    }
    if (detail.reMark.toString().length > 20) {
      app.$u.showToast(`最多输入20位`)
      return
    }
    app.$api.produceAddDesc(params).then(res => {
      this.setData({
        tagVal: detail.reMark,
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

  // 减数量
  decrease() {
    const { oneSku, noDyn, dynList, onIndexTrue } = this.data
    let { result } = this.data
    if (oneSku.length === 3 || (oneSku.length === 2 && noDyn)) {
      result.sku[onIndexTrue].countNum = result.sku[onIndexTrue].countNum === 0 ? 0 : Number(result.sku[onIndexTrue].countNum) - 1
      if (!noDyn) {
        dynList.item.forEach(item => {
          if (item.checked) {
            item.num = result.sku[onIndexTrue].countNum
          }
        })
      }
      this.handData()
    } else {
      app.$u.showToast(`请先选择规格参数`)
    }
  },

  // 加数量
  increase() {
    const { oneSku, noDyn, dynList, onIndexTrue } = this.data
    let { result } = this.data
    if (oneSku.length === 3 || (oneSku.length === 2 && noDyn)) {
      result.sku[onIndexTrue].countNum = Number(result.sku[onIndexTrue].countNum) + 1
      if (!noDyn) {
        dynList.item.forEach(item => {
          if (item.checked) {
            item.num = result.sku[onIndexTrue].countNum
          }
        })
      }
      this.handData()
    } else {
      app.$u.showToast(`请先选择规格参数`)
    }
  },

  // 输入框
  inputConfirm(e) {
    const { oneSku, noDyn, dynList, onIndexTrue } = this.data
    let { result } = this.data
    if (oneSku.length === 3 || (oneSku.length === 2 && noDyn)) {
      result.sku[onIndexTrue].countNum = Number(e.detail.value)
      if (!noDyn) {
        dynList.item.forEach(item => {
          if (item.checked) {
            item.num = result.sku[onIndexTrue].countNum
          }
        })
      }
      this.handData()
    }

  },

  // 点击选择事件
  itemClick(e) {
    let data = e.currentTarget.dataset,
      list = this.data.result.list
    let item = this.data.result.list[data.tit]
    if (item[data.index].disabled) {
      return
    }
    // 切换效果
    if (item[data.index].checked) {
      item[data.index].checked = false
    } else {
      item.forEach(item => {
        item.checked = false
      })
      item[data.index].checked = true
    }

    this.handData()
    df.clearDynList()
    this.setData({
      result: df.getData(),
      dynList: df.getDynList(),
    })
    this.clearCount()
  },

  // 点击克重 
  weiItemClick(e) {
    const { noDyn } = this.data
    let data = e.currentTarget.dataset
    let item = this.data.result.list.weightList
    if (data.item.disabled) {
      return
    }
    // 切换效果
    if (item[data.index].checked) {
      item[data.index].checked = false
    } else {
      item.forEach(item => {
        item.checked = false
      })
      item[data.index].checked = true
    }

    if (!noDyn) {
      this.data.dynList.item.forEach(item => {
        item.checked = false
      })
    }

    this.handData()
  },

  // 点击动态数据
  dynItemClick(e) {
    const { oneSku, result, dynList } = this.data
    let data = e.currentTarget.dataset
    let item = this.data.dynList.item
    if (data.item.disabled) {
      return
    }
    //  切换效果
    if (item[data.index].checked) {
      item[data.index].checked = false
    } else {
      item.forEach(item => {
        item.checked = false
      })
      item[data.index].checked = true
    }
    this.handData()

  },

  // 输入备注
  getRemark(e) {
    let val = e.detail.value
    const { oneSku, noDyn, onItemTrue, result, allSku } = this.data
    if (oneSku.length === 3 || (oneSku.length === 2 && noDyn)) {
      df.chageRemark(val)
      this.setData({
        result: df.getData()
      })
      this.handData()
    } else {
      app.$u.showToast(`请先选择规格参数`)
    }
  },

  // 加入购物车
  addTrolley() {
    let { oneSku, result, result: { pro: {proNumber: proNo } } } = this.data
    let arr = []
    this.data.arrParamsList.forEach(item => {
      if (item.totalSum !== 0) {
        arr.push(item)
      }
    }) 
    let troParams = {
      proNo,
      suit: 1,
      isUpdata: 2,
      singleCartFroms: arr
    }
    if (troParams.singleCartFroms.length === 0) {
      app.$u.showToast('请选择要加入的数量')
      return
    }

    app.$u.showModal(`确定加入购物车？`).then(ele => {
      app.$u.showLoading()
      app.$api.addBigSingleCart(troParams).then(res => {
        app.$u.showToast('加入购物车成功')
        this.setData({
          shopCount: this.data.shopCount += this.data.allCount
        })
      })
    })
  },

  // 清空总数
  clearCount() {
    df.clearCount()
    this.setData({
      allCount: 0,
      allWeight: 0,
      allPrice: 0
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
      this.setData({
        arrParamsList: [],
        allCount: 0,
        allWeight: 0,
        allPrice: 0,
        shopCount: 0,
      })
    })
  },

  coverSlide() {
    let { coverShow } = this.data
    this.setData({
      coverShow: !coverShow
    })
  },

  // 分包点击确认
  coverTrue() { //todo
    let { result, onItemTrue } = this.data
    onItemTrue.coverTrueList = []
    onItemTrue.coverList.forEach(item => {
      if (item.radio) {
        onItemTrue.coverTrueList.push(item)
      }
    })

    // 第一次切换 没有选择分包店铺
    if (!onItemTrue.coverStatu && onItemTrue.coverTrueList.length === 0) {
      onItemTrue.coverStatu = false
      this.setData({
        coverShow: true,
        onItemTrue,
      })
    }

    // 第一次切换 选择了分包店铺
    if (!onItemTrue.coverStatu && onItemTrue.coverTrueList.length > 0) {
      onItemTrue.coverStatu = true
      this.coverClearOne()
      this.setData({
        coverShow: true,
        onItemTrue,
      })
    }

    // 取消选择分包店铺
    if (onItemTrue.coverStatu && onItemTrue.coverTrueList.length === 0) {
      onItemTrue.coverStatu = false
      // this.reset()
      this.setData({
        coverShow: true,
        onItemTrue,
      })
    }

    // 改变了分包店铺
    if (onItemTrue.coverStatu && onItemTrue.coverTrueList.length > 0) {
      onItemTrue.coverStatu = true
      this.setData({
        coverShow: true,
        onItemTrue,
      })
      this.coverChangeShop()
    }

  },

  // 清空当前选中分包的Sku数据
  coverClearOne() {
    let { onItemTrue } = this.data
    const { result, noDyn, dynList } = this.data
    if (noDyn) {
      result.sku.forEach(item => {
        if (item.skunum === onItemTrue.skunum) {
          item.countNum = 0
          item.num = 0
        }
      })
    } else {
      result.sku.forEach(item => {
        if (item.skunum === onItemTrue.skunum && item[dynList.name] === onItemTrue[dynList.name]) {
          item.countNum = 0
          item.num = 0
        }
      })
    }
    this.setData({
      result
    })
    df.getOneSku()
    // this.getAllParams()
    // this.countAll()
  },

  // 分包店铺列表改变
  coverChangeShop() {
    const { result, noDyn, onItemTrue, dynList } = this.data
    let trueArr = []
    onItemTrue.coverTrueList.forEach(item => {
      trueArr.push(item.val)
    })

    onItemTrue.coverList.forEach(item => {
      if (!trueArr.includes(item.val)) {
        item.count = 0
      }
    })

    if (onItemTrue.coverTrueList.length === 0) {
      if (noDyn) {
        result.sku.forEach(item => {
          if (item.skunum === onItemTrue.skunum) {
            item.num = 0
          }
        })
      } else {
        result.sku.forEach(item => {
          if (item.skunum === onItemTrue.skunum && item[dynList.name] === onItemTrue[dynList.name]) {
            if (item.skunum === onItemTrue.skunum) {
              item.num = 0
            }
          }
        })
      }
      onItemTrue.coverStatu = false
    }


    // 自定义规格上分包数据变化
    dynList.item.forEach(item => {
      if (item.coverNumList) {
        item.coverNumList.forEach(it => {
          if (!trueArr.includes(it.coverItem)) {
            it.num = 0
          }
        })
      }
    })

    this.setData({
      result,
      dynList,
      onItemTrue,
    })

    df.getOneSku()
    // this.getAllParams()
    // this.countAll()
  },

  defRadio(e) {
    let { index } = e.currentTarget.dataset
    const { onItemTrue } = this.data
    onItemTrue.coverList[index].radio = !onItemTrue.coverList[index].radio
    this.setData({
      onItemTrue
    })
  },

  // 分包加
  coverIncrease(e) { // todo
    const { item: iitem, index } = e.currentTarget.dataset
    const { oneSku, noDyn, globalVal, dynList, onItemTrue } = this.data
    if (oneSku.length === 3 || (oneSku.length === 2 && noDyn)) {
      onItemTrue.coverTrueList[index].count = onItemTrue.coverTrueList[index].count + 1

      dynList.item.forEach(item => {
        if (item.checked) {
          item.num = 0
          item.coverNumList.push({
            num: onItemTrue.coverTrueList[index].count,
            coverItem: iitem.val
          })
          removeRepeat(item.coverNumList, 'coverItem');
          console.log(JSON.parse(JSON.stringify(item.coverNumList)))
          item.coverNumList.forEach(it => {
            item.num += it.num
          })
        }
      })

      this.setData({
        globalVal: iitem.val,
        dynList,
        onItemTrue
      })
      df.getOneSku()
      // this.getAllParams()
      // this.countAll()

    } else {
      app.$u.showToast(`请先选择规格参数`)
    }
  },

  // 分包减
  coverDecrease(e) {
    const { item: iitem, index } = e.currentTarget.dataset
    const { oneSku, noDyn, dynList, globalVal, onItemTrue } = this.data
    if (oneSku.length === 3 || (oneSku.length === 2 && noDyn)) {
      onItemTrue.coverTrueList[index].count = onItemTrue.coverTrueList[index].count === 0 ? 0 : onItemTrue.coverTrueList[index].count - 1

      dynList.item.forEach(item => {
        if (item.checked) {
          item.num = 0
          item.coverNumList.push({
            num: coverTrueList[index].count,
            coverItem: iitem.val
          })
          removeRepeat(item.coverNumList, 'coverItem');
          item.coverNumList.forEach(it => {
            if (it.coverItem === globalVal) {
              it.num = coverTrueList[index].count
            }
          })
          item.coverNumList.forEach(it => {
            item.num += it.num
          })
        }
      })

      this.setData({
        globalVal: iitem.val,
        onItemTrue,
        dynList
      })
      df.getOneSku()
      // this.getAllParams()
      // this.countAll()
    } else {
      app.$u.showToast(`请先选择规格参数`)
    }
  },

  // 分包输入
  coverInputConfirm(e) {
    const { item: iitem, index } = e.currentTarget.dataset
    const { oneSku, noDyn, dynList, globalVal, onItemTrue } = this.data
    if (oneSku.length === 3 || (oneSku.length === 2 && noDyn)) {
      onItemTrue.coverTrueList[index].count = Number(e.detail.value)

      dynList.item.forEach(item => {
        if (item.checked) {
          item.num = 0
          item.coverNumList.push({
            num: onItemTrue.coverTrueList[index].count,
            coverItem: iitem.val
          })
          removeRepeat(item.coverNumList, 'coverItem');
          item.coverNumList.forEach(it => {
            if (it.coverItem === globalVal) {
              it.num = onItemTrue.coverTrueList[index].count
            }
          })
          item.coverNumList.forEach(it => {
            item.num += it.num
          })
        }
      })

      this.setData({
        globalVal: iitem.val,
        onItemTrue,
        dynList
      })
      df.getOneSku()
      // this.getAllParams()
      // this.countAll()
    } else {
      app.$u.showToast(`请先选择规格参数`)
    }
  },

  // 删除分包
  deleCoverList(e) {
    const { item, index } = e.currentTarget.dataset
    const { onItemTrue } = this.data
    app.$u.showModal('确认删除此店铺吗？').then(res => {
      onItemTrue.coverTrueList.splice(index, 1)
      this.coverChangeShop()
      // if (onItemTrue.coverTrueList.length === 0) {
      //   this.coverChangeShop()
      // }else {
      //   this.coverChangeShop()
      // }
      this.setData({
        onItemTrue
      })
    })
  },

  getTag(data) {
    const { alias } = data.pro
    this.setData({
      tagVal: alias ? alias : ''
    })
  },

  getDetail() {
    const { backData, proNum = 1215 } = this.data
      // xl-00223
    app.$api.produceInfo({ proNum }).then(res => {
      // res = $prodm
      // 得到产品标签
      this.getTag(res.data)
      df.changeInit(res.data, backData)
      res.data = df.getData()
      this.setData({
        dynList: df.dynList,
        noDyn: df.noDyn,  // 获取当前sku组合是否有自定义规格
        result: res.data,
        resultPro: res.data.pro,
        sourceSku: res.data.sku,
        surceDetaiList: JSON.parse(JSON.stringify(this.data.detailList))
      })
      this.handData()
      // this.getAllParams()
    })
  },

  getData() {
    this.getDetail()
  },

  handData() {
    df.setDynList(this.data.dynList)
    df.getOneSku()
    this.setData({
      oneSku: df.getOneSkuTrue(),
      result: df.getData(),
      dynList: df.getDynList(),
      detailList: df.getDetailList(),
      onItemTrue: df.getOnItemTrue(),
      onIndexTrue: df.getOnIndexTrue(),
      allCount: df.getAllCountMap().allCount,
      allWeight: df.getAllCountMap().allWeight,
      allPrice: df.getAllCountMap().allPrice,
      arrParamsList: df.getArrParamsList()
    })
  },

  // // 分享
  // share() {

  // }, 

  // onShareAppMessage(e) {

  // },

  getBackData() {
    const { cartId } = this.data
    let params = {
      cartId
    }
    app.$api.findBigSuitCartInfoById(params).then(res => {
      this.setData({
        backData: res.data
      })
      this.getData()
    })
  },

  onLoad(options) {
    // this.getBackData()

    if (!options.itemTrue) {
      return
    }
    const { productNo: proNum, id: cartId } = JSON.parse(options.itemTrue)
    this.setData({
      cartId,
      proNum
    })
    this.getBackData()
  },

})