import $day from './date'

class orderFun {
  constructor() {
    this.dataSource = []
    this.dataSourceTwo = []
    this.dataSourceAddr = []
    this.dataSourceExhibit = []
    this.dataSourceBack = []
    this.result = {}
  }

  changeDataSource() {
    const { result } = this 
    let dataSource
    dataSource = [{
      name: '订单编号',
      value: result.orderNo,
    }, {
      name: '下单公司',
      value: result.customerName
    }, {
      name: '下单日期',
      value: $day(result.orderCreateTime).format('YYYY-MM-DD')
    }, {
      name: '回款日期',
      value: result.orderComeTime || `---`
    }, {
      name: '字印',
      value: result.marking
    }, {
      name: '是否挂标签',
      value: result.lableName === 1 ? '否' : '是'
    }, {
      name: '备注',
      value: result.orderRemarks
    }]

    this.dataSourceTwo = [{
      name: '订单编号',
      value: result.orderNo,
    }, {
      name: '下单公司',
      value: result.customerName
    }, {
      name: '下单日期',
      value: $day(result.orderCreateTime).format('YYYY-MM-DD')
    }]

    this.dataSourceBack = [{
      name: '订单编号',
      value: result.orderNo,
    }, {
      name: '退货公司',
      value: result.customerName
    }, {
      name: '退货日期',
      value: $day(result.orderCreateTime).format('YYYY-MM-DD')
    }]

    this.dataSource = dataSource
  }

  changeDataSourceAddr() {
    const { result } = this
    let dataSource
    dataSource = [{
      name: '收货人',
      value: result.addressUser,
    }, {
      name: '联系方式',
      value: result.addressTel
    }, {
      name: '收货地址',
      value: result.address
    }]
    this.dataSourceAddr = dataSource
  }

  changeDataSourceExhibit() {
    const { result: { exhibitActiveFrom: { exhibitName, totalWeight, startTime, endTime }} } = this
    let dataSource
    dataSource = [{
      name: '活动名称',
      value: exhibitName,
    }, {
      name: '可挑货重量',
        value: `${totalWeight}g`
    }, {
      name: '活动时间',
        value: `${startTime} 至 ${endTime}`
    }]
    this.dataSourceExhibit = dataSource
  }

  setDatasource(options) {
    this.result = options
  }

  getDataSource() {
    return this.dataSource
  }
  getDataSourceTwo() {
    return this.dataSourceTwo
  }

  getDataSourceAddr() {
    return this.dataSourceAddr
  }

  getDataSourceExhibit() {
    return this.dataSourceExhibit
  }

  getDataSourceBack() {
    return this.dataSourceBack
  }

}

export default new orderFun()