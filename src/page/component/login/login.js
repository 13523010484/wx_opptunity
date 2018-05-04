var app = getApp();

function get_data(that) {
    var $this = that
   wx.login({
      success: function(res){
          var wx_code = res.code;
          if (wx_code){
              app.request(app.api.userLoginUrl, { login_name: $this.data.login_name, password: $this.data.password, wx_code: wx_code }, function (res) {
                  // 用户名或者密码输入错误时
                  if (res.code == 400) {
                      wx.showToast({
                          title: res.msg,
                          icon: 'none',
                          duration: 4000
                      })
                  }
                  // 请求成功且session_id存在且不为空时，用户跳转到主页面
                  if (res.code == 200 && res.data.session_id && res.data.session_id != '') {
                      var sessionId = res.data.session_id;
                      var loginInfo = res.data;
                      wx.setStorageSync('sessionId', sessionId);
                      wx.setStorageSync('loginInfo', loginInfo);
                      wx.switchTab({
                          url: '/page/component/index/index',
                      })
                  }
              }, 'POST')
          }
      }
   })
}

Page({
    data: {
        login_name: '',
        password: '',
        wx_code: ''
    },
    onLoad: function () {
    },
    bindKeyInput: function (e) {
        this.setData({
            login_name: e.detail.value
        })
    },
    bindPassword: function (e) {
        this.setData({
            password: e.detail.value
        })
    },
    login: function () {
        get_data(this);
    }
})