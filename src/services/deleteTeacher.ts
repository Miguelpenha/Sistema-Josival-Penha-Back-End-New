import mongoose from 'mongoose'
import teachersModel from '../models/teacher'
import classesModel from '../models/class'
import deleteClass from './deleteClass'

async function deleteTeacher(id: string) {
    if (mongoose.isValidObjectId(id)) {
        const teacher = await teachersModel.findById(id).select('classCount')

        if (teacher) {
            if (teacher.classCount >= 1) {
                const classes = await classesModel.find({ teacher: teacher.id }).select('_id')
                
                classes.map(async classDelete => await deleteClass(classDelete.id))

                return true
            }

            teacher.deleteOne()
        } else {
            throw new Error("Teacher doesn't exist")
        }
    } else {
        throw new Error("Teacher doesn't exist")
    }
}

export default deleteTeacher