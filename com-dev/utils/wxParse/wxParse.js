import $api from '../../fetch/api.js'

/**
 * author: Di (微信小程序开发工程师)
 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
 *               垂直微信小程序开发交流社区
 * 
 * github地址: https://github.com/icindy/wxParse
 * 
 * for: 微信小程序富文本解析
 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
 */

/**
 * utils函数引入  
 **/
import showdown from './showdown.js';
import HtmlToJson from './html2json.js';

/**
 * 配置及公有属性
 **/
var realWindowWidth = 0;
var realWindowHeight = 0;
wx.getSystemInfo({
  success: function (res) {
    realWindowWidth = res.windowWidth
    realWindowHeight = res.windowHeight
  }
})

let dataObj = {},
  dataArray = [],
  selfGlobal = {},
  conllectImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyYTkzNzQ3Ni04YTk0LTVkNDAtODg5Yi0zZWQ4MzY5M2E2NTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODIxMUFGMkU0MTc1MTFFOUJGN0ZBNTU5OEQ4NDlCNTciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODIxMUFGMkQ0MTc1MTFFOUJGN0ZBNTU5OEQ4NDlCNTciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NWNiYTJlNTgtZWNlNC01NDQ1LWJlMzItMTkwY2RhZDA5MDg1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjJhOTM3NDc2LThhOTQtNWQ0MC04ODliLTNlZDgzNjkzYTY1MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkS0nLgAAADSUExURbx4RLp2RLt5R7t3Rb15Rr15R75+TsCAUOjTw7x5Rditi+nSwfXr4/z49b14RuTJtOvYyr17SvHi1716SLp2RdOpiL98TNu0lvLl29GifsmRaO/g1tu3nNq0mcuBSsOCU+zh2N28or13RMmMXdy1mrx3RMyXb9Wnhr59S715RMKDVbx4Rr14SMCBUObMubt3RNKlgdaifcCAUbd0RL56Q+3UwMuSZfbs5dmvjcd/Sc2ZcefOvMyWa82YcfXm2rx3Rf37+fz59/jw7Na4obx4Rf///2JxfREAAABGdFJOU////////////////////////////////////////////////////////////////////////////////////////////wBplkTQAAAAkUlEQVR42kzN5xKCQAwE4IBgw9479t57VzT7/q8k3KHe/kn2m8yEUO0HKxaAeD40rgNUyhJz+4LnVWPmKOjMXiLzcs6bhRSlBfSMiZh6l9ZiMVjm9KYlsZJGkw72QoEaCJntr44G7lsgbMoaMG8QgORUyt7xAa3Ewz3ovPAFFHXWZjH8AcfN8A4VsNr5y0eAAQCS7DERIN46vQAAAABJRU5ErkJggg==',
  noConllectImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNGM0ZmJlMi1mYzI4LTVjNDQtYjlmMi1kNDIxMDgzZjc0MzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODdBNjFGN0I0MTc1MTFFOUJDRTlFN0REMkRCRUREQzIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODdBNjFGN0E0MTc1MTFFOUJDRTlFN0REMkRCRUREQzIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MGEyOGY4YzctYzUyNy1kZjQ3LTg0ZDMtNDVkODU3YmMzOTQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE0YzRmYmUyLWZjMjgtNWM0NC1iOWYyLWQ0MjEwODNmNzQzNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhunZzoAAAFZUExURb15Rrt3Rbx4Rrp4Rb15Rbl2RLt4Ru/g1suBSdu1mOLErrh1RL9+Ttamg9Wjfdu0lrl2RdGiftOpiMWJXbx4Rfbt5/bs5fLdzPz5982ffL19S7x4RM2ZccyacsyWa75/Srp3RPPn3rt3RO3UwN28oufOvLx3RsKCUdiqh714RvLi1titi9q0mcKDVMuTZbh2Q7l3RcV+SOzRwMCBULd0RNSqit+2l9mvjfry7L13RLt4RcODU9aifcKCU716SL16StKlgbx5RevYyvbo3ebNufLl2/Xm2unSwcyXb86YceLBqdysh9W3oMiQZ+zh2Pfl2fHi18F/Tv37+bl4Rty1mePFr7d3SPnz78mMXfz49bh2RL98TL58S+TJtL56Q7p3RcKBT8CFWdWnhr15R/Xr47t5R9/AqdKmg7p2RejTw8J8Sdq0ldu3nLx6R/Hh1Nqvjrx3Rfjw7P///wzfRU0AAABzdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wDvi69+AAAAxElEQVR42mIoYveI8XUvKiqKFOKx1SkqYnC1k2ZitlQtCpJjZWAQ0S5ikGFLDOVldnQRzFDnMmWMdmJgZMkrKsqOYmALVCwq4gsOYbBnsAAaoGEgrwWk8g19GBwUJIGsonQjICEexuHHIGbN7V0EAf5ZAjlFDEUBcfFmYL5zgn4S0NqiokymXE4gX1SX0bMILFAUq5bsVRQurKQnARUoUtEsSJO1iigsggkU8aeysBqnFCEEisxNpNyKkAWKbJShDIAAAwATcEXImEe2NgAAAABJRU5ErkJggg=='

