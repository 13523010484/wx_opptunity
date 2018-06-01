var app = getApp()

var app = getApp()

Page({
    data: {
        results_list: [],// 后台返回的客户列表的数据
        user_id: '',// 客户id
        page: 1,
        size: 15,
        total: '',// 后台返回的总的数据条数
        hasLoading: false,// 设置一个状态
        loadMore: false,// 显示加载更多，默认不显示
        search_key: '',// 输入框的值
    },

    onLoad: function (options) {
        this.setData({
            user_id: options.user_id
        });

        this.get_data();// 页面加载时请求客户列表的数据

    },

    // 获取输入框的值
    inputKey: function (e) {
        this.setData({
            search_key: e.detail.value
        })

        wx.showLoading({
            title: '加载中...',
        });

        var that = this, session_id = wx.getStorageSync('sessionId'),
            params = {
                page: this.data.page,
                size: this.data.size,
                user_id: this.data.user_id,
                search_key: this.data.search_key,
                session_id: session_id
            };

        app.request(app.api.getSellerCustomerUrl, params, function (res) {

            if (res.code == 200) {
                var results_list = res.data.list,
                    total = res.data.total;

                that.setData({
                    results_list: results_list,
                    total: total
                })
            }
            wx.hideLoading();

        })

    },

    // 打电话
    makePhoneCall: function (e) {
        console.log(e);
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.id,
        })
    },

    // 封装请求销售员列表的方法
    get_data() {
        wx.showLoading({
            title: '加载中...',
        });

        var that = this, session_id = wx.getStorageSync('sessionId'),
            params = {
                page: this.data.page,
                size: this.data.size,
                user_id: this.data.user_id,
                search_key: this.data.search_key,
                session_id: session_id
            };

        app.request(app.api.getSellerCustomerUrl, params, function (res) {
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