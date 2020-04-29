const restController = require('../controllers/restController.js')

module.exports = app => {

  // user to get home page
  app.get('/', (req, res) => res.redirect('/restaurants'))

  // get /restaurants by restController.getRestaurants

  app.get('/restaurants', restController.getRestaurants)

}