// app entry point
// se importa express
const { json } = require('express')
const express = require('express')
// contraseña mongo 3FBUZCkVp2AitsbW
// se crea una instancia de express
const app = express()
const mongoose = require('mongoose')
// puerto a usar por la app
const PORT = procces.env.PORT || 5000
const { MONGOURI } = require('./config/keys')

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})

mongoose.connection.on('connected', () => {
    console.log('Conectado a Mongo')
})

mongoose.connection.on('error', (err) => {
    console.log('error ', err)
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"))
    const path = require('path')
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

// la app se pone a la escucha en el puerto
app.listen(PORT, () =>{
    console.log('The app is running on: ', PORT)
})
