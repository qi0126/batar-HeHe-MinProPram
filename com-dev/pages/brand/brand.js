const app = getApp()

Page({
    data: {
        menuList: [],
        currentData: {},
        currentTab: 0,
    },
 
    //点击事件
    clickMenu(data) {
        let index = data.detail.current;
        this.setData({
            currentTab: index,
            currentData: this.data.menuList[index]
        })
    },

    //获取数据
    getTabsList() {
        app.$api.promoteList().then(res => {
            res.data.splice(res.data.length - 1, 0, {
                name: "品牌资讯"
            })
            this.setData({
                menuList: res.data,
            })
            this.navToTabs()
        })
    },

    // 处理显示的tabs 和 tabsData
    navToTabs() {
        const { menuList } = this.data
        let { currentTab = 0, tabScroll } = this.data
        let currentData = {}
        if (!app.currentTab) { // 直接点击进入
            currentData = menuList[currentTab]
        } else { // 其他入口进入 
            currentTab = app.currentTab
            currentData = menuList[currentTab]
        }
        // 品牌资讯进入
        if (app.currentTab === 5) {
            currentTab = menuList.length - 2
            currentData = menuList[menuList.length - 2]
            tabScroll = 300
            this.setData({
                tabScroll
            })
        }
        this.setData({
            currentTab,
            currentData,
        })
        delete app.currentTab
    },

    onReachBottom(e) {
        // this.loadMore()
        this.brandInfor.loadMore()
    },

    onLoad(options) {
        this.getTabsList()
    },

    onReady() {
        this.brandInfor = this.selectComponent("#brandInfor")
    },

    onShow() {
        const { menuList } = this.data
        if (menuList.length > 0) {
            this.navToTabs()
        }
    },

    onUnload() {

    },

    onPullDownRefresh() {

    },

    onShareAppMessage() {

    }

})