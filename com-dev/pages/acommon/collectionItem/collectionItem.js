const app = getApp()

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
    $img: app.$img,
  },

  created: function () {
  },

  attached: function () {
  },

  ready: function () {
  },


  /**
   * 组件的方法列表
   */
  methods: {
    cancelCollect(e) {
  
      console.log('取消收藏', e.currentTarget.dataset.batarnum);
      this.triggerEvent('cancelCollect', { batarNum: e.currentTarget.dataset.batarnum });

    }
  }
})
