// pages/acommon/orderProduct/orderProduct.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productData:Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //订单详情
    goOrderDetail(e){
      this.triggerEvent('goOrderDetail', e.currentTarget.dataset.orderno);
    },
    //取消订单
    cancelOrder(e) {
      this.triggerEvent('cancelOrder', e.currentTarget.dataset.orderno);
    }
  }
})
