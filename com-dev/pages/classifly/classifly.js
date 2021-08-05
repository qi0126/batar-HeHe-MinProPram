const app = getApp()

Page({
  data: {
    classList: [],
  },

  //重置
  resetFun() {

    app.$u.showModal('确定要重置页面？').then(e => {
      this.data.classList.forEach(item => {
        item.items.forEach(it => {
          it.checked = false
        })
      })
      this.setData({
        classList: this.data.classList
      })
    }).catch(err => {

    })

  },

  //确认
  goIndex() {
    // wx.removeStorageSync('searchKey')
    let params = {
      one: [],
      proType: [],
      series: [],
      weight: [],
      gold: [],
      process: [],
      effect: [],
      car: [],
      crow: [],
      exterior: [],
      theme: []
    }
    this.data.classList.forEach(item => {
      item.items.forEach(it => {
        if (it.checked) {
          switch (item.tit) {
            case '一级品目':
              params.one.push(it.code);
              break
            // case '工艺级别':
            //   params.proType.push(it.code);
            //   break
            // case '主题':
            //   params.theme.push(it.code);
            //   break
            // case '系列':
            //   params.series.push(it.code);
            //   break
            case '克重(g)':
              params.weight.push(it.code);
              break
            // case '材质':
            //   params.gold.push(it.code);
            //   break
            // case '生产工艺':
            //   params.process.push(it.code);
            //   break
            // case '表面工艺':
            //   params.effect.push(it.code);
            //   break
            // case '车花':
            //   params.car.push(it.code);
            //   break
            case '适用人群':
              params.crow.push(it.code);
              break
            // case '外观形状':
            //   params.exterior.push(it.code);
            //   break
          }
        }
      })
    })
 
    let newParams = JSON.parse(JSON.stringify(params))
    let data = {};
    for (let key in newParams){
      data[key] = newParams[key].join();
    }

    wx.navigateTo({
      url: '/pages/proList/proList/proList?params=' + JSON.stringify(data),
    })
  },

  itemClick(e) {
    let data = e.currentTarget.dataset
    let item = this.data.classList[data.index].items
    if (item[data.ix].checked) {
      item[data.ix].checked = false
    } else {
      // 限制克重选项只能单选
      if (data.index === 4) {
        item.map((v, i) => v.checked = i === data.ix ? !v.checked : false);
      } else {
        item[data.ix].checked = true
      }
    }
    // debugger;
    this.setData({
      classList: this.data.classList
    })
  },

  onLoad(options) {
    //获取数据
    let classList = []
    app.$api.produceCodeList().then(res => {
      res.data.forEach((item, index, arr) => {
        if (item.tit === '一级品目') {
          classList[0] = item
        }
        // if (item.tit === '类别') {
        //   classList[1] = item
        // }
        // if (item.tit === '主题') {
        //   classList[2] = item
        // }
        // if (item.tit === '系列') {
        //   classList[3] = item
        // }
        // if (item.tit === '材质') {
        //   classList[5] = item
        // }
        // if (item.tit === '生产工艺') {
        //   classList[6] = item
        // }
        // if (item.tit === '车花') {
        //   classList[7] = item
        // }
        if (item.tit === '适用人群') {
          classList[8] = item
        }
        // if (item.tit === '表面工艺') {
        //   classList[9] = item
        // }
        // if (item.tit === '外观形状') {
        //   classList[10] = item
        // }
        // if (item.tit === '工艺级别') {
        //   classList[11] = item
        // }
      })
      classList.splice(4, 0, {
        tit: '克重(g)',
        items: [{
          code: '小于1',
          value: '小于1'
        }, {
          code: '1-10',
          value: '1-10'
        }, {
          code: '10-20',
          value: '10-20'
        }, {
          code: '20-30',
          value: '20-30'
        }, {
          code: '30-40',
          value: '30-40'
        }, {
          code: '40-50',
          value: '40-50'
        }, {
          code: '50-100',
          value: '50-100'
        }, {
          code: '大于100',
          value: '大于100'
        }]
      })
      this.setData({
        classList
      })
    })

  },
  //搜索
  goSearchPage() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
})
