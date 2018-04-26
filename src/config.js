/**
 * 小程序配置文件
 */


var host = "http://192.16.8.40:8081"


var config = {

    // 下面的地址配合云端 Server 工作
    host: host,

    // 检测接口是否有unionId
    unionIdUrl: `${host}/app/common?act=wx_code_login`,

    // 获取登录状态
    userLoginUrl: `${host}/app/common?act=wx_manager_app_user_login`,

    // 获取营销机会列表
    opptunityListUrl: `${host}/app/user/center?act=get_my_marketing_opportunity_list`,

    // 获取营销机会列表详情
    opptunityListDetailUrl: `${host}/app/user/center?act=get_mo_details`,

    // 检测手机号
    checkMobileUrl: `${host}/app/user/center?act=check_mo_phone`,

    // 获取年龄层
    getAgeLayerUrl: `${host}/app/user/center?act=get_dict_list`,

    // 获取联合销售员列表
    getGroupUserUrl: `${host}/app/user/center?act=get_group_users`,

    // 获取认知途径
    getKnowWaysUrl: `${host}/app/common?act=get_cognitive_approach_items`,

    // 上传数据
    uploadUrl: `${host}/app/user/center?act=upload_mo_data`,

    // 获取跟进记录
    followRecordUrl: `${host}/app/user/center?act=get_opportunity_return_call_list`,

    // 获取绑定用户列表
    getLoginListUrl: `${host}/app/common?act=get_bind_user_list`,

    // 账户切换的登录接口
    getAccountListUrl: `${host}/app/common?act=change_user_login`

};

module.exports = config