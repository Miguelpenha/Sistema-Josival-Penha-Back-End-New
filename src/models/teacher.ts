import mongoose from 'mongoose'
import { ITeacher } from '../types'
import criptografar from '../utils/criptografia/criptografar'
import descriptografar from '../utils/criptografia/descriptografar'
import created from './schemasPatterns/created'

const schema = new mongoose.Schema<ITeacher>({
    name: String,
    gender: String,
    login: {
        type: String,
        get: descriptografar,
        set: criptografar,
        select: false
    },
    password: {
        type: String,
        get: descriptografar,
        set: criptografar,
        select: false
    },
    classCount: {
        type: Number,
        default: 0
    },
    created
})

const teachersModel = mongoose.model('teachers', schema)

export default teachersModel