/**
 * 主函数入口区
 **/
function wxParse(bindName = 'wxParseData', type='html', data='<div class="color:red;">数据不能为空</div>', target,imagePadding) {
  let that = target;
  selfGlobal = that
  var transData = {};//存放转化后的数据
  if (type == 'html') {
    transData = HtmlToJson.html2json(data, bindName);
    // circulation(transData)
    // getProductList()
    // console.log(JSON.stringify(transData, ' ', ' ')); todo
  } else if (type == 'md' || type == 'markdown') {
    var converter = new showdown.Converter();
    var html = converter.makeHtml(data);
    transData = HtmlToJson.html2json(html, bindName);
    // console.log(JSON.stringify(transData, ' ', ' '));
  }
  transData.view = {};
  transData.view.imagePadding = 0;
  if(typeof(imagePadding) != 'undefined'){
    transData.view.imagePadding = imagePadding
  }
  var bindData = {};
  bindData[bindName] = transData;
  that.setData(bindData)
  that.wxParseImgLoad = wxParseImgLoad;
  that.wxParseImgTap = wxParseImgTap;
}

// 遍历产品获取产品信息
function circulation(transData) {
  // console.log(transData)
  transData.images.forEach(item => {
    let id = item.attr.datainfo ? getProWay(item.attr.datainfo).id : ''
    if (id) {
      dataArray.push(id)
    }
  })
}

// 遍历产品给产品赋值
function setImgData() {
  const { article } = selfGlobal.data
  // console.log(article)
  article.images.forEach(item => {
    let id = item.attr.datainfo ? getProWay(item.attr.datainfo).id : ''
    let way = item.attr.datainfo ? getProWay(item.attr.datainfo).way : ''
    if (id) {
      item.attr.data = dataObj[id]
    }
    // console.log(way)
    if (way === 'attention') {
      if (item.attr.data.collectionStat) {
        item.attr.src = conllectImg
      }
      if (!item.attr.data.collectionStat) {
        item.attr.src = noConllectImg
      }   
    }
    selfGlobal.setData({
      article
    })
  })
}

function getProWay(str) {
  str = str.replace(/\'/g, '"')
  return JSON.parse(str)
}

// 查询产品信息
function getProductList() {
  let params = {
    data: [{
      ids: dataArray
    }]
  };
  return $api.getProductList(params).then(res => {
    res.data.data.forEach(item => {
      dataObj[item.id] = item
    })
    setImgData()
  })
}

// 收藏
function collect(id, paramsIndex, item) {
  const { article } = selfGlobal.data
  const { imgIndex } = item
  let objParams = [{
    api: 'fellowAddFellow',
    params: {
      fellowId: id,
      type: 2,
    }
  }, {
    api: 'fellowCancelFellow',
    params: {
      idList: [id],
      data: 2,
    }
  }]
  let params = objParams[paramsIndex].params
  $api[objParams[paramsIndex].api](params).then(res => {
    if (paramsIndex === 0) {
      article.images[imgIndex].attr.src = noConllectImg 
      article.images[imgIndex].attr.data.collectionStat = false
    }
    if (paramsIndex === 1) {
      article.images[imgIndex].attr.src = conllectImg
      article.images[imgIndex].attr.data.collectionStat = true
    }
    selfGlobal.setData({
      article
    })
  })
}

let hand = {}

// 收藏
hand.attention = (options, item) => {
  const { article } = selfGlobal.data
  const { imgIndex } = item
  let { data: { collectionStat } } = article.images[imgIndex].attr
  if (collectionStat) {
    collect(options, 0, item)
  }
  if (!collectionStat) {
    collect(options, 1, item)
  } 
}

// 分享
hand.share = (options) => {
  console.log(options)
  // wx.showActionSheet({
  //   itemList: ['a', 'b', 'c', 'd'],
  //   itemColor: '',
  // })
}

// 跳转
hand.navTo = (options) => {
  console.log(options)
  wx.navigateTo({
    url: `/pages/product/productDetail/productDetail?productId=${options}&way=band`,
  })
}

// 图片点击事件
function wxParseImgTap(e) {
  let obj = {
    attention: 'attention',
    share: 'share',
    navTo: 'navTo'
  }
  const { item } = e.target.dataset
  const info = getProWay(item.attr.datainfo)
  Object.keys(obj).forEach(it => {
    if (info.way === it) {
      hand[it](info.id, item)
    }
  })
  return
  var nowImgUrl = e.target.dataset.src;
  var tagFrom = e.target.dataset.from;
  if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
    wx.previewImage({
      current: nowImgUrl, // 当前显示图片的http链接
      urls: this.data[tagFrom].imageUrls // 需要预览的图片http链接列表
    })
  }
}

