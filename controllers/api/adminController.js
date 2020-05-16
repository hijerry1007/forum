const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category
const adminService = require('../../services/adminServices')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.json(data)
    })
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.json(data)
    })
  },
  //get 表單 新增
  createRestaurant: (req, res) => {
    adminService.createRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  getUserList: (req, res) => {
    adminService.getUserList(req, res, (data) => {
      return res.json(data)
    })
  },

  //修改使用者清單
  editUserList: (req, res) => {
    adminService.editUserList(req, res, (data) => {
      if (data['message'] === "your adminitration will be no longer existing!") {
        return res.json(data)
      }
      return res.json(data)
    })
  },

  //get 編輯
  editRestaurant: (req, res) => {
    adminService.editRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
}

module.exports = adminController