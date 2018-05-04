const api = require('./config.js');

App({
    globalData: {
    },
    api: api,
    onLaunch: function () {

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

        var self = this, sessionId = wx.getStorageSync('sessionId');
        wx.login({
            success: function (res) {
                var wx_code = res.code;
                if (wx_code) {
                    wx.request({
                        url: self.api.unionIdUrl,
                        data: { wx_code: wx_code },
                        method: 'POST',
                        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        success: function (res) {
                            if (res.data.code == 1 && res.data.data.session_id && res.data.data.session_id != '') {
                                var sessionId = '';
                                sessionId = res.data.data.session_id;
                                var loginInfo = res.data.data;
                                wx.setStorageSync('sessionId', sessionId);
                                wx.setStorageSync('loginInfo', loginInfo);
                                wx.switchTab({
                                    url: '/page/component/index/index',
                                })
                            } else {
                                wx.redirectTo({
                                    url: '/page/component/login/login',
                                })
                            }
                        },
                        fail: function (res) {
                            wx.showModal({
                                title: '提示',
                                content: '登录失败！删除本地小程序，重新搜索此小程序再次打开'+res.errMsg,
                                showCancel: false
                            })
                        }
                    })
                } else {
                    console.log('登录失败！')
                }
            }
        });
    },
    request(url, param, callback, method, header) {
        wx.request({
            url: url,
            data: param,
            method: method || 'GET',
            dataType: 'json',
            header: header || { 'Content-Type': 'application/x-www-form-urlencoded' },
            success: function (ret) {
                var data = ret.data.hasErrors == true ? { code: 400, msg: ret.data.message } : { code: 200, data: ret.data.data };
                return typeof callback == "function" && callback(data)
            },
            fail: function () {
                var data = { code: 401, msg: '网络连接错误' };
                return typeof callback == "function" && callback(data)
            }
        })
    }
})