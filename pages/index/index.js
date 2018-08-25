//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
var config = require('../config');
Page({
  data: {
    motto: '欢迎使用心签说',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindToMineTap: function() {
    wx.navigateTo({
      url: '../mine/records/record'
    })
  },
  //事件处理函数
  bindToCreateTap: function () {
    wx.navigateTo({
      url: '../record/create/create'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.saveUserInfo(res.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
  ,
  saveUserInfo: function (userInfo) {
    util.showBusy('请求中...')
    var that = this
    wx.request({
      url: `${config.service.host}/webapi/minpro/user/save`,
      data: userInfo,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (result) {
        util.showSuccess('请求成功完成')
        that.setData({
          requestResult: JSON.stringify(result.data)
        })
      },
      fail: function (error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  // 用户登录示例
  bindUserInfo: function () {
    if (this.data.logged) return

    util.showBusy('正在登录')

    const session = loginService.Session.get()
    loginService.setLoginUrl(config.service.loginUrl)
    if (session) {
      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      loginService.loginWithCode({
        success: res => {
          app.globalData.userInfo = e.detail.userInfo
          this.setData({ userInfo: res, logged: true, hasUserInfo: true })
          util.showSuccess('登录成功')
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    } else {
      // 首次登录
      loginService.login({
        success: res => {
          app.globalData.userInfo = e.detail.userInfo
          this.setData({ userInfo: res, logged: true, hasUserInfo: true })
          util.showSuccess('登录成功')
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    }
  },

  // 切换是否带有登录态
  switchRequestMode: function (e) {
    this.setData({
      takeSession: e.detail.value
    })
    this.doRequest()
  },

  doRequest: function () {
    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.requestUrl,
      login: true,
      success(result) {
        util.showSuccess('请求成功完成')
        console.log('request success', result)
        that.setData({
          requestResult: JSON.stringify(result.data)
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    }
    if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
      qcloud.request(options)
    } else {    // 使用 wx.request 则不带登录态
      wx.request(options)
    }
  },
})
