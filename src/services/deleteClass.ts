import mongoose from 'mongoose'
import classesModel from '../models/class'
import studentsModel from '../models/student'
import teachersModel from '../models/teacher'
import deleteStudent from './deleteStudent'

async function deleteClass(id: string) {
    if (mongoose.isValidObjectId(id)) {
        const classDelete = await classesModel.findById(id).select(['teacher', 'studentCount'])

        if (classDelete) {
            const teacher = await teachersModel.findById(classDelete.teacher).select('classCount')
            
            if (teacher) {
                teacher.classCount--

                await teacher.save()
            }
            
            if (classDelete.studentCount >= 1) {
                const students = await studentsModel.find({ class: classDelete.id }).select('_id')
                
                students.map(async student => await deleteStudent(student.id))

                return true
            }

            classDelete.deleteOne()
        } else {
            throw new Error("Class doesn't exist")
        }
    } else {
        throw new Error("Class doesn't exist")
    }
}

export default deleteClass