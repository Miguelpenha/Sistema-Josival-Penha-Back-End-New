import path from 'path'
import { greenBright as success } from 'chalk'

const pathPublicFolder = path.resolve(__dirname, '..', '..', 'public')

console.log(success('>> Pasta public sendo usada'))
console.log(success(`   >> ${pathPublicFolder}`))

export default pathPublicFolder