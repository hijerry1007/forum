const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
const Favorite = db.Favorite

const pageLimit = 10

let restController = {

  getRestaurants: (req, res, callback) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit }).then(result => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id),
        categoryName: r.Category.name
      }))
      Category.findAll({ raw: true, nest: true }).then(categories => {
        callback({
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
  },

  getFeeds: (req, res, callback) => {
    return Restaurant.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then((restaurants) => {
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then(comments => {
        callback({ restaurants: restaurants, comments: comments })
      })
    })
  },
  getTopRestaurant: (req, res, callback) => {
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    }).then((restaurants) => {

      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.description ? restaurant.description.substring(0, 50) : null,
        isFavorited: restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id),
        favoritedCount: restaurant.FavoritedUsers.length
      })
      )

      restaurants = restaurants.sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)

      callback({ restaurants: restaurants })
    })
  },
  //get one 
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: Comment, include: [User] },
        { model: User, as: 'LikedUsers' }
      ]
    }).then(restaurant => {

      restaurant.update({
        viewCounts: restaurant.viewCounts + 1
      })
        .then((restaurant) => {
          const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
          const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)

          callback({
            restaurant: restaurant.toJSON(),
            isFavorited: isFavorited,
            isLiked: isLiked
          })
        })
    })
  },
  // dashboard
  getDashBoard: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        Comment
      ]
    }).then(restaurant => {

      const commentTimes = restaurant.Comments.length

      callback({ restaurant: restaurant.toJSON(), commentTimes: commentTimes })
    })
  },
}

module.exports = restController