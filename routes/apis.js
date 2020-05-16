const express = require('express')
const router = express.Router()

//認證程序
const passport = require('../config/passport')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')
const userController = require('../controllers/api/userController.js')
const restController = require('../controllers/api/restController')
const commentController = require('../controllers/api/commentController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

//user
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurant)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants/dashboard/:id', authenticated, restController.getDashBoard)
// user to post comment
router.post('/comments', authenticated, commentController.postComment)
// topUser
router.get('/users/top', authenticated, userController.getTopUser)
// user to get profile
router.get('/users/:id', authenticated, userController.getUser)
// user to get editProfile
router.get('/users/:id/edit', authenticated, userController.editUser)
//user to put profile
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
//user to add follow
router.post('/following/:userId', authenticated, userController.addFollowing)
//user to delete follow
router.delete('/following/:userId', authenticated, userController.removeFollowing)
//user to add favorite
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
//user delete favorite
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

//user to like/unlike
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)




//admin
router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/create', authenticated, authenticatedAdmin, adminController.createRestaurant)
router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRestaurant)
router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories)
router.post('/admin/restaurants', authenticated, authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', authenticated, authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategory)
router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.deleteCategory)
router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)
//admin to get users
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUserList)
//admin to edit users
router.put('/admin/users/:id', authenticated, authenticatedAdmin, adminController.editUserList)
//admin edit page
router.get('/admin/restaurants/:id/edit', authenticated, authenticatedAdmin, adminController.editRestaurant)
//admin to get categories
router.get('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.getCategories)
//admin to delete comments
router.delete('/comments/:id', authenticated, authenticatedAdmin, commentController.deleteComment)



//登入機制
router.post('/signin', userController.signIn)
//註冊
router.post('/signup', userController.signUp)

module.exports = router