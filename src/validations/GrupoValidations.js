const { body } = require('express-validator')

const GrupoValidationRules = () => {
    return [
        body('nome').isLength({max: 15, min: 3}).withMessage('O nome do grupo não pode ter menos do que 3 ou mais do que 15 caracteres.')
        
    ]
}

module.exports = {
    GrupoValidationRules
}