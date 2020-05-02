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
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  //新增
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    return Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description
    })
      .then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
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