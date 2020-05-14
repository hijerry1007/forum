const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })




const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) { return next() }
    res.redirect('/')
  }
  res.redirect('/signin')
}

// user to get home page
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
// get /restaurants by restController.getRestaurants
router.get('/restaurants', authenticated, restController.getRestaurants)
//get feeds
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
//user to getTopRestaurant
router.get('/restaurants/top', authenticated, restController.getTopRestaurant)
// user get one rest
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
//user get rest dashboard
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
router.delete('/following/:userId', authenticated, userController.removeFollowing)

//user to add favorite
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

//user to like/unlike
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

//admin to get users
router.get('/admin/users', authenticatedAdmin, adminController.getUserList)
//admin to edit users
router.put('/admin/users/:id', authenticatedAdmin, adminController.editUserList)

//admin to /admin/restaurants route
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

//get admin/restaurants by adminController.getRestaurants
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

//admin create page
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
//admin create action
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
//admin get one restaurant
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
//admin edit page
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
//admin edit action
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
//admin delete action
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

//admin to get categories
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
//admin to post categories
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
//admin to put categories
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)

router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
//admin to delete categories
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

//admin to delete comments
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

//get signup page
router.get('/signup', userController.signUpPage)

//post signup user data
router.post('/signup', userController.signUp)

//auth user and sign in
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

module.exports = router