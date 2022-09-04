import express, { Request } from 'express'
import multer from 'multer'
import { photoConfig } from '../../config/multer'
import studentsModel from '../../models/student'
import mongoose from 'mongoose'
import deleteStudent from '../../services/deleteStudent'
import classesModel from '../../models/class'
import probe from 'probe-image-size'
import { IStudent } from '../../types'
import { S3 } from '@aws-sdk/client-s3'
import documentsRouter from './documents'
// import documentsRouter from './documents'
// import fotosRouter from './fotos'
// import mattersRouter from './matters'

const studentsRouter = express.Router()
const photoUpload = multer(photoConfig)
const aws = new S3({})

studentsRouter.use('/documents', documentsRouter)
// alunos.use('/fotos', fotosRouter)
// alunos.use('/matters', mattersRouter)

studentsRouter.get('/', async (req: Request<{}, {}, {}, {
    count: (string | undefined)
    class: (string | undefined)
    teacher: (string | undefined)
    payments: (string | undefined)
    matters: (string | undefined)
    photo: (string | undefined)
    address: (string | undefined)
    classID: (string | undefined)
    teacherID: (string | undefined)
}>, res) => {
    const { count, class: classShow, teacher, payments, matters, photo, address, classID, teacherID } = req.query

    if (count !== 'false' && count) {
        const studentsCount = await studentsModel.estimatedDocumentCount()

        res.json({count: studentsCount})
    } else {
        let queryFilter = {} as IStudent

        if (classID !== 'false' && classID) {
            queryFilter.class = classID
        }

        if (teacherID !== 'false' && teacherID) {
            queryFilter.teacher = teacherID
        }

        const students = studentsModel.find(queryFilter)

        if ((payments !== 'false' && payments) || (matters !== 'false' && matters) || (photo !== 'false' && photo) || (address !== 'false' && address)) {
            let selects = []

            payments !== 'false' && payments && selects.push('+payments')
            matters !== 'false' && matters && selects.push('+matters')
            photo !== 'false' && photo && selects.push('+photo')
            address !== 'false' && address && selects.push('+address')
            
            students.select(selects)
        }

        classShow !== 'false' && classShow && students.populate('class')

        teacher !== 'false' && teacher && students.populate('teacher')
        
        res.json(await students)
    }
})

studentsRouter.get('/:id', async (req: Request<{ id: string }, {}, {}, {
    class: (string | undefined)
    teacher: (string | undefined)
    payments: (string | undefined)
    matters: (string | undefined)
    photo: (string | undefined)
    address: (string | undefined)
}>, res) => {
    const { id } = req.params
    const { class: classShow, teacher, payments, matters, photo, address } = req.query

    if (mongoose.isValidObjectId(id)) {
        const studentExits = await studentsModel.exists({ _id: id })

        if (studentExits) {
            const student = studentsModel.findById(id)

            if ((payments !== 'false' && payments) || (matters !== 'false' && matters) || (photo !== 'false' && photo) || (address !== 'false' && address)) {
                let selects = []
    
                payments !== 'false' && payments && selects.push('+payments')
                matters !== 'false' && matters && selects.push('+matters')
                photo !== 'false' && photo && selects.push('+photo')
                address !== 'false' && address && selects.push('+address')

                student.select(selects)
            }
    
            classShow !== 'false' && classShow && student.populate('class')
    
            teacher !== 'false' && teacher && student.populate('teacher')

            res.json(await student)
        } else {
            res.json({ exists: false })
        }
    } else {
        res.json({ exists: false })
    }
})

