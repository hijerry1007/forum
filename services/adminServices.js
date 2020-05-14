const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '17049fd437d751f'


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
  }
}

module.exports = adminService