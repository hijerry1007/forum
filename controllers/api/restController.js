const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
const Favorite = db.Favorite
const restServices = require('../../services/restServices')

let restController = {
  getRestaurants: (req, res) => {
    restServices.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },

  getFeeds: (req, res) => {
    restServices.getFeeds(req, res, (data) => {
      return res.json(data)
    })
  },
  getTopRestaurant: (req, res) => {
    restServices.getTopRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  getRestaurant: (req, res) => {
    restServices.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  getDashBoard: (req, res) => {
    restServices.getDashBoard(req, res, (data) => {
      return res.json(data)
    })
  },
}

module.exports = restController