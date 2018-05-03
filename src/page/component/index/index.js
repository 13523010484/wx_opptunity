Page({
    data: {
    },
    onLoad: function () {
    },
    client: function () {
        wx.navigateTo({
            url: '/page/component/client/client'
        })
    },
    opptunity: function () {
        wx.navigateTo({
            url: '/page/component/opptunity/opptunity'
        })
    },

    // 兼容性测试
    test: function(){
        console.log('canIuse');
        wx.canIUse()
    }
})