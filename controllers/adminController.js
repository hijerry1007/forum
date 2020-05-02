const db = require('../models')
const Restaurant = db.Restaurant


const adminController = {

  // 瀏覽所有
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants: restaurants })
    })
  },

  //瀏覽一筆
  getRestaurant: (req, res) => {

  },

  //get 表單 新增
  createRestaurants: (req, res) => {

  },

  //新增
  postRestaurants: (req, res) => {

  },

  //get 編輯
  editRestaurant: (req, res) => {

  },

  //編輯
  putRestaurant: (req, res) => {

  },

  //移除
  deleteRestaurant: (req, res) => {

  }

}


module.exports = adminController