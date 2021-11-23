const express = require('express')
const mongoose = require('mongoose')
const { MONGOURI } = require('./config/keys')

require('./models/user')
require('./models/post')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*", (req, res) => {
        return res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log('Connected TO mongo')
})

mongoose.connection.on('error', (err) => {
    console.log('Error:', err)
})

app.listen(PORT, () => {
    console.log(`Listen to port ${PORT}`)
})