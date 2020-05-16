const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const userServices = require('../../services/userServices')

//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {
  signIn: (req, res) => {
    console.log(req.body)
    //檢查必要資料
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    let username = req.body.email
    let password = req.body.password

    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'No user infomation found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'password incorrect' })
      }

      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
      return res.json({ status: 'success', message: 'ok', token: token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } })
    })
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同' })
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          return res.json({ status: 'error', message: '信箱重複' })
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return res.json({ status: 'success', message: '成功註冊!' })
          })
        }
      })
    }
  },

  getTopUser: (req, res) => {
    userServices.getTopUser(req, res, (data) => {
      return res.json(data)
    })
  },

  getUser: (req, res) => {
    userServices.getUser(req, res, (data) => {
      return res.json(data)
    })
  },

  editUser: (req, res) => {
    userServices.editUser(req, res, (data) => {
      return res.json(data)
    })
  },

  putUser: (req, res) => {
    userServices.putUser(req, res, (data) => {
      console.log(data)
      if (data['status'] === 'error') {
        return res.json({ status: 'error', message: data['message'] })
      }
      return res.json(data)
    })
  },

  addFollowing: (req, res) => {
    userServices.addFollowing(req, res, (data) => {
      return res.json(data)
    })
  },

  removeFollowing: (req, res) => {
    userServices.removeFollowing(req, res, (data) => {
      return res.json(data)
    })
  },

  addFavorite: (req, res) => {
    userServices.addFavorite(req, res, (data) => {
      return res.json(data)
    })
  },

  removeFavorite: (req, res) => {
    userServices.removeFavorite(req, res, (data) => {
      return res.json(data)
    })
  },

  addLike: (req, res) => {
    userServices.addLike(req, res, (data) => {
      return res.json(data)
    })
  },

  removeLike: (req, res) => {
    userServices.removeLike(req, res, (data) => {
      return res.json(data)
    })
  },

}

module.exports = userController