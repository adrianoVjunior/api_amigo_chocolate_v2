const { body } = require('express-validator')

const PessoaValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Email inválido.'),
    ]
}

module.exports = {
    PessoaValidationRules
}