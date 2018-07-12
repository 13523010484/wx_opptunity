var app = getApp();

Page({
    data: {
        userInfo: '',
        user_name: '',
        source_info: ''// 测试用户打开小程序的场景值
    },

    // 页面显示的时候
    onShow: function () {
        var that = this;
        var userInfo = wx.getStorageSync('userInfo');
        var user_name = wx.getStorageSync('userName').user_name;
        var session_id = wx.getStorageSync('sessionId');
        var source_info = JSON.stringify(wx.getStorageSync('sourceInfo'));
        console.log(source_info);

        if (session_id) {
            this.setData({
                userInfo: userInfo,
                user_name: user_name,
                source_info: source_info
            })

            if (!wx.getStorageSync('userInfo')) {
                wx.getUserInfo({
                    success: function (res) {
                        wx.setStorageSync('userInfo', res.userInfo);
                        that.setData({
                            userInfo: res.userInfo
                        })
                    }
                })
            }
        } else {
            wx.redirectTo({
                url: '/page/getUserInfo/getUserInfo',
            })
        }
    },

    getNewVersion: function () {
        // 获取小程序更新机制兼容
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
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
                    updateManager.onUpdateFailed(function () {
                        // 新的版本下载失败
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                        })
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '已经是最新版本了哦~',
                        showCancel: false
                    })
                }
            })
        } else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    }
})