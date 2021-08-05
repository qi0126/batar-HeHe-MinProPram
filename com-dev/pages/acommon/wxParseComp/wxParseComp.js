let WxParse = require('../../../utils/wxParse/wxParse.js');
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    wxParseData:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    flag: true,//拨打业务员电话
    clerkName: '',//绑定业务员姓名
    clerkPhoneNum: '',//绑定业务员电话
  },

  ready:function() {
    // console.log('模板数据', this.properties.wxParseData);
    WxParse.wxParse('article', 'html', this.properties.wxParseData.textMessage, this, 0);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //拨打电话
    clerkPhone() {
      // app.$api.queryMyClerk().then(res => {
        // let clerkName = res.data.clerkName ? res.data.area + res.data.clerkName : ''
        let clerkName = '百泰首饰'
        // let clerkPhoneNum = res.data.telephone ? res.data.telephone : ''
        let clerkPhoneNum = '400-931-0588'
        this.setData({
          flag: false,
          clerkName,
          clerkPhoneNum,
        })
      // })
    },

    //拨打业务员电话弹出层
    hideModal() {
      this.setData({
        flag: true,
      })
    },
    //拨打业务员电话
    openClerk() {
      wx.makePhoneCall({
        // phoneNumber: this.data.clerkPhoneNum,
        phoneNumber: '400-931-0588',
        success() {
          console.log('成功拨打客服电话')
        }
      })
    },
  }
})
