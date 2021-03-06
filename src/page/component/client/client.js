var app = getApp()
var util = require('../../../util/util'); // 引入工具类，格式化时间
var knowsData = [];

Page({
    data: {
        sessionId: '', // 加载页面时，保存缓存中的sessionId
        user_name: '', // 销售员的身份信息
        open: false, // 点击右侧加号图标，默认关闭状态
        groupUsers: [], // 获取联合销售员列表
        groupUsersIdStr: [], // 存储选中的联合销售员的userId
        ageLayerArr: [], // 获取年龄层数据
        cardArr: [], // 获取卡类别数据
        knowsFirstArr: [], // 获取认知途径渠道信息
        knowsSecondArr: [], // 获取认知途径地点信息
        ageIndex: '', // 年龄层索引下标
        cardIndex: '', // 营销类型索引下标
        knowsIndex: '', // 认知途径渠道信息索引下标
        placeIndex: 1, // 认知途径地点信息索引下标
        phone: '', // 用户输入的手机号
        hiddenStatus: true, // 点击检测时，如果手机号输入不正确或者手机号正确但此手机号在保护期，隐藏编辑客户信息的类别项
        disabled: true, // 二级联动，默认状态下，如果用户没有点击联动的一级列表，则二级列表为禁用状态
        checkMobData: '', // 检测手机号返回的数据
        ageLayerData: '', // 获取年龄层返回的数据
        cardData: '', // 获取营销类型返回的数据
        knowsData: '', // 获取认知途径
        vt: 'V', // 来访、来电
        gender: 0, // 男、女
        guid: '',
        ageViewData: '', // 页面显示的年龄层数据
        ageId: '', // 年龄层ID
        sellViewData: '', // 页面显示的营销类型数据
        cardId: '', // 营销类型卡ID
        knowsViewData: '', // 页面显示的认知渠道第一列的数据
        knowsFirstId: '', // 页面显示的认知途径第一列的ID
        knowsViewData2: '', // 页面显示的认知渠道第二列的数据
        knowsSecondId: '', // 页面显示的认知途径的第二列的ID
        cognitive_approach_type_id: '',
        cognitive_approach_id: '',
        //currentDay: util.transDate(new Date()),// 显示当天访问的时间
        currentDay: '', // 显示当天访问的时间
        need_options_data: '', // 第二列的数据，为了控制是否显示标签值：卡名、卡号
    },

    // 页面加载时
    onLoad: function() {
        var session_id = wx.getStorageSync('sessionId');

        if (session_id) {
            var user_name = wx.getStorageSync('userName').user_name;
            var sessionId = wx.getStorageSync('sessionId');
            var guid = new Date().getTime() + Math.random();
            var currentDay = util.transDate(new Date());

            this.setData({
                guid: guid,
                sessionId: sessionId,
                user_name: user_name,
                currentDay: currentDay
            })

            this.getGroupUserList(); // 获取联合销售员的数据请求
            this.getAgeLayer(); // 获取年龄层的数据请求
            this.getCard(); // 获取营销类型的数据请求
            this.getKnows(); // 获取营销类型的数据请求
        } else {
            wx.redirectTo({
                url: '/page/getUserInfo/getUserInfo',
            })
        }
    },

    // 访问类型的事件
    radio_change: function(e) {
        this.setData({
            vt: e.detail.value
        })
    },

    // changeStatus 点击icon图标显示销售员列表
    changeStatus: function(e) {
        this.data[e.currentTarget.id] = !this.data[e.currentTarget.id]
        var checkedArray = this.data.groupUsersIdStr,
            self = this;
        var groupUsers = this.data.groupUsers

        this.setData({
            open: this.data[e.currentTarget.id]
        })
        if (!this.data.open) {
            groupUsers.forEach(function(item, index) {

                if (checkedArray.indexOf(item.user_id) >= 0) {
                    groupUsers[index].checked = true
                }
            })
        } else {
            groupUsers.forEach(function(item, index) {
                if (checkedArray.indexOf(item.user_id) >= 0) {
                    groupUsers[index].checked = false
                }
            })
        }

        this.setData({
            groupUsers: groupUsers
        })
    },

    // checkboxChange 销售员多选的下拉列表
    checkboxChange: function(e) {
        var groupUsersIdArr = [];
        groupUsersIdArr.push(e.detail.value)
        this.setData({
            groupUsersIdStr: groupUsersIdArr[0]
        })
    },

    bindInputNum: function(e) {
        this.setData({
            phone: e.detail.value
        })
    },

    // checkTelNum 检测输入手机号的格式是否正确
    checkTelNum: function() {
        var get_phone = this.data.phone,
            telReg = new RegExp('(^1[3-9][0-9]{9}$)');
        if (get_phone.length == 0) {
            wx.showToast({
                title: '手机号不能为空！',
                icon: 'none',
                duration: 1500
            })
            return false;
        } else if (get_phone.length < 11) {
            wx.showToast({
                title: '手机号长度有误！',
                icon: 'none',
                duration: 1500
            })
            return false;
        } else if (!telReg.test(get_phone)) {
            wx.showToast({
                title: '手机号格式有误！',
                icon: 'none',
                duration: 1500
            })
            return false;
        } else {
            // 点击检测进行接口请求
            var that = this;
            var params = {
                session_id: this.data.sessionId,
                vt: that.data.vt,
                phone: that.data.phone
            }
            app.request(app.api.checkMobileUrl, params, function(res) {
                if (res.code == 200) {
                    if (that.data.vt == 'V' && res.data.hasProtected == true) {
                        wx.showModal({
                            title: '提示',
                            content: '您输入的手机号正在保护期，无法编辑用户信息！',
                            showCancel: false
                        })
                    } else {
                        var checkMobData = res.data;
                        // 更新页面层数据
                        that.setData({
                            checkMobData: checkMobData, // 点击检测返回的数据
                            gender: checkMobData.gender ? 0 : 1, // 性别
                            vt: checkMobData.customer_visit_type_d9d == 'V' ? 'V' : 'P', // 来电来访
                            ageViewData: checkMobData.age_composition_name, // 年龄层
                            sellViewData: checkMobData.sale_type_d9d_name, // 营销类型
                            knowsViewData: checkMobData.cognitive_approach_pid_name, // 认知途径
                            knowsViewData2: checkMobData.cognitive_approach_name, // 认知途径第二列
                            ageId: checkMobData.age_composition_id, // 年龄层ID
                            cardId: checkMobData.sale_type_d9d, // 营销类型卡ID
                            cognitive_approach_type_id: checkMobData.cognitive_approach_type_id, // 认知渠道第一列ID
                            cognitive_approach_id: checkMobData.cognitive_approach_id, // 认知渠道第二列ID
                            hiddenStatus: false // 手机号保护期外的客户可以编辑的信息列表
                        })
                    }
                }
            }, 'POST')
        }
    },

    // picker  age
    bindPickerAge: function(e) {
        var ageIndex = e.detail.value;
        var ageId = this.data.ageLayerData.items[ageIndex].sys_dict_item_id;
        this.setData({
            ageIndex: ageIndex,
            ageId: ageId,
            ageViewData: this.data.ageLayerArr[ageIndex]
        })
    },

    // picker  card
    bindPickerCard: function(e) {
        var cardIndex = e.detail.value;
        var cardId = this.data.cardData.items[cardIndex].sys_dict_item_id;
        this.setData({
            cardIndex: cardIndex,
            cardId: cardId,
            sellViewData: this.data.cardArr[cardIndex]
        })
    },

    // 认知途径渠道信息
    bindPickerKnows: function(e) {
        var knowsIndex = e.detail.value;
        var knowsSecondArr = [];
        knowsData[knowsIndex].items.forEach(function(item, index) {
            knowsSecondArr.push(item.name);
        })
        var cognitive_approach_type_id = knowsData[knowsIndex].ca_id;
        this.setData({
            knowsIndex: knowsIndex,
            cognitive_approach_type_id: cognitive_approach_type_id,
            knowsViewData: this.data.knowsFirstArr[knowsIndex],
            knowsSecondArr: knowsSecondArr,
            disabled: false,
            knowsViewData2: ''
        })
    },

    // 认知途径地点信息索引
    bindPickerPlace: function(e) {
        var need_options_data = knowsData[this.data.knowsIndex].items[e.detail.value]; // 180530 新增：标签值是否显示
        this.setData({
            placeIndex: e.detail.value,
            cognitive_approach_id: need_options_data.value,
            knowsViewData2: this.data.knowsSecondArr[e.detail.value],
            need_options_data: need_options_data // 180530 新增：标签值是否显示
        })
    },

    // 获取联合销售员列表的数据请求
    getGroupUserList() {
        var that = this;
        app.request(app.api.getGroupUserUrl, {
            session_id: that.data.sessionId
        }, function(res) {
            var groupUsers = res.data;
            if (res.code == 200) {
                that.setData({
                    groupUsers: groupUsers
                })
            }
        }, '', {
            'Content-Type': 'application/json'
        })
    },
    selectAge(dict_id, callback) {
        var that = this,
            params = {
                dict_id: dict_id,
                session_id: this.data.sessionId
            };

        // 获取年龄层的接口
        app.request(app.api.getAgeLayerUrl, params, function(res) {
            callback(res)
        }, '', {
            'Content-Type': 'application/json'
        })
    },

    // picker  age  获取年龄层的数据请求
    getAgeLayer() {
        var that = this;
        this.selectAge('20131031193233001004', function(res) {
            var ageLayerData = res.data,
                ageLayerArr = [];
            ageLayerData.items.forEach(function(value) {
                ageLayerArr.push(value.dict_item_name);
            })
            if (res.code == 200) {
                that.setData({
                    ageLayerData: ageLayerData,
                    ageLayerArr: ageLayerArr
                })
            }
        })
    },

    // picker  card  获取营销类型的数据请求
    getCard() {
        var that = this;
        this.selectAge('20150427111700001001', function(res) {
            var cardData = res.data,
                cardArr = [];
            cardData.items.forEach(function(value) {
                cardArr.push(value.dict_item_name);
            })
            if (res.code == 200) {
                that.setData({
                    cardData: cardData,
                    cardArr: cardArr
                })
            }
        })
    },

    // picker knows  获取认知途径的数据请求
    getKnows() {
        var that = this;
        app.request(app.api.getKnowWaysUrl, '', function(res) {
            knowsData = res.data
            var knowsFirstArr = [],
                knowsIndex = that.data.knowsIndex;

            // 认知途径渠道信息
            knowsData.forEach(function(item) {
                knowsFirstArr.push(item.ca_name)
            })
            that.setData({
                knowsData: knowsData,
                knowsFirstArr: knowsFirstArr
            })
        }, '', {
            'Content-Type': 'application/json'
        })
    },

    // 点击按钮 提交表单数据
    formSubmit: function(e) {
        wx.showLoading({
            title: '上传中...',
        })

        var obj = {
            customer_name: e.detail.value.inputName,
            weixin: e.detail.value.weixin,
            mobile: this.data.phone,
            vt: e.detail.value.vt,
            gender: e.detail.value.gender,
            content: e.detail.value.content,
            note: e.detail.value.note,
            visit_time: this.data.currentDay,
            age_composition_id: this.data.ageId,
            cognitive_approach_type_id: this.data.cognitive_approach_type_id,
            cognitive_approach_id: this.data.cognitive_approach_id,
            sale_type_d9d: this.data.cardId,
            union_sale_user_ids: this.data.groupUsersIdStr.join(),
            cognitive_approach_label_name: this.data.need_options_data.options_label_name,
            cognitive_approach_options_value: e.detail.value.cognitive_approach_label_value,
            guid: this.data.guid
        };
        var mo_data = [];
        mo_data.push(obj);
        var str = JSON.stringify(mo_data);

        var params = {
            session_id: this.data.sessionId,
            mo_data: str
        };

        if (obj.mobile && obj.customer_name && obj.content && this.data.ageId && this.data.cardId && this.data.cognitive_approach_type_id && this.data.cognitive_approach_id) {
            app.request(app.api.uploadUrl, params, function(res) {
                if (res.code == 200) {
                    if (res.data[0].isOk == true) {
                        wx.switchTab({
                            url: '/page/component/index/index',
                        })
                    } else if (res.data[0].isOk == false) {
                        wx.hideLoading();
                        wx.showModal({
                            title: '提示',
                            content: '上传失败,' + res.data[0].result,
                            showCancel: false
                        })
                    }
                }
            }, 'POST')
        } else {
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '上传失败，除备注外都是必填项！',
                showCancel: false
            })
        }
    }
})