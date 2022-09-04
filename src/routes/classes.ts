import express, { Request } from 'express'
import classesModel from '../models/class'
import mongoose from 'mongoose'
import teachersModel from '../models/teacher'
import { IClass } from '../types'
import deleteClass from '../services/deleteClass'

const classesRouter = express.Router()

classesRouter.get('/', async (req: Request<{}, {}, {}, {
    count: (string | undefined)
    teacher: (string | undefined)
    teacherId: (string | undefined)
}>, res) => {
    const { count, teacher, teacherId } = req.query

    if (count !== 'false' && count) {
        res.json({count: await classesModel.estimatedDocumentCount()})
    } else {
        let queryClasses = {} as IClass

        if (teacherId && mongoose.isValidObjectId(teacherId)) {
            const teacherIsExist = await teachersModel.exists({ _id: teacherId })

            if (teacherIsExist) {
                queryClasses.teacher = teacherId
            }
        }

        const classes = classesModel.find(queryClasses)

        teacher !== 'false' && teacher && classes.populate('teacher')

        res.json(await classes)
    }
})

classesRouter.get('/:id', async(req: Request<{ id: string }, {}, {}, {
    teacher: (string | undefined)
}>, res) => {
    const { id } = req.params
    const { teacher } = req.query

    if (mongoose.isValidObjectId(id)) {
        const classSelect = classesModel.findById(id)

        teacher !== 'false' && teacher && classSelect.populate('teacher')

        const classIsExist= await classSelect

        if (classIsExist) {
            res.json(classIsExist)
        } else {
            res.json({ exists: false })
        }
    } else {
        res.json({ exists: false })
    }
})

classesRouter.post('/', async (req: Request<{}, {}, {
    name: string
    grade: string
    shift: string
    teacher: string
    created: string
}>, res) => {
    const { name, grade, shift, teacher: teacherId, created } = req.body
    const classIsExists = await classesModel.exists({ name })
    
    if (classIsExists) {
        res.status(400).json({message: 'Já existe uma turma cadastrada com esse nome'})
    } else {
        if (mongoose.isValidObjectId(teacherId)) {
            const teacher = await teachersModel.findById(teacherId).select(['id', 'classCount'])
            
            if (teacher) {
                await classesModel.create({
                    name,
                    grade,
                    shift,
                    teacher: teacherId
                } as IClass)

                teacher.classCount++
                
                await teacher.save()
                
                res.json({ created: true })
            } else {
                res.json({ teacherNotExists: true })
            }
        } else {
            res.json({ teacherNotExists: true })
        }
    }
})

classesRouter.delete('/', async (req, res) => {
    const classes = await classesModel.find().select('id')
    
    classes.map(async classDelete => await deleteClass(classDelete.id))

    res.json({ deleted: true })
})

classesRouter.delete('/:id', async (req: Request<{ id: string }>, res) => {
    try {
        await deleteClass(req.params.id)

        res.json({ deleted: true })
    } catch {
        res.json({ exists: false })
    }
})

classesRouter.patch('/:id', async (req: Request<{ id: string }, {}, {
    name: string
    grade: string
    shift: string
    teacher: string
}>, res) => {
    const { id: idClass } = req.params

    if (mongoose.isValidObjectId(idClass)) {
        const classEdit = await classesModel.findById(idClass).select(['id', 'teacher'])

        if (classEdit) {
            const { name, grade, shift, teacher: teacherId } = req.body

            if (teacherId && teacherId != classEdit.id) {
                const teacherNew = await teachersModel.findById(teacherId).select('classCount')

                if (teacherNew) {
                    teacherNew.classCount++

                    await teacherNew.save()

                    const teacherOld = await teachersModel.findById(classEdit.teacher).select('classCount')

                    teacherOld.classCount--
    
                    await teacherOld.save()
    
                    await classEdit.updateOne({
                        name,
                        grade,
                        shift,
                        teacher: teacherId
                    })
    
                    res.json({ edited: true })
                } else {
                    res.json({ teacherNotExists: true })
                }
            } else {
                await classEdit.updateOne({
                    name,
                    grade,
                    shift
                })

                res.json({ edited: true })
            }
        } else {
            res.json({ exists: false })
        }
    } else {
        res.json({ exists: false })
    }
})

export default classesRouter