studentsRouter.post('/', photoUpload.single('photo'), async (req: Request<{}, {}, {
    name: string
    gender: string
    birth: string
    cpf: string
    responsible1: string
    responsible2: string
    telephone: string
    email: string
    cep: string
    city: string
    neighborhood: string
    street: string
    number: number
    complement: string
    matriculation: string
    class: string
    situation: string
    observation: string
    created: string
}>, res) => {
    const { name, gender, birth, cpf, responsible1, responsible2, telephone, email, cep, city, complement, neighborhood, number, street, matriculation, class: classID, situation, observation, created } = req.body
    
    if (mongoose.isValidObjectId(classID)) {
        const classSelect = await classesModel.findById(classID).select(['id', 'teacher', 'studentCount'])

        if (classSelect) {
            let photo: IStudent['photo'] = null

            if (req.file) {
                const { location, key, size, originalname, contentType } = req.file as unknown as {           
                    location: string
                    key: string
                    size: number
                    originalname: string
                    contentType: string
                }
                const { width, height } = await probe(location)

                photo = {
                    width,
                    height,
                    key,
                    name: originalname,
                    size: Number((size/(1024*1024)).toFixed(2)),
                    mimeType: contentType,
                    url: location
                }
            }
            
            await studentsModel.create({
                name,
                gender,
                birth,
                cpf,
                responsible1,
                responsible2,
                telephone,
                email,
                address: {
                    cep,
                    number,
                    complement,
                    neighborhood,
                    city,
                    street
                },
                matriculation,
                class: classSelect.id,
                teacher: classSelect.teacher,
                situation,
                observation,
                photo,
                matters: {},
                payments: {}
            } as IStudent)

            classSelect.studentCount++

            await classSelect.save()

            res.json({ created: true })
        } else {
            res.json({error: 'Essa turma não existe'})
        }
    } else {
        res.json({error: 'Essa turma não existe'})
    }
})

studentsRouter.delete('/', async (req, res) => {
    const students = await studentsModel.find().select('id')
    
    students.map(async student => await deleteStudent(student.id))

    res.json({ deleted: true })
})

studentsRouter.delete('/:id', async (req: Request<{ id: string }>, res) => {
    try {
        await deleteStudent(req.params.id)

        res.json({ deleted: true })
    } catch {
        res.json({ exists: false })
    }
})

studentsRouter.patch('/:id', async (req: Request<{ id: string }, {}, {
    name: string
    gender: string
    birth: string
    cpf: string
    responsible1: string
    responsible2: string
    telephone: string
    email: string
    address: IStudent['address']
    matriculation: string
    class: string
    situation: string
    observation: string
    matters: IStudent['matters']
    payments: IStudent['payments']
}>, res) => {
    const { id: idStudent } = req.params

    if (mongoose.isValidObjectId(idStudent)) {
        const student = await studentsModel.findById(idStudent).select(['id', 'class'])

        if (student) {
            const { name, address, birth, class: classID, cpf, email, gender, matriculation, matters, observation, payments, responsible1, responsible2, situation, telephone } = req.body

            if (classID && classID != student.class) {
                const classNew = await classesModel.findById(classID).select(['studentCount', 'teacher'])

                if (classNew) {
                    classNew.studentCount++

                    await classNew.save()
                    
                    const classOld = await classesModel.findById(student.class).select('studentCount')

                    classOld.studentCount--
    
                    await classOld.save()
    
                    await student.updateOne({
                        name,
                        address,
                        birth,
                        cpf,
                        email,
                        gender,
                        matriculation,
                        matters,
                        observation,
                        payments,
                        responsible1,
                        responsible2,
                        situation,
                        telephone,
                        class: classNew.id,
                        teacher: classNew.teacher
                    })
    
                    res.json({ edited: true })
                } else {
                    res.json({ classNotExists: true })
                }
            } else {
                await student.updateOne({
                    name,
                    address,
                    birth,
                    cpf,
                    email,
                    gender,
                    matriculation,
                    matters,
                    observation,
                    payments,
                    responsible1,
                    responsible2,
                    situation,
                    telephone
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

studentsRouter.patch('/:id/photo', photoUpload.single('photo'), async (req: Request<{ id: string }>, res) => {
    const { id } = req.params

    if (mongoose.isValidObjectId(id)) {
        const student = await studentsModel.findById(id).select(['id', 'photo'])
        
        if (student) {
            if (student.photo.url.includes('s3')) {
                await aws.deleteObject({
                    Key: student.photo.key,
                    Bucket: process.env.AWS_NAME_BUCKET
                })
            }

            if (req.file) {
                const { location, key, size, originalname, contentType } = req.file as unknown as {           
                    location: string
                    key: string
                    size: number
                    originalname: string
                    contentType: string
                }
    
                const { width, height } = await probe(location)
    
                student.photo = {
                    width,
                    height,
                    key,
                    name: originalname,
                    size: Number((size/(1024*1024)).toFixed(2)),
                    mimeType: contentType,
                    url: location
                }
            } else {
                student.photo = {
                    width: undefined,
                    height: undefined,
                    key: undefined,
                    name: undefined,
                    size: undefined,
                    mimeType: undefined,
                    url: undefined
                }
            }

            await student.save()
    
            res.json({ edited: true })
        } else {
            res.json({ exists: false })
        }
    } else {
        res.json({ exists: false })
    }
})

export default studentsRouter