/**
 * 图片视觉宽高计算函数区 
 **/
function wxParseImgLoad(e) {
  var that = this;
  var tagFrom = e.target.dataset.from;
  var idx = e.target.dataset.idx;
  if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
    calMoreImageInfo(e, idx, that, tagFrom)
  } 
}
// 假循环获取计算图片视觉最佳宽高
function calMoreImageInfo(e, idx, that, bindName) {
  var temData = that.data[bindName];
  if (!temData || temData.images.length == 0) {
    return;
  }
  var temImages = temData.images;
  //因为无法获取view宽度 需要自定义padding进行计算，稍后处理
  // var recal = wxAutoImageCal(e.detail.width, e.detail.height,that,bindName); 
  var recal = wxAutoImageCal(e.detail.width, e.detail.height, that, bindName, temImages[idx]); 
  // temImages[idx].width = recal.imageWidth;
  // temImages[idx].height = recal.imageheight; 
  // temData.images = temImages;
  // var bindData = {};
  // bindData[bindName] = temData;
  // that.setData(bindData);
  var index = temImages[idx].index
  var key = `${bindName}`
  for (var i of index.split('.')) key+=`.nodes[${i}]`
  var keyW = key + '.width'
  var keyH = key + '.height'
  that.setData({
    [keyW]: recal.imageWidth,
    [keyH]: recal.imageheight,
  })
}

// 计算视觉优先的图片宽高
// function wxAutoImageCal(originalWidth, originalHeight,that,bindName) {
//   //获取图片的原始长宽
//   var windowWidth = 0, windowHeight = 0;
//   var autoWidth = 0, autoHeight = 0;
//   var results = {};
//   var padding = that.data[bindName].view.imagePadding;
//   windowWidth = realWindowWidth-2*padding;
//   windowHeight = realWindowHeight;
//   //判断按照那种方式进行缩放
//   // console.log("windowWidth" + windowWidth);
//   if (originalWidth > windowWidth) {//在图片width大于手机屏幕width时候
//     autoWidth = windowWidth;
//     // console.log("autoWidth" + autoWidth);
//     autoHeight = (autoWidth * originalHeight) / originalWidth;
//     // console.log("autoHeight" + autoHeight);
//     results.imageWidth = autoWidth;
//     results.imageheight = autoHeight;
//   } else {//否则展示原来的数据
//     results.imageWidth = originalWidth;
//     results.imageheight = originalHeight;
//   }
//   return results;
// }


