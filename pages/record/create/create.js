// pages/record/create/create.js
const app = getApp()
var config = require('../../config');
var util = require('../../../utils/util.js')

var params = {};
Page({
  data: {
    backGroundImg: '',
    receiverName:'',
    loveWish:'',
    sendName:'',
    afterCreateImg: ''
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  formSubmit: function (e) {
    var id = e.target.id;
    params = e.detail.value; 
    this.submit()
  },

  submit: function () {
    var that = this
    console.log(params)
    wx.uploadFile({
      url: config.service.uploadUrl,
      filePath: that.data.backGroundImg,
      name: 'wish',
      formData: {
        content: params,
        userInfo: app.globalData.userInfo
      },
      success: function (res) {
        console.log(res)
        if (res) {
          wx.showToast({
            title: '已提交发布！',
            duration: 3000
          });
        }
      },
      fail: function (e) {
        util.showModel('发布失败',e)
      }
    })
  },
  upimg: function () {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var filePath = res.tempFilePaths[0]
        that.setData({
          backGroundImg: filePath,
        })
      },
      fail: function (e) {
        console.error(e)
      }
    })
  },

  // 预览图片
  previewImg: function () {
    wx.previewImage({
      current: this.data.afterCreateImg,
      urls: [this.data.afterCreateImg]
    })
  },
})