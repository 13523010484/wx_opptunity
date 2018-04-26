var app = getApp();

Page({
    data: {
        data: '',
        other_mobiles: '',
        list: []
    },
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中...',
        })

        var that = this;
        var session_id = wx.getStorageSync('sessionId');
        app.request(app.api.opptunityListDetailUrl, { mo_id: this.options.id, session_id: session_id }, function (res) {
            var data = res.data;
            var other_mobiles = data.other_mobiles.split(',');
            if (res.code == 200) {
                that.setData({
                    data: data,
                    other_mobiles: other_mobiles
                })
            }
            wx.hideLoading()
        })

        app.request(app.api.followRecordUrl, { customer_sale_id: this.options.id, page: 1, size: 50, session_id: session_id }, function (res) {
           if(res.code == 200){
               var list = res.data.list
               console.log(list)
               that.setData({
                   list: list
               })
           }
            wx.hideLoading()
        })
    }
})