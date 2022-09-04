import mongoose from 'mongoose'
import { IStudent } from '../../types'
import descriptografar from '../../utils/criptografia/descriptografar'
import criptografar from '../../utils/criptografia/criptografar'
import addressSchema from './schemas/address'
import mattersSchema from './schemas/matters'
import paymentsSchema from './schemas/payments'
import photoSchema from './schemas/photo'
import created from '../schemasPatterns/created'

const schema = new mongoose.Schema<IStudent>({
    name: String,
    gender: String,
    birth: String,
    cpf: {
        type: String,
        get: descriptografar,
        set: criptografar,
        select: false
    },
    responsible1: String,
    responsible2: String,
    telephone: String,
    email: String,
    address: {
        type: addressSchema,
        select: false
    },
    matriculation: String,
    class: {
        type: String,
        ref: 'classes'
    },
    teacher: {
        type: String,
        ref: 'teachers'
    },
    situation: String,
    observation: String,
    matters: {
        type: mattersSchema,
        select: false
    },
    payments: {
        type: paymentsSchema,
        select: false
    },
    photo: {
        type: photoSchema,
        select: false
    },
    created
})

const studentsModel = mongoose.model('students', schema)

export default studentsModel