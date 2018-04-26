const api = require('./config.js');

App({
    globalData: {

    },
    api: api,
    onLaunch: function () {

        var self = this, sessionId = wx.getStorageSync('sessionId');

        if (sessionId) {
            wx.switchTab({
                url: '/page/component/index/index',
            })
        } else {
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
                                //var union_id = res.data.data.union_id; 
                                var sessionId = '';
                                sessionId = res.data.data.session_id;
                                var loginInfo = res.data.data;
                                if (res.data.data.session_id && res.data.data.session_id != '') {
                                    wx.setStorageSync('sessionId', sessionId);
                                    wx.setStorageSync('loginInfo', loginInfo);
                                    wx.switchTab({
                                        url: '/page/component/index/index',
                                    })
                                } else {
                                    wx.redirectTo({
                                        //url: '/page/component/login/login?union_id=' + union_id,
                                        url: '/page/component/login/login',
                                    })
                                }
                            },
                            fail: function (res) {
                                console.log('res fail');
                            }
                        })
                    } else {
                        console.log('登录失败！')
                    }
                }
            });
        }
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