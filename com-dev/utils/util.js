class util {
  constructor() {}

    // 获取文件后缀
    getExtension(fileName) {
        let fileType = fileName.substring(fileName.lastIndexOf('.') + 1); 
        return fileType
    }

  // 对象数组去重
  unique(arr) {
    let unique = {};
    arr.forEach((item) => {
      unique[JSON.stringify(item)] = item;
    })
    arr = Object.keys(unique).map(function(u) {
      return JSON.parse(u);
    })
    return arr;
  } 

  // 对象数组去重 根据name
  repetName(arr) {
    let unique = {}
    var hash = {};
    return arr.reduce((item, next) => {
      hash[next.name] ? '' : hash[next.name] = true && item.push(next);
      return item
    }, [])
  }

  min(arr) {
    let min = arr[0];
    let len = arr.length;
    for (let i = 1; i < len; i++) {
      if (arr[i] < min) {
        min = i;
      }
    }
    return min;
  }

  max(arr) {
    let max = arr[0];
    let len = arr.length;
    for (let i = 1; i < len; i++) {
      if (arr[i] > max) {
        max = i;
      }
    }
    return max;
  }

  // 数组对象排序
  compareArr(property) {
    return (obj1, obj2) => {
      var value1 = obj1[property];
      var value2 = obj2[property];
      return value2 - value1;
    }
  }

  // map转换对象
  strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
      obj[k] = v;
    }
    return obj;
  }

  // 对象转换map
  objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  }

  china(str) {
    if (/.*[\u4e00-\u9fa5]+.*/.test(str)) {
      return true
    } else {
      return false
    }
  }

  // arr2 属于 arr1
  compare(arr1, arr2) {
    if (Object.prototype.toString.call(arr1) !== '[object Array]') {
      return
    }
    if (Object.prototype.toString.call(arr2) !== '[object Array]') {
      return
    }
    let flag = true
    for (let i = 0; i < arr2.length; i++) {
      if (!arr1.includes(arr2[i])) {
        flag = false
        break
      }
    }
    return flag
  }

  showModal(cont) {
    return new Promise((reslove, reject) => {
      wx.showModal({
        title: '提示',
        content: cont,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#333',
        confirmText: '确定',
        confirmColor: '#E86800',
        success(res) {
          if (res.confirm) {
            reslove(res)
          } else if (res.cancel) {
            reject(res)
          }
        },
      })
    })
  }

  showToast(cont) {
    return new Promise((reslove, reject) => {
      wx.showToast({
        title: cont,
        icon: 'none',
        mask: true,
        success(res) {
          reslove(res)
        }
      })
    })
  }

  showLoading() {
    return new Promise((reslove, reject) => {
      wx.showLoading({
        title: '',
        mask: true,
        success(res) {
          reslove(res)
        },
      })
    //   reslove()
    })
  }

  // qs简化版
  fomartParams(obj) {
    let newKeys = Object.keys(obj).sort()
    let newObj = {}
    for (let i = 0; i < newKeys.length; i++) {
      newObj[newKeys[i]] = obj[newKeys[i]]
    }
    let result = ''
    for (let it in newObj) {
      if (Object.prototype.toString.call(newObj[it]) === '[object Array]') {
        newObj[it].forEach(val => {
          result += it + '=' + val + '&'
        });
      } else {
        result += it + '=' + newObj[it] + '&';
      }
    }
    result = result.substring(0, result.length - 1)
    return result;
  }

  // 改变规格
  changeItemSpec(options) {
    if (typeof options !== 'string') {
      return
    }
    options = options.replace(/、undefined+/, '')
    options = options.replace(/、$/, '')
    if (/、$/.test(options)) {
      options = this.changeItemSpec(options)
    }
    return options
  }

  // 计算价格
  countPrice(condit, feeType, totalSum, additionPrice = 0, feePrice = 0, weight = 0) {
    if (!condit) {
      console.log(`缺少成色`)
    }
    if (!feeType) {
      console.log(`缺少工费类型`)
    }
    if (!totalSum) {
      console.log(`缺少总数`)
    }
    let allPrice = 0
    let conditPrice = parseInt(condit) === 999 ? wx.getStorageSync('price999') : wx.getStorageSync('price9999')
    if (feeType === 1) {
        // allPrice = (conditPrice + additionPrice + 4) * weight * totalSum
        allPrice = additionPrice * weight * totalSum
    }
    if (feeType === 2) {
    //   allPrice = (conditPrice * weight + feePrice+4) * totalSum
    }
    allPrice = Math.round(parseFloat(allPrice) * 100) / 100
    // console.log('总工费：', allPrice)
    return allPrice
  }

  // 套装计算价格
  countSuitPrice(condit, feeType = 2, totalSum, additionPrice = 0, feePrice = 0, weight = 0) {
    let allPrice = 0
    let conditPrice = parseInt(condit) === 999 ? wx.getStorageSync('price999') : wx.getStorageSync('price9999')
    if (feeType === 1) {
      allPrice = (conditPrice + additionPrice) * weight * totalSum
    }
    if (feeType === 2) {
      allPrice = (conditPrice * weight + feePrice) * totalSum
    }
    allPrice = Math.round(parseFloat(allPrice) * 100) / 100
    return allPrice
  }

  // 模拟switch
  switchs(options, obj, def) {
    let flag = true
    flag = Object.keys(obj).some(item => item === options + '')
    if (!flag) {
      return def
    }
    return obj[options]
  }

  // 套装名称 1.对戒 2.套装
  suitName(options) {
    let obj = {
      1: `对戒`,
      2: `套装`
    }
    return obj[options]
  }

}
  export default new util()