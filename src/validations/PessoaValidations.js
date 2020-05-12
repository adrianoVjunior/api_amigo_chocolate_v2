const { body } = require('express-validator')

const PessoaValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Email inválido.'),
        body('descricao').isLength({max: 100}).withMessage('A descrição não pode ter mais do que 100 caracteres.')
    ]
}

module.exports = {
    PessoaValidationRules
}