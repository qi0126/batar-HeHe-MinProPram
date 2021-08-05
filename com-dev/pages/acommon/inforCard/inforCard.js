const app = getApp()

Component({
    properties: {
        info: {
            type: Object,
        },
    },

    options: {
        addGlobalClass: true,
    },

    data: {
        $img: app.$img
    },

    methods: {
        goDiscuss() {
            const { info } = this.properties
            this.triggerEvent('goDiscuss', info)
        },

        like() {
            const { info } = this.properties
            this.triggerEvent('like', info)     
        },

        goDetail() {
            const { info } = this.properties
            this.triggerEvent('goDetail', info)           
        }
    }
})
