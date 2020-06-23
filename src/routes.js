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

routes.post('/login', LoginController.geraToken)

routes.get('/grupo', /* auth, */ GrupoController.index)
routes.get('/grupo/:usuario', /* auth, */ GrupoController.getByUser)

routes.post('/grupo', /* auth,  */GrupoValidationRules(), validate, GrupoController.create)
routes.put('/grupo', /* auth, */ GrupoValidationRules(), validate, GrupoController.edit)
routes.get('/grupo/:_id', /* auth, */ GrupoController.getOne)
routes.delete('/grupo/:_id', /* auth, */ GrupoController.delete)
routes.post('/grupo/add/:_idGroup/:usuario', /* auth, */ GrupoController.addNewMember)
routes.post('/grupo/remove/:_idGroup/:usuario', /* auth, */ GrupoController.removeMember)
routes.post('/grupo/draw/:_idGroup', auth, GrupoController.draw)

routes.get('/pessoa', /* auth, */ PessoaController.index)
routes.post('/pessoa', /* auth, */ PessoaValidationRules(), validate, PessoaController.create)
routes.put('/pessoa', /* auth,  */PessoaValidationRules(), validate, PessoaController.edit)
routes.get('/pessoa/:usuario', /* auth, */ PessoaController.getOne)
routes.delete('/pessoa/:usuario', /* auth, */ PessoaController.delete)
routes.post('/pessoa/add/:MeuUsuario/:FriendUsuario', /* auth, */ PessoaController.addNewFriend)
routes.post('/pessoa/remove/:MeuUsuario/:FriendUsuario', /* auth, */ PessoaController.removeFriend)

module.exports = routes