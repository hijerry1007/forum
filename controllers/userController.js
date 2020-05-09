const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const fs = require('fs')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    //confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同!')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複!')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號!')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    return res.redirect('/restaurants')
  },

  getUser: (req, res) => {

    if (req.user.id !== Number(req.params.id)) {
      return User.findByPk(req.user.id).then((user) => {
        User.findByPk(req.params.id, {
          include: [
            Comment,
            { model: Comment, include: [Restaurant] }
          ]
        }).then((u) => {
          const img = u.image
          const check = true
          const commentTimes = u.Comments.length

          return res.render('getUser', { user: user.toJSON(), u: u.toJSON(), img: img, check: check, commentTimes: commentTimes })
        })
      })
    } else {
      return User.findByPk(req.params.id, {
        include: [
          Comment,
          { model: Comment, include: [Restaurant] }
        ]
      }).then((user) => {
        const img = user.image
        const commentTimes = user.Comments.length
        return res.render('getUser', { user: user.toJSON(), img: img, commentTimes: commentTimes })
      })
    }
  },

  editUser: (req, res) => {
    return User.findByPk(req.params.id).then((user) => {
      const img = user.image
      res.render('editUser', { user: user.toJSON(), img: img })
    })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name is required!")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error:', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return User.findByPk(req.params.id).then((user) => {
            user.update({
              name: req.body.name,
              image: file ? `/upload/${file.originalname}` : null
            }).then((user) => {
              req.flash('success_messages', 'profile was successfully updated!')
              return res.redirect(`/users/${user.id}`)
            })
          })
        })
      })
    } else {
      return User.findByPk(req.params.id).then((user) => {
        user.update({
          name: req.body.name,
          image: user.image
        }).then((user) => {
          req.flash('success_messages', 'profile was successfully updated!')
          return res.redirect(`/users/${user.id}`)
        })
      })
    }
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: { UserId: req.user.id, RestaurantId: req.params.restaurantId }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then((restaurant) => {
      return res.redirect('back')
    })
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        like.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },

  getTopUser: (req, res) => {
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

      return res.render('topUser', { users: users })
    })
  },

  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  }

}

module.exports = userController