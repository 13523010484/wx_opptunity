var app = getApp();

Page({
    data: {
        login_name: '',
        password: '',
        wx_code: '',// 允许授权页面传递过来的wx_code
        encryptedData: '',// 允许授权页面传递过来的encryptedData
        iv: '',// 允许授权页面传递过来的iv
    },
    onLoad: function (options) {
        console.log('login onLoad:');
        console.log(options)
        this.setData({
            wx_code: options.wx_code,
            encryptedData: options.encryptedData,
            iv: options.iv
        })
    },

    // 获取用户输入的用户名
    bindKeyInput: function (e) {
        this.setData({
            login_name: e.detail.value
        })
    },

    // 获取用户输入的密码
    bindPassword: function (e) {
        this.setData({
            password: e.detail.value
        })
    },

    // 点击登录，成功的话跳转到主功能页面，失败的话，错误信息提醒
    login: function () {
        var that = this,
            params = {
                login_name: this.data.login_name,
                password: this.data.password,
                wx_code: this.data.wx_code,
                encryptedData: this.data.encryptedData,
                iv: this.data.iv
            };

        app.request(app.api.userLoginUrl, params, function (res) {
            console.log('login点击登录成功之后返回的数据:');
            console.log(res);
            if (res.code == 200) {
                // 账号绑定成功，将sessionId缓存到本地
                wx.setStorageSync('sessionId', res.data.session_id);
                wx.setStorageSync('userName', res.data);
                // 账户绑定成功，跳转到功能列表页面
                wx.switchTab({
                    url: '/page/component/index/index',
                })
            } else if (res.code == 8001) {
                // code=8001 用户操作错误的信息提示，用户名错误、密码错误、用户名不存在
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 4000
                })
            } else if (res.code == 8002) {
                // code=8002 微信提供的一些错误信息
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 4000
                })
                setTimeout(function () {
                    wx.redirectTo({
                        url: '/page/getUserInfo/getUserInfo',
                    })
                }, 4000)
            }

        })
    }
})