//计算视觉优先的图片宽高
function wxAutoImageCal(originalWidth, originalHeight, that, bindName, temImage) {
  var arr = temImage.attr.style;
  var widthIndex = arr ? arr.indexOf("width:") : -1;
  var widthValue = '';
  if (widthIndex != -1) {
    // widthValue = arr[widthIndex + 1];
    // console.log(arr);
    // var trr = arr.split(";"); //sophie
    var trr = arr //sophie
    for (let i = 0; i < trr.length; ++i) {
      if (trr[i].indexOf("width") != -1) {
        // widthValue = trr[i].split(":")[1];
        widthValue = trr[i+1]
      }
    }
    // console.log(trr);
    console.log(widthValue);
  }
  var percentageIndex = widthValue.search("%");
  var pixelIndex = widthValue.search("px");
  var percentageWidthValue = '';
  var pixelWidthValue = '';
  var pixelHeightValue = '';
  // console.log(percentageIndex);
  // console.log(pixelIndex);
  /**
   * 获取width的百分比数值
   * 因为widthValue是带有%和;的，例如宽度为50%，那么widthValue的数据格式为widthValue == "50%;"，
   * 因此多出来后面两个字符'%;'，所以要去除后面两位
   */
  // if ((percentageIndex > 0) && (widthValue.length == percentageIndex + 2)) {
  if (percentageIndex > 0) {
    percentageWidthValue = widthValue.slice(0, widthValue.length - 2);
  }

  /**
   * 获取width的px数值
   * 因为widthValue是带有px和;的，例如宽度为50px，那么widthValue的数据格式为widthValue == "50px;"，
   * 因此多出来后面三个字符'px;'，所以要去除后面三位，
   * 而当width为px显示时，height和width是成对出现的
   */
  // if ((pixelIndex > 0) && (widthValue.length == pixelIndex + 2)) {
  if (pixelIndex > 0) {
    pixelWidthValue = widthValue.slice(0, -3);

    var heightIndex = arr.indexOf("height:");
    var heightValue = '';
    if (heightIndex != -1) {
      console.log(arr);
      // var hrr = arr.split(";");///sophie
      var hrr = arr///sophie
      for (let i = 0; i < hrr.length; ++i) {
        if (hrr[i].indexOf("height") != -1) {
          // heightValue = hrr[i].split(":")[1];
          heightValue = hrr[i + 1]
        }
      }
      console.log(heightValue);
    }
    var pixelHeightIndex = heightValue.search("px");
    // if ((pixelHeightIndex > 0) && (heightValue.length == pixelHeightIndex + 2)) {
    if (pixelHeightIndex > 0) {
      pixelHeightValue = heightValue.slice(0, heightValue.length -3);
    }
  }
  // console.log(pixelHeightValue);
  //获取图片的原始长宽
  var windowWidth = 0, windowHeight = 0;
  var autoWidth = 0, autoHeight = 0;
  var results = {};
  var padding = that.data[bindName].view.imagePadding;
  windowWidth = realWindowWidth - 2 * padding;
  windowHeight = realWindowHeight;

  /**
   * 1、如果图片的宽度style是百分比的参数形式，那么图片在微信中展示的宽度就定义为 手机屏幕宽度*宽度百分比；
   * 2、如果图片的宽度style是px的参数形式，并且该宽度小于屏幕宽度，那么图片在微信中展示的宽、高就定义为 style所设置的宽、高；
   * 3、此外，则按原插件逻辑进行图片大小定义，在图片width大于手机屏幕width时等比例缩放至屏幕大小，
   *   未大于手机屏幕width时则按图片原尺寸显示
   */

  // results.imageWidth = pixelWidthValue;
  // results.imageheight = pixelHeightValue;
  // console.log(pixelWidthValue, pixelHeightValue)
  if (percentageWidthValue) {
    autoWidth = (windowWidth * percentageWidthValue) / 100;
    autoHeight = (autoWidth * originalHeight) / originalWidth;
    results.imageWidth = autoWidth;
    results.imageheight = autoHeight;

  } else if (pixelWidthValue && pixelHeightValue && (pixelWidthValue <= windowWidth)) {
    results.imageWidth = pixelWidthValue;
    results.imageheight = pixelHeightValue;

  } else {
    //判断按照那种方式进行缩放
    // console.log("windowWidth" + windowWidth);
    if (originalWidth > windowWidth) {//在图片width大于手机屏幕width时候
      autoWidth = windowWidth;
      // console.log("autoWidth" + autoWidth);
      autoHeight = (autoWidth * originalHeight) / originalWidth;
      // console.log("autoHeight" + autoHeight);
      results.imageWidth = autoWidth;
      results.imageheight = autoHeight;

    } else {//否则展示原来的数据
      results.imageWidth = originalWidth;
      results.imageheight = originalHeight;

    }
  }
  return results;

}


function wxParseTemArray(temArrayName,bindNameReg,total,that){
  var array = [];
  var temData = that.data;
  var obj = null;
  for(var i = 0; i < total; i++){
    var simArr = temData[bindNameReg+i].nodes;
    array.push(simArr);
  }
  temArrayName = temArrayName || 'wxParseTemArray';
  obj = JSON.parse('{"'+ temArrayName +'":""}');
  obj[temArrayName] = array;
  that.setData(obj);
}

/**
 * 配置emojis
 * 
 */

function emojisInit(reg='',baseSrc="/wxParse/emojis/",emojis){
   HtmlToJson.emojisInit(reg,baseSrc,emojis);
}

module.exports = {
  wxParse: wxParse,
  wxParseTemArray:wxParseTemArray,
  emojisInit:emojisInit
}
