const app = getApp()

Component({

  properties: {
    dataSource: Object,
  },


  data: {
    scrollHeight: 0,
    slideHight: 0,
    animationHeight: 30,
    isShow: false,
    isBtn:true,
    totalSum:0,//数量
  },

  created() {
    const self = this
    
    this.animation = wx.createAnimation({
      duration: 200
    })

  },

  methods: {

    hideModalAnimate() {
      const { screenHeight } = this.data
      setTimeout(() => {
        this.animation.height(screenHeight).step()
        this.setData({
          animationData: this.animation.export(),
        })
      }, 0)
    },

    hideModal() {
      setTimeout(() => {
        this.setData({
          isShow: false
        })
      }, 400)
    },


    //隐藏弹框
    hideShopCartDialog() {
      this.setData({
        isBtn:false
      })
      // 隐藏弹窗动画
      this.hideModalAnimate()

      // 隐藏弹窗
      this.hideModal()

      // this.triggerEvent("cancelEvent", {})
    },


    getDynaHeight() {
      const self = this
      let { animationHeight} = this.data

      wx.getSystemInfo({
        success(res) {
          const ratio = res.screenHeight / 675
          self.setData({
            screenHeight: res.screenHeight,
            slideHight: animationHeight * parseFloat(ratio.toFixed(2))
          })
        }
      })
    },
    //添加购物车和立即下单
    showModal() {
      let { dataSource } = this.data
      console.log(dataSource.onItemTrue.countNum)
      this.setData({
        isShow: true,
        isBtn:true,
        totalSum: dataSource.onItemTrue.countNum
      })
      console.log('aaa:', dataSource,this.data.totalSum)
    },

    //数量减1
    decrease(){
      let { totalSum } = this.data
      totalSum = totalSum-1
      if (this.data.totalSum > 1 ){
        this.setData({
          totalSum
        })
      }
    },
    //数量加1
    increase() {
      let { totalSum } = this.data
      totalSum = totalSum+1
      if (this.data.totalSum) {
        this.setData({
          totalSum
        })
      }
    },

    executeShowAnimate() {
      setTimeout(() => {
        this.animation.height(this.data.slideHight).step()
        this.setData({
          animationData: this.animation.export()
        })
      }, 0)
    },

    //展示弹框
    showShopCartDialog() {

      // 获取高度
      this.getDynaHeight()

      // 显示弹框
      this.showModal()

      // 执行弹窗动画
      this.executeShowAnimate()

    },




  }
})
