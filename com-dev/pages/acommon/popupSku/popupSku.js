const app = getApp()

Component({
  properties: {
    popuStatus: Boolean,
    animationData: Object,
  },

  data: {
    result: {},
    hideRadius: true 
  },

  ready() {
    let self = this
    this.animation = wx.createAnimation()
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollHeight: (res.windowHeight - 153) * 2
        })
      }
    })
  },

  methods: {
    func() {

    },

    hidden() {
      let self = this
      setTimeout(() => {
        self.animation.height(800).step()
        self.setData({
          animationData: self.animation.export(),
        })
      }, 0)
      setTimeout(() => {
        self.triggerEvent('close', '')
      }, 0)
    },

    hiddenSlide() {
      this.hidden()
    },

    // 处理弹窗圆角兼容
    getShowProp() {
      this.setData({
        hideRadius: false
      })
    },

    getHideProp() {
      this.setData({
        hideRadius: true
      })
    }

  }
})
