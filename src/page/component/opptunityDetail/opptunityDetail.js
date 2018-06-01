var app = getApp();

Page({
    data: {
        data: '',
        other_mobiles: '',
        list: [],
        show: false,// 默认状态下不显示底部按钮
    },

    onLoad: function (options) {
        if (getCurrentPages()[1].route == "page/component/opptunity/opptunity"){
            this.setData({
                show: true// 列表页面进入详情的，详情页面显示底部按钮，否则的话隐藏底部按钮
            })
        }
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