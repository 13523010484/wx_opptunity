var app = getApp();

Page({
    data: {
        listUser: [],
        cur_user_id: '',
        userInfo: ''
    },
    onLoad: function () {
        wx.showLoading({
            title: '加载中...',
        })
        var that = this;
        var userInfo = wx.getStorageSync('userInfo');
        var cur_user_id = wx.getStorageSync('userName').user_id;
        that.setData({
            userInfo: userInfo,
            cur_user_id: cur_user_id
        })

        wx.login({
            success: function (res) {
                var wx_code = res.code;
                if (res.code) {
                    app.request(app.api.getLoginListUrl, { wx_code: wx_code }, function (res) {
                        var result = res.data;
                        if (res.code == 200) {
                            that.setData({
                                listUser: result.listUser
                            })
                        }
                    })
                }
                wx.hideLoading();
            }
        })
    },

    // 跳转到登录页面
    bindNewUser: function (e) {
        var that = this;

        wx.login({
            success: function (res) {
                var wx_code = res.code;
                if (res.code) {
                    app.request(app.api.getAccountListUrl, { wx_code: wx_code, user_id: e.currentTarget.id }, function (res) {
                        if (res.code == 200) {
                            console.log('客户列表：');
                            if (res.data.session_id && res.data.session_id != '') {
                                wx.setStorageSync('sessionId', res.data.session_id);
                                wx.setStorageSync('userName', res.data);
                                that.setData({
                                    cur_user_id: res.data.user_id
                                })
                                wx.switchTab({
                                    url: '/page/component/index/index',
                                })
                            }
                        }
                    })
                }
            }
        })
    },

    // 添加绑定新账号
    jumpLoginPage: function () {
        wx.navigateTo({
            url: '/page/component/login/login',
        })
    }
})