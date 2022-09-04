import mongoose from 'mongoose'
import { IClass } from '../types'
import created from './schemasPatterns/created'

const schema = new mongoose.Schema<IClass>({
    name: String,
    grade: String,
    shift: String,
    teacher: {
        type: String,
        ref: 'teachers'
    },
    studentCount: {
        type: Number,
        default: 0
    },
    created
})

const classesModel = mongoose.model('classes', schema)

export default classesModel