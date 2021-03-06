const db = require('../models')
const Comment = db.Comment
const commentServices = require('../services/commentServices')

let commentController = {
  postComment: (req, res) => {
    commentServices.postComment(req, res, (data) => {
      res.redirect(`/restaurants/${req.body.restaurantId}`)
    })
  },

  deleteComment: (req, res) => {
    commentServices.deleteComment(req, res, (data) => {
      res.redirect(`/restaurants/${data['comment'].RestaurantId}`)
    })
  }
}

module.exports = commentController