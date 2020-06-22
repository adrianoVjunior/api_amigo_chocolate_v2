const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

const PessoaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    usuario: { type: String, required: true, index: true, unique: true },
    senha: { type: String, required: true },
    amigos: [{
        _id: String,
        nome: String,
        email: String
    }],
    grupos: [{
        _id: String,
        nome: String,
        statusGrupo: String
    }]
})

PessoaSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Pessoa', PessoaSchema)


