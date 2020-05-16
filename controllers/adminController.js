const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '17049fd437d751f'
const adminService = require('../services/adminServices')

const adminController = {

  // 瀏覽所有
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  //瀏覽一筆
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.render('admin/restaurant', data)
    })
  },

  //get 使用者清單
  getUserList: (req, res) => {
    adminService.getUserList(req, res, (data) => {
      return res.render('admin/users', data)
    })
  },
  //修改使用者清單
  editUserList: (req, res) => {
    adminService.editUserList(req, res, (data) => {
      if (data['message'] === "your adminitration will be no longer existing!") {
        req.flash('success_messages', data['message'])
        return res.redirect('/signin')
      }

      req.flash('success_messages', data['message'])
      return res.redirect('/admin/users')
    })
  },

  //get 表單 新增
  createRestaurant: (req, res) => {
    adminService.createRestaurant(req, res, (data) => {
      return res.render('admin/create', data)
    })
  },

  //新增
  postRestaurant: (req, res) => {

    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/restaurants')
    })
  },

  //get 編輯
  editRestaurant: (req, res) => {
    adminService.editRestaurant(req, res, (data) => {
      return res.render('admin/create', data)
    })
  },

  //編輯
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  //移除
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  }
}


module.exports = adminController