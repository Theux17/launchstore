const Cart = require('../../lib/cart')

const LoadProducsSevices = require('../services/LoadProductServices')

module.exports = {
    async index(req, res) {
        try {
            const product = await LoadProducsSevices.load('product', { where: { id:  1  } } )
            let { cart } = req.session

            //gerenciador de carrinho
            cart =  Cart.init(cart).addOne(product)

            return res.render("cart/index", { cart })
        } catch (error) {
            console.error(error)
        }
    }
}