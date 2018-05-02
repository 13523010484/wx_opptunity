var app = getApp();

Page({
    data: {
        userInfo: '',
        user_name: ''
    },
    onShow: function (options) {
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
    getNewVersion: function () {
        const updateManager = wx.getUpdateManager()

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
            if (res.hasUpdate) {
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
            } else {
                wx.showModal({
                    title: '提示',
                    content: '当前已经是最新版本了哦~',
                    showCancel: false
                })
            }
        })

        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
        })
    },

    // tc 
    jumpLoginList: function(){

    }
})