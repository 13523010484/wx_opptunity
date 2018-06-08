var app = getApp();
var util = require('../../../util/util');// 引入工具类，格式化时间

Page({
    data: {
        data: '',
        other_mobiles: '',
        list: [],
        show: false,// 默认状态下不显示底部按钮
        hidden: true,
        mo_id: '',
        radioArr: [
            { name: '来访', value: 'V' },
            { name: '来电', value: 'P' }
        ],
        vt: '',// 提交时向后台传递的radio的值
        content: '',// 提交时向后台传递的textarea的值
        red_info: false
    },

    onLoad: function (options) {
        if (getCurrentPages()[1].route == "page/component/opptunity/opptunity") {
            this.setData({
                show: true,// 列表页面进入详情的，详情页面显示底部按钮，否则的话隐藏底部按钮
                mo_id: options.id
            })
        }
        wx.showLoading({
            title: '加载中...',
        })

        var that = this;
        var session_id = wx.getStorageSync('sessionId');
        app.request(app.api.opptunityListDetailUrl, { mo_id: options.id, session_id: session_id }, function (res) {
            var data = res.data;
            var other_mobiles = data.other_mobiles.split(',');
            if (res.code == 200) {
                that.setData({
                    data: data,
                    other_mobiles: other_mobiles
                })
            }
            wx.hideLoading()
        })

        this.get_follow_data(options.id);
    },

    // 根据记录的请求
    get_follow_data(customer_sale_id) {
        var that = this, session_id = wx.getStorageSync('sessionId');

        app.request(app.api.followRecordUrl, { customer_sale_id: customer_sale_id, page: 1, size: 50, session_id: session_id }, function (res) {
            if (res.code == 200) {
                var list = res.data.list
                console.log(list)
                that.setData({
                    list: list
                })
            }
            wx.hideLoading()
        })
    },

    // 显示模态框
    showModal: function () {
        this.setData({
            hidden: false
        })
    },

    // modal 取消按钮
    cancel: function () {
        this.setData({
            hidden: true
        })
    },

    // 提交按钮
    confirm: function (e) {
        var that = this,
            obj = {
                customer_name: this.data.data.name,
                mobile: this.data.data.mobile,
                vt: this.data.vt,
                gender: this.data.data.gender,
                content: this.data.content,
                note: this.data.data.note,
                visit_time: util.transDate(new Date()),// 拜访的时间是今天的时间
                age_composition_id: this.data.data.age_composition_id,
                cognitive_approach_type_id: this.data.data.cognitive_approach_type_id,
                cognitive_approach_id: this.data.data.cognitive_approach_id,
                sale_type_d9d: this.data.data.sale_type_d9d,
                union_sale_user_ids: '',//联合销售员
                cognitive_approach_label_name: this.data.data.cognitive_approach_label_name,
                cognitive_approach_options_value: this.data.data.cognitive_approach_options_value,
                guid: new Date().getTime() + Math.random()
            };

        var mo_data = [];
        mo_data.push(obj);
        var str = JSON.stringify(mo_data);

        var params = {
            session_id: wx.getStorageSync('sessionId'),
            mo_data: str
        };

        if (this.data.vt && this.data.content){
            app.request(app.api.uploadUrl, params, function (res) {
                if (res.code == 200) {
                    that.setData({
                        red_info: false,
                        hidden: true
                    })
                    that.get_follow_data(that.data.mo_id);
                }

            }, 'POST')
        }else{
           this.setData({
               red_info: true
           }) 
        }
    },

    // radioChange获取单选按钮的值
    radioChange: function (e) {
        console.log('radio 获取表单的值：');
        console.log(e);
        this.setData({
            vt: e.detail.value
        })
    },

    // 多行输入框的值
    bindTextAreaInput: function (e) {
        console.log('多行输入框：');
        console.log(e);
        this.setData({
            content: e.detail.value
        });

    }
})