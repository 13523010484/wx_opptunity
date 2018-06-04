var app = getApp();
var reqList = [];

function get_data(that) {
    var $this = that
    var session_id = wx.getStorageSync('sessionId');
    var para = {
        session_id: session_id,
        page: $this.data.page,
        size: $this.data.size,
        vt: $this.data.vt,
    }
    app.request(app.api.opptunityListUrl, para, function (res) {
        reqList = res.data.list;
        if (res.code == 200) {
            $this.setData({
                lodeMore: false,
                hasLoading: true,
                total: res.data.total,
                list: $this.data.list.concat(res.data.list)
            })
        }
        console.log(reqList);
        wx.hideLoading()
    })
}
Page({
    data: {
        vt: '',
        page: 1,
        size: 15,
        total: '',
        list: [],
        hasLoading: false,
        lodeMore: false
    },

    // 页面onLoad
    onLoad: function () {
        var session_id = wx.getStorageSync('sessionId');
        if (session_id) {
            wx.showLoading({
                title: '加载中...',
            })
            get_data(this);
        } else {
            wx.redirectTo({
                url: '/page/getUserInfo/getUserInfo',
            })
        }
    },

    // tab切换时更新数据
    changeTag: function (vt) {
        wx.showLoading({
            title: '切换中...',
        })
        this.setData({
            list: [],
            page: 1,
            lodeMore: false,
            hasLoading: false,
            total: this.data.total,
            vt: vt.target.id
        });
        get_data(this);
    },

    // 滑动到底部时，分页加载更多数据
    onReachBottom: function (e) {
        let page = this.data.page + 1;
        if (reqList.length > 0) {
            this.setData({
                page: page,
                lodeMore: this.data.list.length > 0 ? true : false
            });
            get_data(this);
        }
    }

})