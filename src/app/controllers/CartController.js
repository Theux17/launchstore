const Cart = require('../../lib/cart')

const LoadProducsSevices = require('../services/LoadProductServices')

module.exports = {
    async index(req, res) {
        try {
            let { cart } = req.session

            //gerenciador de carrinho
            cart =  Cart.init(cart)

            return res.render("cart/index", { cart })
        } catch (error) {
            console.error(error)
        }
    },

    async addOne(req, res){
        // pegar o id do produto e o produto
        const { id } = req.params

        const product = await LoadProducsSevices.load('product', { where: { id }})

        // pegar o carrinho da sessão
        let { cart } = req.session

        // adicionar o produto ao carrinho (usando o gerenciador de carrinho)
        cart = Cart.init(cart).addOne(product)

        // atualizar o carrinho da sessão
        req.session.cart = cart

        // redirecionar o usuário para a tela do carrinho
        return res.redirect('/cart')
    },

    removeOne(req, res){
        // pegar o id do produto
        let { id } = req.params
        
        // pegar o carrinho da sessão
        let { cart } = req.session

        // se não tiver carrinho, retornar
        if(!cart) return redirect('/cart')

        // Iniciar o carrinho (gerenciador de carrinho ) e remover
        cart = Cart.init(cart).removeOne(id)

        // atualizar o carrinho da sessão, removendo 1 item
        req.session.cart = cart

        // redirecionar para a página cart
        return res.redirect('/cart')
    }
}