const LoadProductService = require('../services/LoadProductServices')
const LoadOrderService = require('../services/LoadOrderService')

const User = require('../models/User')
const Order = require('../models/Order')

const mailer = require('../../lib/mailer')
const Cart = require('../../lib/cart')


const email = (seller, product, buyer) => `
    <h2>Olá ${seller.name}</h2>
    <p>Você tem um novo pedido de compra do seu produto.</p>
    <p>Produto: ${product.name}</p>
    <p>Preço: ${product.formattedPrice}</p>
    <p><br/><br/></p>

    <h3>Dados do comprador</h3>
    <p>Nome: ${buyer.name}</p>
    <p>Email: ${buyer.email}</p>
    <p>Endereço: ${buyer.address}</p>
    <p>${buyer.cep}</p>
    <p><br/><br/></p>
    <p><strong>Entre em contado com o comprador, para finalizar a venda!</strong></p>
    <p><br/><br/></p>
    <p>Atenciosamente, Equipe Launchstore.</p>
`

module.exports = {
    async index(req, res){
        // pegar os pedidos do usuário
        const orders = await LoadOrderService.load('orders', { where: { buyer_id: req.session.userId } })

        return res.render("orders/index", { orders })
    },

    async sales(req, res){
        const sales = await LoadOrderService.load('orders', { where: { seller_id: req.session.userId } })

        return res.render("orders/sales", { sales })
    },

    async show(req, res){
        const order = await LoadOrderService.load('order', { where: { id: req.params.id } })
        return res.render("orders/details", { order })
    },

    async post(req, res) {
        try {
            // pegar os produtos do carrinho 
            const cart = Cart.init(req.session.cart)

            const buyer_id = req.session.userId

            // verifico se o item não é do próprio usuário
            const filteredItems = cart.items.filter(item =>
                item.product.user_id != buyer_id
            )

            // criar pedido
            const createOrdersPromise = filteredItems.map(async item => {
                let { product, price: total, quantity } = item
                const { price, id: product_id, user_id: seller_id } = product
                const status = "open"

                const order = await Order.create({
                    seller_id,
                    buyer_id,
                    product_id,
                    price,
                    total,
                    quantity,
                    status
                })

                // pegar os dados do produto
                product = await LoadProductService.load('product', { where: {
                    id: product_id
                }})

                // os dados do vendedor
                const seller = await User.findOne({ where: { id: seller_id } })

                // os dados do comprador
                const buyer = await User.findOne({ where: { id: buyer_id } })

                // enviar o email com os dados da compra para o vendedor
                await mailer.sendMail({
                    to: seller.email,
                    from: 'no-reply@launchstore.com.br',
                    subject: 'Novo pedido de compra',
                    html: email(seller, product, buyer)
                })

                return order
            })

            await Promise.all(createOrdersPromise)

            // clean cart
            delete req.session.cart
            Cart.init()

            // notificar o usuário com alguma mensagem de sucesso 
            return res.render('orders/success')

        } catch (error) {
            // ou erro
            console.error(error)
            return res.render('orders/error')
        }
    },

    async update(req, res){
        try {
            const {id, action } = req.params

            const acceptedActions = ['close', 'cancel']
            // verifica se o oque foi passado no req.params é o mesmo do do array
            if(!acceptedActions.includes(action)) return res.send("Can't do this action")

            // pegar p pedido
            const order = await Order.findOne({ where: { id } })

            if(!order) return res.send('Order not found')

            // verificar se ele está aberto
            if(order.status != "open") return res.send("Can't do this action")

            // atualizar o pedido
            const statuses = {
                close: "sold",
                cancel: "canceled"
            }

            order.status = statuses[action]

            await Order.update(id, {
                status: order.status
            })

            // redirecionar 
            return res.redirect("/orders/sales")

        } catch (error) {
            console.error(error)
        }
    }
}