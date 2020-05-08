const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })


module.exports = (app, passport) => {

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
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  // get /restaurants by restController.getRestaurants
  app.get('/restaurants', authenticated, restController.getRestaurants)
  // user get one rest
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)
  // user to post comment
  app.post('/comments', authenticated, commentController.postComment)

  //admin to get users
  app.get('/admin/users', authenticatedAdmin, adminController.getUserList)
  //admin to edit users
  app.put('/admin/users/:id', authenticatedAdmin, adminController.editUserList)

  //admin to /admin/restaurants route
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

  //get admin/restaurants by adminController.getRestaurants
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  //admin create page
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  //admin create action
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  //admin get one restaurant
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  //admin edit page
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  //admin edit action
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  //admin delete action
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  //admin to get categories
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  //admin to post categories
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  //admin to put categories
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)

  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  //admin to delete categories
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  //get signup page
  app.get('/signup', userController.signUpPage)

  //post signup user data
  app.post('/signup', userController.signUp)

  //auth user and sign in
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

}