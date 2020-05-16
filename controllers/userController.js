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

const userServices = require('../services/userServices')

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
    userServices.getUser(req, res, (data) => {
      return res.render('getUser', data)
    })
  },

  editUser: (req, res) => {
    userServices.editUser(req, res, (data) => {
      res.render('editUser', data)
    })
  },

  putUser: (req, res) => {
    userServices.putUser(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect(`/users/${data['user'].id}`)
    })
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },

  addFavorite: (req, res) => {
    userServices.addFavorite(req, res, (data) => {
      return res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    userServices.removeFavorite(req, res, (data) => {
      return res.redirect('back')
    })
  },

  addLike: (req, res) => {
    userServices.addLike(req, res, (data) => {
      return res.redirect('back')
    })
  },

  removeLike: (req, res) => {
    userServices.removeLike(req, res, (data) => {
      return res.redirect('back')
    })
  },

  getTopUser: (req, res) => {
    userServices.getTopUser(req, res, (data) => {
      return res.render('topUser', data)
    })
  },

  addFollowing: (req, res) => {
    userServices.addFollowing(req, res, (data) => {
      return res.redirect('back')
    })
  },

  removeFollowing: (req, res) => {
    userServices.removeFollowing(req, res, (data) => {
      return res.redirect('back')
    })
  }

}

module.exports = userController