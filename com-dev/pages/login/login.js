const app = getApp()

Page({
  data: {
    userName: '',
    passWord: ''
  },

  formSubmit(e) {
    let params = e.detail.value
    if (!params.loginName) {
      app.$u.showToast('请输入帐号')
      return
    }
    if (!params.password) {
      app.$u.showToast('请输入密码')
      return
    }
    this.getUser(params)
  },
  changeInputInfo (e) {
    const { value } = e.detail;
    const { type } = e.currentTarget.dataset;
    this.setData({ [type]: value });
  },
  login () {
    const { userName: loginName, passWord: password } = this.data;
    (loginName.length > 0 && password.length > 0) && this.getUser({ loginName, password });
  },
  getUser(params) {
    let self = this
    wx.login({
      success(e) {
        const otherParams = {
          companyCode: app.$companyCode,
          code: e.code
        }
        Object.assign(params, otherParams)
        app.$api.wxAppLogin(params).then(res => {
          if (res.code === 200) {
            self.loginSuccess(res.msg, res.data)
          } 
          if (res.code === 205) {
            self.getWxBinding(res.data, params)
          }
        })
      }
    })
  },

  getAppLogin(code) {
    let self = this
    app.$u.showLoading()
    const params = {
      companyCode: app.$companyCode,
      code
    }
    app.$api.wxAppLogin(params).then(res => {
      if (res.code === 200) {
        wx.setStorageSync('accessToken', res.data)
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
  },

  getWxBinding(token, params) {
    Object.assign(params, { wxToken: token })
    app.$u.showLoading()
    app.$api.wxWxBinding(params).then(res => {
      this.loginSuccess(res.msg, res.data)
    })
  }, 

  loginSuccess(msg, token) {
    wx.setStorageSync('accessToken', token);
    wx.setStorageSync('userName', this.data.userName);
    wx.setStorageSync('passWord', this.data.passWord);

    app.$u.showToast(msg).then(succe => {
      setTimeout(() => {
        // if (wx.getStorageSync('historyUrl')) {
        //   wx.redirectTo({
        //     url: wx.getStorageSync('historyUrl'),
        //   })
        // } else {
          wx.switchTab({
            url: '/pages/index/index',
          })
      //   }
      }, 800)

    })
  },

  onLoad(options) {
    const userName = wx.getStorageSync('userName');
    const passWord = wx.getStorageSync('passWord');
    (userName && passWord) && this.setData({ userName, passWord });
  },

  onShow() {
    let self = this
    wx.login({
      success(e) {
        self.getAppLogin(e.code)
      }
    })
  }

})
