const mongoose = require('mongoose')
const criptografar = require('../utils/criptografia/criptografar')
const descriptografar = require('../utils/criptografia/descriptografar')

const schema = new mongoose.Schema({
    nome: String,
    sexo: String,
    nascimento: String,
    cpf: {
        type: String,
        get: descriptografar,
        set: criptografar
    },
    responsável1: String,
    responsável2: String,
    telefone: String,
    email: String,
    endereço: {
        cep: String,
        cidade: String,
        bairro: String,
        rua: String,
        número: String,
        complemento: String
    },
    matrícula: String,
    turma: String,
    professora: String,
    situação: String,
    observação: String,
    matérias: {
        português: {
            primeira: Number,
            segunda: Number,
            terceira: Number,
            quarta: Number
        },
        inglês: {
            primeira: Number,
            segunda: Number,
            terceira: Number,
            quarta: Number
        },
        matemática: {
            primeira: Number,
            segunda: Number,
            terceira: Number,
            quarta: Number
        },
        história: {
            primeira: Number,
            segunda: Number,
            terceira: Number,
            quarta: Number
        },
        artes: {
            primeira: Number,
            segunda: Number,
            terceira: Number,
            quarta: Number
        },
        ciências: {
            primeira: Number,
            segunda: Number,
            terceira: Number,
            quarta: Number
        },
        geografia: {
            primeira: Number,
            segunda: Number,
            terceira: Number,
            quarta: Number
        },
        religião: {
            primeira: Number,
            segunda: Number,
            terceira: Number,
            quarta: Number
        },
        educaçãoFísica: {
            primeira: Number,
            segunda: Number,
            terceira: Number,
            quarta: Number
        }
    },
    pagamentos: {
        '01': {
            valueBruto: Number,
            value: String,
            pago: Boolean,
            vencimento: String,
            vencimentoSistema: Date,
            descrição: String,
            forma: String
        },
        '02': {
            valueBruto: Number,
            value: String,
            pago: Boolean,
            vencimento: String,
            vencimentoSistema: Date,
            descrição: String,
            forma: String
        },
        '03': {
            valueBruto: Number,
            value: String,
            pago: Boolean,
            vencimento: String,
            vencimentoSistema: Date,
            descrição: String,
            forma: String
        },
        '04': {
            valueBruto: Number,
            value: String,
            pago: Boolean,
            vencimento: String,
            vencimentoSistema: Date,
            descrição: String,
            forma: String
        },
        '05': {
            valueBruto: Number,
            value: String,
            pago: Boolean,
            vencimento: String,
            vencimentoSistema: Date,
            descrição: String,
            forma: String
        },
        '06': {
            valueBruto: Number,
            value: String,
            pago: Boolean,
            vencimento: String,
            vencimentoSistema: Date,
            descrição: String,
            forma: String
        },
        '07': {
            valueBruto: Number,
            value: String,
            pago: Boolean,
            vencimento: String,
            vencimentoSistema: Date,
            descrição: String,
            forma: String
        },
        '08': {
            valueBruto: Number,
            value: String,
            pago: Boolean,
            vencimento: String,
            vencimentoSistema: Date,
            descrição: String,
            forma: String
        },
        '09': {
            valueBruto: Number,
            value: String,
            pago: Boolean,
            vencimento: String,
            vencimentoSistema: Date,
            descrição: String,
            forma: String
        },
        '10': {
            valueBruto: Number,
            value: String,
            pago: Boolean,
            vencimento: String,
            vencimentoSistema: Date,
            descrição: String,
            forma: String
        },
        '11': {
            valueBruto: Number,
            value: String,
            pago: Boolean,
            vencimento: String,
            vencimentoSistema: Date,
            descrição: String,
            forma: String
        },
        '12': {
            valueBruto: Number,
            value: String,
            pago: Boolean,
            vencimento: String,
            vencimentoSistema: Date,
            descrição: String,
            forma: String
        }
    },
    foto: {
        nome: String,
        key: String,
        tamanho: String,
        tipo: String,
        url: String,
        width: Number,
        height: Number
    },
    criação: {
        data: String,
        hora: String,
        sistema: Date
    }
}, {
    toJSON: {
        getters: true
    }
})

const alunosModels = mongoose.model('alunos', schema)

module.exports = alunosModels