const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderProductData:{
      type:Object,
      observer: function (newVal, oldVal) {
        this.setData({
          newOrderProduct: newVal
        })
      }
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    $img: app.$img,
    newOrderProduct:{},
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //产品详情
    goDetail(e) {
      const { item } = e.currentTarget.dataset
      console.log('产品id', item);
      // return
      if (item.productNo == '') {
        return
      }
      let params = {
        proNum: item.productNo
      }
      wx.navigateTo({
        url: '/pages/detail/detail?proNum=' + item.productNo,
      })
    },
    //产品开关
    productSwitchFun(){
      this.data.newOrderProduct.checked = !(this.data.newOrderProduct.checked);
      this.setData({
        newOrderProduct: this.data.newOrderProduct
      })
    },
    //sku开关
    skuSwitchFun(e){
      let index = e.currentTarget.dataset.index;
      this.data.newOrderProduct.orderProduct[index].checked = !(this.data.newOrderProduct.orderProduct[index].checked)
      this.setData({
        newOrderProduct: this.data.newOrderProduct
      })
    },
  }
})
