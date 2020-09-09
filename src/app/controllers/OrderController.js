const LoadProductService = require('../services/LoadProductServices')
const User = require('../models/User')
const Order = require('../models/Order')

const mailer = require('../../lib/mailer')
const Cart = require('../../lib/cart')
const { formatPrice, date} = require('../../lib/utils')


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
        let orders = await Order.findAll({ where: { buyer_id: req.session.userId } }) 
    
        const getOrdersPromise = orders.map(async order => {
            
            // detalhes do produto
            order.product = await LoadProductService.load('product', { where: { id: order.product_id } })
            
            // detalhes do comprador
            order.buyer = await User.findOne({ where: { id: order.buyer_id } })
            
            // detalhes do vendedor
            order.seller = await User.findOne({ where: { id: order.seller_id } })

            // formatação de preço
            order.formattedPrice = formatPrice(order.price)
            order.formattedTotal = formatPrice(order.total)

            // formatação do status
            const statuses = {
                open: "Aberto",
                sold: "Vendido",
                canceled: "Cancelado"
            }

            order.formattedStatus = statuses[order.status]

            // formatação de atualizado em...
            const updatedAt = date(order.updated_at)
            const formattedDate = `${updatedAt.day}/${updatedAt.month}/${updatedAt.year}`
            const updateTime = `${updatedAt.hours}h${updatedAt.minutes}`

            order.formattedUpdatedAt = `${order.formattedStatus} em ${formattedDate} às ${updateTime}`

            return order
        })

        orders = await Promise.all(getOrdersPromise)

        return res.render("orders/index", { orders })
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
    }
}