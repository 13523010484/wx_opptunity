var app = getApp()

Page({
    data: {
        results_list: [],// 后台返回的销售部列表的数据
        page: 1,// 页码
        size: 15,// 一次请求的数据条数
        total: '',// 后台返回的总共的数据
        loadMore: false,// 加载更多，默认隐藏
        hasLoading: false,
    },

    onLoad: function () {
        var session_id = wx.getStorageSync('sessionId');
        if (session_id) {
            this.get_data();// 页面加载时候请求数据
        } else {
            wx.redirectTo({
                url: '/page/getUserInfo/getUserInfo',
            })
        }
    },

    // 封装请求销售部列表的方法
    get_data() {
        wx.showLoading({
            title: '加载中...',
        });

        var that = this, session_id = wx.getStorageSync('sessionId'),
            params = {
                page: this.data.page,
                size: this.data.size,
                session_id: session_id
            };

        app.request(app.api.getSalesListUrl, params, function (res) {
            if (res.code == 200) {
                var results_list = res.data.list,
                    total = res.data.total;

                that.setData({
                    results_list: that.data.results_list.concat(results_list),
                    total: total,
                    hasLoading: true
                })
            }
            wx.hideLoading();

        })
    },

    // 到达底部加载更多
    onReachBottom: function (e) {
        var cur_num = this.data.results_list.length,
            total = this.data.total;

        if (cur_num < total) {// 页面中显示的数据小于后台返回的数据时，继续请求数据
            var page = this.data.page + 1;
            this.setData({
                page: page,
                loadMore: true
            });

            this.get_data();
        }
    }

})