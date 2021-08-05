import api from 'fetch/api'
import util from 'utils/util'
import testJson from 'fetch/test'  
import date from 'utils/date'
import validate from 'utils/validate'
import { city } from 'utils/citydata'
import detailFilter from 'utils/detailFilter'
import productCount from 'utils/productCount'
import orderFun from 'utils/orderFun'
 
let $img = api.$img

App({ 
  onLaunch() {
      wx.getSystemInfo({
          success(res) {
              const { screenWidth, windowHeight } = res
              res = {
                  ...res, ...{
                      widthRadio: screenWidth / 375,
                  }
              }
              wx.setStorageSync(`deviceInfo`, res)
          }
      })
  },

  onShow() {
      api.accountBaseWagePrice().then(res => {
          if (!res.data) {
              wx.setStorageSync('price999', 0)
              wx.setStorageSync('price9999', 0)
              return
          }
          const { goldPriceProps } = res.data
          if (goldPriceProps) {
              goldPriceProps.forEach(item => {
                  if (item.propType === '999') {
                      wx.setStorageSync('price999', item.propValue)
                  }
                  if (item.propType === '9999') {
                      wx.setStorageSync('price9999', item.propValue)
                  }
              })
              if (!goldPriceProps.some(item => item.propType === '999')) {
                  wx.setStorageSync('price999', 0)
              }
              if (!goldPriceProps.some(item => item.propType === '9999')) {
                  wx.setStorageSync('price9999', 0)
              }
          } else {
              wx.setStorageSync('price999', 0)
              wx.setStorageSync('price9999', 0)
          }
      })
  },

  globalData: {
    useInfo: null
  },
    $companyCode:'HHZBK6',
  $api: api,
 
  $m: testJson,

  $img,

  $u: util,

  $city: city,

  $d: date,

  $v: validate,
  $detailFilter: detailFilter,

  $productCount: productCount,
  $orderFun: orderFun,
})
