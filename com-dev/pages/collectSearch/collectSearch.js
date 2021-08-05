const app = getApp()

Page({
  data: {
    $img: app.$img,
    result: {},
    list: [],
    floorstatus: false,
    inputValue:'',
    initState:true,
    num: 1
  },

 //回车事件
  confirmFun() {
    if (this.data.inputValue) {
      this.getData(1)
    }
  },
 //输入事件
  change(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

 //输入框清除
  closeFun(){
    this.setData({
      inputValue: ''
    })
    if (this.data.inputValue) {
      this.getData(1)
    }
  },

  //搜索
  goSearch(){
    if (this.data.inputValue) {
      this.getData(1)
    }
  },
 

  //产品详情
  goDetail(e) {
    const { item } = e.currentTarget.dataset
    return
    if (item.statu === 0) {
      return
    }
    let params = {
      proNum: item.batarNum
    }
    app.$api.produceInfo(params).then(res => {
      const { oneItemsCode } = res.data.pro
        if (oneItemsCode === 'TZ' || oneItemsCode === 'D-JZ') {
        wx.navigateTo({
          url: '/pages/detailSuit/detailSuit?proNum=' + item.batarNum,
        })
      } else {
        wx.navigateTo({
          url: '/pages/detail/detail?proNum=' + item.batarNum,
        })
      }
    })
  },

  //取消收藏
  slideCollect(e) {
    let data = e.detail.batarNum
    app.$u.showModal('确认取消收藏').then(res => {
      app.$api.produceClick({ proNum: data }).then(res => {
        this.getData(1)
      })
    })
  },

  scroll(e) {
    if (e.detail.scrollTop > 200) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  // backTop(e) {
  //   wx.pageScrollTo({
  //     scrollTop: 0,
  //     duration: 500
  //   })
  // },

  //上拉加载
  loadMore() {
    this.setData({
      num: this.data.num + 1
    })
    this.getData(this.data.num)
  },

  //获取收藏数据
  getData(num) {
    // wx.showNavigationBarLoading()
    app.$api.produceList({ 'page': num, rows: 30, search: this.data.inputValue}).then(res => {
      // wx.hideNavigationBarLoading()
      // wx.stopPullDownRefresh()
      // if (res.data.data) {
      //   res.data.data.forEach(item => {
      //     item.gold = `${item.min}~${item.max}`
      //     if (item.min == item.max) {
      //       item.gold = item.min
      //     }
      //   })
      // }
      this.setData({
        initState:false,
        result: res.data,
        list: num == 1 ? res.data.data : this.data.list.concat(res.data.data),
      })
      try {
        if (this.data.list.length >= res.data.rowSize) {
          this.setData({
            loadMore: true
          })
        }
      } catch (err) { }
    })
  },

  //页面滚动事件
  onPageScroll(e) {
    if (e.scrollTop > 200) {
      this.setData({
        scrollTopEnd: e.scrollTop,
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //下拉刷新
  onPullDownRefresh(e) {
    this.setData({
      num: 1
    })
    this.getData(1)
  },

  //上拉加载
  onReachBottom(e) {
    this.loadMore()
  },

  onLoad(options) {
    // this.getData(1)
  },

  onShow() {

  },
})
