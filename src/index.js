const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')

const app = express()

app.use(express.json())
app.use(routes)

// eslint-disable-next-line no-undef
mongoose.connect(process.env.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

app.listen(process.env.PORT || 3333, () => {
    console.log('Aplicação rodando na porta 3333!')
})
