const Grupo = require('../models/Grupo')
const Pessoa = require('../models/Pessoa')
const mongoose = require('mongoose')
const {
    generic,
    validationError,
    alreadyGroupMember,
    missingInformations,
    userNotFound,
    groupNotFound,
    nickNotFound,
    notGroupMember,
    removeAdmin,
    alreadyDraw } = require('../utils/error')

const draw = require('../utils/draw')

module.exports = {
    index(request, response) {

        const { page = 1 } = request.query;

        Grupo.paginate(request.body, { page, limit: 3 }, (err, res) => {

            if (!res || res.length === 0) {
                return response.status(404).json(res)
            }

            if (err) {
                return response.status(500).json({ ...generic, _message: err.message })
            }

            return response.send(res)
        })
    },



    getByUser(request, response) {
        let { usuario } = request.params
        Grupo.find({ 'integrantes.usuario': usuario }, async (err, res) => {
            if (err) {
                return response.status(400).json({
                    ...missingInformations,
                    usuario: "usuario",
                    _message: err.message
                })
            }
            if (!res) {
                return response.status(404).json({})
            }
            console.log(res)

            return response.json(res)
        })
    },

    getOne(request, response) {
        let { _id } = request.params

        Grupo.findById(_id, (err, res) => {
            if (err || !res) {
                return response.status(404).json({})
            }

            return response.json(res)
        })
    },

    async create(request, response) {
        let { admin } = request.body

        //Status do Grupo (A - Aguardando, S - Sorteado, F - Finalizado)
        let statusGrupo = 'A'
        let usuario = admin.usuario

        if (!admin || !admin.usuario) {
            return response.status(400).json({ ...missingInformations, admin: { usuario: "usuario" } })
        }

        admin = await Pessoa.findOne({ usuario: admin.usuario })

        if (!admin) {
            return response.status(404).json({ ...nickNotFound, usuario: usuario })
        }

        let grupo = { ...request.body, admin, statusGrupo, integrantes: admin }
        Grupo.create(grupo, async (err, res) => {
            if (err) {
                return response.status(400).json({ ...validationError, _message: err.message })
            }

            await Pessoa.findOneAndUpdate({ usuario: usuario }, { "$push": { "grupos": res } })

            return response.send(res)
        })
    },

    edit(request, response) {
        let { _id } = request.body

        if (!_id) {
            return response.status(400).json({ ...missingInformations, _id: "ID" })
        }

        Grupo.findByIdAndUpdate(_id, request.body, { new: true }, (err, res) => {
            if (err) {
                return response.status(400).json({ ...generic, _message: err.message })
            }
            else if (!res) {
                return response.status(404).json({ ...userNotFound, _id: _id })
            }

            return response.send(res)
        })
    },

    delete(request, response) {
        let { _id } = request.params

        Grupo.findByIdAndDelete(_id, async (err, res) => {
            if (err) {
                return response.status(400).json({ ...missingInformations, _id: "ID", _message: err.message })
            }

            if (!res) {
                return response.status(404).json({})
            }

            await Pessoa.updateMany({}, { "$pull": { "grupos": { "_id": _id } } })

            response.send()
        })
    },

    async addNewMember(request, response) {
        let { _idGroup, usuario } = request.params

        const member = await Pessoa.findOne({ usuario: usuario })

        if (!member) {
            return response.status(404).json({ ...nickNotFound, usuario: usuario })
        }

        const isAlreadyMember = await Grupo.findOne({ _id: _idGroup, integrantes: { "$elemMatch": { "usuario": usuario } } })

        if (!isAlreadyMember || isAlreadyMember.length === 0) {
            Grupo.findByIdAndUpdate(_idGroup, { "$push": { "integrantes": member } }, { new: true }, async (err, res) => {

                if (err) {
                    return response.status(400).json({ ...generic, _message: err.message })
                }

                if (!res) {
                    return response.status(404).json({ ...groupNotFound, _id: _idGroup })
                }

                await Pessoa.findOneAndUpdate({ usuario: usuario }, { "$push": { "grupos": res } })

                return response.send(res)
            })
        }
        else {
            return response.status(400).json({ ...alreadyGroupMember, _idGroup: _idGroup, usuario: member.usuario })
        }
    },

    async removeMember(request, response) {
        let { _idGroup, usuario } = request.params

        const member = await Pessoa.findOne({ usuario: usuario })

        if (!member) {
            return response.status(404).json({ ...nickNotFound, usuario: usuario })
        }

        const Group = await Grupo.findOne({ _id: _idGroup, integrantes: { "$elemMatch": { "usuario": usuario } } })

        if (!Group) {
            return response.status(404).json({ ...notGroupMember, usuario: usuario })
        }

        if (Group.admin.usuario === member.usuario) {
            return response.status(400).json({ ...removeAdmin })
        }


        Grupo.findOneAndUpdate({ _id: _idGroup }, { "$pull": { integrantes: { usuario: usuario } } }, { new: true }, async (err, res) => {

            if (err) {
                return response.send(500).json({ ...generic, _message: err.message })
            }

            await Pessoa.findOneAndUpdate({ usuario: usuario }, { "$pull": { "grupos": { "_id": _idGroup } } }, { new: true })

            return response.send(res)
        })
    },

    async draw(request, response) {

        let { _idGroup } = request.params

        const Group = await Grupo.aggregate([
            {
                "$match": {
                    _id: mongoose.Types.ObjectId(_idGroup)
                }
            },
            {
                "$project": {
                    statusGrupo: 1,
                    nome: 1,
                    integrantes: 1,
                    dataSorteio: 1
                }
            }
        ])

        if (!Group || Group.length === 0) {
            return response.status(404).json({ ...groupNotFound, _id: _idGroup })
        }

        //aggregate retorna sempre uma lista
        let grupo = Group[0]

        //Status do Grupo (A - Aguardando, S - Sorteado, F - Finalizado)
        if (grupo.statusGrupo !== "A") {
            return response.status(400).json({ ...alreadyDraw })
        }

        const listaSorteio = draw(grupo.integrantes)

        grupo.integrantes.forEach(integrante => {
            let itemAmigoOculto = listaSorteio.find(item => item.apelido === integrante.apelido)
            let objetoAmigoOculto = grupo.integrantes.find(user => user.apelido === itemAmigoOculto.amigoOculto)

            integrante.amigoChocolate = {
                _id: objetoAmigoOculto._id,
                nome: objetoAmigoOculto.nome,
                email: objetoAmigoOculto.email,
                dataNascimento: objetoAmigoOculto.dataNascimento,
                apelido: objetoAmigoOculto.apelido,
                descricao: objetoAmigoOculto.descricao,
                desejos: objetoAmigoOculto.desejos
            }
        });

        grupo.statusGrupo = "S"
        grupo.dataSorteio = new Date()

        Grupo.findByIdAndUpdate(grupo._id, grupo, { new: true }, (err, res) => {

            if (err) {
                return response.status(400).json({ ...generic, _message: err.message })
            }

            return response.send(res)
        })
    }
}