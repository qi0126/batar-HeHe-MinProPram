const app = getApp()

Component({

    properties: {
        modalShow: Boolean,
        info: Object,
        animationData: Object
    },

    options: {
        addGlobalClass: true,
    },

    data: {
        btnLoading:false,
        attitudeStarList: [
            {
                starStatus: 0
            },
            {
                starStatus: 0
            },
            {
                starStatus: 0
            },
            {
                starStatus: 0
            },
            {
                starStatus: 0
            },
        ],
        professionalismStarList: [
            {
                starStatus: 0
            },
            {
                starStatus: 0
            },
            {
                starStatus: 0
            },
            {
                starStatus: 0
            },
            {
                starStatus: 0
            }

        ],
        matchingStarList: [
            {
                starStatus: 0
            },
            {
                starStatus: 0
            },
            {
                starStatus: 0
            },
            {
                starStatus: 0
            },
            {
                starStatus: 0
            }
        ],
        teacherStarList: [
            {
                starStatus: 0
            },
            {
                starStatus: 0
            },
            {
                starStatus: 0
            },
            {
                starStatus: 0
            },
            {
                starStatus: 0
            }
        ],
        dateNum: 0,
        proposal: '',
        attitudeStar: 0,
        professionalismStar: 0,
        matchingStar: 0,
        teacherStar: 0,
        // 字数限制
        current: 0,
        max: 800,
    },

    ready() {
        let self = this
        this.animation = wx.createAnimation({
            duration: 200
        })
    },

    methods: {
        closeFun() {
            this.setData({
                modalShow: false,
            })
            // setTimeout(() => {
            //     this.animation.height(800).step()
            //     this.setData({
            //         animationData: this.animation.export(),
            //     })
            // }, 0)
            // setTimeout(() => {
            //     this.setData({
            //         modalShow: false,
            //     })
            // }, 300)
        },

        attitude(e) {
            let { attitudeStarList } = this.data
            const { index } = e.currentTarget.dataset
            attitudeStarList.forEach((item, ix) => {
                item.starStatus = 0
                if (ix < index + 1) {
                    item.starStatus = 1
                }
            })
            this.setData({
                attitudeStar: index + 1,
                attitudeStarList
            })
        },

        professionalism(e) {
            let { professionalismStarList } = this.data
            const { index } = e.currentTarget.dataset
            professionalismStarList.forEach((item, ix) => {
                item.starStatus = 0
                if (ix < index + 1) {
                    item.starStatus = 1
                }
            })
            this.setData({
                professionalismStar: index + 1,
                professionalismStarList
            })
        },

        matching(e) {
            let { matchingStarList } = this.data
            const { index } = e.currentTarget.dataset
            matchingStarList.forEach((item, ix) => {
                item.starStatus = 0
                if (ix < index + 1) {
                    item.starStatus = 1
                }
            })
            this.setData({
                matchingStar: index + 1,
                matchingStarList
            })
        },

        teacher(e) {
            let { teacherStarList } = this.data
            const { index } = e.currentTarget.dataset
            teacherStarList.forEach((item, ix) => {
                item.starStatus = 0
                if (ix < index + 1) {
                    item.starStatus = 1
                }
            })
            this.setData({
                teacherStar: index + 1,
                teacherStarList
            })
        },

        reduce() {
            let { dateNum } = this.data
            dateNum = dateNum <= 0 ? 0 : dateNum - 1
            this.setData({
                dateNum
            })
        },

        add() {
            let { dateNum } = this.data
            dateNum = dateNum + 1
            this.setData({
                dateNum
            })
        },

        dayNumFun(event){
          this.setData({
            dateNum: Number(event.detail.value)
          })
        },

        getProposal(e) {
            let { max } = this.data
            const proposal = e.detail.value
            var length = parseInt(proposal.length);
            if (length >= max) {
                return;
            }
            this.setData({
                proposal,
                current: length
            })
        },

        valiData(options) {
            const { serviceStaffSatisfaction, serviceStaffMajor, serviceContentSuited, hopefulNext, timeNum } = options
            if (!serviceStaffSatisfaction) {
                app.$u.showToast('请选择服务人员态度')
                return false
            }
            if (!serviceStaffMajor) {
                app.$u.showToast('请选择服务人员专业度')
                return false
            }
            if (!serviceContentSuited) {
                app.$u.showToast('请选择服务内容匹配度')
                return false
            }
            if (!hopefulNext) {
                app.$u.showToast('请选择期待下次同老师到店')
                return false
            }
            if (!timeNum) {
                app.$u.showToast('请输入巡店天数')
                return false
            }
            return true
        },

        noMove() {
            console.log(1111)
        },

        confirm() {
       
            const {
                dateNum: timeNum,
                proposal: evaluate,
                attitudeStar: serviceStaffSatisfaction,
                professionalismStar: serviceStaffMajor,
                matchingStar: serviceContentSuited,
                teacherStar: hopefulNext } = this.data
            console.log(this.properties)
            const { info: { storeId, planId } } = this.properties
            let params = {
                planId,
                timeNum,
                evaluate,
                serviceStaffSatisfaction,
                serviceStaffMajor,
                serviceContentSuited,
                hopefulNext,
            }
            if (!this.valiData(params)) {
                return 
            }
            console.log('提交数据',params)
            this.setData({
              btnLoading: true
            })
            this.closeFun()

            app.$api.saveFeedback(params).then(res => {
                app.$u.showToast('反馈成功')
                this.triggerEvent(`saveFeedback`)
                this.setData({
                  btnLoading: false
                })
   
            })

        }

    }
})
