var app = getApp();

Page({
    data: {
        userInfo: '',
        user_name: ''
    },

    // 页面显示的时候
    onShow: function () {
        var that = this;
        var userInfo = wx.getStorageSync('userInfo');
        var user_name = wx.getStorageSync('userName').user_name;
        this.setData({
            userInfo: userInfo,
            user_name: user_name
        })
        console.log('缓存当中无法获取用户头像：');
        console.log(Boolean(!wx.getStorageSync('userInfo')));

        if (!wx.getStorageSync('userInfo')) {
            wx.getUserInfo({
                success: function (res) {
                    console.log('res:');
                    console.log(res);
                    wx.setStorageSync('userInfo', res.userInfo);
                    that.setData({
                        userInfo: res.userInfo
                    })
                }
            })
        }
    },
    getNewVersion: function () {
        // 检测版本，当小程序发布新版本时，检测并自动更新
        if (wx.getUpdateManager) {
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                console.log(res.hasUpdate)
            })
            updateManager.onUpdateReady(function () {
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate()
                        }
                    }
                })
            })
            updateManager.onUpdateFailed(function () {
                // 新的版本下载失败
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用版本自动更新的功能，请升级到最新微信版本后重试。'
            })
        }
    }
})