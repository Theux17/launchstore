const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    const { email, password } = req.body

    const user = await User.findOne({ where: {email} })

    if(!user && password != "") return res.render("session/login", {
        user: req.body,
        error: "Usuário não cadastrado!"
    })

    if(!password) return res.render("session/login", {
        user: req.body,
        error: "Digite a senha para entrar na sua conta."
    })
    
    const passed = await compare(password, user.password)

    if(!passed) return res.render("session/login", {
        user: req.body,
        error: "A senha está incorreta!"
    })

    req.user = user

    next()

}

module.exports = { 
    login 
}