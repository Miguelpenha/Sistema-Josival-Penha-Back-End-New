import express from 'express'
import middlewareAPI from '../middlewares/middlewareAPI'
import teachersRouter from './teachers'
import classesRouter from './classes'
import studentsRouter from './students'
import cepPromise from 'cep-promise'
// const administrativoRouter = require('./administrativo')
// const alunosRouter = require('./alunos')
// const financeiroRouter = require('./financeiro')
// const emailsRouter = require('./emails')
// const notificationsRouter = require('./notifications')
// const problemasRouter = require('./problemas')
// const pagamentosRouter = require('./pagamentos')

const routes = express.Router()

routes.use(middlewareAPI)
routes.use('/teachers', teachersRouter)
routes.use('/classes', classesRouter)
routes.use('/students', studentsRouter)
// api.use('/administrativo', administrativoRouter)
// api.use('/financeiro', financeiroRouter)
// api.use('/emails', emailsRouter)
// api.use('/notifications', notificationsRouter)
// api.use('/problemas', problemasRouter)
// api.use('/pagamentos', pagamentosRouter)

routes.get('/cep/:cep', async (req, res) => {
    const { city, neighborhood, street } = await cepPromise(String(req.params.cep))
    
    res.json({
        city,
        neighborhood,
        street
    })
})

export default routes