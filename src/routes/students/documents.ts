import express, { Request } from 'express'
import mongoose from 'mongoose'
import studentsModel from '../../models/student'
import PDFDocument from 'pdfkit'
import path from 'path'
import { IClass } from '../../types'

const documentsRouter = express.Router()

documentsRouter.post('/declaration', async (req: Request<{}, {}, {
    id: string
    frequency?: number
    scholarship?: boolean
}>, res) => {
    const { id, frequency, scholarship } = req.body

    if (mongoose.isValidObjectId(id)) {
        const student = await studentsModel.findById(id).select(['name', 'birth', 'responsible1', 'responsible2']).populate('class')
        
        if (student) {
            const { grade: schoolYear } = student.class as unknown as IClass
            const doc = new PDFDocument({size: 'A4', margin: 60, lang: 'pt-br', displayTitle: true, info: {
                Title: `Declaração de frequência do aluno(a) ${student.name}`,
                CreationDate: new Date(),
                Author: 'Sistema Josival Penha',
                Creator: 'Sistema Josival Penha',
                ModDate: new Date(),
                Producer: 'Sistema Josival Penha'
            }})

            const chunks = []

            doc.on('data', chunks.push.bind(chunks))

            doc
            .opacity(0.15)
            .image(path.resolve(__dirname, '..', '..', '..', 'public', 'logo-josival-penha.png'), 150, 300, {
                width: 300
            })
            .opacity(1)
            .image(path.resolve(__dirname, '..', '..', '..', 'public', 'logo-josival-penha.png'), 250, 79, {
                width: 90
            })
            .font('Helvetica-Bold')
            .moveDown(8.4)
            .text('Instituto Educacional Josival Penha', {
                align: 'center'
            })
            .font('Helvetica')
            .moveDown(0.4)
            .text('Cadastro Escolar nº P. 109.212 / INEP nº 26170981', {
                align: 'center'
            })
            .moveDown(0.4)
            .text('Portaria SEE nº 888 D.O 18/02/2003', {
                align: 'center'
            })
            .moveDown(0.4)
            .text('CNPJ: 11.654.198/0001-43', {
                align: 'center'
            })
            .fontSize(20)
            .moveDown(2)
            .font('Helvetica-Bold')
            .text('DECLARAÇÃO', {
                align: 'center'
            })
            .font('Helvetica')
            .fontSize(13)
            .moveDown(3)
            .text(`Paulista, ${new Date().toLocaleDateString().split('/')[0]} de ${new Date().toLocaleDateString().split('/')[1]} de ${new Date().toLocaleDateString().split('/')[2]}`, {
                align: 'right'
            })
            .moveDown(2)
            .text('Declaramos para os devidos fins que a aluno(a) ', {
                continued: true,
                align: 'justify'
            })
            .font('Helvetica-Bold')
            .text(student.name, {
                continued: true,
                align: 'left'
            })
            .font('Helvetica')
            .text(', nascido(a) em: ', {
                continued: true,
                align: 'justify'
            })
            .font('Helvetica-Bold')
            .text(student.birth, {
                continued: true,
                align: 'left'
            })
            .font('Helvetica')
            .text(', filho(a) de ', {
                continued: true,
                align: 'justify'
            })
            .font('Helvetica-Bold')
            .text(student.responsible1, {
                continued: true,
                align: 'left'
            })
            .font('Helvetica')
            .text(' e ', {
                continued: true,
                align: 'justify'
            })
            .font('Helvetica-Bold')
            .text(student.responsible2, {
                continued: true,
                align: 'left'
            })
            .font('Helvetica')
            .text(`, matriculado(a) neste estabelecimento de Ensino no ${schoolYear} do Ensino Fundamental.`, {
                align: 'left'
            })
            .moveDown(1.5)
            
            if (scholarship) {
                doc
                .text(`Aluno(a) bolsista`)
                .moveDown(0.5)
            }
            
            doc
            .text(`Tem frequência de ${frequency || 98}% dos dias letivos`)
            .moveDown(6.2)
            .fontSize(12)
            .text('__________________________________', {
                align: 'center'
            })
            .fontSize(14)
            .moveDown(0.4)
            .text('Diretora', {
                align: 'center'
            })
            .font('Helvetica-Bold')
            .fontSize(11)
            .text('tel. (81) 3437-2618', 100, 752)
            .text('Av. João Paulo II, 894', 240, 751)
            .text('www.josivalpenha.com', 385, 750)
            .text('cel. (81) 99499-7501', 100, 768)
            .text('Mirueira, Paulista - PE', 240, 767)
            .text('@josival.penha', 385, 766)

            doc.on('end', () => {
                res
                .contentType('application/pdf')
                .setHeader('Content-disposition', `attachment; filename=Declaração de frequência do aluno(a) ${student.name}.pdf`)
                .setHeader('Content-Length', Buffer.byteLength(Buffer.concat(chunks)))
                .end(Buffer.concat(chunks))
            })

            doc.end()
        } else {
            res.json({ exists: false })
        }
    } else {
        res.json({ exists: false })
    }
})

export default documentsRouter