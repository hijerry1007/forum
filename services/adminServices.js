const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '17049fd437d751f'

const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')

const adminService = {
  // 瀏覽所有
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      callback({ restaurants: restaurants })
    })
  },

  //瀏覽一筆
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then(restaurant => {
      callback({ restaurant: restaurant.toJSON() })
    })
  },
  //get 表單 新增
  createRestaurant: (req, res, callback) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      callback({ categories: categories })
    })
  },
  //新增
  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({
        status: 'error', message: "name didn't exist"
      })
    }

    const { file } = req

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).then((restaurant) => {
          callback({
            status: 'success', message: "restaurant was successfully created"
          })
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      })
        .then((restaurant) => {
          callback({
            status: 'success', message: "restaurant was successfully created"
          })
        })
    }
  },

  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
              .then((restaurant) => {
                callback({ status: 'success', message: "restaurant was successfully to update" })
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
            .then((restaurant) => {
              callback({ status: 'success', message: "restaurant was successfully to update" })
            })
        })
    }

  },

  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            callback({ status: 'success', message: '' })
          })
      })
  },

  //get 使用者清單
  getUserList: (req, res, callback) => {
    return User.findAll({ raw: true, nest: true }).then(users => {
      callback({ users: users })
    })
  },

  editUserList: (req, res, callback) => {

    return User.findByPk(req.params.id).then(user => {

      user.update({
        isAdmin: !user.isAdmin
      })
        .then((user) => {
          if (req.user.id === user.id) {
            if (!user.isAdmin) {
              callback({ status: 'success', message: "your adminitration will be no longer existing!", user })
            }
            else {
              callback({ status: 'success', message: 'user was successfully updated' })
            }
          } else {
            callback({ status: 'success', message: 'user was successfully updated' })
          }
        })

    })

  },

  //get 編輯
  editRestaurant: (req, res, callback) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        callback({
          categories: categories,
          restaurant: restaurant.toJSON()
        })
      })
    })
  },
}

module.exports = adminService