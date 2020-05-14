const Pessoa = require('../models/Pessoa')
const {
    generic,
    validationError,
    addFriendError,
    alreadyFriend,
    invalidUsuario,
    nickNotFound,
    missingInformations } = require('../utils/error')

module.exports = {
    index(request, response) {

        const { page = 1 } = request.query;

        Pessoa.paginate(request.body, { page, limit: 10 }, (err, res) => {

            if (err) {
                return response.status(500).json({ ...generic, _message: err.message })
            }
            else if (!res || res.length === 0) {
                return response.status(404).json(res)
            }

            return response.send(res)
        })
    },

    getOne(request, response) {
        let { usuario } = request.params

        Pessoa.findOne({ usuario: usuario }, (err, res) => {
            if (err || !res) {
                return response.status(404).json({})
            }

            return response.json(res)
        })
    },

    async create(request, response) {
        let { usuario } = request.body;
        const UsuarioRetorno = await Pessoa.findOne({ usuario: usuario });
        if (UsuarioRetorno === null) {
            const createResponse = await Pessoa.create(request.body)
            return response.send(createResponse);
        }
        else {
            return response.status(400).json({ message: "Usuário já cadastrado" });
        }
    },

    edit(request, response) {

        let { _id } = request.body
        if (!_id) {
            return response.status(400).json({ ...missingInformations, _id: "ID" })
        }

        delete request.body._id
        delete request.body.__v
        delete request.body.amigos
        delete request.body.grupos

        Pessoa.findByIdAndUpdate(_id, request.body, { new: true }, (err, res) => {
            if (err) {
                return response.status(400).json({
                    ...generic,
                    _message: err.message
                })
            }
            else if (!res) {
                return response.status(404).json({})
            }

            return response.send(res)
        })
    },

    delete(request, response) {
        let { Usuario } = request.params

        Pessoa.findOneAndDelete({ usuario: Usuario }, async (err, res) => {
            if (err) {
                return response.status(400).json({
                    ...missingInformations,
                    apelido: "apelido",
                    _message: err.message
                })
            }

            if (!res) {
                return response.status(404).json({})
            }

            await Pessoa.updateMany({}, { "$pull": { "amigos": { "apelido": Nick } } })

            response.send()
        })
    },

    async addNewFriend(request, response) {

        let { MyNick, FriendNick } = request.params

        const Me = await Pessoa.findOne({ usuario: MyNick })
        const Friend = await Pessoa.findOne({ usuario: FriendNick })

        if (!Friend || !Me) {
            return response.status(404).json({
                ...nickNotFound,
                FriendNick: FriendNick,
                MyNick: MyNick
            })
        }

        const isAlreadyFriend = await Pessoa.findOne({ apelido: MyNick, amigos: { "$elemMatch": { "apelido": FriendNick } } })

        if (!isAlreadyFriend || isAlreadyFriend.length === 0) {
            const Updated = await Pessoa.findOneAndUpdate({ apelido: MyNick }, { "$push": { "amigos": Friend } }, { new: true })
            const FriendUpdated = await Pessoa.findOneAndUpdate({ apelido: FriendNick }, { "$push": { "amigos": Me } }, { new: true })

            if (!Updated || !FriendUpdated) {
                return response.status(400).json({
                    ...addFriendError,
                    MyNick: MyNick,
                    FriendNick: FriendNick
                })
            }

            return response.send(Updated)
        }

        else {
            return response.status(400).json({ ...alreadyFriend })
        }
    },

    async removeFriend(request, response) {
        let { MyNick, FriendNick } = request.params

        const MeUpdated = await Pessoa.findOneAndUpdate({ apelido: MyNick }, { "$pull": { "amigos": { "apelido": FriendNick } } }, { new: true })
        const FriendUpdated = await Pessoa.findOneAndUpdate({ apelido: FriendNick }, { "$pull": { "amigos": { "apelido": MyNick } } }, { new: true })

        if (!MeUpdated || !FriendUpdated) {
            return response.status(404).json({ ...nickNotFound, MyNick: MyNick, FriendNick: FriendNick })
        }

        return response.send(MeUpdated)

    }
}
