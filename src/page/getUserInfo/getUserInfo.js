var app = getApp()

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        wx_code: ''
    },
    onLoad: function () {
        var that = this;
        // 调用wx.login获取wx_code,并更新data中的wx_code
        app.getWxLogin(function (wx_code) {
            that.setData({
                wx_code: wx_code
            })
        })

        // 检测用户是否已经允许授权，如果已经允许授权，直接没有弹出框，直接点击获取用户信息
        wx.getSetting({
            success: function (res) {
                console.log(res);
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取用户信息
                    wx.getUserInfo({
                        success: function (res) {
                            // 用户允许授权后，缓存用户信息
                            wx.setStorageSync('userInfo', res.userInfo);
                            if (that.data.wx_code && res.encryptedData && res.iv) {
                                wx.redirectTo({
                                    url: '/page/component/login/login?wx_code=' + that.data.wx_code + '&encryptedData=' + res.encryptedData + '&iv=' + res.iv,
                                })
                            }
                        }
                    })
                }
            }
        })
    },

    // 使用组件button获取用户的个人信息
    bindGetUserInfo: function (e) {
        var that = this;
        // 用户允许授权后，缓存用户信息
        wx.setStorageSync('userInfo', e.detail.userInfo);
        app.getWxLogin(function (wx_code) {
            if (wx_code && e.detail.encryptedData && e.detail.iv) {
                wx.redirectTo({
                    url: '/page/component/login/login?wx_code=' + wx_code + '&encryptedData=' + e.detail.encryptedData + '&iv=' + e.detail.iv,
                })
            }
        })
    }
})