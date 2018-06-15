const api = require('./config.js');

App({
    api: api,
    globalData: {
    },
    onLaunch: function () {
        var self = this, sessionId = wx.getStorageSync('sessionId');// 获取缓存中的sessionId;

        // 检测版本号的接口
        self.request(self.api.checkVersionUrl, { OS: 3, verIndex: 7 }, function (res) {
            console.log('检测版本号返回数据：');
            console.log(res);
            if (res.code == 200) {
                if (res.data.has_new) {
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
            }

        })


        /**
         *  检测的接口 act=wx_code_login：调用wx.login获取wx_code传递给后台，后台检测用户是否已经绑定，
         *  code=601: 用户尚未绑定，跳转到用户授权的页面，用户点击授权，获取到用户的unionID，跳转到输入用户名密码的
         *  页面将账户信息和unionID进行绑定。
         *  code=200: 用户已经绑定成功的状态码，如果用户绑定
         *  code=603: sessionId过期，wx.login重新发送wx_code
         * 
         * **/
        if (sessionId) {
            self.request(self.api.checkSessionIdUrl, { session_id: sessionId }, function (res) {
                console.log('检测sessionId是否过期：');
                console.log(res);
                if (res.code == 200) {
                    console.log('200:')
                    // sessionId未过期，跳转到功能列表页
                    wx.switchTab({
                        url: '/page/component/index/index',
                    })
                } else {
                    console.log('603:');
                    // sessionId过期，重新获取wx_code，调用检测的接口将sessionId缓存到本地
                    self.getWxLogin(function (wx_code) {
                        self.request(self.api.unionIdUrl, { wx_code: wx_code }, function (res) {
                            if (res.code == 200) {
                                // 登录成功，缓存有效的sessionId到本地
                                wx.setStorageSync('sessionId', res.data.session_id);
                                wx.setStorageSync('userName', res.data);
                                wx.switchTab({
                                    url: '/page/component/index/index',// 跳转到功能列表页
                                })
                            }
                        })
                    })
                }
            })
        } else {
            self.getWxLogin(function (wx_code) {
                self.request(self.api.unionIdUrl, { wx_code: wx_code }, function (res) {
                    // code=601 账号未绑定，跳转到登录页面，输入用户名密码进行账号绑定
                    if (res.code == 601) {
                        wx.redirectTo({
                            url: '/page/getUserInfo/getUserInfo',
                        })
                    } else {
                        // code=200 账号已经绑定成功，跳转到功能列表页
                        console.log('用户清空了缓存：');
                        // code=200，但是用户清空了本地缓存，此时缓存sessionId到本地，并跳转到功能列表页
                        wx.setStorageSync('sessionId', res.data.session_id);
                        wx.setStorageSync('userName', res.data);
                        wx.switchTab({
                            url: '/page/component/index/index',
                        })
                    }
                })
            })
        }

    },

    // 封装网络请求的接口
    request(url, param, callback, method, header) {
        if (header) {
            header["X-Requested-With"] = "XMLHttpRequest";
        } else {
            header = {
                'Content-Type': 'application/x-www-form-urlencoded'
                , 'X-Requested-With': 'XMLHttpRequest'
            };
        }
        wx.request({
            url: url,
            data: param,
            method: method || 'GET',
            dataType: 'json',
            header: header,
            success: function (ret) {
                // 重新定义状态码 hasError=false的状态码有200和603。hasError=true的状态码有8001、8002、8003
                var data = ret.data.hasErrors == true ? { code: ret.data.code, msg: ret.data.message } : { code: ret.data.code, data: ret.data.data };
                return typeof callback == "function" && callback(data)
            },
            fail: function () {
                var data = { code: 401, msg: '网络连接错误' };
                return typeof callback == "function" && callback(data)
            }
        })
    },

    // getWxLogin：封装获取使用wx.login获取wx_code的方法
    getWxLogin: function (callback) {
        var self = this
        wx.login({
            success: function (res) {
                if (res.code) {
                    callback(res.code)
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            },
            fail: function (err) {
                console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
                callback(err)
            }
        })
    }

})