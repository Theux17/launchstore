const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user && password != "") return res.render("session/login", {
        user: req.body,
        error: "Usuário não cadastrado!"
    })

    if (!password) return res.render("session/login", {
        user: req.body,
        error: "Digite a senha para entrar na sua conta."
    })

    const passed = await compare(password, user.password)

    if (!passed) return res.render("session/login", {
        user: req.body,
        error: "A senha está incorreta!"
    })

    req.user = user

    next()

}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        let user = await User.findOne({ where: { email } })

        if (!user) return res.render("session/forgot-password", {
            user: req.body,
            error: "Email não cadastrado!"
        })

        req.user = user

        next()
    } catch (err) {
        console.error(error)
    }
}

async function reset(req, res, next) {
    const { email, password, token, passwordRepeat } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) return res.render("session/password-reset", {
        user: req.body,
        token,
        error: "Usuário não cadastrado!"
    })
    
    // ver se a senha bate
    if (password != passwordRepeat) return res.render("session/password-reset", {
        user: req.body,
        token,
        error: "A senha e a repetição da senha estão incorretas!"
    })
    
    // verificar se o token bate
    if (token != user.reset_token) return res.render("session/password-reset", {
        user: req.body,
        token,
        error: "Token inválido! Solicite uma nova soliciação de senha."
    })

    // verificar se o token não expirou
    let now = new Date
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) return res.render("session/password-reset", { 
        user: req.body,
        token,
        error: "Token expirado! Solicite uma nova recuperação de senha."
    })


    req.user = user

    next()

}


module.exports = {
    login,
    forgot,
    reset
}