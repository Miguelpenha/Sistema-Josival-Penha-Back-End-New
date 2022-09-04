import fs from 'fs'
import path from 'path'

const photo = {
    name: {
        type: String,
        default: 'Padrão.jpg'
    },
    key: {
        type: String,
        default: 'Padrão.jpg'
    },
    size: {
        type: Number,
        default: () => Number((fs.statSync(path.resolve(__dirname, '..', '..', '..', '..', 'public', 'Padrão.jpg')).size/(1024*1024)).toFixed(2))
    },
    mimeType: {
        type: String,
        default: 'image/jpeg'
    },
    url: {
        type: String,
        default: `${process.env.DOMINIO}/public/Padrão.jpg`
    },
    width: {
        type: Number,
        default: 500
    },
    height: {
        type: Number,
        default: 500
    }
}

export default photo