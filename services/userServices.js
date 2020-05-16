const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const fs = require('fs')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '17049fd437d751f'


let userController = {
  getTopUser: (req, res, callback) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {

      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))

      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)

      callback({ users: users })
      // return res.render('topUser', { users: users })
    })
  },
  getUser: (req, res, callback) => {
    return User.findByPk(req.user.id).then((user) => {
      User.findByPk(req.params.id, {
        include: [
          Comment,
          { model: Comment, include: [Restaurant] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Restaurant, as: 'FavoritedRestaurants' }
        ]
      }).then((profile) => {

        const filter = []
        const filterData = []

        profile.Comments.forEach(comment => {
          //給一個陣列把餐廳id設為其index讓他的資料等於他
          //這樣同一個餐廳的資料只會有一個
          filter[comment.Restaurant.id] = comment.Restaurant.dataValues
        }
        )
        // 刪除陣列中無效的值
        filter.forEach(item => {
          if (item) {
            filterData.push(item)
          }
        })

        const img = profile.image
        const isOwner = profile.id === user.id

        callback({ user: user.toJSON(), profile: profile.toJSON(), img: img, filterData: filterData, isOwner: isOwner })
      })
    })
  },
  editUser: (req, res, callback) => {
    return User.findByPk(req.params.id).then((user) => {
      const img = user.image
      callback({ user: user.toJSON(), img: img })
    })
  },

  putUser: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: "name is required!" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error:', err)

        return User.findByPk(req.params.id).then((user) => {
          user.update({
            name: req.body.name,
            image: file ? img.data.link : user.image
          }).then((user) => {
            callback({ status: 'success', message: "profile was successfully updated!", user: user })
          })
        })

      })
    } else {
      return User.findByPk(req.params.id).then((user) => {
        user.update({
          name: req.body.name,
          image: user.image
        }).then((user) => {
          callback({ status: 'success', message: "profile was successfully updated!", user: user })
        })
      })
    }
  },

  addFollowing: (req, res, callback) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        callback({ followship })
      })
  },

  removeFollowing: (req, res, callback) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            callback({ followship })
          })
      })
  },

  addFavorite: (req, res, callback) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        callback()
      })
  },

  removeFavorite: (req, res, callback) => {
    return Favorite.findOne({
      where: { UserId: req.user.id, RestaurantId: req.params.restaurantId }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            callback()
          })
      })
  },

  addLike: (req, res, callback) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then((restaurant) => {
      callback()
    })
  },

  removeLike: (req, res, callback) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        like.destroy()
          .then((restaurant) => {
            callback()
          })
      })
  },
}

module.exports = userController