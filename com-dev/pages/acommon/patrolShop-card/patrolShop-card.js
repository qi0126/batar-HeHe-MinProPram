Component({
    properties: {
        info: Object
    },

    options: {
        addGlobalClass: true,
    },

    data: {

    },

    methods: {
        // goFeedback() {
        //     this.triggerEvent('goFeedback')
        // },

        goPatrolShopDetail() {
            const { info } = this.properties
            wx.navigateTo({
                url: `/pages/patrolShopDetail/patrolShopDetail?item=${JSON.stringify(info)}`,
            })
        }
    }
})