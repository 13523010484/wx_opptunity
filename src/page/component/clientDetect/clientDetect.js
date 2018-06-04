var app = getApp()

Page({
    data: {
        mobile_prefix: '',// 手机号前三位
        mobile_suffix: '',// 手机号尾号
        results_code: '',// 点击检测后台返回的状态码：200客户不重复；601客户重复
        show_status: false,// 显示状态，默认隐藏
    },

    onLoad: function () {
        var session_id = wx.getStorageSync('sessionId');
        if (!session_id) {
            wx.redirectTo({
                url: '/page/getUserInfo/getUserInfo',
            })
        }
    },

    // inputThree 获取用户输入的前三位手机号的值
    inputThree: function (e) {
        this.setData({
            mobile_prefix: e.detail.value,
            show_status: false
        })
    },

    // inputFour 获取用户输入的前手机号尾号的值
    inputFour: function (e) {
        this.setData({
            mobile_suffix: e.detail.value,
            show_status: false
        })
    },

    // checkMobile 点击检测手机号的接口
    checkMobile: function () {
        var that = this,
            session_id = wx.getStorageSync('sessionId'),
            params = {
                mobile_prefix: this.data.mobile_prefix,
                mobile_suffix: this.data.mobile_suffix,
                session_id: session_id
            };

        if ((this.data.mobile_prefix != '') && (this.data.mobile_suffix != '')) {
            app.request(app.api.checkClientMobileUrl, params, function (res) {
                
                that.setData({
                    results_code: res.code,
                    show_status: true
                })

            })
        } else {
            wx.showToast({
                title: '请输入完整',
                icon: 'none',
                duration: 2000
            })
        }

    }



})