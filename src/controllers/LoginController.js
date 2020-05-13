const Pessoa = require('../models/Pessoa');
const jwt = require('jsonwebtoken')

module.exports = {
    async geraToken(request, response) {

        let { usuario, senha } = request.body;
        const UsuarioRetorno = await Pessoa.findOne({ usuario: usuario, senha: senha });
        if (UsuarioRetorno === null)
            return response.send({ auth: false, token: null })
        else {
            const token = jwt.sign({ _id: UsuarioRetorno._id, senha: UsuarioRetorno.senha }, process.env.JWT_KEY, { expiresIn: 1000 });
            return response.send({ auth: true, token: token });
        }
    }
}