const express = require('express')
const routes = express.Router()

const CartController = require('../app/controllers/CartController')

// login / logout
routes.get('/', CartController.index)
    .post('/:id/add-one', CartController.addOne)

module.exports = routes