import express, { Request } from 'express'
import teachersModel from '../models/teacher'
import mongoose from 'mongoose'
import { hash, compare } from 'bcryptjs'
import { ITeacher } from '../types'
import deleteTeacher from '../services/deleteTeacher'
import { sign, verify, decode } from 'jsonwebtoken'

const teachersRouter = express.Router()

teachersRouter.get('/', async (req: Request<{}, {}, {}, {
    count: (string | undefined)
}>, res) => {
    const { count } = req.query

    if (count !== 'false' && count) {
        const teachersCount = await teachersModel.estimatedDocumentCount()

        res.json({ count: teachersCount })
    } else {
        const teachers = await teachersModel.find()

        res.json(teachers)
    }
})

teachersRouter.get('/:id', async(req: Request<{ id: string }>, res) => {
    const { id } = req.params

    if (mongoose.isValidObjectId(id)) {
        const teacher = await teachersModel.findById(id)

        if (teacher) {
            res.json(teacher)
        } else {
            res.json({ exists: false })
        }
    } else {
        res.json({ exists: false })
    }
})

teachersRouter.post('/', async (req: Request<{}, {}, {
    name: string
    gender: string
    login: string
    password: string
    created: string
}>, res) => {
    const { name, gender, login, password, created } = req.body
    const teacherIsExists = await teachersModel.findOne({ name }).select('id')
    
    if (teacherIsExists) {
        res.status(400).json({message: 'Já existe uma professora cadastrada com esse nome'})
    } else {   
        await teachersModel.create({
            name,
            gender,
            login,
            password: await hash(password, 10)
        } as ITeacher)
        
        res.json({created: true})
    }
})

teachersRouter.delete('/', async (req, res) => {
    const teachers = await teachersModel.find().select('id')
    
    teachers.map(async teacher => await deleteTeacher(teacher.id))

    res.json({ deleted: true })
})

teachersRouter.delete('/:id', async (req: Request<{ id: string }>, res) => {
    try {
        await deleteTeacher(req.params.id)

        res.json({ deleted: true })
    } catch {
        res.json({ exists: false })
    }
})

teachersRouter.patch('/:id', async (req: Request<{ id: string }, {}, {
    name: string
    gender: string
    login: string
    password: string
}>, res) => {
    const { id: idTeacher } = req.params

    if (mongoose.isValidObjectId(idTeacher)) {
        const teacher = await teachersModel.findById(idTeacher).select('id')

        if (teacher) {
            const { name, gender, login, password } = req.body

            await teacher.updateOne({
                name,
                gender,
                login,
                password: password && await hash(password, 10)
            })

            res.json({ edited: true })
        } else {
            res.json({ exists: false })
        }
    } else {
        res.json({ exists: false })
    }
})

teachersRouter.post('/login', async (req: Request<{}, {}, {
    id: string
    login: string
    password: string
}>, res) => {
    const { id, login, password } = req.body

    if (mongoose.isValidObjectId(id)) {
        const teacher = await teachersModel.findById(id).select(['password', 'login'])
        
        if (teacher.login === login) {
            if (await compare(password, teacher.password)) {
                const token = sign({}, process.env.SECRET_JWT, {
                    subject: teacher.id,
                    expiresIn: '20s'
                })
                
                res.json({ authenticated: true, token })
            } else {
                res.json({ authenticated: false })
            }
        } else {
            res.json({ authenticated: false })
        }
    } else {
        res.json({ exists: false })
    }
})

teachersRouter.post('/validation-token', async (req: Request<{}, {}, {
    token: string
}>, res) => {
    const { token } = req.body
    
    try {
        verify(token, process.env.SECRET_JWT)

        const teacher = await teachersModel.findById(decode(token).sub).select('id')

        if (teacher) {
            res.json({ teacherId: teacher.id })
        } else {
            res.json({ notExists: true })
        }
    } catch {
        try {
            const teacher = await teachersModel.findById(decode(token).sub).select('id')

            if (teacher) {
                const newToken = sign({}, process.env.SECRET_JWT, {
                    subject: teacher.id,
                    expiresIn: '20s'
                })

                res.json({ expiredToken: true, newToken })
            } else {
                res.json({ notExists: true })
            }
        } catch {
            res.status(400)
            res.json('Token inválido')
        }
    }
})

export default teachersRouter