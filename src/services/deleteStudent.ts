import mongoose from 'mongoose'
import studentsModel from '../models/student'
import classesModel from '../models/class'

async function deleteStudent(id: string) {
    if (mongoose.isValidObjectId(id)) {
        const student = await studentsModel.findById(id).select('class')
        
        if (student) {
            const classEdit = await classesModel.findById(student.class).select('studentCount')

            await classesModel.findByIdAndUpdate(classEdit._id, {
                studentCount: classEdit.studentCount--
            })

            student.deleteOne()
        } else {
            throw new Error("Student doesn't exist")
        }
    } else {
        throw new Error("Student doesn't exist")
    }
}

export default deleteStudent