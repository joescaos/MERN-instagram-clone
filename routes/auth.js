const { request } = require('express')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const requiredLogin = require('../middleware/requiredLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

//

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: "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"
    }
}))

router.post('/signup', (req, res) => {
    const { name , email, password, pic } = req.body
    console.log(req.body)
    if(!email || !password || !name){
        return res.status(422).json({error: "please add all the fields"})
    }
    User.findOne({email: email})
    .then((savedUser) =>{
        if(savedUser){
            return res.status(422).json({error: "User already exists with that email"})
        }
        bcrypt.hash(password, 12)
        .then(hashedpassword => {
            const user = new User({
                email,
                password: hashedpassword,
                name,
                pic
            })
    
            user.save()
            .then(user =>{
                transporter.sendMail({
                    to: user.email,
                    from: "jxexcxo@gmail.com",
                    subject: "Registrado exitosamente",
                    html: "<h1>Bienvenido al clone de instagram creado por Johan Cañas</h1>"
                })
                res.json({message: "saved successfully"})
            })
            .catch(err => {
                console.log(err)
            })
        })
    })
    .catch(err =>{
        console.log(err)
    })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if(!email || !password){
        return res.status(422).json({error: "add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser => {
        if(!savedUser){
            return res.status(422).json({error: "Invalid email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const {_id, name, email, followers, following, pic } = savedUser
                res.json({token, user: _id, name, email, followers, following, pic})
            }
            else {
                return res.status(422).json({error: "Invalid email or password"})
            }
        })
        .catch(err => {
            console.log(err)
        })
    })
})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            console.log(err)
        }

        const token = buffer.toString("hex")
        User.findOne({email: req.body.email})
            .then(user => {
                if(!user){
                    return res.status(422).json({error: "Usuario con encontrado con esa dirección de email"})
                }
                user.resetToken = token
                user.expireDate = Date.now() + 3600000
                user.save().then(result => {
                    transporter.sendMail({
                        to: user.email,
                        from: "jxexcxo@gmail.com",
                        subject: "Solicitud de nueva contraseña",
                        html: `
                            <p>Solicitaste cambiar la contraseña</p>
                            <h5>Haz click en este <a href="http//localhost:3000/reset/${token}">link</a> para tu cambio de contraseña</h5>
                        `
                    })
                    res.json({message: "Verifica tu email"})
                })
            })
    })
})

router.post('/newpassword', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken: sentToken, expireToken: {$gt:Date.now()}})
        .then(user => {
            if(!user){
                return res.status(422).json({error: "Token expirado, intenta de nuevo"})
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireDate = undefined
                user.save().then(saveduser => {
                    res.json({message: "Contraseña actualizada correctamente"})
                })
            })
        }).catch(err =>{
            console.log(err)
        })
})



module.exports = router