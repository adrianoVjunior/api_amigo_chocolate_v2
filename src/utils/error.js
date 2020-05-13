module.exports = {
    generic: {
        success: false,
        message: "Não sabemos o que aconteceu, mas houve um erro...",
        _message: "..."
    },

    missingInformations: {
        success: false,
        message: "Alguma(s) informação(ões) necessária(s) não está(ão) presente(s) na requisição."
    },

    validationError: {
        success: false,
        message: "Erro de validação das informações presentes no corpo da requisição.",
        _message: "..."
    },

    invalidUsuario: {
        success: false,
        message: "O usuario informado já existe."
    },

    addFriendError: {
        success: false,
        _message: "...",
        message: "As informações de usuário estão corretas, porém houve um erro ao adicionar amigo.",
        My_id: "...",
        Friend_id: "..."
    },

    alreadyGroupMember: {
        success: false,
        message: "Já é um membro deste grupo."
    },

    alreadyFriend: {
        success: false,
        message: "Vocês já são amigos.",
    },

    groupNotFound: {
        success: false,
        message: "O grupo informado não foi encontrado."
    },
    
    userNotFound: {
        success: false,
        message: "O usuário não foi encontrado."
    },

    nickNotFound: {
        success: false,
        message: "Um apelido informado não foi encontrado."
    },

    notGroupMember: {
        success: false,
        message: "Não é um membro do grupo."
    },

    removeAdmin: {
        success: false,
        message: "Não é possível remover o administrador do grupo."
    },

    alreadyDraw: {
        success: false,
        message: "O sorteio já foi realizado."
    }
}

