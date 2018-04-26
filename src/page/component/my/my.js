var app = getApp();

Page({
    data: {
        userInfo: '',
        user_name: ''
    },
    onLoad: function (options) {
        var that = this;
        var user_name = wx.getStorageSync('loginInfo').user_name
        wx.getUserInfo({
            success: function (res) {
                var userInfo = res.userInfo;
                wx.setStorageSync('userInfo', userInfo);
                that.setData({
                    userInfo: userInfo,
                    user_name: user_name
                })
            }
        })
    },
    changeLogin: function () {
       
    }
})