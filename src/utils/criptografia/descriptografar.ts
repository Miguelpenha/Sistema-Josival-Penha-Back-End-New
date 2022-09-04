import crypto from 'crypto'

function descriptografar(dado: string) {
    if (dado) {
        const iv = Buffer.from(dado.split(':')[1], 'hex')
        const tag = Buffer.from(dado.split(':')[2], 'hex')
        const decipher = crypto.createDecipheriv('aes-256-gcm', process.env.SECRET_KEY_CRYPTO, iv)

        decipher.setAuthTag(tag)

        let dec = decipher.update(dado.split(':')[0], 'hex', 'utf8')
        
        dec += decipher.final('utf8')

        return String(dec)
    } else {
        return undefined
    }
}

export default descriptografar