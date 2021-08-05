Component({
  properties: {
    show: Boolean
  },

  data: {
  },

  methods: {
    show() {
      this.triggerEvent('popuShow')
    },

    hide() {
      this.triggerEvent('popuHide')
    },

    normal() {

    },

    confirm() {
      this.triggerEvent('popConfirm')
    }
  }
})
