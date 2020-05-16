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
    return User.findAll({ raw: true, nest: true }).then(users => {
      return res.render('admin/users', { users: users })
    })
  },
  //修改使用者清單
  editUserList: (req, res) => {

    return User.findByPk(req.params.id).then(user => {

      user.update({
        isAdmin: !user.isAdmin
      })
        .then((user) => {
          if (req.user.id === user.id) {
            if (!user.isAdmin) {
              req.flash('success_messages', "your adminitration will be no longer existing!")
              return res.redirect('/signin')
            }
            else {
              req.flash('success_messages', 'user was successfully updated')
              return res.redirect('/admin/users')
            }
          } else {
            console.log(req.user)
            req.flash('success_messages', 'user was successfully updated')
            return res.redirect('/admin/users')
          }
        })

    })

  },

  //get 表單 新增
  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', {
        categories: categories
      })
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
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', {
          categories: categories,
          restaurant: restaurant.toJSON()
        })
      })
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