const { Router } = require('express')

const GrupoController = require('./controllers/GrupoController')
const PessoaController = require('./controllers/PessoaController')
const LoginController = require('./controllers/LoginController')

const auth = require('./middleware/auth')
const { validate } = require('./middleware/validator')
const { GrupoValidationRules } = require('./validations/GrupoValidations')
const { PessoaValidationRules } = require('./validations/PessoaValidations')

const routes = Router()

//---------------------ROTAS--------------------

routes.post('/token', LoginController.geraToken)

routes.get('/grupo', auth, GrupoController.index)
routes.post('/grupo', auth, GrupoValidationRules(), validate, GrupoController.create)
routes.put('/grupo', auth, GrupoValidationRules(), validate, GrupoController.edit)
routes.get('/grupo/:_id', auth, GrupoController.getOne)
routes.delete('/grupo/:_id', auth, GrupoController.delete)
routes.post('/grupo/add/:_idGroup/:Nick', auth, GrupoController.addNewMember)
routes.post('/grupo/remove/:_idGroup/:Nick', auth, GrupoController.removeMember)
routes.post('/grupo/draw/:_idGroup', auth, GrupoController.draw)

routes.get('/pessoa', auth, PessoaController.index)
routes.post('/pessoa', auth, PessoaValidationRules(), validate, PessoaController.create)
routes.put('/pessoa', auth, PessoaValidationRules(), validate, PessoaController.edit)
routes.get('/pessoa/:Nick', auth, PessoaController.getOne)
routes.delete('/pessoa/:Nick', auth, PessoaController.delete)
routes.post('/pessoa/add/:MyNick/:FriendNick', auth, PessoaController.addNewFriend)
routes.post('/pessoa/remove/:MyNick/:FriendNick', auth, PessoaController.removeFriend)

module.exports = routes