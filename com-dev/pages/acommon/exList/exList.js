Component({
  properties: {
    list: {
      type: Array,
      value: [
        {},
        {}
      ]
    }
  },


  data: {

  },


  methods: {
    clickItem(e) {
      const { list } = this.data
      const { index } = e.currentTarget.dataset
      list.forEach(item => {
        item.checked = false
      })
      list[index].checked = true
      this.setData({
        list
      })
      this.triggerEvent(`getExId`, list[index])
    }
  }
})
