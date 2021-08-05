class DetailSku {
    constructor(obj) {
        this.propsData = obj
        this.skuList = []
        this.conditiList = [] 
        this.effectCodeList = []
        this.carCodeList = []
        this.weightList = [] 
        this.diameterList = []
        this.faceWidthList = []
        this.lengthList = []
        this.ringhandList = []
        this.clickedObj = {}
        this.trueSkuList = []
        this.falseSkuList = []
        this.currentBtn = {}
        this.utils = {
            valiObj(obj) {
                return Object.prototype.toString.call(obj) === "[object Object]"
            },

            // 数组的差集
            excludeList(arr, arr1) {
                let resArr = []
                for (let item of arr1) {
                    item.isTrue = false
                    for (let it of arr) {
                        if (JSON.stringify(item) === JSON.stringify(it)) {
                            item.isTrue = true
                        }
                    }
                }
                resArr = arr1.filter(item => !item.isTrue)
                for (let item of arr1) {
                    delete item.isTrue
                }
                return resArr
            },

            // 对象的差集
            diffSet(obj, obj1) {
                let deffSetObj = {}
                for (let key in obj) {
                    for (let key1 in obj1) {
                        if (obj[key] === obj1[key]) {
                            deffSetObj[key] = obj[key]
                        }
                    }
                }
                return deffSetObj
            },

            // 对象数组去重
            unique(arr) {
                let obj = {}
                for (let item of arr) {
                    obj[JSON.stringify(item)] = item
                }
                return Object.keys(obj).map(item => JSON.parse(item))
            },

            // 对比两个对象是否相等
            compareObj(obj, obj1) {
                let arr = [], length = Object.keys(obj).length > Object.keys(obj1).length ? Object.keys(obj).length : Object.keys(obj1).length
                for (let key in obj) {
                    if (key in obj1 && obj1[key] === obj[key]) {
                        arr.push(key)
                    }
                }
                return arr.length === length
            }

        }
    }

    initConditiList(options) {
        if (!Array.isArray(options)) {
            return
        }
        let arr = []
        arr = [...new Set(options.map(item => item.conditi))].map(item => {
            return {
                txt: item,
                checked: false,
                disabled: false,
            }
        })
        arr = arr.filter(item => item.txt)
        this.conditiList = arr
    }

    initEffectCodeList(options) {
        if (!Array.isArray(options)) {
            return
        }
        let arr = []
        arr = [...new Set(options.map(item => item.effectCode))].map(item => {
            return {
                txt: item,
                checked: false,
                disabled: false,
            }
        })
        arr = arr.filter(item => item.txt)
        this.effectCodeList = arr
    }


    initCarCodeList(options) {
        if (!Array.isArray(options)) {
            return
        }
        let arr = []
        arr = [...new Set(options.map(item => item.carCode))].map(item => {
            return {
                txt: item,
                checked: false,
                disabled: false,
            }
        })
        arr = arr.filter(item => item.txt)
        this.carCodeList = arr
    }

    initFaceWidthList(options) {
        if (!Array.isArray(options)) {
            return
        }
        let arr = []
        arr = [...new Set(options.map(item => item.faceWidth))].map(item => {
            return {
                txt: item,
                checked: false,
                disabled: false,
            }
        })
        arr = arr.filter(item => item.txt)
        this.faceWidthList = arr
    }


    initWeightList(options) {
        if (!Array.isArray(options)) {
            return
        }
        let arr = []
        arr = [...new Set(options.map(item => item.weight))].map(item => {
            return {
                txt: item,
                checked: false,
                disabled: false,
            }
        })
        arr = arr.filter(item => item.txt)
        this.weightList = arr
    }

    initDiameterList(options) {
        if (!Array.isArray(options)) {
            return
        }
        let arr = []
        arr = [...new Set(options.map(item => item.diameterLength))].map(item => {
            return {
                txt: item,
                checked: false,
                disabled: false,
            }
        })
        arr = arr.filter(item => item.txt)
        this.diameterList = arr
    }

    initLengthList(options) {
        if (!Array.isArray(options)) {
            return
        }
        let arr = []
        arr = [...new Set(options.map(item => item.length))].map(item => {
            return {
                txt: item,
                checked: false,
                disabled: false,
            }
        })
        arr = arr.filter(item => item.txt)
        this.lengthList = arr
    }

    initRinghandList(options) {
        if (!Array.isArray(options)) {
            return
        }
        let arr = []
        arr = [...new Set(options.map(item => item.ringHand))].map(item => {
            return {
                txt: item,
                checked: false,
                disabled: false,
            }
        })
        arr = arr.filter(item => item.txt)
        this.ringhandList = arr
    }

    initSkuList(options) {
        this.skuList = options
    }

    initList() {
        const { proSpecList = [] } = this.propsData
        this.initSkuList(proSpecList)
        this.changeSkuList()
        this.initConditiList(proSpecList)
        this.initEffectCodeList(proSpecList)
        this.initFaceWidthList(proSpecList)
        this.initCarCodeList(proSpecList)
        this.initWeightList(proSpecList)
        this.initDiameterList(proSpecList)
        this.initLengthList(proSpecList)
        this.initRinghandList(proSpecList)
    }

    getAttr(obj, str) {
        if (!this.utils.valiObj(obj)) {
            return
        }
        if (typeof str !== 'string') {
            return
        }
        let attr = ``
        for (let key in obj) {
            if (key === str) {
                attr = obj[key]
            }
        }
        return attr
    }

    changeSkuList() {
        this.skuList.forEach(item => {
            if (item.extend_attr) {
                item.extend_attrs = JSON.parse(item.extend_attr)
                item.diameterLength = this.getAttr(item.extend_attrs, `diameterLength`)
                item.faceWidth = this.getAttr(item.extend_attrs, `faceWidth`)
                item.length = this.getAttr(item.extend_attrs, `length`)
                item.ringHand = this.getAttr(item.extend_attrs, `ringHand`)
            }
            if (item.auxiliariesList) {
                item.auxiliariesList.forEach(it => {
                    it.checked = true
                })
            }
        })
    }

    // 获取到匹配的sku加上disabled
    changeFalseSkuList() {
        let list = this.skuList, trueList = this.trueSkuList, falseArr = []
        falseArr = this.utils.excludeList(trueList, list)
        for (let item of list) {
            item.disabled = true
            for (let it of falseArr) {
                if (JSON.stringify(item) === JSON.stringify(it)) {
                    item.disabled = false
                }
            }
        }
        this.falseSkuList = falseArr
    }


    // 遍历sku获取匹配的sku
    changeTrueSkuList() {
        let arr = []
        let list = this.skuList
        let obj = this.clickedObj
        for (let item of list) {
            for (let key in obj) {
                if (this.utils.compareObj(this.utils.diffSet(item, obj), obj)) {
                    arr.push(item)
                }
            }
        }
        arr = this.utils.unique(arr)
        this.trueSkuList = arr
        this.changeFalseSkuList()
        this.changeBtnStatusDisabled()
    }

    // 遍历选中的Sku属性确定按钮状态(disable)
    changeBtnStatusDisabled() {
        let list = this.trueSkuList
        if (list.length === 0) {
            this.conditiList.forEach(item => {
                item.disabled = false
            })
            this.effectCodeList.forEach(item => {
                item.disabled = false
            })
            this.carCodeList.forEach(item => {
                item.disabled = false
            })
            this.faceWidthList.forEach(item => {
                item.disabled = false
            })
            this.weightList.forEach(item => {
                item.disabled = false
            })
            this.diameterList.forEach(item => {
                item.disabled = false
            })
            this.lengthList.forEach(item => {
                item.disabled = false
            })
            this.ringhandList.forEach(item => {
                item.disabled = false
            })
            return
        }
        let obj = this.clickedObj
        this.conditiList.forEach(item => {
            if (this.currentBtn.name !== `conditi`) {
                item.disabled = !list.some(it => { return item.txt === it.conditi })
            }
        })
        this.effectCodeList.forEach(item => {
            if (this.currentBtn.name !== `effectCode`) {
                item.disabled = !list.some(it => { return item.txt === it.effectCode })
            }
        })
        this.carCodeList.forEach(item => {
            if (this.currentBtn.name !== `carCode`) {
                item.disabled = !list.some(it => { return item.txt === it.carCode })
            }
        })
        this.faceWidthList.forEach(item => {
            if (this.currentBtn.name !== `faceWidth`) {
                item.disabled = !list.some(it => { return item.txt === it.faceWidth })
            }
        })
        this.weightList.forEach(item => {
            if (this.currentBtn.name !== `weight`) {
                item.disabled = !list.some(it => { return item.txt === it.weight })
            }
        })
        this.diameterList.forEach(item => {
            if (this.currentBtn.name !== `diameterLength`) {
                item.disabled = !list.some(it => { return item.txt === it.diameterLength })
            }
        })
        this.lengthList.forEach(item => {
            if (this.currentBtn.name !== `length`) {
                item.disabled = !list.some(it => { return item.txt === it.length })
            }
        })
        this.ringhandList.forEach(item => {
            if (this.currentBtn.name !== `ringhand`) {
                item.disabled = !list.some(it => { return item.txt === it.ringHand && !it.disabled })
            }
        })
    }

    // 通过checked判断选中
    getClieckdObj() {
        const clickedObj = this.clickedObj
        const conditiChecked = this.conditiList.find(item => item.checked)
        const effeChecked = this.effectCodeList.find(item => item.checked)
        const carChecked = this.carCodeList.find(item => item.checked)
        const weightListChecked = this.weightList.find(item => item.checked)
        const diameterChecked = this.diameterList.find(item => item.checked)
        const faceWidthChecked = this.faceWidthList.find(item => item.checked)
        const ringhandChecked = this.ringhandList.find(item => item.checked)
        const lengthChecked = this.lengthList.find(item => item.checked)
        clickedObj.conditi = conditiChecked ? conditiChecked.txt : ""
        clickedObj.effectCode = effeChecked ? effeChecked.txt : ""
        clickedObj.carCode = carChecked ? carChecked.txt : ""
        clickedObj.weight = weightListChecked ? weightListChecked.txt : ""
        clickedObj.diameterLength = diameterChecked ? diameterChecked.txt : ""
        clickedObj.faceWidth = faceWidthChecked ? faceWidthChecked.txt : ""
        clickedObj.ringHand = ringhandChecked ? ringhandChecked.txt : ""
        clickedObj.length = lengthChecked ? lengthChecked.txt : ""
        for (let key in clickedObj) {
            if (!clickedObj[key]) {
                delete clickedObj[key]
            }
        }
    }

    // 获取当前选中的sku
    getCurrentBtn(options, name) {
        this.currentBtn = { ...options, ...{ name } }
    }

    // 点击成色
    clickedConditi(options) {
        if (options.disabled) {
            return
        }
        this.conditiList.forEach(item => {
            item.checked = false
            if (item.txt === options.txt) {
                item.checked = !options.checked
            }
        })
        this.getCurrentBtn(options, `conditi`)
        this.getClieckdObj()
        this.changeTrueSkuList()
    }

    // 点击表面工艺
    clickedEffe(options) {
        if (options.disabled) {
            return
        }
        this.effectCodeList.forEach(item => {
            item.checked = false
            if (item.txt === options.txt) {
                item.checked = !options.checked
            }
        })
        this.getCurrentBtn(options, `effectCode`)
        this.getClieckdObj()
        this.changeTrueSkuList()
    }

    // 点击车花
    clickedCar(options) {
        if (options.disabled) {
            return
        }
        this.carCodeList.forEach(item => {
            item.checked = false
            if (item.txt === options.txt) {
                item.checked = !options.checked
            }
        })
        this.getCurrentBtn(options, `carCode`)
        this.getClieckdObj()
        this.changeTrueSkuList()
    }

    // 点击克重
    clickedWeight(options) {
        if (options.disabled) {
            return
        }
        this.weightList.forEach(item => {
            item.checked = false
            if (item.txt === options.txt) {
                item.checked = !options.checked
            }
        })
        this.getCurrentBtn(options, `weight`)
        this.getClieckdObj()
        this.changeTrueSkuList()
    }

    // 点击手镯内径
    clickedDiameter(options) {
        if (options.disabled) {
            return
        }
        this.diameterList.forEach(item => {
            item.checked = false
            if (item.txt === options.txt) {
                item.checked = !options.checked
            }
        })
        this.getCurrentBtn(options, `diameterLength`)
        this.getClieckdObj()
        this.changeTrueSkuList()
    }

   // 点击手镯面宽
    clickedFaceWidth(options) {
        if (options.disabled) {
            return
        }
        this.faceWidthList.forEach(item => {
            item.checked = false
            if (item.txt === options.txt) {
                item.checked = !options.checked
            }
        })
        this.getCurrentBtn(options, `faceWidth`)
        this.getClieckdObj()
        this.changeTrueSkuList()
    }

    // 点击项链
    clickedLength(options) {
        if (options.disabled) {
            return
        }
        this.lengthList.forEach(item => {
            item.checked = false
            if (item.txt === options.txt) {
                item.checked = !options.checked
            }
        })
        this.getCurrentBtn(options, `length`)
        this.getClieckdObj()
        this.changeTrueSkuList()
    }

    // 点击戒指 
    clickedRinghand(options) {
        if (options.disabled) {
            return
        }
        this.ringhandList.forEach(item => {
            item.checked = false
            if (item.txt === options.txt) {
                item.checked = !options.checked
            }
        })
        this.getCurrentBtn(options, `ringhand`)
        this.getClieckdObj()
        this.changeTrueSkuList()
    }

    // 触发状态刷新
    refStatusFunc() {
        this.getClieckdObj()
        this.changeTrueSkuList()
    }

    getThis() {
        return this
    }

}

export default DetailSku