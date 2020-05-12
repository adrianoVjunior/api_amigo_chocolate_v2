const Pessoa = require('../models/Pessoa');
const jwt = require('jsonwebtoken')

module.exports = {
    async geraToken(request, response){

        let { apelido, senha } = request.body;
        const UsuarioRetorno = await Pessoa.findOne({ apelido : apelido, senha: senha});
        // eslint-disable-next-line no-undef
        const token = jwt.sign({_id: UsuarioRetorno._id, senha: UsuarioRetorno.senha}, process.env.JWT_KEY, { expiresIn: 1000 });
        return response.send({auth : true,  token : token});
    }
}