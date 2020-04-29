const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')


module.exports = app => {

  // user to get home page
  app.get('/', (req, res) => res.redirect('/restaurants'))
  // get /restaurants by restController.getRestaurants
  app.get('/restaurants', restController.getRestaurants)

  //admin to /admin/restaurants route
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))

  //get admin/restaurants by adminController.getRestaurants
  app.get('/admin/restaurants', adminController.getRestaurants)

}