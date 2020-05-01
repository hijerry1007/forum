const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController')


module.exports = (app, passport) => {

  // user to get home page
  app.get('/', (req, res) => res.redirect('/restaurants'))
  // get /restaurants by restController.getRestaurants
  app.get('/restaurants', restController.getRestaurants)

  //admin to /admin/restaurants route
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))

  //get admin/restaurants by adminController.getRestaurants
  app.get('/admin/restaurants', adminController.getRestaurants)

  //get signup page
  app.get('/signup', userController.signUpPage)

  //post signup user data
  app.post('/signup', userController.signUp)

  //auth user and sign in
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

}