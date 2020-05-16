const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
const Favorite = db.Favorite
const restServices = require('../services/restServices')

const pageLimit = 10

let restController = {

  getRestaurants: (req, res) => {
    restServices.getRestaurants(req, res, (data) => {
      return res.render('restaurants', data)
    })
  },

  getRestaurant: (req, res) => {
    restServices.getRestaurant(req, res, (data) => {
      return res.render('restaurant', data)
    })
  },

  getFeeds: (req, res) => {
    restServices.getFeeds(req, res, (data) => {
      return res.render('feeds', data)
    })
  },

  getDashBoard: (req, res) => {
    restServices.getDashBoard(req, res, (data) => {
      res.render('dashboard', data)
    })
  },

  getTopRestaurant: (req, res) => {
    restServices.getTopRestaurant(req, res, (data) => {
      return res.render('topRestaurant', data)
    })
  },
}

module.exports = restController