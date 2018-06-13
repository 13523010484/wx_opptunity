var app = getApp();

Page({
    data: {
        listUser: [],
        cur_user_id: '',
        userInfo: '',
        radioId: ''
    },

    onLoad: function () {
        var that = this;
        var userInfo = wx.getStorageSync('userInfo');
        var cur_user_id = wx.getStorageSync('userName').user_id;
        this.setData({
            userInfo: userInfo,
            cur_user_id: cur_user_id
        })

        // 当前绑定账户的列表数据
        this.get_bind_list(function (res) {
            if (res.code == 200) {
                that.setData({
                    listUser: res.data.listUser
                })
                wx.hideLoading();
            }
        });
    },

    // 切换账户
    bindNewUser: function (e) {
        console.log(e);
        if (e.currentTarget.id != this.data.radioId) {
            this.setData({
                radioId: e.currentTarget.id
            })
            this.change_cur_user(e.currentTarget.id)
        }
    },

    // 当前账户绑定的列表
    get_bind_list(callback) {
        wx.showLoading({
            title: '加载中...',
        })
        var that = this;

        wx.login({
            success: function (res) {
                var wx_code = res.code;
                if (wx_code) {
                    app.request(app.api.getLoginListUrl, { wx_code: wx_code }, function (res) {
                        callback(res);
                    })
                }
            }
        })
    },

    // 切换账户的方法
    change_cur_user(user_id) {
        var that = this;

        wx.login({
            success: function (res) {
                var wx_code = res.code;
                if (res.code) {
                    app.request(app.api.getAccountListUrl, { wx_code: wx_code, user_id: user_id }, function (res) {
                        if (res.code == 200) {

                            if (res.data.session_id && res.data.session_id != '') {
                                wx.setStorageSync('sessionId', res.data.session_id);
                                wx.setStorageSync('userName', res.data);

                                that.setData({
                                    cur_user_id: res.data.user_id
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
            url: '/page/getUserInfo/getUserInfo',
        })
    },

    // 解除绑定
    bind_cancel: function () {
        var session_id = wx.getStorageSync('sessionId');
        var user_name = wx.getStorageSync('userName').user_name;
        var that = this;

        wx.showModal({
            title: '提示',
            content: '是否解除当前绑定账户： ' + user_name + '？',
            success: function (res) {
                if (res.confirm) {
                    app.request(app.api.cancelBindUrl, { user_id: that.data.cur_user_id, session_id: session_id }, function (res) {

                        if (res.code == 200) {
                            that.get_bind_list(function (res) {
                                if (res.code == 200) {
                                    var listUser = res.data.listUser;
                                    that.setData({
                                        listUser: listUser
                                    })

                                    if (that.data.listUser.length) {
                                        that.change_cur_user(listUser[0].user_id);
                                    } else {
                                        wx.clearStorageSync('sessionId');
                                        wx.redirectTo({
                                            url: '/page/getUserInfo/getUserInfo',
                                        })
                                    }
                                    wx.hideLoading();

                                }
                            })
                        }
                    })

                } else {
                    console.log('用户点击了取消按钮：');
                    console.log(res);
                }
            }
        })
    }
})