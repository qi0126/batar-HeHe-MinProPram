// pages/acommon/contactUs/contactUs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    clerkName: String,//绑定业务员姓名
    clerkPhoneNum: String,//绑定业务员电话
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
    //拨打业务员电话弹出层
    hideModal() {
      // this.setData({
      //   flag: true,
      // })
      this.triggerEvent('hideModal',true)
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
